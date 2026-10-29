import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { ArrowUp, ArrowDown, Pencil, Trash2, Upload, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { HeroSlideshow } from "@/components/hero-slideshow";
import {
  getAdminHeroSlides,
  uploadHeroPhoto,
  updateHeroSlidesOrder,
  updateHeroSlideAlt,
  deleteHeroSlide,
} from "@/lib/cms.functions";
import { optimizeImage } from "@/lib/optimize-image";
import { adminHead } from "@/lib/admin-head";

export const Route = createFileRoute("/_admin/admin/hero-slides")({
  loader: () => getAdminHeroSlides(),
  head: () => adminHead("Hero Slideshow Photos"),
  component: HeroPhotos,
});

function HeroPhotos() {
  const slides = Route.useLoaderData();
  const router = useRouter();
  const queries = useQueryClient();
  const upload = useServerFn(uploadHeroPhoto);
  const reorder = useServerFn(updateHeroSlidesOrder);
  const saveAlt = useServerFn(updateHeroSlideAlt);
  const removePhoto = useServerFn(deleteHeroSlide);
  const picker = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState<{ id: string; alt: string } | null>(null);
  const [remove, setRemove] = useState<string | null>(null);
  async function action(work: () => Promise<unknown>) {
    setBusy(true);
    setError("");
    try {
      await work();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update hero photos.");
    } finally {
      // Refresh even after a failure so any photos saved before it are shown.
      await router.invalidate();
      await queries.invalidateQueries({ queryKey: ["hero-slides"] });
      setBusy(false);
    }
  }
  const minimum = "At least 1 photo is required. The slideshow cannot be empty.";
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="type-h2">Hero Slideshow Photos</h1>
          <p className="mt-2 text-muted-foreground">{slides.length} photos</p>
        </div>
        <Button disabled={busy} className="h-11 rounded-lg" onClick={() => picker.current?.click()}>
          <Upload />
          {busy ? "Updating…" : "Upload photo"}
        </Button>
        <input
          ref={picker}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          aria-label="Upload hero photo"
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (!files.length) return;
            await action(async () => {
              let saved = 0;
              try {
                for (const file of files) {
                  const form = new FormData();
                  form.set("file", await optimizeImage(file));
                  await upload({ data: form });
                  saved++;
                }
              } catch (e) {
                const reason = e instanceof Error ? e.message : "Upload failed.";
                throw new Error(
                  saved
                    ? `${saved} of ${files.length} photos uploaded. The rest failed: ${reason}`
                    : reason,
                );
              }
            });
          }}
        />
      </div>
      {error && (
        <p className="mt-5 text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <ol className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {slides.map((slide, index) => (
            <li
              key={slide.id}
              className="min-w-0 overflow-hidden rounded-lg border border-border bg-card"
            >
              <img
                src={slide.image_url}
                alt={slide.alt_text}
                className="aspect-[4/3] w-full object-contain"
                loading="lazy"
              />
              <div className="space-y-3 border-t border-border p-4">
                <p className="font-bold">Photo {index + 1}</p>
                {edit?.id === slide.id ? (
                  <form
                    className="space-y-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void action(async () => {
                        await saveAlt({ data: { id: slide.id, alt_text: edit.alt } });
                        setEdit(null);
                      });
                    }}
                  >
                    <label className="block text-sm" htmlFor={`alt-${slide.id}`}>
                      Alt text
                    </label>
                    <Input
                      id={`alt-${slide.id}`}
                      maxLength={180}
                      value={edit.alt}
                      onChange={(e) => setEdit({ id: slide.id, alt: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <Button type="submit" size="sm" disabled={busy}>
                        <Save /> Save
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Cancel alt text edit"
                        onClick={() => setEdit(null)}
                      >
                        <X />
                      </Button>
                    </div>
                  </form>
                ) : (
                  <p className="min-h-10 break-words text-sm text-muted-foreground">
                    {slide.alt_text || "—"}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {([-1, 1] as const).map((direction) => (
                    <Button
                      key={direction}
                      size="icon"
                      variant="outline"
                      disabled={busy || index + direction < 0 || index + direction >= slides.length}
                      aria-label={`${direction < 0 ? "Move Up" : "Move Down"} photo ${index + 1}`}
                      title={direction < 0 ? "Move Up" : "Move Down"}
                      onClick={() =>
                        void action(async () => {
                          const ids = slides.map((s) => s.id);
                          const other = ids[index + direction];
                          if (!other) return;
                          ids[index + direction] = slide.id;
                          ids[index] = other;
                          await reorder({ data: { ordered_ids: ids } });
                        })
                      }
                    >
                      {direction < 0 ? <ArrowUp /> : <ArrowDown />}
                    </Button>
                  ))}
                  <Button
                    size="icon"
                    variant="outline"
                    disabled={busy}
                    aria-label={`Edit Alt Text photo ${index + 1}`}
                    title="Edit Alt Text"
                    onClick={() => setEdit({ id: slide.id, alt: slide.alt_text })}
                  >
                    <Pencil />
                  </Button>
                  <span
                    tabIndex={slides.length <= 1 ? 0 : undefined}
                    title={slides.length <= 1 ? minimum : "Delete"}
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={busy || slides.length <= 1}
                      aria-label={`Delete photo ${index + 1}`}
                      onClick={() => setRemove(slide.id)}
                    >
                      <Trash2 />
                    </Button>
                  </span>
                </div>
                {slides.length <= 1 && <p className="text-sm text-muted-foreground">{minimum}</p>}
              </div>
            </li>
          ))}
        </ol>
        <aside className="w-full max-w-xs lg:sticky lg:top-8">
          <h2 className="mb-4 font-bold">Live preview</h2>
          <div className="overflow-hidden rounded-lg border border-border bg-card p-2">
            <HeroSlideshow slides={slides.map((s) => ({ src: s.image_url, alt: s.alt_text }))} />
          </div>
        </aside>
      </div>
      <ConfirmDelete
        name={remove ? "this hero photo" : null}
        busy={busy}
        blocked={false}
        onClose={() => {
          if (!busy) setRemove(null);
        }}
        onConfirm={() => {
          if (!remove || slides.length <= 1) return;
          void action(async () => {
            await removePhoto({ data: { id: remove } });
            setRemove(null);
          });
        }}
      />
    </>
  );
}
