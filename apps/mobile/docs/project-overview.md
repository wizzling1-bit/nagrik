# Nagrik — Project Overview

**Document status:** UI/UX foundation  
**Project:** Nagrik  
**Platform:** Flutter mobile application  
**Current delivery scope:** Complete production-grade mobile UI/UX only; no live backend, API, authentication server, database, CMS, or external data integrations in this phase.

---

## 1. Product vision

Nagrik is a hyperlocal Indian information and community application designed to help people quickly understand **what is happening around them**.

The product combines:

- short-form local video
- breaking/local news
- civic issue reporting
- local events
- jobs and public opportunities
- weather and utility updates
- government/public information
- community interaction
- personalized geographic feeds

The interface must make the product feel **trustworthy, fast, local, calm, and premium**.

The product should not visually resemble a generic social-media clone. Its identity should be closer to a premium information utility with a social/video layer.

### Core product promise

> **Know what matters around you. Act when it matters.**

---

## 2. Current implementation boundary

This phase is intentionally UI-only.

### Included

- complete Flutter navigation shell
- light mode
- premium dark mode
- all primary screens
- realistic local mock content
- loading states
- skeleton states
- empty states
- error states
- success states
- upload UI
- reporting UI
- comments UI
- search UI
- location selection UI
- language selection UI
- notifications UI
- profile UI
- settings UI
- accessibility states
- responsive phone/tablet layouts
- reusable components
- design tokens
- mock repositories/interfaces so backend can be connected later

### Not included yet

- production API calls
- real authentication
- real OTP delivery
- production database
- real video upload
- cloud video transcoding
- real push notifications
- real moderation service
- real maps/geocoding
- real analytics pipeline
- payment/advertising infrastructure

The UI must nevertheless be structured so these can be connected without redesigning the application architecture.

---

## 3. Product principles

### 3.1 Local first

The user's selected/current area is the primary context.

### 3.2 Information before decoration

The UI must communicate:

1. what happened
2. where
3. when
4. why it matters
5. what the user can do

before decorative elements.

### 3.3 Trust by design

Sensitive content must expose source, verification, time, and location context where available.

### 3.4 Fast scanning

Users should understand a card/feed item within one second.

### 3.5 Progressive disclosure

Show the minimum required information first; reveal secondary information on demand.

### 3.6 Thumb-first interaction

Primary actions must be comfortably reachable with one hand.

### 3.7 Accessibility is a baseline

Do not use color alone to communicate meaning. Touch targets, contrast, semantics, font scaling and reduced motion must be respected.

---

## 4. Target users

### Primary

- residents wanting local updates
- students looking for local opportunities
- working adults following city developments
- families tracking civic/weather/utility information
- local creators
- local businesses
- community reporters

### Secondary

- journalists
- public institutions
- government information teams
- event organizers
- advertisers/local businesses

---

## 5. Initial information architecture

```text
Nagrik
├── Home
│   ├── For You
│   ├── Latest
│   ├── Nearby
│   └── Following
├── Discover
│   ├── Categories
│   ├── Trending
│   ├── Local Events
│   ├── Jobs
│   ├── Government
│   └── Services
├── Report
│   ├── Civic Issue
│   ├── News/Incident
│   └── Other
├── Notifications
└── Profile
    ├── My Posts
    ├── Saved
    ├── Following
    ├── Settings
    ├── Language
    ├── Location
    └── Privacy & Safety
```

---

## 6. Bottom navigation

Recommended five-item navigation:

| Position | Item | Purpose |
|---|---|---|
| 1 | Home | Personalized local feed |
| 2 | Discover | Search/categories/trending |
| 3 | Report | Primary creation/reporting action |
| 4 | Notifications | Alerts and activity |
| 5 | Profile | Identity, saved items, settings |

The central Report action may be visually emphasized, but it must remain consistent with platform accessibility conventions.

---

## 7. Geographic model

The UI must support:

```text
India
└── State
    └── District
        └── City/Town
            └── Locality/Ward/Village
```

A user may have:

- current location
- primary area
- additional followed areas

Do not design the product around a single permanently locked district.

---

## 8. Content types

The UI should accommodate these content types without requiring separate visual systems:

- breaking news
- local news
- civic issue
- event
- job
- government update
- weather alert
- utility update
- sports update
- creator video
- sponsored content

A content card should communicate its type through a small label/icon and typography, not through an entirely different component.

---

## 9. Visual identity

The supplied palette is:

| Token | Hex | RGB | Role |
|---|---|---|---|
| Navy 900 | `#0A2647` | 10, 38, 71 | deepest brand/dark surface |
| Navy 700 | `#144272` | 20, 66, 114 | primary dark accent |
| Blue 600 | `#205295` | 32, 82, 149 | primary interactive accent |
| Blue 500 | `#2C74B3` | 44, 116, 179 | lighter accent/links |

These colors should be supplemented with neutral semantic colors rather than introducing random additional brand colors.

---

## 10. Quality bar

The target is:

> A polished commercial product created by a senior mobile product team.

The implementation must avoid:

- template-like cards everywhere
- excessive rounded containers
- gratuitous gradients
- decorative blur
- oversized headings
- inconsistent iconography
- inconsistent spacing
- excessive animation
- inaccessible low-contrast text
- UI that looks like a generic news clone

---

## 11. Definition of done for UI phase

The UI phase is complete when:

- every planned screen exists
- every primary interaction has a visible state
- light/dark themes are complete
- no screen relies on hard-coded visual styling outside tokens/components
- phone and tablet layouts are handled
- text scaling does not break key flows
- mock data can be replaced by repositories later
- video cards have realistic playback placeholders/states
- forms have validation/error/success states
- loading/empty/error states are designed
- navigation is deterministic
- accessibility semantics exist for important controls
- animations are subtle and performant
- the codebase is ready for backend integration
