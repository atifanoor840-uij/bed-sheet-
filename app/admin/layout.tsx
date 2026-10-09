import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/app/actions";
import { requireAdmin } from "@/lib/auth";
import AdminNav from "@/components/admin/nav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: { default: "Admin", template: "%s — Neend Admin" }, robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-stone lg:grid lg:grid-cols-[232px_1fr]">
      <aside className="flex flex-col border-b border-line bg-paper lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/admin" className="text-[15px] font-medium tracking-[0.35em]">
            NEEND
          </Link>
          <span className="label text-[10px] text-muted">Admin</span>
        </div>
        <AdminNav />
        <div className="mt-auto hidden border-t border-line px-5 py-5 text-[13px] lg:block">
          <p className="truncate">{admin.name}</p>
          <p className="truncate text-xs text-muted">{admin.email}</p>
          <div className="mt-4 flex gap-4">
            <Link href="/" className="text-muted hover:text-ink">
              View store
            </Link>
            <form action={logout}>
              <button className="text-muted hover:text-ink">Sign out</button>
            </form>
          </div>
        </div>
      </aside>
      <main className="min-w-0 px-5 py-8 md:px-10">{children}</main>
    </div>
  );
}
