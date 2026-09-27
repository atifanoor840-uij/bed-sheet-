import type { Metadata } from "next";
import CheckoutForm from "@/components/checkout-form";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ promo?: string }> }) {
  const { promo } = await searchParams;
  return <CheckoutForm promo={promo === "1"} />;
}
