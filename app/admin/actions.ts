"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { ORDER_STATUSES, findProduct, removeProduct, saveProduct, setUserRole, updateOrder, type OrderStatus } from "@/lib/db";
import { CATEGORY_NAMES, slugify, type Category, type Product } from "@/lib/products";

export type ProductFormState = { error?: string } | undefined;

export async function saveProductAction(_: ProductFormState, form: FormData): Promise<ProductFormState> {
  await requireAdmin();

  const original = String(form.get("originalSlug") ?? "") || undefined;
  const name = String(form.get("name") ?? "").trim();
  const slug = slugify(String(form.get("slug") ?? "") || name);
  const category = String(form.get("category")) as Category;
  const price = Number(form.get("price"));
  const compareAt = Number(form.get("compareAt"));
  const stock = Number(form.get("stock"));
  const images = String(form.get("images") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!name) return { error: "Name is required." };
  if (!slug) return { error: "Please enter a valid URL name." };
  if (!CATEGORY_NAMES.includes(category)) return { error: "Choose a category." };
  if (!(price > 0)) return { error: "Price must be more than 0." };
  if (!(compareAt >= price)) return { error: "“Was” price should be the same as or higher than the price." };
  if (!Number.isInteger(stock) || stock < 0) return { error: "Stock must be a whole number, 0 or more." };
  if (images.length === 0) return { error: "Add at least one photo." };
  if (images.some((src) => !src.startsWith("/uploads/") && !src.startsWith("https://images.unsplash.com/"))) {
    return { error: "Photos must be uploaded here or be images.unsplash.com links." };
  }
  if (slug !== original && findProduct(slug)) return { error: `Another product already uses “${slug}”.` };

  const match = String(form.get("match") ?? "") || undefined;
  const product: Product = {
    slug,
    name,
    category,
    colour: String(form.get("colour") ?? "").trim() || "—",
    price,
    compareAt,
    stock,
    images,
    isNew: form.get("isNew") === "on",
    active: form.get("active") === "on",
    match: category === "Pillow Covers" ? match : undefined,
  };
  saveProduct(product, original);
  revalidatePath("/", "layout");
  redirect("/admin/products?saved=" + slug);
}

export async function deleteProductAction(form: FormData) {
  await requireAdmin();
  removeProduct(String(form.get("slug")));
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function toggleProductAction(form: FormData) {
  await requireAdmin();
  const p = findProduct(String(form.get("slug")));
  if (p) saveProduct({ ...p, active: !p.active });
  revalidatePath("/", "layout");
}

export async function updateOrderAction(form: FormData) {
  await requireAdmin();
  const status = String(form.get("status")) as OrderStatus;
  const note = form.get("note");
  updateOrder(String(form.get("id")), {
    ...(ORDER_STATUSES.includes(status) ? { status } : {}),
    ...(note !== null ? { note: String(note).trim() || undefined } : {}),
  });
  revalidatePath("/admin", "layout");
}

export async function setRoleAction(form: FormData) {
  const me = await requireAdmin();
  const id = String(form.get("id"));
  // Admins can't demote themselves, so there's always at least one admin.
  if (id === me.id) return;
  setUserRole(id, form.get("role") === "admin" ? "admin" : "customer");
  revalidatePath("/admin/users");
}
