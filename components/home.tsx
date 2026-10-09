import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./product-card";
import CategoryTabs from "./category-tabs";
import { categories, formatPrice, getMatches, lookbook, photos } from "@/lib/products";
import { listProducts } from "@/lib/db";

export function Ticker() {
  const items = ["100% pure cotton", "300 thread count percale", "Cash on delivery", "Delivery in 2–4 days", "7-day exchange"];
  return (
    <div className="border-b border-line">
      <div className="mx-auto flex max-w-[1440px] justify-between gap-6 sm:gap-8 overflow-x-auto scrollbar-none px-4 py-3 sm:px-10 sm:py-3.5">
        {items.map((t) => (
          <span key={t} className="label shrink-0 text-muted text-[10px] sm:text-[11px]">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SectionHead({ kicker, title, href }: { kicker: string; title: string; href?: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4 sm:mb-12 md:mb-14">
      <div>
        <p className="label mb-2.5 sm:mb-4 text-muted text-[10px] sm:text-[11px]">{kicker}</p>
        <h2 className="text-2xl font-light tracking-[-0.02em] sm:text-4xl md:text-5xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="label border-b border-ink pb-0.5 text-[10px] sm:text-[11px] shrink-0 hover:opacity-70 transition-opacity">
          View all
        </Link>
      )}
    </div>
  );
}

export function Categories() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-16 md:px-10 md:py-24">
      <SectionHead kicker="Categories" title="Shop by category" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-5">
        {categories.map((c) => (
          <Link key={c.name} href={`/shop?c=${encodeURIComponent(c.name)}`} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden bg-stone">
              <Image src={c.image} alt={c.name} fill sizes="(min-width:1024px) 20vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="mt-3 flex items-center justify-between text-[13px]">
              <span className="group-hover:underline group-hover:underline-offset-4">{c.name}</span>
              <ArrowRight size={14} strokeWidth={1.5} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function NewIn() {
  const list = listProducts().filter((p) => p.isNew).slice(0, 4);
  return (
    <section className="mx-auto max-w-[1440px] px-4 pb-12 sm:px-6 sm:pb-16 md:px-10 md:pb-24">
      <SectionHead kicker="Just landed" title="New in" href="/shop?new=1" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-y-10 md:gap-x-5 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}

export function Editorial() {
  return (
    <section className="bg-stone">
      <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-2 md:gap-16 md:px-10 md:py-24">
        <div className="relative aspect-[4/5] overflow-hidden bg-sand">
          <Image src={photos.story} alt="Bedroom with cotton bedding" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="max-w-md">
          <p className="label mb-4 text-muted text-[10px] sm:text-[11px]">Our cotton</p>
          <h2 className="text-3xl leading-[1.08] font-light tracking-[-0.02em] sm:text-4xl md:text-5xl lg:text-6xl">Woven in Faisalabad. Made to last.</h2>
          <p className="mt-6 text-[14px] sm:text-[15px] leading-relaxed text-muted">
            Long-staple cotton, a 300 thread count percale weave and reactive dyes that keep their colour. Every set is pre-washed, so it feels soft from the
            first night — and softer after every wash.
          </p>
          <dl className="mt-8 grid grid-cols-3 border-t border-ink/15 pt-5 sm:mt-12 sm:pt-6">
            {[
              ["300", "Thread count"],
              ["100%", "Cotton"],
              ["7 days", "Exchange"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="text-xl sm:text-2xl font-light">{n}</dt>
                <dd className="mt-1 text-[11px] sm:text-xs text-muted">{l}</dd>
              </div>
            ))}
          </dl>
          <Link href="/about" className="btn btn-outline mt-8 sm:mt-10">
            Our story
          </Link>
        </div>
      </div>
    </section>
  );
}

export function BestsellerStrip() {
  return (
    <section className="py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10">
        <SectionHead kicker="The edit" title="Bestsellers" href="/shop" />
      </div>
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-none px-4 pb-4 sm:px-6 md:gap-5 md:px-10">
        {listProducts().slice(0, 8).map((p) => (
          <div key={p.slug} className="w-[74vw] shrink-0 snap-start sm:w-[45vw] md:w-[30vw] lg:w-[22vw]">
            <ProductCard product={p} sizes="(min-width:1024px) 22vw, 75vw" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function FullBleed() {
  return (
    <section className="relative h-[65vh] min-h-[400px]">
      <Image src={photos.room} alt="Bedroom" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center text-paper">
        <h2 className="text-[clamp(2.2rem,6vw,5.5rem)] leading-none font-light tracking-[-0.03em]">Sleep well, every night.</h2>
        <Link href="/shop" className="label mt-8 inline-block border border-paper px-7 py-3.5 sm:mt-10 sm:px-8 sm:py-4 transition-colors hover:bg-paper hover:text-ink">
          Shop collection
        </Link>
      </div>
    </section>
  );
}

export function RangeByCategory() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-16 md:px-10 md:py-24">
      <SectionHead kicker="Signature Comfort" title="The whole range, one standard of quality" href="/shop" />
      <CategoryTabs products={listProducts()} />
    </section>
  );
}

export function Services() {
  const items = [
    ["Delivery", "2–4 working days, anywhere in Pakistan. Free over Rs. 5,000.", "/shipping"],
    ["Cash on delivery", "Pay when your order arrives. JazzCash and Easypaisa also accepted.", "/faq"],
    ["Exchange", "Changed your mind? Exchange unused items within 7 days.", "/exchanges"],
    ["Care", "Machine wash cold, tumble dry low. Gets softer with every wash.", "/care-guide"],
  ];
  return (
    <section className="mx-auto grid max-w-[1440px] gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 sm:py-16 md:px-10 md:py-20 lg:grid-cols-4">
      {items.map(([t, d, href]) => (
        <Link key={t} href={href} className="border-t border-ink pt-4 sm:pt-5 group">
          <p className="text-[13px] font-medium group-hover:underline underline-offset-4">{t}</p>
          <p className="mt-1.5 sm:mt-2 text-[13px] leading-relaxed text-muted">{d}</p>
        </Link>
      ))}
    </section>
  );
}

const setSlugs = ["sandstone-stripe", "coastal-stripe", "blush", "blue-floral"];

/** Bedsheet or duvet shown next to the pillow covers made from the same fabric. */
export function MatchingSets() {
  const all = listProducts();
  const sets = setSlugs
    .map((slug) => {
      const main = all.find((x) => x.slug === slug);
      return main && { main, pillow: getMatches(main, all)[0] };
    })
    .filter((s) => s && s.pillow) as { main: (typeof all)[number]; pillow: (typeof all)[number] }[];
  if (sets.length === 0) return null;

  return (
    <section className="bg-stone py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10">
        <SectionHead kicker="Complete the set" title="Sheets & matching pillows" href="/shop?c=Pillow+Covers" />
        <div className="grid gap-x-5 gap-y-10 sm:gap-y-14 md:grid-cols-2">
          {sets.map(({ main, pillow }) => (
            <div key={main.slug}>
              <div className="grid grid-cols-[3fr_2fr] gap-2">
                <Link href={`/product/${main.slug}`} className="relative aspect-[3/4] bg-paper">
                  <Image src={main.images[0]} alt={main.name} fill sizes="(min-width:768px) 30vw, 60vw" className="object-cover" />
                </Link>
                <div className="grid gap-2">
                  <Link href={`/product/${pillow.slug}`} className="relative bg-paper">
                    <Image src={pillow.images[0]} alt={pillow.name} fill sizes="(min-width:768px) 20vw, 40vw" className="object-cover" />
                  </Link>
                  <div className="relative bg-paper">
                    <Image src={main.images[1]} alt="" fill sizes="(min-width:768px) 20vw, 40vw" className="object-cover" />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 text-[13px]">
                <p>
                  <Link href={`/product/${main.slug}`} className="underline-offset-4 hover:underline">
                    {main.name} {main.category.replace(/s$/, "").toLowerCase()}
                  </Link>{" "}
                  +{" "}
                  <Link href={`/product/${pillow.slug}`} className="underline-offset-4 hover:underline">
                    pillow covers
                  </Link>
                </p>
                <p className="text-muted font-medium">{formatPrice(main.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PillowRow() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-16 md:px-10 md:py-24">
      <SectionHead kicker="New category" title="Pillow covers" href="/shop?c=Pillow+Covers" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-y-10 md:gap-x-5 lg:grid-cols-4">
        {listProducts()
          .filter((x) => x.category === "Pillow Covers")
          .slice(0, 8)
          .map((x) => (
            <ProductCard key={x.slug} product={x} />
          ))}
      </div>
    </section>
  );
}

export function Lookbook() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-16 md:px-10 md:py-24">
      <SectionHead kicker="In real homes" title="Neend at home" />
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {lookbook.map((src, i) => (
          <div key={src} className={`relative bg-stone ${i === 0 || i === 5 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}>
            <Image src={src} alt="Bedroom styled with Neend bedding" fill sizes={i === 0 || i === 5 ? "(min-width:768px) 50vw, 100vw" : "(min-width:768px) 25vw, 50vw"} className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
