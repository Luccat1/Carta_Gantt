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

  // 2. User Confirmation
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert(
    'Rollover Anual',
    'Se archivarán las tareas finalizadas antes del ' + nextYear + ' y se avanzará al año ' + nextYear + '. ¿Continuar?',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return;
  }

  // 3. Create Archive Sheet
  var archiveSheetName = 'ARCHIVE_' + currentYear;
  var archiveSheet = ss.getSheetByName(archiveSheetName);
  if (!archiveSheet) {
    archiveSheet = ss.insertSheet(archiveSheetName);
    archiveSheet.getRange(1, 1, 1, HEADERS_TASKS.length).setValues([HEADERS_TASKS]);
    archiveSheet.getRange(1, 1, 1, HEADERS_TASKS.length).setFontWeight('bold');
  }

  // 4. Filter and Move Tasks
  var lastRow = tasksSheet.getLastRow();
  if (lastRow > 1) {
    var hMap = getHeaderMap_(tasksSheet);
    var numHeaders = Object.keys(hMap).length;
    var finColIdx = getColIndex_(hMap, 'Fin') - 1;
    
    var range = tasksSheet.getRange(2, 1, lastRow - 1, numHeaders);
    var values = range.getValues();
    var keepTasks = [];
    var archiveTasks = [];
    var cutoffDate = new Date(nextYear, 0, 1); // Jan 1st next year

    for (var i = 0; i < values.length; i++) {
        var row = values[i];
        // Col Fin
        var endDate = row[finColIdx];
        // Check if endDate is a valid date and strictly before cutoff
        if (endDate instanceof Date && endDate < cutoffDate) {
            archiveTasks.push(row);
        } else {
            keepTasks.push(row);
        }
    }

    // Write to Archive
    if (archiveTasks.length > 0) {
        var lastArchiveRow = archiveSheet.getLastRow();
        archiveSheet.getRange(lastArchiveRow + 1, 1, archiveTasks.length, numHeaders).setValues(archiveTasks);
    }

    // Rewrite Tasks
    // Clear old data
    range.clearContent();
    
    // Write remaining
    if (keepTasks.length > 0) {
        tasksSheet.getRange(2, 1, keepTasks.length, numHeaders).setValues(keepTasks);
    }
  }

  // 5. Update Config
  configSheet.getRange('B1').setValue(nextYear);
  configSheet.getRange('B2').setValue(1); // Set to Jan

  // 6. Regenerate
  buildCalendarFromConfig();
  refreshGanttView();

  ui.alert('Rollover completado exitosamente.');
}
