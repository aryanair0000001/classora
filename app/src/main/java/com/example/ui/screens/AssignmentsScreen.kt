package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.*
import com.example.ui.components.AssignmentCard
import com.example.ui.components.EmptyStateCard

enum class AssignmentFilter(val label: String) {
    ALL("All"),
    DUE_TODAY("Due Today"),
    UPCOMING("Upcoming"),
    HIGH_PRIORITY("High Priority"),
    COMPLETED("Completed"),
    OVERDUE("Overdue")
}

enum class AssignmentSort(val label: String) {
    NEAREST_DEADLINE("Nearest Deadline"),
    WORKLOAD("Est. Workload"),
    PRIORITY("Priority"),
    SUBJECT("Subject")
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AssignmentsScreen(
    assignments: List<Assignment>,
    currentUser: UserProfile,
    onSelectAssignment: (Assignment) -> Unit,
    onToggleCompletion: (String) -> Unit,
    onOpenCreateAssignment: () -> Unit,
    modifier: Modifier = Modifier
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf(AssignmentFilter.ALL) }
    var selectedSort by remember { mutableStateOf(AssignmentSort.NEAREST_DEADLINE) }
    var showSortMenu by remember { mutableStateOf(false) }

    // Filter Logic
    val filteredList = assignments.filter { asg ->
        val matchesSearch = asg.title.contains(searchQuery, ignoreCase = true) ||
                asg.subject.contains(searchQuery, ignoreCase = true) ||
                asg.subjectCode.contains(searchQuery, ignoreCase = true) ||
                asg.teacher.contains(searchQuery, ignoreCase = true)

        val matchesFilter = when (selectedFilter) {
            AssignmentFilter.ALL -> true
            AssignmentFilter.DUE_TODAY -> asg.getUrgency() == UrgencyLevel.DUE_TODAY && !asg.isCompleted
            AssignmentFilter.UPCOMING -> !asg.isCompleted && asg.getUrgency() != UrgencyLevel.OVERDUE
            AssignmentFilter.HIGH_PRIORITY -> asg.priority == Priority.HIGH
            AssignmentFilter.COMPLETED -> asg.isCompleted
            AssignmentFilter.OVERDUE -> asg.getUrgency() == UrgencyLevel.OVERDUE && !asg.isCompleted
        }

        matchesSearch && matchesFilter
    }.let { list ->
        // Sort Logic
        when (selectedSort) {
            AssignmentSort.NEAREST_DEADLINE -> list.sortedWith(compareBy<Assignment> { it.isCompleted }.thenBy { it.deadlineEpochMs })
            AssignmentSort.WORKLOAD -> list.sortedByDescending { it.estimatedWorkloadHours }
            AssignmentSort.PRIORITY -> list.sortedByDescending { it.priority.level }
            AssignmentSort.SUBJECT -> list.sortedBy { it.subject }
        }
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        floatingActionButton = {
            if (currentUser.role == UserRole.CR || currentUser.role == UserRole.FACULTY || currentUser.role == UserRole.ADMIN) {
                FloatingActionButton(
                    onClick = onOpenCreateAssignment,
                    containerColor = MaterialTheme.colorScheme.primary,
                    contentColor = Color.White,
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = "Add Assignment")
                        Text("Add Task", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    }
                }
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Header & Search
            Column(
                modifier = Modifier.padding(top = 12.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Class Tasks & Deadlines",
                            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold)
                        )
                        Text(
                            text = "${filteredList.size} assignment(s) found",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    // Sort Dropdown Button
                    Box {
                        OutlinedButton(
                            onClick = { showSortMenu = true },
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Icon(Icons.Default.Sort, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(selectedSort.label, fontSize = 12.sp)
                        }

                        DropdownMenu(
                            expanded = showSortMenu,
                            onDismissRequest = { showSortMenu = false }
                        ) {
                            AssignmentSort.values().forEach { sortOption ->
                                DropdownMenuItem(
                                    text = { Text(sortOption.label) },
                                    onClick = {
                                        selectedSort = sortOption
                                        showSortMenu = false
                                    },
                                    leadingIcon = if (selectedSort == sortOption) {
                                        { Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp)) }
                                    } else null
                                )
                            }
                        }
                    }
                }

                // Search Box
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text("Search by title, subject, course code, or faculty...") },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                    trailingIcon = if (searchQuery.isNotEmpty()) {
                        {
                            IconButton(onClick = { searchQuery = "" }) {
                                Icon(Icons.Default.Clear, contentDescription = "Clear")
                            }
                        }
                    } else null,
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    shape = RoundedCornerShape(10.dp)
                )
            }

            // Filter Chips
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(AssignmentFilter.values()) { filter ->
                    val isSelected = selectedFilter == filter
                    val count = when (filter) {
                        AssignmentFilter.ALL -> assignments.size
                        AssignmentFilter.DUE_TODAY -> assignments.count { it.getUrgency() == UrgencyLevel.DUE_TODAY && !it.isCompleted }
                        AssignmentFilter.UPCOMING -> assignments.count { !it.isCompleted }
                        AssignmentFilter.HIGH_PRIORITY -> assignments.count { it.priority == Priority.HIGH }
                        AssignmentFilter.COMPLETED -> assignments.count { it.isCompleted }
                        AssignmentFilter.OVERDUE -> assignments.count { it.getUrgency() == UrgencyLevel.OVERDUE && !it.isCompleted }
                    }

                    FilterChip(
                        selected = isSelected,
                        onClick = { selectedFilter = filter },
                        label = { Text("${filter.label} ($count)", fontSize = 12.sp) }
                    )
                }
            }

            // Assignment List
            if (filteredList.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    EmptyStateCard(
                        title = "No assignments match your filter",
                        message = "Try clearing your search query or selecting a different status filter."
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(bottom = 80.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(filteredList, key = { it.id }) { asg ->
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
}
