export function adminHead(title: string) {
  const full = `${title} — Handlair Admin`;
  return {
    meta: [
      { title: full },
      {
        name: "description",
        content: "Handlair Engineering Technologies catalogue administration.",
      },
      { property: "og:title", content: full },
      { property: "og:description", content: "Handlair catalogue administration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  };
}
