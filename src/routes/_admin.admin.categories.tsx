import { invalidateContent } from "@/lib/invalidate-content";
import { adminCatalogueQuery } from "@/lib/admin-query";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { saveCategory, deleteCategory } from "@/lib/cms.functions";
import { categorySchema, canDeleteCategory, slugify } from "@/lib/cms-schema";
import { adminHead } from "@/lib/admin-head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
export const Route = createFileRoute("/_admin/admin/categories")({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminCatalogueQuery),
  errorComponent: () => <p role="alert">This page could not load. Please try again.</p>,
  notFoundComponent: () => <p>Admin page not found.</p>,
  head: () => adminHead("Categories"),
  component: Categories,
});
function Categories() {
  const { data } = useSuspenseQuery(adminCatalogueQuery);
  const router = useRouter();
  const queries = useQueryClient();
  const [edit, setEdit] = useState<{
    id?: string;
    name: string;
    slug: string;
    description: string;
    display_order: number;
  } | null>(null);
  const [remove, setRemove] = useState<(typeof data.categories)[number] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <>
      <div className="flex flex-wrap justify-between gap-4">
        <h1 className="type-h2">Categories</h1>
        <Button
          className="h-11 rounded-lg"
          onClick={() =>
            setEdit({ name: "", slug: "", description: "", display_order: data.categories.length })
          }
        >
          <Plus /> Add category
        </Button>
      </div>
      {error && (
        <p className="mt-5 text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-y border-border">
            <tr>
              {["Name", "Slug", "Products", "Actions"].map((h) => (
                <th className="p-4" key={h}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.categories.map((c) => (
              <tr key={c.id} className="border-b border-border">
                <td className="p-4 font-bold">{c.name}</td>
                <td className="p-4">{c.slug}</td>
                <td className="p-4">{c.count}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label={`Edit ${c.name}`}
                      onClick={() => setEdit(c)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Delete ${c.name}`}
                      onClick={() => setRemove(c)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog
        open={!!edit}
        onOpenChange={(o) => {
          if (!o) setEdit(null);
        }}
      >
        <DialogContent>
          <DialogTitle>{edit?.id ? "Edit category" : "Add category"}</DialogTitle>
          <DialogDescription>Category details</DialogDescription>
          {edit && (
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                try {
                  const parsed = categorySchema.safeParse({
                    ...edit,
                    slug: slugify(edit.slug || edit.name),
                  });
                  if (!parsed.success) {
                    setError(parsed.error.issues[0]?.message ?? "Check the category details.");
                    return;
                  }
                  setError("");
                  await saveCategory({ data: parsed.data });
                  setEdit(null);
                  await invalidateContent(queries, "catalogue");
                  await router.invalidate();
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Save failed.");
                } finally {
                  setBusy(false);
                }
              }}
            >
              {(["name", "slug", "description"] as const).map((key) => (
                <label key={key} className="block space-y-2">
                  <span className="capitalize">{key}</span>
                  <Input
                    required={key !== "description"}
                    value={edit[key]}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (key === "name") {
                        setEdit({
                          ...edit,
                          name: v,
                          ...(!edit.id && (edit.slug === "" || edit.slug === slugify(edit.name))
                            ? { slug: slugify(v) }
                            : {}),
                        });
                      } else if (key === "slug") {
                        setEdit({
                          ...edit,
                          slug: v
                            .toLowerCase()
                            .replace(/[^a-z0-9-]+/g, "-")
                            .replace(/-{2,}/g, "-"),
                        });
                      } else setEdit({ ...edit, [key]: v });
                    }}
                    onBlur={
                      key === "slug"
                        ? () => setEdit({ ...edit, slug: slugify(edit.slug) })
                        : undefined
                    }
                  />
                  {key === "slug" && (
                    <span className="block text-sm text-muted-foreground">
                      Used in links; filled in automatically from the name.
                    </span>
                  )}
                </label>
              ))}
              <Button disabled={busy} type="submit" className="rounded-lg">
                Save category
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDelete
        name={remove?.name ?? null}
        busy={busy}
        blocked={!!remove && !canDeleteCategory(remove.count)}
        onClose={() => setRemove(null)}
        onConfirm={async () => {
          if (!remove) return;
          setBusy(true);
          try {
            await deleteCategory({ data: remove.id });
            setRemove(null);
            await invalidateContent(queries, "catalogue");
            await router.invalidate();
          } catch (e) {
            setError(e instanceof Error ? e.message : "Deletion failed.");
            setRemove(null);
          } finally {
            setBusy(false);
          }
        }}
      />
    </>
  );
}
