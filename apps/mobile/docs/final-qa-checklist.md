# Nagrik Final QA Manual Test Checklist

**Product:** Nagrik (`com.wizzling.nagrik`)  
**Target Release:** `1.0.0+1`  
**Purpose:** Pre-launch verification protocol for QA teams, release engineers, and beta testers before submitting to Google Play Store.

---

## 1. Startup & Initialization

| TC # | Test Case | Action / Steps | Expected Result | Pass/Fail |
|---|---|---|---|---|
| **ST-01** | Fresh Install Launch | Install fresh build, launch app from launcher. | Cinematic 5-act splash renders smoothly with 3s narrative; transitions to Onboarding or Feed without flicker. | [ ] |
| **ST-02** | Splash Skip | Tap "Skip" / swipe during splash animation. | Transitions immediately to the target screen without hitching or lingering audio/tickers. | [ ] |
| **ST-03** | Startup Watchdog | Simulate slow disk or blocked future during startup. | 6-second watchdog forces transition to primary UI; app never gets stuck on splash screen. | [ ] |
| **ST-04** | Parallel SDK Init | Launch app with Network Profiler attached. | MobileAds SDK initializes asynchronously in parallel; 0ms UI thread blockage. | [ ] |
| **ST-05** | Offline Cold Start | Turn off Wi-Fi and Mobile Data, launch app. | App opens cleanly, serves cached feed items from disk if previously launched, or shows clear Offline Error card with Retry button. | [ ] |
| **ST-06** | Slow 2G/3G Simulation | Throttle connection to 50 kbps with 2000ms latency. | Shimmer skeletons render gracefully while waiting; 35s timeout triggers friendly retry banner rather than crashing. | [ ] |

---

## 2. Location Services & Hyperlocal Scoping

| TC # | Test Case | Action / Steps | Expected Result | Pass/Fail |
|---|---|---|---|---|
| **LOC-01** | GPS Permission Granted | Tap "Detect My Location" on Onboarding or Location Switcher; tap "While using the app". | Device GPS coordinates resolve city & locality; feed immediately scopes to detected city. | [ ] |
| **LOC-02** | GPS Permission Denied | Tap "Don't allow" on system location dialog. | App gracefully falls back to manual city selection modal; no crash, no repeated permission spam. | [ ] |
| **LOC-03** | GPS Permanently Denied | Deny permission with "Don't ask again". | App presents manual location list without crashing or infinite permission loop. | [ ] |
| **LOC-04** | Location Services Disabled | Turn off device GPS toggle in Android quick settings, tap detect location. | Geolocator prompts user to enable location services or fallback to manual list. | [ ] |
| **LOC-05** | Manual Neighborhood Switch | Tap location pill in App Bar -> search "Kolkata" or "Patna" -> select locality. | Location switcher updates selected city & ward; feed immediately refreshes for the new locality. | [ ] |
| **LOC-06** | Unsupported Locality | Pick an area with 0 published stories. | Feed renders friendly `NagrikEmptyState` ("No updates right now in your area") without errors. | [ ] |

---

## 3. Feed & Editorial Reading Experience

| TC # | Test Case | Action / Steps | Expected Result | Pass/Fail |
|---|---|---|---|---|
| **FD-01** | Feed Pagination | Scroll to the bottom of the home feed. | Loading spinner indicator displays at the footer; next page (page 2) appends smoothly without jumping scroll offset. | [ ] |
| **FD-02** | Pull-to-Refresh | Pull down from the top of the feed and release. | Haptic vibration triggers; active posts refresh; new items prepend cleanly. | [ ] |
| **FD-03** | Breaking Urgent Hero | When an urgent alert post is returned by backend. | High-contrast breaking news card renders at the top of the feed with pulsing alert pill. | [ ] |
| **FD-04** | Tab Navigation | Switch between "All News" and "Videos" tabs. | Feed filters immediately between editorial articles and video reports without re-triggering full page loader. | [ ] |
| **FD-05** | Image Loading & Error | Feed card with missing/broken image URL. | Graceful fallback image placeholder renders; no red Flutter exception boxes. | [ ] |
| **FD-06** | Native Ad Interleaving | Scroll through 20 feed posts. | A native ad card appears once every 7 organic posts with clear `#Ad` badge and border. | [ ] |

---

## 4. Video Content & Media Playback

| TC # | Test Case | Action / Steps | Expected Result | Pass/Fail |
|---|---|---|---|---|
| **VD-01** | Video Stream Playback | Tap on a video card in the feed. | Opens video detail screen; video starts streaming with inline controls, duration, and buffering indicator. | [ ] |
| **VD-02** | Play/Pause & Scrubbing | Tap playback area to pause; scrub progress bar. | Playback halts/resumes reliably; scrubber seeks to correct timestamp. | [ ] |
| **VD-03** | 3-View Ceiling Rule | Play 3 distinct video items in the same session. | Backend `registerView` API registers video views accurately without exceeding ceiling or spamming server. | [ ] |
| **VD-04** | Video Controller Disposal | Navigate back from video detail to feed. | Audio halts immediately; `VideoPlayerController` disposes cleanly without memory leaks. | [ ] |

---

## 5. Search & Discovery

| TC # | Test Case | Action / Steps | Expected Result | Pass/Fail |
|---|---|---|---|---|
| **SR-01** | Debounced Live Search | Type "water" into the search bar. | Request fires 400ms after user stops typing; matching headlines populate the list. | [ ] |
| **SR-02** | Clear Search | Tap the (X) clear icon in search text field. | Query text clears instantly; view reverts to recent searches or categories. | [ ] |
| **SR-03** | Category Filter Pills | Tap "Civic" or "Traffic" pill under search bar. | Results narrow strictly to the selected category. | [ ] |
| **SR-04** | Zero Search Results | Search for a gibberish term (e.g. `xyz123qwe`). | Friendly empty state renders: "No stories found matching your query". | [ ] |
| **SR-05** | Keyboard Dismissal | Tap on any search result or background area. | Virtual keyboard dismisses cleanly without clipping layout. | [ ] |

---

## 6. Article Details, Bookmarks & Engagement

| TC # | Test Case | Action / Steps | Expected Result | Pass/Fail |
|---|---|---|---|---|
| **DT-01** | Article Detail Navigation | Tap an article card in the feed. | Transitions smoothly into full story view with hero header, publisher attribution, and full body text. | [ ] |
| **DT-02** | Like Interaction | Tap the heart/like icon on detail view. | Icon toggles to filled state; like count increments optimistically; synchronizes with backend. | [ ] |
| **DT-03** | Bookmark Post | Tap the bookmark icon on any article. | Bookmark icon turns active; post is saved into local storage. | [ ] |
| **DT-04** | Saved Archive View | Open the "Saved" bottom nav tab. | Bookmarked article appears immediately in the saved list. | [ ] |
| **DT-05** | Unsave / Remove | Tap bookmark icon again on saved card. | Post is removed from saved list; if list becomes empty, `NagrikEmptyState` renders. | [ ] |
| **DT-06** | Saved Persistence on Restart | Bookmark 2 posts, force-stop app, relaunch. | Both bookmarked posts remain saved in the Saved tab across restarts. | [ ] |
| **DT-07** | Report Story Sheet | Tap 3-dot menu -> "Report Story" -> select reason -> Submit. | Confirmation toast appears; report payload dispatches to backend. | [ ] |
| **DT-08** | Native Share | Tap share button on article. | Android system share sheet opens with article title and link. | [ ] |

---

## 7. Theming & Dark Mode Consistency

| TC # | Test Case | Action / Steps | Expected Result | Pass/Fail |
|---|---|---|---|---|
| **TH-01** | Light Mode Verification | Set system theme to Light; inspect all 4 tabs. | Backgrounds are crisp white/light gray (`#F8FAFC`); text is high-contrast deep slate (`#0F172A`). | [ ] |
| **TH-02** | Dark Mode Verification | Set system theme to Dark; inspect all 4 tabs. | Surfaces use deep navy theme tokens (`#070B12`); text is high-contrast off-white (`#F8FAFC`). Zero unreadable gray-on-gray text. | [ ] |
| **TH-03** | Runtime Theme Toggle | Toggle Dark/Light mode switch in Settings. | Entire app re-themes instantly without requiring restart or dropping scroll position. | [ ] |
| **TH-04** | System Navigation Bar Contrast | Toggle dark/light mode on device with 3-button navigation. | System navigation bar icon colors adapt automatically to remain clearly visible. | [ ] |

---

## 8. Localization & Regional Typography

| TC # | Test Case | Action / Steps | Expected Result | Pass/Fail |
|---|---|---|---|---|
| **LC-01** | English | Select English in Language Settings. | All navigation tabs, headers, alerts, and settings render in correct English copy. | [ ] |
| **LC-02** | Hindi (हिन्दी) | Select Hindi in Language Settings. | Navigation, headers, empty states render in Devanagari script; font renders cleanly with proper conjuncts. | [ ] |
| **LC-03** | Bengali (বাংলা) | Select Bengali in Language Settings. | All strings render in Bengali script without clipping or box characters. | [ ] |
| **LC-04** | Southern Scripts (Telugu, Tamil, Kannada, Malayalam) | Test each southern language. | Scripts render crisply; line height prevents vertical clipping of diacritics. | [ ] |
| **LC-05** | Western & Eastern Scripts (Marathi, Gujarati, Odia, Punjabi, Assamese) | Test remaining languages. | Layout adjusts for regional text expansion without `RenderFlex` overflow. | [ ] |

---

## 9. Google AdMob & Monetization Policy Verification

| TC # | Test Case | Action / Steps | Expected Result | Pass/Fail |
|---|---|---|---|---|
| **AD-01** | Adaptive Banner Display | Open Search or Saved (with 3+ items). | Anchored adaptive banner renders at bottom; content has bottom padding so banner never covers text or buttons. | [ ] |
| **AD-02** | Native Feed Ad Policy | Scroll through news feed. | Native ad has distinct container, border, clear `#Ad` tag, and does NOT mimic organic headlines deceitfully. | [ ] |
| **AD-03** | Interstitial Frequency | Read 5 articles consecutively in one session. | Interstitial triggers only after user reaches the 5th article threshold; closes cleanly to target screen. | [ ] |
| **AD-04** | Full-Screen Cooldown | Trigger an interstitial, then attempt to trigger another within 30s. | Second full-screen ad is suppressed by 45s cooldown manager. | [ ] |
| **AD-05** | App Open Ad Guard | Cold start app; observe splash. | App Open ad NEVER displays during splash screen or onboarding; only triggers on eligible background-to-foreground resume after 120s cooldown. | [ ] |
| **AD-06** | UMP Consent Settings | Open Settings -> tap "Privacy & Ad Preferences". | Google UMP Consent form presents immediately; user can toggle personalization preferences. | [ ] |
| **AD-07** | Ad Failure Graceful Degradation | Block ad traffic / airplane mode. | Ad slots collapse to `SizedBox.shrink()`; zero empty blank colored boxes or broken layout spaces. | [ ] |

---

## 10. Device & Hardware Matrix Testing

| Device Category | Target Specs | Verified OS | Screen Dimensions | Pass/Fail |
|---|---|---|---|---|
| **Low-End Android** | 2GB - 3GB RAM, Quad-Core | Android 8.1 - 10 | 720 x 1440 px | [ ] |
| **Mid-Range Android** | 6GB - 8GB RAM | Android 12 - 14 | 1080 x 2400 px | [ ] |
| **Flagship Android** | 12GB+ RAM, 120Hz | Android 15 - 16 | 1440 x 3200 px | [ ] |
| **Small Form Factor** | Compact display | Android 11+ | 4.7" - 5.5" screen | [ ] |
| **Large Screen / Tablet** | 10-inch Android Tablet | Android 13+ | 1600 x 2560 px | [ ] |
| **Network Conditions** | Fast Wi-Fi, 4G/5G, Slow 3G, Airplane Mode | Any | N/A | [ ] |
