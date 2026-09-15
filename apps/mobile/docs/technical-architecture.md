# Nagrik — Technical Architecture

## 1. Architecture goal

The UI-only application must be production-oriented without prematurely introducing backend complexity.

Recommended approach:

> **Feature-first Flutter architecture + repository interfaces + local mock implementations + centralized design system.**

When the client supplies APIs later, replace mock repositories without rewriting screens.

---

# 2. Flutter stack

Recommended:

- Flutter
- Dart
- Material 3 foundations
- Riverpod for state management
- GoRouter for navigation
- Dio for future HTTP
- Freezed/json_serializable for future models
- cached image solution
- video_player for playback abstraction
- Flutter Secure Storage for sensitive local secrets when needed

Package choices should be pinned/updated deliberately rather than adding packages for trivial functionality.

---

# 3. Project structure

```text
lib/
├── app/
│   ├── app.dart
│   ├── router.dart
│   └── bootstrap.dart
│
├── core/
│   ├── constants/
│   ├── errors/
│   ├── extensions/
│   ├── localization/
│   ├── theme/
│   │   ├── app_theme.dart
│   │   ├── color_tokens.dart
│   │   ├── typography.dart
│   │   ├── spacing.dart
│   │   └── theme_extensions.dart
│   ├── utils/
│   └── widgets/
│
├── features/
│   ├── onboarding/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   ├── home/
│   ├── discover/
│   ├── video/
│   ├── report/
│   ├── notifications/
│   ├── profile/
│   └── settings/
│
└── shared/
    ├── models/
    └── repositories/
```

---

# 4. Layer responsibilities

## Presentation

Contains:

- pages
- widgets
- providers/notifiers
- UI state

Must not directly call HTTP.

## Domain

Contains:

- entities
- use cases
- repository contracts

## Data

Contains:

- DTOs
- API clients
- repository implementations
- local persistence

This separation allows mock → real API migration.

---

# 5. Repository pattern

Example conceptual contract:

```dart
abstract class FeedRepository {
  Future<List<FeedItem>> getFeed({
    required LocationContext location,
    required FeedMode mode,
  });
}
```

UI receives a provider of `FeedRepository`.

Current implementation:

```text
MockFeedRepository
```

Future implementation:

```text
ApiFeedRepository
```

The UI does not care which one is active.

---

# 6. State management

Use Riverpod.

Recommended state categories:

```text
AppPreferences
Theme
Locale
Location
Feed
VideoPlayback
Notifications
ReportDraft
UploadDraft
Profile
```

Avoid putting every piece of state into one global provider.

---

# 7. Navigation

Use GoRouter.

Conceptual routes:

```text
/
 /onboarding
 /home
 /discover
 /report
 /notifications
 /profile
 /video/:id
 /creator/:id
 /search
 /settings
 /settings/language
 /settings/location
 /settings/notifications
 /settings/privacy
 /create
```

Use shell routing for the main bottom-navigation area.

---

# 8. Responsive layout

Use `LayoutBuilder`/breakpoints.

Example:

```text
< 600 dp → phone
600–840 dp → compact tablet
> 840 dp → expanded tablet
```

Do not use device-specific magic numbers everywhere.

Centralize breakpoints.

---

# 9. Theme implementation

Use:

```dart
ThemeData(
  useMaterial3: true,
  colorScheme: ...,
  textTheme: ...,
)
```

Use a custom `ThemeExtension` for Nagrik tokens not represented by Material's standard scheme.

---

# 10. Color implementation

Raw colors belong in one place.

Example:

```dart
abstract final class NagrikColors {
  static const navy900 = Color(0xFF0A2647);
  static const navy700 = Color(0xFF144272);
  static const blue600 = Color(0xFF205295);
  static const blue500 = Color(0xFF2C74B3);
}
```

Feature widgets should consume semantic theme values rather than raw colors.

---

# 11. Mock-data architecture

Use local JSON/Dart fixtures.

Mock repositories should simulate:

- latency
- pagination
- errors
- empty states
- success
- optimistic operations

This is better than rendering static hard-coded widget trees.

---

# 12. Feed architecture in UI phase

UI responsibilities:

```text
FeedController
 ↓
Repository
 ↓
Mock data
 ↓
Async state
 ↓
FeedList
 ↓
FeedItem
```

Video playback should be isolated from the entire feed controller.

---

# 13. Video architecture

Create an abstraction:

```text
VideoControllerAdapter
```

It should eventually support:

- initialize
- play
- pause
- mute
- seek
- dispose
- error
- buffering

Do not make the feed directly depend on a specific cloud video provider.

Future providers could be:

- Cloudflare Stream
- Mux
- another client-selected provider

---

# 14. Image strategy

Use:

- cached images
- fixed aspect ratios
- placeholders
- error widgets

Never allow unpredictable image dimensions to cause list jumps.

---

# 15. Local persistence

For UI phase, persist:

- theme
- language
- selected location
- onboarding completion
- notification preferences
- saved mock IDs if useful

A lightweight local store can be used.

Sensitive credentials must not be stored in plain shared preferences.

---

# 16. Performance

### Lists

Use lazy builders.

### Rebuilds

Scope providers carefully.

### Images

Cache and size appropriately.

### Video

Only preload the immediate next item(s).

### Animations

Avoid rebuilding entire lists from animation controllers.

### Heavy work

Move CPU-heavy processing away from the UI isolate where needed.

---

# 17. Error architecture

Create typed app errors:

```text
NetworkError
UnauthorizedError
ValidationError
NotFoundError
UploadError
LocationError
UnknownError
```

UI maps errors to user-friendly copy.

Do not expose raw exception messages.

---

# 18. Logging

Development logging:

- route changes
- repository calls
- state transitions
- mock failures

Production logging must avoid:

- tokens
- passwords
- OTPs
- private user content
- exact sensitive location where unnecessary

---

# 19. Testing

## Unit

Test:

- token mapping
- models
- repositories
- state transitions
- validation

## Widget

Test:

- buttons
- forms
- cards
- feed states
- theme variants

## Golden

Use golden tests for:

- core components
- key screens
- light/dark variants

## Integration

Later test:

- onboarding
- feed
- report
- upload
- settings

---

# 20. Accessibility testing

Test:

- TalkBack
- VoiceOver
- large text
- high contrast
- reduced motion
- landscape/tablet where supported

---

# 21. Build environments

Recommended:

```text
dev
staging
production
```

UI phase can use:

```text
mock
```

as the data environment.

Never hardcode production endpoints into widgets.

---

# 22. Backend migration contract

When APIs arrive, replace:

```text
MockFeedRepository
```

with:

```text
ApiFeedRepository
```

and preserve:

```text
FeedController
FeedScreen
FeedItem
```

as much as possible.

API mapping should occur in data layer DTO → domain model.

---

# 23. Future production backend boundary

Future conceptual system:

```text
Flutter
  ↓
API Gateway
  ↓
Backend
  ├── Auth
  ├── User
  ├── Location
  ├── Content
  ├── Feed
  ├── Comments
  ├── Reports
  ├── Notifications
  └── Moderation
```

Video:

```text
Mobile
 ↓
Signed upload
 ↓
Video provider
 ↓
Processing
 ↓
CDN playback
```

The mobile app should never contain permanent cloud-provider secrets.

---

# 24. CI/CD

Recommended:

- GitHub
- pull requests
- formatting checks
- analyzer
- tests
- build validation
- separate staging/release workflows

Never commit:

- API keys
- signing credentials
- service-account files
- production secrets
