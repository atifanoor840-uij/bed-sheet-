"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const cols = [
  {
    title: "Shop",
    links: [
      ["Bedsheets", "/shop?c=Bedsheets"],
      ["Comforter Sets", "/shop?c=Comforter+Sets"],
      ["Duvet Covers", "/shop?c=Duvet+Covers"],
      ["Pillow Covers", "/shop?c=Pillow+Covers"],
      ["Fitted Sheets", "/shop?c=Fitted+Sheets"],
      ["New in", "/shop?new=1"],
    ],
  },
  {
    title: "Help",
    links: [
      ["Track order", "/track-order"],
      ["Shipping", "/shipping"],
      ["Exchanges", "/exchanges"],
      ["Size guide", "/size-guide"],
      ["FAQs", "/faq"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Care guide", "/care-guide"],
      ["Wholesale", "/wholesale"],
      ["Contact", "/contact"],
      ["My account", "/account"],
    ],
  },
];

export default function Footer() {
  const [done, setDone] = useState(false);

  return (
    <footer className="border-t border-sand-deep bg-sand">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 sm:px-6 sm:grid-cols-2 md:px-10 md:py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="sm:col-span-2 lg:col-span-1 max-w-sm">
          <p className="text-lg font-medium tracking-[0.42em]">NEEND</p>
          <p className="mt-5 text-[13px] font-medium">Newsletter</p>
          <p className="mt-1 text-[13px] text-muted">New collections and early release access.</p>
          {done ? (
            <p className="mt-4 border-b border-ink py-2.5 text-[13px]">Thank you — you&rsquo;re on the list.</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
              }}
              className="mt-4 flex border-b border-ink"
            >
              <input required type="email" placeholder="Email address" className="min-w-0 flex-1 bg-transparent py-2.5 text-base sm:text-[13px] outline-none placeholder:text-muted" />
              <button aria-label="Subscribe" className="p-2 -mr-1 hover:opacity-70 transition-opacity">
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </form>
          )}
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="mb-3 text-[13px] font-medium sm:mb-4">{c.title}</p>
            <ul className="space-y-2 text-[13px] text-muted sm:space-y-2.5">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-ink transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-sand-deep">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-2.5 px-4 py-5 text-xs text-muted sm:px-6 sm:flex-row md:px-10">
          <p>© 2026 Neend Home, Lahore</p>
          <p>Cash on delivery · Visa · Mastercard · JazzCash · Easypaisa</p>
        </div>
      </div>
    </footer>
  );
}
