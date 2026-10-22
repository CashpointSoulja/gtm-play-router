# Design

GTM Play Router is an unofficial concept by Ayo Ahmed. Its visual system follows the rules Vercel publishes for its own interfaces (the Geist brand and design pages), applied to a dark theme. This file records the rules and tokens the page uses. Where this file and any other note disagree, these rules win.

Scope: visuals only. Routes, data flow, copy and the AI Gateway call are unchanged by design work.

## Principles

- One continuous black canvas. Hierarchy comes from type scale and weight first, then space, then surfaces.
- A border or card has to be earned by selection, interaction, a warning or confirmation state, or a real grouping. No nested panels and no card around every section or metric.
- Monochrome. Colour may only carry state or data meaning, and always alongside a non-colour cue. The page currently needs none. No blue text anywhere, including selection highlights and focus rings.
- Every object aligns to a shared column edge or baseline. Equivalent blocks share type roles and value positions.
- Stillness by default. Motion only explains a state change, keeps continuity or confirms an action. Nothing is hidden behind an animation.

## Rejected outright

Decorative gradients, gradient text, glows, blobs, stripes, textures, grid backgrounds, glass effects, ornamental shadows, parallax, fake depth, marquees, typing cursors, pulsing status dots, ghost numerals, all-caps eyebrows, overlines and decorative section numbers.

## Colour tokens

| Token | Value | Use |
| --- | --- | --- |
| `--background-100` | `oklch(0 0 0)` | Page canvas |
| `--background-200` | `oklch(0.027 0 0)` | Hover fill on interactive rows |
| `--gray-100` | `oklch(0.218 0 0)` | |
| `--gray-200` | `oklch(0.239 0 0)` | |
| `--gray-300` | `oklch(0.281 0 0)` | Confidence bar track |
| `--gray-400` | `oklch(0.301 0 0)` | |
| `--gray-500` | `oklch(0.39 0 0)` | |
| `--gray-600` | `oklch(0.623 0 0)` | |
| `--gray-700` | `oklch(0.65 0 0)` | |
| `--gray-800` | `oklch(0.59 0 0)` | |
| `--gray-900` | `oklch(0.706 0 0)` | Secondary text |
| `--gray-1000` | `oklch(0.946 0 0)` | Primary text, primary button fill, focus ring |
| `--border-subtle` | `oklch(1 0 0 / 0.13)` | Row dividers, header and footer rules |
| `--border-default` | `oklch(1 0 0 / 0.14)` | Interactive objects at rest, grouped blocks |
| `--border-strong` | `oklch(1 0 0 / 0.24)` | Hover, confirmation state |

Selected state uses `--gray-1000` as a two-pixel edge, so selection reads through weight as well as lightness.

## Type

Geist Sans for prose, headings, labels, controls, tables, KPIs and figures. Geist Mono only for code, commands, paths, tokens, timestamps and short identifiers (API paths, package names, model ids, the deployment URL, audit timestamps).

Fixed roles. No other sizes or weights appear on the page.

| Role | Size / leading | Weight | Tracking | Used for |
| --- | --- | --- | --- | --- |
| Display | 48 / 56 | semibold | -2.4px | The single page-defining statement (40 / 48 below 640px) |
| Page title | 40 / 48 | semibold | -2.4px | Session KPIs (32 / 40 below 640px) |
| Title | 32 / 40 | semibold | -1.28px | Routed motion and confidence figures |
| Section heading | 24 / 32 | semibold | -0.96px | Section headings |
| Subsection | 20 / 26 | semibold | -0.4px | Beat titles, the selected signal |
| Lede | 18 / 28 | regular | 0 | Hero lede |
| Body | 16 / 24 | regular | 0 | Prose, row names, column labels |
| Compact | 14 / 20 | regular, medium | 0 | Secondary labels, list metadata, legal line |
| Caption | 13 / 18 | | | Reserved. Not used, so no secondary copy falls below 14px |

Weights are tokens: regular 400, medium 500, semibold 600. Figures use tabular numerals. Prose is held to a 60 to 68 character measure. Headings are sentence case and state a claim.

## Layout

- Content width 1200px, centred, on a 12-column grid with 24px gutters. 6 columns below 1024px, 4 below 640px.
- Page padding 32px, 24px below 1024px, 16px below 640px.
- Shared edges: column 1, column 4 (row-list content, second KPI) and column 7 (third KPI, routed decision).
- Spacing steps from a 4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96. Sections are separated by 96px of space (64px on mobile), not by boxes.
- Radii: 8px for blocks and controls, 6px for small inline objects.
- Controls are 36px high, 44px on coarse pointers.

## Surfaces that earn a border

- Signal options: interactive and selectable.
- Routing-in-progress row and the shipped confirmation: state.
- The drafted email, the live call record and the audit log: real groupings with their own content.
- Row lists (beats, platform rows): hairline dividers only.

## Motion

- The routed result fades and rises 4px over 200ms when it first appears, and the confidence bar grows to its value over 400ms. Both confirm the routing action.
- The routed line on a signal fades in over 200ms.
- KPI counters count up over 600ms when a signal is routed.
- The spinner rotates while the request is in flight.
- Hover and selection borders transition over 150ms.
- Under `prefers-reduced-motion: reduce` every one of these is removed: counters jump to their value, the spinner stops, and nothing fades or moves.

## Brand marks

- The Vercel triangle appears once, in the footer beside the "Deployed on Vercel" line, as the official unmodified white asset at 14 × 12px, with clear space at least equal to its height on every side.
- It is never part of the product name or header, and it is smaller and lighter than both the page title and Ayo Ahmed's name.
- No Vercel wordmark is used.
- The footer carries the trademark line: "Vercel, the Vercel design, Next.js and related marks, designs and logos are trademarks or registered trademarks of Vercel, Inc. or its affiliates in the US and other countries."
