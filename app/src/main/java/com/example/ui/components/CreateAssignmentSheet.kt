package com.example.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.model.AttachmentItem
import com.example.model.Priority

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreateAssignmentDialog(
    onDismiss: () -> Unit,
    onPublish: (
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
    ) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var subject by remember { mutableStateOf("Data Structures & Algorithms") }
    var subjectCode by remember { mutableStateOf("CS-301") }
    var teacher by remember { mutableStateOf("Dr. David Malan") }
    var description by remember { mutableStateOf("") }
    var instructionText by remember { mutableStateOf("1. Read the specification\n2. Implement the required functions\n3. Run all unit tests\n4. Submit on the platform") }
    var priority by remember { mutableStateOf(Priority.NORMAL) }
    var workloadHours by remember { mutableDoubleStateOf(3.0) }
    var submissionLink by remember { mutableStateOf("https://gradescope.com/courses") }
    var daysUntilDeadline by remember { mutableIntStateOf(3) }

    var showConfirmation by remember { mutableStateOf(false) }
    var validationError by remember { mutableStateOf<String?>(null) }

    val subjects = listOf(
        Pair("Data Structures & Algorithms", "CS-301"),
        Pair("Operating Systems", "CS-304"),
        Pair("Linear Algebra for ML", "MATH-220"),
        Pair("Deep Learning & Neural Networks", "CS-324"),
        Pair("Database Systems", "CS-315"),
        Pair("Software Engineering", "CS-350")
    )

    if (showConfirmation) {
        AlertDialog(
            onDismissRequest = { showConfirmation = false },
            title = {
                Text(
                    text = "Publish Assignment to Class?",
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold)
                )
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "This will publish '$title' to all 82 students in Section A.",
                        style = MaterialTheme.typography.bodyMedium
                    )
                    Text(
                        text = "Students will immediately receive deadline countdowns and push notification reminders.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        showConfirmation = false
                        val deadlineMs = System.currentTimeMillis() + (daysUntilDeadline * 24 * 3600 * 1000L)
                        val instructionsList = instructionText.lines().filter { it.isNotBlank() }
                        val sampleAttachments = listOf(
                            AttachmentItem(fileName = "${title.take(15).replace(" ", "_")}_Spec.pdf", fileType = "PDF", fileSize = "1.5 MB")
                        )
                        onPublish(
                            title.trim(),
                            subject,
                            subjectCode,
                            teacher,
                            deadlineMs,
                            description.trim(),
                            instructionsList,
                            priority,
                            workloadHours,
                            sampleAttachments,
                            submissionLink.trim()
                        )
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                ) {
                    Text("Confirm & Publish")
                }
            },
            dismissButton = {
                TextButton(onClick = { showConfirmation = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.9f),
            shape = RoundedCornerShape(16.dp),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 6.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.AddCircleOutline,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary
                        )
                        Text(
                            text = "New Class Assignment",
                            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold)
                        )
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close")
                    }
                }

                Divider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f))

                // Scrollable Form
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    if (validationError != null) {
                        Surface(
                            color = Color(0xFFFEE2E2),
                            shape = RoundedCornerShape(8.dp),
                            border = BorderStroke(1.dp, Color(0xFFFCA5A5))
                        ) {
                            Text(
                                text = validationError ?: "",
                                color = Color(0xFF991B1B),
                                style = MaterialTheme.typography.bodySmall,
                                modifier = Modifier.padding(10.dp)
                            )
                        }
                    }

                    // Title
                    OutlinedTextField(
                        value = title,
                        onValueChange = {
                            title = it
                            validationError = null
                        },
                        label = { Text("Assignment Title *") },
                        placeholder = { Text("e.g., Lab 3: Memory Paging Simulator") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        shape = RoundedCornerShape(10.dp)
                    )

                    // Subject Selector
                    Text(
                        text = "Subject & Course *",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        subjects.take(3).forEach { (sName, sCode) ->
                            val isSelected = subjectCode == sCode
                            FilterChip(
                                selected = isSelected,
                                onClick = {
                                    subject = sName
                                    subjectCode = sCode
                                },
                                label = { Text(sCode, fontSize = 12.sp) }
                            )
                        }
                    }

                    // Faculty / Teacher
                    OutlinedTextField(
                        value = teacher,
                        onValueChange = { teacher = it },
                        label = { Text("Faculty / Instructor Name *") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        shape = RoundedCornerShape(10.dp)
                    )

                    // Deadline Days Slider
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "Deadline Timing",
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                text = when (daysUntilDeadline) {
                                    0 -> "Due Today (11:59 PM)"
                                    1 -> "Due Tomorrow (11:59 PM)"
                                    else -> "Due in $daysUntilDeadline days"
                                },
                                style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                        Slider(
                            value = daysUntilDeadline.toFloat(),
                            onValueChange = { daysUntilDeadline = it.toInt() },
                            valueRange = 0f..14f,
                            steps = 13
                        )
                    }

                    // Priority Selector
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(
                            text = "Priority Level",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Priority.values().forEach { p ->
                                FilterChip(
                                    selected = priority == p,
                                    onClick = { priority = p },
                                    label = { Text(p.label) },
                                    leadingIcon = if (p == Priority.HIGH) {
                                        { Icon(Icons.Default.PriorityHigh, contentDescription = null, modifier = Modifier.size(14.dp)) }
                                    } else null
                                )
                            }
                        }
                    }

                    // Workload Estimate
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "Estimated Workload",
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                text = "$workloadHours hours",
                                style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                        Slider(
                            value = workloadHours.toFloat(),
                            onValueChange = { workloadHours = Math.round(it * 2) / 2.0 },
                            valueRange = 0.5f..12f,
                            steps = 22
                        )
                    }

                    // Description
                    OutlinedTextField(
                        value = description,
                        onValueChange = { description = it },
                        label = { Text("Description & Requirements") },
                        placeholder = { Text("Key objectives, concepts tested, and rubrics...") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 3,
                        maxLines = 5,
                        shape = RoundedCornerShape(10.dp)
                    )

                    // Step by step instructions
                    OutlinedTextField(
                        value = instructionText,
                        onValueChange = { instructionText = it },
                        label = { Text("Step-by-step Instructions (One per line)") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 3,
                        maxLines = 6,
                        shape = RoundedCornerShape(10.dp)
                    )

                    // Submission Link
                    OutlinedTextField(
                        value = submissionLink,
                        onValueChange = { submissionLink = it },
                        label = { Text("Submission Portal URL / LMS Link") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        shape = RoundedCornerShape(10.dp)
                    )
                }

                // Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("Cancel")
                    }
                    Button(
                        onClick = {
                            if (title.isBlank()) {
                                validationError = "Assignment title is required."
                            } else if (teacher.isBlank()) {
                                validationError = "Faculty name is required."
                            } else {
                                validationError = null
                                showConfirmation = true
                            }
                        },
                        modifier = Modifier.weight(1.5f),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                    ) {
                        Icon(Icons.Default.Publish, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Publish to Class")
                    }
                }
            }
        }
    }
}
