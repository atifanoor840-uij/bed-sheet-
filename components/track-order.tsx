"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { trackOrder } from "@/app/actions";
import { Field } from "./ui";
import { formatPrice, photos } from "@/lib/products";

const steps = ["Confirmed", "Packed", "Shipped", "Delivered"];

export default function TrackOrder({ initialId, initialPhone }: { initialId: string; initialPhone: string }) {
  const [state, action, pending] = useActionState(trackOrder, undefined);
  const order = state?.order;
  const current = order ? steps.indexOf(order.status) : -1;

  return (
    <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 md:px-10 lg:grid-cols-2 lg:gap-20 lg:py-20">
      <div>
        <p className="label mb-4 text-muted">Help</p>
        <h1 className="text-4xl font-light tracking-[-0.02em] md:text-5xl">Track your order</h1>
        <p className="mt-4 text-[14px] text-muted">Enter the order number from your confirmation and the phone number used at checkout.</p>

        <form action={action} className="mt-8 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field label="Order number">
            <input name="id" defaultValue={initialId} required placeholder="e.g. NE123456" className="field" />
          </Field>
          <Field label="Phone">
            <input name="phone" type="tel" defaultValue={initialPhone} required placeholder="03xx xxxxxxx" className="field" />
          </Field>
          <button disabled={pending} className="btn">
            {pending ? "…" : "Track"}
          </button>
        </form>

        {state?.error && (
          <p className="mt-8 border border-line p-6 text-[14px] text-muted">
            {state.error} Check the details, or{" "}
            <Link href="/contact" className="text-ink underline underline-offset-4">
              contact us
            </Link>
            .
          </p>
        )}

        {order && (
          <div className="mt-10 border border-line p-6">
            <div className="flex flex-wrap justify-between gap-2 text-[14px]">
              <p className="font-medium">#{order.id}</p>
              <p className="text-muted">{formatPrice(order.total)}</p>
            </div>
            {order.status === "Cancelled" ? (
              <p className="mt-6 text-[14px] text-sale">This order was cancelled.</p>
            ) : (
              <ol className="mt-8 grid grid-cols-4">
                {steps.map((s, i) => (
                  <li key={s} className="text-[12px]">
                    <div className={`h-1 ${i <= current ? "bg-ink" : "bg-line"}`} />
                    <p className={`mt-3 ${i <= current ? "text-ink" : "text-muted"}`}>{s}</p>
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-8 text-[14px] text-muted">
              Delivering to {order.name}, {order.line}, {order.city}.
            </p>
          </div>
        )}
      </div>

      <div className="relative hidden aspect-[4/5] bg-stone lg:block">
        <Image src={photos.warehouse} alt="Orders ready to ship" fill sizes="50vw" className="object-cover" />
      </div>
    </div>
  );
}
