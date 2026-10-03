# Technical decisions

Why the project is built the way it is, and which alternatives were discarded.
Each entry is short on purpose; the code comments point back here where relevant.

## 1. Hosting: a static site on GitHub Pages

The demo lives at `https://dfabiorc.github.io/grab-your-popcorn/`, a _project site_
served from a subdirectory. Everything follows from two facts about GitHub Pages:
it only serves files (no server code, no rewrites), and the site is not at the domain root.

- `base: '/grab-your-popcorn/'` in `vite.config.ts`, so every asset URL (JS, CSS,
  fonts, favicon) is prefixed with the subdirectory in dev, preview and production.
- Deployment through GitHub Actions (`actions/upload-pages-artifact` +
  `actions/deploy-pages`), not a `gh-pages` branch: no generated files in git history,
  and the deploy only happens after lint, unit and e2e tests pass.

## 2. Routing: `HashRouter` (`createHashRouter`)

URLs look like `…/grab-your-popcorn/#/movie/123`.

**Why.** With normal paths (`…/grab-your-popcorn/movie/123`), reloading the page or
opening a shared link asks GitHub Pages for a file called `movie/123`. It does not
exist, so Pages answers **404**. Everything after `#` is never sent to the server:
Pages always serves `index.html`, and the router reads the hash in the browser.
Reloads and shared links always work.

`createHashRouter` (the data-router version of `HashRouter`) is used so the app also
gets `ScrollRestoration` (going back to the home feed returns to the same scroll
position) and route `loader`s (see Performance).

**Discarded alternatives**

| Option                                                         | Why not                                                                                                                                  |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `BrowserRouter` + `404.html` redirect trick                    | The deep link still returns an HTTP 404 first (bad for crawlers and link previews), needs a redirect script and causes a visible reload. |
| Another host with rewrites (Netlify, Vercel, Cloudflare Pages) | The brief requires GitHub Pages.                                                                                                         |
| Pre-rendering every route                                      | Film and person ids are unbounded; there is nothing to pre-render ahead of time.                                                         |

**Trade-off.** Hash URLs are slightly less pretty, and per-page metadata (title,
social preview) cannot be served to crawlers. The document title is still updated
per page in the browser.

## 3. The TMDB API key is visible, on purpose

A static site has no server, so the browser calls TMDB directly and the key must be
in the JavaScript bundle. Anyone who opens DevTools can read it. This is accepted
and documented rather than hidden:

- **It is a TMDB v3 API key**, used here only for public, read-only `GET` requests.
  It cannot act on anyone's account without a separate user session.
- **It is not in the repository.** Locally it comes from `.env.local` (git-ignored;
  `.env.example` documents the variable). In CI it comes from the `TMDB_API_KEY`
  repository secret and is injected only into the production build. The e2e tests mock
  TMDB and run with a placeholder.
- **It can be rotated** from the TMDB account settings at any time.
- **TMDB terms** (checked October 2026): non-commercial use is free; apps must show
  the TMDB logo and the notice "This product uses TMDB and the TMDB APIs but is not
  endorsed, certified, or otherwise approved by TMDB" (in the footer); cached data
  must not be kept longer than 6 months (this app only caches in memory for the
  session); applications must not conceal their identity. Nothing in the terms
  forbids client-side use. A portfolio project without ads or payments is
  non-commercial.

**Key as a query parameter, not a bearer token.** TMDB accepts either `?api_key=`
or an `Authorization: Bearer` header. A custom header makes the browser send a CORS
preflight (`OPTIONS`) before every request, doubling round trips. The query parameter
avoids that, and the key is equally visible either way.

**Optional improvement (not implemented): a tiny proxy.** A free Cloudflare Worker
could hold the key as a secret and forward only the endpoints the app uses:

```js
// worker.js (sketch)
const ALLOWED = /^\/3\/(configuration|genre\/movie\/list|discover\/movie|movie\/\d+|person\/\d+|search\/multi)$/
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin')
    const url = new URL(request.url)
    if (origin !== 'https://dfabiorc.github.io' || !ALLOWED.test(url.pathname)) {
      return new Response('Forbidden', { status: 403 })
    }
    url.hostname = 'api.themoviedb.org'
    url.searchParams.set('api_key', env.TMDB_API_KEY)
    const response = await fetch(url, { cf: { cacheTtl: 600 } })
    const headers = new Headers(response.headers)
    headers.set('Access-Control-Allow-Origin', origin)
    return new Response(response.body, { status: response.status, headers })
  },
}
```

The app would only change `TMDB_API_BASE` in `src/config/app.ts` and stop sending
the key. Note that an `Origin` check stops other websites, not scripts (they can fake
the header), so per-IP rate limiting would be the next step. It was left out to keep
the project 100% static and free of infrastructure.

## 4. Data layer

- **TanStack Query** for every request: deduplication, retries (none for 4xx), and an
  in-memory cache (`staleTime` 10 min, `gcTime` 30 min). Going back to the home feed,
  or reopening a film, costs zero requests. Nothing is persisted to storage, which
  keeps the app within TMDB's caching rules and always fresh on a new visit.
- **One typed client** (`src/api/client.ts`) adds the key and language to every
  request and turns TMDB errors into `TmdbError` with the status, so pages can show
  "not found" for 404s and a retry for everything else.
- **`append_to_response`** fetches a film with credits, videos, reviews and related
  films in one request (and a person with their credits).
- **Home feed**: `/discover/movie` sorted by `primary_release_date.desc`, limited to
  `primary_release_date.lte=today`, with `vote_count.gte=20` and no adult titles.
  Without the vote threshold the newest entries are mostly placeholders with no poster,
  synopsis or votes. TMDB caps lists at 500 pages; the feed shows an end state there.
  Results are de-duplicated across pages because TMDB lists are live and an item can
  move between pages while you scroll.
- **Featured film** comes from the unfiltered feed, so changing the genre filter never
  swaps the content above it.
- **"More like this" uses `recommendations`, falling back to `similar`.** `similar`
  matches loosely on keywords (for _The Dog Stars_ it returned _Ivanhoe_ and _Tony
  Rome_); `recommendations` returned _I Am Legend_, _The Omega Man_, _Twelve Monkeys_.
- **"Known for"** ranks the person's credits in their main department (cast for actors,
  e.g. Directing for directors) by vote count, skipping "Self/Himself" appearances
  (talk shows, making-ofs), which otherwise dominate for directors.
- **Trailer**: official YouTube trailer, then any trailer, then a teaser. Clips and
  featurettes are not shown as "the trailer".
- **Search** uses `/search/multi` (one request for films and people) and drops TV
  results, which are out of scope.
- **TMDB text** (biographies, reviews) is cleaned: markdown and HTML are stripped, and
  non-breaking spaces (common in TMDB data) are normalised so text wraps properly.

## 5. Language

`LANGUAGE` in `src/config/app.ts` is the single switch: it is sent to TMDB as
`language` (titles, synopses and genres come back translated) and selects the UI copy
from `src/config/strings.ts`. Only English copy exists today; adding a locale is one
object in that file.

## 6. Stack

| Choice                               | Why                                                                                                              | Discarded                                                                                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Vite + React 19 + TypeScript         | Fast static build, mature ecosystem, typed API responses.                                                        | Next.js: its strengths (SSR, server routes) are unavailable on GitHub Pages; a static export would add complexity for nothing.               |
| Tailwind CSS v4                      | Design tokens live in CSS (`@theme`), so `DESIGN.md` maps 1:1 to `index.css` and dark mode only swaps variables. | CSS Modules: more files, no shared scale. A component library (shadcn/ui, Radix Themes): the editorial look needed custom components anyway. |
| React Router v8 (`createHashRouter`) | Hash routing plus loaders, lazy routes and scroll restoration.                                                   | Hand-rolled hash routing: would re-implement all of that.                                                                                    |
| TanStack Query                       | Caching, dedupe, infinite queries.                                                                               | Redux/RTK Query: more setup for a read-only app. Plain `fetch` + `useEffect`: no cache, race conditions.                                     |
| CSS-only motion                      | Every animation is a transition on `transform`/`opacity`; no runtime cost.                                       | Motion (Framer Motion): ~30 KB for effects CSS handles.                                                                                      |
| Phosphor icons                       | Consistent regular weight, tree-shaken.                                                                          | Lucide (same idea; Phosphor fits the softer style).                                                                                          |
| oxlint + Prettier                    | Fast lint with React hook rules; one formatting style.                                                           | ESLint: slower, more config for the same rules here.                                                                                         |
| Vitest + Playwright + axe            | Unit tests for data logic; real-browser e2e with automatic WCAG checks.                                          | Testing Library component tests: e2e covers the UI with less mocking.                                                                        |

## 7. Design

Two visual variants were mocked in HTML and compared; **variant A, "Paper & Ink"**
(magazine-like: cream paper, near-black ink, one terracotta accent, Newsreader +
Instrument Sans) was chosen. `DESIGN.md` is the source of truth for tokens, components
and motion.

- Fonts are open-source and self-hosted (Fontsource), so no requests go to Google.
  Fraunces was considered and dropped as an over-used "AI template" serif.
- Contrast was computed, not eyeballed: every text pair passes WCAG AA in both themes.
- Motion was decided per interaction (frequency, purpose, easing, duration) and audited
  per screen. Frequent actions (typing, filtering, infinite scroll) are not animated;
  `prefers-reduced-motion` keeps opacity fades and removes movement.

## 8. Performance

Measured with Lighthouse on the production build (`vite preview`):

| Page   | Mobile (simulated slow 4G) | Desktop |
| ------ | -------------------------- | ------- |
| Home   | 90                         | 99      |
| Film   | 82                         | 98      |
| Person | 89                         | 99      |
| Search | 87                         | 99      |

Accessibility, Best Practices and SEO score 100 on every page.

What was done:

- **Route-level code splitting**: film, person and search pages are separate chunks.
- **Loaders prefetch data**: each route's loader starts its TMDB request (without
  awaiting it) so data downloads in parallel with the page chunk.
- **Static shell in `index.html`**: the header paints from HTML and CSS before the JS
  bundle runs (first contentful paint 2.4 s → 1.5 s on mobile).
- **Images**: `srcset` + `sizes` with TMDB's sizes (including `h632` for profiles),
  `width`/`height` to reserve space, `loading="lazy"` except the hero, which gets
  `fetchpriority="high"`; `preconnect` to the API and image CDN.
- **Fonts**: only the display font keeps the optical-size axis; the italic (used at
  text sizes) uses the lighter weight-only file (-80 KB).
- **No layout shift**: skeletons match the final layout and the main area is at least
  one screen tall, so the footer never jumps into view.

What limits mobile LCP is structural: the largest image is only known after the JS
bundle runs and the API answers. Server rendering would fix it, but GitHub Pages
cannot run a server.

## 9. Testing

- **Unit (Vitest)**: formatting, image URLs, API client, pagination, credits, known-for
  and filmography logic.
- **End-to-end (Playwright)** against the production build under the real base path,
  at 1440 px and 390 px. TMDB is mocked with **synthetic fixtures** (made-up films and
  people), so tests need no key, never break because TMDB data changed, and no TMDB
  content is stored in the repository. A request to a TMDB endpoint without a fixture,
  any console error, or any WCAG 2.2 AA violation (axe) fails the test.
