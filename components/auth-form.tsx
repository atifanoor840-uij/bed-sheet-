"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { login, register } from "@/app/actions";
import { Field } from "./ui";

export default function AuthForm({ mode, image, next }: { mode: "login" | "register"; image: string; next?: string }) {
  const isLogin = mode === "login";
  const [state, action, pending] = useActionState(isLogin ? login : register, undefined);
  const q = next ? `?next=${encodeURIComponent(next)}` : "";

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

          <form action={action} className="mt-10 grid gap-4">
            {next && <input type="hidden" name="next" value={next} />}
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
              <input
                name="password"
                type="password"
                required
                minLength={isLogin ? undefined : 8}
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="field"
              />
            </Field>
            {state?.error && <p className="text-[13px] text-sale">{state.error}</p>}
            <button disabled={pending} className="btn mt-2 w-full">
              {pending ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-8 border-t border-line pt-6 text-[14px] text-muted">
            {isLogin ? "New to Neend? " : "Already have an account? "}
            <Link href={(isLogin ? "/register" : "/login") + q} className="text-ink underline underline-offset-4">
              {isLogin ? "Create an account" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
