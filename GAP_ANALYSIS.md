# Classora Gap Analysis

**Date:** 2026-08-18  
**Scope:** Universal Academic Architecture vs. Current Prototype

---

## 1. Universal Academic Data Hierarchy (Phase 4 Gap)

| Required Universal Dimension | Prototype State | Production Requirement |
|---|---|---|
| **University Entity** | Mock list (`CU`, `IITD`, `Stanford`, `MIT`, `DU`). | Universal tenant model with customizable naming, country, accreditation, and logo. |
| **Campuses** | Single optional text field. | Optional hierarchy level supporting multi-campus institutions. |
| **Schools / Faculties** | Missing or bundled in text. | Configurable faculty/school grouping (e.g. *Faculty of Arts & Sciences*, *School of Engineering*). |
| **Departments** | Flat branch name. | Department level (e.g. *Department of Computer Science*). |
| **Programs / Degrees** | Fixed text field. | Configurable program models (*BS*, *BA*, *B.Tech*, *M.Sc*, *MBA*, *MD*, *Ph.D.*). |
| **Academic Term / Semester** | "Semester 1-8" assumption in some mock data. | Fully configurable terms: Semesters, Trimesters, Quarters, Blocks, Annual terms. |
| **Class Cohorts / Sections** | Code pattern `CU-CSE4-A`. | Universal configurable naming without hardcoded university prefixes. |

---

## 2. Per-Student Completion & Personalization (Phase 11 Gap)

### Critical Flaw Identified:
In the current implementation:
```typescript
// server/routes.ts
apiRouter.post('/assignments/:id/toggle-complete', (req, res) => {
  target.isCompleted = !target.isCompleted;
  // This overwrites global assignment completion state!
});
```
When a student marks an assignment complete, it marks it complete for all 70+ students in that class.

### Production Solution:
Introduce `assignmentCompletions` collection / store:
```typescript
interface AssignmentCompletion {
  assignmentId: string;
  userId: string;
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
}
```
Assignment completion is joined dynamically per authenticated user.

---

## 3. Role-Based Access Control (RBAC) & Privilege Isolation (Phase 5 Gap)

### Critical Flaw Identified:
`POST /api/profile/role` accepts arbitrary role changes without server-side verification.

### Production Solution:
- Explicit hierarchy: `STUDENT` < `CR` < `FACULTY` < `CLASS_ADMIN` < `UNIVERSITY_ADMIN` < `PLATFORM_ADMIN`.
- Roles are verified against membership records for that specific class/university.
- Faculty verification requires institution-verified badge or admin endorsement.

---

## 4. Deadline Engine & Canonical Timestamps (Phase 9 Gap)

### Current Gap:
- Display strings (`"Tomorrow • 11:59 PM"`) were stored statically.
- Timezone offsets and daylight saving were not dynamically recalculated against client locale.

### Production Solution:
- Store canonical UTC ISO 8601 timestamps (`dueDateISO: string`).
- Deadline Engine dynamically calculates:
  - `Overdue` (diff < 0)
  - `Due Today` (diff <= 24h & same calendar day)
  - `Due Tomorrow` (diff <= 48h & next calendar day)
  - `Due in X days` (diff > 48h)
  - Humanized relative countdown with exact local time formatting.

---

## 5. Security & Rule Hardening (Phases 16 & 17 Gap)

### Current Gap:
`firestore.rules` has open read/write for any signed-in user across all assignments.

### Production Solution:
Hardened rules verifying `request.auth.uid` against class enrollment and role claims.
