package com.example.data

import com.example.model.*
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object SampleData {

    val universities = listOf(
        University(
            id = "uni-1",
            name = "Stanford University",
            shortName = "Stanford",
            country = "United States",
            campuses = listOf("Main Campus (Stanford, CA)", "Redwood City"),
            departments = listOf("Computer Science", "Electrical Engineering", "Mathematics", "Physics", "Bioengineering"),
            programs = listOf("B.S. Computer Science", "M.S. Artificial Intelligence", "B.S. Software Systems"),
            terms = listOf("Fall 2026", "Winter 2027", "Spring 2027"),
            sections = listOf("Section A (CS-301)", "Section B (CS-301)", "Honors Cohort")
        ),
        University(
            id = "uni-2",
            name = "Massachusetts Institute of Technology",
            shortName = "MIT",
            country = "United States",
            campuses = listOf("Cambridge Campus"),
            departments = listOf("EECS (Course 6)", "Mathematics (Course 18)", "Mechanical Eng (Course 2)"),
            programs = listOf("6-3: Computer Science & Engineering", "6-4: AI and Decision Making"),
            terms = listOf("Fall Term 2026", "Spring Term 2027"),
            sections = listOf("Recitation 01", "Recitation 02", "Lab Section Alpha")
        ),
        University(
            id = "uni-3",
            name = "University of Oxford",
            shortName = "Oxford",
            country = "United Kingdom",
            campuses = listOf("Main Campus, Oxford"),
            departments = listOf("Department of Computer Science", "Mathematical Institute"),
            programs = listOf("BA in Computer Science", "MSc in Advanced Computer Science"),
            terms = listOf("Michaelmas Term 2026", "Hilary Term 2027", "Trinity Term 2027"),
            sections = listOf("Group 1 (Balliol & Trinity)", "Group 2 (St John's & Merton)")
        ),
        University(
            id = "uni-4",
            name = "National University of Singapore",
            shortName = "NUS",
            country = "Singapore",
            campuses = listOf("Kent Ridge Campus"),
            departments = listOf("School of Computing", "Department of Information Systems"),
            programs = listOf("Bachelor of Computing (CS)", "Bachelor of Computing (IS)"),
            terms = listOf("Semester 1 AY2026/27", "Semester 2 AY2026/27"),
            sections = listOf("Tutorial Group T04", "Lab Group L02")
        ),
        University(
            id = "uni-5",
            name = "Chandigarh University",
            shortName = "CU",
            country = "India",
            campuses = listOf("Main Campus (Mohali)"),
            departments = listOf("Apex Institute of Technology (AIT-CSE)", "Department of Computer Applications"),
            programs = listOf("B.Tech Computer Science & Eng (CSE)", "B.Tech AI & Data Science"),
            terms = listOf("Semester 5 (Autumn 2026)", "Semester 6 (Spring 2027)"),
            sections = listOf("Section 22CSE-A", "Section 22CSE-B", "Section 22AIML-1")
        )
    )

    fun createInitialAssignments(): List<Assignment> {
        val now = System.currentTimeMillis()
        val oneHour = 3600 * 1000L
        val oneDay = 24 * oneHour

        return listOf(
            Assignment(
                id = "asg-1",
                classId = "cohort-1",
                title = "Red-Black Trees & B-Tree Indexing Implementation",
                subject = "Data Structures & Algorithms",
                subjectCode = "CS-301",
                teacher = "Dr. David Malan",
                deadlineEpochMs = now + (5 * oneHour), // 5 hours from now (Due Today)
                description = "Implement an in-memory balanced Red-Black Tree in C++/Java with full insert, rotation, and balance validation test suite. Benchmark against standard library map.",
                instructions = listOf(
                    "1. Clone the starter repository from GitHub Classroom repository link.",
                    "2. Implement leftRotate(), rightRotate(), and fixViolation() balancing invariants.",
                    "3. Run test suites: ./gradlew test or ctest --verbose to verify O(log N) lookup guarantees.",
                    "4. Submit the tar.gz containing your src/ and report.pdf with performance graphs."
                ),
                priority = Priority.HIGH,
                estimatedWorkloadHours = 4.5,
                attachments = listOf(
                    AttachmentItem("att-1", "RB_Tree_Starter_Spec.pdf", "PDF", "1.8 MB"),
                    AttachmentItem("att-2", "benchmark_dataset.csv", "CODE", "4.2 MB")
                ),
                submissionLink = "https://gradescope.com/courses/cs301/assignments/rb-tree",
                createdBy = "Ayush Sharma (CR)",
                createdRole = UserRole.CR,
                isVerifiedByFaculty = true,
                isPinned = true,
                isCompleted = false
            ),
            Assignment(
                id = "asg-2",
                classId = "cohort-1",
                title = "Virtual Memory Paging & LRU Cache Simulator",
                subject = "Operating Systems",
                subjectCode = "CS-304",
                teacher = "Prof. John Ousterhout",
                deadlineEpochMs = now + (28 * oneHour), // Due Tomorrow (~1.1 days)
                description = "Simulate 32-bit two-level page table translation with TLB caching and LRU page replacement algorithm under heavy randomized memory access traces.",
                instructions = listOf(
                    "1. Construct PageDirectory and PageTable structures supporting 4KB page frames.",
                    "2. Implement TLB with 64 entries and Least Recently Used replacement policy.",
                    "3. Calculate TLB Hit Ratio and Page Fault Frequency on memory_trace_large.bin.",
                    "4. Ensure thread-safety for multi-threaded memory access simulator."
                ),
                priority = Priority.HIGH,
                estimatedWorkloadHours = 6.0,
                attachments = listOf(
                    AttachmentItem("att-3", "OS_Lab2_VirtualMemory.pdf", "PDF", "2.4 MB"),
                    AttachmentItem("att-4", "test_traces_bin.zip", "ZIP", "12.5 MB")
                ),
                submissionLink = "https://canvas.stanford.edu/courses/os304/assignments",
                createdBy = "Prof. John Ousterhout",
                createdRole = UserRole.FACULTY,
                isVerifiedByFaculty = true,
                isPinned = true,
                isCompleted = false
            ),
            Assignment(
                id = "asg-3",
                classId = "cohort-1",
                title = "Problem Set 4: SVD, Eigendecomposition & PCA",
                subject = "Linear Algebra for ML",
                subjectCode = "MATH-220",
                teacher = "Dr. Gilbert Strang",
                deadlineEpochMs = now + (3 * oneDay) + (4 * oneHour), // Due in 3 days
                description = "Analytical problem set covering Singular Value Decomposition, Principal Component Analysis for dimensionality reduction, and spectral graph theory.",
                instructions = listOf(
                    "1. Complete theoretical derivations for Problems 1 through 6.",
                    "2. Complete Python Jupyter notebook for image compression using Top-K singular values.",
                    "3. Typeset LaTeX solutions and export PDF as Firstname_Lastname_PS4.pdf."
                ),
                priority = Priority.NORMAL,
                estimatedWorkloadHours = 3.5,
                attachments = listOf(
                    AttachmentItem("att-5", "MATH220_ProblemSet4.pdf", "PDF", "920 KB"),
                    AttachmentItem("att-6", "pca_starter_notebook.ipynb", "CODE", "150 KB")
                ),
                submissionLink = "https://gradescope.com/courses/math220/ps4",
                createdBy = "Sarah Jenkins (CR)",
                createdRole = UserRole.CR,
                isVerifiedByFaculty = true,
                isPinned = false,
                isCompleted = false
            ),
            Assignment(
                id = "asg-4",
                classId = "cohort-1",
                title = "Transformer Multi-Head Attention from Scratch (PyTorch)",
                subject = "Deep Learning & Neural Networks",
                subjectCode = "CS-324",
                teacher = "Dr. Andrew Ng",
                deadlineEpochMs = now + (6 * oneDay), // Due in 6 days
                description = "Build the scaled dot-product self-attention mechanism, multi-head projections, and causal masking layer for a mini GPT architecture without using nn.MultiheadAttention.",
                instructions = listOf(
                    "1. Implement ScaledDotProductAttention module with tensor dimension validation.",
                    "2. Implement MultiHeadAttention with query, key, value linear projections.",
                    "3. Add rotary position embeddings (RoPE) and test on Shakespeare character prediction.",
                    "4. Submit code zip + Weights & Biases training loss convergence plot."
                ),
                priority = Priority.NORMAL,
                estimatedWorkloadHours = 5.0,
                attachments = listOf(
                    AttachmentItem("att-7", "Transformer_Assignment_Guide.pdf", "PDF", "3.1 MB"),
                    AttachmentItem("att-8", "attention_math_cheatsheet.pdf", "PDF", "800 KB")
                ),
                submissionLink = "https://classroom.github.com/a/dl324-attention",
                createdBy = "Dr. Andrew Ng",
                createdRole = UserRole.FACULTY,
                isVerifiedByFaculty = true,
                isPinned = false,
                isCompleted = false
            ),
            Assignment(
                id = "asg-5",
                classId = "cohort-1",
                title = "3NF / BCNF Schema Normalization & Query Optimizer",
                subject = "Database Systems",
                subjectCode = "CS-315",
                teacher = "Prof. Jennifer Widom",
                deadlineEpochMs = now - (2 * oneDay), // Completed 2 days ago
                description = "Given a legacy un-normalized university enrollment dataset, derive functional dependencies, decompose to Boyce-Codd Normal Form, and write indexed SQL queries.",
                instructions = listOf(
                    "1. Compute minimal canonical cover for the given functional dependency set.",
                    "2. Prove lossless join and dependency preservation properties.",
                    "3. Write PostgreSQL DDL scripts and optimize query with EXPLAIN ANALYZE."
                ),
                priority = Priority.NORMAL,
                estimatedWorkloadHours = 3.0,
                attachments = listOf(
                    AttachmentItem("att-9", "CS315_DBMS_Lab1.pdf", "PDF", "1.2 MB")
                ),
                submissionLink = "https://gradescope.com/courses/cs315",
                createdBy = "Ayush Sharma (CR)",
                createdRole = UserRole.CR,
                isVerifiedByFaculty = true,
                isPinned = false,
                isCompleted = true,
                completedAtEpochMs = now - (2 * oneDay) + 3600000
            ),
            Assignment(
                id = "asg-6",
                classId = "cohort-1",
                title = "Microservices CI/CD Pipeline & REST API Architecture",
                subject = "Software Engineering",
                subjectCode = "CS-350",
                teacher = "Dr. Martin Fowler",
                deadlineEpochMs = now - (1 * oneDay), // Overdue by 1 day (if not completed)
                description = "Design a Dockerized backend service with automated GitHub Actions linting, unit testing, and Docker Hub image build on every pull request merge.",
                instructions = listOf(
                    "1. Write clean REST API endpoints with input validation and OpenAPI/Swagger docs.",
                    "2. Configure .github/workflows/ci.yml with test coverage gates > 85%.",
                    "3. Deploy staging instance and verify healthcheck endpoint."
                ),
                priority = Priority.HIGH,
                estimatedWorkloadHours = 4.0,
                attachments = listOf(
                    AttachmentItem("att-10", "Software_Eng_Milestone2.pdf", "PDF", "1.5 MB")
                ),
                submissionLink = "https://github.com/orgs/cs350-fall26",
                createdBy = "Dr. Martin Fowler",
                createdRole = UserRole.FACULTY,
                isVerifiedByFaculty = true,
                isPinned = false,
                isCompleted = false
            )
        )
    }

    fun createInitialAnnouncements(): List<Announcement> {
        return listOf(
            Announcement(
                id = "ann-1",
                classId = "cohort-1",
                title = "Midterm Examination Schedule & Syllabus Breakdown Announced",
                content = "Midterm exams will commence from October 12th. CS-301 (Data Structures) and CS-304 (Operating Systems) review sessions will be conducted this Thursday at 5:00 PM in Room 104 and live on Zoom.",
                authorName = "Dr. David Malan",
                authorRole = UserRole.FACULTY,
                priority = AnnouncementPriority.IMPORTANT,
                isPinned = true,
                publishedAt = "Today • 9:30 AM",
                attachmentName = "Midterm_Schedule_Fall2026.pdf",
                readByCount = 78,
                totalStudents = 82
            ),
            Announcement(
                id = "ann-2",
                classId = "cohort-1",
                title = "Lab 2 VM Simulator Submission Deadline Clarification",
                content = "Reminder: Please ensure your LRU replacement simulator passes test_trace_3.bin before submitting on Gradescope. Autograder timeout has been increased to 90 seconds.",
                authorName = "Ayush Sharma (CR)",
                authorRole = UserRole.CR,
                priority = AnnouncementPriority.NORMAL,
                isPinned = false,
                publishedAt = "Yesterday • 4:15 PM",
                attachmentName = null,
                readByCount = 81,
                totalStudents = 82
            ),
            Announcement(
                id = "ann-3",
                classId = "cohort-1",
                title = "Guest Lecture: Scaling Distributed Systems at Google",
                content = "We have a guest keynote by Principal Systems Architect this Friday in Turing Auditorium. Attendance is optional but strongly recommended for CS-304 students.",
                authorName = "Prof. John Ousterhout",
                authorRole = UserRole.FACULTY,
                priority = AnnouncementPriority.FACULTY_NOTE,
                isPinned = false,
                publishedAt = "2 days ago",
                attachmentName = "Guest_Lecture_Flyer.pdf",
                readByCount = 65,
                totalStudents = 82
            )
        )
    }

    fun createInitialNotifications(): List<AppNotification> {
        return listOf(
            AppNotification(
                id = "notif-1",
                type = NotificationType.DEADLINE_WARNING,
                title = "Urgent: Due in 5 Hours!",
                body = "Data Structures: Red-Black Trees & B-Tree Indexing Implementation is due today at 11:59 PM.",
                targetAssignmentId = "asg-1",
                timestamp = "10 mins ago"
            ),
            AppNotification(
                id = "notif-2",
                type = NotificationType.ANNOUNCEMENT,
                title = "Midterm Examination Schedule Released",
                body = "Dr. David Malan pinned a critical announcement regarding Fall 2026 midterm examination dates.",
                timestamp = "2 hours ago"
            ),
            AppNotification(
                id = "notif-3",
                type = NotificationType.FACULTY_VERIFIED,
                title = "Assignment Verified by Faculty",
                body = "Prof. John Ousterhout officially verified Operating Systems Virtual Memory Paging Lab.",
                targetAssignmentId = "asg-2",
                timestamp = "Yesterday"
            ),
            AppNotification(
                id = "notif-4",
                type = NotificationType.NEW_ASSIGNMENT,
                title = "New Assignment Added",
                body = "Deep Learning: Transformer Attention Mechanism has been published with 6 days remaining.",
                targetAssignmentId = "asg-4",
                timestamp = "2 days ago"
            )
        )
    }

    fun createInitialMembers(): List<ClassMember> {
        return listOf(
            ClassMember("m-1", "Ayush Sharma", "ayush.sharma@campus.edu", UserRole.CR, "2026-CS-042", "Aug 15, 2026", true),
            ClassMember("m-2", "Dr. David Malan", "d.malan@campus.edu", UserRole.FACULTY, "FAC-881", "Aug 01, 2026", true),
            ClassMember("m-3", "Prof. John Ousterhout", "ousterhout@campus.edu", UserRole.FACULTY, "FAC-710", "Aug 01, 2026", true),
            ClassMember("m-4", "Sarah Jenkins", "s.jenkins@campus.edu", UserRole.CR, "2026-CS-018", "Aug 15, 2026", true),
            ClassMember("m-5", "Rohan Gupta", "rohan.g@campus.edu", UserRole.STUDENT, "2026-CS-088", "Aug 18, 2026", true),
            ClassMember("m-6", "Elena Rostova", "e.rostova@campus.edu", UserRole.STUDENT, "2026-CS-055", "Aug 18, 2026", true),
            ClassMember("m-7", "Marcus Chen", "m.chen@campus.edu", UserRole.STUDENT, "2026-CS-023", "Aug 19, 2026", true),
            ClassMember("m-8", "Amina Al-Mansoor", "a.mansoor@campus.edu", UserRole.STUDENT, "2026-CS-091", "Aug 19, 2026", true)
        )
    }

    fun createInitialAuditLogs(): List<AuditLogEntry> {
        return listOf(
            AuditLogEntry(
                id = "aud-1",
                assignmentId = "asg-1",
                action = "VERIFIED_BY_FACULTY",
                actorName = "Dr. David Malan",
                actorRole = UserRole.FACULTY,
                timestampFormatted = "Aug 18, 2026 • 10:15 AM",
                details = "Faculty verified assignment requirements and confirmed Gradescope auto-grader rubrics."
            ),
            AuditLogEntry(
                id = "aud-2",
                assignmentId = "asg-1",
                action = "CREATED",
                actorName = "Ayush Sharma (CR)",
                actorRole = UserRole.CR,
                timestampFormatted = "Aug 17, 2026 • 02:40 PM",
                details = "Created assignment with 2 starter attachments and deadline set to Aug 18."
            ),
            AuditLogEntry(
                id = "aud-3",
                assignmentId = "asg-2",
                action = "DEADLINE_EXTENDED",
                actorName = "Prof. John Ousterhout",
                actorRole = UserRole.FACULTY,
                timestampFormatted = "Aug 17, 2026 • 06:00 PM",
                details = "Extended deadline by 12 hours due to cluster maintenance."
            )
        )
    }
}
