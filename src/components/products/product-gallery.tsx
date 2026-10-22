import { ChevronLeft, ChevronRight, ImageOff, Maximize2 } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { type ProductPhoto } from "@/data/product-catalogue";
import { cn } from "@/lib/utils";

function Photo({ photo, enlarged = false }: { photo: ProductPhoto; enlarged?: boolean }) {
  const [failed, setFailed] = useState(false);
  return failed ? <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground"><ImageOff /><p>Image unavailable</p></div> : <img src={photo.src} alt={photo.name} onError={() => setFailed(true)} className={cn("h-full w-full object-contain", enlarged ? "p-3" : "p-5")} />;
}

export function ProductGallery({ name, images }: { name: string; images: ProductPhoto[] }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const touchStart = useRef<number | null>(null);
  const photo = images[index];
  const move = (step: number) => setIndex((current) => (current + step + images.length) % images.length);
  const keys = (event: React.KeyboardEvent) => {
    if (images.length < 2) return;
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
  };
  const swipe = (event: React.TouchEvent) => {
    const end = event.changedTouches[0]?.clientX;
    if (touchStart.current !== null && end !== undefined && images.length > 1 && Math.abs(end - touchStart.current) > 50) move(end < touchStart.current ? 1 : -1);
    touchStart.current = null;
  };
  const thumbnails = <div className="flex gap-2 overflow-x-auto py-2" aria-label={`${name} photo thumbnails`}>{images.map((image, i) => <Button key={image.src} variant="ghost" onClick={() => setIndex(i)} aria-label={`Show ${name} image ${i + 1}`} aria-pressed={i === index} className={cn("h-16 w-20 shrink-0 overflow-hidden rounded-md border-2 bg-background p-1", i === index ? "border-primary" : "border-border")}><img src={image.src} alt="" loading="lazy" className="h-full w-full object-contain" /></Button>)}</div>;
  const arrows = images.length > 1 && <><Button variant="secondary" size="icon" className="absolute left-2 top-1/2 size-11 -translate-y-1/2" aria-label="Previous product image" onClick={() => move(-1)}><ChevronLeft /></Button><Button variant="secondary" size="icon" className="absolute right-2 top-1/2 size-11 -translate-y-1/2" aria-label="Next product image" onClick={() => move(1)}><ChevronRight /></Button></>;

  if (!photo) return <div className="glass-surface flex aspect-[4/3] flex-col items-center justify-center gap-4 p-8 text-center"><ImageOff className="size-10 text-muted-foreground" /><p className="type-body">Product-specific photography pending.</p></div>;
  return <div className="min-w-0" onKeyDown={keys}>
    <div className="glass-surface relative aspect-[4/3] bg-secondary/30" onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={swipe}>
      <Photo key={photo.src} photo={photo} />{arrows}<Button variant="secondary" size="icon" className="absolute right-3 top-3 size-11" onClick={() => setOpen(true)} aria-label={`Enlarge ${name} image`} title="Enlarge image"><Maximize2 /></Button>
    </div>
    <div className="mt-3 flex justify-between gap-3 text-base text-muted-foreground"><span>{photo.name}</span><span className="shrink-0" aria-live="polite">Image {index + 1} of {images.length}</span></div>
    {images.length > 1 && thumbnails}
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="z-[70] w-[calc(100%-2rem)] max-w-5xl gap-3 rounded-lg p-4 sm:p-6" onKeyDown={(event) => event.stopPropagation()}>
      <DialogTitle className="pr-8 text-xl leading-snug">{name}</DialogTitle><DialogDescription className="text-base">{photo.name} — Image {index + 1} of {images.length}</DialogDescription>
      <div className="relative h-[50dvh] min-h-40 sm:h-[60dvh]" onKeyDown={keys} tabIndex={0} aria-label="Product image viewer" onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={swipe}><Photo key={photo.src} photo={photo} enlarged />{arrows}</div>
      {images.length > 1 && <div onKeyDown={keys}>{thumbnails}</div>}
    </DialogContent></Dialog>
  </div>;
}