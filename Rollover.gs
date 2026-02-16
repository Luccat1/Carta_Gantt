/**
 * Rollover Logic
 */

function rolloverToNextYear() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var configSheet = ss.getSheetByName(SHEET_CONFIG);
  var tasksSheet = ss.getSheetByName(SHEET_TASKS);

  // 1. Get Current Year
  var currentYear = configSheet.getRange('B1').getValue();
  var nextYear = currentYear + 1;
  var cutoffDate = new Date(nextYear, 0, 1);

  // 2. Compute Summary
  var lastRow = tasksSheet.getLastRow();
  var archiveTasks = [];
  var keepTasks = [];
  var affectedProjects = new Set();
  var hMap = getHeaderMap_(tasksSheet);
  var numHeaders = Object.keys(hMap).length;

  if (lastRow > 1) {
    var range = tasksSheet.getRange(2, 1, lastRow - 1, numHeaders);
    var values = range.getValues();
    var finColIdx = getColIndex_(hMap, 'Fin') - 1;
    var estadoColIdx = getColIndex_(hMap, 'Estado') - 1;
    var proyectoColIdx = getColIndex_(hMap, 'Proyecto') - 1;

    for (var i = 0; i < values.length; i++) {
        var row = values[i];
        var endDate = row[finColIdx];
        var status = row[estadoColIdx];
        
        // Logical filter: only archive if Terminado/Cancelado AND before cutoff
        var isCompleted = (status === 'Terminado' || status === 'Cancelado');
        var isOld = (endDate instanceof Date && endDate < cutoffDate);

        if (isCompleted && isOld) {
            archiveTasks.push(row);
            affectedProjects.add(row[proyectoColIdx]);
        } else {
            keepTasks.push(row);
        }
    }
  }

  // 3. User Confirmation with Summary
  var ui = SpreadsheetApp.getUi();
  var summaryMsg = 
    'Resumen de Rollover:\n' +
    '- Tareas a archivar: ' + archiveTasks.length + '\n' +
    '- Tareas que se mantienen: ' + keepTasks.length + '\n' +
    '- Proyectos afectados: ' + affectedProjects.size + '\n\n' +
    'Se moverán las tareas finalizadas/canceladas del ' + currentYear + ' a una hoja de archivo.\n' +
    '¿Desea continuar?';

  var response = ui.alert('Rollover Anual', summaryMsg, ui.ButtonSet.YES_NO);
  if (response !== ui.Button.YES) return;

  // 4. Create Archive Sheet and Move
  var archiveSheetName = 'ARCHIVE_' + currentYear;
  var archiveSheet = ss.getSheetByName(archiveSheetName);
  if (!archiveSheet) {
    archiveSheet = ss.insertSheet(archiveSheetName);
    archiveSheet.getRange(1, 1, 1, numHeaders).setValues([HEADERS_TASKS]);
    archiveSheet.getRange(1, 1, 1, numHeaders).setFontWeight('bold');
  }

  if (archiveTasks.length > 0) {
    var lastArchiveRow = archiveSheet.getLastRow();
    archiveSheet.getRange(lastArchiveRow + 1, 1, archiveTasks.length, numHeaders).setValues(archiveTasks);
  }

  // Rewrite Tasks
  var rangeToClear = tasksSheet.getRange(2, 1, Math.max(lastRow - 1, 1), numHeaders);
  rangeToClear.clearContent();
  if (keepTasks.length > 0) {
    tasksSheet.getRange(2, 1, keepTasks.length, numHeaders).setValues(keepTasks);
  }

  // 5. Update Config
  configSheet.getRange('B1').setValue(nextYear);
  configSheet.getRange('B2').setValue(1); // Jan

  // 6. Regenerate & Auto-Status
  buildCalendarFromConfig();
  refreshGanttView(); // This already calls autoUpdateProjectStatuses_ and refreshDashboard
  
  ui.alert('Rollover completado exitosamente para el año ' + nextYear + '.');
}
