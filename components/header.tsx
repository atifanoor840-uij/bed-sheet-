"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, User, X } from "lucide-react";
import { useCart } from "./cart";

const nav = [
  { href: "/shop", label: "Shop all" },
  { href: "/shop?c=Bedsheets", label: "Bedsheets" },
  { href: "/shop?c=Comforter+Sets", label: "Comforters" },
  { href: "/shop?c=Duvet+Covers", label: "Duvet covers" },
  { href: "/shop?c=Pillow+Covers", label: "Pillow covers" },
  { href: "/about", label: "About" },
];

export default function Header({ user }: { user: { name: string; role: string } | null }) {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (menu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  return (
    <>
      <div className="bg-sand-deep py-2 px-3 text-center text-[10px] sm:text-[11px] tracking-[0.12em] text-ink/80 uppercase">
        Complimentary delivery across Pakistan over Rs. 5,000 · 100% Pure Cotton
      </div>
      <header className="sticky top-0 z-40 border-b border-sand-deep bg-sand/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 md:px-10">
          <div className="flex items-center xl:hidden">
            <button
              className="p-2 -ml-2 rounded-md hover:bg-sand-deep/60 transition-colors"
              aria-label="Toggle navigation menu"
              onClick={() => setMenu((m) => !m)}
            >
              {menu ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>

          <nav className="hidden gap-6 text-[13px] xl:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="hover:underline hover:underline-offset-4 transition-colors">
                {n.label}
              </Link>
            ))}
          </nav>

          <Link href="/" className="text-base sm:text-lg font-medium tracking-[0.35em] sm:tracking-[0.42em] select-none">
            NEEND
          </Link>

          <div className="flex items-center gap-3 sm:gap-5 text-[13px]">
            <Link href="/search" aria-label="Search" className="p-1.5 hover:opacity-70 transition-opacity">
              <Search size={18} strokeWidth={1.5} />
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin" className="hidden border border-ink px-2 py-1 text-[11px] tracking-wider uppercase sm:inline">
                Admin
              </Link>
            )}
            <Link href={user ? "/account" : "/login"} className="flex items-center gap-1.5 p-1.5 hover:opacity-70 transition-opacity">
              <User size={18} strokeWidth={1.5} />
              <span className="hidden sm:inline">{user ? user.name.split(" ")[0] : "Sign in"}</span>
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-1.5 py-1 px-2 -mr-1 rounded hover:bg-sand-deep/60 transition-colors"
              aria-label="Open cart"
            >
              <span>Cart</span>
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink px-1 text-[11px] font-medium text-paper">
                {count}
              </span>
            </button>
          </div>
        </div>

        {menu && (
          <nav className="fixed inset-x-0 top-[calc(4rem+33px)] bottom-0 z-40 bg-sand/98 backdrop-blur-lg overflow-y-auto px-6 py-6 xl:hidden">
            <div className="divide-y divide-sand-deep">
              {[...nav, { href: user ? "/account" : "/login", label: user ? "My account" : "Sign in" }, { href: "/track-order", label: "Track order" }, { href: "/contact", label: "Contact us" }].map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setMenu(false)}
                  className="block py-4 text-xl sm:text-2xl font-light hover:text-muted transition-colors"
                >
                  {n.label}
                </Link>
              ))}
            </div>
            <div className="mt-8 border-t border-sand-deep pt-6 text-xs text-muted space-y-2">
              <p>Delivery: 2–4 working days nationwide</p>
              <p>Cash on delivery accepted</p>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
