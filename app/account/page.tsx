"use client";

import Image from "next/image";
import Link from "next/link";
import { useAccount } from "@/components/account-store";
import { formatPrice, getProduct, photos } from "@/lib/products";

export default function AccountPage() {
  const { user, orders, signOut } = useAccount();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-5 py-28 text-center">
        <h1 className="text-4xl font-light">My account</h1>
        <p className="mt-4 text-[14px] text-muted">Sign in to see your orders and saved details.</p>
        <div className="mt-8 flex justify-center gap-2">
          <Link href="/login" className="btn">
            Sign in
          </Link>
          <Link href="/register" className="btn btn-outline">
            Create account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="relative h-[30vh] min-h-[220px] text-paper">
        <Image src={photos.account} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative mx-auto flex h-full max-w-[1440px] items-end justify-between px-5 pb-10 md:px-10">
          <h1 className="text-4xl font-light tracking-[-0.02em] md:text-5xl">Hello, {user.name}</h1>
          <button onClick={signOut} className="label border-b border-paper pb-1">
            Sign out
          </button>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 md:px-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="mb-6 text-xl">Orders</h2>
          {orders.length === 0 ? (
            <div className="border border-line p-8">
              <p className="text-[14px] text-muted">You haven&rsquo;t placed any orders yet.</p>
              <Link href="/shop" className="btn mt-6">
                Start shopping
              </Link>
            </div>
          ) : (
            <ul className="border-t border-line">
              {orders.map((o) => (
                <li key={o.id} className="border-b border-line py-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 text-[14px]">
                    <p className="font-medium">#{o.id}</p>
                    <p className="text-muted">{new Date(o.date).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</p>
                    <p className="label bg-sand-deep px-2 py-1 text-[10px]">{o.status}</p>
                    <p>{formatPrice(o.total)}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {o.items.map((it) => {
                      const pr = getProduct(it.slug);
                      return pr ? (
                        <Link key={it.slug + it.size} href={`/product/${pr.slug}`} className="relative h-20 w-16 bg-stone" title={`${pr.name} · ${it.size} × ${it.qty}`}>
                          <Image src={pr.images[0]} alt={pr.name} fill sizes="64px" className="object-cover" />
                        </Link>
                      ) : null;
                    })}
                  </div>
                  <Link href={`/track-order?id=${o.id}`} className="mt-4 inline-block text-[13px] underline underline-offset-4">
                    Track this order
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="space-y-8">
          <div className="border border-line p-6">
            <h2 className="text-[15px] font-medium">Account details</h2>
            <p className="mt-3 text-[14px]">{user.name}</p>
            <p className="text-[14px] text-muted">{user.email}</p>
            {user.phone && <p className="text-[14px] text-muted">{user.phone}</p>}
          </div>
          <div className="border border-line p-6">
            <h2 className="text-[15px] font-medium">Default address</h2>
            <p className="mt-3 text-[14px] text-muted">
              {orders[0] ? `${orders[0].address.line}, ${orders[0].address.city}` : "Your address from your first order will appear here."}
            </p>
          </div>
          <div className="border border-line p-6">
            <h2 className="text-[15px] font-medium">Need help?</h2>
            <p className="mt-3 text-[14px] text-muted">
              <Link href="/faq" className="underline underline-offset-4">
                FAQs
              </Link>{" "}
              ·{" "}
              <Link href="/contact" className="underline underline-offset-4">
                Contact us
              </Link>
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
