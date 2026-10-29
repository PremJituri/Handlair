import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { pageSeo, ldScript, breadcrumbLd, absoluteUrl, metaDescription, ORG_NAME } from "@/lib/seo";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/site-shell";
import { ProductGallery } from "@/components/products/product-gallery";
import { publicProductQuery } from "@/lib/catalogue-query";
import { emphasize } from "@/lib/emphasize";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(publicProductQuery(params.slug));
    if (!data.product) throw notFound();
    return { ...data.product, relatedProducts: data.related, categories: data.categories };
  },
  errorComponent: ({ error }) => <p role="alert">{error.message}</p>,
  notFoundComponent: () => <p>Product not found.</p>,
  head: ({ loaderData, params }) => {
    if (!loaderData)
      return {
        meta: [
          { title: "Unavailable product — Handlair" },
          { name: "robots", content: "noindex, follow" },
        ],
      };
    const path = `/products/${params.slug}`;
    const description = metaDescription(
      loaderData.summary ||
        loaderData.detail ||
        `${loaderData.name} by Handlair Engineering Technologies.`,
    );
    const image = loaderData.images[0]?.src || loaderData.image;
    const categoryName =
      loaderData.categories.find((c) => c.id === loaderData.category)?.name ??
      "Industrial air handling equipment";
    const seo = pageSeo(
      path,
      `${loaderData.name} — Industrial Air Handling Equipment | Handlair`,
      description,
      "product",
    );
    return {
      ...seo,
      meta: [
        ...seo.meta,
        ...(image
          ? [
              { property: "og:image", content: absoluteUrl(image) },
              { name: "twitter:image", content: absoluteUrl(image) },
            ]
          : []),
      ],
      scripts: [
        ldScript({
          "@context": "https://schema.org",
          "@type": "Product",
          name: loaderData.name,
          description,
          ...(image ? { image: absoluteUrl(image) } : {}),
          url: absoluteUrl(path),
          manufacturer: { "@type": "Organization", name: ORG_NAME },
          brand: { "@type": "Brand", name: "Handlair" },
          category: categoryName,
        }),
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: loaderData.name, path },
        ]),
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(publicProductQuery(slug));
  if (!data.product) throw notFound();
  const product = { ...data.product, relatedProducts: data.related, categories: data.categories };
  const related = product.relatedProducts.filter(
    (item) => item.category === product.category && item.slug !== product.slug,
  );
  const categoryName = (id: string) =>
    product.categories.find((cat) => cat.id === id)?.name ?? "Products";
  return (
    <>
      <section className="pattern-grid -mt-[var(--header-slot)] border-b border-border">
        <div className="mx-auto site-container px-5 pb-14 pt-[calc(3rem+var(--header-slot))] lg:px-8 lg:pb-20">
          <Link
            to="/products"
            className="mb-8 inline-flex items-center gap-2 text-base font-bold text-foreground hover:text-primary-text"
          >
            <ArrowLeft className="size-4" /> Full product catalogue
          </Link>
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="eyebrow">{categoryName(product.category)}</p>
              <h1 className="mt-5 type-page [overflow-wrap:anywhere]">{product.name}</h1>
              {product.summary && <p className="mt-6 type-lead">{product.summary}</p>}
              <Button asChild size="xl" className="mt-8 max-w-full whitespace-normal">
                <Link to="/enquiry">
                  Enquire about this product <ArrowRight />
                </Link>
              </Button>
            </div>
            <ProductGallery key={product.slug} name={product.name} images={product.images} />
          </div>
        </div>
      </section>
      <section className="mx-auto grid site-container gap-10 px-5 py-16 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="type-h3">Product overview</h2>
          <p className="mt-5 type-body">
            {product.detail
              ? emphasize(product.detail)
              : "A product-specific description is not yet available."}
          </p>
          {product.missing && (
            <p className="mt-6 border-l-2 border-primary pl-4 type-body">{product.missing}</p>
          )}
        </div>
        <div>
          <h2 className="type-h3">Technical specifications</h2>
          {product.specifications?.length ? (
            <ul className="mt-5 divide-y divide-border border-y border-border">
              {product.specifications.map((spec) => (
                <li key={spec} className="py-4 type-body">
                  {spec.includes(":") ? (
                    <>
                      {spec.split(":")[0]}:{" "}
                      <strong>{spec.split(":").slice(1).join(":").trim()}</strong>
                    </>
                  ) : (
                    <strong>{spec}</strong>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 type-body">
              Detailed specifications are not yet available. Contact Handlair to discuss your
              requirements.
            </p>
          )}
        </div>
      </section>
      {(product.body.length > 0 || product.sections.length > 0) && (
        <section className="mx-auto site-container px-5 pb-16 lg:px-8">
          <div className="max-w-3xl space-y-6">
            {product.body.map((paragraph, index) => (
              <p key={index} className="type-body">
                {paragraph}
              </p>
            ))}
            {product.sections.map((section, index) => (
              <div key={index}>
                <h2 className="type-h3">{section.title}</h2>
                {section.body.map((p, i) => (
                  <p key={i} className="mt-5 type-body">
                    {p}
                  </p>
                ))}
                {section.list && (
                  <ul className="mt-5 list-disc pl-5 type-body">
                    {section.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {related.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto site-container px-5 py-12 lg:px-8">
            <h2 className="type-h3">More in {categoryName(product.category)}</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {related.map((item) => (
                <Button
                  key={item.slug}
                  asChild
                  variant="outline"
                  className="h-auto min-h-14 justify-between whitespace-normal py-3 text-left text-base"
                >
                  <Link to="/products/$slug" params={{ slug: item.slug }}>
                    {item.name}
                    <ArrowRight />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
