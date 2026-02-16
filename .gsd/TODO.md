# TODO — Gantt Multi-Proyecto (Suite Google)

> All core objectives for v1.1 Multi-Proyecto & Suite Google have been achieved.

---

## ✅ Completed in v1.1

### 1. Modelo de datos & Contrato
- [x] **Tabla PROJECTS separada**: ProyectoID, Nombre, Owner, Fechas, Estado, Color.
- [x] **ID obligatorio autogenerado**: ID permanente generado en Sidebar e init.
- [x] **Estado normalizado (enum)**: No iniciado / En curso / Bloqueado / Terminado / Cancelado.
- [x] **Validador de datos + hoja ISSUES**: Motor de validación completo en `Validation.gs`.
- [x] **Header-map en Apps Script**: Dinamismo total vía `getHeaderMap_`.

### 2. Arquitectura & Vistas
- [x] **TASKS como única fuente de verdad**: Regeneración de GANTT y TIMELINE.
- [x] **Named ranges / CONFIG central**: Centralización de variables globales.
- [x] **Protecciones**: Implementadas en `initStructure` para hojas clave.
- [x] **Hoja TIMELINE_DATA autogenerada**: Soporte nativo para Google Timeline chart.
- [x] **Vistas Filtradas**: Por Proyecto y Por Responsable.
- [x] **Dashboard KPIs**: Dashboard visual con métricas de salud del proyecto.

### 3. Automatización & UX
- [x] **Auto-estados**: Lógica de cálculo automático basada en fechas y tareas.
- [x] **Sidebar "Nueva tarea"**: Formulario dinámico con validación y autocompletado.
- [x] **Rollover no destructivo**: Proceso seguro de archivado anual.
- [x] **Plantillas de proyecto**: Sistema de clonación de tareas base.

### 4. Integraciones
- [x] **AppSheet Ready**: Modelo relacional, disparadores (`_Acción`) e instrucciones.
- [x] **Google Calendar**: Sincronización de hitos a calendarios externos.
- [x] **Google Drive**: Estructura jerárquica de carpetas automática.
- [x] **Gmail Alerts**: Notificaciones automáticas por email para responsables.

---

## ⏳ Backlog (Future Phases)

- [ ] **Dependencias lite**: Columna `Depende_de` (IDs), estado "Bloqueado" automático, detección de ciclos. `medium`
- [ ] **Campos extra**: Prioridad (P0/P1/P2), Tipo (Hito/Entrega/Tarea), Progreso%, Riesgo. `medium`
- [ ] **AUDIT_LOG avanzado**: Registro histórico detallado de cambios por celda (Who/When/What). `high`
- [ ] **Links trazabilidad**: Columnas automáticas Link_doc, Link_drive, Link_calendar en TASKS. `low`
- [ ] **Exportar CSV**: Interoperabilidad con herramientas externas (Jira/Asana). `low`
