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

  // Read Year, Month (Start), and Month (End)
  var year = configSheet.getRange('B1').getValue();
  var monthStart = configSheet.getRange('B2').getValue();
  var monthEnd = configSheet.getRange('B3').getValue();
  
  if (!year || !monthStart) {
    SpreadsheetApp.getUi().alert('Error: Año o Mes inválidos en CONFIG.');
    return;
  }

  // Default monthEnd to monthStart if not provided or invalid
  if (!monthEnd || monthEnd < 1 || monthEnd > 12) {
    monthEnd = monthStart;
  }

  // Clear existing lookups
  lookupSheet.clear();
  
  // Set Headers
  lookupSheet.getRange('A1:D1').setValues([['Semana', 'Inicio', 'Fin', 'Etiqueta']]);
  
  var allRows = [];
  var currentYear = year;
  var currentMonth = monthStart;
  var weekCounter = 1;

  // Loop through months logic:
  // If monthEnd < monthStart, it implies a year wrap (e.g., Nov to Feb)
  var monthsToProcess = [];
  if (monthEnd >= monthStart) {
    for (var m = monthStart; m <= monthEnd; m++) {
      monthsToProcess.push({ month: m, year: currentYear });
    }
  } else {
    // Year wrap: monthStart to 12, then 1 to monthEnd
    for (var m = monthStart; m <= 12; m++) {
      monthsToProcess.push({ month: m, year: currentYear });
    }
    currentYear++;
    for (var m = 1; m <= monthEnd; m++) {
      monthsToProcess.push({ month: m, year: currentYear });
    }
  }

  monthsToProcess.forEach(function(item) {
    var weeks = weeksOfMonth_(item.year, item.month);
    weeks.forEach(function(w) {
      allRows.push(['S' + weekCounter++, w.start, w.end, w.label]);
    });
  });
  
  if (allRows.length > 0) {
    lookupSheet.getRange(2, 1, allRows.length, 4).setValues(allRows);
  }
  
  var labelStart = monthNameEs_(monthStart) + ' ' + year;
  var labelEnd = monthNameEs_(monthEnd) + ' ' + (monthEnd < monthStart ? year + 1 : year);
  
  SpreadsheetApp.getUi().alert('Calendario generado: ' + labelStart + (monthStart !== monthEnd ? ' – ' + labelEnd : ''));
}
