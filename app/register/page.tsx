import type { Metadata } from "next";
import AuthForm from "@/components/auth-form";
import { photos } from "@/lib/products";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return <AuthForm mode="register" image={photos.register} />;
}
