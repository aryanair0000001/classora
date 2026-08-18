package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.Priority
import com.example.model.UrgencyLevel
import com.example.model.UserRole
import com.example.ui.theme.*

@Composable
fun UrgencyBadge(urgency: UrgencyLevel, relativeText: String, modifier: Modifier = Modifier) {
    val (bgColor, textColor, borderColor) = when (urgency) {
        UrgencyLevel.DUE_TODAY -> Triple(StatusCriticalBg, StatusCriticalText, StatusCriticalBorder)
        UrgencyLevel.DUE_TOMORROW -> Triple(StatusHighBg, StatusHighText, StatusHighBorder)
        UrgencyLevel.DUE_IN_3_DAYS -> Triple(StatusInReviewBg, StatusInReviewText, StatusInReviewBorder)
        UrgencyLevel.DUE_IN_7_DAYS -> Triple(Color(0xFFF3F4F6), Color(0xFF4B5563), Color(0xFFE5E7EB))
        UrgencyLevel.UPCOMING -> Triple(Color(0xFFF9FAFB), Color(0xFF6B7280), Color(0xFFE5E7EB))
        UrgencyLevel.OVERDUE -> Triple(Color(0xFFFEE2E2), Color(0xFFEF4444), Color(0xFFFCA5A5))
        UrgencyLevel.COMPLETED -> Triple(StatusVerifiedBg, StatusVerifiedText, StatusVerifiedBorder)
    }

    Surface(
        modifier = modifier,
        color = bgColor,
        shape = RoundedCornerShape(4.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, borderColor)
    ) {
        Text(
            text = relativeText.uppercase(),
            color = textColor,
            style = MaterialTheme.typography.labelSmall.copy(
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Bold,
                fontSize = 9.sp,
                letterSpacing = 0.3.sp
            ),
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
        )
    }
}

@Composable
fun VerificationBadge(isFacultyVerified: Boolean, modifier: Modifier = Modifier) {
    if (isFacultyVerified) {
        Surface(
            modifier = modifier,
            color = StatusVerifiedBg,
            shape = RoundedCornerShape(4.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, StatusVerifiedBorder)
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(3.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Verified,
                    contentDescription = null,
                    tint = StatusVerifiedText,
                    modifier = Modifier.size(10.dp)
                )
                Text(
                    text = "VERIFIED",
                    color = StatusVerifiedText,
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontSize = 8.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.5.sp
                    )
                )
            }
        }
    } else {
        Surface(
            modifier = modifier,
            color = Color(0xFFF5F3FF),
            shape = RoundedCornerShape(4.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFDDD6FE))
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(3.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.School,
                    contentDescription = null,
                    tint = Color(0xFF6D28D9),
                    modifier = Modifier.size(10.dp)
                )
                Text(
                    text = "CR POST",
                    color = Color(0xFF6D28D9),
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontSize = 8.sp,
                        fontWeight = FontWeight.Bold
                    )
                )
            }
        }
    }
}

@Composable
fun SubjectChip(subjectCode: String, subjectName: String, modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier,
        color = Color(0xFFF3F4F6),
        shape = RoundedCornerShape(4.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, SurfaceBorderLight)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(
                text = subjectCode,
                style = MaterialTheme.typography.labelSmall.copy(
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    fontSize = 10.sp
                ),
                color = HighDensityIndigoPrimary
            )
            Text(
                text = subjectName,
                style = MaterialTheme.typography.bodySmall.copy(
                    fontSize = 10.sp,
                    fontFamily = FontFamily.Default
                ),
                color = TextSecondaryLight,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@Composable
fun PriorityBadge(priority: Priority, modifier: Modifier = Modifier) {
    Text(
        text = when (priority) {
            Priority.CRITICAL -> "!!! Critical"
            Priority.HIGH -> "!! High"
            Priority.NORMAL -> "- Normal"
            Priority.LOW -> "! Low"
        },
        style = MaterialTheme.typography.labelSmall.copy(
            fontWeight = FontWeight.Bold,
            fontSize = 9.sp
        ),
        color = when (priority) {
            Priority.CRITICAL -> StatusCriticalText
            Priority.HIGH -> StatusHighText
            Priority.NORMAL -> Color(0xFF6B7280)
            Priority.LOW -> Color(0xFF3B82F6)
        },
        modifier = modifier
    )
}

@Composable
fun RoleBadge(role: UserRole, modifier: Modifier = Modifier) {
    val (bgColor, textColor, borderColor) = when (role) {
        UserRole.FACULTY -> Triple(StatusVerifiedBg, StatusVerifiedText, StatusVerifiedBorder)
        UserRole.CR -> Triple(HighDensityIndigoBg, HighDensityIndigoPrimary, HighDensityIndigoBorder)
        UserRole.ADMIN -> Triple(StatusCriticalBg, StatusCriticalText, StatusCriticalBorder)
        UserRole.STUDENT -> Triple(Color(0xFFF3F4F6), Color(0xFF4B5563), SurfaceBorderLight)
    }

    Surface(
        modifier = modifier,
        color = bgColor,
        shape = RoundedCornerShape(4.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, borderColor)
    ) {
        Text(
            text = role.displayName.uppercase(),
            style = MaterialTheme.typography.labelSmall.copy(
                fontSize = 8.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 0.5.sp
            ),
            color = textColor,
            modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp)
        )
    }
}

@Composable
fun StatCard(
    title: String,
    value: String,
    subtitle: String,
    icon: ImageVector,
    iconColor: Color,
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null
) {
    Surface(
        modifier = modifier
            .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier),
        color = Color.White,
        shape = RoundedCornerShape(8.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, SurfaceBorderLight)
    ) {
        Column(
            modifier = Modifier.padding(10.dp),
            verticalArrangement = Arrangement.spacedBy(3.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = title.uppercase(),
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontSize = 8.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.5.sp
                    ),
                    color = TextTertiaryLight
                )
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = iconColor,
                    modifier = Modifier.size(13.dp)
                )
            }

            Text(
                text = value,
                style = MaterialTheme.typography.headlineLarge.copy(
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp
                ),
                color = TextPrimaryLight
            )

            Text(
                text = subtitle,
                style = MaterialTheme.typography.labelSmall.copy(
                    fontSize = 9.sp,
                    fontFamily = FontFamily.Monospace
                ),
                color = TextSecondaryLight,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@Composable
fun UrgencyMetricBlock(
    count: Int,
    label: String,
    urgencyColor: Color,
    bgColor: Color,
    borderColor: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Surface(
        modifier = modifier.clickable(onClick = onClick),
        color = bgColor,
        shape = RoundedCornerShape(8.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, borderColor)
    ) {
        Column(
            modifier = Modifier.padding(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(2.dp)
        ) {
            Text(
                text = "$count",
                style = MaterialTheme.typography.titleLarge.copy(
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                ),
                color = urgencyColor
            )
            Text(
                text = label.uppercase(),
                style = MaterialTheme.typography.labelSmall.copy(
                    fontSize = 8.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.4.sp
                ),
                color = urgencyColor
            )
        }
    }
}

@Composable
fun EmptyStateCard(
    title: String,
    message: String,
    icon: ImageVector = Icons.Outlined.CheckCircle,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier.fillMaxWidth(),
        color = Color.White,
        shape = RoundedCornerShape(8.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, SurfaceBorderLight)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFF3F4F6)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = HighDensityIndigoPrimary,
                    modifier = Modifier.size(18.dp)
                )
            }

            Text(
                text = title,
                style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                color = TextPrimaryLight
            )

            Text(
                text = message,
                style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                color = TextSecondaryLight,
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )
        }
    }
}
