// Public site origin used for canonical URLs, structured data and the sitemap.
export const SITE_URL = "https://www.handlair.co.in";
export const ORG_NAME = "Handlair Engineering Technologies";

export const absoluteUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);

export function pageSeo(path: string, title: string, description: string, type = "website") {
  const url = absoluteUrl(path);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export const ldScript = (data: unknown) => ({ type: "application/ld+json", children: JSON.stringify(data) });

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return ldScript({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.path) })),
  });
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "Manufacturer", "LocalBusiness"],
  name: ORG_NAME,
  alternateName: "Handlair",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.png`,
  image: `${SITE_URL}/favicon.png`,
  foundingDate: "1996",
  description: "Manufacturer of industrial air handling equipment, centrifugal blowers, axial flow fans, and air pollution control systems.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Indira Industrial Complex, Jeevan Nagar, Wazirpur Road, Old Faridabad",
    addressLocality: "Faridabad",
    addressRegion: "Haryana",
    postalCode: "121002",
    addressCountry: "IN",
  },
  telephone: "+91-129-2229101",
  email: "sales@handlair.co.in",
};

export const metaDescription = (text: string, max = 158) => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
};
