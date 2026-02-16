# Milestone Audit: v1.1 — Multi-Proyecto & Suite Google

**Audited:** 2026-02-16

---

## Summary

| Metric | Value |
|--------|-------|
| Phases completed | 10 (3 v1.0 + 7 v1.1) |
| Plans executed | 27 (3 per phase × 9 phases excl. v1.0 bundle) |
| Gap closures needed | 0 |
| Source files | 13 (.gs, .html, .md) |
| SPEC criteria met | 11/11 ✅ |
| TODO items deferred | 5 (see below) |

---

## Must-Haves Status (from ROADMAP.md)

| Requirement | Verified | Evidence |
|-------------|----------|----------|
| Tabla PROJECTS + ProyectoID en TASKS | ✅ | `Config.gs:HEADERS_PROJECTS`, `Main.gs:initStructure` |
| ID autogenerado + Estado enum | ✅ | `Helpers.gs:generateTaskId_`, `Config.gs:VALID_STATUSES` |
| Header-map (no posiciones fijas) | ✅ | `Helpers.gs:getHeaderMap_`, all files use `getColIndex_` |
| Validador con hoja ISSUES | ✅ | `Validation.gs:runFullValidation` writes to ISSUES |
| TIMELINE_DATA autogenerada | ✅ | `Gantt.gs:refreshTimelineData` |
| Tablas AppSheet-friendly | ✅ | `Config.gs:SHEET_APPSHEET`, `Main.gs:APPSHEET_CONFIG seed` |

---

## Phase-by-Phase Quality

| Phase | Plans | Summaries | Verification | Quality |
|-------|-------|-----------|--------------|---------|
| 1: Foundation | 2 | 2 ✅ | ✅ | Good |
| 2: Visualization | 2 | 2 ✅ | ✅ | Good |
| 3: Robustness | 2 | 2 ✅ | ✅ | Good |
| 4: Data Model v2 | 3 | 3 ✅ | ✅ | Good |
| 5: Validation | 3 | 3 ✅ | ✅ | Good |
| 6: Timeline | 3 | 3 ✅ | ✅ | Good |
| 7: Dashboard | 3 | 3 ✅ | ✅ | Good |
| 8: UX & Auto | 3 | 3 ✅ | ⚠️ Missing | Minor gap |
| 9: AppSheet | 3 | 3 ✅ | ⚠️ Missing | Minor gap |
| 10: Integrations | 3 | 3 ✅ | ⚠️ Missing | Minor gap |

> Phases 8-10 have SUMMARY files but no dedicated `VERIFICATION.md` in their phase directories.

---

## Concerns

### 1. TODO.md is stale
All 85 items in `TODO.md` remain unchecked (`- [ ]`) despite the vast majority being implemented. This creates a misleading view of project status.

### 2. Missing VERIFICATION.md for Phases 8, 9, 10
Phases 4-7 have proper `VERIFICATION.md` files. Phases 8-10 do not, relying only on SUMMARYs.

### 3. ROADMAP.md header says "Phase 7" but all 10 are done
Line 3: `> **Current Phase**: Phase 7` — outdated.

### 4. `ensureRowIds_` function exists in `Helpers.gs` but not listed in outline
The function was confirmed working from a prior session but may lack JSDoc.

### 5. `Calendar.gs` vs `CalendarSync.gs` — dual calendar files
`Calendar.gs` (2502B) handles the internal monthly calendar grid.
`CalendarSync.gs` (3404B) handles Google Calendar sync.
Names could be confusing to contributors.

---

## Deferred TODO Items (Not Implemented)

These items from `TODO.md` were intentionally out of scope for v1.1:

| Item | Priority | Notes |
|------|----------|-------|
| **Dependencias lite** (`Depende_de` column, cycle detection) | medium | Major feature, not in any phase plan |
| **Campos extra** (Prioridad, Tipo, Progreso%, Riesgo) | medium | Adds complexity; can be Phase 11+ |
| **Links trazabilidad** (Link_doc, Link_drive, Link_calendar) | low | Minor column additions |
| **AUDIT_LOG** (before/after change tracking) | high | Significant infrastructure; deferred |
| **Exportar CSV** (Jira/Asana interop) | low | Not core functionality |

---

## Recommendations

1. **Clean up TODO.md** — Mark implemented items `[x]`, move deferred items to a `## Backlog` section.
2. **Fix ROADMAP.md header** — Update `Current Phase` to reflect completion.
3. **Add VERIFICATION.md for Phases 8-10** — Backfill for audit trail completeness.
4. **Consider renaming `Calendar.gs` → `CalendarGrid.gs`** to disambiguate from `CalendarSync.gs`.
5. **Create next milestone** — v1.2 or v2.0 targeting high-priority backlog (Dependencies, Audit Log).

---

## Technical Debt to Address

- [ ] TODO.md items not marked as complete (cosmetic but misleading)
- [ ] ROADMAP.md `Current Phase` header is stale
- [ ] Missing VERIFICATION.md for phases 8, 9, 10
- [ ] DECISIONS.md file never created (referenced by GSD methodology)
- [ ] `Calendar.gs` / `CalendarSync.gs` naming confusion
- [ ] Notifications date format uses `dd/mm/yyyy` (lowercase `mm` = minutes in GAS; should be `dd/MM/yyyy`)
