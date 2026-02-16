/**
 * Sincroniza las tareas de la hoja TASKS con un calendario de Google.
 * Crea eventos de día completo para tareas activas (no terminadas ni canceladas).
 */
function syncTasksToCalendar() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt('Sincronizar con Google Calendar', 'Ingresa el nombre del calendario (se creará si no existe):', ui.ButtonSet.OK_CANCEL);
  
  if (response.getSelectedButton() !== ui.Button.OK) return;
  
  var calName = response.getResponseText().trim() || 'Gantt - Tareas';
  var calendar;
  var calendars = CalendarApp.getCalendarsByName(calName);
  
  if (calendars.length > 0) {
    calendar = calendars[0];
  } else {
    calendar = CalendarApp.createCalendar(calName);
    ui.alert('Se ha creado un nuevo calendario: ' + calName);
  }
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_TASKS);
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    ui.alert('No hay tareas para sincronizar.');
    return;
  }
  
  var hMap = getHeaderMap_(sheet);
  var colTarea = getColIndex_(hMap, 'Tarea');
  var colInicio = getColIndex_(hMap, 'Inicio');
  var colFin = getColIndex_(hMap, 'Fin');
  var colEstado = getColIndex_(hMap, 'Estado');
  var colProyecto = getColIndex_(hMap, 'Proyecto');
  var colResp = getColIndex_(hMap, 'Responsable');
  
  var createdCount = 0;
  var skippedCount = 0;
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var taskName = row[colTarea - 1];
    var startDate = row[colInicio - 1];
    var endDate = row[colFin - 1];
    var estado = row[colEstado - 1];
    var proyecto = row[colProyecto - 1];
    var responsable = row[colResp - 1];
    
    // Validar fechas y estado
    if (!taskName || !(startDate instanceof Date) || !(endDate instanceof Date)) {
      skippedCount++;
      continue;
    }
    
    if (estado === 'Terminado' || estado === 'Cancelado') {
      continue;
    }
    
    // Evitar duplicados simples (mismo nombre y dia de inicio)
    var existingEvents = calendar.getEvents(startDate, new Date(startDate.getTime() + 24 * 60 * 60 * 1000), {search: taskName});
    if (existingEvents.length > 0) {
      skippedCount++;
      continue;
    }
    
    // Crear evento de día completo
    // CalendarApp.createAllDayEvent(title, startDate, endDate) - endDate is exclusive for all-day events in some contexts, 
    // but the API docs say: createAllDayEvent(title, startDate, endDate) creates an event that lasts from startDate until endDate.
    var event = calendar.createAllDayEvent(taskName, startDate, endDate);
    
    // Descripción
    var desc = 'Proyecto: ' + proyecto + '\n' +
               'Responsable: ' + responsable + '\n' +
               'Estado: ' + estado + '\n' +
               'Sincronizado desde Gantt v2.0';
    event.setDescription(desc);
    
    // Color según estado
    if (estado === 'Bloqueado') {
      event.setColor(CalendarApp.EventColor.RED);
    } else if (estado === 'En curso') {
      event.setColor(CalendarApp.EventColor.CYAN);
    } else if (estado === 'No iniciado') {
      event.setColor(CalendarApp.EventColor.YELLOW);
    }
    
    createdCount++;
  }
  
  ui.alert('Sincronización completada.\nEventos creados: ' + createdCount + '\nOmitidos/Duplicados: ' + skippedCount);
}
