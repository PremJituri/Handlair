import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "./cms-auth.server";
import { categorySchema, productSchema, idSchema, MAX_UPLOAD_BYTES } from "./cms-schema";

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
  if(files.length){ const removed=await db.storage.from("product-images").remove(files); if(removed.error) throw new Error("Photo deletion failed. Product has been retained."); }
  const result=await db.from("products").delete().eq("id",data); if(result.error) throw new Error("Unable to delete product."); return {ok:true};
});
export const uploadImage = createServerFn({method:"POST"}).inputValidator((input: FormData)=>{ if(!(input instanceof FormData)) throw new Error("Invalid upload"); return input; }).handler(async({data})=>{
  await requireAdmin(); const {supabaseAdmin:db}=await import("@/integrations/supabase/client.server");
  const productId=idSchema.parse(data.get("product_id")); const file=data.get("file");
  if(!(file instanceof File) || file.type!=="image/jpeg" || file.size>MAX_UPLOAD_BYTES) throw new Error("Please upload an optimized JPEG under 200 KB.");
  const product=await db.from("products").select("id").eq("id",productId).single(); if(!product.data) throw new Error("Save the product first.");
  const bytes=new Uint8Array(await file.arrayBuffer());
  if(bytes[0]!==255 || bytes[1]!==216) throw new Error("Invalid JPEG file.");
  const jpeg=await import("jpeg-js");
  const decoded=jpeg.decode(bytes,{useTArray:true,maxResolutionInMP:4,maxMemoryUsageInMB:64});
  if(decoded.width>1920 || decoded.height>3840) throw new Error("Image dimensions exceed the upload limit.");
  // Re-encoding on the server strips EXIF/GPS even for manipulated client uploads.
  const clean=jpeg.encode(decoded,85).data;
  if(clean.length>MAX_UPLOAD_BYTES) throw new Error("Photo is too detailed. Please choose a smaller image.");
  const filename=`${crypto.randomUUID()}.jpg`; const url=`/api/public/product-photo/${filename}`;
  const stored=await db.storage.from("product-images").upload(filename,clean,{contentType:"image/jpeg"}); if(stored.error) throw new Error("Image upload failed.");
  const order=z.number().int().min(0).max(10000).parse(Number(data.get("display_order")??0));
  const result=await db.from("product_images").insert({product_id:productId,image_url:url,filename,alt_text:String(data.get("alt_text")??"").slice(0,180),display_order:order}).select().single();
  if(result.error){ await db.storage.from("product-images").remove([filename]); throw new Error("Unable to attach photo."); } return result.data;
});
export const deleteImage = createServerFn({method:"POST"}).inputValidator(idSchema).handler(async({data})=>{
  await requireAdmin(); const {supabaseAdmin:db}=await import("@/integrations/supabase/client.server");
  const image=await db.from("product_images").select("*").eq("id",data).single(); if(!image.data) throw new Error("Photo not found.");
  if(image.data.filename){ const removed=await db.storage.from("product-images").remove([image.data.filename]); if(removed.error) throw new Error("Could not delete photo."); }
  await db.from("products").update({thumbnail_url:""}).eq("id",image.data.product_id).eq("thumbnail_url",image.data.image_url);
  const result=await db.from("product_images").delete().eq("id",data); if(result.error) throw new Error("Could not delete photo."); return {ok:true};
});