package com.example.model

import java.util.UUID

enum class Priority(val label: String, val level: Int) {
    LOW("Low", 1),
    NORMAL("Normal", 2),
    HIGH("High Priority", 3),
    CRITICAL("Critical", 4)
}

enum class UrgencyLevel(val label: String, val sortWeight: Int) {
    DUE_TODAY("Due Today", 0),
    DUE_TOMORROW("Due Tomorrow", 1),
    DUE_IN_3_DAYS("Due in 3 Days", 2),
    DUE_IN_7_DAYS("Due in 7 Days", 3),
    UPCOMING("Upcoming", 4),
    OVERDUE("Overdue", -1),
    COMPLETED("Completed", 99)
}

data class AttachmentItem(
    val id: String = UUID.randomUUID().toString(),
    val fileName: String,
    val fileType: String, // PDF, DOCX, SLIDES, ZIP, CODE
    val fileSize: String,
    val downloadUrl: String = ""
)

data class Assignment(
    val id: String = UUID.randomUUID().toString(),
    val classId: String = "cohort-1",
    val title: String,
    val subject: String,
    val subjectCode: String,
    val teacher: String,
    val deadlineEpochMs: Long,
    val description: String,
    val instructions: List<String> = emptyList(),
    val priority: Priority = Priority.NORMAL,
    val estimatedWorkloadHours: Double = 3.0,
    val attachments: List<AttachmentItem> = emptyList(),
    val submissionLink: String = "",
    val createdBy: String = "Class Representative",
    val createdRole: UserRole = UserRole.CR,
    val isVerifiedByFaculty: Boolean = false,
    val isPinned: Boolean = false,
    val isArchived: Boolean = false,
    val createdAtEpochMs: Long = System.currentTimeMillis(),
    val updatedAtEpochMs: Long = System.currentTimeMillis(),
    val isCompleted: Boolean = false,
    val completedAtEpochMs: Long? = null,
    val reminderSet: Boolean = true,
    val reminderMinutesBefore: Int = 1440 // default 1 day
) {
    fun getUrgency(currentTimeMs: Long = System.currentTimeMillis()): UrgencyLevel {
        if (isCompleted) return UrgencyLevel.COMPLETED
        val diffMs = deadlineEpochMs - currentTimeMs
        val diffHours = diffMs / (1000 * 60 * 60)
        val diffDays = diffMs / (1000 * 60 * 60 * 24)

        return when {
            diffMs < 0 -> UrgencyLevel.OVERDUE
            diffHours <= 24 -> UrgencyLevel.DUE_TODAY
            diffHours <= 48 -> UrgencyLevel.DUE_TOMORROW
            diffDays <= 3 -> UrgencyLevel.DUE_IN_3_DAYS
            diffDays <= 7 -> UrgencyLevel.DUE_IN_7_DAYS
            else -> UrgencyLevel.UPCOMING
        }
    }

    fun getRelativeTimeDisplay(currentTimeMs: Long = System.currentTimeMillis()): String {
        if (isCompleted) return "Completed"
        val diffMs = deadlineEpochMs - currentTimeMs
        val diffHours = diffMs / (1000 * 60 * 60)
        val diffDays = (diffMs / (1000 * 60 * 60 * 24)).toInt()

        return when {
            diffMs < 0 -> {
                val overdueDays = (-diffDays).coerceAtLeast(1)
                if (overdueDays == 1) "Overdue by 1 day" else "Overdue by $overdueDays days"
            }
            diffHours < 1 -> {
                val mins = (diffMs / (1000 * 60)).coerceAtLeast(1)
                "Due in $mins mins"
            }
            diffHours < 24 -> "Due in ${diffHours}h"
            diffDays == 1 -> "Due Tomorrow • 11:59 PM"
            diffDays in 2..6 -> "Due in $diffDays days"
            else -> "Due in $diffDays days"
        }
    }
}

data class AuditLogEntry(
    val id: String = UUID.randomUUID().toString(),
    val assignmentId: String,
    val action: String, // "CREATED", "DEADLINE_EXTENDED", "INSTRUCTIONS_UPDATED", "PINNED", "VERIFIED"
    val actorName: String,
    val actorRole: UserRole,
    val timestampFormatted: String,
    val details: String
)

data class ReportSubmission(
    val id: String = UUID.randomUUID().toString(),
    val assignmentId: String,
    val assignmentTitle: String,
    val reporterName: String,
    val reason: String, // "Incorrect Deadline", "Wrong Subject", "Fake Assignment", "Broken Link", "Other"
    val details: String,
    val reportedAt: String,
    val status: String = "Pending Review"
)
