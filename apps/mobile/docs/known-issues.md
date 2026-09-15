# Nagrik Known Issues & Architecture Limitations

**Product:** Nagrik (`com.wizzling.nagrik`)  
**Version:** `1.0.0+1`  
**Evaluation Date:** September 2026  
**Audience:** Development Team, QA Engineers, Product Managers  

---

## 1. Release Blockers

### Codebase Blockers: **0** (All P0 blockers resolved)
- `com.example.nagrik` removed; replaced with `com.wizzling.nagrik`.
- Target SDK updated to 36 (Android 16).
- All mock data dependencies and seed data removed from production feed paths.
- All `debugPrint` calls gated behind `if (kDebugMode)`.
- Release signing configuration integrated with `key.properties` fallback.
- `POST_NOTIFICATIONS` permission declared for Android 13+.

---

## 2. External / Console Configuration Requirements

The following items are external prerequisites before Google Play Store review and cannot be committed directly to Git:

| Item | Requirement | Responsible Party | Priority |
|---|---|---|---|
| **Production Keystore** | Developer must generate `nagrik-release-key.jks` using keytool and configure `android/key.properties`. | Developer | **P0 (Mandatory for signing)** |
| **Hosted Privacy Policy** | Privacy policy text must be published on a public web domain (e.g. `https://wizzling.com/nagrik/privacy`) and URL entered in Play Console. | Product Owner / Legal | **P0 (Mandatory for Play Console)** |
| **Store Listing Graphics** | 512x512 app icon, 1024x500 feature graphic, and real phone screenshots must be uploaded to Play Console. | UI/UX Designer | **P0 (Mandatory for Store Listing)** |
| **20-Tester Closed Beta** | If publishing from a new personal Google Play Developer account created after Nov 2023, Google requires a 14-day closed beta with at least 20 opted-in testers before production access is unlocked. | Release Manager | **P0 (Google Policy Requirement)** |

---

## 3. Backend & Infrastructure Limitations

### 3.1. Render Free-Tier Web Service Cold Starts
- **Behavior:** The backend server (`https://nagrik-1x9o.onrender.com`) runs on Render's free tier. After 15 minutes of inactivity, the instance spins down. A new request may experience a 30 to 45-second spin-up delay.
- **Client-Side Mitigation:**
  - `ApiClient` uses a 35-second timeout with friendly retry cards.
  - Stale-while-revalidate disk cache displays previously loaded stories instantly while the network wakes up.
- **Permanent Solution:** Upgrade the Render web service to an "always-on" paid instance or deploy a lightweight health-check cron to prevent idling.

### 3.2. Absence of Backend Saved Articles Endpoint (`GET /saved`)
- **Behavior:** The REST API specification does not provide a user-specific `GET /saved` endpoint because Nagrik does not require user accounts.
- **Client-Side Implementation:** Bookmarks are stored on-device in `SharedPreferences` using `SavedRepository`. Toggling like/save dispatches optimistic sync to the backend to increment metrics.
- **Limitation:** Bookmarked posts do not automatically synchronize across multiple devices owned by the same user. This is by design for the anonymous architecture.

### 3.3. Push Notifications Backend Dependency
- **Behavior:** The backend does not yet host a real-time Firebase Cloud Messaging (FCM) dispatch worker.
- **Client-Side Implementation:** The app generates local breaking notifications on-device (`syncUrgentPosts`) when urgent stories appear in the fetched feed, remembering already-notified IDs in local storage.
- **Future Roadmap:** Integrate Firebase Messaging plugin and device FCM registration once backend dispatch infrastructure is live.

---

## 4. Non-Blocking Client Limitations & Edge Cases

| Area | Issue Description | Impact | Current Workaround |
|---|---|---|---|
| **Video Playback** | Heavy video files streamed over very slow 2G connections may stutter during initial buffer fill. | Low | Inline loading spinner indicates buffering state. User can pause to buffer. |
| **Offline Actions** | Likes or reports submitted while completely offline fail silently with a friendly message. | Low | User is informed to retry when reconnected. Future release can add an offline sync queue. |
| **Language Selection** | Switching languages updates UI strings instantly, but editorial article body text is authored in the reporter's source language. | Low | Normal behavior for local citizen reporting. Header copy, categories, and controls are 100% localized. |

---

## 5. Post-Launch Roadmap & Enhancements

1. **Phase 1.1 (Performance):** Implement video segment pre-caching using `flutter_cache_manager` for instant video playback in the feed.
2. **Phase 1.2 (Sync):** Add a persistent SQLite / Drift offline mutation queue that retries likes and video view registrations when internet is restored.
3. **Phase 1.3 (Push):** Deploy backend FCM worker and register FCM tokens with `POST /api/v1/notifications/register` for real-time push dispatches when urgent civic emergencies occur.
