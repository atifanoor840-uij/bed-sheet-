"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { FREE_SHIPPING, SHIPPING_FEE, useCart } from "./cart";
import { useCatalog } from "./catalog";
import { Field } from "./ui";
import { placeOrder } from "@/app/actions";
import { formatPrice, photos, PROMO } from "@/lib/products";

const cities = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Hyderabad", "Other"];
const payments = [
  { id: "cod", label: "Cash on delivery", note: "Pay in cash when your order arrives." },
  { id: "bank", label: "Bank transfer", note: "Account details are sent with your order confirmation." },
  { id: "wallet", label: "JazzCash / Easypaisa", note: "We'll send a payment request to your phone number." },
];

type CheckoutUser = { name: string; email: string; phone?: string } | null;

export default function CheckoutForm({ promo, user }: { promo?: string; user: CheckoutUser }) {
  const { lines, subtotal, clear } = useCart();
  const { get: getProduct } = useCatalog();
  const [payment, setPayment] = useState("cod");
  const [state, action, pending] = useActionState(placeOrder, undefined);
  const placed = state?.order;

  useEffect(() => {
    if (!placed) return;
    clear();
    window.scrollTo(0, 0);
  }, [placed, clear]);

  const discount = promo ? Math.round(subtotal * PROMO.rate) : 0;
  const shipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
  const total = subtotal - discount + shipping;

  if (placed) {
    return (
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 md:px-10 lg:grid-cols-2 lg:gap-20 lg:py-20">
        <div className="self-center">
          <p className="label mb-4 text-muted">Order #{placed.id}</p>
          <h1 className="text-4xl font-light tracking-[-0.02em] md:text-5xl">Thank you, {placed.name.split(" ")[0]}.</h1>
          <p className="mt-6 max-w-md text-[15px] text-muted">
            Your order is confirmed. We&rsquo;ll call {placed.phone} to confirm delivery, usually within a few hours.
          </p>
          <dl className="mt-10 space-y-3 border-t border-line pt-6 text-[14px]">
            <div className="flex justify-between">
              <dt className="text-muted">Total</dt>
              <dd>{formatPrice(placed.total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Payment</dt>
              <dd>{placed.payment}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Deliver to</dt>
              <dd className="text-right">
                {placed.line}, {placed.city}
              </dd>
            </div>
          </dl>
          <div className="mt-10 flex flex-wrap gap-2">
            <Link href={`/track-order?id=${placed.id}&phone=${encodeURIComponent(placed.phone)}`} className="btn">
              Track order
            </Link>
            <Link href="/shop" className="btn btn-outline">
              Continue shopping
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/5] bg-stone">
          <Image src={photos.thanks} alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-md px-5 py-28 text-center">
        <h1 className="text-4xl font-light">Nothing to check out</h1>
        <p className="mt-4 text-[14px] text-muted">Your cart is empty.</p>
        <Link href="/shop" className="btn mt-8">
          Shop bedding
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 md:px-10 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
      <input type="hidden" name="cart" value={JSON.stringify(lines)} />
      {promo && <input type="hidden" name="promo" value={promo} />}
      <div>
        <h1 className="text-4xl font-light tracking-[-0.02em]">Checkout</h1>
        {!user && (
          <p className="mt-4 text-[14px] text-muted">
            Have an account?{" "}
            <Link href="/login" className="text-ink underline underline-offset-4">
              Sign in
            </Link>{" "}
            for faster checkout.
          </p>
        )}

        <h2 className="mb-4 mt-10 text-lg">Contact</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email">
            <input name="email" type="email" required defaultValue={user?.email} autoComplete="email" className="field" />
          </Field>
          <Field label="Phone">
            <input name="phone" type="tel" required defaultValue={user?.phone} autoComplete="tel" placeholder="03xx xxxxxxx" className="field" />
          </Field>
        </div>

        <h2 className="mb-4 mt-10 text-lg">Delivery address</h2>
        <div className="grid gap-4">
          <Field label="Full name">
            <input name="name" required defaultValue={user?.name} autoComplete="name" className="field" />
          </Field>
          <Field label="Address">
            <input name="address" required autoComplete="street-address" placeholder="House, street, area" className="field" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City">
              <select name="city" required className="field" defaultValue="Lahore">
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Postal code (optional)">
              <input name="postal" autoComplete="postal-code" className="field" />
            </Field>
          </div>
        </div>

        <h2 className="mb-4 mt-10 text-lg">Payment</h2>
        <div className="border-t border-line">
          {payments.map((p) => (
            <label key={p.id} className="flex cursor-pointer gap-4 border-b border-line py-4">
              <input type="radio" name="payment" value={p.id} checked={payment === p.id} onChange={() => setPayment(p.id)} className="mt-1 accent-[var(--ink)]" />
              <span>
                <span className="block text-[14px]">{p.label}</span>
                <span className="text-[13px] text-muted">{p.note}</span>
              </span>
            </label>
          ))}
        </div>

        {state?.error && <p className="mt-8 border border-sale p-4 text-[14px] text-sale">{state.error}</p>}
        <button disabled={pending} className="btn mt-10 w-full sm:w-auto">
          {pending ? "Placing order…" : `Place order — ${formatPrice(total)}`}
        </button>
      </div>

      <aside className="self-start bg-sand p-6 md:p-8 lg:sticky lg:top-24">
        <h2 className="text-lg">Your order</h2>
        <ul className="mt-6 space-y-4">
          {lines.map((l) => {
            const pr = getProduct(l.slug);
            if (!pr) return null;
            return (
              <li key={l.slug + l.size} className="flex gap-4 text-[14px]">
                <div className="relative h-20 w-16 shrink-0 bg-stone">
                  <Image src={pr.images[0]} alt={pr.name} fill sizes="64px" className="object-cover" />
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] text-paper">{l.qty}</span>
                </div>
                <div className="flex-1">
                  <p>{pr.name}</p>
                  <p className="text-xs text-muted">{l.size}</p>
                </div>
                <p>{formatPrice(pr.price * l.qty)}</p>
              </li>
            );
          })}
        </ul>
        <dl className="mt-6 space-y-3 border-t border-sand-deep pt-6 text-[14px]">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted">Promo ({PROMO.code})</dt>
              <dd>−{formatPrice(discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-sand-deep pt-4 text-[16px]">
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
      </aside>
    </form>
  );
}
