# Nagrik — Feature Specification

This document converts the PRD into implementable UI behavior and component contracts.

---

# 1. Global UI states

Every asynchronous feature should support:

```text
Initial
↓
Loading
↓
Success
```

or:

```text
Initial
↓
Loading
↓
Error
```

For lists:

```text
Loading
Content
Empty
Error
Refreshing
Paginating
```

---

# 2. Splash

### UI

- Nagrik wordmark
- restrained background
- no promotional content

### Motion

- subtle logo opacity/scale
- duration approximately 350–550 ms
- no perpetual animation

---

# 3. Onboarding

## Page 1 — Local information

Headline:

> Your city. Your updates.

Explain:

- local news
- events
- civic issues
- useful alerts

## Page 2 — Choose language

Scrollable language selector.

## Page 3 — Choose location

Current location or manual search.

## Page 4 — Notification preference

Explain what notifications are useful for and allow granular choices.

Do not force all notification categories.

---

# 4. Home

## Header

Components:

- location button
- optional greeting/context
- search
- notification badge

### Location button behavior

Tap → location switcher bottom sheet.

Sheet:

- current area
- saved areas
- add area
- manage areas

---

# 5. Feed modes

## For You

Personalized UI placeholder.

## Latest

Strict chronological visual presentation.

## Nearby

Emphasize proximity.

## Following

Only followed sources/creators when backend exists.

---

# 6. Feed item

## Video item

```text
┌─────────────────────────┐
│ Media                   │
│                         │
│              Like       │
│              Comment    │
│              Share      │
│              Save       │
│                         │
│ Creator ✓               │
│ Headline                │
│ Area · 12 min ago       │
│ Category                │
└─────────────────────────┘
```

### Gesture rules

- vertical swipe → next item
- tap media → play/pause
- double tap → like
- horizontal gestures must not conflict with vertical feed navigation

---

# 7. News card

For non-video content:

- 16:9 thumbnail
- category badge
- headline
- locality
- timestamp
- source

Avoid more than three lines of primary text.

---

# 8. Breaking alert

Use a semantic alert surface.

Must include:

- breaking label
- concise headline
- affected area
- timestamp

Do not rely on bright red as the only urgency indicator.

---

# 9. Category explorer

Grid/list categories:

- Local News
- Crime
- Traffic
- Weather
- Jobs
- Events
- Government
- Electricity
- Water
- Agriculture
- Sports
- Education
- Health

Use consistent icon container size.

---

# 10. Search

## Search screen

Top:

- search field
- clear button

Below:

- recent searches
- trending locally
- suggested categories

## Results

Tabs:

- All
- Videos
- News
- Events
- Jobs
- Creators

---

# 11. Report issue

## Step 1

Issue category selection.

Use large, thumb-friendly options.

## Step 2

Evidence

- camera
- gallery
- remove attachment
- preview

## Step 3

Location

Show selected location summary.

## Step 4

Description

- multiline field
- character guidance
- optional details

## Step 5

Review

Display exactly what will be submitted.

## Step 6

Success

Show:

- success icon
- reference placeholder
- submitted location
- next action: view report / return home

---

# 12. Create post

### Camera/gallery

UI states:

- permission
- picker
- selected
- preview
- upload placeholder

### Editing

- trim
- cover selection
- mute
- caption

### Metadata

- category
- location
- language

### Publish

Primary CTA should communicate finality:

> Publish

Do not hide publishing behind ambiguous iconography.

---

# 13. Comments

Comments screen/bottom sheet:

- composer
- list
- reply
- like
- report
- delete own comment

Empty state:

> Be the first to share a useful perspective.

Avoid hostile social-media visual patterns.

---

# 14. Creator profile

Header:

- avatar
- display name
- verification
- location
- bio

Stats:

- posts
- followers
- following

Tabs:

- Videos
- Posts

Follow CTA must have clear selected/unselected states.

---

# 15. Notifications

Group sections:

```text
Today
Earlier
```

Types:

- breaking
- nearby
- creator
- report status
- system

Unread item:

- subtle surface treatment
- not excessive color

---

# 16. Report status

Future-ready UI:

```text
Submitted
   ↓
Under review
   ↓
Forwarded
   ↓
In progress
   ↓
Resolved
```

A status chip must always include text, not just color.

---

# 17. Profile

Sections:

- profile header
- activity
- saved
- following
- settings

Guest state:

- encourage account creation only when a user attempts a stateful action
- do not block normal browsing

---

# 18. Settings

Use grouped list sections.

Each row:

- icon
- title
- optional description
- current value
- chevron/toggle

Avoid nested navigation deeper than necessary.

---

# 19. Permission UI

For camera/location/notifications:

Never show a custom permission explanation after the system dialog has already appeared.

Use a pre-permission education screen only when needed:

```text
Why Nagrik needs this
```

Then invoke the platform permission.

---

# 20. Error patterns

### Network error

```text
Couldn't load updates
Check your connection and try again.
[Try again]
```

### Upload failure

Preserve local draft where technically possible.

```text
Upload couldn't finish
[Retry] [Save draft]
```

### Location failure

```text
We couldn't determine your area.
[Try again] [Choose manually]
```

---

# 21. Empty states

Empty states should answer:

1. what is empty
2. why it may be empty
3. what to do next

Example:

> No saved updates yet.  
> Save useful local stories to find them here later.

---

# 22. Skeleton loading

Use content-shaped skeletons.

Do not animate every individual shape independently. Prefer a restrained shared shimmer or opacity transition.

---

# 23. Optimistic UI

Suitable for:

- like
- save
- follow
- mark notification read

Not suitable for:

- publishing
- deleting account
- submitting civic reports
- destructive moderation actions

---

# 24. Haptics

Use subtle feedback for:

- successful save
- successful report submission
- meaningful toggle changes

Do not vibrate on every scroll/tap.

---

# 25. Deep links — future contract

Design route names so future links can map cleanly:

```text
/nagrik/home
/video/:id
/news/:id
/event/:id
/job/:id
/creator/:id
/location/:id
/report/:id
```

---

# 26. UI-only mock data

Mock repositories should return:

- realistic Indian names
- realistic city/locality names
- mixed content lengths
- multiple languages
- verified/unverified examples
- sponsored example
- breaking example
- empty lists
- error cases

Never build the UI against one static happy-path object.
