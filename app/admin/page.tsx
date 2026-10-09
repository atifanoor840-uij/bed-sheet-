import Image from "next/image";
import Link from "next/link";
import { PageTitle, Panel, StatusBadge, fmtDate, td, th } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { ORDER_STATUSES, listOrders, listProducts, listUsers } from "@/lib/db";
import { formatPrice } from "@/lib/products";

export default async function Dashboard() {
  await requireAdmin();
  const orders = listOrders();
  const live = orders.filter((o) => o.status !== "Cancelled");
  const products = listProducts({ includeHidden: true });
  const customers = listUsers().filter((u) => u.role === "customer");

  // Server component rendered per request, so reading the clock here is intended.
  // eslint-disable-next-line react-hooks/purity
  const since = Date.now() - 30 * 864e5;
  const recent = live.filter((o) => new Date(o.createdAt).getTime() > since);
  const revenue = live.reduce((n, o) => n + o.total, 0);
  const lowStock = products.filter((p) => p.stock <= 5).sort((a, b) => a.stock - b.stock);

  const stats = [
    { label: "Revenue", value: formatPrice(revenue), sub: `${formatPrice(recent.reduce((n, o) => n + o.total, 0))} in the last 30 days` },
    { label: "Orders", value: String(orders.length), sub: `${orders.filter((o) => o.status === "Confirmed").length} waiting to be packed` },
    { label: "Customers", value: String(customers.length), sub: `${new Set(orders.map((o) => o.email)).size} have ordered` },
    { label: "Products", value: String(products.length), sub: `${products.filter((p) => !p.active).length} hidden · ${lowStock.length} low stock` },
  ];

  return (
    <>
      <PageTitle title="Dashboard" sub="Overview of your store" />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Panel key={s.label}>
            <div className="p-5">
              <p className="text-[12px] text-muted">{s.label}</p>
              <p className="mt-2 text-2xl font-light">{s.value}</p>
              <p className="mt-1 text-[12px] text-muted">{s.sub}</p>
            </div>
          </Panel>
        ))}
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[2fr_1fr]">
        <Panel
          title="Recent orders"
          action={
            <Link href="/admin/orders" className="text-[12px] underline underline-offset-4">
              View all
            </Link>
          }
        >
          {orders.length === 0 ? (
            <p className="p-5 text-[13px] text-muted">No orders yet. They&rsquo;ll appear here as soon as customers check out.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="border-b border-line">
                  <tr>
                    <th className={th}>Order</th>
                    <th className={th}>Customer</th>
                    <th className={th}>Date</th>
                    <th className={th}>Status</th>
                    <th className={`${th} text-right`}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 8).map((o) => (
                    <tr key={o.id} className="border-b border-line last:border-0 hover:bg-stone">
                      <td className={td}>
                        <Link href={`/admin/orders/${o.id}`} className="font-medium underline-offset-4 hover:underline">
                          #{o.id}
                        </Link>
                      </td>
                      <td className={td}>{o.address.name}</td>
                      <td className={`${td} text-muted`}>{fmtDate(o.createdAt)}</td>
                      <td className={td}>
                        <StatusBadge status={o.status} />
                      </td>
                      <td className={`${td} text-right`}>{formatPrice(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <div className="grid content-start gap-3">
          <Panel title="Orders by status">
            <ul className="p-5 text-[13px]">
              {ORDER_STATUSES.map((s) => (
                <li key={s} className="flex items-center justify-between py-1.5">
                  <Link href={`/admin/orders?status=${s}`} className="hover:underline">
                    <StatusBadge status={s} />
                  </Link>
                  <span>{orders.filter((o) => o.status === s).length}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Low stock">
            {lowStock.length === 0 ? (
              <p className="p-5 text-[13px] text-muted">Everything is well stocked.</p>
            ) : (
              <ul>
                {lowStock.slice(0, 6).map((p) => (
                  <li key={p.slug} className="flex items-center gap-3 border-b border-line px-5 py-3 text-[13px] last:border-0">
                    <div className="relative h-10 w-8 shrink-0 bg-stone">
                      <Image src={p.images[0]} alt="" fill sizes="32px" className="object-cover" />
                    </div>
                    <Link href={`/admin/products/${p.slug}`} className="flex-1 truncate hover:underline">
                      {p.name}
                    </Link>
                    <span className={p.stock === 0 ? "text-sale" : "text-muted"}>{p.stock === 0 ? "Sold out" : `${p.stock} left`}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
