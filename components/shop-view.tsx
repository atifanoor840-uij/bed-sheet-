"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import ProductCard from "./product-card";
import { categories, products, type Category } from "@/lib/products";

const cats: ("All" | Category)[] = ["All", ...categories.map((c) => c.name)];
const sorts = { featured: "Featured", az: "Name A–Z", za: "Name Z–A" } as const;

export default function ShopView({ initialCategory, initialNew }: { initialCategory: string; initialNew: boolean }) {
  const [cat, setCat] = useState(initialCategory);
  const [onlyNew, setOnlyNew] = useState(initialNew);
  const [sort, setSort] = useState<keyof typeof sorts>("featured");

  const list = useMemo(() => {
    const l = products.filter((p) => (cat === "All" || p.category === cat) && (!onlyNew || p.isNew));
    if (sort === "az") l.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") l.sort((a, b) => b.name.localeCompare(a.name));
    return l;
  }, [cat, onlyNew, sort]);
  const info = categories.find((c) => c.name === cat);
  const banner = info?.banner ?? [categories[0].banner[0], categories[1].banner[0], categories[2].banner[0]];

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-28 pt-12 md:px-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl font-light tracking-[-0.03em] md:text-6xl">{cat === "All" ? "All bedding" : cat}</h1>
          <p className="mt-3 max-w-lg text-[14px] text-muted">{info?.blurb ?? "Every set Rs. 2,500 during the season sale — was Rs. 5,500."}</p>
        </div>
        <p className="text-[13px] text-muted">{list.length} products</p>
      </div>

      <div className="mb-12 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
        {banner.map((src, i) => (
          <div key={src} className={`relative bg-stone md:col-span-1 md:aspect-[4/3] ${i === 0 ? "col-span-2 aspect-[2/1]" : "aspect-square"}`}>
            <Image src={src} alt="" fill priority={i === 0} sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
          </div>
        ))}
      </div>

      <div className="mb-10 flex flex-col gap-3 border-y border-line md:flex-row md:items-center md:justify-between">
        <div className="flex gap-6 overflow-x-auto">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`-mb-px shrink-0 border-b py-4 text-[13px] ${cat === c ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-6 pb-3 text-[13px] md:pb-0">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} className="accent-[var(--ink)]" />
            New only
          </label>
          <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof sorts)} className="border border-line bg-paper px-3 py-2 outline-none">
            {Object.entries(sorts).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-12 md:gap-x-5 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      {list.length === 0 && <p className="py-24 text-center text-[13px] text-muted">No products match these filters.</p>}
    </div>
  );
}
