/**
 * Data Validation
 */

function validateTasksData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tasksSheet = ss.getSheetByName(SHEET_TASKS);
  var lastRow = tasksSheet.getLastRow();
  
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert('No hay tareas para validar.');
    return;
  }
  
  var range = tasksSheet.getRange(2, 1, lastRow - 1, HEADERS_TASKS.length);
  var values = range.getValues();
  var errors = [];
  
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    var taskName = row[1]; // Col B
    var startDate = row[5]; // Col F (Index 5)
    var endDate = row[6]; // Col G (Index 6)
    var rowNum = i + 2;
    
    // Check if dates are valid
    var startIsValid = startDate instanceof Date && !isNaN(startDate);
    var endIsValid = endDate instanceof Date && !isNaN(endDate);
    
    if (startIsValid && endIsValid) {
      if (startDate > endDate) {
        errors.push('Fila ' + rowNum + ' (' + taskName + '): Inicio (' + formatDate_(startDate) + ') es posterior a Fin (' + formatDate_(endDate) + ').');
      }
    } else if (taskName !== '') {
      // Warn if dates are missing/invalid but task exists, excluding completely empty rows
         if (!startIsValid) errors.push('Fila ' + rowNum + ' (' + taskName + '): Fecha Inicio inválida.');
         if (!endIsValid) errors.push('Fila ' + rowNum + ' (' + taskName + '): Fecha Fin inválida.');
    }
  }
  
  if (errors.length > 0) {
    var message = 'Se encontraron ' + errors.length + ' errores:\n\n' + errors.slice(0, 10).join('\n');
    if (errors.length > 10) {
      message += '\n... y ' + (errors.length - 10) + ' más.';
    }
    SpreadsheetApp.getUi().alert(message);
  } else {
    SpreadsheetApp.getUi().alert('Validación completada: No se encontraron errores de fechas.');
  }
}

function formatDate_(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd/MM/yyyy');
}
