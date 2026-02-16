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
  
  var hMap = getHeaderMap_(tasksSheet);
  var numHeaders = Object.keys(hMap).length;
  
  var range = tasksSheet.getRange(2, 1, lastRow - 1, numHeaders);
  var values = range.getValues();
  var errors = [];
  
  var proyectoCol = getColIndex_(hMap, 'Proyecto') - 1;
  var tareaCol = getColIndex_(hMap, 'Tarea') - 1;
  var inicioCol = getColIndex_(hMap, 'Inicio') - 1;
  var finCol = getColIndex_(hMap, 'Fin') - 1;
  var estadoCol = getColIndex_(hMap, 'Estado') - 1;
  
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    var proyectoName = row[proyectoCol];
    var taskName = row[tareaCol];
    var startDate = row[inicioCol];
    var endDate = row[finCol];
    var estadoVal = row[estadoCol];
    var rowNum = i + 2;
    
    // Skip completely empty rows
    if (!proyectoName && !taskName && !startDate && !endDate && !estadoVal) continue;

    // Check headers presence/validity
    if (!proyectoName) errors.push('Fila ' + rowNum + ': Proyecto no especificado.');
    if (!taskName) errors.push('Fila ' + rowNum + ': Nombre de tarea vacío.');
    
    // Check if dates are valid
    var startIsValid = startDate instanceof Date && !isNaN(startDate);
    var endIsValid = endDate instanceof Date && !isNaN(endDate);
    
    if (startIsValid && endIsValid) {
      if (startDate > endDate) {
        errors.push('Fila ' + rowNum + ' (' + taskName + '): Inicio es posterior a Fin.');
      }
    } else {
      if (!startIsValid) errors.push('Fila ' + rowNum + ' (' + taskName + '): Fecha Inicio inválida.');
      if (!endIsValid) errors.push('Fila ' + rowNum + ' (' + taskName + '): Fecha Fin inválida.');
    }

    // Check status
    if (!VALID_STATUSES.includes(estadoVal)) {
      errors.push('Fila ' + rowNum + ' (' + taskName + '): Estado "' + estadoVal + '" no es válido.');
    }
  }
  
  if (errors.length > 0) {
    var message = 'Se encontraron ' + errors.length + ' errores:\n\n' + errors.slice(0, 10).join('\n');
    if (errors.length > 10) {
      message += '\n... y ' + (errors.length - 10) + ' más.';
    }
    SpreadsheetApp.getUi().alert(message);
  } else {
    SpreadsheetApp.getUi().alert('Validación completada: No se encontraron errores.');
  }
}

function formatDate_(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd/MM/yyyy');
}
