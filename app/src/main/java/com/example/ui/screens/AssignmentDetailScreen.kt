package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.*
import com.example.ui.components.*
import com.example.ui.theme.*
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AssignmentDetailScreen(
    assignment: Assignment,
    currentUser: UserProfile,
    auditLogs: List<AuditLogEntry>,
    onBack: () -> Unit,
    onToggleCompletion: () -> Unit,
    onTogglePin: () -> Unit,
    onVerifyFaculty: () -> Unit,
    onArchive: () -> Unit,
    onOpenAttachments: () -> Unit,
    onOpenReport: () -> Unit,
    onOpenReminderSchedule: () -> Unit,
    modifier: Modifier = Modifier
) {
    val sdf = SimpleDateFormat("EEE, MMM dd, yyyy • hh:mm a", Locale.getDefault())
    val formattedDeadline = sdf.format(Date(assignment.deadlineEpochMs))
    val urgency = assignment.getUrgency()
    val relativeTime = assignment.getRelativeTimeDisplay()

    // Interactive step checking for student
    var checkedSteps by remember { mutableStateOf(setOf<Int>()) }

    var showArchiveConfirm by remember { mutableStateOf(false) }

    if (showArchiveConfirm) {
        AlertDialog(
            onDismissRequest = { showArchiveConfirm = false },
            title = { Text("Archive / Delete Assignment?") },
            text = { Text("Are you sure you want to remove '${assignment.title}'? Students will no longer see this task.") },
            confirmButton = {
                Button(
                    onClick = {
                        showArchiveConfirm = false
                        onArchive()
                        onBack()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE11D48))
                ) {
                    Text("Archive")
                }
            },
            dismissButton = {
                TextButton(onClick = { showArchiveConfirm = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = assignment.subjectCode,
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = onTogglePin) {
                        Icon(
                            imageVector = if (assignment.isPinned) Icons.Default.PushPin else Icons.Outlined.PushPin,
                            contentDescription = "Pin",
                            tint = if (assignment.isPinned) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    IconButton(onClick = onOpenReminderSchedule) {
                        Icon(
                            imageVector = Icons.Default.NotificationsActive,
                            contentDescription = "Reminder",
                            tint = MaterialTheme.colorScheme.primary
                        )
                    }
                    IconButton(onClick = onOpenReport) {
                        Icon(
                            imageVector = Icons.Outlined.Flag,
                            contentDescription = "Report",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            )
        },
        bottomBar = {
            Surface(
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 6.dp,
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.4f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Button(
                        onClick = onToggleCompletion,
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (assignment.isCompleted) Color(0xFF16A34A) else MaterialTheme.colorScheme.primary
                        )
                    ) {
                        Icon(
                            imageVector = if (assignment.isCompleted) Icons.Default.CheckCircle else Icons.Outlined.CheckCircle,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(if (assignment.isCompleted) "Completed ✓" else "Mark Complete")
                    }

                    if (currentUser.role == UserRole.FACULTY && !assignment.isVerifiedByFaculty) {
                        OutlinedButton(
                            onClick = onVerifyFaculty,
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(Icons.Default.Verified, contentDescription = null, tint = Color(0xFF16A34A), modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Verify", color = Color(0xFF16A34A))
                        }
                    }

                    if (currentUser.role == UserRole.CR || currentUser.role == UserRole.FACULTY || currentUser.role == UserRole.ADMIN) {
                        IconButton(
                            onClick = { showArchiveConfirm = true }
                        ) {
                            Icon(Icons.Default.DeleteOutline, contentDescription = "Archive", tint = Color(0xFFE11D48))
                        }
                    }
                }
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Urgency Banner
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = when (urgency) {
                    UrgencyLevel.DUE_TODAY -> UrgencyDueTodayBg
                    UrgencyLevel.DUE_TOMORROW -> UrgencyDueTomorrowBg
                    UrgencyLevel.OVERDUE -> UrgencyOverdueBg
                    UrgencyLevel.COMPLETED -> UrgencyCompletedBg
                    else -> MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.4f)
                },
                border = BorderStroke(1.dp, when (urgency) {
                    UrgencyLevel.DUE_TODAY -> UrgencyDueTodayBorder
                    UrgencyLevel.DUE_TOMORROW -> UrgencyDueTomorrowBorder
                    UrgencyLevel.COMPLETED -> UrgencyCompletedBorder
                    else -> MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)
                }),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                        Text(
                            text = relativeTime.uppercase(),
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, letterSpacing = 0.5.sp),
                            color = when (urgency) {
                                UrgencyLevel.DUE_TODAY -> UrgencyDueTodayText
                                UrgencyLevel.DUE_TOMORROW -> UrgencyDueTomorrowText
                                UrgencyLevel.COMPLETED -> UrgencyCompletedText
                                else -> MaterialTheme.colorScheme.primary
                            }
                        )
                        Text(
                            text = formattedDeadline,
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold)
                        )
                    }

                    UrgencyBadge(urgency = urgency, relativeText = relativeTime)
                }
            }

            // Title & Subject Header
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    SubjectChip(subjectCode = assignment.subjectCode, subjectName = assignment.subject)
                    VerificationBadge(isFacultyVerified = assignment.isVerifiedByFaculty)
                    PriorityBadge(priority = assignment.priority)
                }

                Text(
                    text = assignment.title,
                    style = MaterialTheme.typography.headlineMedium.copy(
                        fontWeight = FontWeight.Bold,
                        textDecoration = if (assignment.isCompleted) TextDecoration.LineThrough else TextDecoration.None
                    )
                )

                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.PersonOutline, contentDescription = null, modifier = Modifier.size(16.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text(
                        text = "Assigned by ${assignment.teacher} (${assignment.createdBy})",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Divider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f))

            // Workload & Effort Estimate
            Surface(
                shape = RoundedCornerShape(10.dp),
                color = MaterialTheme.colorScheme.surface,
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceAround,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Estimated Effort", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text("${assignment.estimatedWorkloadHours} Hours", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
                    }
                    Box(modifier = Modifier.width(1.dp).height(24.dp).background(MaterialTheme.colorScheme.outline.copy(alpha = 0.4f)))
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Target Cohort", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text("Section A (82 students)", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
                    }
                }
            }

            // Description
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text(
                    text = "Description & Objectives",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
                Text(
                    text = assignment.description,
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.85f)
                )
            }

            // Step-by-Step Instructions with interactive checks
            if (assignment.instructions.isNotEmpty()) {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Instructions & Checklist",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                        )
                        Text(
                            text = "${checkedSteps.size}/${assignment.instructions.size} done",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }

                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        assignment.instructions.forEachIndexed { index, step ->
                            val isChecked = checkedSteps.contains(index)
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = if (isChecked) MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f) else MaterialTheme.colorScheme.surface,
                                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.4f)),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        checkedSteps = if (isChecked) checkedSteps - index else checkedSteps + index
                                    }
                            ) {
                                Row(
                                    modifier = Modifier.padding(12.dp),
                                    verticalAlignment = Alignment.Top,
                                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                                ) {
                                    Checkbox(
                                        checked = isChecked,
                                        onCheckedChange = {
                                            checkedSteps = if (isChecked) checkedSteps - index else checkedSteps + index
                                        },
                                        modifier = Modifier.size(20.dp)
                                    )
                                    Text(
                                        text = step,
                                        style = MaterialTheme.typography.bodyMedium.copy(
                                            textDecoration = if (isChecked) TextDecoration.LineThrough else TextDecoration.None
                                        ),
                                        color = if (isChecked) MaterialTheme.colorScheme.onSurfaceVariant else MaterialTheme.colorScheme.onSurface
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Attachments Section
            if (assignment.attachments.isNotEmpty()) {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Course Materials & Files",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                    assignment.attachments.forEach { att ->
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = MaterialTheme.colorScheme.surface,
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(
                                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Icon(Icons.Default.AttachFile, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                                    Column {
                                        Text(att.fileName, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold))
                                        Text("${att.fileType} • ${att.fileSize}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    }
                                }
                                OutlinedButton(
                                    onClick = onOpenAttachments,
                                    shape = RoundedCornerShape(8.dp),
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                ) {
                                    Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(14.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Open", fontSize = 11.sp)
                                }
                            }
                        }
                    }
                }
            }

            // Submission Portal
            if (assignment.submissionLink.isNotBlank()) {
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.3f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.OpenInBrowser, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                            Column {
                                Text("LMS / Submission Portal", style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold))
                                Text(assignment.submissionLink, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.primary)
                            }
                        }
                    }
                }
            }

            // Audit Trail / History
            val relevantLogs = auditLogs.filter { it.assignmentId == assignment.id }
            if (relevantLogs.isNotEmpty()) {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(
                        text = "Audit & Verification History",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                    relevantLogs.forEach { log ->
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(10.dp), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = "${log.actorName} (${log.actorRole.displayName})",
                                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold)
                                    )
                                    Text(log.timestampFormatted, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                                Text(log.details, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }
                    }
                }
            }
        }
    }
}
