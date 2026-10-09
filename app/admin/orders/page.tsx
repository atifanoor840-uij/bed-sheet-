import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle, Panel, StatusBadge, fmtDate, td, th } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { ORDER_STATUSES, listOrders } from "@/lib/db";
import { formatPrice } from "@/lib/products";

export const metadata: Metadata = { title: "Orders" };

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  await requireAdmin();
  const { q = "", status = "" } = await searchParams;
  const all = listOrders();
  const term = q.trim().toLowerCase();
  const list = all.filter(
    (o) =>
      (!status || o.status === status) &&
      (!term || `${o.id} ${o.address.name} ${o.email} ${o.address.phone} ${o.address.city}`.toLowerCase().includes(term)),
  );

  return (
    <>
      <PageTitle title="Orders" sub={`${all.length} total`} />

      <div className="mb-3 flex flex-wrap gap-1">
        {["", ...ORDER_STATUSES].map((s) => (
          <Link
            key={s || "all"}
            href={s ? `/admin/orders?status=${s}` : "/admin/orders"}
            className={`px-3 py-1.5 text-[12px] ${status === s ? "bg-ink text-paper" : "bg-paper text-muted hover:text-ink"}`}
          >
            {s || "All"} ({s ? all.filter((o) => o.status === s).length : all.length})
          </Link>
        ))}
      </div>

      <Panel>
        <form className="flex flex-wrap gap-2 border-b border-line p-4">
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Search order #, name, email, phone, city" className="field max-w-sm py-2" />
          <button className="btn btn-outline py-2">Search</button>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-[13px]">
            <thead className="border-b border-line">
              <tr>
                <th className={th}>Order</th>
                <th className={th}>Date</th>
                <th className={th}>Customer</th>
                <th className={th}>City</th>
                <th className={th}>Items</th>
                <th className={th}>Payment</th>
                <th className={th}>Status</th>
                <th className={`${th} text-right`}>Total</th>
              </tr>
            </thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0 hover:bg-stone">
                  <td className={td}>
                    <Link href={`/admin/orders/${o.id}`} className="font-medium underline-offset-4 hover:underline">
                      #{o.id}
                    </Link>
                  </td>
                  <td className={`${td} text-muted`}>{fmtDate(o.createdAt)}</td>
                  <td className={td}>
                    {o.address.name}
                    <span className="block text-xs text-muted">{o.address.phone}</span>
                  </td>
                  <td className={`${td} text-muted`}>{o.address.city}</td>
                  <td className={`${td} text-muted`}>{o.items.reduce((n, i) => n + i.qty, 0)}</td>
                  <td className={`${td} text-muted`}>{o.payment}</td>
                  <td className={td}>
                    <StatusBadge status={o.status} />
                  </td>
                  <td className={`${td} text-right`}>{formatPrice(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-8 text-center text-[13px] text-muted">No orders found.</p>}
        </div>
      </Panel>
    </>
  );
}
