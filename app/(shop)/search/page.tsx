import type { Metadata } from "next";
import SearchView from "@/components/search-view";
import { listProducts } from "@/lib/db";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  return <SearchView key={q} products={listProducts()} initialQuery={q ?? ""} />;
}
