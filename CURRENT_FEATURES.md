# Classora — Current Features Inventory

**Date:** 2026-08-18  
**Audit Purpose:** Feature Preservation & Baseline Inventory  

Every feature currently present in the Classora codebase is indexed below to ensure no existing functionality is lost during production hardening.

---

## Feature Inventory & Status Matrix

| Feature | Classification | Description | Current File Location |
|---|---|---|---|
| **Universal Class Selector & Switcher** | `BACKEND_CONNECTED` | Switch active class cohort, browse enrolled cohorts, view class metadata. | `src/components/Header.tsx`, `server/routes.ts` |
| **Academic Assignment List** | `BACKEND_CONNECTED` | View assignments filtered by priority, subject, status, or search query. | `src/App.tsx`, `server/routes.ts` |
| **Interactive Assignment Card** | `BACKEND_CONNECTED` | Displays deadline badge, relative countdown, verification status, priority tags, and quick-action menu. | `src/components/AssignmentCard.tsx` |
| **Assignment Detail Modal** | `BACKEND_CONNECTED` | Comprehensive view with rubric instructions, downloadable attachments, teacher details, and completion toggle. | `src/components/AssignmentDetailModal.tsx` |
| **Create Assignment Flow** | `BACKEND_CONNECTED` | Role-guarded modal for CR/Faculty to create assignments with attachments, rubrics, and deadlines. | `src/components/CreateAssignmentModal.tsx` |
| **Faculty Verification Badge System** | `BACKEND_CONNECTED` | Faculty members can officially verify assignments with rubric criteria; displays verified check badge. | `server/routes.ts`, `src/components/AssignmentCard.tsx` |
| **Assignment Pinning** | `BACKEND_CONNECTED` | CR/Faculty can pin priority assignments to the top of the sprint board. | `server/routes.ts`, `src/components/AssignmentCard.tsx` |
| **Assignment Deletion / Archival** | `BACKEND_CONNECTED` | Role-guarded deletion of assignments with confirmation. | `server/routes.ts`, `src/components/AssignmentCard.tsx` |
| **Global Calendar View** | `IMPLEMENTED` | Interactive monthly calendar grid plotting assignments on their due dates with urgency dots. | `src/components/CalendarView.tsx` |
| **Calendar iCal (.ics) Export** | `BACKEND_CONNECTED` | RFC 5545 compliant `.ics` calendar feed download for Apple Calendar, Outlook, and Google Calendar. | `server/routes.ts`, `src/services/api.ts` |
| **Class Management & Cohort Creation** | `BACKEND_CONNECTED` | Create new class cohorts, generate 6-character join codes, invite students, and view roster. | `src/components/ClassManagementModal.tsx` |
| **Join Class by Code** | `BACKEND_CONNECTED` | Enter class code to enroll in a new cohort. | `src/components/ClassManagementModal.tsx`, `server/routes.ts` |
| **Class Broadcast Notices** | `BACKEND_CONNECTED` | CR/Faculty broadcast announcements with Urgent/Normal priority tags. | `src/components/BroadcastNoticeModal.tsx`, `server/routes.ts` |
| **Realtime Notification Center** | `BACKEND_CONNECTED` | Slide-over drawer showing deadline warnings, new assignment broadcasts, and verification alerts. | `src/components/NotificationsDrawer.tsx` |
| **Sprint Analytics Bar** | `IMPLEMENTED` | Top-level visual metrics showing Total, Due Today, Critical, Completed, and Overdue counts. | `src/App.tsx` |
| **Google Calendar Auto-Sync** | `BACKEND_CONNECTED` | 1-Click sync of all deadlines to Google Calendar with 24h & 1h pop-up reminders via Google Calendar API v3. | `src/services/googleWorkspace.ts`, `src/components/GoogleWorkspaceModal.tsx` |
| **Google Tasks Sync** | `BACKEND_CONNECTED` | Export pending assignments to user's Google Tasks list with due dates via Google Tasks API v1. | `src/services/googleWorkspace.ts`, `src/components/GoogleWorkspaceModal.tsx` |
| **Google Sheets Realtime Export** | `BACKEND_CONNECTED` | Creates a structured Google Spreadsheet populated with assignment rows, status, and teachers via Sheets API v4. | `src/services/googleWorkspace.ts`, `src/components/GoogleWorkspaceModal.tsx` |
| **Google Classroom Course Import** | `BACKEND_CONNECTED` | List enrolled Classroom courses and import active coursework into Classora via Classroom API v1. | `src/services/googleWorkspace.ts`, `src/components/GoogleWorkspaceModal.tsx` |
| **Gmail Direct Deadline Broadcast** | `BACKEND_CONNECTED` | Compose and send email alerts directly from authenticated user Gmail via Gmail API v1. | `src/services/googleWorkspace.ts`, `src/components/GoogleWorkspaceModal.tsx` |
| **Google Meet Instant Study Room** | `BACKEND_CONNECTED` | Generate instant Google Meet space for group study and faculty doubts via Meet API v2. | `src/services/googleWorkspace.ts`, `src/components/GoogleWorkspaceModal.tsx` |
| **Google Drive Backup & File Upload** | `BACKEND_CONNECTED` | Export class schedule backup JSON directly to Google Drive via Drive API v3. | `src/services/googleWorkspace.ts`, `src/components/GoogleWorkspaceModal.tsx` |
| **Google Forms Submissions Generator** | `BACKEND_CONNECTED` | 1-Click creation of Google Form for student homework links and doubts via Forms API v1. | `src/services/googleWorkspace.ts`, `src/components/GoogleWorkspaceModal.tsx` |
| **Google Chat Space Announcements** | `BACKEND_CONNECTED` | Send notifications to Google Chat spaces via Chat API v1. | `src/services/googleWorkspace.ts`, `src/components/GoogleWorkspaceModal.tsx` |
| **Google Contacts Roster Integration** | `BACKEND_CONNECTED` | Search and email classmates via People API v1. | `src/services/googleWorkspace.ts`, `src/components/GoogleWorkspaceModal.tsx` |
| **Firebase Authentication with Google Popup** | `IMPLEMENTED` | Google Sign-In with OAuth token acquisition for Google Workspace APIs. | `src/services/firebase.ts` |
| **Android Jetpack Compose Native App** | `PARTIALLY_IMPLEMENTED` | Native Android application with Jetpack Compose screens, Material 3 theme, and Room DB models. | `app/src/main/java/com/example/*` |
| **Confetti Celebration Animation** | `IMPLEMENTED` | Canvas confetti particle burst upon completing assignments. | `src/App.tsx`, `canvas-confetti` |
| **Global Search & Multi-Filter Bar** | `IMPLEMENTED` | Filter assignments by Search text, Priority, Subject, and Status (All / Active / Completed / Overdue). | `src/App.tsx`, `src/components/Header.tsx` |

---

## Preservation Directive

All the features above MUST be preserved and enhanced. Zero features will be deleted or degraded during the hardening process.
