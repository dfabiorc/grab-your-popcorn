# Grab Your Popcorn · Design system

Variant A, "Paper & Ink". An editorial, magazine-like interface on warm paper.
The posters are the only saturated colour on screen; everything else stays calm.

This file is the source of truth. Tokens live in `src/styles/index.css` and must
match the tables below. If they drift, update both in the same commit.

## Principles

1. **Posters lead.** UI chrome is warm neutrals and one accent. No coloured
   backgrounds behind content, no gradients except the backdrop fade.
2. **Pages read like documents.** Clear type hierarchy, metadata in quiet rows,
   generous whitespace, hairline dividers instead of boxes.
3. **Cinematic, never in the way.** Scrolling tells a story (a pinned hero, content
   settling into place, posters travelling between pages), always tied 1:1 to the
   scroll so it can be reversed. Nothing animates on typing or filtering.
4. **Accessible by default.** AA contrast for all text, visible focus, keyboard
   reachable, real alt text, skeleton/empty/error states for every query.

## Colour

Semantic roles. Light is the default; dark follows the system unless the user
chooses otherwise (`data-theme` on `<html>`).

| Role            | Token       | Light     | Dark      | Use                                        |
| --------------- | ----------- | --------- | --------- | ------------------------------------------ |
| Page background | `--paper`   | `#F3EEE5` | `#1C1916` | `body`, sticky header                      |
| Raised surface  | `--surface` | `#FBF8F2` | `#25211D` | inputs, icon buttons, play button          |
| Primary text    | `--ink`     | `#1F1A14` | `#EDE5D8` | headings, body                             |
| Secondary text  | `--muted`   | `#6A6055` | `#A89D8F` | metadata, captions (AA on paper)           |
| Hairline        | `--line`    | `#E0D8CA` | `#3A332C` | dividers, chip borders, image placeholders |
| Accent          | `--accent`  | `#A3421C` | `#E2865C` | kicker labels, links on hover, focus ring  |

Contrast (WCAG 2.2, computed): ink/paper 14.9:1, muted/paper 5.3:1, accent/paper 5.4:1,
muted/surface 5.8:1; dark ink/paper 14.0:1, dark muted/paper 6.6:1, dark accent/paper 6.5:1,
dark muted/surface 6.0:1. All text pairs pass AA.

Never use pure black or pure white. Shadows are tinted brown, never grey.

## Typography

| Role         | Family               | Size / line-height                              | Weight  | Tracking |
| ------------ | -------------------- | ----------------------------------------------- | ------- | -------- |
| Hero title   | Newsreader (opsz 72) | clamp(52px, 9vw, 132px) / .95                   | 500     | -0.025em |
| Display      | Newsreader (opsz 72) | clamp(44px, 6.4vw, 96px) / .98                  | 500     | -0.025em |
| H2 section   | Newsreader (opsz 72) | clamp(28px, 3vw, 40px) / 1.1 (home: up to 72px) | 500     | -0.025em |
| Card title   | Newsreader           | 17px / 1.25                                     | 500     | -0.005em |
| Lede/prose   | Newsreader           | 18-19px / 1.6                                   | 400     | 0        |
| Tagline      | Newsreader italic    | 20px / 1.4                                      | 400     | 0        |
| UI / body    | Instrument Sans      | 15-16px / 1.6                                   | 400-500 | 0        |
| Meta/caption | Instrument Sans      | 13-14px / 1.5                                   | 400-500 | 0        |

Fonts are self-hosted with Fontsource variable builds (`font-display: swap`).
Prose is capped at ~62ch.

## Spacing, layout

- 4px base scale (Tailwind default). Section rhythm: 48-56px between page sections.
- Container: max 1280px, side gutter 16px (mobile) / 40px (≥768px).
- Home grid: 2 cols (<640), 3 cols (≥640), 6 cols (≥1024). Gaps 16/24px horizontal, 32-36px vertical.
- Movie page: single column on mobile; ≥900px a 280px sticky poster column + `minmax(0,1fr)` content.

## Shape and depth

| Token         | Value | Use                                  |
| ------------- | ----- | ------------------------------------ |
| `--radius`    | 10px  | backdrops, trailer, large media      |
| `--radius-sm` | 6px   | posters, profile photos              |
| pill          | 999px | buttons, chips, search, icon buttons |

Shadows: `--shadow-soft` (posters, feature image) and `--shadow-lift` (movie page poster only).
No borders on cards; separation comes from whitespace and hairlines.

## Components

- **Header**: 64px, sticky, translucent paper (`backdrop-filter: blur(20px) saturate(1.8)`, solid with reduced transparency); the hairline fades in once you scroll. Logo + wordmark left, search pill + theme toggle right.
- **Home hero**: full-bleed backdrop starting under the header, light text on a dark scrim (fixed colours in both themes), terracotta-light kicker `#F0A27C`, light pill CTA.
- **Chip** (genre filter): 34px pill, hairline border; selected = ink fill, paper text. `aria-pressed`.
- **Primary button** (`btn-primary`): 44px pill, ink fill, paper text.
- **Secondary button** (`btn-secondary`): 40px pill, hairline border, ink text.
- **Poster card**: poster (2:3, radius-sm, soft shadow), serif title, muted year.
- **Facts row**: `<dl>` grid, hairline above and below each cell, muted label over medium value.
- **Skeletons**: same shape as the content, `--line` fill, slow opacity pulse (disabled with reduced motion).
- **Empty / error**: serif heading, one sentence, one action. Never a bare spinner.

## Motion

Owned by the `animate` / `emil-design-eng` guidance. Defaults:

- Easing: `--ease-out: cubic-bezier(.23, 1, .32, 1)` for entrances and press; plain `ease` for hover and colour;
  `cubic-bezier(.32, .72, 0, 1)` for the shared-element page transition; `linear` for constant motion.
- Animate `transform` and `opacity` (plus `clip-path` for heading masks, `border-radius` on the hero).
- Interaction utilities live in `index.css` (`button-motion`, `fade-in-image`, `poster-zoom`, `skeleton`);
  scroll-driven motion and page transitions in `motion.css`.

### Interaction

| What                                   | Value                                                                      | Purpose                                     |
| -------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------- |
| Image fade-in on network load          | opacity, 250ms `--ease-out`                                                | Prevents images popping in                  |
| Image already cached (e.g. going back) | no animation                                                               | Was already there; a re-fade would be noise |
| Button hover (`button-motion`)         | `scale(1.04)` + trailing arrow `translateX(3px)`, 200ms `ease`, mouse only | Affordance                                  |
| Button press (`button-motion`)         | `scale(.97)`, 100ms `--ease-out`                                           | Feedback                                    |
| Genre chip selection                   | colours, 150ms `ease`                                                      | State change                                |
| Poster hover (`poster-zoom`)           | `scale(1.025)`, 200ms `ease`, hover + fine pointer only                    | Affordance                                  |
| Skeleton pulse                         | opacity 1 → .55, 1.6s loop                                                 | Loading                                     |

### Scroll-driven (CSS `animation-timeline`, progressive enhancement)

Tied 1:1 to the scroll position, so everything reverses when scrolling back up. Only
active where `animation-timeline` is supported and motion is not reduced; elsewhere the
page renders in its final state.

| What                | Class                                | Behaviour                                                                                                   |
| ------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Header edge         | `glass-header`                       | Hairline fades in over the first 96px of scroll                                                             |
| Home hero           | `hero-track` / `hero-stage`          | Pins for ~70svh of scroll; image scales to .86 with 28px corners and dims; copy rises 14vh and fades by 55% |
| Feed sheet          | `hero-follow`                        | Rises over the pinned hero with rounded top corners and a soft shadow                                       |
| Film backdrop       | `parallax-backdrop` / `parallax-dim` | Drifts down 32% and zooms 1.04 → 1.12 while leaving; dissolves into paper                                   |
| Section headings    | `reveal-mask`                        | Wiped in from the bottom (clip-path), rising .35em                                                          |
| Text, reviews, rows | `reveal`                             | Rise 40px + scale .97 → 1 and fade in while entering                                                        |
| Grids               | `reveal-grid`                        | Shorter rise (20px, .985) cascading by column (+7% of the entry range per column)                           |
| Trailer             | `reveal-zoom`                        | Grows from .82 as it scrolls towards the centre                                                             |
| Horizontal rows     | `reveal-slide`                       | Slide in 80px from the right (clipped, so the page never widens)                                            |

### Page transitions (View Transitions API)

| What               | Behaviour                                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Poster → film page | The tapped poster travels into the film page poster (`film-poster`), 450ms `cubic-bezier(.32,.72,0,1)`                     |
| Hero → film page   | The hero image becomes the film backdrop (`film-backdrop`)                                                                 |
| Everything else    | Old page fades out in 160ms, new page fades in over 260ms; the header stays still                                          |
| Waiting for data   | In-app film navigations wait up to 600ms for data (prefetched on hover / press); a 2px accent hairline appears after 150ms |

### Rules

- No animation on typing, genre switching or infinite-scroll appends (frequent actions).
- `prefers-reduced-motion: reduce` keeps the opacity fades and colour changes, and removes
  button scale, arrow nudge, hover zoom, the skeleton pulse, every scroll-driven effect
  and page transitions. The progress hairline becomes static.
- `prefers-reduced-transparency: reduce` makes the header solid.

## Iconography

Phosphor Icons (regular weight), 16-20px, `currentColor`. The logo is the only custom SVG.

## Logo

Line-art popcorn bucket: a cloud of popcorn over a tapered bucket with two stripes.
Transparent, single stroke in `currentColor` (1.6px at 32px, 2px in the favicon), so it is
ink on paper and near-white in dark mode. The wordmark "Grab Your Popcorn" uses the display
style (Newsreader 500, opsz 72, -0.025em), the same as page titles.
The favicon is the bucket alone and follows the system theme; the Apple touch icon keeps a
paper background because iOS fills transparency with black.
The TMDB logo appears only in the footer, smaller than ours.
