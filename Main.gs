/**
 * Main Entry Point and Menu
 */

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Gantt ⚙️')
      .addItem('Inicializar / reparar estructura', 'initStructure')
      .addItem('Generar calendario', 'buildCalendarFromConfig')
      .addItem('Refrescar vista Gantt', 'refreshGanttView')
      .addItem('Rollover anual', 'rolloverToNextYear')
      .addToUi();
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
    configSheet.getRange('A1').setValue('Año');
    configSheet.getRange('A2').setValue('Mes');
    configSheet.getRange('B1').setValue(DEFAULT_YEAR);
    configSheet.getRange('B2').setValue(DEFAULT_MONTH);
  }
  
  // 2. Ensure TASKS sheet
  var tasksSheet = ss.getSheetByName(SHEET_TASKS);
  if (!tasksSheet) {
    tasksSheet = ss.insertSheet(SHEET_TASKS);
  }
  
  // Check if TASKS header is empty or missing
  if (tasksSheet.getLastRow() === 0) {
    tasksSheet.getRange(1, 1, 1, HEADERS_TASKS.length).setValues([HEADERS_TASKS]);
  }
  
  // 3. Ensure LOOKUPS sheet
  if (!ss.getSheetByName(SHEET_LOOKUPS)) {
    ss.insertSheet(SHEET_LOOKUPS);
  }
  
  // 4. Ensure GANTT_VIEW sheet
  if (!ss.getSheetByName(SHEET_GANTT)) {
    ss.insertSheet(SHEET_GANTT);
  }
  
  SpreadsheetApp.getUi().alert('Estructura inicializada / verificada correctamente.');
}

// Placeholder functions to avoid errors before they are implemented
function buildCalendarFromConfig() {
  SpreadsheetApp.getUi().alert('Función no implementada aún.');
}

function refreshGanttView() {
  SpreadsheetApp.getUi().alert('Función no implementada aún.');
}

function rolloverToNextYear() {
  SpreadsheetApp.getUi().alert('Función no implementada aún.');
}
