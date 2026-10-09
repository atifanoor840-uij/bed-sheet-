"use client";

import { useState } from "react";
import ProductCard from "./product-card";
import { type Category, type Product } from "@/lib/products";

const tabs: ("All" | Category)[] = ["All", "Bedsheets", "Duvet Covers", "Pillow Covers", "Comforter Sets", "Fitted Sheets"];

export default function CategoryTabs({ products }: { products: Product[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const list = products.filter((p) => tab === "All" || p.category === tab).slice(0, 8);

  return (
    <>
      <div className="mb-8 flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none border-b border-line py-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px shrink-0 border-b pb-3 text-[13px] transition-colors ${tab === t ? "border-ink text-ink font-medium" : "border-transparent text-muted hover:text-ink"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-y-10 md:gap-x-5 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </>
  );
}
