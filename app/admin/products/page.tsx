import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { deleteProductAction, toggleProductAction } from "../actions";
import ConfirmButton from "@/components/admin/confirm-button";
import { PageTitle, Panel, td, th } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { listProducts } from "@/lib/db";
import { CATEGORY_NAMES, formatPrice } from "@/lib/products";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; c?: string; saved?: string }> }) {
  await requireAdmin();
  const { q = "", c = "", saved } = await searchParams;
  const all = listProducts({ includeHidden: true });
  const term = q.trim().toLowerCase();
  const list = all.filter((p) => (!c || p.category === c) && (!term || `${p.name} ${p.slug} ${p.colour}`.toLowerCase().includes(term)));

  return (
    <>
      <PageTitle title="Products" sub={`${all.length} products · ${all.filter((p) => !p.active).length} hidden`}>
        <Link href="/admin/products/new" className="btn">
          <Plus size={14} /> Add product
        </Link>
      </PageTitle>

      {saved && <p className="mb-4 border border-[#bfe0c8] bg-[#e3f1e6] px-4 py-3 text-[13px] text-[#1f5130]">Saved “{saved}”.</p>}

      <Panel>
        <form className="flex flex-wrap gap-2 border-b border-line p-4">
          <input name="q" defaultValue={q} placeholder="Search by name, colour or URL" className="field max-w-xs py-2" />
          <select name="c" defaultValue={c} className="field w-auto py-2">
            <option value="">All categories</option>
            {CATEGORY_NAMES.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
          <button className="btn btn-outline py-2">Filter</button>
          {(q || c) && (
            <Link href="/admin/products" className="self-center text-[13px] text-muted underline underline-offset-4">
              Clear
            </Link>
          )}
        </form>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-[13px]">
            <thead className="border-b border-line">
              <tr>
                <th className={th}>Product</th>
                <th className={th}>Category</th>
                <th className={th}>Price</th>
                <th className={th}>Stock</th>
                <th className={th}>Status</th>
                <th className={`${th} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.slug} className="border-b border-line last:border-0 hover:bg-stone">
                  <td className={td}>
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-11 shrink-0 bg-stone">
                        <Image src={p.images[0]} alt="" fill sizes="44px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <Link href={`/admin/products/${p.slug}`} className="font-medium hover:underline">
                          {p.name}
                        </Link>
                        <p className="text-xs text-muted">
                          {p.colour} · {p.images.length} photo{p.images.length === 1 ? "" : "s"}
                          {p.isNew && " · New"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={`${td} text-muted`}>{p.category}</td>
                  <td className={td}>
                    {formatPrice(p.price)}
                    <span className="block text-xs text-muted line-through">{formatPrice(p.compareAt)}</span>
                  </td>
                  <td className={`${td} ${p.stock === 0 ? "text-sale" : p.stock <= 5 ? "text-[#9a5b00]" : ""}`}>{p.stock}</td>
                  <td className={td}>
                    <form action={toggleProductAction}>
                      <input type="hidden" name="slug" value={p.slug} />
                      <button
                        title={p.active ? "Click to hide from the store" : "Click to show in the store"}
                        className={`px-2 py-0.5 text-[11px] font-medium ${p.active ? "bg-[#e3f1e6] text-[#1f5130]" : "bg-line text-muted"}`}
                      >
                        {p.active ? "Live" : "Hidden"}
                      </button>
                    </form>
                  </td>
                  <td className={`${td} text-right whitespace-nowrap`}>
                    <Link href={`/product/${p.slug}`} target="_blank" className="mr-4 text-muted hover:text-ink">
                      View
                    </Link>
                    <Link href={`/admin/products/${p.slug}`} className="mr-4 underline underline-offset-4">
                      Edit
                    </Link>
                    <form action={deleteProductAction} className="inline">
                      <input type="hidden" name="slug" value={p.slug} />
                      <ConfirmButton message={`Delete “${p.name}”? This can't be undone.`} className="text-sale hover:underline">
                        Delete
                      </ConfirmButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-8 text-center text-[13px] text-muted">No products match.</p>}
        </div>
      </Panel>
    </>
  );
}
