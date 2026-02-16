# TODO — Gantt Multi-Proyecto (Suite Google)

> MVP mínimo para equipo: ProyectoID + ID + estado enum + validador + TIMELINE_DATA

---

## 1. Modelo de datos & Contrato `high`

- [ ] **Tabla PROJECTS separada**: ProyectoID, Nombre, Owner, Fechas, Estado, Color, CarpetaDrive, CalendarioID. TASKS referencia ProyectoID (no texto libre). `high` — 2026-02-16
- [ ] **ID obligatorio autogenerado**: ID permanente por tarea, generado al crear. Sin esto, cualquier edición rompe todo. `high` — 2026-02-16
- [ ] **Estado normalizado (enum)**: No iniciado / En curso / Bloqueado / Terminado / Cancelado. `high` — 2026-02-16
- [ ] **Validador de datos + hoja ISSUES**: Fechas válidas, Inicio≤Fin, proyecto presente, responsable existe, ID único, estado permitido. Genera hoja ISSUES con fila/ID/campo/mensaje. `high` — 2026-02-16
- [ ] **Header-map en Apps Script**: Nunca depender de posiciones de columnas; mapear por nombre de encabezado. `high` — 2026-02-16
- [ ] **Dependencias lite**: Columna `Depende_de` (IDs), estado calculado "Bloqueado" si dependencias no terminadas, detección de ciclos. `medium` — 2026-02-16
- [ ] **Campos extra**: Prioridad (P0/P1/P2), Tipo (Hito/Entrega/Tarea), Progreso%, Fecha_real_inicio/fin, Riesgo. `medium` — 2026-02-16
- [ ] **Links trazabilidad**: Columnas Link_doc, Link_drive, Link_calendar. `low` — 2026-02-16

---

## 2. Arquitectura: tabla fuente + vistas `high`

- [ ] **TASKS como única fuente de verdad**: GANTT_VIEW y TIMELINE_DATA se regeneran siempre desde TASKS. `high` — 2026-02-16
- [ ] **Named ranges / CONFIG central**: Claves de estados, colores, proyectos, áreas, vistas — todo centralizado. `high` — 2026-02-16
- [ ] **Protecciones**: Bloquear edición de columnas calculadas (ID, campos derivados); proteger hojas de vista. `medium` — 2026-02-16

---

## 3. Compatibilidad Timeline (Google Sheets nativo) `high`

- [ ] **Hoja TIMELINE_DATA autogenerada**: Tabla plana con RowID, Group (Proyecto/Área), Task, Start, End, Owner, Status, ColorKey. Elimina dependencia de fórmulas con #REF!. `high` — 2026-02-16
- [ ] **Botón "Regenerar Timeline"** en menú. `medium` — 2026-02-16
- [ ] **Colores distintivos por Proyecto y Área**: Mapeo de colores consistente para Timeline y Gantt. `medium` — 2026-02-16

---

## 4. Selector multi-mes `medium`

- [ ] **Selector de meses en CONFIG**: Elegir cuántos y cuáles meses visualizar (uno, varios, rango). Reemplaza el mes único actual. `medium` — 2026-02-16

---

## 5. Vistas & Dashboard `medium`

- [ ] **Vista Portfolio**: Todas las tareas de todos los proyectos, con filtros rápidos. `high` — 2026-02-16
- [ ] **Vista por proyecto**: Auto-generada o filtrable por slicers. `medium` — 2026-02-16
- [ ] **Vista por responsable**: "Mi semana / Mi mes". `medium` — 2026-02-16
- [ ] **Dashboard KPIs**: % terminadas por proyecto, tareas atrasadas (count + top 10), carga por responsable próximas 2 semanas, hitos próximos, desviación plan vs real. `medium` — 2026-02-16
- [ ] **Slicers sin script**: Filtrar por Proyecto/Área/Responsable/Estado. `low` — 2026-02-16

---

## 6. Automatización Apps Script `medium`

- [ ] **Auto-estados**: Retrasado si HOY()>Fin y no Terminado; En curso si Inicio≤HOY()≤Fin. `high` — 2026-02-16
- [ ] **Sidebar "Nueva tarea"**: Formulario HTML con dropdowns (Proyecto, Área, Estado), autocompletado de responsables, generación automática de ID. `medium` — 2026-02-16
- [ ] **Rollover no destructivo + AUDIT_LOG**: Archivar en ARCHIVE_YYYY (no borrar), registrar quién/cuándo/qué cambió (before/after). `high` — 2026-02-16
- [ ] **Plantillas de proyecto**: Clonar set base de tareas por proyecto/cohorte. `medium` — 2026-02-16
- [ ] **Exportar CSV**: Interoperabilidad con Jira/Asana/Calendar. `low` — 2026-02-16

---

## 7. Compatibilidad AppSheet `high`

- [ ] **Tablas AppSheet-friendly**: Sin celdas combinadas, encabezados únicos, tipos claros, IDs estables. `high` — 2026-02-16
- [ ] **Tablas separadas**: PROJECTS, TASKS, PEOPLE, STATUS, AREAS. `high` — 2026-02-16
- [ ] **Acciones AppSheet**: Cambiar estado, Marcar terminado, Crear hito, Crear tarea desde plantilla. `medium` — 2026-02-16
- [ ] **Instrucciones de setup AppSheet** en README. `medium` — 2026-02-16

---

## 8. Integraciones Suite Google `medium`

- [ ] **Google Calendar**: Crear/actualizar eventos por ID tarea en calendario por proyecto (CalendarID en PROJECTS). Unidireccional basta. `medium` — 2026-02-16
- [ ] **Drive — estructura por proyecto**: Botón "Crear carpetas" (/Proyecto/01_Admin, /02_Docs, /03_Entregables, /04_Reuniones). Validar permisos y enlaces rotos. `medium` — 2026-02-16
- [ ] **Gmail — avisos semanales**: Notificaciones automáticas a responsables: atrasos + próximos 7 días. `medium` — 2026-02-16

---

## 🔴 Bugs actuales

- [ ] **#REF! en selector de mes**: inicio_mes/fin_mes dependen de rangos movidos. Reconstruir desde CONFIG de forma robusta. `high` — 2026-02-16
- [ ] **Columnas Estado e ID incompletas**: Sin estar completas/forzadas, no hay multi-proyecto fiable. `high` — 2026-02-16
- [ ] **Data validation (dropdowns) en todos los campos posibles**: Agregar desplegables/verificación de datos en Estado (PROJECTS), Proyecto (TASKS, desde PROJECTS), y cualquier campo con valores predefinidos, para minimizar error humano por texto libre. `high` — 2026-02-16
- [ ] **Actualizar documentación del repositorio**: Mantener README.md, SPEC.md, ARCHITECTURE.md y demás docs de lectura sincronizados con el estado actual del código, para que colaboradores y usuarios tengan información precisa. `medium` — 2026-02-16
