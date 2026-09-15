# Nagrik — Security Specification

## 1. Scope

This document defines security requirements for the UI-only Flutter phase and the future backend integration.

Security must be designed now even though the backend is supplied later.

---

# 2. Core principles

- least privilege
- secure defaults
- no secrets in mobile source
- minimize collected data
- explicit permission context
- safe failure
- privacy by design
- auditable destructive actions
- server-authoritative authorization

---

# 3. UI-only security

The UI-only app must not contain:

- production API secrets
- cloud service private keys
- database passwords
- signing keys
- admin credentials
- hard-coded OTP bypasses

Mock credentials, if necessary, must be clearly non-production.

---

# 4. Authentication future contract

The backend should own:

- authentication
- token issuance
- refresh
- session invalidation
- account state

The mobile app should treat authentication as an untrusted client state.

Never assume:

```text
isAdmin == true
```

on the client means the user is an administrator.

The server must enforce authorization.

---

# 5. Token storage

If authentication tokens must be stored locally:

Use platform secure storage.

Do not store sensitive tokens in:

- plain shared preferences
- local JSON
- logs
- analytics events

---

# 6. API security

Future API must use:

- HTTPS
- certificate validation according to platform standards
- authentication headers
- request timeouts
- retry policy with backoff
- server-side authorization

Do not put access tokens in URLs.

---

# 7. Authorization

Backend should use role-based/attribute-based authorization.

Potential roles:

```text
user
creator
verified_creator
moderator
editor
admin
government
business
```

Client UI may hide unavailable actions for UX, but hiding is not security.

---

# 8. Location privacy

Location is highly sensitive contextual data.

Requirements:

- ask only when needed
- explain why
- support manual location
- avoid unnecessary continuous tracking
- do not expose exact user coordinates publicly
- store only required precision
- separate internal location matching from public location display

Public-facing content can show:

```text
Kolkata
Howrah
Near Salt Lake
```

rather than a user's exact coordinates.

---

# 9. Camera/photo permissions

Request camera/gallery permissions only at the point of use.

If denied:

```text
You can choose an existing photo instead.
```

Do not block unrelated app functionality.

---

# 10. Notification permissions

Explain value before requesting where platform conventions allow.

Provide settings controls for categories.

---

# 11. User-generated content

Treat all user content as untrusted.

Future backend must protect against:

- malicious links
- spam
- impersonation
- abusive content
- illegal content
- misinformation
- malicious filenames
- oversized uploads
- malformed media

---

# 12. Upload security

Future upload flow should use short-lived signed upload credentials.

Concept:

```text
App
 ↓
Backend authorization
 ↓
Short-lived upload URL/token
 ↓
Video provider
```

Never ship a permanent video-provider secret inside Flutter.

---

# 13. Content moderation

Use layered moderation:

```text
Automated checks
      ↓
Risk score
      ↓
Human review when necessary
      ↓
Publish/reject/escalate
```

AI should assist moderation; it should not be treated as a universal truth detector.

---

# 14. Reporting abuse

Protect reporting functionality against:

- report spam
- harassment through false reports
- automated report floods

Future backend should implement:

- rate limits
- abuse scoring
- deduplication
- moderation audit logs

---

# 15. Input validation

Client-side validation is for UX.

Server-side validation is mandatory.

Validate:

- text length
- allowed characters where appropriate
- IDs
- file size
- MIME type
- file duration
- coordinates
- pagination values

Never trust values supplied by the app.

---

# 16. Deep links

Validate deep-link IDs and destinations.

Never directly execute arbitrary URLs or commands from content.

For external URLs:

- show trusted destination
- use safe browser handling
- consider allowlists for privileged flows

---

# 17. Web content

If future content includes rich HTML/web views:

- sanitize HTML
- restrict navigation
- avoid injecting arbitrary JavaScript
- do not expose native bridges unnecessarily

---

# 18. Secure logging

Never log:

- access tokens
- refresh tokens
- OTP
- passwords
- payment details
- private messages
- unnecessary exact coordinates

Use redaction in production logs.

---

# 19. Local drafts

Civic reports and uploads may contain sensitive evidence.

Future local drafts should:

- minimize retained data
- support deletion
- avoid indefinite storage
- use secure storage where sensitive metadata exists
- not automatically upload without user intent

---

# 20. Account deletion

Future UX must provide a clear deletion path.

Before destructive action:

```text
Delete account?
This cannot be undone.
```

Do not use confusing multi-step dark patterns.

---

# 21. Privacy controls

Future settings should allow users to understand:

- location usage
- notification usage
- personalization
- analytics
- saved content
- account data

Privacy explanations should be plain-language.

---

# 22. Rate limiting

Future backend should rate-limit:

- login/OTP
- upload
- comments
- likes
- follows
- reports
- search
- notification-triggering actions

The mobile app should gracefully handle HTTP 429.

---

# 23. Abuse prevention

Potential controls:

- device/IP rate limits
- suspicious-account scoring
- report thresholds
- creator trust score
- content throttling
- temporary restrictions
- human review

Do not expose internal moderation signals to ordinary users.

---

# 24. Copyright

Future content system needs:

- report copyright
- ownership claim
- takedown workflow
- repeat infringer controls
- audit trail

---

# 25. Sensitive content

Crime, accident, political, religious and public-safety content can be high-risk.

UI should provide:

- source
- timestamp
- location
- verification status where available
- report action

Avoid presenting allegations as established facts.

---

# 26. Security testing

Before production:

### Static

- `flutter analyze`
- dependency audit
- secret scanning

### Dynamic

- auth testing
- authorization testing
- API fuzzing
- upload validation
- rate-limit testing

### Mobile

- Android release inspection
- iOS release inspection
- certificate/network review
- secure storage verification

---

# 27. Dependency management

Keep dependencies minimal.

For every third-party package:

- verify maintenance
- inspect permissions
- check license
- review security history
- pin compatible versions
- remove unused packages

Do not add a package for a feature that can be implemented safely with Flutter SDK.

---

# 28. Release security checklist

- [ ] no secrets in repository
- [ ] no debug endpoints
- [ ] no debug logs
- [ ] no test accounts
- [ ] production signing protected
- [ ] secure storage verified
- [ ] permissions reviewed
- [ ] deep links validated
- [ ] external URLs reviewed
- [ ] dependency audit completed
- [ ] crash reports sanitized
- [ ] privacy policy linked
- [ ] account deletion path defined
- [ ] reporting path defined

---

# 29. Threat model

Key threats:

| Threat | Mitigation |
|---|---|
| stolen token | secure storage, short expiry, refresh rotation |
| fake admin UI | server-side authorization |
| upload abuse | signed upload + moderation + limits |
| location leakage | coarse public location |
| report spam | rate limits + abuse controls |
| malicious links | URL validation |
| dependency compromise | dependency review |
| secret extraction | no permanent secrets in app |
| reverse engineering | minimize client trust |
| privacy leakage | data minimization |

---

# 30. Security definition of done

The UI phase is security-ready when:

- no production secrets exist
- permission flows are intentional
- private data is not exposed in mock logs
- secure storage abstraction exists where required
- repository boundary prevents UI from handling credentials directly
- future API integration has clear trust boundaries
- destructive actions have explicit confirmation
- privacy-sensitive UI is designed before backend integration
