package com.example.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.Assignment
import com.example.model.Priority
import com.example.model.UrgencyLevel
import com.example.ui.theme.*

@Composable
fun AssignmentCard(
    assignment: Assignment,
    onCardClick: () -> Unit,
    onToggleCompletion: () -> Unit,
    modifier: Modifier = Modifier
) {
    val urgency = assignment.getUrgency()
    val relativeTime = assignment.getRelativeTimeDisplay()

    val cardBorderColor by animateColorAsState(
        targetValue = when {
            assignment.isCompleted -> StatusVerifiedBorder
            urgency == UrgencyLevel.DUE_TODAY -> StatusCriticalBorder
            urgency == UrgencyLevel.DUE_TOMORROW -> StatusHighBorder
            assignment.isPinned -> HighDensityIndigoPrimary.copy(alpha = 0.5f)
            else -> SurfaceBorderLight
        },
        label = "border"
    )

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onCardClick),
        color = if (assignment.isCompleted) {
            Color(0xFFF9FAFB)
        } else {
            Color.White
        },
        shape = RoundedCornerShape(8.dp),
        border = BorderStroke(1.dp, cardBorderColor)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(10.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            // Top Row: Code + Urgency Tag + Verification
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = assignment.subjectCode,
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            fontSize = 10.sp
                        ),
                        color = HighDensityIndigoPrimary
                    )

                    if (assignment.isPinned) {
                        Surface(
                            color = HighDensityIndigoBg,
                            shape = RoundedCornerShape(4.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(2.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.PushPin,
                                    contentDescription = "Pinned",
                                    tint = HighDensityIndigoPrimary,
                                    modifier = Modifier.size(9.dp)
                                )
                                Text(
                                    text = "PINNED",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        fontSize = 8.sp,
                                        fontWeight = FontWeight.Bold
                                    ),
                                    color = HighDensityIndigoPrimary
                                )
                            }
                        }
                    }

                    if (assignment.isVerifiedByFaculty) {
                        Surface(
                            color = StatusVerifiedBg,
                            shape = RoundedCornerShape(4.dp)
                        ) {
                            Text(
                                text = "VERIFIED",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontSize = 8.sp,
                                    fontWeight = FontWeight.Bold
                                ),
                                color = StatusVerifiedText,
                                modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                            )
                        }
                    }
                }

                UrgencyBadge(urgency = urgency, relativeText = relativeTime)
            }

            // Middle Row: Title & Completion Toggle Checkbox
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                IconButton(
                    onClick = onToggleCompletion,
                    modifier = Modifier.size(24.dp)
                ) {
                    if (assignment.isCompleted) {
                        Box(
                            modifier = Modifier
                                .size(18.dp)
                                .clip(CircleShape)
                                .background(Color(0xFF16A34A)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Check,
                                contentDescription = "Completed",
                                tint = Color.White,
                                modifier = Modifier.size(12.dp)
                            )
                        }
                    } else {
                        Box(
                            modifier = Modifier
                                .size(18.dp)
                                .clip(CircleShape)
                                .background(Color.Transparent),
                            contentAlignment = Alignment.Center
                        ) {
                            Surface(
                                shape = CircleShape,
                                color = Color.Transparent,
                                border = BorderStroke(1.5.dp, Color(0xFF9CA3AF)),
                                modifier = Modifier.fillMaxSize()
                            ) {}
                        }
                    }
                }

                Text(
                    text = assignment.title,
                    modifier = Modifier.weight(1f),
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 12.sp,
                        textDecoration = if (assignment.isCompleted) TextDecoration.LineThrough else TextDecoration.None
                    ),
                    color = if (assignment.isCompleted) Color(0xFF9CA3AF) else Color(0xFF111827),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }

            // Bottom Row: Teacher + Hours + Priority
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Prof. ${assignment.teacher}",
                    style = MaterialTheme.typography.bodySmall.copy(
                        fontSize = 10.sp,
                        fontFamily = FontFamily.Default
                    ),
                    color = Color(0xFF6B7280)
                )

                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "${assignment.estimatedWorkloadHours}h est.",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontFamily = FontFamily.Monospace,
                            fontSize = 9.sp
                        ),
                        color = Color(0xFF6B7280)
                    )

                    // Priority indicator
                    Text(
                        text = when (assignment.priority) {
                            Priority.CRITICAL -> "!!! Critical"
                            Priority.HIGH -> "!! High"
                            Priority.NORMAL -> "- Normal"
                            Priority.LOW -> "! Low"
                        },
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Bold,
                            fontSize = 9.sp
                        ),
                        color = when (assignment.priority) {
                            Priority.CRITICAL -> Color(0xFFEF4444)
                            Priority.HIGH -> Color(0xFFF97316)
                            Priority.NORMAL -> Color(0xFF6B7280)
                            Priority.LOW -> Color(0xFF3B82F6)
                        }
                    )
                }
            }
        }
    }
}
