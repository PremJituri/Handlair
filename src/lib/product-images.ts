/**
 * Single ordering rule for product photos: the featured (thumbnail) photo first,
 * then the remaining photos in their saved order, without duplicates. When the
 * featured photo is missing, the saved order is kept unchanged.
 */
export function featuredFirst<T>(
  images: readonly T[],
  featured: string | null | undefined,
  key: (image: T) => string,
): T[] {
  const index = featured ? images.findIndex((image) => key(image) === featured) : -1;
  if (index <= 0) return [...images];
  return [images[index], ...images.slice(0, index), ...images.slice(index + 1)];
}
