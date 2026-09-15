# Nagrik — Product Requirements Document

## 1. Executive summary

Nagrik is a hyperlocal information and short-video platform for Indian users. The first release focuses on a premium, fast, location-aware experience where users can consume local information, discover opportunities/events, interact with community content, and report local issues.

This PRD defines the **UI product contract** for the first client-facing build.

---

# 2. Goals

## Primary goals

1. Let a user discover relevant local information immediately.
2. Make short-video consumption fluid and distraction-free.
3. Make geographic context obvious.
4. Provide a trustworthy visual hierarchy for breaking information.
5. Allow users to report local issues with minimal friction.
6. Support multilingual UI architecture.
7. Provide a premium dark/light experience.
8. Prepare every feature for later backend integration.

## Secondary goals

- create a foundation for local creator participation
- support local jobs/events/public information
- support future personalization
- support future monetization without damaging the feed

---

# 3. Non-goals for this phase

The following are deliberately excluded from the UI delivery's live behavior:

- real-time backend synchronization
- actual video upload to cloud
- real moderation
- live chat infrastructure
- live streaming
- payment processing
- ad-serving logic
- recommendation ML
- production location tracking
- actual government integrations

Their UI contracts should still be represented where useful.

---

# 4. Personas

## Persona A — Local resident

Needs quick information about traffic, weather, accidents, events, electricity, water and nearby happenings.

## Persona B — Local creator

Needs to record/upload a short video, add context/location/category, publish, and see basic performance later.

## Persona C — Civic reporter

Needs to report a road, garbage, water, electricity or public-safety problem with evidence.

## Persona D — Opportunity seeker

Needs local jobs, events, government notices and useful opportunities.

---

# 5. Core product metrics

When backend analytics is added, track:

### Activation

- onboarding completion
- location selection completion
- first feed interaction
- first video watched

### Engagement

- session duration
- videos started
- completion rate
- shares
- saves
- comments
- follows

### Local relevance

- content from primary area viewed
- content from nearby areas viewed
- location changes
- “not relevant” feedback

### Reporting

- reports started
- reports completed
- report abandonment by step

### Retention

- D1
- D7
- D30

---

# 6. Feature requirements

## F-01 — App launch

On launch:

1. show branded splash briefly
2. restore theme
3. restore selected language
4. restore location context
5. route to onboarding/home depending on local state

Avoid a long blocking splash.

---

## F-02 — Language selection

### Requirements

- searchable language list
- native language names
- English fallback
- selected-state indicator
- continue CTA
- ability to change later from settings

Initial UI architecture should support:

- Hindi
- Bengali
- Gujarati
- Marathi
- Tamil
- Telugu
- Kannada
- Malayalam
- Odia
- Assamese
- Punjabi
- English

The list must be data-driven.

---

## F-03 — Location onboarding

### Requirements

Offer:

- use current location
- search manually
- browse state
- browse district
- browse city/locality
- skip temporarily

The UI must never imply that location permission is mandatory merely to explore the product.

### Confirmation

After selecting:

```text
Your area
Kolkata, West Bengal
```

Allow:

- confirm
- change

---

## F-04 — Home feed

### Header

Show:

- current area
- notification affordance
- optional search affordance

### Feed tabs

Recommended:

- For You
- Latest
- Nearby
- Following

### Feed content

Support:

- short video
- image/news card
- civic update
- event card
- job card
- alert card

### Actions

- like
- comment
- share
- save
- report
- follow creator

---

## F-05 — Short video experience

The player must:

- autoplay when visible
- pause when off-screen
- support mute/unmute
- show progress
- support tap to pause/play
- support swipe to next
- support retry
- show poster/thumbnail
- show loading indicator
- expose captions when available

Avoid overlaying too many controls.

---

## F-06 — Discover

Sections:

- search
- trending locally
- categories
- local events
- jobs
- government
- services
- popular creators

Search UI must support:

- recent searches
- suggested queries
- empty state
- no-result state
- loading state

---

## F-07 — Report

Primary categories:

- Road
- Water
- Electricity
- Garbage
- Traffic
- Streetlight
- Drainage
- Public safety
- Other

Flow:

```text
Choose issue
→ Add photo/video
→ Confirm location
→ Add description
→ Review
→ Submit
→ Success
```

The flow should be possible one-handed.

---

## F-08 — Create/upload

Creator flow:

```text
Create
→ Camera/Gallery
→ Preview
→ Trim
→ Caption
→ Category
→ Location
→ Audience/context
→ Publish
```

If actual camera/upload is unavailable in UI-only mode, provide a realistic mock preview.

---

## F-09 — Notifications

Notification groups:

- Breaking
- Nearby
- Following
- Activity
- System

Each item should show:

- source
- short title
- relative time
- unread state

Allow:

- mark all read
- notification settings

---

## F-10 — Profile

Profile includes:

- avatar
- name
- location
- verification state
- posts
- saved
- followers/following

Creator profile additionally exposes:

- total posts
- basic stats placeholders
- categories
- verification information

---

## F-11 — Saved

Users can save:

- videos
- news
- jobs
- events
- government information

Saved content should be filterable by type later.

---

## F-12 — Settings

Sections:

### Account

- profile
- language
- location

### Notifications

- breaking alerts
- nearby updates
- followed creators
- jobs
- events

### Appearance

- system
- light
- dark

### Accessibility

- text size guidance
- reduced motion
- high-contrast support where available

### Privacy & safety

- permissions
- blocked users
- reporting
- data controls

### About

- terms
- privacy
- community guidelines
- app version

---

# 7. Content card requirements

Every local content item should be able to expose:

- title
- media
- category
- locality
- district/city
- time
- source/creator
- verification status
- engagement actions

Optional:

- distance
- sponsored label
- live label
- update status

---

# 8. Trust requirements

Sensitive content must support:

- source label
- verification label
- publication/update time
- location context
- report action

Do not visually present unverified user claims as official facts.

---

# 9. Accessibility requirements

Minimum:

- touch targets approximately 44–48 logical pixels
- semantic labels for icon buttons
- scalable typography
- meaningful focus order
- sufficient contrast
- no color-only status
- reduced-motion pathway
- readable text over media
- captions where video supports them

---

# 10. Performance requirements

UI target:

- smooth scrolling
- minimal rebuilds
- lazy lists
- image caching
- video preloading only for nearby items
- no unnecessary blur/filter layers
- no large synchronous JSON parsing on UI thread
- avoid expensive layout calculations in scrolling widgets

---

# 11. Responsive requirements

### Phone

Primary design target:

- 360–430 dp width

### Large phone

- 430–600 dp

### Tablet

- 600 dp+

On tablets:

- use constrained content width
- consider two-column discovery/profile layouts
- retain bottom navigation only when ergonomically appropriate
- avoid simply stretching phone cards to full width

---

# 12. Release acceptance criteria

A screen is accepted only when:

- it works in light/dark
- it has loading/empty/error/success states where relevant
- text does not clip at larger font sizes
- interactive controls are accessible
- navigation back behavior is predictable
- content hierarchy is clear
- it uses design-system tokens
- it has no unexplained one-off colors or spacing
