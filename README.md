# Aquatic — Aquarium Fish & Aquatic Supplies Store Template

A premium, original HTML/CSS/JS template for an aquarium fish and aquatic
supplies retailer. Built with Bootstrap 5.3 (grid/utilities only — the visual
design is fully custom), Bootstrap Icons, and vanilla ES6+ JavaScript.

Concept: **"Your Aquarium, Perfectly in Balance."**

---

## 1. What's included in this build

This build now includes every page from the original file structure — a
complete, cross-linked site:

| Page | Notes |
|---|---|
| `index.html` | Home 1 — the original 9-section homepage (asymmetrical split hero, large category panels, horizontal-scroll arrivals) |
| `home-2.html` | Home 2 — an alternate homepage layout: full-bleed cinematic hero, overlapping stat strip, horizontal category rail, alternating spotlight-species rows, single equipment banner, one rotating quote instead of a scroller. Same design tokens and components as Home 1, different composition — pick whichever fits, or delete the one you don't use |
| `pages/fish.html` | Filterable catalog by water type, care level, tank size etc., skeleton loader, pagination |
| `pages/plants.html` | Plant catalog with light/CO₂/difficulty/placement specs |
| `pages/equipment.html` | Category-navigable marketplace: tanks, filters, lighting, heaters, pumps, CO₂, testing, substrate, decor, tools |
| `pages/services.html` | Nine services in an alternating editorial layout (not icon cards) |
| `pages/service-details.html` | Reusable detail template — overview, benefits, process, what's included, pricing, FAQs |
| `pages/blog.html` | Magazine-style Care Guides listing with featured article + sidebar |
| `pages/blog-details.html` | Full article reading experience — TOC, inline images, related articles, prev/next nav |
| `pages/about.html` | Story, philosophy, four-person team grid, full-width history timeline |
| `pages/contact.html` | General + special-order forms, map placeholder |
| `pages/404.html` | Aquarium-themed error page |
| `pages/coming-soon.html` | Live countdown + newsletter signup |

**Home 2 note:** it lives at the project root next to `index.html` (not inside
`pages/`) so its own relative links to `assets/` and `pages/*` work without
adjustment — open it directly, or point your homepage route at whichever of
the two you keep.

Every component class (`.fish-card`, `.world-panel`, `.filter-panel`,
`.form-field`, `.mag-feature`/`.mag-row`, `.svc-row`, `.toc`, header/footer,
theme toggle, etc.) is defined once in `assets/css/style.css` and reused
across pages, so extending the site — a new service, a second article, more
catalog items — means copying an existing block rather than inventing new CSS.

---

## 2. File structure

```
aquarium-store/
├── assets/
│   ├── css/
│   │   ├── style.css        # design tokens + every component
│   │   ├── dark-mode.css    # [data-theme="dark"] overrides
│   │   └── rtl.css          # dir="rtl" overrides (Arabic/Hebrew)
│   ├── js/
│   │   └── main.js          # theme, nav, reveal, filters, forms, countdown
│   └── images/               # a few small SVGs kept as scratch assets — see "Images" below
├── pages/
│   ├── fish.html
│   ├── plants.html
│   ├── equipment.html
│   ├── services.html
│   ├── service-details.html
│   ├── blog.html
│   ├── blog-details.html
│   ├── about.html
│   ├── contact.html
│   ├── 404.html
│   └── coming-soon.html
├── index.html
├── home-2.html
├── sitemap.xml
└── robots.txt
```

---

## 3. Installation

No build step. Open `index.html` in a browser, or serve the folder with any
static server, e.g.:

```
npx serve aquarium-store
```

---

## 4. Customization

### Color system
All colors are CSS variables in `assets/css/style.css` under `:root`:

```css
--clr-primary:  #0B6E75;
--clr-deep:     #073B4C;
--clr-secondary:#2A9D8F;
--clr-accent:   #6EDBD0;
--clr-light:    #EAF8F6;
--clr-bg:       #F5FBFA;
--clr-dark-bg:  #061C24;
```
Changing these repaints the entire site, light and dark mode included.
Dark-mode-specific surface remaps live in `assets/css/dark-mode.css`.

### Typography
Two families only, set in `:root`:
```css
--font-display: "DM Serif Display", "Playfair Display", Georgia, serif;
--font-body: "Manrope", "Inter", sans-serif;
```
Loaded via Google Fonts `<link>` tags in each page `<head>`. Swap the link and
the variable together to change typefaces sitewide.

### Images
Every photo in the built pages is a real photograph, hotlinked from Wikimedia
Commons via its stable `Special:FilePath/<filename>` URL (e.g.
`https://commons.wikimedia.org/wiki/Special:FilePath/125L_planted_tank.jpg`),
so nothing needs local image files to preview correctly.

**Before commercial launch, do the following:**
1. **Download and self-host** every image instead of hotlinking Commons —
   hotlinking is fine for previewing this template but is not a stable or
   polite way to serve images in production.
2. **Check each photo's licence and add attribution where required.** Most
   Commons photos here are CC BY or CC BY-SA, which legally require crediting
   the photographer (and, for BY-SA, sharing any modified version under the
   same licence). Open each file's Commons page to see its specific licence
   and author before publishing. A few (fish species, plant species) are
   reused in more than one place in this template — attribute each once.
3. **Replace with your own product photography where it matters most** — the
   hero, new-arrivals cards, and equipment shots are the highest-value spots
   for real photos of your actual livestock and store.

`assets/images/` is currently empty — it's where your self-hosted photos
should live once you complete step 1 above.

### Dark mode
Toggled by JavaScript setting `data-theme="dark"` on `<html>`, persisted in
`localStorage` under the key `aquatic-theme`, with a system-preference
fallback on first visit. Works identically on every page that includes
`dark-mode.css` and `main.js`.

### RTL support
Add `dir="rtl"` to the `<html>` tag and include `assets/css/rtl.css` after
`style.css` to serve Arabic/Hebrew. Most spacing already uses logical CSS
properties (`inset-inline-start/end`, `margin-inline`) and flips
automatically; `rtl.css` covers the remaining physical-direction exceptions
(gradient angles, icon mirroring, scroll direction).

### Forms
Both the contact form and special-order form in `pages/contact.html` are
marked `data-validate` and are validated client-side in `main.js`
(required fields + email pattern, inline error messages, no-reload success
state). To go live:
1. Set each `<form action="...">` to your Formspree endpoint
   (`https://formspree.io/f/yourFormId`) or your Netlify Forms setup
   (add `data-netlify="true"` and a hidden `form-name` field).
2. Uncomment the `fetch()` TODO in `FormModule` in `main.js` if you want an
   AJAX submission instead of a full page redirect.

### Google Maps
`pages/contact.html` includes a `.map-placeholder` div with a `TODO` comment.
Replace it with an `<iframe>` using your Google Maps embed API key.

### Newsletter / Mailchimp / ConvertKit
The footer and coming-soon newsletter forms already validate client-side.
Point their `action` at your Mailchimp/ConvertKit form endpoint the same way
as the contact form.

### Payments (Stripe / PayPal)
Not implemented — this is a showcase/catalog template with no cart or
checkout. Integration points would live in a future `cart.html` /
`checkout.html`; add your SDK script tags and TODO-marked call sites there.

---

## 5. SEO

Every built page includes: a unique `<title>` under 60 characters, a unique
meta description, a canonical URL, Open Graph tags, one semantic `<h1>`, and
JSON-LD structured data (`Store`, `LocalBusiness`, or `ItemList` as
appropriate). `sitemap.xml` and `robots.txt` are included at the project
root — update the domain placeholders before launch.

---

## 6. Accessibility

- Skip-to-content link on every page
- Visible focus states (`:focus-visible`) using the accent color
- Semantic landmares (`header`, `nav`, `main`, `footer`) and heading hierarchy
- All interactive controls sized to a 44px minimum touch target
- `prefers-reduced-motion` disables scroll-reveal and shimmer animations
- Form fields have associated `<label>`s and inline, non-color-only error text

---

## 7. Browser support

Latest two versions of Chrome, Firefox, Safari, Edge. Uses modern CSS
(`clamp()`, logical properties, `backdrop-filter`) with graceful degradation —
older browsers simply lose blur/glass effects, not layout.

---

## 8. Changelog

- **v1.0** — Initial release: design system, homepage, fish catalog, contact
  page with special-order form, 404, coming-soon, dark mode, RTL stylesheet.
- **v1.1** — Added plants, equipment, and Care Guides blog pages.
- **v1.2** — Added the About page; replaced all placeholder SVG imagery with
  real photographs (see "Images" above for licensing steps before launch).
- **v1.3** — Added `home-2.html`, an alternate homepage composition. Added a
  four-person team grid to the About page and rebuilt "Our History" as a
  full-width milestone track (the old version was a single centred column
  with large empty margins on desktop; it now spans the full container,
  collapsing to a left-aligned vertical line on mobile).
- **v1.3** — Added Services, Service Details, and Blog Details, completing
  every page in the original file structure.

---

## 9. Credits & support

Fonts via Google Fonts (DM Serif Display, Manrope). Icons via Bootstrap
Icons. Layout utilities via Bootstrap 5.3. Photography is sourced from
Wikimedia Commons under CC BY / CC BY-SA licences — see "Images" above for
what to do before production use. For questions about extending this
template, continue the conversation with the assistant that generated it.
- **v1.4** — Design review: shared hero heights (home + interior), Log in / Sign up
  in the header plus `pages/login.html`, new dark-mode palette (navy surfaces,
  aqua primary #3FC1D6), grid layouts replacing horizontal scrollers, solid
  stock labels on photos, new Home sections (Fish Categories, Best Sellers,
  Aquarium Supplies, How We Supply & Deliver, Fish Care & Maintenance),
  Add to order / Enquire actions on every product card, unified footer with
  six social links.
