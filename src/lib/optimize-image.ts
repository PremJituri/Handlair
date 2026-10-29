import { MAX_UPLOAD_BYTES, MAX_IMAGE_WIDTH } from "./cms-schema";

const MAX_HEIGHT = 3840;
// The server re-encodes at quality 85, which can grow the file; leave headroom.
const TARGET_BYTES = Math.floor(MAX_UPLOAD_BYTES * 0.7);
const QUALITIES = [0.82, 0.75, 0.65];

type Source = { image: CanvasImageSource; width: number; height: number; close: () => void };

async function decode(file: File): Promise<Source> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return {
        image: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        close: () => bitmap.close(),
      };
    } catch {
      // Fall through to <img> decoding for older mobile browsers.
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("This photo could not be read."));
      img.src = url;
    });
    return { image: img, width: img.naturalWidth, height: img.naturalHeight, close: () => {} };
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

function toBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

export async function optimizeImage(file: File): Promise<File> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 25_000_000)
    throw new Error("Choose a JPEG, PNG or WebP smaller than 25 MB.");
  const source = await decode(file);
  if (!source.width || !source.height) {
    source.close();
    throw new Error("This photo could not be read.");
  }
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    source.close();
    throw new Error("Image preview unavailable.");
  }
  let ratio = Math.min(1, MAX_IMAGE_WIDTH / source.width, MAX_HEIGHT / source.height);
  try {
    for (let step = 0; step < 10; step++) {
      canvas.width = Math.max(1, Math.round(source.width * ratio));
      canvas.height = Math.max(1, Math.round(source.height * ratio));
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(source.image, 0, 0, canvas.width, canvas.height);
      for (const quality of QUALITIES) {
        const blob = await toBlob(canvas, quality);
        if (blob && blob.size <= TARGET_BYTES)
          return new File([blob], "optimized.jpg", { type: "image/jpeg" });
      }
      ratio *= 0.8;
    }
  } finally {
    source.close();
  }
  throw new Error("Could not reduce this photo below 200 KB.");
}
