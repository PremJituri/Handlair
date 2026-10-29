import { useQueryClient } from "@tanstack/react-query";
import { invalidateContent } from "@/lib/invalidate-content";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import {
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Image as ImageIcon,
  LoaderCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAdminData, saveProduct, uploadImage, deleteImage } from "@/lib/cms.functions";
import { productSchema, type ProductInput } from "@/lib/cms-schema";
import { optimizeImage } from "@/lib/optimize-image";
import { ConfirmDelete } from "./confirm-delete";
type AdminData = Awaited<ReturnType<typeof getAdminData>>;
const area =
  "min-h-28 w-full rounded-lg border border-input bg-background px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-ring";
export function ProductEditor({ data, id }: { data: AdminData; id?: string }) {
  const product = data.products.find((p) => p.id === id);
  const navigate = useNavigate();
  const router = useRouter();
  const queries = useQueryClient();
  const [value, setValue] = useState<ProductInput>(() =>
    productSchema.parse(
      product
        ? {
            ...product,
            body_json: product.body_json,
            specs_json: product.specs_json,
            sections_json: product.sections_json,
          }
        : {
            category_id: data.categories[0]?.id,
            name: "New product",
            slug: "new-product",
            summary: "",
            detail: "",
            subcategory: "",
            body_json: [],
            specs_json: [],
            sections_json: [],
            thumbnail_url: "",
            missing: null,
            display_order: data.products.length,
            is_published: true,
            catalogue_visible: true,
          },
    ),
  );
  const [manualSlug, setManualSlug] = useState(!!id);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [remove, setRemove] = useState<AdminData["images"][number] | null>(null);
  const [dirty, setDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(
    () => () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    },
    [previews],
  );
  function update<K extends keyof ProductInput>(key: K, next: ProductInput[K]) {
    setValue((v) => ({ ...v, [key]: next }));
    setNotice("");
    setDirty(true);
  }
  function moveSpec(index: number, direction: number) {
    const rows = [...value.specs_json];
    const next = index + direction;
    const current = rows[index];
    const target = rows[next];
    if (next < 0 || next >= rows.length || current === undefined || target === undefined) return;
    rows[index] = target;
    rows[next] = current;
    update("specs_json", rows);
  }
  async function upload(files: FileList | File[]) {
    if (!id || !product) {
      setError("Save the product before adding photos.");
      return;
    }
    const list = Array.from(files);
    setBusy(true);
    setError("");
    setPreviews(list.map((f) => URL.createObjectURL(f)));
    let order = data.images.filter((i) => i.product_id === id).length;
    // Only the persisted thumbnail decides whether a primary photo is needed, and
    // only the thumbnail is saved, so unsaved editor changes stay under explicit Save.
    let needsThumbnail = !product.thumbnail_url;
    let saved = 0;
    try {
      for (const file of list) {
        const optimized = await optimizeImage(file);
        const form = new FormData();
        form.set("product_id", id);
        form.set("file", optimized);
        form.set("alt_text", value.name);
        form.set("display_order", String(order++));
        const image = await uploadImage({ data: form });
        saved++;
        if (needsThumbnail) {
          needsThumbnail = false;
          await saveProduct({
            data: productSchema.parse({ ...product, thumbnail_url: image.image_url }),
          });
          setValue((v) => ({ ...v, thumbnail_url: image.image_url }));
        }
      }
      setNotice("Photos uploaded.");
    } catch (e) {
      const reason = e instanceof Error ? e.message : "Upload failed.";
      setError(
        saved ? `${saved} of ${list.length} photos uploaded. The rest failed: ${reason}` : reason,
      );
    } finally {
      if (saved) {
        await invalidateContent(queries, "catalogue");
        await router.invalidate();
      }
      setBusy(false);
      setPreviews([]);
    }
  }
  if (id && !product)
    return (
      <div>
        <h1 className="type-h2">Product not found</h1>
        <Link to="/admin/products" className="text-primary-text">
          Back to products
        </Link>
      </div>
    );
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="type-h2">{id ? "Edit product" : "New product"}</h1>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            disabled={!dirty || busy}
            aria-label="Save product"
            title={dirty ? "Save changes" : "No changes to save"}
            onClick={() => formRef.current?.requestSubmit()}
          >
            {busy ? <LoaderCircle className="animate-spin" /> : <Save />} Save
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/products">Back to products</Link>
          </Button>
        </div>
      </div>
      <form
        ref={formRef}
        className="mt-8 space-y-10"
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          setBusy(true);
          try {
            const saved = await saveProduct({ data: productSchema.parse(value) });
            setDirty(false);
            setNotice("Product saved.");
            await invalidateContent(queries, "catalogue");
            if (!id) await navigate({ to: "/admin/products/$id", params: { id: saved.id } });
            else await router.invalidate();
          } catch (e) {
            setError(e instanceof Error ? e.message : "Save failed.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <section className="border-t border-border pt-6">
          <h2 className="type-h3">Basic details</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span>Product name</span>
              <Input
                aria-label="Product name"
                value={value.name}
                required
                maxLength={180}
                onChange={(e) => {
                  const name = e.target.value;
                  setDirty(true);
                  setValue((v) => ({
                    ...v,
                    name,
                    subcategory: name,
                    ...(!manualSlug
                      ? {
                          slug: name
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-|-$/g, ""),
                        }
                      : {}),
                  }));
                }}
              />
            </label>
            <label className="space-y-2">
              <span>Slug</span>
              <Input
                aria-label="Product slug"
                value={value.slug}
                required
                disabled={!!id}
                onChange={(e) => {
                  setManualSlug(true);
                  update("slug", e.target.value);
                }}
              />
            </label>
            <label className="space-y-2">
              <span>Category</span>
              <select
                aria-label="Product category"
                value={value.category_id}
                required
                onChange={(e) => update("category_id", e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3"
              >
                {data.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span>Display order</span>
              <Input
                type="number"
                min={0}
                value={value.display_order}
                onChange={(e) => update("display_order", Number(e.target.value))}
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span>Summary</span>
              <textarea
                aria-label="Product summary"
                value={value.summary}
                onChange={(e) => update("summary", e.target.value)}
                className={area}
              />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap gap-6">
            <label className="flex gap-2">
              <input
                type="checkbox"
                checked={value.is_published}
                onChange={(e) => update("is_published", e.target.checked)}
              />{" "}
              Published
            </label>
            <label className="flex gap-2">
              <input
                type="checkbox"
                checked={value.catalogue_visible}
                onChange={(e) => update("catalogue_visible", e.target.checked)}
              />{" "}
              Show in catalogue
            </label>
          </div>
        </section>
        <section className="border-t border-border pt-6">
          <div className="flex justify-between gap-4">
            <h2 className="type-h3">Technical specifications</h2>
            <Button
              type="button"
              variant="outline"
              onClick={() => update("specs_json", [...value.specs_json, ""])}
            >
              <Plus /> Add Spec
            </Button>
          </div>
          <div className="mt-5 space-y-3">
            {value.specs_json.map((spec, index) => {
              const split = spec.indexOf(":");
              const label = split < 0 ? "" : spec.slice(0, split);
              const text = split < 0 ? spec : spec.slice(split + 1).trim();
              return (
                <div
                  key={index}
                  className="flex flex-wrap items-center gap-2 border-b border-border pb-3"
                >
                  <Input
                    className="min-w-32 flex-1"
                    aria-label={`Spec ${index + 1} label`}
                    placeholder="Capacity"
                    value={label}
                    onChange={(e) =>
                      update(
                        "specs_json",
                        value.specs_json.map((s, i) =>
                          i === index ? `${e.target.value}: ${text}` : s,
                        ),
                      )
                    }
                  />
                  <Input
                    className="min-w-32 flex-1"
                    aria-label={`Spec ${index + 1} value`}
                    placeholder="1000 m3/hr"
                    value={text}
                    onChange={(e) =>
                      update(
                        "specs_json",
                        value.specs_json.map((s, i) =>
                          i === index
                            ? label
                              ? `${label}: ${e.target.value}`
                              : e.target.value
                            : s,
                        ),
                      )
                    }
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    type="button"
                    disabled={index === 0}
                    aria-label={`Move spec ${index + 1} up`}
                    onClick={() => moveSpec(index, -1)}
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    type="button"
                    disabled={index === value.specs_json.length - 1}
                    aria-label={`Move spec ${index + 1} down`}
                    onClick={() => moveSpec(index, 1)}
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    type="button"
                    aria-label={`Delete spec ${index + 1}`}
                    onClick={() =>
                      update(
                        "specs_json",
                        value.specs_json.filter((_, i) => i !== index),
                      )
                    }
                  >
                    <Trash2 />
                  </Button>
                </div>
              );
            })}
          </div>
        </section>
        <section className="border-t border-border pt-6">
          <h2 className="type-h3">Product overview</h2>
          <textarea
            aria-label="Product overview"
            value={value.detail}
            onChange={(e) => update("detail", e.target.value)}
            className={`${area} mt-5`}
          />
          <label className="mt-5 block space-y-2">
            <span>Additional paragraphs</span>
            <textarea
              aria-label="Additional paragraphs"
              value={value.body_json.join("\n\n")}
              onChange={(e) =>
                update("body_json", e.target.value ? e.target.value.split("\n\n") : [])
              }
              className={area}
            />
          </label>
          <label className="mt-5 block space-y-2">
            <span>Missing information note</span>
            <Input
              value={value.missing ?? ""}
              onChange={(e) => update("missing", e.target.value || null)}
            />
          </label>
        </section>
        <section className="border-t border-border pt-6">
          <div className="flex justify-between gap-4">
            <h2 className="type-h3">Custom sections</h2>
            <Button
              variant="outline"
              type="button"
              onClick={() =>
                update("sections_json", [...value.sections_json, { title: "", body: [], list: [] }])
              }
            >
              <Plus /> Add section
            </Button>
          </div>
          {value.sections_json.map((section, index) => (
            <div key={index} className="mt-5 space-y-4 border-b border-border pb-5">
              <div className="flex gap-2">
                <Input
                  aria-label={`Section ${index + 1} title`}
                  placeholder="Section title"
                  value={section.title}
                  onChange={(e) =>
                    update(
                      "sections_json",
                      value.sections_json.map((s, i) =>
                        i === index ? { ...s, title: e.target.value } : s,
                      ),
                    )
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete section ${index + 1}`}
                  onClick={() =>
                    update(
                      "sections_json",
                      value.sections_json.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Trash2 />
                </Button>
              </div>
              <textarea
                aria-label={`Section ${index + 1} paragraphs`}
                placeholder="Paragraphs"
                className={area}
                value={section.body.join("\n\n")}
                onChange={(e) =>
                  update(
                    "sections_json",
                    value.sections_json.map((s, i) =>
                      i === index ? { ...s, body: e.target.value.split("\n\n") } : s,
                    ),
                  )
                }
              />
              <textarea
                aria-label={`Section ${index + 1} bullets`}
                placeholder="Bullet items, one per line"
                className={area}
                value={section.list?.join("\n") ?? ""}
                onChange={(e) =>
                  update(
                    "sections_json",
                    value.sections_json.map((s, i) =>
                      i === index
                        ? { ...s, list: e.target.value ? e.target.value.split("\n") : [] }
                        : s,
                    ),
                  )
                }
              />
            </div>
          ))}
        </section>
        <section className="border-t border-border pt-6">
          <h2 className="type-h3">Product photos</h2>
          <label
            className={`mt-5 flex min-h-32 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-secondary/35 p-6 ${!id ? "opacity-50" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (!busy) void upload(e.dataTransfer.files);
            }}
          >
            <Upload />
            <span>{id ? "Add photos" : "Save product to add photos"}</span>
            <input
              aria-label="Upload product photos"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={!id || busy}
              className="max-w-full"
              onChange={(e) => {
                if (e.target.files) void upload(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            {data.images
              .filter((i) => i.product_id === id)
              .map((image) => (
                <div key={image.id} className="overflow-hidden rounded-md border border-border">
                  <img
                    src={image.image_url}
                    alt={image.alt_text}
                    className="aspect-[4/3] w-full object-contain p-3"
                  />
                  <div className="flex items-center justify-between border-t border-border p-2">
                    <Button
                      variant={value.thumbnail_url === image.image_url ? "default" : "ghost"}
                      type="button"
                      size="sm"
                      title="Set primary thumbnail"
                      onClick={() => update("thumbnail_url", image.image_url)}
                    >
                      <ImageIcon />{" "}
                      {value.thumbnail_url === image.image_url ? "Primary" : "Set primary"}
                    </Button>
                    <Button
                      size="icon"
                      type="button"
                      variant="ghost"
                      aria-label={`Delete photo ${image.alt_text}`}
                      onClick={() => setRemove(image)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))}
            {previews.map((src) => (
              <img
                key={src}
                src={src}
                alt="Uploading preview"
                className="aspect-[4/3] w-full object-contain opacity-50"
              />
            ))}
          </div>
        </section>
        {error && (
          <p role="alert" className="text-destructive">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="text-primary-text">
            {notice}
          </p>
        )}
        <div className="border-t border-border pt-6">
          <Button type="submit" disabled={busy}>
            {busy ? <LoaderCircle className="animate-spin" /> : <Save />} Save product
          </Button>
        </div>
      </form>
      <ConfirmDelete
        name={remove ? "this photo" : null}
        busy={busy}
        onClose={() => setRemove(null)}
        onConfirm={async () => {
          if (!remove) return;
          setBusy(true);
          try {
            await deleteImage({ data: remove.id });
            if (value.thumbnail_url === remove.image_url) update("thumbnail_url", "");
            setRemove(null);
            await invalidateContent(queries, "catalogue");
            await router.invalidate();
          } catch (e) {
            setError(e instanceof Error ? e.message : "Photo deletion failed.");
            setRemove(null);
          } finally {
            setBusy(false);
          }
        }}
      />
    </>
  );
}
