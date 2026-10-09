import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/product-form";
import { PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { findProduct, listProducts } from "@/lib/db";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const product = findProduct((await params).slug);
  if (!product) notFound();
  const sets = listProducts({ includeHidden: true }).filter((p) => p.category !== "Pillow Covers");
  return (
    <>
      <PageTitle title={`Edit ${product.name}`} sub={`${product.category} · /product/${product.slug}`} />
      <ProductForm product={product} matchOptions={sets.map(({ slug, name, category }) => ({ slug, name: `${name} (${category})` }))} />
    </>
  );
}
