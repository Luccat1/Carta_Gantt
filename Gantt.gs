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
    
    // 5. Build Project Color Map
    var projectColorMap = {};
    var projectsSheet = ss.getSheetByName(SHEET_PROJECTS);
    if (projectsSheet) {
      var pLastRow = projectsSheet.getLastRow();
      if (pLastRow > 1) {
        var pMap = getHeaderMap_(projectsSheet);
        var pValues = projectsSheet.getRange(2, 1, pLastRow - 1, Object.keys(pMap).length).getValues();
        var pNameIdx = getColIndex_(pMap, 'Nombre') - 1;
        var pColorIdx = getColIndex_(pMap, 'Color') - 1;
        
        pValues.forEach(function(pRow) {
          if (pRow[pNameIdx] && pRow[pColorIdx]) {
            projectColorMap[pRow[pNameIdx]] = pRow[pColorIdx];
          }
        });
      }
    }
    
    // 6. Apply Formatting (Direct Backgrounds)
    if (typeof applyOverlapFormatting_ === 'function') {
      applyOverlapFormatting_(ganttSheet, hMap, weekData, validTasks, projectColorMap);
    }
  }
  
  SpreadsheetApp.flush();
}

/**
 * Applies direct background coloring to the Gantt grid based on task dates and project colors.
 * 
 * @param {Sheet} sheet - The GANTT_VIEW sheet.
 * @param {Object} hMap - Header map {name: index}.
 * @param {Array<Object>} weekData - Array of week objects {week, start, end, label}.
 * @param {Array<Array>} validTasks - The task data being displayed.
 * @param {Object} projectColorMap - Map of projectName -> colorHex.
 */
function applyOverlapFormatting_(sheet, hMap, weekData, validTasks, projectColorMap) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return; 
  
  var numStaticCols = Object.keys(hMap).length;
  var numWeeks = weekData.length;
  
  // Get the grid range (Rows 2 to LastRow, Column after static headers to End)
  var rangeToFormat = sheet.getRange(2, numStaticCols + 1, validTasks.length, numWeeks);
  
  // Initialize background array (null clears formatting)
  var backgrounds = [];
  for (var r = 0; r < validTasks.length; r++) {
    var rowBackgrounds = [];
    for (var w = 0; w < numWeeks; w++) {
      rowBackgrounds.push(null);
    }
    backgrounds.push(rowBackgrounds);
  }
  
  // Resolve columns for logic
  var inicioIdx = getColIndex_(hMap, 'Inicio') - 1;
  var finIdx = getColIndex_(hMap, 'Fin') - 1;
  var proyectoIdx = getColIndex_(hMap, 'Proyecto') - 1;
  
  // Iterate over tasks to compute overlap
  validTasks.forEach(function(task, rIdx) {
    var inicio = task[inicioIdx];
    var fin = task[finIdx];
    var proyecto = task[proyectoIdx];
    
    // Choose color: Project color or default
    var taskColor = projectColorMap[proyecto] || DEFAULT_COLOR;
    
    if (inicio instanceof Date && !isNaN(inicio) && fin instanceof Date && !isNaN(fin)) {
      weekData.forEach(function(week, wIdx) {
        // Logic: taskStart <= weekEnd AND taskEnd >= weekStart
        if (inicio <= week.end && fin >= week.start) {
          backgrounds[rIdx][wIdx] = taskColor;
        }
      });
    }
  });
  
  // Apply all backgrounds in a single batch operation
  rangeToFormat.setBackgrounds(backgrounds);
}
