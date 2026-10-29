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
- Keep slideshow playback isolated in `HeroSlideshow`, public reads in a cached route query, and static assets as an offline fallback; decode before playback and skip timers for single photos and reduced motion.
- Catalogue CMS uses Cloud PostgreSQL and private image storage, not persistent local files or native Sharp, because the published runtime has no durable disk or native binaries.
- CMS authentication uses bcrypt-verified configured admin credentials and encrypted HttpOnly sessions; every admin server operation revalidates the account, and no browser-controlled role grants access.
- HTTPS admin sessions use Secure, SameSite=None, partitioned cookies for embedded previews, with server-function CSRF middleware retained; local HTTP uses Strict cookies.
- Public Products reads use a server publishable client and published-row policies with static fallback only on service failure; keep static business records for unrelated pages and legacy fallback.
- Uploaded images are resized in-browser, then decoded and JPEG re-encoded server-side with strict dimension and byte limits; only published product photos are served publicly.
- Existing product slugs are immutable in the CMS to preserve legacy links; drafts and legacy-only records remain independently managed.
- Hero management shares validated image optimization and private storage with the CMS; serialize append/reorder/delete through database locks and deny mutation RPCs to public roles so concurrent edits cannot empty the slideshow. Retain removed private files to avoid breaking concurrent or shared photo references; public serving requires an active slide.
- Database tooling packages (drizzle-orm, postgres) are required by migrations even though app code never imports them; do not remove them as unused.
- Keep semantic lint checks on generated integration files while excluding their externally managed formatting; never manually reformat generated clients or types.
