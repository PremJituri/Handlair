import { useSuspenseQuery } from "@tanstack/react-query";
import { adminEnquiriesQuery } from "@/lib/admin-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Mail, Phone } from "lucide-react";
import { adminHead } from "@/lib/admin-head";

export const Route = createFileRoute("/_admin/admin/enquiries")({
  validateSearch: z.object({ page: z.number().int().min(1).optional().catch(undefined) }),
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  loader: ({ deps, context }) => context.queryClient.ensureQueryData(adminEnquiriesQuery(deps.page)),
  errorComponent: () => <p role="alert">This page could not load. Please try again.</p>,
  notFoundComponent: () => <p>Enquiries not found.</p>,
  head: () => adminHead("Enquiries"),
  component: Enquiries,
});

function Enquiries() {
  const search = Route.useSearch();
  const { data: { items, total, page, pages } } = useSuspenseQuery(adminEnquiriesQuery(search.page ?? 1));
  return (
    <>
      <h1 className="type-h2">Enquiries</h1>
      <p className="mt-2 text-muted-foreground">
        {total} received, newest first.{pages > 1 && ` Page ${page} of ${pages}.`}
      </p>
      {items.length === 0 ? (
        <p className="mt-8 rounded-lg border border-border p-8 text-center text-muted-foreground">
          No enquiries yet.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4">
          {items.map((e) => (
            <li key={e.id} className="rounded-lg border border-border p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-bold">
                  {[e.first_name, e.last_name].filter(Boolean).join(" ")}
                  {e.company && (
                    <span className="font-normal text-muted-foreground"> · {e.company}</span>
                  )}
                </p>
                <time className="text-sm text-muted-foreground" dateTime={e.created_at}>
                  {new Date(e.created_at).toLocaleString("en-IN")}
                </time>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                <a
                  className="inline-flex items-center gap-1 hover:text-primary-text"
                  href={`mailto:${e.email}`}
                >
                  <Mail className="size-4" />
                  {e.email}
                </a>
                <a
                  className="inline-flex items-center gap-1 hover:text-primary-text"
                  href={`tel:${e.mobile.replace(/[^+\d]/g, "")}`}
                >
                  <Phone className="size-4" />
                  {e.mobile}
                </a>
                {(e.city || e.country) && (
                  <span className="text-muted-foreground">
                    {[e.city, e.country].filter(Boolean).join(", ")}
                  </span>
                )}
              </div>
              <p className="mt-3 whitespace-pre-wrap [overflow-wrap:anywhere]">{e.message}</p>
            </li>
          ))}
        </ul>
      )}
      {pages > 1 && (
        <nav aria-label="Enquiry pages" className="mt-8 flex items-center justify-between gap-4">
          {page > 1 ? (
            <Link
              to="/admin/enquiries"
              search={{ page: page - 1 }}
              className="rounded-lg border border-border px-4 py-2"
            >
              Newer
            </Link>
          ) : (
            <span />
          )}
          {page < pages && (
            <Link
              to="/admin/enquiries"
              search={{ page: page + 1 }}
              className="rounded-lg border border-border px-4 py-2"
            >
              Older
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
