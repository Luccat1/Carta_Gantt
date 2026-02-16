# TODO

- [ ] **Multi-proyecto**: Actualmente la Gantt soporta un solo proyecto. Permitir añadir múltiples proyectos claramente identificados (columna Proyecto, filtros, vistas separadas). `high` — 2026-02-16
- [ ] **Compatibilidad con Cronología de Google Sheets**: Adaptar el formato de TASKS/GANTT_VIEW para que funcione con la función nativa de Cronología (Timeline) de Google Sheets. `high` — 2026-02-16
- [ ] **Selector de meses**: Implementar un selector en CONFIG para elegir cuántos meses visualizar y cuáles (ej. solo marzo, o febrero a mayo, etc.) en lugar del mes único actual. `medium` — 2026-02-16
- [ ] **Colores distintivos por Proyecto y Área**: Usar colores diferenciados en la cronología/Gantt para identificar visualmente cada proyecto y cada área. Integrar con la función de Cronología de Google Sheets. `medium` — 2026-02-16
- [ ] **Compatibilidad con AppSheet**: Preparar la estructura de datos (TASKS, CONFIG) para funcionar con AppSheet. Scripts deben dejar todo configurado para la app. Incluir instrucciones de setup en README. `high` — 2026-02-16

## Gantt Ideal Multi-Proyecto (Suite Google)

### Diseño de datos
- [ ] **ID obligatorio autogenerado**: ID permanente por tarea para evitar que ediciones rompan referencias. `high` — 2026-02-16
- [ ] **Columna Proyecto obligatoria**: Proyecto explícito (+ opcionalmente Programa/Producto/Cohorte). `high` — 2026-02-16
- [ ] **Estado normalizado (enum)**: No iniciado / En curso / Bloqueado / Terminado / Cancelado. `high` — 2026-02-16
- [ ] **Dependencias**: Columna `Depende_de` (lista de IDs) para bloqueos y ruta crítica lite. `medium` — 2026-02-16
- [ ] **Links trazabilidad**: Columnas `Link_doc`, `Link_drive`, `Link_calendar`. `low` — 2026-02-16

### Automatización Apps Script (menú in-sheet)
- [ ] **Actualizar estados automáticamente**: Retrasado si HOY() > Fin y no Terminado; En curso si Inicio ≤ HOY() ≤ Fin. `high` — 2026-02-16
- [ ] **Dashboard KPIs**: Hoja nueva con KPIs por Proyecto/Responsable/Área (pendientes, atrasadas, próximas 2 semanas). `medium` — 2026-02-16
- [ ] **Exportar CSV**: Interoperabilidad con Jira/Asana/Calendar. `low` — 2026-02-16

### Integraciones Suite Google
- [ ] **Google Calendar**: Botón "Sincronizar hitos" (tareas con etiqueta hito o duración 0-1 día) → eventos. `medium` — 2026-02-16
- [ ] **Gmail/Drive**: Validar que enlaces en Material/Links existan y que la carpeta del proyecto esté bien. `low` — 2026-02-16
