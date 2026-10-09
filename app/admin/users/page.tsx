import type { Metadata } from "next";
import Link from "next/link";
import { setRoleAction } from "../actions";
import ConfirmButton from "@/components/admin/confirm-button";
import { PageTitle, Panel, fmtDate, td, th } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { listOrders, listUsers } from "@/lib/db";
import { formatPrice } from "@/lib/products";

export const metadata: Metadata = { title: "Customers" };

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const me = await requireAdmin();
  const { q = "" } = await searchParams;
  const orders = listOrders();
  const term = q.trim().toLowerCase();

  const users = listUsers()
    .map((u) => {
      const mine = orders.filter((o) => o.userId === u.id || o.email === u.email);
      const spent = mine.filter((o) => o.status !== "Cancelled").reduce((n, o) => n + o.total, 0);
      return { ...u, orders: mine.length, spent, last: mine[0]?.createdAt };
    })
    .filter((u) => !term || `${u.name} ${u.email} ${u.phone ?? ""}`.toLowerCase().includes(term))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const registered = new Set(listUsers().map((u) => u.email));
  const guests = new Set(orders.filter((o) => !registered.has(o.email)).map((o) => o.email)).size;

  return (
    <>
      <PageTitle title="Customers" sub={`${users.length} registered · ${guests} guest checkout${guests === 1 ? "" : "s"}`} />
      <Panel>
        <form className="flex flex-wrap gap-2 border-b border-line p-4">
          <input name="q" defaultValue={q} placeholder="Search name, email or phone" className="field max-w-sm py-2" />
          <button className="btn btn-outline py-2">Search</button>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-[13px]">
            <thead className="border-b border-line">
              <tr>
                <th className={th}>Name</th>
                <th className={th}>Phone</th>
                <th className={th}>Joined</th>
                <th className={th}>Orders</th>
                <th className={th}>Spent</th>
                <th className={th}>Role</th>
                <th className={`${th} text-right`}></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-line last:border-0 hover:bg-stone">
                  <td className={td}>
                    {u.name}
                    <span className="block text-xs text-muted">{u.email}</span>
                  </td>
                  <td className={`${td} text-muted`}>{u.phone ?? "—"}</td>
                  <td className={`${td} text-muted`}>{fmtDate(u.createdAt)}</td>
                  <td className={td}>
                    {u.orders > 0 ? (
                      <Link href={`/admin/orders?q=${encodeURIComponent(u.email)}`} className="underline underline-offset-4">
                        {u.orders}
                      </Link>
                    ) : (
                      0
                    )}
                  </td>
                  <td className={td}>{formatPrice(u.spent)}</td>
                  <td className={td}>
                    <span className={`px-2 py-0.5 text-[11px] font-medium ${u.role === "admin" ? "bg-ink text-paper" : "bg-line text-muted"}`}>
                      {u.role === "admin" ? "Admin" : "Customer"}
                    </span>
                  </td>
                  <td className={`${td} text-right`}>
                    {u.id === me.id ? (
                      <span className="text-xs text-muted">You</span>
                    ) : (
                      <form action={setRoleAction}>
                        <input type="hidden" name="id" value={u.id} />
                        <input type="hidden" name="role" value={u.role === "admin" ? "customer" : "admin"} />
                        <ConfirmButton
                          message={u.role === "admin" ? `Remove admin access from ${u.name}?` : `Give ${u.name} full admin access?`}
                          className="text-[12px] underline underline-offset-4"
                        >
                          {u.role === "admin" ? "Remove admin" : "Make admin"}
                        </ConfirmButton>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="p-8 text-center text-[13px] text-muted">No customers yet.</p>}
        </div>
      </Panel>
    </>
  );
}
