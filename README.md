# StreamVibe

StreamVibe is a responsive, multi-page streaming discovery experience implemented from the [StreamVibe Figma design](https://www.figma.com/design/DmfezCawHhsfwpsYnh6Ljn?node-id=0-1). It combines TMDB-powered discovery with local watchlist, liked-title, history, support, and subscription flows.

Production: [stream-vibe-movies.vercel.app](https://stream-vibe-movies.vercel.app/)

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Home, categories, devices, FAQ, and pricing preview |
| `/movies.html` | Movie/show discovery, genre filters, and pagination |
| `/display.html?id=858485&type=movie` | Movie details, cast, trailer, reviews, and library actions |
| `/show.html?id=66732&type=tv` | Show details, seasons, episodes, reviews, and library actions |
| `/support.html` | Validated support form and FAQ |
| `/subscription.html` | Monthly/yearly plans, comparison, and checkout flow |

## Local development

Requirements: Node.js 22 and pnpm 11.

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

The app contains a public demo TMDB credential for immediate local use. For a production-owned credential, set either:

```dotenv
VITE_TMDB_API_KEY=
VITE_TMDB_READ_TOKEN=
```

Do not commit private credentials. Vite exposes all `VITE_` values to browser code by design.

## Verification

```bash
pnpm test
pnpm check
pnpm preview
```

`pnpm check` runs the Node regression suite and the complete six-page Vite production build. Tests cover persistent library state, request caching, public page contracts, functional Support/Subscription controls, and the pnpm workspace setting required by Vercel.

## Architecture and behavior

- Vite builds every root HTML file as an independent entry page.
- Shared behavior starts in `src/js/main.js`; heavier detail, animation, and Swiper code is loaded only on pages that use it.
- TMDB requests use retry, timeout, in-memory caching, and session caching.
- Watchlist, likes, viewing history, and the selected subscription are stored locally in the browser.
- The support form creates a local reference and stores only non-PII ticket metadata. It does not send data to an external helpdesk.
- Checkout is a front-end product flow and does not charge a payment method. A production payment backend can replace the confirmation handler without changing the plan UI.

## Vercel

The Vercel project uses the Vite preset with:

- Install: `pnpm install`
- Build: `pnpm build`
- Output: `dist`
- Node.js: `22.x`

Keep the root `packages` entry in `pnpm-workspace.yaml`; Vercel's pnpm installer rejects a workspace file with an empty or missing package list.
