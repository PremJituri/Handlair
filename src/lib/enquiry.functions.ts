import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { enquirySchema } from "./enquiry-schema";
import { requireAdmin } from "./cms-auth.server";

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => enquirySchema.parse(input))
  .handler(async ({ data }) => {
    // Hidden "website" field is a bot trap; quietly accept without storing.
    if (data.website) return { ok: true as const };
    const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
    // Reuse the shared 15-minute attempt limiter (10 per window) keyed by visitor IP.
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const { createHash } = await import("node:crypto");
    const ip =
      getRequestHeader("cf-connecting-ip") ??
      getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const key = createHash("sha256").update(`enquiry:${ip}`).digest("hex");
    const { data: allowed, error: limitError } = await db.rpc("check_admin_login_limit", {
      login_key: key,
    });
    if (limitError || !allowed) return { ok: false as const, reason: "rate_limited" as const };
    const { error } = await db.from("enquiries").insert({
      first_name: data.firstName,
      last_name: data.lastName,
      company: data.company,
      email: data.email,
      mobile: data.mobile,
      city: data.city,
      country: data.country,
      message: data.message,
    });
    if (error) return { ok: false as const, reason: "failed" as const };
    return { ok: true as const };
  });

export const ENQUIRIES_PAGE_SIZE = 50;

export const getEnquiries = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ page: z.number().int().min(1).max(100000).default(1) }).parse(input ?? {}),
  )
  .handler(async ({ data: { page } }) => {
    await requireAdmin();
    const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
    const from = (page - 1) * ENQUIRIES_PAGE_SIZE;
    const { data, error, count } = await db
      .from("enquiries")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range(from, from + ENQUIRIES_PAGE_SIZE - 1);
    if (error) throw new Error("Unable to load enquiries.");
    const total = count ?? 0;
    return {
      items: data ?? [],
      total,
      page,
      pages: Math.max(1, Math.ceil(total / ENQUIRIES_PAGE_SIZE)),
    };
  });
