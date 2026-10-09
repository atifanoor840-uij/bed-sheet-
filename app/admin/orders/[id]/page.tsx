import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { updateOrderAction } from "../../actions";
import { PageTitle, Panel, StatusBadge, td, th } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { ORDER_STATUSES, findOrder, listUsers } from "@/lib/db";
import { formatPrice } from "@/lib/products";

export const metadata: Metadata = { title: "Order" };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const order = findOrder((await params).id);
  if (!order) notFound();
  const account = order.userId ? listUsers().find((u) => u.id === order.userId) : undefined;

  return (
    <>
      <Link href="/admin/orders" className="mb-4 inline-flex items-center gap-2 text-[13px] text-muted hover:text-ink">
        <ArrowLeft size={14} /> Orders
      </Link>
      <PageTitle title={`Order #${order.id}`} sub={new Date(order.createdAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}>
        <StatusBadge status={order.status} />
      </PageTitle>

      <div className="grid gap-3 xl:grid-cols-[2fr_1fr]">
        <div className="grid content-start gap-3">
          <Panel title="Items">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-[13px]">
                <thead className="border-b border-line">
                  <tr>
                    <th className={th}>Product</th>
                    <th className={th}>Size</th>
                    <th className={th}>Qty</th>
                    <th className={`${th} text-right`}>Price</th>
                    <th className={`${th} text-right`}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((it) => (
                    <tr key={it.slug + it.size} className="border-b border-line last:border-0">
                      <td className={td}>
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-10 shrink-0 bg-stone">
                            <Image src={it.image} alt="" fill sizes="40px" className="object-cover" />
                          </div>
                          <Link href={`/admin/products/${it.slug}`} className="hover:underline">
                            {it.name}
                          </Link>
                        </div>
                      </td>
                      <td className={`${td} text-muted`}>{it.size}</td>
                      <td className={td}>{it.qty}</td>
                      <td className={`${td} text-right`}>{formatPrice(it.price)}</td>
                      <td className={`${td} text-right`}>{formatPrice(it.price * it.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <dl className="ml-auto max-w-xs space-y-2 border-t border-line p-5 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd>{formatPrice(order.subtotal)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted">Discount</dt>
                  <dd>−{formatPrice(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted">Delivery</dt>
                <dd>{order.shipping ? formatPrice(order.shipping) : "Free"}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-[15px]">
                <dt>Total</dt>
                <dd>{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </Panel>

          <Panel title="Update order">
            {/* Keyed so the fields pick up the saved values after each update. */}
            <form key={`${order.status}-${order.note ?? ""}`} action={updateOrderAction} className="grid gap-4 p-5">
              <input type="hidden" name="id" value={order.id} />
              <label className="block">
                <span className="mb-1.5 block text-[13px]">Status</span>
                <select name="status" defaultValue={order.status} className="field max-w-xs">
                  {ORDER_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <span className="mt-1 block text-xs text-muted">Cancelling returns the items to stock.</span>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px]">Internal note</span>
                <textarea name="note" rows={3} defaultValue={order.note} placeholder="e.g. Courier tracking number, call notes" className="field resize-none" />
              </label>
              <button className="btn w-fit">Save</button>
            </form>
          </Panel>
        </div>

        <div className="grid content-start gap-3">
          <Panel title="Customer">
            <div className="space-y-1 p-5 text-[13px]">
              <p>{order.address.name}</p>
              <p className="text-muted">{order.email}</p>
              <p className="text-muted">{order.address.phone}</p>
              <p className="pt-2 text-xs text-muted">{account ? `Registered customer since ${new Date(account.createdAt).toLocaleDateString("en-PK")}` : "Guest checkout"}</p>
            </div>
          </Panel>
          <Panel title="Delivery address">
            <div className="space-y-1 p-5 text-[13px]">
              <p>{order.address.line}</p>
              <p>
                {order.address.city}
                {order.address.postal ? ` ${order.address.postal}` : ""}
              </p>
            </div>
          </Panel>
          <Panel title="Payment">
            <p className="p-5 text-[13px]">{order.payment}</p>
          </Panel>
        </div>
      </div>
    </>
  );
}
