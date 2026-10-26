import { z } from "zod";

export const heroAltSchema = z.string().trim().max(180).default("Handlair industrial air handling installation");
export const heroImageUrlSchema = z.string().regex(/^\/api\/public\/hero-photo\/[a-f0-9-]{36}\.jpg$/);
export const LAST_HERO_PHOTO_ERROR = "Cannot delete the last photo. Minimum 1 photo required.";
export function assertCanDeleteHeroSlide(count: number) {
  if (count <= 1) throw new Error(LAST_HERO_PHOTO_ERROR);
}
export type HeroPhoto = { src: string; alt: string };