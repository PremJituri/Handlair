import { z } from "zod";

export const slugSchema = z.string().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const idSchema = z.string().uuid();
export const categorySchema = z.object({ id: idSchema.optional(), name: z.string().trim().min(1).max(150), slug: slugSchema, description: z.string().max(2000).default(""), display_order: z.number().int().min(0).default(0) });
export const productSchema = z.object({
  id: idSchema.optional(), category_id: idSchema, name: z.string().trim().min(1).max(180), slug: slugSchema,
  summary: z.string().max(3000), detail: z.string().max(20000), subcategory: z.string().max(180),
  body_json: z.array(z.string().max(10000)).max(50), specs_json: z.array(z.string().max(1000)).max(100),
  sections_json: z.array(z.object({ title: z.string().max(180), body: z.array(z.string().max(10000)).max(30), list: z.array(z.string().max(2000)).max(50).optional() })).max(30),
  thumbnail_url: z.string().max(2000), missing: z.string().max(3000).nullable(),
  display_order: z.number().int().min(0), is_published: z.boolean(), catalogue_visible: z.boolean(),
});
export type ProductInput = z.infer<typeof productSchema>;
export function canDeleteCategory(count: number) { return count === 0; }
export const MAX_UPLOAD_BYTES = 200_000;
export const MAX_IMAGE_WIDTH = 1920;