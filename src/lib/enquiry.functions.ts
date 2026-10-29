import { createServerFn } from "@tanstack/react-start";
import { enquirySchema } from "./enquiry-schema";
import { requireAdmin } from "./cms-auth.server";

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => enquirySchema.parse(input))
  .handler(async ({ data }) => {
    // Hidden "website" field is a bot trap; quietly accept without storing.
    if (data.website) return { ok: true };
    const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
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
    if (error) throw new Error("We could not send your enquiry. Please try again or email sales@handlair.co.in.");
    return { ok: true };
  });

export const getEnquiries = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
  const { data, error } = await db.from("enquiries").select("*").order("created_at", { ascending: false }).limit(500);
  if (error) throw new Error("Unable to load enquiries.");
  return data ?? [];
});
