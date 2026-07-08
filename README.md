# Bundle Builder

A multi-step security-system bundle builder with a live review panel, built as a
data-driven React prototype. A 4-step accordion walks the shopper through choosing
cameras, a plan, sensors, and extra protection; a review panel beside it updates
in real time as the configuration changes.

---

## Quick start

**Prerequisites:** Node 20+ and npm.

```bash
npm install

# Option A — frontend only (the app fetches /api/catalog, then falls back to the
# bundled catalog.json, so it works fully without the backend):
npm run dev

# Option B — frontend + the bonus API together:
npm run dev:all
```

Open the URL Vite prints (default <http://localhost:5173>).

### Other scripts

```bash
npm run server    # run only the Express API (port 8787)
npm run build     # type-check + production build
npm run preview   # preview the production build
```

The app builds and runs from a clean clone with no extra setup.

---

## Tech stack

- **React 19 + TypeScript** (Vite)
- **Zustand** for state
- **Tailwind CSS v4** for styling (design tokens live in `src/index.css` `@theme`)
- **Express** for the optional catalog API (bonus)

---

## How it's built

### Data-driven

Everything renders from a single JSON source, `src/data/catalog.json` — products,
variants, pricing, steps, plan, shipping, and the initial seed. No product markup
is hardcoded; adding or editing a product is a data change.

### State model (the important part)

The whole UI is derived from one small, serializable selection state:

```ts
{
  quantities: Record<`${productId}:${variantId}`, number>, // per-variant counts
  activeVariant: Record<productId, variantId>,             // which chip is active
  selectedPlanId: string | null,
  openStepId: string,
}
```

Everything else — the review lines, the "N selected" counts, the totals, the
savings — is **derived** by pure functions in `src/lib/selectors.ts`, never stored.
Because both steppers (product card and review line) read/write the same
`quantities[key]`, they stay in sync automatically.

**Variant quantities are tracked per `(product, variant)`.** The card's stepper is
bound to the *active* variant, so selecting a color switches which count it shows
and edits, while every other variant keeps its own count and appears as its own
review line. Colorless products (e.g. the doorbell) are modeled uniformly as a
single `default` variant with a `null` label — one code path for all products.

### Persistence

**Save my system for later** writes the selection state to `localStorage`.
On load, the app restores a saved system if present, otherwise it hydrates the
seed. The "Saved ✓" indicator clears as soon as the configuration changes again,
so it never claims a stale snapshot is saved.

### Backend (bonus)

`server/index.js` is a tiny Express server exposing `GET /api/catalog` (and
`/api/health`). It reads the same `catalog.json` the frontend bundles, so the two
can never drift. In dev, Vite proxies `/api` → `localhost:8787`. If the API is
down, the frontend falls back to the bundled JSON — the clone always works.

---

## Decisions & tradeoffs

- **Pricing model / Pan v3 deviation.** The Figma's numbers are consistent at the
  totals level (savings **$50.92**, struck total, etc.), but the Wyze Cam Pan v3
  *card* per-unit price doesn't multiply cleanly to its *review line* total in the
  mock (a design inconsistency). I resolved this the recomputable way —
  **review line = per-unit price × quantity** — so every number stays correct as
  quantities change. This reproduces the design's exact **$50.92 savings**; the
  grand total differs from the mock's static figure only because of that Pan v3
  discrepancy.

- **Savings excludes shipping — intentionally.** The headline "saving $50.92"
  counts product + plan discounts only, matching the Figma (which shows free
  shipping but does not fold it into the savings figure).

- **Layout interpretation.** The Figma has two desktop compositions. I treated the
  side-by-side layout (review panel on the right) as the primary desktop target,
  since it matches the brief, with the single-row/review-below layout as
  wide-screen behavior. Mobile stacks to a single column with the review below,
  plus the "Let's get started!" title from the phone mock.

- **Fonts.** The design font is **Gilroy**. The `.woff2` files under
  `public/fonts/` are self-hosted for fidelity, isolated behind the `--font-sans`
  token so the whole app can be re-themed from one place.

- **Swatch chips** render simple color dots as a placeholder; real swatch
  thumbnails can drop into `public/img/swatches/` and are wired via the catalog's
  `variant.swatch` field.

- **Checkout** is a placeholder — it opens a confirmation modal instead of
  processing payment, as allowed by the brief.

---

## Known follow-ups (out of scope for this pass)

Surfaced by a code review; non-blocking:

- Add an error state / retry to `store.init()` (currently only a loading state).
- Reconcile a restored selection against the current catalog (drop orphaned keys,
  re-add required items) rather than trusting `localStorage` verbatim.
- Replace the `'plan'` step magic-string with a `Step.kind` discriminator.
- Reuse `PriceDisplay` in the review panel / plan card (some price markup is
  duplicated) once it takes tone/period props.

---

## Project structure

```text
server/index.js            Express catalog API (bonus)
src/
  data/catalog.json        Single source of truth (products, seed, plan, …)
  state/
    types.ts               Catalog + selection + derived types
    store.ts               Zustand store (fetch, fallback, hydrate, persist)
    persistence.ts         localStorage load/save
  lib/
    selectors.ts           Pure derivations: review lines, counts, totals
    money.ts               Currency formatting
  components/
    builder/               Accordion, product card, variant selector, plan step
    review/                Review panel
    shared/                QuantityStepper, PriceDisplay
  App.tsx                  Two-column responsive shell
```
