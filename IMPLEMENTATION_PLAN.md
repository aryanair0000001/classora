# Classora Production Hardening Implementation Plan

**Phases:** 1 through 35  
**Priority Hierarchy:** P0 (Security / Critical) -> P1 (Core Architecture) -> P2 (Quality & UX) -> P3 (Polish & Release)  

---

## Phase Execution Checklist

### Phase 1: Foundational Audit & Baseline Documentation (COMPLETED)
- [x] Generated `AUDIT_REPORT.md` with 30-dimension audit.
- [x] Generated `CURRENT_FEATURES.md` with zero-loss feature inventory.
- [x] Generated `GAP_ANALYSIS.md` for universal academic structure.
- [x] Generated `SECURITY_REPORT.md` covering vulnerability mitigations.
- [x] Generated `IMPLEMENTATION_PLAN.md`.

### Phase 2: Security & Authentication Hardening (P0)
- [x] Update and harden `firestore.rules` with role-based and membership-based validation.
- [x] Add server auth middleware to parse Bearer tokens and prevent unauthorized privilege escalation.
- [x] Isolate per-user assignment completion state (prevent one student's completion from affecting others).
- [x] Implement input sanitization on all create/update API endpoints.

### Phase 3: Universal Academic Hierarchy & Configurable Data Models (P1)
- [x] Expand `src/types/index.ts` to support universal academic structures (Universities globally, custom programs, configurable terms/semesters, schools, departments).
- [x] Remove any hard-coded institutional assumptions in the business logic.
- [x] Provide robust seeding and custom creation for universities, programs, and classes worldwide.

### Phase 4: Deadline Engine & Timezone Precision (P0/P1)
- [x] Build canonical deadline utility (`src/utils/deadlineEngine.ts`) with UTC ISO-8601 normalization.
- [x] Implement robust status calculations: `Overdue`, `Due Today`, `Due Tomorrow`, `Due in X days/hours`.
- [x] Write automated tests for deadline calculation and edge cases (leap years, midnight deadlines, timezone shifts).

### Phase 5: Verification & Moderation Workflow (P1)
- [x] Enhance Faculty Verification workflow with official rubric checks and verification logs.
- [x] Guard assignment pinning and deletion permissions strictly by role and class membership.

### Phase 6: Code Quality, Testing, and Pipeline (P1/P2)
- [x] Add `npm run lint`, `npm run typecheck`, and `npm test` scripts to `package.json`.
- [x] Add automated unit test suite verifying deadline calculations, completion isolation, and RBAC rules.
- [x] Refactor and modularize components with strict TypeScript types and zero runtime warnings.

### Phase 7: UI/UX, Accessibility, and Responsive Polish (P2/P3)
- [x] Optimize responsive header, mobile navigation, and action buttons.
- [x] Enforce WCAG 2.1 AA accessibility (keyboard focus, ARIA labels, contrast).
- [x] Polish dark/light mode tokens and micro-interactions.

### Phase 8: Final Verification & Production Build
- [x] Run comprehensive linter and test suite.
- [x] Verify production build via `compile_applet`.
- [x] Deliver final summary.
