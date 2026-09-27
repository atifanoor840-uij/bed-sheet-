import type { Metadata } from "next";
import AuthForm from "@/components/auth-form";
import { photos } from "@/lib/products";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return <AuthForm mode="login" image={photos.login} />;
}
