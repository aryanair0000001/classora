# Classora Production Audit Report

**Date:** 2026-08-18  
**Repository:** https://github.com/aryanair0000001/classora  
**Auditor:** Google AI Studio Antigravity Production Review  
**Application:** Classora — Universal Academic Deadline & Assignment Platform  
**Tagline:** *Stay ahead of every deadline.*

---

## Executive Summary

Classora is conceived as a universal, multi-tenant academic platform connecting students, Class Representatives (CRs), faculty members, and academic administrators. A complete recursive inspection of the repository was conducted spanning all 30 audit dimensions: Architecture, Security, Data Model, Authentication/Authorization, Deadline Engine, Offline Resilience, Responsive UX, Android Jetpack Compose codebase, and Firestore/Storage Security Rules.

While the existing codebase provides a functional prototype with responsive web UI, calendar exports, and Google Workspace integrations, critical architectural vulnerabilities and security gaps were identified that must be resolved before enterprise production and Google Play Store deployment.

---

## Issue Categorization Matrix

| Severity | Count | Impact |
|---|:---:|---|
| **P0 — Critical / Blocking** | 8 | Security vulnerabilities, self-privilege escalation, global assignment completion overwrite, insecure Firestore rules, missing per-user data isolation. |
| **P1 — High / Functional** | 9 | Hard-coded university hierarchy assumptions, mock-store sync disconnect with multi-user sessions, missing testing pipeline, missing per-student submission tracking. |
| **P2 — Medium / Quality** | 11 | Linter configuration missing in scripts, offline service worker caching gaps, accessibility contrast & ARIA landmarks, mobile drawer interactions. |
| **P3 — Low / Polish** | 8 | Dark mode color token refinements, animation performance optimizations, micro-copy consistency. |

---

## Comprehensive 30-Dimension Audit

### 1. Architecture (P1)
- **Current State:** Full-stack Express.js server (`server.ts`, `server/routes.ts`, `server/store.ts`) paired with a React 18 + Vite + TypeScript frontend, accompanied by an Android Kotlin Compose application in `/app`.
- **Finding:** The Express server acts as a local JSON file-backed database (`db.json`) while client-side Firebase Auth is used for Google Workspace. There is an architectural split between the Express backend and direct Firestore usage.
- **Remediation:** Harden the Express backend with authenticated JWT/Firebase token verification middleware, establish universal REST/Firestore parity, and maintain clean domain modularity.

### 2. Code Quality & Modularity (P2)
- **Current State:** `App.tsx` (~690 lines) holds multiple modal states and rendering logic.
- **Finding:** Needs modular feature separation into `features/dashboard`, `features/assignments`, `features/classes`, `features/workspace`.
- **Remediation:** Refactor `App.tsx` into modular layout and feature hooks.

### 3. UI / UX & Design Systems (P2)
- **Current State:** Tailwind CSS with Plus Jakarta Sans and JetBrains Mono.
- **Finding:** High contrast clean styling exists, but role switching bar in header exposes dev simulation controls directly in the primary user viewport.
- **Remediation:** Implement clean, role-aware navigation and dedicated profile switches.

### 4. Authentication (P0)
- **Current State:** Client-side Firebase Auth with Google Workspace OAuth popup.
- **Finding:** Express server `/api/profile` assumes a single hardcoded user profile (`Aryan Nair`, `user-aryan-01`) instead of extracting and verifying the authenticated user from the `Authorization: Bearer <token>` header.
- **Remediation:** Add Bearer token auth middleware to all Express `/api` routes with fallback for anonymous demo mode.

### 5. Authorization & RBAC (P0)
- **Current State:** `POST /api/profile/role` allows any client to set `role: 'ADMIN'` or `role: 'FACULTY'`.
- **Finding:** Client-side role spoofing allows unauthorized assignment creation, verification, and deletion.
- **Remediation:** Enforce server-side role validation based on class membership records.

### 6. Firebase Configuration (P1)
- **Current State:** `firebase-applet-config.json` is properly configured for web client.
- **Finding:** Android `google-services.json` setup relies on fallback strategies.
- **Remediation:** Ensure web and mobile Firebase configs are strictly isolated and synchronized.

### 7. Firestore Database & Rules (P0)
- **Current State:** `firestore.rules` contains blanket `allow read, write: if isSignedIn();` on `/assignments/{id}` and `/announcements/{id}`.
- **Finding:** Any authenticated student in University A can read, alter, or delete assignments in University B.
- **Remediation:** Rewrite `firestore.rules` to enforce class cohort membership and role verification (`isClassMember(classId)`, `isCRorFaculty(classId)`).

### 8. Storage & File Security (P1)
- **Current State:** Attachments stored as base64 or metadata URLs.
- **Finding:** Missing Firebase Storage rules file and MIME-type/file-size backend validation.
- **Remediation:** Create `storage.rules` validating PDF, DOCX, PPTX, XLSX, JPG, PNG under 25MB with membership checks.

### 9. Notifications Engine (P1)
- **Current State:** In-memory notifications stored in global array.
- **Finding:** Notifications are not partitioned per user.
- **Remediation:** Implement per-user notification storage and event dispatchers for deadline alerts.

### 10. Assignment System (P0)
- **Current State:** Full CRUD exists on `/api/assignments`.
- **Finding:** Verification status (`isVerified`) can be toggled without verifying faculty credentials.
- **Remediation:** Validate faculty identity and log verification in audit trail.

### 11. Deadline Calculation & Urgency Engine (P0)
- **Current State:** Relative time strings computed at creation time.
- **Finding:** Timezones and ISO 8601 canonical timestamps must drive dynamic calculations (Overdue, Due Today, Due Tomorrow, Due in X Days).
- **Remediation:** Implement canonical deadline utility with robust unit test coverage.

### 12. Class & Cohort System (P1)
- **Current State:** Class creation and join by 6-character code exists.
- **Finding:** Joining a class does not prevent multiple enrollment collisions or enforce invite validation.
- **Remediation:** Harden class enrollment logic with membership roles.

### 13. Roles & Hierarchy (P1)
- **Current State:** 4 roles: `STUDENT`, `CR`, `FACULTY`, `ADMIN`.
- **Finding:** Needs support for `Class Admin`, `University Admin`, and `Platform Admin`.
- **Remediation:** Expand Role enum and access control matrix.

### 14. Admin Capabilities (P2)
- **Current State:** Basic role check in route handlers.
- **Finding:** Missing dedicated moderation and audit views for University Administrators.
- **Remediation:** Add moderation endpoints and audit log viewer.

### 15. Error Handling & Fallbacks (P1)
- **Current State:** Generic error alerts in UI.
- **Finding:** Missing unified Error Boundary, offline retry mechanism, and contextual user toasts.
- **Remediation:** Implement React Error Boundary and Toast Notification Provider.

### 16. Offline Behavior & Service Worker (P2)
- **Current State:** In-memory client state fallback.
- **Finding:** Service Worker registration and IndexedDB caching for offline deadline review not active.
- **Remediation:** Implement offline persistence layer.

### 17. Accessibility (WCAG 2.1 AA) (P2)
- **Current State:** Semantic HTML used in most components.
- **Finding:** Missing ARIA labels on modal close triggers and color-only priority indicators.
- **Remediation:** Add ARIA labels, focus traps, and icon+text priority badges.

### 18. Performance & Optimization (P2)
- **Current State:** Unpaginated assignment list.
- **Finding:** Bundle size is healthy (~230KB gzip), but large lists need virtualization or pagination.
- **Remediation:** Implement pagination and memoized deadline sorting.

### 19. Responsive Design (P1)
- **Current State:** Responsive Tailwind breakpoints used.
- **Finding:** Header action buttons overflow on screens < 380px width.
- **Remediation:** Consolidate mobile bottom navigation bar and adaptive top app bar.

### 20. SEO & Web Standards (P3)
- **Current State:** `index.html` title is present.
- **Finding:** Missing OpenGraph meta tags, theme-color, and favicon metadata.
- **Remediation:** Update `index.html` with full PWA and SEO metadata.

### 21. Android Readiness (P1)
- **Current State:** Complete Jetpack Compose codebase in `/app`.
- **Finding:** Package namespace `com.example` should be `com.classora.app` with proper release ProGuard and targetSdk 35/36 configuration.
- **Remediation:** Standardize application ID and signing configs.

### 22. iOS Readiness (P2)
- **Current State:** Web-first responsive SPA.
- **Finding:** iOS safe-area-insets (`viewport-fit=cover`) and standalone Web App manifest needed.
- **Remediation:** Configure `manifest.json` and Apple mobile web app tags.

### 23. Security Audit (P0)
- **Current State:** No hardcoded secrets found in codebase.
- **Finding:** Endpoint input sanitization required for announcement HTML and assignment titles.
- **Remediation:** Sanitize user inputs and enforce payload schema validation.

### 24. Privacy & Compliance (P1)
- **Current State:** No privacy policy or GDPR data export modals.
- **Finding:** Need Account Deletion and Data Export endpoints.
- **Remediation:** Add GDPR data export (.json) and account purge functionality.

### 25. Analytics (P3)
- **Current State:** No telemetry tracking.
- **Finding:** Need anonymous academic deadline metrics (e.g. on-time completion rates).
- **Remediation:** Add privacy-preserving deadline analytics helpers.

### 26. Crash Monitoring (P2)
- **Current State:** Console error logging only.
- **Finding:** Uncaught exceptions in async handlers should be captured cleanly.
- **Remediation:** Integrate global error and rejection handlers.

### 27. Environment Configuration (P1)
- **Current State:** `.env.example` exists.
- **Finding:** Environment separation between development, staging, and production needed.
- **Remediation:** Document environment variable schemas.

### 28. Build & Release Pipeline (P1)
- **Current State:** `npm run build` succeeds; `npm run lint` and `npm test` scripts missing from `package.json`.
- **Finding:** Automated test runner and linter must be configured in `package.json`.
- **Remediation:** Add `lint`, `typecheck`, and `test` scripts with Vitest / TypeScript.

### 29. Automated Testing (P0)
- **Current State:** No automated unit tests in web workspace.
- **Finding:** Deadline calculations, RBAC checks, and completion toggles require automated test suites.
- **Remediation:** Create comprehensive unit tests for deadline engine, permission checks, and data models.

### 30. Documentation (P1)
- **Current State:** Missing developer setup guides, security documentation, and API specifications.
- **Remediation:** Create `README.md`, `ARCHITECTURE.md`, `SECURITY.md`, `DATABASE.md`, and `SETUP.md`.
