---
version: alpha
name: Loomi (Light)
description: >
  Identity system for Loomi — a light-first, type-driven brand built on
  contrast, motion, and purposeful restraint. Sem parar.
mode: light-first

colors:
  primary: "#7B3FFF"
  secondary: "#FF2D87"
  tertiary: "#8B3FE0"
  tertiary-soft: "#C47EFF"
  neutral: "#131313"
  background: "#F4F4F5"
  page: "#FAFAFA"
  surface: "#FFFFFF"
  on-primary: "#FFFFFF"
  on-surface: "#131313"
  on-surface-muted: "rgba(19,19,19,0.6)"
  white: "#FFFFFF"
  luxus: "#C47EFF"

typography:
  display:
    fontFamily: Sora
    fontSize: 6.5rem
    fontWeight: 200
    lineHeight: 0.9
    letterSpacing: -0.04em
  h1:
    fontFamily: Sora
    fontSize: 3.5rem
    fontWeight: 200
    lineHeight: 1
    letterSpacing: -0.03em
  h2:
    fontFamily: Sora
    fontSize: 2.5rem
    fontWeight: 200
    lineHeight: 1.1
    letterSpacing: -0.025em
  h3:
    fontFamily: Sora
    fontSize: 1.5rem
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: -0.01em
  body-md:
    fontFamily: Sora
    fontSize: 1rem
    fontWeight: 300
    lineHeight: 1.6
    letterSpacing: 0
  body-sm:
    fontFamily: Sora
    fontSize: 0.875rem
    fontWeight: 300
    lineHeight: 1.6
    letterSpacing: 0
  label-caps:
    fontFamily: Sora
    fontSize: 0.6875rem
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0.3em
  caption:
    fontFamily: Sora
    fontSize: 0.6875rem
    fontWeight: 300
    lineHeight: 1
    letterSpacing: 0.15em

rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  pill: 100px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  3xl: 100px

components:
  button-primary:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: 14px 28px
    typography: "{typography.label-caps}"
  button-primary-hover:
    backgroundColor: "#000000"
    textColor: "{colors.white}"
  button-purple:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    padding: 14px 28px
    typography: "{typography.label-caps}"
  button-purple-hover:
    backgroundColor: "#6A32E0"
    textColor: "{colors.on-primary}"
  button-pink:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    padding: 14px 28px
    typography: "{typography.label-caps}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.neutral}"
    border: "1px solid rgba(19,19,19,0.2)"
    rounded: "{rounded.pill}"
    padding: 14px 28px
    typography: "{typography.label-caps}"
  badge-purple:
    backgroundColor: "rgba(123,63,255,0.10)"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: 6px 14px
    typography: "{typography.label-caps}"
  badge-pink:
    backgroundColor: "rgba(255,45,135,0.10)"
    textColor: "{colors.secondary}"
    rounded: "{rounded.pill}"
    padding: 6px 14px
    typography: "{typography.label-caps}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    border: "1px solid rgba(19,19,19,0.08)"
    rounded: "{rounded.lg}"
    padding: 32px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    border: "1px solid rgba(19,19,19,0.12)"
    rounded: "{rounded.md}"
    padding: 14px 20px
    typography: "{typography.body-md}"
  nav:
    backgroundColor: "rgba(250,250,250,0.8)"
    textColor: "{colors.on-surface}"
    padding: 24px 60px
---

## Overview

Loomi's visual identity is built on a single conviction — here inverted for daylight: **light is the default**. The system keeps the same almost brutalist typographic restraint and the same vibrant, gradient-driven accent palette — purple, pink, and lilac — that surfaces only where meaning demands it. What changes is the ground: instead of layering darkness, we layer light.

The brand tagline, *Sem parar* ("non-stop"), still drives the motion philosophy: transitions are swift and purposeful, never decorative. Layouts breathe through generous negative space; colour earns its place by conveying state or hierarchy, not decoration.

This is the **light-first** counterpart to the canonical dark identity. Both share one token contract — type, spacing, shape, and accent hues are identical. Only the grounds, text colours, and elevation logic differ. The identity is version-stamped (currently **V.2.0**) and expects to evolve.

## Colors

The palette is divided into two registers: **grounds** (backgrounds and surfaces) and **signals** (brand accents). In light-first, grounds run from light to lighter, and elevated surfaces are the *brightest* layer.

- **Primary (#7B3FFF) — Purple:** The dominant brand hue. Used for interactive states, highlights, links, and the first stop of gradient fills. Reads with strong contrast on light grounds.
- **Secondary (#FF2D87) — Pink:** The contrast accent. Paired with purple in gradients; used standalone for emphasis on light surfaces.
- **Tertiary (#8B3FE0) — Lilac (text-safe):** A darker derivative of the brand lilac, used wherever lilac must carry text or fine detail on a light ground. The original soft lilac (`#C47EFF`, exposed as `tertiary-soft`) is reserved for gradient tails and decorative fills where contrast is not required.
- **Background (#F4F4F5) — Canvas:** The page/canvas base beneath cards and navbars. A faint cool grey so that white surfaces read as elevated against it.
- **Page (#FAFAFA):** The standard content ground — one step brighter than the canvas.
- **Surface (#FFFFFF):** Elevated surface for cards and modal backgrounds. Pure white is the *highest* layer; elevation reads as "more light," not "more shadow."
- **Neutral (#131313):** The text and high-contrast fill colour — the brand's warm near-black. Used for primary body text, the primary button fill, and the logo on light. Secondary text is `rgba(19,19,19,0.6)`.
- **White (#FFFFFF):** Reserved for labels on dark/saturated fills (primary CTA, purple/pink buttons) and the logo on dark or brand-coloured backgrounds.
- **Luxus:** A special logo variant colour used exclusively in brand contexts. Not used for UI chrome or interactive elements.

Gradients are always directional (135° default) and move from Primary → Secondary or Primary → Tertiary-soft. Never Secondary → Tertiary alone.

## Typography

**Sora** is the sole typeface, used at every scale from 130px display to 11px captions. Its geometric construction reads as precise and modern; its ExtraLight and Light weights give the brand its characteristic airy quality.

- **Display / Hero:** ExtraLight (200), −0.04em tracking, 0.9 line-height. A typographic statement, not a heading.
- **H1–H2:** ExtraLight to Light (200–300), negative tracking. Headlines are large and quiet, never bold.
- **H3:** Light (300), moderate size. Section titles within content.
- **Body:** Light (300) at 1rem. Never Regular or above in prose.
- **Label Caps:** Regular (400), 0.3em tracking, all-uppercase. Navigation links, button labels, badges, and data labels. This is the signature voice of the UI — spaced, uppercase, unhurried.
- **Caption:** Light (300), 0.15em tracking, uppercase. Version stamps, metadata, timestamps.

**Light-mode legibility note:** dark text on a light ground reads heavier than light text on dark. To preserve legibility, the smallest text styles step up one weight versus the dark identity — `body-sm`, `label-caps`, and `caption` move from ExtraLight/Light to Light/Regular. Display and headline styles keep their ExtraLight (200) airiness; at large sizes the thin strokes hold up on light grounds.

**Rule:** Bold (600+) weights are available in Sora but are not part of this identity. If emphasis is needed, use colour or scale — never weight beyond the steps above.

## Layout

The grid is a 12-column layout with 60px horizontal gutters at desktop. No fixed max-width container — content can bleed to the viewport edge when the design calls for it (hero sections, full-bleed images).

Spacing follows an 8px base unit. The scale (`xs: 4px → 3xl: 100px`) is the only permissible set of values for padding, gap, and margin. Do not interpolate.

Section rhythm: `padding: 100px 60px` vertically. Section breaks are marked by a 1px `rgba(19,19,19,0.08)` border-top — never a heavier divider or drop shadow.

Navigation is always fixed, full-width, with `backdrop-filter: blur(20px)` and `background: rgba(250,250,250,0.8)`. Nav labels use `label-caps` style.

## Elevation & Depth

Loomi does not use box shadows — in light mode either. Depth is expressed through:

1. **Background layering (inverted):** `#F4F4F5` (canvas) → `#FAFAFA` (page) → `#FFFFFF` (card). The brightest layer is the most elevated. Hover state lightens further or warms via a subtle brand tint at low opacity.
2. **Radial gradient glows:** Soft ellipses of primary or secondary colour at 6–10% opacity (lower than dark mode — light grounds need less), positioned behind hero content. Decorative only; must not occlude text.
3. **Borders:** `1px solid rgba(19,19,19,0.08)` separates surfaces. On hover, border-color transitions to `rgba(19,19,19,0.25)` or a brand accent at 40% opacity.
4. **Noise texture:** A subtle `feTurbulence` SVG filter at ~3% opacity overlaid fixed on the page adds tactility without introducing colour. Keep it lighter than the dark identity to avoid muddying white surfaces.

## Shapes

- **Interactive elements (buttons, badges, inputs):** Pill (`border-radius: 100px`) for buttons and badges. Moderate radius (`8px`) for inputs and smaller controls.
- **Cards and surfaces:** `12px` radius. Never sharp corners on floating surfaces.
- **Dividers and borders:** Always 1px, never rounded.
- **Logo mark (○):** The Loomi logomark uses a perfect circle glyph alongside the wordmark, rendered at the same optical weight as the logotype letters.

## Components

### Logo

The Loomi logo exists in two forms: **Standard** (wordmark + mark) and **Icon** (mark only). Six official colour variants — on light grounds the default is the dark logo on white:

| Variant | Background | Logo Colour |
|:--------|:-----------|:------------|
| White | `#FFFFFF` | `#131313` |
| Black | `#131313` | White |
| Purple | `#7B3FFF` | White |
| Pink | `#FF2D87` | White |
| Lilac | `#C47EFF` | White |
| Luxus | Luxus colour | Dark |

The logo is never placed on a gradient background. Minimum clear space is equal to the height of the "O" glyph on all sides.

### Buttons

Four variants: **Primary** (near-black `#131313` fill, white label — the highest-contrast action on a light ground), **Purple**, **Pink**, **Outline** (transparent, `rgba(19,19,19,0.2)` border, dark label). All use the pill radius and `label-caps` typography. Hover states shift background by ~10% lightness and lift 1px via `transform: translateY(-1px)`. No `box-shadow`.

### Badges

Inline labels using a translucent fill (10% opacity of the accent — slightly lower than dark mode so the tint stays clean on white) with a matching accent border at 30% opacity. Text is the solid accent colour. Used for status, tags, and category labels.

### Inputs

White (`{colors.surface}`) background, `1px solid rgba(19,19,19,0.12)` border. On focus, border transitions to `{colors.primary}`. Placeholder text at `rgba(19,19,19,0.35)`. Label above in `label-caps` style.

### Cards

`{colors.surface}` (pure white) background, `{rounded.lg}` radius, `1px solid rgba(19,19,19,0.08)` border against the cooler canvas. On hover: border transitions to `rgba(123,63,255,0.4)`, card lifts `2px` via `transform: translateY(-2px)`. No shadow.

## Do's and Don'ts

**Do:**
- Use ExtraLight and Light Sora for display and headlines; step small text up to Light/Regular for legibility on light grounds.
- Use `label-caps` (uppercase, tracked) for all interactive labels and navigation.
- Express depth through background layering (brightest = most elevated), not shadows.
- Keep gradients to Primary→Secondary or Primary→Tertiary-soft at 135°.
- Use 1px `rgba(19,19,19,0.08)` borders as the only surface separator.
- Honour the 8px spacing scale — every gap and padding maps to the token table.
- Use the text-safe lilac (`#8B3FE0`) whenever lilac carries text or fine detail.

**Don't:**
- Use Sora SemiBold or Bold in any UI element.
- Place the logo on a gradient background.
- Use box-shadows anywhere in the interface.
- Interpolate spacing values outside the defined scale.
- Use the Luxus colour for UI chrome, buttons, or data visualisation — it is a logo variant only.
- Use the Secondary (pink) colour as a standalone background fill for large surfaces.
- Use soft lilac (`#C47EFF`) for body text or labels on white — it lacks contrast; use it only for gradient tails and decorative fills.
