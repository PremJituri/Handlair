# Handlair Website Redesign Plan

## Goal
Create a complete, light-themed Handlair website that preserves the public site’s business content and product taxonomy while replacing its dated presentation with a premium industrial editorial experience.

The supplied palette overrides every dark-first instruction in the earlier brief:

- Text: `#050315`
- Background: `#fbfbfe`
- Primary: `#2dcd74`
- Secondary: `#e4ffdc`
- Accent: `#80e98e`

## Pages and navigation
- Build separate Home, About, Products, Product Detail, Gallery, Contact, and Enquiry pages.
- Add a shared desktop header, touch-friendly mobile menu, persistent enquiry action, and complete footer.
- Preserve the existing public site’s product and system categories, internal links, contact details, and enquiry fields.
- Use clean URLs and unique metadata for every page and product detail view.

## Visual direction
- Use a bright editorial composition with generous white space, strong near-black typography, green calls to action, pale-green supporting surfaces, thin dividers, and restrained shadows.
- Translate the Persona reference’s large typography, image-led layouts, numbered sections, and visual rhythm without copying its content or exact composition.
- Make industrial equipment the visual focus through large, correctly cropped product photography and varied but orderly grids.
- Use a modern sans-serif pairing suited to technical manufacturing content.
- Apply subtle reveals, image zooms, menu transitions, and button feedback while respecting reduced-motion preferences.

## Homepage
- Present Handlair immediately as an air-handling and industrial air-pollution-control manufacturer, using existing factual copy.
- Add prominent Products and Enquiry actions.
- Recompose the existing About content into a concise editorial introduction.
- Showcase all product categories and systems in scannable visual sections.
- Feature selected gallery work and end with a strong enquiry invitation.

## Products and systems
- Create a browsable product overview containing every existing equipment category.
- Create editorial product detail pages for the existing detailed products, preserving descriptions, capacity ranges, materials, applications, and supporting images from the public site.
- Include related products, a path back to the catalog, and an enquiry action on each detail page.
- Preserve these systems: Air Cooling, Ventilation, Pressurisation, Air Filtration, Dust Collection, and Fume Exhausting.

## About, gallery, contact, and enquiry
- Preserve and restructure the public About content without inventing statistics, certifications, clients, awards, or claims.
- Build a responsive gallery with efficient image sizing, varied aspect ratios, category browsing, and an accessible fullscreen viewer.
- Recreate the Contact form and the complete long-form B2B Enquiry form with accessible labels, validation, loading, success, and failure states.
- Keep the current published contact details visible, while flagging the public site’s inconsistent legal company name for confirmation before launch.
- Do not claim that email delivery is connected until the existing submission destination or a replacement service is available and verified.

## Technical approach
- Keep the project’s existing TanStack Start, React, TypeScript, and Tailwind CSS architecture rather than migrating to Next.js.
- Centralize the exact palette, typography, spacing, borders, radii, shadows, and interaction states as semantic design tokens.
- Build reusable layout, navigation, product, gallery, form, and call-to-action components.
- Use responsive, lazy-loaded images with explicit dimensions and descriptive alt text.
- Implement route-level titles, descriptions, Open Graph metadata, semantic headings, keyboard access, visible focus states, and suitable contrast.
- Avoid a database or new server infrastructure unless a verified form-delivery requirement makes it necessary.

## Validation
- Check every page, navigation link, product path, gallery interaction, mobile menu, and form state.
- Verify desktop and mobile layouts for overflow, readable text, stable image dimensions, and touch targets.
- Confirm the preview builds cleanly with no runtime, console, or network errors.
- Verify the central enquiry journey end to end to the furthest point supported by the available submission integration.

## Known constraints
- The current project is a blank TanStack Start template, not the source code of the legacy Handlair site. Content and available imagery will therefore be reconstructed from the public website rather than preserved from an imported codebase.
- The public site shows two company names: “Handlair Engineering Technologies” and “Handlair Engineers Pvt Ltd.” Existing wording will be retained conservatively until the preferred legal name is confirmed.
- The legacy form pages display submission behavior, but successful email delivery could not be verified during the audit.
