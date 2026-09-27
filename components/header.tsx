"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, User, X } from "lucide-react";
import { useCart } from "./cart";
import { useAccount } from "./account-store";

const nav = [
  { href: "/shop", label: "Shop all" },
  { href: "/shop?c=Bedsheets", label: "Bedsheets" },
  { href: "/shop?c=Comforter+Sets", label: "Comforters" },
  { href: "/shop?c=Duvet+Covers", label: "Duvet covers" },
  { href: "/shop?c=Pillow+Covers", label: "Pillow covers" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const { count, setOpen } = useCart();
  const { user } = useAccount();
  const [menu, setMenu] = useState(false);

  return (
    <>
      <div className="bg-sand-deep py-2 text-center text-[11px] tracking-[0.12em] text-ink/80 uppercase">
        Season sale — every set Rs. 2,500 · Free delivery over Rs. 5,000
      </div>
      <header className="sticky top-0 z-40 border-b border-sand-deep bg-sand">
        <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-5 md:px-10">
          <nav className="hidden gap-6 text-[13px] xl:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="hover:underline hover:underline-offset-4">
                {n.label}
              </Link>
            ))}
          </nav>
          <button className="justify-self-start xl:hidden" aria-label="Menu" onClick={() => setMenu((m) => !m)}>
            {menu ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>

          <Link href="/" className="text-lg font-medium tracking-[0.42em]">
            NEEND
          </Link>

          <div className="flex items-center justify-self-end gap-5 text-[13px]">
            <Link href="/search" aria-label="Search">
              <Search size={17} strokeWidth={1.5} />
            </Link>
            <Link href={user ? "/account" : "/login"} className="flex items-center gap-1.5">
              <User size={17} strokeWidth={1.5} />
              <span className="hidden sm:inline">{user ? user.name.split(" ")[0] : "Sign in"}</span>
            </Link>
            <button onClick={() => setOpen(true)} className="flex items-center gap-1">
              Cart ({count})
            </button>
          </div>
        </div>

        {menu && (
          <nav className="border-t border-sand-deep bg-sand px-5 pb-6 xl:hidden">
            {[...nav, { href: user ? "/account" : "/login", label: user ? "My account" : "Sign in" }, { href: "/contact", label: "Contact" }].map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setMenu(false)} className="block border-b border-sand-deep py-4 text-2xl font-light">
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
