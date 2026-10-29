import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { products as defaultProducts } from "@/data/handlair";

export const FEATURED_SLOTS = 6;

export type FeaturedProduct = {
  slot: number;
  slug: string;
  name: string;
  summary: string;
  image: string;
};

function defaults(): FeaturedProduct[] {
  return defaultProducts.slice(0, FEATURED_SLOTS).map((p, i) => ({
    slot: i + 1,
    slug: p.slug,
    name: p.name,
    summary: p.summary,
    image: p.image,
  }));
}

/** Fills any unassigned or unreadable slot with the original homepage product. */
export function fillFeaturedSlots(rows: FeaturedProduct[]): FeaturedProduct[] {
  const fallback = defaults();
  return fallback.map((item) => {
    const found = rows.find((row) => row.slot === item.slot);
    return found ?? item;
  });
}

export async function readFeaturedProducts(): Promise<FeaturedProduct[]> {
  try {
    const key = process.env["SUPABASE_ANON_KEY"] ?? process.env["SUPABASE_PUBLISHABLE_KEY"];
    const url = process.env["SUPABASE_URL"];
    if (!key || !url) throw new Error("unavailable");
    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
            h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const { data, error } = await client
      .from("featured_products")
      .select(
        "slot_number, products(slug, name, summary, thumbnail_url, product_images(filename, image_url, display_order))",
      )
      .order("slot_number");
    if (error) throw error;
    const rows: FeaturedProduct[] = [];
    for (const row of data ?? []) {
      const p = row.products;
      if (!p) continue;
      const photo = [...(p.product_images ?? [])].sort(
        (a, b) => a.display_order - b.display_order,
      )[0];
      const photoUrl = photo
        ? photo.filename
          ? `/api/public/product-photo/${photo.filename}`
          : photo.image_url
        : "";
      rows.push({
        slot: row.slot_number,
        slug: p.slug,
        name: p.name,
        summary: p.summary,
        image: p.thumbnail_url || photoUrl,
      });
    }
    return fillFeaturedSlots(rows);
  } catch {
    return defaults();
  }
}
