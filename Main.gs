/**
 * Main Entry Point and Menu
 */

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Gantt ⚙️')
      .addItem('Inicializar / reparar estructura', 'initStructure')
      .addItem('Generar calendario', 'buildCalendarFromConfig')
      .addItem('Refrescar vista Gantt', 'refreshGanttView')
      .addItem('Validar datos', 'runFullValidation')
      .addItem('Rollover anual', 'rolloverToNextYear')
      .addSeparator()
      .addItem('Gestionar proyectos', 'manageProjects')
      .addToUi();
}

/**
 * Placeholder for project management UI.
 */
function manageProjects() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_PROJECTS);
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Error: Hoja PROJECTS no encontrada.');
    return;
  }
  
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    SpreadsheetApp.getUi().alert('No hay proyectos registrados.');
    return;
  }
  
  var msg = 'Proyectos actuales:\n';
  for (var i = 1; i < data.length; i++) {
    msg += '- ' + data[i][1] + ' (' + data[i][5] + ')\n';
  }
  SpreadsheetApp.getUi().alert(msg);
}

/**
 * Initializes or repairs the spreadsheet structure.
 * Creates missing sheets and sets up headers.
 */
function initStructure() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Ensure CONFIG sheet
  var configSheet = ss.getSheetByName(SHEET_CONFIG);
  if (!configSheet) {
    configSheet = ss.insertSheet(SHEET_CONFIG);
    configSheet.getRange('A1:A3').setValues([['Año'], ['Mes'], ['MesFin']]);
    configSheet.getRange('B1').setValue(DEFAULT_YEAR);
    configSheet.getRange('B2').setValue(DEFAULT_MONTH);
    configSheet.getRange('B3').setValue(DEFAULT_MONTH_END);
  } else {
    // Ensure MesFin row exists in established CONFIG sheets
    if (configSheet.getLastRow() < 3) {
      configSheet.getRange('A3').setValue('MesFin');
      configSheet.getRange('B3').setValue(configSheet.getRange('B2').getValue()); // Default to same as Mes
    }
  }
  
  // 2. Ensure PROJECTS sheet
  var projectsSheet = ss.getSheetByName(SHEET_PROJECTS);
  if (!projectsSheet) {
    projectsSheet = ss.insertSheet(SHEET_PROJECTS);
    projectsSheet.getRange(1, 1, 1, HEADERS_PROJECTS.length).setValues([HEADERS_PROJECTS]);
    projectsSheet.getRange(1, 1, 1, HEADERS_PROJECTS.length).setFontWeight('bold');
  }
  
  // 3. Ensure TASKS sheet
  var tasksSheet = ss.getSheetByName(SHEET_TASKS);
  if (!tasksSheet) {
    tasksSheet = ss.insertSheet(SHEET_TASKS);
  }
  
  // Update or set TASKS headers
  var currentTasksHeaders = tasksSheet.getLastColumn() > 0 ? tasksSheet.getRange(1, 1, 1, tasksSheet.getLastColumn()).getValues()[0] : [];
  if (currentTasksHeaders.length === 0) {
    tasksSheet.getRange(1, 1, 1, HEADERS_TASKS.length).setValues([HEADERS_TASKS]);
    tasksSheet.getRange(1, 1, 1, HEADERS_TASKS.length).setFontWeight('bold');
  } else {
    // Basic sync: if headers don't match exactly, we alert but don't force overwrite to protect data
    // In Phase 5 we will add a more robust migrator.
    if (JSON.stringify(currentTasksHeaders) !== JSON.stringify(HEADERS_TASKS)) {
      Logger.log('Advertencia: Los encabezados de TASKS no coinciden con la configuración. Se recomienda revisión manual.');
    }
  }
  
  // Add Estado validation to TASKS
  var hMap = getHeaderMap_(tasksSheet);
  try {
    var estadoCol = getColIndex_(hMap, 'Estado');
    var range = tasksSheet.getRange(2, estadoCol, tasksSheet.getMaxRows() - 1, 1);
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(VALID_STATUSES).build();
    range.setDataValidation(rule);
  } catch (e) {
    Logger.log('No se pudo aplicar validación de Estado: ' + e.message);
  }
  
  // 4. Ensure LOOKUPS sheet
  if (!ss.getSheetByName(SHEET_LOOKUPS)) {
    ss.insertSheet(SHEET_LOOKUPS);
  }
  
  // 5. Ensure GANTT_VIEW sheet
  var ganttSheet = ss.getSheetByName(SHEET_GANTT);
  if (!ganttSheet) {
    ganttSheet = ss.insertSheet(SHEET_GANTT);
  }
  ganttSheet.protect().setWarningOnly(true).setDescription('Hoja generada automáticamente por script.');

  // 6. Ensure ISSUES sheet
  var issuesSheet = ss.getSheetByName(SHEET_ISSUES);
  if (!issuesSheet) {
    issuesSheet = ss.insertSheet(SHEET_ISSUES);
    issuesSheet.getRange(1, 1, 1, HEADERS_ISSUES.length).setValues([HEADERS_ISSUES]);
    issuesSheet.getRange(1, 1, 1, HEADERS_ISSUES.length).setFontWeight('bold');
  }
  issuesSheet.protect().setWarningOnly(true).setDescription('Hoja generada automáticamente por validación.');

  // --- Post-Structure Validation Setup ---
  
  // Apply Estado validation to PROJECTS
  var pMap = getHeaderMap_(projectsSheet);
  try {
    var pEstadoCol = getColIndex_(pMap, 'Estado');
    var pRange = projectsSheet.getRange(2, pEstadoCol, projectsSheet.getMaxRows() - 1, 1);
    var pRule = SpreadsheetApp.newDataValidation().requireValueInList(VALID_STATUSES).build();
    pRange.setDataValidation(pRule);
  } catch (e) {
    Logger.log('No se pudo aplicar validación de Estado en PROJECTS: ' + e.message);
  }

  // Apply Proyecto validation to TASKS (references PROJECTS.Nombre)
  try {
    var tMap = getHeaderMap_(tasksSheet);
    var tProyectoCol = getColIndex_(tMap, 'Proyecto');
    var pNombreCol = getColIndex_(pMap, 'Nombre');
    
    var tRange = tasksSheet.getRange(2, tProyectoCol, tasksSheet.getMaxRows() - 1, 1);
    var pSourceRange = projectsSheet.getRange(2, pNombreCol, projectsSheet.getMaxRows() - 1, 1);
    var tRule = SpreadsheetApp.newDataValidation().requireValueInRange(pSourceRange).build();
    tRange.setDataValidation(tRule);
  } catch (e) {
    Logger.log('No se pudo aplicar validación de Proyecto en TASKS: ' + e.message);
  }
  
  SpreadsheetApp.getUi().alert('Estructura inicializada / verificada correctamente.');
}

// Placeholder functions to avoid errors before they are implemented





