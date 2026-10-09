import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdirSync, readFileSync, renameSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { seedProducts } from "./seed";
import type { Product } from "./products";

// A small JSON-file database. Fine for a single server; swap for Postgres/MySQL before scaling out.

export type Role = "customer" | "admin";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  passwordHash: string;
  createdAt: string;
};

export type PublicUser = Omit<UserRecord, "passwordHash">;

export const ORDER_STATUSES = ["Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderItem = { slug: string; name: string; image: string; size: string; qty: number; price: number };

export type OrderRecord = {
  id: string;
  createdAt: string;
  userId?: string;
  email: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  payment: string;
  address: { name: string; phone: string; line: string; city: string; postal?: string };
  status: OrderStatus;
  note?: string;
};

type Session = { token: string; userId: string; expiresAt: string };

type Data = { products: Product[]; users: UserRecord[]; orders: OrderRecord[]; sessions: Session[] };

const DB_PATH = process.env.NEEND_DB_PATH ?? path.join(process.cwd(), "data", "db.json");
export const UPLOAD_DIR = path.join(path.dirname(DB_PATH), "uploads");

// Keep one copy in memory across hot reloads and requests.
const g = globalThis as unknown as { __neendDb?: Data };

function load(): Data {
  if (g.__neendDb) return g.__neendDb;
  let data: Data;
  if (existsSync(/*turbopackIgnore: true*/ DB_PATH)) {
    data = JSON.parse(readFileSync(/*turbopackIgnore: true*/ DB_PATH, "utf8"));
  } else {
    data = { products: seedProducts, users: [], orders: [], sessions: [] };
  }
  ensureAdmin(data);
  g.__neendDb = data;
  persist();
  return data;
}

function persist() {
  const data = g.__neendDb!;
  mkdirSync(path.dirname(DB_PATH), { recursive: true });
  // Write to a temp file then rename, so a crash never leaves half-written JSON.
  const tmp = DB_PATH + ".tmp";
  writeFileSync(tmp, JSON.stringify(data, null, 2));
  renameSync(tmp, DB_PATH);
}

/** Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD (see .env.local) if none exists. */
function ensureAdmin(data: Data) {
  if (data.users.some((u) => u.role === "admin")) return;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  data.users.push({
    id: newId("u"),
    name: "Admin",
    email: email.toLowerCase(),
    role: "admin",
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  });
}

export const newId = (prefix: string) => prefix + randomBytes(6).toString("hex");

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  const test = scryptSync(password, salt, 64);
  return timingSafeEqual(test, Buffer.from(hash, "hex"));
}

const toPublic = (u: UserRecord): PublicUser => {
  const { passwordHash, ...rest } = u;
  void passwordHash;
  return rest;
};

// ---------- Products ----------

export const listProducts = ({ includeHidden = false } = {}) => load().products.filter((p) => includeHidden || p.active);

export const findProduct = (slug: string) => load().products.find((p) => p.slug === slug);

export function saveProduct(product: Product, originalSlug?: string) {
  const data = load();
  const idx = data.products.findIndex((p) => p.slug === (originalSlug ?? product.slug));
  if (idx === -1) data.products.unshift(product);
  else data.products[idx] = product;
  // Keep pillow-cover links pointing at the renamed product.
  if (originalSlug && originalSlug !== product.slug) {
    data.products.forEach((p) => {
      if (p.match === originalSlug) p.match = product.slug;
    });
  }
  persist();
}

export function removeProduct(slug: string) {
  const data = load();
  data.products = data.products.filter((p) => p.slug !== slug);
  data.products.forEach((p) => {
    if (p.match === slug) p.match = undefined;
  });
  persist();
}

// ---------- Users & sessions ----------

export const listUsers = () => load().users.map(toPublic);

export const findUserByEmail = (email: string) => load().users.find((u) => u.email === email.toLowerCase());

export function createUser(input: { name: string; email: string; phone?: string; password: string }) {
  const data = load();
  const user: UserRecord = {
    id: newId("u"),
    name: input.name,
    email: input.email.toLowerCase(),
    phone: input.phone,
    role: "customer",
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };
  data.users.push(user);
  persist();
  return toPublic(user);
}

export function setUserRole(id: string, role: Role) {
  const user = load().users.find((u) => u.id === id);
  if (!user) return;
  user.role = role;
  persist();
}

const SESSION_DAYS = 30;

export function createSession(userId: string) {
  const data = load();
  const token = randomBytes(32).toString("hex");
  const now = Date.now();
  data.sessions = data.sessions.filter((s) => new Date(s.expiresAt).getTime() > now);
  data.sessions.push({ token, userId, expiresAt: new Date(now + SESSION_DAYS * 864e5).toISOString() });
  persist();
  return { token, maxAge: SESSION_DAYS * 86400 };
}

export function userForSession(token: string | undefined): PublicUser | null {
  if (!token) return null;
  const data = load();
  const s = data.sessions.find((x) => x.token === token && new Date(x.expiresAt).getTime() > Date.now());
  const user = s && data.users.find((u) => u.id === s.userId);
  return user ? toPublic(user) : null;
}

export function deleteSession(token: string) {
  const data = load();
  data.sessions = data.sessions.filter((s) => s.token !== token);
  persist();
}

// ---------- Orders ----------

export const listOrders = () => [...load().orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const findOrder = (id: string) => load().orders.find((o) => o.id.toLowerCase() === id.toLowerCase());

export const ordersForUser = (user: PublicUser) =>
  listOrders().filter((o) => o.userId === user.id || o.email === user.email);

export function createOrder(order: Omit<OrderRecord, "id" | "createdAt" | "status">) {
  const data = load();
  const record: OrderRecord = {
    ...order,
    id: "NE" + Date.now().toString().slice(-6) + randomBytes(1).toString("hex").toUpperCase(),
    createdAt: new Date().toISOString(),
    status: "Confirmed",
  };
  data.orders.push(record);
  for (const it of order.items) {
    const p = data.products.find((x) => x.slug === it.slug);
    if (p) p.stock = Math.max(0, p.stock - it.qty);
  }
  persist();
  return record;
}

export function updateOrder(id: string, patch: Partial<Pick<OrderRecord, "status" | "note">>) {
  const data = load();
  const order = data.orders.find((o) => o.id === id);
  if (!order) return;
  // Cancelling puts the stock back; un-cancelling takes it again.
  if (patch.status && patch.status !== order.status && (patch.status === "Cancelled" || order.status === "Cancelled")) {
    const sign = patch.status === "Cancelled" ? 1 : -1;
    for (const it of order.items) {
      const p = data.products.find((x) => x.slug === it.slug);
      if (p) p.stock = Math.max(0, p.stock + sign * it.qty);
    }
  }
  Object.assign(order, patch);
  persist();
}
