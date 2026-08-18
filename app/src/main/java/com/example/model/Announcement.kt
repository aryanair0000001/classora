package com.example.model

import java.util.UUID

enum class AnnouncementPriority(val label: String) {
    IMPORTANT("Urgent Notice"),
    NORMAL("General Update"),
    FACULTY_NOTE("Faculty Memo")
}

data class Announcement(
    val id: String = UUID.randomUUID().toString(),
    val classId: String = "cohort-1",
    val title: String,
    val content: String,
    val authorName: String,
    val authorRole: UserRole,
    val priority: AnnouncementPriority = AnnouncementPriority.NORMAL,
    val isPinned: Boolean = false,
    val publishedAt: String,
    val publishedEpochMs: Long = System.currentTimeMillis(),
    val attachmentName: String? = null,
    val readByCount: Int = 74,
    val totalStudents: Int = 82
)

enum class NotificationType(val title: String, val iconName: String) {
    NEW_ASSIGNMENT("New Assignment Published", "assignment"),
    DEADLINE_WARNING("Deadline Approaching", "warning"),
    DEADLINE_EXTENDED("Deadline Modified", "schedule"),
    FACULTY_VERIFIED("Assignment Verified", "verified"),
    ANNOUNCEMENT("Class Announcement", "campaign"),
    REMINDER("Daily Focus Reminder", "alarm")
}

data class AppNotification(
    val id: String = UUID.randomUUID().toString(),
    val type: NotificationType,
    val title: String,
    val body: String,
    val targetAssignmentId: String? = null,
    val timestamp: String,
    val epochMs: Long = System.currentTimeMillis(),
    val isRead: Boolean = false
)

data class SubjectWorkload(
    val subjectName: String,
    val subjectCode: String,
    val activeTasks: Int,
    val totalEstimatedHours: Double,
    val colorHex: Long
)

data class SprintSummary(
    val sprintName: String = "Academic Sprint W-34 (Fall 2026)",
    val totalTasks: Int,
    val completedTasks: Int,
    val totalHoursAllocated: Double,
    val hoursCompleted: Double,
    val overdueCount: Int,
    val highPriorityCount: Int,
    val daysRemaining: Int = 5,
    val subjectBreakdown: List<SubjectWorkload>
)
