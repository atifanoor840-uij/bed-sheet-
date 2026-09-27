import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetail from "@/components/product-detail";
import ProductCard from "@/components/product-card";
import { getProduct, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const pr = getProduct((await params).slug);
  if (!pr) return { title: "Product" };
  const kind = pr.category.replace(/s$/, "");
  return { title: pr.name.includes(kind) || pr.name.includes(pr.category) ? pr.name : `${pr.name} ${kind}` };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const related = products.filter((p) => p.slug !== product.slug && p.category === product.category).slice(0, 4);

  return (
    <>
      <ProductDetail product={product} />
      <section className="mx-auto max-w-[1440px] border-t border-line px-5 py-20 md:px-10">
        <h2 className="mb-10 text-3xl font-light tracking-[-0.02em]">You may also like</h2>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
