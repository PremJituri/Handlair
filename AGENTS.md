<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep shared public-site chrome in `SiteShell` and business catalog content in `src/data/handlair.ts` so every route stays visually and factually consistent.

- Keep mineral glass in shared semantic CSS utilities with non-interactive overlays and opaque fallbacks; preserve positioning and dimensions, and let Lightning CSS generate vendor prefixes so published Chrome retains the standard filter.

- Extend opening page patterns behind the unchanged header using the shared header-slot offset and equal compensating inner top spacing to preserve content positions.
- Keep Products-only taxonomy and image associations in `src/data/product-catalogue.ts`, derived from shared business/photo records; shared installation photos remain required after standalone Gallery removal so product viewers and legacy product URLs stay intact.
- Use the shared `site-container` width for wide public layouts, retaining narrower reading/form limits; size the desktop home hero against available viewport height so shorter laptops retain visible recovery actions and complete equipment imagery.
- Keep the homepage slideshow isolated in `HeroSlideshow` with its ordered assets in `src/data/hero-slideshow.ts`; decode images before playback and clean up timers so navigation and reduced-motion preferences remain safe.
- Catalogue CMS uses Cloud PostgreSQL and private image storage, not persistent local files or native Sharp, because the published runtime has no durable disk or native binaries.
- CMS authentication uses bcrypt-verified configured admin credentials and encrypted HttpOnly sessions; every admin server operation revalidates the account, and no browser-controlled role grants access.
- HTTPS admin sessions use Secure, SameSite=None, partitioned cookies for embedded previews, with server-function CSRF middleware retained; local HTTP uses Strict cookies.
- Public Products reads use a server publishable client and published-row policies with static fallback only on service failure; keep static business records for unrelated pages and legacy fallback.
- Uploaded images are resized in-browser, then decoded and JPEG re-encoded server-side with strict dimension and byte limits; only published product photos are served publicly.
- Existing product slugs are immutable in the CMS to preserve legacy links; drafts and legacy-only records remain independently managed.
