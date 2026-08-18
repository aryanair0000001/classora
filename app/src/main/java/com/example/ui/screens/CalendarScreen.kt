package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.Assignment
import com.example.model.UrgencyLevel
import com.example.ui.components.AssignmentCard
import com.example.ui.components.EmptyStateCard
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

@Composable
fun CalendarScreen(
    assignments: List<Assignment>,
    onSelectAssignment: (Assignment) -> Unit,
    onToggleCompletion: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedDayOffset by remember { mutableIntStateOf(0) } // 0 = Today, 1 = Tomorrow, etc.
    val cal = Calendar.getInstance()

    // 14-day calendar strip
    val daysList = remember {
        (0..13).map { offset ->
            val dayCal = Calendar.getInstance()
            dayCal.add(Calendar.DAY_OF_YEAR, offset)
            val dayName = SimpleDateFormat("EEE", Locale.getDefault()).format(dayCal.time)
            val dayNumber = SimpleDateFormat("d", Locale.getDefault()).format(dayCal.time)
            val monthName = SimpleDateFormat("MMM", Locale.getDefault()).format(dayCal.time)
            Triple(offset, "$dayName\n$dayNumber", "$monthName $dayNumber")
        }
    }

    // Filter assignments for selected day or all upcoming
    val selectedDayCal = Calendar.getInstance().apply { add(Calendar.DAY_OF_YEAR, selectedDayOffset) }
    val daySdf = SimpleDateFormat("yyyyMMdd", Locale.getDefault())
    val selectedDayKey = daySdf.format(selectedDayCal.time)

    val assignmentsForSelectedDay = assignments.filter { asg ->
        val asgDateKey = daySdf.format(Date(asg.deadlineEpochMs))
        asgDateKey == selectedDayKey
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Header
        Column(
            modifier = Modifier.padding(top = 12.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(
                text = "Academic Calendar",
                style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold)
            )
            Text(
                text = "Track deliverables, milestones & deadlines across days",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        // Horizontal Interactive Day Strip
        Surface(
            shape = RoundedCornerShape(12.dp),
            color = MaterialTheme.colorScheme.surface,
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)),
            modifier = Modifier.fillMaxWidth()
        ) {
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(daysList) { (offset, displayLabel, _) ->
                    val isSelected = selectedDayOffset == offset
                    val dayCalInstance = Calendar.getInstance().apply { add(Calendar.DAY_OF_YEAR, offset) }
                    val dateKey = daySdf.format(dayCalInstance.time)
                    val hasDeadlines = assignments.any { daySdf.format(Date(it.deadlineEpochMs)) == dateKey && !it.isCompleted }

                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                        border = BorderStroke(
                            1.dp,
                            if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f)
                        ),
                        modifier = Modifier
                            .width(52.dp)
                            .clickable { selectedDayOffset = offset }
                    ) {
                        Column(
                            modifier = Modifier.padding(vertical = 10.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Text(
                                text = displayLabel,
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                    fontSize = 11.sp
                                ),
                                color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface,
                                textAlign = androidx.compose.ui.text.style.TextAlign.Center
                            )

                            if (hasDeadlines) {
                                Box(
                                    modifier = Modifier
                                        .size(6.dp)
                                        .clip(CircleShape)
                                        .background(if (isSelected) Color.White else Color(0xFFE11D48))
                                )
                            } else {
                                Spacer(modifier = Modifier.height(6.dp))
                            }
                        }
                    }
                }
            }
        }

        // Selected Day Deliverables Header
        val selectedDayTitle = if (selectedDayOffset == 0) "Due Today" else if (selectedDayOffset == 1) "Due Tomorrow" else "Due on ${daysList[selectedDayOffset].third}"
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = selectedDayTitle,
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold)
            )
            Text(
                text = "${assignmentsForSelectedDay.size} scheduled",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.primary
            )
        }

        // List for Selected Day
        if (assignmentsForSelectedDay.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                contentAlignment = Alignment.Center
            ) {
                EmptyStateCard(
                    title = "No deadlines on this day",
                    message = "You have no assignments scheduled for this date. Select another day on the calendar strip above."
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(bottom = 80.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(assignmentsForSelectedDay, key = { it.id }) { asg ->
                    AssignmentCard(
                        assignment = asg,
                        onCardClick = { onSelectAssignment(asg) },
                        onToggleCompletion = { onToggleCompletion(asg.id) }
                    )
                }
            }
        }
    }
}
