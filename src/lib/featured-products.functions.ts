import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "./cms-auth.server";
import { readFeaturedProducts } from "./featured-products.server";

export const featuredSlotsSchema = z
  .array(z.object({ slot_number: z.number().int().min(1).max(6), product_id: z.string().uuid() }))
  .length(6)
  .refine((rows) => new Set(rows.map((r) => r.slot_number)).size === 6, "Each slot must be set once.");

export const getFeaturedProducts = createServerFn({ method: "GET" }).handler(() =>
  readFeaturedProducts(),
);

export const getAdminFeaturedSlots = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
  const [, result] = await Promise.all([
    requireAdmin(),
    db.from("featured_products").select("slot_number, product_id").order("slot_number"),
  ]);
  if (result.error) throw new Error("Unable to load featured range.");
  return result.data ?? [];
});

export const saveFeaturedProducts = createServerFn({ method: "POST" })
  .inputValidator(featuredSlotsSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
    const ids = [...new Set(data.map((r) => r.product_id))];
    const check = await db.from("products").select("id").in("id", ids).eq("is_published", true);
    if (check.error || (check.data ?? []).length !== ids.length)
      throw new Error("Every slot must use a published product.");
    const now = new Date().toISOString();
    const result = await db
      .from("featured_products")
      .upsert(data.map((r) => ({ ...r, updated_at: now })), { onConflict: "slot_number" });
    if (result.error) throw new Error("Featured range could not be saved.");
    return { ok: true };
  });
