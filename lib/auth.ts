import { cookies } from "next/headers";
import { db } from "./db";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = "pharmacy_session";

export async function login(username: string, password: string) {
  const user = await db.user.findUnique({ where: { username } });
  if (!user || !user.active) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64url");
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
  return user;
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const userId = decoded.split(":")[0];
    return db.user.findUnique({ where: { id: userId } });
  } catch {
    return null;
  }
}
