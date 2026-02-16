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

    // 7. Auto-Sync Timeline Data
    refreshTimelineData();
    
    // 8. Auto-Sync Dashboard
    refreshDashboard();
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

/**
 * Refreshes the TIMELINE_DATA sheet with a structured 4-column format.
 */
function refreshTimelineData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tasksSheet = ss.getSheetByName(SHEET_TASKS);
  var timelineSheet = ss.getSheetByName(SHEET_TIMELINE);
  
  if (!tasksSheet || !timelineSheet) {
    Logger.log('Error: Hojas TASKS o TIMELINE_DATA no encontradas.');
    return;
  }
  
  // Clear existing data rows (2 downwards)
  var lastTimelineRow = timelineSheet.getLastRow();
  if (lastTimelineRow > 1) {
    timelineSheet.getRange(2, 1, lastTimelineRow - 1, HEADERS_TIMELINE.length).clear();
  }
  
  var hMap = getHeaderMap_(tasksSheet);
  var lastTaskRow = tasksSheet.getLastRow();
  if (lastTaskRow < 2) return;
  
  var tasksValues = tasksSheet.getRange(2, 1, lastTaskRow - 1, Object.keys(hMap).length).getValues();
  
  var proyectoIdx = getColIndex_(hMap, 'Proyecto') - 1;
  var tareaIdx = getColIndex_(hMap, 'Tarea') - 1;
  var inicioIdx = getColIndex_(hMap, 'Inicio') - 1;
  var finIdx = getColIndex_(hMap, 'Fin') - 1;
  
  var timelineRows = [];
  tasksValues.forEach(function(row) {
    var proyecto = row[proyectoIdx];
    var tarea = row[tareaIdx];
    var inicio = row[inicioIdx];
    var fin = row[finIdx];
    
    // Filter out rows missing required chart data
    if (proyecto && tarea && inicio instanceof Date && !isNaN(inicio.getTime()) && fin instanceof Date && !isNaN(fin.getTime())) {
      timelineRows.push([proyecto, tarea, inicio, fin]);
    }
  });
  
  if (timelineRows.length > 0) {
    timelineSheet.getRange(2, 1, timelineRows.length, HEADERS_TIMELINE.length).setValues(timelineRows);
  }
  
  Logger.log('TIMELINE_DATA refrescada: ' + timelineRows.length + ' tareas.');
}

/**
 * Computes KPIs and populates the DASHBOARD sheet.
 */
function refreshDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dashboardSheet = ss.getSheetByName(SHEET_DASHBOARD);
  var tasksSheet = ss.getSheetByName(SHEET_TASKS);
  var projectsSheet = ss.getSheetByName(SHEET_PROJECTS);
  
  if (!dashboardSheet || !tasksSheet || !projectsSheet) {
    Logger.log('Error: Hojas requeridas no encontradas para el Dashboard.');
    return;
  }
  
  // 1. Data Retrieval
  var tMap = getHeaderMap_(tasksSheet);
  var pMap = getHeaderMap_(projectsSheet);
  
  var tasksValues = tasksSheet.getRange(2, 1, tasksSheet.getLastRow() - 1, Object.keys(tMap).length).getValues();
  var projectsValues = projectsSheet.getRange(2, 1, projectsSheet.getLastRow() - 1, Object.keys(pMap).length).getValues();
  
  var tEstadoIdx = getColIndex_(tMap, 'Estado') - 1;
  var tFinIdx = getColIndex_(tMap, 'Fin') - 1;
  var tProyectoIdx = getColIndex_(tMap, 'Proyecto') - 1;
  var tTareaIdx = getColIndex_(tMap, 'Tarea') - 1;
  
  var pNombreIdx = getColIndex_(pMap, 'Nombre') - 1;
  var pOwnerIdx = getColIndex_(pMap, 'Owner') - 1;
  var pEstadoIdx = getColIndex_(pMap, 'Estado') - 1;
  
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // 2. Compute Global KPIs
  var totalTasks = 0;
  var completedTasks = 0;
  var overdueTasks = 0;
  var statusCounts = {};
  VALID_STATUSES.forEach(function(s) { statusCounts[s] = 0; });
  
  var projectStats = {}; // {projectName: {total, completed, overdue, owner, status}}
  projectsValues.forEach(function(pRow) {
    var pName = pRow[pNombreIdx];
    if (pName) {
      projectStats[pName] = {
        total: 0,
        completed: 0,
        overdue: 0,
        owner: pRow[pOwnerIdx],
        status: pRow[pEstadoIdx]
      };
    }
  });
  
  tasksValues.forEach(function(row) {
    if (!row[tTareaIdx]) return;
    totalTasks++;
    
    var estado = row[tEstadoIdx];
    var fin = row[tFinIdx];
    var project = row[tProyectoIdx];
    
    if (statusCounts.hasOwnProperty(estado)) statusCounts[estado]++;
    
    var isDone = (estado === 'Terminado');
    var isCanceled = (estado === 'Cancelado');
    
    if (isDone) completedTasks++;
    
    if (!isDone && !isCanceled && fin instanceof Date && fin < today) {
      overdueTasks++;
      if (projectStats[project]) projectStats[project].overdue++;
    }
    
    if (projectStats[project]) {
      projectStats[project].total++;
      if (isDone) projectStats[project].completed++;
    }
  });
  
  // 3. Write Dashboard
  dashboardSheet.clear();
  var output = [];
  
  // Section A: Header
  output.push(['📊 Dashboard', '']);
  output.push(['Última actualización:', new Date().toLocaleString()]);
  output.push(['', '']);
  
  // Section B: Global KPIs
  output.push(['INDICADORES GLOBALES', '']);
  output.push(['Total Proyectos', projectsValues.length]);
  output.push(['Total Tareas', totalTasks]);
  output.push(['Tareas completadas', completedTasks]);
  var completionRate = totalTasks > 0 ? (completedTasks / totalTasks) : 0;
  output.push(['% Completado General', (completionRate * 100).toFixed(1) + '%']);
  output.push(['Tareas vencidas ⚠️', overdueTasks]);
  output.push(['', '']);
  
  // Section C: Status Breakdown
  output.push(['ESTADO DE TAREAS', '']);
  for (var status in statusCounts) {
    output.push([status, statusCounts[status]]);
  }
  output.push(['', '']);
  
  // Section D: Per-Project Summary
  output.push(['RESUMEN POR PROYECTO', '', '', '', '', '', '']);
  output.push(['Proyecto', 'Owner', 'Total Tareas', 'Completadas', '%', 'Vencidas', 'Estado']);
  
  for (var pName in projectStats) {
    var stat = projectStats[pName];
    var pRate = stat.total > 0 ? (stat.completed / stat.total) : 0;
    output.push([
      pName,
      stat.owner,
      stat.total,
      stat.completed,
      (pRate * 100).toFixed(1) + '%',
      stat.overdue,
      stat.status
    ]);
  }
  
  // Write all at once
  dashboardSheet.getRange(1, 1, output.length, output[0].length).setValues(output);
  
  // Formatting
  dashboardSheet.getRange('A1').setFontSize(14).setFontWeight('bold');
  dashboardSheet.getRange('A4:A10').setFontWeight('bold');
  dashboardSheet.getRange('A12').setFontWeight('bold');
  dashboardSheet.getRange('A' + (14 + VALID_STATUSES.length)).setFontWeight('bold');
  // Bold project headers row
  var projectHeadersRow = 15 + VALID_STATUSES.length;
  dashboardSheet.getRange(projectHeadersRow, 1, 1, 7).setFontWeight('bold');
  
  SpreadsheetApp.flush();
}

/**
 * Generates a filtered view of tasks grouped by project in the VIEWS sheet.
 */
function viewByProject() {
  generateGroupedView_('Proyecto', [
    'Tarea', 
    'Responsable', 
    'Inicio', 
    'Fin', 
    'Estado'
  ], '📁');
  SpreadsheetApp.getUi().alert('Vista por proyecto generada.');
}

/**
 * Generates a filtered view of tasks grouped by responsible person in the VIEWS sheet.
 */
function viewByResponsible() {
  generateGroupedView_('Responsable', [
    'Proyecto', 
    'Tarea', 
    'Inicio', 
    'Fin', 
    'Estado'
  ], '👤');
  SpreadsheetApp.getUi().alert('Vista por responsable generada.');
}

/**
 * Helper to generate grouped views.
 * 
 * @param {string} groupByKey - The column header name to group by.
 * @param {Array<string>} detailHeaders - The column header names to show as details.
 * @param {string} icon - Icon prefix for the group header.
 */
function generateGroupedView_(groupByKey, detailHeaders, icon) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tasksSheet = ss.getSheetByName(SHEET_TASKS);
  var viewsSheet = ss.getSheetByName(SHEET_VIEWS);
  
  if (!tasksSheet || !viewsSheet) return;
  
  viewsSheet.clear();
  var hMap = getHeaderMap_(tasksSheet);
  var lastRow = tasksSheet.getLastRow();
  if (lastRow < 2) return;
  
  var data = tasksSheet.getRange(2, 1, lastRow - 1, Object.keys(hMap).length).getValues();
  var groupIdx = getColIndex_(hMap, groupByKey) - 1;
  
  // 1. Group Data
  var groups = {}; // {groupName: [row, row, ...]}
  data.forEach(function(row) {
    if (!row[getColIndex_(hMap, 'Tarea') - 1]) return; // Skip empty tasks
    
    var val = row[groupIdx] || 'Sin asignar';
    if (!groups[val]) groups[val] = [];
    groups[val].push(row);
  });
  
  // 2. Sort Group Names
  var groupNames = Object.keys(groups).sort();
  
  // 3. Prepare Output
  var output = [];
  var formats = []; // {row, col, numRows, numCols, bold, merge}
  
  groupNames.forEach(function(gName) {
    // Header Row
    var headerRowIdx = output.length + 1;
    output.push([icon + ' ' + gName, '', '', '', '', '']); // 6 columns
    formats.push({row: headerRowIdx, col: 1, r: 1, c: 5, bold: true, merge: true});
    
    // Sub-headers
    output.push(detailHeaders);
    formats.push({row: output.length, col: 1, r: 1, c: detailHeaders.length, bold: true, merge: false});
    
    // Task Data (sorted by start date)
    var tasks = groups[gName].sort(function(a, b) {
      var d1 = a[getColIndex_(hMap, 'Inicio') - 1];
      var d2 = b[getColIndex_(hMap, 'Inicio') - 1];
      return (d1 instanceof Date ? d1 : 0) - (d2 instanceof Date ? d2 : 0);
    });
    
    tasks.forEach(function(row) {
      var detailRow = detailHeaders.map(function(h) {
        var val = row[getColIndex_(hMap, h) - 1];
        if (val instanceof Date) return val.toLocaleDateString();
        return val;
      });
      output.push(detailRow);
    });
    
    output.push(['', '', '', '', '', '']); // Spacer
  });
  
  // 4. Write Data
  if (output.length > 0) {
    viewsSheet.getRange(1, 1, output.length, detailHeaders.length).setValues(output.map(function(r) {
       return r.slice(0, detailHeaders.length);
    }));
    
    // Apply Formatting
    formats.forEach(function(f) {
      var range = viewsSheet.getRange(f.row, f.col, f.r, f.c);
      if (f.bold) range.setFontWeight('bold');
      if (f.merge) range.mergeAcross();
    });
  }
}
