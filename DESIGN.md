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
3. **Restraint in motion.** Animate only state changes the user caused or needs to
   notice. Nothing that repeats on every keystroke or scroll.
4. **Accessible by default.** AA contrast for all text, visible focus, keyboard
   reachable, real alt text, skeleton/empty/error states for every query.

## Colour

Semantic roles. Light is the default; dark follows the system unless the user
chooses otherwise (`data-theme` on `<html>`).

| Role             | Token            | Light     | Dark      | Use |
|------------------|------------------|-----------|-----------|-----|
| Page background  | `--paper`        | `#F3EEE5` | `#1C1916` | `body`, sticky header |
| Raised surface   | `--surface`      | `#FBF8F2` | `#25211D` | inputs, icon buttons, play button |
| Primary text     | `--ink`          | `#1F1A14` | `#EDE5D8` | headings, body |
| Secondary text   | `--muted`        | `#6A6055` | `#A89D8F` | metadata, captions (AA on paper) |
| Hairline         | `--line`         | `#E0D8CA` | `#3A332C` | dividers, chip borders, image placeholders |
| Accent           | `--accent`       | `#A3421C` | `#E2865C` | kicker labels, links on hover, focus ring |
| Popcorn          | `--pop`          | `#F1D58A` | `#D9BC6E` | logo only |

Contrast (WCAG 2.2, computed): ink/paper 14.9:1, muted/paper 5.3:1, accent/paper 5.4:1,
muted/surface 5.8:1; dark ink/paper 14.0:1, dark muted/paper 6.6:1, dark accent/paper 6.5:1,
dark muted/surface 6.0:1. All text pairs pass AA.

Never use pure black or pure white. Shadows are tinted brown, never grey.

## Typography

| Role        | Family                         | Size / line-height            | Weight | Tracking |
|-------------|--------------------------------|-------------------------------|--------|----------|
| Display     | Newsreader (opsz 72)           | clamp(40px, 5vw, 68px) / 1.02 | 500    | -0.025em |
| H2 section  | Newsreader                     | 26-34px / 1.15                | 500    | -0.015em |
| Card title  | Newsreader                     | 17px / 1.25                   | 500    | -0.005em |
| Lede/prose  | Newsreader                     | 18-19px / 1.6                 | 400    | 0 |
| Tagline     | Newsreader italic              | 20px / 1.4                    | 400    | 0 |
| UI / body   | Instrument Sans                | 15-16px / 1.6                 | 400-500| 0 |
| Meta/caption| Instrument Sans                | 13-14px / 1.5                 | 400-500| 0 |

Fonts are self-hosted with Fontsource variable builds (`font-display: swap`).
Prose is capped at ~62ch.

## Spacing, layout

- 4px base scale (Tailwind default). Section rhythm: 48-56px between page sections.
- Container: max 1280px, side gutter 16px (mobile) / 40px (≥768px).
- Home grid: 2 cols (<640), 3 cols (≥640), 6 cols (≥1024). Gaps 16/24px horizontal, 32-36px vertical.
- Movie page: single column on mobile; ≥900px a 280px sticky poster column + `minmax(0,1fr)` content.

## Shape and depth

| Token         | Value | Use |
|---------------|-------|-----|
| `--radius`    | 10px  | backdrops, trailer, large media |
| `--radius-sm` | 6px   | posters, profile photos |
| pill          | 999px | buttons, chips, search, icon buttons |

Shadows: `--shadow-soft` (posters, feature image) and `--shadow-lift` (movie page poster only).
No borders on cards; separation comes from whitespace and hairlines.

## Components

- **Header**: 64px, sticky, paper background, hairline bottom. Logo + wordmark left, search pill + theme toggle right.
- **Chip** (genre filter): 34px pill, hairline border; selected = ink fill, paper text. `aria-pressed`.
- **Primary button**: 44px pill, ink fill, paper text. Press: `scale(.97)`.
- **Poster card**: poster (2:3, radius-sm, soft shadow), serif title, muted year.
- **Facts row**: `<dl>` grid, hairline above and below each cell, muted label over medium value.
- **Skeletons**: same shape as the content, `--line` fill, slow opacity pulse (disabled with reduced motion).
- **Empty / error**: serif heading, one sentence, one action. Never a bare spinner.

## Motion

Owned by the `animate` / `emil-design-eng` guidance. Defaults:

- Easing: `--ease-out: cubic-bezier(.23, 1, .32, 1)` for entrances and press; plain `ease` for hover and colour.
- Animate `transform` and `opacity` only. Utilities in `index.css`: `press`, `fade-in-image`, `poster-zoom`, `skeleton`.

| What | Value | Purpose |
|------|-------|---------|
| Image fade-in on network load | opacity, 250ms `--ease-out` | Prevents images popping in |
| Image already cached (e.g. going back) | no animation | Was already there; a re-fade would be noise |
| Button press (`press`) | `scale(.97)`, 160ms `--ease-out` | Feedback |
| Genre chip selection | colours, 150ms `ease` | State change |
| Poster hover (`poster-zoom`) | `scale(1.025)`, 200ms `ease`, hover + fine pointer only | Affordance |
| Skeleton pulse | opacity 1 → .55, 1.6s loop | Loading |

- No animation on typing, genre switching or infinite-scroll appends (frequent actions).
- `prefers-reduced-motion: reduce` keeps the opacity fades and colour changes, and removes
  press scale, hover zoom and the skeleton pulse.

## Iconography

Phosphor Icons (regular weight), 16-20px, `currentColor`. The logo is the only custom SVG.

## Logo

A striped popcorn bucket (accent stripes on surface, ink outline) with three popcorn
puffs in `--pop`, beside the "Grab Your Popcorn" wordmark in Newsreader 600.
The favicon is the bucket alone. The TMDB logo appears only in the footer, smaller than ours.
