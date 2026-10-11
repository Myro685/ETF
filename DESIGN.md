---
name: Clientelo
description: Clear comparisons on a light green-white canvas.
colors:
  background: "#fcfdfb"
  surface: "#eef3ee"
  ink: "#202e27"
  muted: "#52635a"
  accent: "#285a43"
  line: "#d2ddd4"
  on-accent: "#ffffff"
  control-border: "#84988b"
  accent-hover: "#204c37"
  preset-hover: "#dde8df"
  error: "#9b332b"
typography:
  display:
    fontFamily: '"Manrope Variable", sans-serif'
    fontSize: "clamp(40px, 4.3vw, 62px)"
    fontWeight: 550
    lineHeight: 1.14
    letterSpacing: "-.035em"
  headline:
    fontFamily: '"Manrope Variable", sans-serif'
    fontSize: "clamp(28px, 3vw, 38px)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-.025em"
  title:
    fontFamily: '"Manrope Variable", sans-serif'
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-.4px"
  body:
    fontFamily: '"Manrope Variable", sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: '"Manrope Variable", sans-serif'
    fontSize: "14px"
    fontWeight: 600
  wordmark:
    fontFamily: "Georgia, serif"
    fontSize: "32px"
    fontWeight: 400
    letterSpacing: "-.8px"
rounded:
  control: "8px"
  group: "16px"
spacing:
  compact: "8px"
  small: "12px"
  medium: "16px"
  inset: "20px"
  group: "24px"
  large: "32px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.control}"
    padding: "13px 20px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "8px 10px"
  preset-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.control}"
  input-email:
    backgroundColor: "{colors.background}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "14px 17px"
  surface-group:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.group}"
    padding: "32px"
---

# Design System: Clientelo

## Overview

**Creative North Star: "Porozumění před rozhodnutím"**

Clientelo uses a light green-white canvas, dark green text and quiet tonal groups to make comparisons easy to read. Content has one contemporary sans-serif voice; the preserved serif wordmark supplies the recognizable brand identity. The density is moderate, with open rows for related facts and rounded surfaces for related controls.

This is a source-derived record of the implemented redesign. The user authorized the redesign and its audience and offer; the individual visual tokens are implementation decisions, not separately approved colors. `src/components/Atlas.css`, loaded after the base and tool styles, is the current visual authority. The documentation was produced manually from source because the Impeccable engine could not initialize its cache; this pass did not sample browser computed styles or run the engine's validator.

**Key Characteristics:**

- One green accent for actions, selection and orientation.
- Locally hosted Manrope Variable content typography and a Georgia wordmark.
- Open comparison rows; tonal surfaces for functional groups.
- Small rounded controls and larger rounded groups.
- Brief press feedback with visible keyboard focus and reduced-motion support.

## Colors

The palette combines near-white and pale green with restrained forest-green actions.

### Primary

- **Forest Green** (`accent`): primary actions, selected presets, headings' emphasized phrases, links and focus outlines.
- **Deep Forest** (`accent-hover`): primary action hover on devices with a fine pointer and hover capability.

### Neutral

- **Green White** (`background`): page canvas, fields and the flat digital cover.
- **Pale Green** (`surface`): calculator, contextual groups, study panel and selected quiz options.
- **Dark Green Ink** (`ink`): primary text and quantitative information.
- **Quiet Green** (`muted`): explanatory text, source notes and secondary labels.
- **Green Divider** (`line`): comparison rows and disclosure boundaries.
- **Control Green** (`control-border`): stronger field and secondary-control strokes.
- **White on Green** (`on-accent`): filled-action and selected-preset text.
- **Preset Wash** (`preset-hover`): unselected preset hover.
- **Error Red** (`error`): invalid email border and form error messages. This is a state signal rather than a second brand accent.

**The Action Green Rule.** Use the accent for actionable or orienting content; group backgrounds use the pale surface rather than a saturated fill.

## Typography

**Display Font:** Manrope Variable, with sans-serif fallback.
**Body Font:** Manrope Variable, with sans-serif fallback.
**Wordmark Font:** Georgia, with serif fallback.

**Character:** Clear, compact sans-serif headings and readable explanatory text; the serif is reserved for the preserved wordmark. Heading wrapping is balanced and paragraph wrapping is pretty where supported.

### Hierarchy

- **Display:** the frontmatter display role describes the desktop hero. At the tablet breakpoint it is (43px); on mobile it uses `clamp(30px, 8.2vw, 52px)` with line-height (1.16), then (29px) on the narrowest breakpoint.
- **Headline:** section headings use the headline role and become (28px) on mobile. Quiz and guide headings retain component-specific sizes from the existing cascade.
- **Title:** the base title role is for small headings. Lesson titles are (21px), becoming (19px) on mobile; contextual titles are (20px), becoming (19px).
- **Body:** the base is the frontmatter body role. Explanatory text commonly uses (14–16px), line-height (1.8); the hero lead has a maximum measure of (48ch).
- **Label:** form control labels use the label role. Navigation and supporting labels use (12–14px); compact source and figure metadata use (11–12px), and should remain metadata rather than substantive copy.
- **Numbers:** fee and cost values use tabular figures. Cost results use `clamp(22px, 2.1vw, 30px)` at desktop and reduce for narrow screens.

**The One Content Voice Rule.** Keep display and body content in Manrope Variable; reserve Georgia for the wordmark.

## Layout

The shared container caps at (1200px), with (48px) desktop gutters. Gutters become (28px) below (1024px), (20px) below (767px), and (16px) below (360px). Section spacing is (64px) vertically on desktop and (44px) on mobile; local tool and disclosure spacing is tighter.

Use the observed spacing steps for compact control gaps, field spacing, group insets and section separation. The implementation also uses optical gaps such as (22px), (26px) and (28px); it is not a strict eight-point grid.

Related controls and results can share an asymmetric two-column group, collapsing to one column below (767px). Comparisons preserve three aligned fund columns on mobile, placing each row label above its values. Long results allow wrapping rather than enlarging the viewport. Open explanatory rows adapt their ticker, heading and paragraph columns to a two-column mobile layout. Context groups collapse to a single column.

## Elevation & Depth

The current surfaces are flat. Depth comes from pale tonal backgrounds, spacing, divider lines and field strokes; the comparison and PDF cover have no shadow. The static WebGL study is an illustration with its own material and lighting, not a source of elevation rules for controls. A selected quiz option retains an inset one-pixel accent stroke to reinforce its state, not an ambient shadow.

**The Tonal Group Rule.** Define related content with the pale surface or a divider; do not add lifted shadows to ordinary groups.

## Shapes

Controls, fields, quiz options and small notices use gently rounded corners (`control`). Larger functional and visual groups use the broader `group` corner. Open comparison tables, source disclosures and page-level sections remain flat and unrounded. Fields and secondary controls use a one-pixel stroke; the invalid email field uses a two-pixel error stroke.

## Components

### Buttons

Confident filled actions and quiet outlined alternatives.

- **Primary:** accent fill, white text, control corner, minimum height (50px), weight (650) and the frontmatter padding. Mobile actions use (13px) text and (16px) horizontal padding. Form submit typography has its own existing (13px) override.
- **Secondary:** transparent fill, ink text, control border, control corner and minimum height (44px). An inline secondary link stays underlined rather than becoming another filled button.
- **Hover / Focus:** primary hover uses Deep Forest only within `(hover: hover) and (pointer: fine)`. Keyboard focus is a two-pixel accent outline with (4px) offset.
- **Entrance (2026-10-11):** one finite Three.js block extrusion when visible, 650ms per block with 50ms stagger; same ease-out as --cl-ease. Pause offscreen/hidden, never replay, instant final pose with reduced motion. See docs/motion.md.
- **Hover:** fine pointers only; 160ms ease for background/border, CTA arrow translates 3px with the existing ease-out. Focus-visible controls respond immediately.
- **Press:** when reduced motion is not requested, transform transitions take (140ms) with `cubic-bezier(.23, 1, .32, 1)`. Active controls scale to (.97); `:focus-visible` and disabled form buttons are excluded from the press transform. Reduced-motion mode removes transitions and animation.
- **Disabled:** the form submit has reduced opacity and the existing waiting cursor; it cannot submit during a pending request.

### Presets

Small outlined toggle buttons, rather than decorative chips. Unselected presets use the secondary treatment; `aria-pressed="true"` receives the accent fill and white text. Hover uses Preset Wash only for an unselected preset on a fine pointer. Presets wrap within their row.

### Cards / Containers

Groups are flat and purposeful. Use the surface tone and group corner for a calculator or explanatory notice. The calculator's desktop inset is (32px), falling to (26px) at tablet width and (24px 20px) on mobile. Availability notices use (22px 24px), then (20px) on mobile. Not every section belongs in a card.

### Inputs / Fields

Fields use the page background, ink text, a control border and control corner. Email input text is (16px), with a minimum height of (52px); amount fields use tabular figures at (30px). Focus uses the shared external outline. Invalid email uses Error Red plus a textual status. The read-only sending state uses the pale surface. Preserve labels and status associations rather than relying on color alone.

### Navigation

The preserved wordmark pairs with (13px), weight (550) section links. Links have a minimum height of (44px) and underline on hover; the guide action uses a pale surface and control corner. Below (767px), the guide action remains while the other header links are hidden. Native anchors and the skip link remain keyboard accessible.

### Disclosures and Quiz Options

Native disclosure rows use thin horizontal dividers, explicit text and SVG chevrons where implemented. A chevron reverses when open. Quiz options have control corners, an actual radio input, a line border and a pale selected surface with an accent inset stroke. Preserve native disclosure and radio semantics.

### Digital Cover

The PDF illustration is a flat, unrotated cover on a pale group: page-colored fill, control corners, no spine and no shadow. It stays decorative and is hidden on mobile. Its local cover metadata is not a reusable section-eyebrow pattern.

## Do's and Don'ts

### Do:

- **Do** use the recorded green roles consistently across controls, explanatory text and functional groups.
- **Do** keep Manrope Variable for content and Georgia for the preserved wordmark.
- **Do** keep comparison values aligned, use tabular figures and let long results wrap.
- **Do** preserve visible keyboard focus, native control semantics and reduced-motion behavior.
- **Do** use actual SVG icons and keep the PDF cover flat.

### Don't:

- **Don't** reintroduce the legacy blue palette, pill buttons or lifted group shadows from the superseded base stylesheet.
- **Don't** promote dormant eyebrow or glyph-icon CSS into reusable component rules.
- **Don't** use compact source or figure metadata sizes for substantive body copy.
- **Don't** hide content behind entrance animation or add perpetual decorative motion.

Source caveat: the base styles still carry superseded blue, pill, eyebrow and physical-book declarations; Atlas overrides or the current markup prevent those from defining the visible system. They are recorded as source drift, not endorsed tokens. Component-specific type exceptions remain descriptive rather than a mandate to add new scale steps. The synthetic tonal strips in the sidecar are preview metadata, not additional production colors.
