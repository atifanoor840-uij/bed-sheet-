"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount } from "./account-store";
import { Field } from "./ui";

export default function AuthForm({ mode, image }: { mode: "login" | "register"; image: string }) {
  const { signIn } = useAccount();
  const router = useRouter();
  const [error, setError] = useState("");
  const isLogin = mode === "login";

  return (
    <div className="grid min-h-[calc(100vh-98px)] lg:grid-cols-2">
      <div className="relative hidden bg-stone lg:block">
        <Image src={image} alt="" fill priority sizes="50vw" className="object-cover" />
      </div>
      <div className="flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-4xl font-light tracking-[-0.02em]">{isLogin ? "Sign in" : "Create account"}</h1>
          <p className="mt-3 text-[14px] text-muted">
            {isLogin ? "Track orders and check out faster." : "Save your details and see your order history."}
          </p>

          <form
            className="mt-10 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const email = String(f.get("email"));
              const password = String(f.get("password"));
              if (password.length < 6) return setError("Password must be at least 6 characters.");
              const name = isLogin ? email.split("@")[0] : String(f.get("name"));
              signIn({ name: name.charAt(0).toUpperCase() + name.slice(1), email, phone: String(f.get("phone") ?? "") || undefined });
              router.push("/account");
            }}
          >
            {!isLogin && (
              <Field label="Full name">
                <input name="name" required autoComplete="name" className="field" />
              </Field>
            )}
            <Field label="Email">
              <input name="email" type="email" required autoComplete="email" className="field" />
            </Field>
            {!isLogin && (
              <Field label="Phone">
                <input name="phone" type="tel" autoComplete="tel" placeholder="03xx xxxxxxx" className="field" />
              </Field>
            )}
            <Field label="Password">
              <input name="password" type="password" required autoComplete={isLogin ? "current-password" : "new-password"} className="field" />
            </Field>
            {isLogin && (
              <button type="button" className="w-fit text-[13px] text-muted underline underline-offset-4">
                Forgot password?
              </button>
            )}
            {error && <p className="text-[13px] text-sale">{error}</p>}
            <button className="btn mt-2 w-full">{isLogin ? "Sign in" : "Create account"}</button>
          </form>

          <p className="mt-8 border-t border-line pt-6 text-[14px] text-muted">
            {isLogin ? "New to Neend? " : "Already have an account? "}
            <Link href={isLogin ? "/register" : "/login"} className="text-ink underline underline-offset-4">
              {isLogin ? "Create an account" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
