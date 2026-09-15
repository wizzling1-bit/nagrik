# Nagrik — User Flows

## 1. First launch

```text
Launch
  ↓
Splash
  ↓
Welcome
  ↓
Choose language
  ↓
Choose location
  ↓
Notification preferences
  ↓
Home
```

### Skip behavior

User may postpone:

- location
- notification preferences

The app should still provide a useful limited browsing experience.

---

# 2. Returning user

```text
Launch
 ↓
Restore local preferences
 ↓
Home
```

Do not repeat onboarding unnecessarily.

---

# 3. Location flow

```text
Home
 ↓
Tap location
 ↓
Location switcher
 ├── Current location
 ├── Saved area
 └── Add area
       ↓
Search/browse
       ↓
Select
       ↓
Confirm
       ↓
Feed refresh
```

Feed refresh should use a subtle transition, not a jarring full-screen reload.

---

# 4. Language change

```text
Profile
 ↓
Settings
 ↓
Language
 ↓
Select language
 ↓
Confirm/change
 ↓
UI updates
```

If restart is required for a specific implementation, communicate it clearly.

---

# 5. Watch a video

```text
Home
 ↓
Video visible
 ↓
Autoplay muted
 ↓
User watches
 ├── tap → pause/play
 ├── double tap → like
 ├── swipe → next
 ├── comment
 ├── share
 ├── save
 └── report
```

---

# 6. Comment flow

```text
Video
 ↓
Comment
 ↓
Comment sheet
 ↓
Type
 ↓
Send
 ↓
Optimistic comment
 ↓
Sync later
```

For UI-only mode, simulate successful submission.

---

# 7. Save flow

```text
Video
 ↓
Save
 ↓
Icon changes
 ↓
Snackbar: Saved
```

Undo may be provided.

---

# 8. Share flow

```text
Video
 ↓
Share
 ↓
Native share sheet
```

The UI should be prepared to pass a future deep link.

---

# 9. Report content

```text
Video
 ↓
More
 ↓
Report
 ↓
Reason
 ↓
Optional details
 ↓
Submit
 ↓
Success
```

Never make reporting harder than publishing.

---

# 10. Civic issue report

```text
Report
 ↓
Civic issue
 ↓
Select category
 ↓
Attach evidence
 ↓
Location
 ↓
Description
 ↓
Review
 ↓
Submit
 ↓
Success
```

---

# 11. Create video

```text
Report/Create
 ↓
Create video
 ↓
Camera/gallery
 ↓
Preview
 ↓
Trim
 ↓
Cover
 ↓
Caption
 ↓
Category
 ↓
Location
 ↓
Publish
 ↓
Processing
 ↓
Published
```

UI-only phase may show processing as a simulated state.

---

# 12. Search

```text
Discover
 ↓
Search
 ↓
Type query
 ↓
Suggestions
 ↓
Results
 ├── Videos
 ├── News
 ├── Events
 ├── Jobs
 └── Creators
```

---

# 13. Notification flow

```text
Notification icon
 ↓
Notifications
 ↓
Tap item
 ↓
Deep-linked content
```

Unread badge updates immediately.

---

# 14. Creator follow

```text
Video/profile
 ↓
Creator
 ↓
Follow
 ↓
Selected state
```

Optimistic UI is appropriate.

---

# 15. Guest → authenticated action

Do not force login when browsing.

Example:

```text
Guest
 ↓
Tap comment
 ↓
Authentication prompt
 ↓
Sign in/create account
 ↓
Return to original action
```

The original intent should be preserved.

---

# 16. Settings flow

```text
Profile
 ↓
Settings
 ├── Account
 ├── Notifications
 ├── Appearance
 ├── Language
 ├── Location
 ├── Privacy & Safety
 └── About
```

---

# 17. Theme change

```text
Settings
 ↓
Appearance
 ↓
System / Light / Dark
 ↓
Theme changes immediately
```

Persist preference locally.

---

# 18. Notification preference

```text
Settings
 ↓
Notifications
 ↓
Category toggles
 ↓
Change
 ↓
Persist locally
```

Later these preferences map to backend notification topics.

---

# 19. Error recovery

### Feed

```text
Error
 ↓
Try again
 ↓
Loading
 ↓
Success
```

### Upload

```text
Failure
 ↓
Retry
 ├── success
 └── failure
```

Preserve draft state whenever possible.

---

# 20. Accessibility flow

Every critical action should be achievable without gesture-only interaction.

Example:

Video:

```text
Screen reader
 ↓
Video title
 ↓
Play/pause
 ↓
Like
 ↓
Comment
 ↓
Share
 ↓
Save
 ↓
Report
```

---

# 21. Back navigation

Rules:

- modal/sheet closes first
- nested route pops next
- root route exits/minimizes according to platform convention
- unsaved upload changes trigger confirmation

Avoid custom back behavior that violates Android/iOS conventions.
