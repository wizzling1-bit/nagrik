# Nagrik — Design System

## 1. Source of truth

All visual values must come from centralized design tokens.

Do not scatter:

```dart
Color(0xFF205295)
```

through feature widgets.

Instead:

```dart
context.colorScheme.primary
```

or a centralized Nagrik semantic token.

---

# 2. Brand palette

Supplied palette:

| Name | Hex |
|---|---|
| Nagrik Navy 900 | `#0A2647` |
| Nagrik Navy 700 | `#144272` |
| Nagrik Blue 600 | `#205295` |
| Nagrik Blue 500 | `#2C74B3` |

---

# 3. Semantic color architecture

Do not make components depend directly on raw palette values.

Recommended semantic tokens:

```text
brandPrimary
brandSecondary

background
surface
surfaceElevated
surfaceMuted
surfaceInteractive

textPrimary
textSecondary
textTertiary
textOnPrimary

border
divider

success
warning
error
info

overlay
scrim
```

---

# 4. Light semantic mapping

Illustrative starting point; contrast-test during implementation.

```text
background      #F7F9FC
surface         #FFFFFF
surfaceElevated #FFFFFF
surfaceMuted    #EFF3F8

textPrimary     #0A2647
textSecondary   #44546A
textTertiary    #66758A

brandPrimary    #205295
brandSecondary  #2C74B3

border          #DCE3EB
divider         #E8EDF3
```

Semantic status colors should be selected and tested independently.

---

# 5. Dark semantic mapping

```text
background      #06182C
surface         #0A2647
surfaceElevated #102F50
surfaceMuted    #12375C

textPrimary     #F6F8FB
textSecondary   #C2CEDB
textTertiary    #95A7BA

brandPrimary    #2C74B3
brandSecondary  #4B92CF

border          #234766
divider         #1A3A59
```

The final interactive blue must be contrast-validated against every dark surface.

---

# 6. Typography tokens

```text
displayLarge
headlineLarge
headlineMedium
titleLarge
titleMedium
bodyLarge
bodyMedium
bodySmall
labelLarge
labelMedium
labelSmall
```

Use Flutter `TextTheme` as the public API.

---

# 7. Font strategy

Recommended:

```text
Latin UI → Inter
Indian scripts → Noto Sans family / verified regional variants
```

If the project chooses a single bundled family, verify:

- Devanagari
- Bengali
- Gujarati
- Gurmukhi
- Odia
- Tamil
- Telugu
- Kannada
- Malayalam
- Assamese

Font fallback must be explicit enough to avoid tofu/missing-glyph states.

---

# 8. Spacing tokens

```text
space1  = 4
space2  = 8
space3  = 12
space4  = 16
space5  = 20
space6  = 24
space7  = 32
space8  = 40
space9  = 48
space10 = 64
```

---

# 9. Radius tokens

```text
radiusXs = 4
radiusSm = 8
radiusMd = 12
radiusLg = 16
radiusXl = 20
```

Use the smallest radius that provides the intended grouping.

---

# 10. Elevation

Keep elevation subtle.

Recommended conceptual levels:

```text
0 → flat
1 → slight separation
2 → card/sheet
3 → dialog/navigation overlay
```

Avoid dramatic shadows.

---

# 11. Borders

Default:

- 1 logical pixel
- low-contrast neutral
- used for separation rather than decoration

---

# 12. Component inventory

## Buttons

- Primary
- Secondary
- Tertiary/text
- Destructive
- Icon button

States:

```text
default
pressed
hover/focus where relevant
disabled
loading
selected
```

---

## Chips

- category
- location
- status
- filter
- verification

Avoid using chips for ordinary body information.

---

## Cards

- video
- news
- event
- job
- civic issue
- profile/creator

---

## Navigation

- bottom navigation
- top app bar
- navigation rail future
- tab bar

---

## Inputs

- search
- text field
- multiline description
- dropdown/select
- location selector

---

## Feedback

- snackbar
- dialog
- bottom sheet
- inline error
- skeleton
- empty state
- success state

---

# 13. Button specification

### Primary

Use brand blue.

Text must be concise.

Example:

> Publish

Not:

> Click Here to Publish Your Video

### Secondary

Outlined or low-emphasis filled surface.

### Destructive

Semantic error color, never brand blue.

---

# 14. Icon button

Minimum conceptual hit box:

**44–48 dp**

Visual icon:

**20–24 dp**

The hit area may be larger than the visible icon.

---

# 15. App bars

Default:

- 56 dp Material-compatible height
- title aligned consistently
- one clear primary action
- no more than 2–3 trailing actions

---

# 16. Bottom navigation

Five destinations maximum.

Labels should remain visible.

Do not use only icons.

---

# 17. Video action rail

Vertical action rail:

- 44–48 dp hit targets
- icon
- count when meaningful

Keep enough spacing to prevent accidental activation.

---

# 18. Avatar

Tokens:

```text
xs = 24
sm = 32
md = 40
lg = 56
xl = 80
```

Use circular avatars consistently.

---

# 19. Badges

Verification:

- checkmark + text where ambiguity exists

Breaking:

- semantic alert label

Sponsored:

- explicit `Sponsored`

Never rely on color alone.

---

# 20. Component architecture

Recommended folders:

```text
lib/
  core/
    theme/
      app_theme.dart
      color_tokens.dart
      spacing.dart
      typography.dart
      radii.dart
    widgets/
  features/
    onboarding/
    home/
    discover/
    report/
    notifications/
    profile/
    settings/
```

Shared components belong in `core/widgets` only when truly cross-feature.

---

# 21. Theme architecture

Use:

- `ThemeData`
- `ColorScheme`
- `TextTheme`
- component themes
- custom `ThemeExtension` for Nagrik-specific tokens

Do not create separate unrelated theme classes per screen.

---

# 22. Dark-mode rule

Every component must be reviewed in both themes.

Never implement light mode first and “fix dark colors later.”

---

# 23. Elevation/shadow rule

Prefer:

1. contrast
2. border
3. spacing
4. shadow

in that order.

---

# 24. Motion tokens

```text
durationFast
durationStandard
durationSlow

curveStandard
curveEmphasized
springGentle
springSnappy
```

Motion should be centralized.

---

# 25. Design QA checklist

For every component:

- [ ] light
- [ ] dark
- [ ] disabled
- [ ] pressed
- [ ] focus
- [ ] loading
- [ ] error where applicable
- [ ] long text
- [ ] large font
- [ ] screen reader label
- [ ] 44–48 dp touch target
