# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
A "mini-Gantt" system embedded within Google Sheets using Apps Script. It decouples data entry (TASKS) from visualization (GANTT_VIEW), automating the tedious process of drawing bars, managing calendars, and handling annual rollovers. The goal is a "single source of truth" workflow where users only edit data, and the system handles the presentation.

## Goals
1.  **Automated Visualization**: Generate a consistent Gantt view (`GANTT_VIEW`) from raw task data (`TASKS`) and configuration (`CONFIG`), utilizing conditional formatting for timelines.
2.  **Simplified Maintenance**: Provide menu-driven commands for common actions: "Initialize Structure", "Generate Calendar", "Refresh View", and "Annual Rollover".
3.  **Robust Data Management**: Implement safe rollover procedures (archiving vs. deleting) and validation to ensure data integrity.

## Non-Goals (Out of Scope)
-   Complex project management features (Resource leveling, Critical Path Method).
-   External integrations beyond Google ecosystem (initially).
-   Mobile-specific UI optimizations.

## Users
-   **Project Managers**: For maintaining the master task list.
-   **Team Members**: For viewing deadlines and status without breaking formulas.

## Constraints
-   **Platform**: Google Sheets & Google Apps Script.
-   **Tech Stack**: JavaScript (Apps Script), HTML/CSS (for potential dialogs/sidebars).
-   **Performance**: Must handle typical project sheets (hundreds of rows) without timing out.

## Success Criteria
-   [ ] `initStructure()` correctly creates required sheets if missing.
-   [ ] `refreshGanttView()` renders accurate Gantt bars based on Start/End dates.
-   [ ] "Rollover" process archives old data safely instead of deleting it.
-   [ ] Conditional formatting rules are applied correctly (fixing current anchor bugs).
-   [ ] System handles columns dynamically (Header Mapping) rather than by fixed index.
