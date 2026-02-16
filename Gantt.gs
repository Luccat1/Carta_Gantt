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
    var hMap = getHeaderMap_(tasksSheet);
    var numHeaders = Object.keys(hMap).length;
    
    // Read all task data (excluding header)
    var tasksRange = tasksSheet.getRange(2, 1, lastTaskRow - 1, numHeaders);
    var tasksValues = tasksRange.getValues();
    
    // Filter empty rows (if any) based on 'Tarea'
    var tareaColIdx = getColIndex_(hMap, 'Tarea') - 1;
    var validTasks = tasksValues.filter(function(row) {
      return row[tareaColIdx] !== ''; 
    });
    
    if (validTasks.length > 0) {
      // Write data to Gantt View
      ganttSheet.getRange(2, 1, validTasks.length, numHeaders).setValues(validTasks);
    }
    
    // 5. Apply Conditional Formatting
    if (typeof applyOverlapConditionalFormatting_ === 'function') {
      applyOverlapConditionalFormatting_(ganttSheet, hMap, weekData);
    }
  }
  
  SpreadsheetApp.flush();
  // Optional: Auto-resize columns
  // ganttSheet.autoResizeColumns(1, headers.length);
}

/**
 * Applies conditional formatting to the Gantt grid.
 * 
 * @param {Sheet} sheet - The GANTT_VIEW sheet.
 * @param {Object} hMap - Header map {name: index}.
 * @param {Array<Object>} weekData - Array of week objects {week, start, end, label}.
 */
function applyOverlapConditionalFormatting_(sheet, hMap, weekData) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return; // No data
  
  // Clear existing rules
  sheet.clearConditionalFormatRules();
  
  var rules = [];
  var numStaticCols = Object.keys(hMap).length;
  
  // Resolve Inicio and Fin columns
  var inicioCol = getColIndex_(hMap, 'Inicio');
  var finCol = getColIndex_(hMap, 'Fin');
  
  var inicioLetter = colToLetter_(inicioCol);
  var finLetter = colToLetter_(finCol);
  
  // Iterate over each week column
  for (var i = 0; i < weekData.length; i++) {
    var week = weekData[i];
    
    // Calculate the column index for this week (1-based)
    var colIndex = numStaticCols + 1 + i;
    
    // Define the range for this specific column (Row 2 to LastRow)
    var range = sheet.getRange(2, colIndex, lastRow - 1, 1);
    
    // Date formatting for formula
    var wStart = week.start;
    var wEnd = week.end;
    
    var sY = wStart.getFullYear();
    var sM = wStart.getMonth() + 1;
    var sD = wStart.getDate();
    
    var eY = wEnd.getFullYear();
    var eM = wEnd.getMonth() + 1;
    var eD = wEnd.getDate();
    
    // Formula: =AND($InicioCol2 <= WeekEnd, $FinCol2 >= WeekStart)
    var formula = '=AND($' + inicioLetter + '2<=DATE(' + eY + ',' + eM + ',' + eD + '),$' + finLetter + '2>=DATE(' + sY + ',' + sM + ',' + sD + '))';
    
    var rule = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(formula)
      .setBackground('#4a86e8') // Blue color
      .setRanges([range])
      .build();
      
    rules.push(rule);
  }
  
  sheet.setConditionalFormatRules(rules);
}
