"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./cart";
import { defaultSize, discount, formatPrice, type Product } from "@/lib/products";

export default function ProductCard({ product, sizes = "(min-width: 1024px) 25vw, 50vw" }: { product: Product; sizes?: string }) {
  const { add } = useCart();

  return (
    <article className="flex flex-col">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[3/4] bg-stone" aria-label={product.name}>
        <Image src={product.images[0]} alt={product.name} fill sizes={sizes} className="object-cover" />
        {product.isNew && <span className="label absolute left-3 top-3 bg-paper px-2 py-1 text-[10px]">New</span>}
      </Link>
      <Link href={`/product/${product.slug}`} className="mt-3 block text-[13px]">
        <div className="flex items-start justify-between gap-3">
          <h3>{product.name}</h3>
          <span className="text-muted">{product.colour}</span>
        </div>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <span className="font-medium text-sale">{formatPrice(product.price)}</span>
          <span className="text-muted line-through">{formatPrice(product.compareAt)}</span>
          <span className="text-xs text-muted">−{discount(product)}%</span>
        </p>
      </Link>
      <button onClick={() => add(product.slug, defaultSize(product))} className="btn btn-outline mt-3 w-full py-3">
        Add to cart
      </button>
    </article>
  );
}
