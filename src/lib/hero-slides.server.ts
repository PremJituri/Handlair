import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { heroSlides } from "@/data/hero-slideshow";

export function heroPublicClient() {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_ANON_KEY'] ?? process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error("Photo connection unavailable.");
  return createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => {
    const headers = new Headers(init?.headers);
    if (key.startsWith("sb_")) headers.delete("Authorization");
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  } } });
}
export async function readHeroSlides() {
  try {
    const { data, error } = await heroPublicClient().from("hero_slides").select("id,image_url,alt_text,sort_order,created_at").order("sort_order").order("created_at");
    if (error || !data?.length) throw new Error("Photos unavailable.");
    return data;
  } catch {
    return heroSlides.map((slide, sort_order) => ({ id: `fallback-${sort_order}`, image_url: slide.src, alt_text: slide.alt, sort_order, created_at: "" }));
  }
}