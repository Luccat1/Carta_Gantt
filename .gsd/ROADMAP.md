# ROADMAP.md

> **Current Phase**: Phase 7
> **Milestone**: v1.1 — Multi-Proyecto & Suite Google

## Must-Haves (v1.1)
- [ ] Tabla PROJECTS + ProyectoID en TASKS
- [ ] ID autogenerado + Estado enum
- [ ] Header-map (no depender de posiciones de columna)
- [ ] Validador con hoja ISSUES
- [ ] TIMELINE_DATA autogenerada
- [ ] Tablas AppSheet-friendly

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
**Status**: ⬜ Not Started
**Objective**: Auto-estados, Sidebar nueva tarea, rollover mejorado, plantillas.

### Phase 9: AppSheet
**Status**: ⬜ Not Started
**Objective**: Tablas separadas, acciones, instrucciones.

### Phase 10: Integraciones Suite Google
**Status**: ⬜ Not Started
**Objective**: Calendar, Drive carpetas, Gmail avisos.
