import type { Metadata } from "next";
import ProductForm from "@/components/admin/product-form";
import { PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { listProducts } from "@/lib/db";

export const metadata: Metadata = { title: "Add product" };

export default async function NewProductPage() {
  await requireAdmin();
  const sets = listProducts({ includeHidden: true }).filter((p) => p.category !== "Pillow Covers");
  return (
    <>
      <PageTitle title="Add product" />
      <ProductForm matchOptions={sets.map(({ slug, name, category }) => ({ slug, name: `${name} (${category})` }))} />
    </>
  );
}
