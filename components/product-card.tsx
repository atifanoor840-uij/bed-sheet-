"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./cart";
import { defaultSize, discount, formatPrice, type Product } from "@/lib/products";

export default function ProductCard({ product, sizes = "(min-width: 1024px) 25vw, 50vw" }: { product: Product; sizes?: string }) {
  const { add } = useCart();

  return (
    <article className="group flex flex-col">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[3/4] overflow-hidden bg-stone" aria-label={product.name}>
        <Image src={product.images[0]} alt={product.name} fill sizes={sizes} className="object-cover transition-transform duration-500 group-hover:scale-105" />
        {product.isNew && <span className="label absolute left-2.5 top-2.5 sm:left-3 sm:top-3 bg-paper px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px]">New</span>}
      </Link>
      <Link href={`/product/${product.slug}`} className="mt-2.5 sm:mt-3 block text-[13px]">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 group-hover:underline underline-offset-4">{product.name}</h3>
          <span className="shrink-0 text-xs text-muted">{product.colour}</span>
        </div>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <span className="font-medium text-sale">{formatPrice(product.price)}</span>
          <span className="text-muted line-through">{formatPrice(product.compareAt)}</span>
          <span className="text-xs text-muted">−{discount(product)}%</span>
        </p>
      </Link>
      <button disabled={product.stock <= 0} onClick={() => add(product.slug, defaultSize(product))} className="btn btn-outline mt-2.5 sm:mt-3 w-full py-2.5 sm:py-3 text-[10px] sm:text-[11px] tracking-wider active:scale-[0.98]">
        {product.stock > 0 ? "Add to cart" : "Sold out"}
      </button>
    </article>
  );
}
