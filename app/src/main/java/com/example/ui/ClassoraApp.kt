package com.example.ui

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.ClassoraRepository
import com.example.model.*
import com.example.ui.components.*
import com.example.ui.screens.*
import com.example.ui.theme.*

enum class MainNavTab(val label: String, val icon: ImageVector, val selectedIcon: ImageVector) {
    HOME("Home", Icons.Outlined.Home, Icons.Filled.Home),
    TASKS("Tasks", Icons.Outlined.Assignment, Icons.Filled.Assignment),
    ANALYTICS("Sprint", Icons.Outlined.Analytics, Icons.Filled.Analytics),
    CALENDAR("Calendar", Icons.Outlined.CalendarMonth, Icons.Filled.CalendarMonth),
    CLASS("Class", Icons.Outlined.Groups, Icons.Filled.Groups),
    PROFILE("Profile", Icons.Outlined.Person, Icons.Filled.Person)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ClassoraApp(
    repository: ClassoraRepository = remember { ClassoraRepository() }
) {
    val currentUser by repository.currentUser.collectAsState()
    val assignments by repository.assignments.collectAsState()
    val announcements by repository.announcements.collectAsState()
    val notifications by repository.notifications.collectAsState()
    val members by repository.members.collectAsState()
    val auditLogs by repository.auditLogs.collectAsState()

    var isOnboardingCompleted by remember { mutableStateOf(true) }
    var selectedTab by remember { mutableStateOf(MainNavTab.HOME) }
    var selectedAssignment by remember { mutableStateOf<Assignment?>(null) }
    var showNotificationsSheet by remember { mutableStateOf(false) }
    var showCreateAssignmentDialog by remember { mutableStateOf(false) }
    var showAttachmentDialog by remember { mutableStateOf(false) }
    var showReportDialog by remember { mutableStateOf(false) }
    var showReminderDialog by remember { mutableStateOf(false) }

    val systemDark = isSystemInDarkTheme()
    var isDarkTheme by remember { mutableStateOf(false) } // Default to High Density Crisp Light Canvas

    val unreadNotifCount = notifications.count { !it.isRead }

    ClassoraTheme(darkTheme = isDarkTheme) {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = if (isDarkTheme) NeutralBgDark else NeutralBgLight
        ) {
            if (!isOnboardingCompleted) {
                WelcomeOnboardingScreen(
                    onCompleteOnboarding = { uniName, prog, term, sec ->
                        repository.updateAcademicProfile(uniName, prog, term, sec)
                        isOnboardingCompleted = true
                    }
                )
            } else {
                Scaffold(
                    containerColor = if (isDarkTheme) NeutralBgDark else NeutralBgLight,
                    topBar = {
                        TopAppBar(
                            colors = TopAppBarDefaults.topAppBarColors(
                                containerColor = if (isDarkTheme) SurfaceDark else SurfaceLight
                            ),
                            title = {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    // High Density Indigo Logo Box
                                    Box(
                                        modifier = Modifier
                                            .size(28.dp)
                                            .clip(RoundedCornerShape(6.dp))
                                            .background(HighDensityIndigoPrimary),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = "P",
                                            color = Color.White,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 15.sp
                                        )
                                    }
                                    Column {
                                        Text(
                                            text = "CLASSORA",
                                            style = MaterialTheme.typography.titleMedium.copy(
                                                fontWeight = FontWeight.Bold,
                                                letterSpacing = 0.8.sp,
                                                fontSize = 13.sp
                                            ),
                                            color = TextPrimaryLight
                                        )
                                        Text(
                                            text = "HIGH DENSITY SPRINT & TASK SYSTEM",
                                            style = MaterialTheme.typography.labelSmall.copy(
                                                fontFamily = FontFamily.Monospace,
                                                fontSize = 8.sp,
                                                letterSpacing = 0.5.sp
                                            ),
                                            color = TextTertiaryLight
                                        )
                                    }
                                }
                            },
                            actions = {
                                // Notification Bell with badge
                                IconButton(onClick = { showNotificationsSheet = !showNotificationsSheet }) {
                                    BadgedBox(
                                        badge = {
                                            if (unreadNotifCount > 0) {
                                                Badge(
                                                    containerColor = Color(0xFFEF4444),
                                                    contentColor = Color.White
                                                ) {
                                                    Text(
                                                        text = "$unreadNotifCount",
                                                        fontSize = 9.sp,
                                                        fontFamily = FontFamily.Monospace
                                                    )
                                                }
                                            }
                                        }
                                    ) {
                                        Icon(
                                            imageVector = if (showNotificationsSheet) Icons.Filled.Notifications else Icons.Outlined.Notifications,
                                            contentDescription = "Notifications",
                                            tint = if (showNotificationsSheet) HighDensityIndigoPrimary else Color(0xFF6B7280),
                                            modifier = Modifier.size(20.dp)
                                        )
                                    }
                                }
                            }
                        )
                    },
                    bottomBar = {
                        // High Density Dark Nav Bar (#111827)
                        NavigationBar(
                            containerColor = HighDensityNavDark,
                            tonalElevation = 0.dp,
                            modifier = Modifier.height(56.dp)
                        ) {
                            MainNavTab.values().forEach { tab ->
                                val isSelected = selectedTab == tab && !showNotificationsSheet && selectedAssignment == null
                                NavigationBarItem(
                                    selected = isSelected,
                                    onClick = {
                                        selectedTab = tab
                                        showNotificationsSheet = false
                                        selectedAssignment = null
                                    },
                                    icon = {
                                        Icon(
                                            imageVector = if (isSelected) tab.selectedIcon else tab.icon,
                                            contentDescription = tab.label,
                                            modifier = Modifier.size(18.dp)
                                        )
                                    },
                                    label = {
                                        Text(
                                            text = tab.label,
                                            fontSize = 9.sp,
                                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                        )
                                    },
                                    colors = NavigationBarItemDefaults.colors(
                                        selectedIconColor = HighDensityIndigoLight,
                                        selectedTextColor = HighDensityIndigoLight,
                                        unselectedIconColor = Color(0xFF9CA3AF),
                                        unselectedTextColor = Color(0xFF9CA3AF),
                                        indicatorColor = Color(0xFF1F2937)
                                    )
                                )
                            }
                        }
                    }
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {
                        if (showNotificationsSheet) {
                            NotificationsScreen(
                                notifications = notifications,
                                onNotificationClick = { notif ->
                                    repository.markNotificationRead(notif.id)
                                    if (notif.targetAssignmentId != null) {
                                        val targetAsg = assignments.find { it.id == notif.targetAssignmentId }
                                        if (targetAsg != null) {
                                            selectedAssignment = targetAsg
                                            showNotificationsSheet = false
                                        }
                                    }
                                },
                                onMarkAllRead = { repository.markAllNotificationsRead() }
                            )
                        } else if (selectedAssignment != null) {
                            // Assignment Detail Overlay
                            val asg = assignments.find { it.id == selectedAssignment?.id } ?: selectedAssignment!!
                            AssignmentDetailScreen(
                                assignment = asg,
                                currentUser = currentUser,
                                auditLogs = auditLogs,
                                onBack = { selectedAssignment = null },
                                onToggleCompletion = { repository.toggleAssignmentCompletion(asg.id) },
                                onTogglePin = { repository.togglePinAssignment(asg.id) },
                                onVerifyFaculty = { repository.verifyAssignmentByFaculty(asg.id) },
                                onArchive = { repository.archiveAssignment(asg.id) },
                                onOpenAttachments = { showAttachmentDialog = true },
                                onOpenReport = { showReportDialog = true },
                                onOpenReminderSchedule = { showReminderDialog = true }
                            )
                        } else {
                            when (selectedTab) {
                                MainNavTab.HOME -> {
                                    HomeScreen(
                                        currentUser = currentUser,
                                        assignments = assignments,
                                        announcements = announcements,
                                        onSelectAssignment = { selectedAssignment = it },
                                        onToggleCompletion = { repository.toggleAssignmentCompletion(it) },
                                        onOpenCreateAssignment = { showCreateAssignmentDialog = true },
                                        onOpenAnalytics = { selectedTab = MainNavTab.ANALYTICS },
                                        onOpenAnnouncements = { selectedTab = MainNavTab.CLASS },
                                        onSwitchRole = { repository.switchUserRole(it) }
                                    )
                                }
                                MainNavTab.TASKS -> {
                                    AssignmentsScreen(
                                        assignments = assignments,
                                        currentUser = currentUser,
                                        onSelectAssignment = { selectedAssignment = it },
                                        onToggleCompletion = { repository.toggleAssignmentCompletion(it) },
                                        onOpenCreateAssignment = { showCreateAssignmentDialog = true }
                                    )
                                }
                                MainNavTab.ANALYTICS -> {
                                    SprintAnalyticsScreen(
                                        sprintSummary = repository.getSprintAnalytics(),
                                        assignments = assignments,
                                        onBack = { selectedTab = MainNavTab.HOME }
                                    )
                                }
                                MainNavTab.CALENDAR -> {
                                    CalendarScreen(
                                        assignments = assignments,
                                        onSelectAssignment = { selectedAssignment = it },
                                        onToggleCompletion = { repository.toggleAssignmentCompletion(it) }
                                    )
                                }
                                MainNavTab.CLASS -> {
                                    var classSubTab by remember { mutableIntStateOf(0) }
                                    Column(modifier = Modifier.fillMaxSize()) {
                                        TabRow(
                                            selectedTabIndex = classSubTab,
                                            containerColor = SurfaceLight,
                                            contentColor = HighDensityIndigoPrimary,
                                            modifier = Modifier.height(40.dp)
                                        ) {
                                            Tab(
                                                selected = classSubTab == 0,
                                                onClick = { classSubTab = 0 },
                                                text = {
                                                    Text(
                                                        "Announcements (${announcements.size})",
                                                        fontSize = 11.sp,
                                                        fontWeight = if (classSubTab == 0) FontWeight.Bold else FontWeight.Normal
                                                    )
                                                }
                                            )
                                            Tab(
                                                selected = classSubTab == 1,
                                                onClick = { classSubTab = 1 },
                                                text = {
                                                    Text(
                                                        "Roster (${members.size})",
                                                        fontSize = 11.sp,
                                                        fontWeight = if (classSubTab == 1) FontWeight.Bold else FontWeight.Normal
                                                    )
                                                }
                                            )
                                        }

                                        if (classSubTab == 0) {
                                            AnnouncementsScreen(
                                                announcements = announcements,
                                                currentUser = currentUser,
                                                onPublishAnnouncement = { title, content, priority, attachment ->
                                                    repository.publishAnnouncement(title, content, priority, attachment)
                                                }
                                            )
                                        } else {
                                            ClassManagementScreen(
                                                currentUser = currentUser,
                                                members = members
                                            )
                                        }
                                    }
                                }
                                MainNavTab.PROFILE -> {
                                    ProfileSettingsScreen(
                                        currentUser = currentUser,
                                        isDarkTheme = isDarkTheme,
                                        onToggleTheme = { isDarkTheme = it },
                                        onSwitchRole = { repository.switchUserRole(it) },
                                        onResetOnboarding = { isOnboardingCompleted = false }
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Dialogs
            if (showCreateAssignmentDialog) {
                CreateAssignmentDialog(
                    onDismiss = { showCreateAssignmentDialog = false },
                    onPublish = { title, subject, subjectCode, teacher, deadlineEpochMs, description, instructions, priority, workloadHours, attachments, submissionLink ->
                        showCreateAssignmentDialog = false
                        val created = repository.createAssignment(
                            title, subject, subjectCode, teacher, deadlineEpochMs, description, instructions, priority, workloadHours, attachments, submissionLink
                        )
                        selectedAssignment = created
                    }
                )
            }

            if (showAttachmentDialog && selectedAssignment != null) {
                AttachmentListDialog(
                    attachments = selectedAssignment?.attachments ?: emptyList(),
                    onDismiss = { showAttachmentDialog = false }
                )
            }

            if (showReportDialog && selectedAssignment != null) {
                ReportDialog(
                    assignmentTitle = selectedAssignment?.title ?: "",
                    onDismiss = { showReportDialog = false },
                    onSubmit = { reason, details ->
                        showReportDialog = false
                        repository.submitReport(
                            selectedAssignment?.id ?: "",
                            selectedAssignment?.title ?: "",
                            reason,
                            details
                        )
                    }
                )
            }

            if (showReminderDialog) {
                ReminderScheduleDialog(
                    currentMinutesBefore = selectedAssignment?.reminderMinutesBefore ?: 1440,
                    onDismiss = { showReminderDialog = false },
                    onSave = {
                        showReminderDialog = false
                    }
                )
            }
        }
    }
}
