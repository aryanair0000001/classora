# Classora Security & Compliance Report

**Date:** 2026-08-18  
**Classification:** Internal Security Audit  
**Status:** Remediated & Hardened  

---

## 1. Secret Scanning Audit Results

| Item Scanned | Findings | Status | Action Taken |
|---|---|---|---|
| **Private Keys (`.pem`, `.key`, `id_rsa`)** | None found | Clean | N/A |
| **Service Account JSON Credentials** | None found | Clean | N/A |
| **Hardcoded Database Passwords** | None found | Clean | Standardized environment configs |
| **Android Keystore Signatures** | `debug.keystore` is base64 encoded for dev builds only | Expected | Release signing uses environment secrets |
| **Firebase Client Configuration** | `firebase-applet-config.json` holds public client API key | Normal | Client keys are protected by Firestore security rules and App Check |

---

## 2. Vulnerability Assessment & Mitigation Matrix

### [SEC-01] Client-Side Role Spoofing (P0)
- **Vulnerability:** Unauthenticated or student users could issue POST requests to `/api/profile/role` with `role: "ADMIN"` or `role: "FACULTY"`.
- **Impact:** Privilege escalation enabling unauthorized creation, alteration, or deletion of academic tasks.
- **Mitigation:** Server-side token validation middleware and membership validation.

### [SEC-02] Insecure Firestore Rules (P0)
- **Vulnerability:** `allow read, write: if isSignedIn();` on all `/assignments/{id}` documents allowed cross-tenant and cross-university data tampering.
- **Impact:** Student from University A could delete records belonging to University B.
- **Mitigation:** Enforce membership verification (`isEnrolledInClass(classId)`) and role checks (`isClassCR(classId) || isFaculty()`) in `firestore.rules`.

### [SEC-03] Missing Token Isolation on Express API (P0)
- **Vulnerability:** The Express API routes operated with a single default profile rather than extracting the user context from the incoming Bearer token or session.
- **Impact:** Multi-user collisions on shared backend instances.
- **Mitigation:** Implemented `authMiddleware` that parses the Firebase/OAuth Bearer token, associates request state with the active user UID, and isolates user-specific data.

### [SEC-04] Cross-Site Scripting (XSS) Sanitization in Announcements (P1)
- **Vulnerability:** Unsanitized HTML in announcement descriptions.
- **Impact:** Potential script injection via shared class notices.
- **Mitigation:** Strict plain text rendering and input sanitization on all announcement and rubric inputs.

---

## 3. Data Privacy & GDPR Compliance
- **Account Purge:** Users can delete their profile and remove all associated personal data.
- **Data Export:** Full JSON export of student assignments, completions, and enrolled class metadata available upon request.
- **Zero Third-Party Telemetry Leaks:** No unvetted third-party analytics trackers.
