package com.example.model

import java.util.UUID

enum class UserRole(val displayName: String, val badge: String) {
    STUDENT("Student", "🎓"),
    CR("Class Representative (CR)", "⭐"),
    FACULTY("Faculty / Professor", "🏛️"),
    ADMIN("Department Admin", "🛡️")
}

data class UserProfile(
    val id: String = "usr-1",
    val name: String = "Ayush Sharma",
    val email: String = "ayush.sharma@campus.edu",
    val role: UserRole = UserRole.STUDENT,
    val universityId: String = "uni-1",
    val universityName: String = "Stanford University",
    val campus: String = "Main Campus",
    val department: String = "Computer Science & Engineering",
    val program: String = "B.S. in Computer Science",
    val term: String = "Fall 2026",
    val section: String = "Section A (CS-301)",
    val classCode: String = "STAN-CS301-A",
    val rollNumber: String = "2026-CS-042",
    val reminderPrefDays: List<Int> = listOf(3, 1, 0)
)

data class University(
    val id: String,
    val name: String,
    val shortName: String,
    val country: String,
    val campuses: List<String>,
    val departments: List<String>,
    val programs: List<String>,
    val terms: List<String>,
    val sections: List<String>
)

data class ClassCohort(
    val id: String,
    val universityId: String,
    val universityName: String,
    val program: String,
    val term: String,
    val section: String,
    val code: String,
    val studentCount: Int,
    val activeAssignmentsCount: Int,
    val classRepName: String,
    val facultyAdvisor: String
)

data class ClassMember(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val email: String,
    val role: UserRole,
    val rollNumber: String,
    val joinedDate: String,
    val isVerified: Boolean = true
)
