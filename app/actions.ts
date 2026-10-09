"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, currentUser } from "@/lib/auth";
import { createOrder, createSession, createUser, deleteSession, findOrder, findProduct, findUserByEmail, verifyPassword, type OrderItem } from "@/lib/db";
import { PROMO, sizesFor } from "@/lib/products";

export type FormState = { error?: string } | undefined;

const FREE_SHIPPING = 5000;
const SHIPPING_FEE = 250;

async function startSession(userId: string) {
  const { token, maxAge } = createSession(userId);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
}

// Only allow redirects to paths on this site.
const safeNext = (v: FormDataEntryValue | null) => (typeof v === "string" && v.startsWith("/") && !v.startsWith("//") ? v : null);

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const user = findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) return { error: "Email or password is incorrect." };
  await startSession(user.id);
  redirect(safeNext(form.get("next")) ?? (user.role === "admin" ? "/admin" : "/account"));
}

export async function register(_: FormState, form: FormData): Promise<FormState> {
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim() || undefined;
  const password = String(form.get("password") ?? "");
  if (!name) return { error: "Please enter your name." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Please enter a valid email." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (findUserByEmail(email)) return { error: "An account with this email already exists." };
  const user = createUser({ name, email, phone, password });
  await startSession(user.id);
  redirect(safeNext(form.get("next")) ?? "/account");
}

export async function logout() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) deleteSession(token);
  jar.delete(SESSION_COOKIE);
  redirect("/");
}

export type PlacedOrder = { id: string; name: string; phone: string; total: number; payment: string; line: string; city: string };
export type CheckoutState = { error?: string; order?: PlacedOrder } | undefined;

const PAYMENTS: Record<string, string> = { cod: "Cash on delivery", bank: "Bank transfer", wallet: "JazzCash / Easypaisa" };

export async function placeOrder(_: CheckoutState, form: FormData): Promise<CheckoutState> {
  let lines: { slug: string; size: string; qty: number }[];
  try {
    lines = JSON.parse(String(form.get("cart") ?? "[]"));
  } catch {
    return { error: "Your cart could not be read. Please refresh and try again." };
  }
  if (!Array.isArray(lines) || lines.length === 0) return { error: "Your cart is empty." };

  // Prices and stock always come from the database, never from the browser.
  const items: OrderItem[] = [];
  for (const l of lines) {
    const p = findProduct(String(l.slug));
    const qty = Math.floor(Number(l.qty));
    if (!p || !p.active) return { error: "An item in your cart is no longer available." };
    if (!sizesFor(p).includes(String(l.size)) || !(qty > 0)) return { error: `Please check the size and quantity for ${p.name}.` };
    if (p.stock < qty) return { error: `Only ${p.stock} left of ${p.name}.` };
    items.push({ slug: p.slug, name: p.name, image: p.images[0], size: String(l.size), qty, price: p.price });
  }

  const name = String(form.get("name") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const line = String(form.get("address") ?? "").trim();
  const city = String(form.get("city") ?? "").trim();
  const payment = PAYMENTS[String(form.get("payment"))];
  if (!name || !phone || !email || !line || !city || !payment) return { error: "Please fill in all required fields." };

  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const discount = form.get("promo") === PROMO.code ? Math.round(subtotal * PROMO.rate) : 0;
  const shipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
  const user = await currentUser();

  const order = createOrder({
    userId: user?.id,
    email,
    items,
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping,
    payment,
    address: { name, phone, line, city, postal: String(form.get("postal") ?? "").trim() || undefined },
  });

  return { order: { id: order.id, name, phone, total: order.total, payment, line, city } };
}

export type TrackState = { error?: string; order?: { id: string; status: string; total: number; name: string; line: string; city: string } } | undefined;

export async function trackOrder(_: TrackState, form: FormData): Promise<TrackState> {
  const id = String(form.get("id") ?? "").trim().replace(/^#/, "");
  const phone = String(form.get("phone") ?? "").replace(/\D/g, "");
  const order = id ? findOrder(id) : undefined;
  // Require the phone number too, so order numbers alone can't reveal addresses.
  if (!order || order.address.phone.replace(/\D/g, "") !== phone) return { error: "No order matches that number and phone." };
  return { order: { id: order.id, status: order.status, total: order.total, name: order.address.name, line: order.address.line, city: order.address.city } };
}
