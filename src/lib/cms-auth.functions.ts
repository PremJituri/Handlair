import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminSession, requireAdmin, signInAdmin } from "./cms-auth.server";

export const login = createServerFn({ method: "POST" }).inputValidator(z.object({ username: z.string().trim().min(1).max(100), password: z.string().min(1).max(200) })).handler(({ data }) => signInAdmin(data.username, data.password));
export const verifyAuth = createServerFn({ method: "GET" }).handler(async () => {
  try { return await requireAdmin(); } catch { return null; }
});
export const logout = createServerFn({ method: "POST" }).handler(async () => { const session = await adminSession(); await session.clear(); return { ok: true }; });