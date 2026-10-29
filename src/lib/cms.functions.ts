import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "./cms-auth.server";
import { categorySchema, productSchema, idSchema, MAX_UPLOAD_BYTES } from "./cms-schema";
import { cleanAdminImage } from "./cms-image.server";
import { readHeroSlides } from "./hero-slides.server";
import { assertCanDeleteHeroSlide, heroAltSchema, heroImageUrlSchema } from "./hero-slides";

export const getAdminData = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
  const [products,categories,images] = await Promise.all([db.from("products").select("*").order("display_order"),db.from("categories").select("*").order("display_order"),db.from("product_images").select("*").order("display_order")]);
  if (products.error || categories.error || images.error) throw new Error("Unable to load catalogue.");
  return { products: products.data ?? [], categories: (categories.data ?? []).map((cat) => ({ ...cat, count: (products.data ?? []).filter((p) => p.category_id === cat.id).length })), images: images.data ?? [] };
});
export const saveCategory = createServerFn({ method: "POST" }).inputValidator(categorySchema).handler(async ({ data }) => {
  await requireAdmin(); const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
  const { id, ...values } = data;
  const result = id ? await db.from("categories").update(values).eq("id",id) : await db.from("categories").insert(values);
  if (result.error) throw new Error("Category could not be saved. Check the unique slug."); return { ok: true };
});
export const deleteCategory = createServerFn({ method: "POST" }).inputValidator(idSchema).handler(async ({ data }) => {
  await requireAdmin(); const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
  const { count,error } = await db.from("products").select("id",{count:"exact",head:true}).eq("category_id",data);
  if (error || count !== 0) throw new Error("Reassign or delete all products in this category before deleting it.");
  const result = await db.from("categories").delete().eq("id",data); if(result.error) throw new Error("Category still has assigned products."); return {ok:true};
});
export const saveProduct = createServerFn({ method: "POST" }).inputValidator(productSchema).handler(async ({ data }) => {
  await requireAdmin(); const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
  const {id,...values}=data;
  if(id) { const old=await db.from("products").select("slug").eq("id",id).single(); if(old.data?.slug!==data.slug) throw new Error("Existing product slugs are locked to preserve links."); }
  const result=id ? await db.from("products").update({...values,updated_at:new Date().toISOString()}).eq("id",id).select().single() : await db.from("products").insert(values).select().single();
  if(result.error || !result.data) throw new Error("Product could not be saved. Check the unique slug and category."); return result.data;
});
export const deleteProduct = createServerFn({method:"POST"}).inputValidator(idSchema).handler(async({data})=>{
  await requireAdmin(); const {supabaseAdmin:db}=await import("@/integrations/supabase/client.server");
  const {data:images,error:readError}=await db.from("product_images").select("filename").eq("product_id",data);
  if(readError) throw new Error("Unable to read product photos.");
  const files=(images??[]).map(i=>i.filename).filter(Boolean);
  const result=await db.from("products").delete().eq("id",data); if(result.error) throw new Error("Unable to delete product.");
  // Record is gone first, so a storage hiccup can only leave orphaned files, never broken images.
  if(files.length) await db.storage.from("product-images").remove(files);
  return {ok:true};
});
export const uploadImage = createServerFn({method:"POST"}).inputValidator((input: FormData)=>{ if(!(input instanceof FormData)) throw new Error("Invalid upload"); return input; }).handler(async({data})=>{
  await requireAdmin(); const {supabaseAdmin:db}=await import("@/integrations/supabase/client.server");
  const productId=idSchema.parse(data.get("product_id")); const file=data.get("file");
  if(!(file instanceof File) || file.type!=="image/jpeg" || file.size>MAX_UPLOAD_BYTES) throw new Error("Please upload an optimized JPEG under 200 KB.");
  const product=await db.from("products").select("id").eq("id",productId).single(); if(!product.data) throw new Error("Save the product first.");
   const clean=await cleanAdminImage(file);
  const filename=`${crypto.randomUUID()}.jpg`; const url=`/api/public/product-photo/${filename}`;
  const stored=await db.storage.from("product-images").upload(filename,clean,{contentType:"image/jpeg"}); if(stored.error) throw new Error("Image upload failed.");
  const order=z.number().int().min(0).max(10000).parse(Number(data.get("display_order")??0));
  const result=await db.from("product_images").insert({product_id:productId,image_url:url,filename,alt_text:String(data.get("alt_text")??"").slice(0,180),display_order:order}).select().single();
  if(result.error){ await db.storage.from("product-images").remove([filename]); throw new Error("Unable to attach photo."); } return result.data;
});
export const deleteImage = createServerFn({method:"POST"}).inputValidator(idSchema).handler(async({data})=>{
  await requireAdmin(); const {supabaseAdmin:db}=await import("@/integrations/supabase/client.server");
  const image=await db.from("product_images").select("*").eq("id",data).single(); if(!image.data) throw new Error("Photo not found.");
  const result=await db.from("product_images").delete().eq("id",data); if(result.error) throw new Error("Could not delete photo.");
  await db.from("products").update({thumbnail_url:""}).eq("id",image.data.product_id).eq("thumbnail_url",image.data.image_url);
  if(image.data.filename) await db.storage.from("product-images").remove([image.data.filename]);
  return {ok:true};
});

export const getHeroSlides = createServerFn({ method: "GET" }).handler(() => readHeroSlides());
export const getAdminHeroSlides = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
  const { data, error } = await db.from("hero_slides").select("*").order("sort_order").order("created_at");
  if (error) throw new Error("Unable to load hero photos.");
  return data ?? [];
});
export const uploadHeroPhoto = createServerFn({ method: "POST" }).inputValidator((data: FormData) => {
  if (!(data instanceof FormData)) throw new Error("Invalid upload.");
  return data;
}).handler(async ({ data }) => {
  await requireAdmin();
  const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
  const clean = await cleanAdminImage(data.get("file"));
  const alt = heroAltSchema.parse(data.get("alt_text") ?? undefined);
  const filename = `${crypto.randomUUID()}.jpg`;
  const stored = await db.storage.from("product-images").upload(filename, clean, { contentType: "image/jpeg" });
  if (stored.error) throw new Error("Photo upload failed.");
  const added = await db.rpc("append_hero_slide", { photo_url: `/api/public/hero-photo/${filename}`, photo_alt: alt });
  if (added.error) { await db.storage.from("product-images").remove([filename]); throw new Error("Unable to add hero photo."); }
  return added.data;
});
export const updateHeroSlideAlt = createServerFn({ method: "POST" }).inputValidator(z.object({ id: idSchema, alt_text: heroAltSchema })).handler(async ({ data }) => {
  await requireAdmin();
  const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
  const result = await db.from("hero_slides").update({ alt_text: data.alt_text }).eq("id", data.id).select("id").single();
  if (result.error) throw new Error("Unable to save photo description.");
  return { ok: true };
});
export const updateHeroSlidesOrder = createServerFn({ method: "POST" }).inputValidator(z.object({ ordered_ids: z.array(idSchema).min(1).refine(ids => new Set(ids).size === ids.length) })).handler(async ({ data }) => {
  await requireAdmin();
  const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
  const result = await db.rpc("reorder_hero_slides", data);
  if (result.error) throw new Error("Photo list changed. Refresh and try again.");
  return { ok: true };
});
export const deleteHeroSlide = createServerFn({ method: "POST" }).inputValidator(z.object({ id: idSchema })).handler(async ({ data }) => {
  await requireAdmin();
  const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
  const { count, error } = await db.from("hero_slides").select("id", { count: "exact", head: true });
  if (error || count === null) throw new Error("Unable to read hero photos.");
  assertCanDeleteHeroSlide(count);
  // Database locking repeats the safeguard atomically for concurrent requests.
  const result = await db.rpc("remove_hero_slide", { slide_id: data.id });
  if (result.error) throw new Error(result.error.message.includes("Minimum 1") ? "Cannot delete the last photo. Minimum 1 photo required." : "Unable to remove photo.");
  // Retain the private object: it may be shared or being appended concurrently.
  // Public storage access is revoked automatically when its last slide is removed.
  return { ok: true };
});