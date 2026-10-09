import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthForm from "@/components/auth-form";
import { currentUser } from "@/lib/auth";
import { photos } from "@/lib/products";

export const metadata: Metadata = { title: "Create account" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next: raw } = await searchParams;
  // Only same-site paths, so the link can't bounce users to another website.
  const next = raw?.startsWith("/") && !raw.startsWith("//") ? raw : undefined;
  if (await currentUser()) redirect(next ?? "/account");
  return <AuthForm mode="register" image={photos.register} next={next} />;
}
