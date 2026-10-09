import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { userForSession } from "./db";

export const SESSION_COOKIE = "neend_session";

export async function currentUser() {
  const jar = await cookies();
  return userForSession(jar.get(SESSION_COOKIE)?.value);
}

/** Use at the top of every admin page and admin action — layouts alone don't guard server actions. */
export async function requireAdmin() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/");
  return user;
}
