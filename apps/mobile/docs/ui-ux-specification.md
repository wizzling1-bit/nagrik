# Nagrik — UI/UX Specification

## 1. Design direction

Nagrik should feel:

- premium
- trustworthy
- modern
- local
- editorial
- calm
- fast

The interface should not feel:

- noisy
- gamified
- childish
- overly corporate
- overly glassy
- like a generic social template

---

# 2. Design principles

## Hierarchy

Use typography, spacing and surface contrast before color.

## Density

Default information density should be moderate. Give important content room to breathe.

## Consistency

Same action = same component everywhere.

## Context

Location and content type should always be understandable.

---

# 3. Navigation UX

Bottom navigation should be persistent on primary screens.

Use full-screen transitions for:

- onboarding
- media creation
- settings subflows

Use bottom sheets for:

- filters
- location switching
- sharing
- quick actions

Use dialogs only for:

- destructive confirmation
- critical permission explanations
- short blocking decisions

---

# 4. Home UX

The first viewport should communicate:

1. current area
2. current feed
3. primary content
4. important alerts

Avoid filling the first screen with ten categories.

---

# 5. Video UX

### Default

- edge-to-edge media
- restrained overlay
- readable text
- safe-area awareness

### Controls

Show persistent essential context:

- source/creator
- headline
- locality/time

Secondary actions can remain icon-based with accessible labels.

---

# 6. Card UX

Use cards only when they create meaningful grouping.

Do not wrap every row in a rounded rectangle.

Preferred:

- list separators
- flat surfaces
- subtle containers
- occasional elevated hero cards

---

# 7. Typography

Recommended type family:

### Primary

**Inter** for Latin UI if licensing/project constraints permit.

For Indian scripts, use a font family with reliable script coverage such as **Noto Sans** variants.

The final Flutter implementation should verify actual glyph coverage for every supported language.

### Scale

| Token | Size | Weight | Use |
|---|---:|---:|---|
| Display | 32 | 700 | major onboarding |
| H1 | 28 | 700 | major page |
| H2 | 24 | 700 | section |
| H3 | 20 | 650/700 | card/title |
| Body Large | 17 | 400/500 | primary body |
| Body | 15–16 | 400 | standard |
| Label | 13–14 | 500/600 | metadata |
| Caption | 12 | 400/500 | secondary metadata |

Avoid excessive use of all caps.

---

# 8. Spacing

Base spacing unit:

**4 dp**

Preferred scale:

```text
4
8
12
16
20
24
32
40
48
64
```

Most standard screen padding:

**16–20 dp**

Large section spacing:

**24–32 dp**

---

# 9. Corner radius

Use a restrained radius system:

```text
4  → compact controls
8  → standard controls
12 → cards
16 → sheets/large surfaces
20 → hero/media containers when appropriate
```

Avoid making every element 24–32 px rounded.

---

# 10. Iconography

Use one coherent icon family.

Recommended Flutter foundation:

- Material Symbols / Icons where appropriate

Use custom icons only for Nagrik-specific concepts.

Icon rules:

- same stroke/visual weight
- consistent optical size
- no mixed emoji/icon systems in primary navigation
- every icon-only button gets a semantic label

---

# 11. Imagery

Use real-looking local imagery in mock content.

Avoid:

- generic corporate stock photos
- overly saturated thumbnails
- fake AI-looking news scenes

Video thumbnails should have enough contrast for overlaid labels.

---

# 12. Motion

## Principles

Motion communicates:

- state change
- spatial relationship
- confirmation
- continuity

### Recommended durations

| Motion | Duration |
|---|---:|
| Press feedback | 80–120 ms |
| Small fade | 150–220 ms |
| Standard transition | 250–350 ms |
| Spring interaction | approximately 300–500 ms |
| Sheet | approximately 300–450 ms |

Use curves that feel natural rather than linear wherever possible.

---

# 13. Reduced motion

If reduced motion is requested:

- remove decorative movement
- shorten transitions
- avoid large-scale transforms
- retain necessary state changes through opacity/instant transitions

---

# 14. Light mode

Light mode should use:

- warm/neutral white surfaces
- navy text
- subtle blue accent
- soft borders
- restrained shadows

Do not make every surface pure white against another pure white.

Recommended hierarchy:

```text
Background
Surface
Elevated surface
Interactive surface
Overlay
```

---

# 15. Dark mode

Dark mode should not be “black background + blue buttons.”

Use the supplied navy family.

Recommended semantic base:

```text
Dark background → #071A30 / near-Navy
Dark surface    → #0A2647
Dark elevated   → #102F50
Primary         → #2C74B3
Interactive     → #4B92CF or a validated accessible tint
Text primary    → near-white
Text secondary  → cool neutral
```

All final combinations must be contrast-tested.

---

# 16. Color usage

Brand colors:

```text
#0A2647
#144272
#205295
#2C74B3
```

Semantic colors should be separately tokenized:

- success
- warning
- error
- info
- neutral

Do not repurpose blue as an error/success signal.

---

# 17. Accessibility

### Touch

Target approximately 44–48 dp minimum.

### Contrast

Normal text should target WCAG AA contrast.

### Text scaling

Design for larger system font sizes.

### Screen readers

Important controls need:

- label
- role
- state
- action

Example:

> Save video, not saved

rather than:

> bookmark icon

---

# 18. Forms

Form fields:

- clear label
- optional supporting text
- error message below field
- visible focus state
- disabled state
- loading state

Do not rely on placeholder text as the only label.

---

# 19. Bottom sheets

Use for contextual choices.

Structure:

```text
Handle
Title
Optional description
Content
Primary action if required
```

Don't make a bottom sheet taller than necessary.

---

# 20. Toast/snackbar policy

Use snackbar for:

- saved
- copied
- undone

Use dedicated screen/state for:

- report submitted
- account deletion
- major failures

---

# 21. Accessibility-aware video overlays

Text over video must have sufficient separation from variable imagery.

Use:

- scrim
- solid/blurred local surface only when necessary
- shadow/outline cautiously

Avoid translucent white text directly over bright scenes.

---

# 22. Tablet UX

For widths >= 600 dp:

- constrain content
- use two-column layouts where useful
- avoid oversized media
- maintain readable line length
- consider navigation rail for future tablet optimization

---

# 23. UX anti-patterns explicitly prohibited

- infinite popups
- forced login before browsing
- permission request immediately on first frame without context
- red everywhere for breaking news
- excessive badges
- giant floating action buttons
- autoplay with sound
- hidden destructive actions
- inconsistent back behavior
- full-screen loading spinners for small updates
