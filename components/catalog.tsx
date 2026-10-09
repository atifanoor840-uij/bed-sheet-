"use client";

import { createContext, useContext, useMemo } from "react";
import type { Product } from "@/lib/products";

type Catalog = { products: Product[]; get: (slug: string) => Product | undefined };

const Ctx = createContext<Catalog>({ products: [], get: () => undefined });

/** Live product list from the database, handed down by the store layout. */
export function CatalogProvider({ products, children }: { products: Product[]; children: React.ReactNode }) {
  const value = useMemo(() => {
    const bySlug = new Map(products.map((p) => [p.slug, p]));
    return { products, get: (slug: string) => bySlug.get(slug) };
  }, [products]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCatalog = () => useContext(Ctx);
