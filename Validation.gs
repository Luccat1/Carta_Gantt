/**
 * Runs the full validation suite for both Projects and Tasks.
 */
function runFullValidation() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var issuesSheet = ss.getSheetByName(SHEET_ISSUES);
  
  if (!issuesSheet) {
    issuesSheet = ss.insertSheet(SHEET_ISSUES);
    issuesSheet.getRange(1, 1, 1, HEADERS_ISSUES.length).setValues([HEADERS_ISSUES]);
    issuesSheet.getRange(1, 1, 1, HEADERS_ISSUES.length).setFontWeight('bold');
  } else {
    // Clear data rows
    var lastRow = issuesSheet.getLastRow();
    if (lastRow > 1) {
      issuesSheet.getRange(2, 1, lastRow - 1, HEADERS_ISSUES.length).clearContent();
    }
  }

  var allIssues = [];
  var timestamp = new Date();

  // 1. Validate Projects first
  var projectIssues = validateProjectsData_(ss, timestamp);
  allIssues = allIssues.concat(projectIssues);

  // 2. Validate Tasks
  var taskIssues = validateTasksData_(ss, timestamp);
  allIssues = allIssues.concat(taskIssues);

  // 3. Write results
  if (allIssues.length > 0) {
    issuesSheet.getRange(2, 1, allIssues.length, HEADERS_ISSUES.length).setValues(allIssues);
    SpreadsheetApp.getUi().alert('Se encontraron ' + allIssues.length + ' problemas. Revisa la hoja \"' + SHEET_ISSUES + '\" para más detalles.');
  } else {
    SpreadsheetApp.getUi().alert('Validación completada: No se encontraron problemas.');
  }
}

/**
 * Validates data in the PROJECTS sheet.
 * @private
 */
function validateProjectsData_(ss, timestamp) {
  var sheet = ss.getSheetByName(SHEET_PROJECTS);
  if (!sheet) return [];

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var hMap = getHeaderMap_(sheet);
  var values = sheet.getRange(2, 1, lastRow - 1, Object.keys(hMap).length).getValues();
  var issues = [];
  
  var idCol = getColIndex_(hMap, 'ProyectoID') - 1;
  var nombreCol = getColIndex_(hMap, 'Nombre') - 1;
  var inicioCol = getColIndex_(hMap, 'Inicio') - 1;
  var finCol = getColIndex_(hMap, 'Fin') - 1;
  var estadoCol = getColIndex_(hMap, 'Estado') - 1;

  var existingIds = {};

  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    var rowNum = i + 2;
    var projId = row[idCol];
    var nombre = row[nombreCol];
    var inicio = row[inicioCol];
    var fin = row[finCol];
    var estado = row[estadoCol];

    // Basic required fields
    if (!projId) issues.push([timestamp, SHEET_PROJECTS, rowNum, 'ProyectoID', 'ProyectoID es obligatorio.', 'Error']);
    if (!nombre) issues.push([timestamp, SHEET_PROJECTS, rowNum, 'Nombre', 'Nombre del proyecto es obligatorio.', 'Error']);
    
    // Duplicate ID check
    if (projId) {
      if (existingIds[projId]) {
        issues.push([timestamp, SHEET_PROJECTS, rowNum, 'ProyectoID', 'ID duplicado: ' + projId, 'Error']);
      }
      existingIds[projId] = true;
    }

    // Date logic
    if (inicio instanceof Date && fin instanceof Date) {
      if (inicio > fin) {
        issues.push([timestamp, SHEET_PROJECTS, rowNum, 'Inicio/Fin', 'La fecha de inicio es posterior a la de fin.', 'Error']);
      }
    }

    // Estado validation
    if (estado && !VALID_STATUSES.includes(estado)) {
      issues.push([timestamp, SHEET_PROJECTS, rowNum, 'Estado', 'Estado "' + estado + '" no es válido.', 'Advertencia']);
    }
  }
  return issues;
}

/**
 * Validates data in the TASKS sheet.
 * @private
 */
function validateTasksData_(ss, timestamp) {
  var sheet = ss.getSheetByName(SHEET_TASKS);
  if (!sheet) return [];

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var hMap = getHeaderMap_(sheet);
  var values = sheet.getRange(2, 1, lastRow - 1, Object.keys(hMap).length).getValues();
  var issues = [];

  var proyectoCol = getColIndex_(hMap, 'Proyecto') - 1;
  var idCol = getColIndex_(hMap, 'ID') - 1;
  var tareaCol = getColIndex_(hMap, 'Tarea') - 1;
  var inicioCol = getColIndex_(hMap, 'Inicio') - 1;
  var finCol = getColIndex_(hMap, 'Fin') - 1;
  var estadoCol = getColIndex_(hMap, 'Estado') - 1;

  // Get valid projects list for existence check
  var projectSheet = ss.getSheetByName(SHEET_PROJECTS);
  var validProjects = projectSheet ? projectSheet.getRange(2, getColIndex_(getHeaderMap_(projectSheet), 'Nombre'), projectSheet.getMaxRows() - 1, 1).getValues().flat().filter(String) : [];

  var existingIds = {};

  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    var rowNum = i + 2;
    var proyecto = row[proyectoCol];
    var taskId = row[idCol];
    var tarea = row[tareaCol];
    var inicio = row[inicioCol];
    var fin = row[finCol];
    var estado = row[estadoCol];

    // Skip empty rows (if 'Tarea' is empty)
    if (!tarea && !proyecto) continue;

    // Required fields
    if (!proyecto) issues.push([timestamp, SHEET_TASKS, rowNum, 'Proyecto', 'Proyecto no especificado.', 'Error']);
    else if (!validProjects.includes(proyecto)) {
      issues.push([timestamp, SHEET_TASKS, rowNum, 'Proyecto', 'El proyecto "' + proyecto + '" no existe en la hoja PROJECTS.', 'Error']);
    }

    if (!tarea) issues.push([timestamp, SHEET_TASKS, rowNum, 'Tarea', 'Nombre de tarea vacío.', 'Error']);
    if (!taskId) issues.push([timestamp, SHEET_TASKS, rowNum, 'ID', 'ID de tarea faltante.', 'Advertencia']);
    
    // Duplicate Task ID
    if (taskId) {
      if (existingIds[taskId]) {
        issues.push([timestamp, SHEET_TASKS, rowNum, 'ID', 'ID de tarea duplicado: ' + taskId, 'Error']);
      }
      existingIds[taskId] = true;
    }

    // Date Logic
    var startIsDate = inicio instanceof Date && !isNaN(inicio);
    var endIsDate = fin instanceof Date && !isNaN(fin);

    if (startIsDate && endIsDate) {
      if (inicio > fin) {
        issues.push([timestamp, SHEET_TASKS, rowNum, 'Inicio/Fin', 'Inicio posterior a Fin.', 'Error']);
      }
    } else {
      if (inicio && !startIsDate) issues.push([timestamp, SHEET_TASKS, rowNum, 'Inicio', 'Fecha Inicio inválida.', 'Error']);
      if (fin && !endIsDate) issues.push([timestamp, SHEET_TASKS, rowNum, 'Fin', 'Fecha Fin inválida.', 'Error']);
    }

    // Estado validation
    if (estado && !VALID_STATUSES.includes(estado)) {
      issues.push([timestamp, SHEET_TASKS, rowNum, 'Estado', 'Estado "' + estado + '" no es válido.', 'Advertencia']);
    }
  }
  return issues;
}

function formatDate_(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd/MM/yyyy');
}
