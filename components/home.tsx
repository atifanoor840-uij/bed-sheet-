import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./product-card";
import CategoryTabs from "./category-tabs";
import { categories, getMatches, lookbook, photos, products } from "@/lib/products";

export function Ticker() {
  const items = ["100% cotton", "Rs. 2,500 — was Rs. 5,500", "Cash on delivery", "Delivery in 2–4 days", "7-day exchange"];
  return (
    <div className="border-b border-line">
      <div className="mx-auto flex max-w-[1440px] justify-between gap-8 overflow-x-auto px-5 py-3.5 md:px-10">
        {items.map((t) => (
          <span key={t} className="label shrink-0 text-muted">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SectionHead({ kicker, title, href }: { kicker: string; title: string; href?: string }) {
  return (
    <div className="mb-10 flex items-end justify-between gap-6 md:mb-14">
      <div>
        <p className="label mb-4 text-muted">{kicker}</p>
        <h2 className="text-4xl font-light tracking-[-0.02em] md:text-5xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="label hidden border-b border-ink pb-1 md:block">
          View all
        </Link>
      )}
    </div>
  );
}

export function Categories() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
      <SectionHead kicker="Categories" title="Shop by category" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-5">
        {categories.map((c) => (
          <Link key={c.name} href={`/shop?c=${encodeURIComponent(c.name)}`} className="group block">
            <div className="relative aspect-[3/4] bg-stone">
              <Image src={c.image} alt={c.name} fill sizes="(min-width:1024px) 20vw, 50vw" className="object-cover" />
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
  const list = products.filter((p) => p.isNew).slice(0, 4);
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-20 md:px-10 md:pb-28">
      <SectionHead kicker="Just landed" title="New in" href="/shop?new=1" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 lg:grid-cols-4">
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
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-20 md:grid-cols-2 md:gap-20 md:px-10 md:py-28">
        <div className="relative aspect-[4/5]">
          <Image src={photos.story} alt="Bedroom with cotton bedding" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="max-w-md">
          <p className="label mb-6 text-muted">Our cotton</p>
          <h2 className="text-4xl leading-[1.05] font-light tracking-[-0.02em] md:text-6xl">Woven in Faisalabad. Made to last.</h2>
          <p className="mt-8 text-[15px] leading-relaxed text-muted">
            Long-staple cotton, a 300 thread count percale weave and reactive dyes that keep their colour. Every set is pre-washed, so it feels soft from the
            first night — and softer after every wash.
          </p>
          <dl className="mt-12 grid grid-cols-3 border-t border-ink/15 pt-6">
            {[
              ["300", "Thread count"],
              ["100%", "Cotton"],
              ["7 days", "Exchange"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="text-2xl font-light">{n}</dt>
                <dd className="mt-1 text-xs text-muted">{l}</dd>
              </div>
            ))}
          </dl>
          <Link href="/about" className="btn btn-outline mt-10">
            Our story
          </Link>
        </div>
      </div>
    </section>
  );
}

export function BestsellerStrip() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead kicker="The edit" title="Bestsellers" href="/shop" />
      </div>
      <div className="flex snap-x gap-3 overflow-x-auto px-5 pb-4 md:gap-5 md:px-10">
        {products.slice(0, 8).map((p) => (
          <div key={p.slug} className="w-[70vw] shrink-0 snap-start sm:w-[40vw] lg:w-[22vw]">
            <ProductCard product={p} sizes="(min-width:1024px) 22vw, 70vw" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function FullBleed() {
  return (
    <section className="relative h-[70vh] min-h-[420px]">
      <Image src={photos.room} alt="Bedroom" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative flex h-full flex-col items-center justify-center px-5 text-center text-paper">
        <h2 className="text-[clamp(2.4rem,6vw,5.5rem)] leading-none font-light tracking-[-0.03em]">Sleep well, for less.</h2>
        <Link href="/shop" className="label mt-10 inline-block border border-paper px-8 py-4 hover:bg-paper hover:text-ink">
          Shop the sale
        </Link>
      </div>
    </section>
  );
}

export function RangeByCategory() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
      <SectionHead kicker="Rs. 2,500 · was Rs. 5,500" title="The whole range, one price" href="/shop" />
      <CategoryTabs />
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
    <section className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:grid-cols-2 md:px-10 lg:grid-cols-4">
      {items.map(([t, d, href]) => (
        <Link key={t} href={href} className="border-t border-ink pt-5">
          <p className="text-[13px] font-medium">{t}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">{d}</p>
        </Link>
      ))}
    </section>
  );
}

const setSlugs = ["sandstone-stripe", "coastal-stripe", "blush", "blue-floral"];

/** Bedsheet or duvet shown next to the pillow covers made from the same fabric. */
export function MatchingSets() {
  const sets = setSlugs.map((slug) => {
    const main = products.find((x) => x.slug === slug)!;
    return { main, pillow: getMatches(main)[0] };
  });

  return (
    <section className="bg-stone py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead kicker="Complete the set" title="Sheets & matching pillows" href="/shop?c=Pillow+Covers" />
        <div className="grid gap-x-5 gap-y-14 md:grid-cols-2">
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
                <p className="text-muted">Rs. 2,500 each</p>
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
    <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
      <SectionHead kicker="New category" title="Pillow covers" href="/shop?c=Pillow+Covers" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 lg:grid-cols-4">
        {products
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
    <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
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
