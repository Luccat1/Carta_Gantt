/**
 * Calendar Logic
 */

/**
 * Generates the calendar structure in the LOOKUPS sheet based on CONFIG.
 */
function buildCalendarFromConfig() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var configSheet = ss.getSheetByName(SHEET_CONFIG);
  var lookupSheet = ss.getSheetByName(SHEET_LOOKUPS);

  if (!configSheet || !lookupSheet) {
    SpreadsheetApp.getUi().alert('Error: Hojas CONFIG o LOOKUPS no encontradas. Ejecuta "Inicializar estructura" primero.');
    return;
  }

  // Read Year and Month from B1, B2
  var year = configSheet.getRange('B1').getValue();
  var month = configSheet.getRange('B2').getValue();
  
  if (!year || !month) {
    SpreadsheetApp.getUi().alert('Error: Año o Mes inválidos en CONFIG.');
    return;
  }

  // Clear existing lookups
  lookupSheet.clear();
  
  // Set Headers
  lookupSheet.getRange('A1:D1').setValues([['Semana', 'Inicio', 'Fin', 'Etiqueta']]);
  
  // Get weeks
  var weeks = weeksOfMonth_(year, month);
  
  // Write rows
  var rows = weeks.map(function(w, i) {
    return ['S' + (i + 1), w.start, w.end, w.label];
  });
  
  lookupSheet.getRange(2, 1, rows.length, 4).setValues(rows);
  
  SpreadsheetApp.getUi().alert('Calendario generado para: ' + monthNameEs_(month) + ' ' + year);
}
