import { heroSlides } from "@/data/hero-slideshow";

export async function heroPublicClient() {
  // Slide list is not readable by public roles; read it with the server-only client.
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}
export async function readHeroSlides() {
  try {
    const { data, error } = await (await heroPublicClient()).from("hero_slides").select("id,image_url,alt_text,sort_order,created_at").order("sort_order").order("created_at");
    if (error || !data?.length) throw new Error("Photos unavailable.");
    return data;
  } catch {
    return heroSlides.map((slide, sort_order) => ({ id: `fallback-${sort_order}`, image_url: slide.src, alt_text: slide.alt, sort_order, created_at: "" }));
  }
}