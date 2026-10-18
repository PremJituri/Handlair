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
