# ROADMAP.md

> **Current Phase**: Milestone 1.1 Complete
> **Milestone**: v1.1 — Multi-Proyecto & Suite Google (COMPLETE ✅)

## Must-Haves (v1.1)
- [x] Tabla PROJECTS + ProyectoID en TASKS
- [x] ID autogenerado + Estado enum
- [x] Header-map (no depender de posiciones de columna)
- [x] Validador con hoja ISSUES
- [x] TIMELINE_DATA autogenerada
- [x] Tablas AppSheet-friendly

## Completed Phases (v1.0)

### Phase 1: Foundation & Calendar
**Status**: ✅ Complete

### Phase 2: Core Visualization
**Status**: ✅ Complete

### Phase 3: Robustness & Safety
**Status**: ✅ Complete

## Active Phases (v1.1)

### Phase 4: Modelo de Datos v2
**Status**: ✅ Complete
**Objective**: Restructure data model for multi-project support. Add PROJECTS sheet, ProyectoID, auto-ID, Estado enum, and header-map utility.
- Add PROJECTS sheet (ProyectoID, Nombre, Owner, Fechas, Estado, Color).
- Expand TASKS headers: Proyecto, ID autogenerado, Estado normalizado.
- Implement header-map utility (column lookup by name).
- Update all existing scripts to use header-map instead of hardcoded indices.

### Phase 5: Validación & Contrato
**Status**: ✅ Complete
**Objective**: Robust validation engine with ISSUES reporting and sheet protections.

### Phase 6: Timeline & Multi-Mes
**Status**: ✅ Complete
**Objective**: TIMELINE_DATA sheet, colores por Proyecto/Área, selector multi-mes.

### Phase 7: Vistas & Dashboard
**Status**: ✅ Complete
**Objective**: Portfolio, por proyecto, por responsable, KPIs.

### Phase 8: UX & Automatización
**Status**: ✅ Complete
**Objective**: Auto-estados, Sidebar nueva tarea, rollover mejorado, plantillas.

### Phase 9: AppSheet
**Status**: ✅ Complete
**Objective**: Tablas separadas, acciones, instrucciones.

### Phase 10: Integraciones Suite Google
**Status**: ✅ Complete
**Objective**: Calendar, Drive carpetas, Gmail avisos.

### Phase 11: Gap Closure (Audit)
**Status**: ✅ Complete
**Objective**: Address technical debt and housekeeping gaps from milestone v1.1 audit.

**Gaps to Close:**
- [ ] Fix Notifications.gs date format bug (`dd/mm` → `dd/MM`)
- [ ] Clean up TODO.md (mark implemented items, create Backlog section)
- [ ] Backfill VERIFICATION.md for phases 8, 9, 10
- [ ] Rename `Calendar.gs` → `CalendarGrid.gs` for clarity
- [ ] Add SPEC.md success criterion for Google Suite integrations
- [ ] Update ROADMAP must-haves to checked
