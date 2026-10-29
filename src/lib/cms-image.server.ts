import { MAX_UPLOAD_BYTES, MAX_IMAGE_WIDTH } from "./cms-schema";

// Shared by product and hero uploads; re-encoding strips metadata on the server.
export async function cleanAdminImage(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.type !== "image/jpeg" || file.size > MAX_UPLOAD_BYTES)
    throw new Error("Please upload an optimized JPEG under 200 KB.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes[0] !== 255 || bytes[1] !== 216) throw new Error("Invalid JPEG file.");
  const jpeg = await import("jpeg-js");
  const decoded = jpeg.decode(bytes, {
    useTArray: true,
    maxResolutionInMP: 4,
    maxMemoryUsageInMB: 64,
  });
  if (decoded.width > MAX_IMAGE_WIDTH || decoded.height > 3840)
    throw new Error("Image dimensions exceed the upload limit.");
  // Browser JPEGs can grow when re-encoded; step quality down until it fits.
  for (const quality of [85, 75, 65, 55]) {
    const clean = jpeg.encode(decoded, quality).data;
    if (clean.length <= MAX_UPLOAD_BYTES) return clean;
  }
  throw new Error("Photo is too detailed. Please choose a smaller image.");
}
