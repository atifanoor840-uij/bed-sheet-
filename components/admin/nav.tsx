"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Store, Users } from "lucide-react";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/users", label: "Customers", icon: Users },
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0">
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? path === href : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-3 px-3 py-2.5 text-[13px] ${active ? "bg-ink text-paper" : "text-muted hover:bg-stone hover:text-ink"}`}
          >
            <Icon size={16} strokeWidth={1.6} />
            {label}
          </Link>
        );
      })}
      <Link href="/" className="flex shrink-0 items-center gap-3 px-3 py-2.5 text-[13px] text-muted hover:bg-stone hover:text-ink lg:hidden">
        <Store size={16} strokeWidth={1.6} />
        Store
      </Link>
    </nav>
  );
}
