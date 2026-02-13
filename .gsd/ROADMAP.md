# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: v1.0

## Must-Haves (from SPEC)
- [ ] Automated Gantt visualization
- [ ] Menu-driven management
- [ ] Safe annual accounting (rollover)

## Phases

### Phase 1: Foundation & Calendar
**Status**: ✅ Complete
**Objective**: Establish the sheet structure and calendar generation logic.
**Requirements**: REQ-01, REQ-02
- Validate/Create CONFIG, TASKS, LOOKUPS sheets.
- Implement `buildCalendarFromConfig()` to generate S1-S4 ranges.

### Phase 2: Core Visualization
**Status**: ✅ Complete
**Objective**: Render tasks on the Gantt view with correct timing.
**Requirements**: REQ-03, REQ-04
- Implement `refreshGanttView()` to map tasks.
- Apply conditional formatting (fixing the anchor bug).

### Phase 3: Robustness & Safety
**Status**: ⬜ Not Started
**Objective**: Prevent data loss and ensure data quality.
**Requirements**: REQ-05, REQ-07
- Implement `rolloverToNextYear()` with archiving.
- Add basic data validation (Dates, Start < End).

### Phase 4: Polish & Flexibility
**Status**: ⬜ Not Started
**Objective**: Make the tool adaptable and user-friendly.
**Requirements**: REQ-06, REQ-08
- Implement dynamic column mapping (Header Map).
- Allow configurable status colors.
