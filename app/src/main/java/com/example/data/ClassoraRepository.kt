package com.example.data

import com.example.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

class ClassoraRepository {

    private val _currentUser = MutableStateFlow(UserProfile())
    val currentUser: StateFlow<UserProfile> = _currentUser.asStateFlow()

    private val _assignments = MutableStateFlow(SampleData.createInitialAssignments())
    val assignments: StateFlow<List<Assignment>> = _assignments.asStateFlow()

    private val _announcements = MutableStateFlow(SampleData.createInitialAnnouncements())
    val announcements: StateFlow<List<Announcement>> = _announcements.asStateFlow()

    private val _notifications = MutableStateFlow(SampleData.createInitialNotifications())
    val notifications: StateFlow<List<AppNotification>> = _notifications.asStateFlow()

    private val _members = MutableStateFlow(SampleData.createInitialMembers())
    val members: StateFlow<List<ClassMember>> = _members.asStateFlow()

    private val _auditLogs = MutableStateFlow(SampleData.createInitialAuditLogs())
    val auditLogs: StateFlow<List<AuditLogEntry>> = _auditLogs.asStateFlow()

    private val _reports = MutableStateFlow<List<ReportSubmission>>(emptyList())
    val reports: StateFlow<List<ReportSubmission>> = _reports.asStateFlow()

    private val _isOffline = MutableStateFlow(false)
    val isOffline: StateFlow<Boolean> = _isOffline.asStateFlow()

    // Switch Role (for testing & role-based UX inspection)
    fun switchUserRole(role: UserRole) {
        _currentUser.value = _currentUser.value.copy(
            role = role,
            name = when (role) {
                UserRole.STUDENT -> "Ayush Sharma"
                UserRole.CR -> "Ayush Sharma (CR)"
                UserRole.FACULTY -> "Dr. David Malan"
                UserRole.ADMIN -> "Dean of Academic Affairs"
            }
        )
    }

    // Toggle Assignment Completion
    fun toggleAssignmentCompletion(assignmentId: String) {
        val now = System.currentTimeMillis()
        _assignments.value = _assignments.value.map { asg ->
            if (asg.id == assignmentId) {
                val newStatus = !asg.isCompleted
                asg.copy(
                    isCompleted = newStatus,
                    completedAtEpochMs = if (newStatus) now else null
                )
            } else {
                asg
            }
        }
    }

    // Create New Assignment (CR / Faculty)
    fun createAssignment(
        title: String,
        subject: String,
        subjectCode: String,
        teacher: String,
        deadlineEpochMs: Long,
        description: String,
        instructions: List<String>,
        priority: Priority,
        workloadHours: Double,
        attachments: List<AttachmentItem>,
        submissionLink: String
    ): Assignment {
        val user = _currentUser.value
        val newAsg = Assignment(
            id = "asg-${UUID.randomUUID().toString().take(8)}",
            classId = "cohort-1",
            title = title,
            subject = subject,
            subjectCode = subjectCode,
            teacher = teacher,
            deadlineEpochMs = deadlineEpochMs,
            description = description,
            instructions = instructions,
            priority = priority,
            estimatedWorkloadHours = workloadHours,
            attachments = attachments,
            submissionLink = submissionLink,
            createdBy = user.name,
            createdRole = user.role,
            isVerifiedByFaculty = user.role == UserRole.FACULTY,
            isPinned = false,
            isCompleted = false
        )

        _assignments.value = listOf(newAsg) + _assignments.value

        // Record Audit Log
        val sdf = SimpleDateFormat("MMM dd, yyyy • hh:mm a", Locale.getDefault())
        val log = AuditLogEntry(
            assignmentId = newAsg.id,
            action = "CREATED",
            actorName = user.name,
            actorRole = user.role,
            timestampFormatted = sdf.format(Date()),
            details = "Published assignment '$title' to Section with deadline ${sdf.format(Date(deadlineEpochMs))}."
        )
        _auditLogs.value = listOf(log) + _auditLogs.value

        // Push App Notification
        val notif = AppNotification(
            type = NotificationType.NEW_ASSIGNMENT,
            title = "New Assignment: $title",
            body = "$subject: $title was published by ${user.name}.",
            targetAssignmentId = newAsg.id,
            timestamp = "Just now"
        )
        _notifications.value = listOf(notif) + _notifications.value

        return newAsg
    }

    // Edit Assignment
    fun updateAssignment(
        assignmentId: String,
        title: String,
        subject: String,
        teacher: String,
        deadlineEpochMs: Long,
        description: String,
        priority: Priority
    ) {
        val user = _currentUser.value
        val sdf = SimpleDateFormat("MMM dd, yyyy • hh:mm a", Locale.getDefault())

        _assignments.value = _assignments.value.map { asg ->
            if (asg.id == assignmentId) {
                asg.copy(
                    title = title,
                    subject = subject,
                    teacher = teacher,
                    deadlineEpochMs = deadlineEpochMs,
                    description = description,
                    priority = priority,
                    updatedAtEpochMs = System.currentTimeMillis()
                )
            } else {
                asg
            }
        }

        val log = AuditLogEntry(
            assignmentId = assignmentId,
            action = "EDITED",
            actorName = user.name,
            actorRole = user.role,
            timestampFormatted = sdf.format(Date()),
            details = "Updated assignment metadata and deadline."
        )
        _auditLogs.value = listOf(log) + _auditLogs.value
    }

    // Toggle Pin Assignment
    fun togglePinAssignment(assignmentId: String) {
        _assignments.value = _assignments.value.map { asg ->
            if (asg.id == assignmentId) {
                asg.copy(isPinned = !asg.isPinned)
            } else {
                asg
            }
        }
    }

    // Verify Assignment by Faculty
    fun verifyAssignmentByFaculty(assignmentId: String) {
        val user = _currentUser.value
        val sdf = SimpleDateFormat("MMM dd, yyyy • hh:mm a", Locale.getDefault())

        _assignments.value = _assignments.value.map { asg ->
            if (asg.id == assignmentId) {
                asg.copy(isVerifiedByFaculty = true)
            } else {
                asg
            }
        }

        val log = AuditLogEntry(
            assignmentId = assignmentId,
            action = "VERIFIED_BY_FACULTY",
            actorName = user.name,
            actorRole = user.role,
            timestampFormatted = sdf.format(Date()),
            details = "Officially verified assignment requirements."
        )
        _auditLogs.value = listOf(log) + _auditLogs.value

        val notif = AppNotification(
            type = NotificationType.FACULTY_VERIFIED,
            title = "Assignment Verified",
            body = "Verified by ${user.name}",
            targetAssignmentId = assignmentId,
            timestamp = "Just now"
        )
        _notifications.value = listOf(notif) + _notifications.value
    }

    // Archive / Delete Assignment
    fun archiveAssignment(assignmentId: String) {
        _assignments.value = _assignments.value.filterNot { it.id == assignmentId }
    }

    // Publish Announcement
    fun publishAnnouncement(
        title: String,
        content: String,
        priority: AnnouncementPriority,
        attachmentName: String?
    ) {
        val user = _currentUser.value
        val sdf = SimpleDateFormat("Today • hh:mm a", Locale.getDefault())
        val ann = Announcement(
            title = title,
            content = content,
            authorName = user.name,
            authorRole = user.role,
            priority = priority,
            isPinned = priority == AnnouncementPriority.IMPORTANT,
            publishedAt = sdf.format(Date()),
            attachmentName = attachmentName,
            readByCount = 1,
            totalStudents = 82
        )
        _announcements.value = listOf(ann) + _announcements.value

        val notif = AppNotification(
            type = NotificationType.ANNOUNCEMENT,
            title = "Announcement: $title",
            body = content.take(90) + if (content.length > 90) "..." else "",
            timestamp = "Just now"
        )
        _notifications.value = listOf(notif) + _notifications.value
    }

    // Submit Trust & Safety Report
    fun submitReport(assignmentId: String, assignmentTitle: String, reason: String, details: String) {
        val user = _currentUser.value
        val sdf = SimpleDateFormat("MMM dd, yyyy • hh:mm a", Locale.getDefault())
        val rep = ReportSubmission(
            assignmentId = assignmentId,
            assignmentTitle = assignmentTitle,
            reporterName = user.name,
            reason = reason,
            details = details,
            reportedAt = sdf.format(Date())
        )
        _reports.value = listOf(rep) + _reports.value
    }

    // Mark Notification Read
    fun markNotificationRead(notifId: String) {
        _notifications.value = _notifications.value.map {
            if (it.id == notifId) it.copy(isRead = true) else it
        }
    }

    fun markAllNotificationsRead() {
        _notifications.value = _notifications.value.map { it.copy(isRead = true) }
    }

    // Update University / Academic Profile
    fun updateAcademicProfile(
        universityName: String,
        program: String,
        term: String,
        section: String
    ) {
        _currentUser.value = _currentUser.value.copy(
            universityName = universityName,
            program = program,
            term = term,
            section = section
        )
    }

    // Calculate Sprint & Workload Analytics
    fun getSprintAnalytics(): SprintSummary {
        val list = _assignments.value
        val totalTasks = list.size
        val completedTasks = list.count { it.isCompleted }
        val totalHours = list.sumOf { it.estimatedWorkloadHours }
        val completedHours = list.filter { it.isCompleted }.sumOf { it.estimatedWorkloadHours }
        val overdueCount = list.count { it.getUrgency() == UrgencyLevel.OVERDUE }
        val highPriorityCount = list.count { it.priority == Priority.HIGH && !it.isCompleted }

        // Group by subject
        val subjectColors = mapOf(
            "CS-301" to 0xFF4F46E5, // Indigo
            "CS-304" to 0xFF0D9488, // Teal
            "MATH-220" to 0xFFD97706, // Amber
            "CS-324" to 0xFF9333EA, // Purple
            "CS-315" to 0xFF2563EB, // Blue
            "CS-350" to 0xFFE11D48  // Rose
        )

        val subjectMap = list.groupBy { it.subjectCode }
        val breakdowns = subjectMap.map { (code, asgs) ->
            SubjectWorkload(
                subjectName = asgs.first().subject,
                subjectCode = code,
                activeTasks = asgs.count { !it.isCompleted },
                totalEstimatedHours = asgs.sumOf { it.estimatedWorkloadHours },
                colorHex = subjectColors[code] ?: 0xFF6366F1
            )
        }.sortedByDescending { it.totalEstimatedHours }

        return SprintSummary(
            totalTasks = totalTasks,
            completedTasks = completedTasks,
            totalHoursAllocated = totalHours,
            hoursCompleted = completedHours,
            overdueCount = overdueCount,
            highPriorityCount = highPriorityCount,
            subjectBreakdown = breakdowns
        )
    }
}
