# REQUIREMENTS.md

| ID | Requirement | Source | Status |
|----|-------------|--------|--------|
| REQ-01 | **Structure Initialization**: `initStructure()` must create CONFIG, TASKS, LOOKUPS, GANTT_VIEW sheets if missing, without overwriting existing data. | Core Function | Pending |
| REQ-02 | **Calendar Generation**: `buildCalendarFromConfig()` must populate LOOKUPS with correct weekly ranges (S1-S4) for the selected Year/Month. | Core Function | Pending |
| REQ-03 | **Gantt Visualization**: `refreshGanttView()` must rebuild the view, map tasks to rows, and apply conditional formatting for bars. | Core Function | Pending |
| REQ-04 | **Fix Formatting Bug**: Conditional formatting rules must use relative row references to prevent "anchoring" bugs. | Bug Fix | Pending |
| REQ-05 | **Safe Rollover**: `rolloverToNextYear()` must archive past tasks to a separate sheet (e.g., `ARCHIVE_YYYY`) before removing them from TASKS. | Improvement | Pending |
| REQ-06 | **Dynamic Columns**: Scripts must identify columns by Header Name, not fixed index, to allow column insertion/reordering. | Improvement | Pending |
| REQ-07 | **Data Validation**: System must validate "Start" <= "End" and ensure dates are valid before processing, alerting the user of errors. | Improvement | Pending |
| REQ-08 | **Configurable Colors**: Bar colors should be determined by 'Status' column (e.g., Done, In Progress) based on CONFIG rules. | Improvement | Pending |
