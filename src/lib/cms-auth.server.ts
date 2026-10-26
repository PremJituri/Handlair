import { useSession as createEncryptedSession, getRequest, getRequestHeader, setResponseHeader } from "@tanstack/react-start/server";
import { compare, hash } from "bcryptjs";
import { createHash } from "node:crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

type AdminSession = { adminId?: string; username?: string };
export function adminSession() {
  const password = process.env['SESSION_SECRET'];
  if (!password) throw new Error("Admin access is not configured.");
  return createEncryptedSession<AdminSession>({ password, name: "handlair-admin", maxAge: 60 * 60 * 24 * 7, cookie: { httpOnly: true, secure: new URL(getRequest().url).protocol === "https:", sameSite: "strict", path: "/" } });
}
export async function requireAdmin() {
  setResponseHeader("Cache-Control", "private, no-store");
  const session = await adminSession();
  if (!session.data.adminId) throw new Error("Please sign in to the admin area.");
  const { data, error } = await supabaseAdmin.from("admin_users").select("id,username").eq("id", session.data.adminId).maybeSingle();
  if (error || !data) throw new Error("Please sign in to the admin area.");
  return data;
}
export async function signInAdmin(username: string, password: string) {
  const ip = getRequestHeader("cf-connecting-ip") ?? getRequestHeader("x-forwarded-for") ?? "unknown";
  const key = createHash("sha256").update(`${ip}:${username.toLowerCase()}`).digest("hex");
  const { data: allowed, error: limitError } = await supabaseAdmin.rpc("check_admin_login_limit", { login_key: key });
  if (limitError || !allowed) return { ok: false, error: "Too many attempts. Please try again in 15 minutes." };
  let { data: user } = await supabaseAdmin.from("admin_users").select("*").eq("username", username).maybeSingle();
  // Bootstrap only the explicitly configured account, after checking its secret.
  if (!user && username === (process.env['ADMIN_USERNAME'] ?? "admin")) {
    const expectedHash = process.env['ADMIN_PASSWORD_HASH'];
    const expected = process.env['ADMIN_PASSWORD'];
    const passwordHash = expectedHash ?? (expected ? await hash(expected, 10) : undefined);
    if (passwordHash && await compare(password, passwordHash)) {
      const { data } = await supabaseAdmin.from("admin_users").upsert({ username, password_hash: passwordHash }, { onConflict: "username", ignoreDuplicates: true }).select().maybeSingle();
      user = data ?? (await supabaseAdmin.from("admin_users").select("*").eq("username", username).maybeSingle()).data;
    }
  }
  if (!user || !await compare(password, user.password_hash)) return { ok: false, error: "Incorrect username or password." };
  const session = await adminSession();
  await session.update({ adminId: user.id, username: user.username });
  return { ok: true, error: "" };
}