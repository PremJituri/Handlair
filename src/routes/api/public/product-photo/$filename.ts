import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireAdmin } from "@/lib/cms-auth.server";
export const Route=createFileRoute("/api/public/product-photo/$filename")({server:{handlers:{GET:async({params})=>{
  if(!/^[a-f0-9-]{36}\.jpg$/.test(params.filename)) return new Response("Not found",{status:404});
  const url=process.env['SUPABASE_URL']; const key=process.env['SUPABASE_ANON_KEY']??process.env['SUPABASE_PUBLISHABLE_KEY'];
  if(!url||!key) return new Response("Unavailable",{status:503});
  const db=createClient<Database>(url,key,{auth:{persistSession:false},global:{fetch:(input,init)=>{const h=new Headers(init?.headers);if(key.startsWith("sb_"))h.delete("Authorization");h.set("apikey",key);return fetch(input,{...init,headers:h});}}});
  const {data,error}=await db.storage.from("product-images").download(params.filename);
  if(error||!data){
    try {
      await requireAdmin();
      const {supabaseAdmin}=await import("@/integrations/supabase/client.server");
      const photo=await supabaseAdmin.storage.from("product-images").download(params.filename);
      if(photo.data)return new Response(photo.data,{headers:{"Content-Type":"image/jpeg","Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
    } catch { /* Only an authenticated administrator can read draft photos. */ }
    return new Response("Not found",{status:404});
  }
  return new Response(data,{headers:{"Content-Type":"image/jpeg","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
}}}});