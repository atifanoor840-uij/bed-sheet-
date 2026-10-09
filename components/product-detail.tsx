"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCart } from "./cart";
import { Accordion } from "./ui";
import { defaultSize, discount, formatPrice, sizesFor, type Product } from "@/lib/products";

const details = [
  { q: "Fabric & care", a: "100% cotton percale, 300 thread count. Machine wash cold on a gentle cycle, tumble dry low. Do not bleach." },
  {
    q: "Dimensions",
    a: (
      <>
        Single 60×90&quot; · Double 90×100&quot; · King 108×108&quot; · Super King 110×120&quot;. Pillow covers 20×30&quot;.{" "}
        <Link href="/size-guide" className="underline underline-offset-4">
          Full size guide
        </Link>
      </>
    ),
  },
  {
    q: "Delivery & exchange",
    a: "Delivered in 2–4 working days across Pakistan. Free delivery over Rs. 5,000. Unused items can be exchanged within 7 days.",
  },
];

export default function ProductDetail({ product, matches }: { product: Product; matches: Product[] }) {
  const { add } = useCart();
  const sizes = sizesFor(product);
  const [size, setSize] = useState<string>(defaultSize(product));
  const [qty, setQty] = useState(1);

  return (
    <div className="mx-auto grid max-w-[1440px] gap-8 pb-16 px-4 sm:px-6 md:px-10 md:pb-20 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 lg:pt-10">
        {product.images.map((src, i) => (
          // An odd photo count leaves the last one spanning both columns on desktop.
          <div key={src} className={`relative bg-stone ${i === 0 ? "aspect-[4/5] sm:aspect-[3/4]" : i === product.images.length - 1 && product.images.length % 2 ? "sm:col-span-2 aspect-[4/3] sm:aspect-[3/2]" : "aspect-[4/5] sm:aspect-[3/4]"}`}>
            <Image src={src} alt={`${product.name} ${i + 1}`} fill priority={i === 0} sizes="(min-width:1024px) 35vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
          </div>
        ))}
      </div>

      <div className="px-1 sm:px-0 lg:sticky lg:top-24 lg:self-start lg:pt-10">
        <nav className="mb-6 text-xs text-muted">
          <Link href="/shop" className="hover:text-ink">
            Shop
          </Link>{" "}
          /{" "}
          <Link href={`/shop?c=${encodeURIComponent(product.category)}`} className="hover:text-ink">
            {product.category}
          </Link>
        </nav>

        <h1 className="text-3xl font-light tracking-[-0.02em] sm:text-4xl md:text-5xl">{product.name}</h1>
        <p className="mt-2 text-[13px] text-muted">
          {product.category} · {product.colour}
        </p>
        <p className="mt-6 flex items-baseline gap-3">
          <span className="text-xl text-sale">{formatPrice(product.price)}</span>
          <span className="text-muted line-through">{formatPrice(product.compareAt)}</span>
          <span className="label bg-ink px-2 py-1 text-[10px] text-paper">−{discount(product)}%</span>
        </p>
        <p className="mt-6 max-w-md text-[14px] leading-relaxed text-muted">
          Crisp, breathable cotton in {product.colour.toLowerCase()}. Pre-washed for a soft, lived-in feel from the first night.
        </p>

        <div className="mt-10">
          <div className="mb-3 flex justify-between text-[13px]">
            <span>Size: {size}</span>
            <Link href="/size-guide" className="text-muted underline underline-offset-4">
              Size guide
            </Link>
          </div>
          <div className={`grid ${sizes.length === 2 ? "grid-cols-2" : "grid-cols-4"}`}>
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`relative -ml-px border py-3.5 text-[13px] first:ml-0 ${size === s ? "z-10 border-ink bg-ink text-paper" : "border-line text-muted hover:text-ink"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <div className="flex items-center border border-line">
            <button className="px-3.5 py-3 sm:px-4 sm:py-4" aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              <Minus size={13} />
            </button>
            <span className="w-6 text-center text-[13px]">{qty}</span>
            <button className="px-3.5 py-3 sm:px-4 sm:py-4" aria-label="Increase" onClick={() => setQty((q) => q + 1)}>
              <Plus size={13} />
            </button>
          </div>
          <button disabled={product.stock <= 0} onClick={() => add(product.slug, size, Math.min(qty, product.stock))} className="btn flex-1 py-3.5 sm:py-4 text-[11px] tracking-widest">
            {product.stock > 0 ? `Add to cart — ${formatPrice(product.price * qty)}` : "Sold out"}
          </button>
        </div>
        {product.stock > 0 && (
          <Link href="/checkout" onClick={() => add(product.slug, size, Math.min(qty, product.stock), false)} className="btn btn-outline mt-2.5 w-full py-3.5 sm:py-4">
            Buy it now
          </Link>
        )}
        {product.stock > 0 && product.stock <= 5 && <p className="mt-3 text-[13px] text-sale">Only {product.stock} left</p>}

        {matches.length > 0 && (
          <div className="mt-8 border-t border-line pt-6">
            <p className="mb-4 text-[13px]">{product.match ? "Made to match" : "Complete the set — matching pillow covers"}</p>
            {matches.map((m) => (
              <div key={m.slug} className="flex items-center gap-4">
                <Link href={`/product/${m.slug}`} className="relative h-24 w-20 shrink-0 bg-stone">
                  <Image src={m.images[0]} alt={m.name} fill sizes="80px" className="object-cover" />
                </Link>
                <div className="flex-1 text-[13px]">
                  <Link href={`/product/${m.slug}`}>{m.name}</Link>
                  <p className="mt-1">
                    <span className="text-sale">{formatPrice(m.price)}</span> <span className="text-muted line-through">{formatPrice(m.compareAt)}</span>
                  </p>
                </div>
                <button onClick={() => add(m.slug, defaultSize(m))} className="btn btn-outline px-4 py-3">
                  Add
                </button>
              </div>
            ))}
          </div>
        )}

        <ul className="mt-6 space-y-1 text-xs text-muted">
          <li>Delivery in 2–4 working days</li>
          <li>Cash on delivery available</li>
        </ul>

        <div className="mt-10">
          <Accordion items={details} />
        </div>
      </div>
    </div>
  );
}
