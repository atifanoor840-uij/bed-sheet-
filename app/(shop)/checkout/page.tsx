import type { Metadata } from "next";
import CheckoutForm from "@/components/checkout-form";
import { currentUser } from "@/lib/auth";
import { PROMO } from "@/lib/products";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ promo?: string }> }) {
  const { promo } = await searchParams;
  const user = await currentUser();
  return (
    <CheckoutForm
      promo={promo?.toUpperCase() === PROMO.code ? PROMO.code : undefined}
      user={user ? { name: user.name, email: user.email, phone: user.phone } : null}
    />
  );
}
