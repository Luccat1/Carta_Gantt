/**
 * Gantt View Logic
 */

/**
 * Refreshes the GANTT_VIEW sheet.
 * Rebuilds headers based on Config and Lookups, and copies task data.
 */
function refreshGanttView() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Get Sheets
  var tasksSheet = ss.getSheetByName(SHEET_TASKS);
  var lookupSheet = ss.getSheetByName(SHEET_LOOKUPS);
  var ganttSheet = ss.getSheetByName(SHEET_GANTT);
  
  if (!tasksSheet || !lookupSheet || !ganttSheet) {
    SpreadsheetApp.getUi().alert('Error: Hojas requeridas no encontradas. Ejecuta "Inicializar estructura".');
    return;
  }
  
  // 2. Clear Gantt View
  ganttSheet.clear();
  
  // 3. Prepare Headers
  // a) Static Headers from Config
  var headers = HEADERS_TASKS.slice(); // Copy array
  
  // b) Dynamic Week Headers from Lookups (Column D: Etiqueta)
  var lastLookupRow = lookupSheet.getLastRow();
  var weekLabels = [];
  var weekData = []; // Store week data for later use (Start, End)
  
  if (lastLookupRow > 1) {
    // Read A2:D(lastRow) -> Week, Start, End, Label
    var lookupRange = lookupSheet.getRange(2, 1, lastLookupRow - 1, 4);
    var lookupValues = lookupRange.getValues();
    
    for (var i = 0; i < lookupValues.length; i++) {
      var row = lookupValues[i];
      // row[3] is Label (e.g. "ene S1")
      weekLabels.push(row[3]);
      weekData.push({
        week: row[0],
        start: row[1],
        end: row[2],
        label: row[3]
      });
    }
  }
  
  // Combine headers
  var fullHeaders = headers.concat(weekLabels);
  
  // Write Headers
  ganttSheet.getRange(1, 1, 1, fullHeaders.length).setValues([fullHeaders]);
  ganttSheet.getRange(1, 1, 1, fullHeaders.length).setFontWeight('bold');
  
  // 4. Map Data
  var lastTaskRow = tasksSheet.getLastRow();
  if (lastTaskRow > 1) {
    // Read all task data (excluding header)
    var tasksRange = tasksSheet.getRange(2, 1, lastTaskRow - 1, HEADERS_TASKS.length);
    var tasksValues = tasksRange.getValues();
    
    // Filter empty rows (if any) based on 'Tarea' (Column B -> index 1)
    var validTasks = tasksValues.filter(function(row) {
      return row[1] !== ''; 
    });
    
    if (validTasks.length > 0) {
      // Write data to Gantt View
      ganttSheet.getRange(2, 1, validTasks.length, HEADERS_TASKS.length).setValues(validTasks);
    }
    
    // 5. Apply Conditional Formatting (Plan 2.2 placeholder -> to be implemented next)
    if (typeof applyOverlapConditionalFormatting_ === 'function') {
      applyOverlapConditionalFormatting_(ganttSheet, HEADERS_TASKS.length, weekData);
    }
  }
  
  SpreadsheetApp.flush();
  // Optional: Auto-resize columns
  // ganttSheet.autoResizeColumns(1, headers.length);
}
