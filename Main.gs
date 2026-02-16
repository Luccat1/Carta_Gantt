/**
 * Main Entry Point and Menu
 */

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Gantt ⚙️')
      .addItem('➕ Nueva tarea', 'showNewTaskSidebar')
      .addSeparator()
      .addItem('Inicializar / reparar estructura', 'initStructure')
      .addItem('Generar calendario', 'buildCalendarFromConfig')
      .addItem('Refrescar vista Gantt', 'refreshGanttView')
      .addItem('Refrescar Timeline', 'refreshTimelineData')
      .addItem('Refrescar Dashboard', 'refreshDashboard')
      .addItem('Actualizar estados', 'updateProjectStatuses')
      .addSeparator()
      .createMenu('Vistas 📂')
          .addItem('Vista por Proyecto', 'viewByProject')
          .addItem('Vista por Responsable', 'viewByResponsible')
          .addToUi()
      .addItem('📋 Aplicar plantilla', 'applyTemplate')
      .addItem('Validar datos', 'runFullValidation')
      .addItem('Rollover anual', 'rolloverToNextYear')
      .addSeparator()
      .addItem('Gestionar proyectos', 'manageProjects')
      .addToUi();
}

/**
 * Placeholder for project management UI.
 */
function manageProjects() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_PROJECTS);
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Error: Hoja PROJECTS no encontrada.');
    return;
  }
  
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    SpreadsheetApp.getUi().alert('No hay proyectos registrados.');
    return;
  }
  
  var msg = 'Proyectos actuales:\n';
  for (var i = 1; i < data.length; i++) {
    msg += '- ' + data[i][1] + ' (' + data[i][5] + ')\n';
  }
  SpreadsheetApp.getUi().alert(msg);
}

/**
 * Initializes or repairs the spreadsheet structure.
 * Creates missing sheets and sets up headers.
 */
function initStructure() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Ensure CONFIG sheet
  var configSheet = ss.getSheetByName(SHEET_CONFIG);
  if (!configSheet) {
    configSheet = ss.insertSheet(SHEET_CONFIG);
    configSheet.getRange('A1:A3').setValues([['Año'], ['Mes'], ['MesFin']]);
    configSheet.getRange('B1').setValue(DEFAULT_YEAR);
    configSheet.getRange('B2').setValue(DEFAULT_MONTH);
    configSheet.getRange('B3').setValue(DEFAULT_MONTH_END);
  } else {
    // Ensure MesFin row exists in established CONFIG sheets
    if (configSheet.getLastRow() < 3) {
      configSheet.getRange('A3').setValue('MesFin');
      configSheet.getRange('B3').setValue(configSheet.getRange('B2').getValue()); // Default to same as Mes
    }
  }
  
  // 2. Ensure PROJECTS sheet
  var projectsSheet = ss.getSheetByName(SHEET_PROJECTS);
  if (!projectsSheet) {
    projectsSheet = ss.insertSheet(SHEET_PROJECTS);
    projectsSheet.getRange(1, 1, 1, HEADERS_PROJECTS.length).setValues([HEADERS_PROJECTS]);
    projectsSheet.getRange(1, 1, 1, HEADERS_PROJECTS.length).setFontWeight('bold');
  }
  
  // 3. Ensure TASKS sheet
  var tasksSheet = ss.getSheetByName(SHEET_TASKS);
  if (!tasksSheet) {
    tasksSheet = ss.insertSheet(SHEET_TASKS);
  }
  
  // Update or set TASKS headers
  var currentTasksHeaders = tasksSheet.getLastColumn() > 0 ? tasksSheet.getRange(1, 1, 1, tasksSheet.getLastColumn()).getValues()[0] : [];
  if (currentTasksHeaders.length === 0) {
    tasksSheet.getRange(1, 1, 1, HEADERS_TASKS.length).setValues([HEADERS_TASKS]);
    tasksSheet.getRange(1, 1, 1, HEADERS_TASKS.length).setFontWeight('bold');
  } else {
    // Basic sync: if headers don't match exactly, we alert but don't force overwrite to protect data
    // In Phase 5 we will add a more robust migrator.
    if (JSON.stringify(currentTasksHeaders) !== JSON.stringify(HEADERS_TASKS)) {
      Logger.log('Advertencia: Los encabezados de TASKS no coinciden con la configuración. Se recomienda revisión manual.');
    }
  }
  
  // Add Estado validation to TASKS
  var hMap = getHeaderMap_(tasksSheet);
  try {
    var estadoCol = getColIndex_(hMap, 'Estado');
    var range = tasksSheet.getRange(2, estadoCol, tasksSheet.getMaxRows() - 1, 1);
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(VALID_STATUSES).build();
    range.setDataValidation(rule);
  } catch (e) {
    Logger.log('No se pudo aplicar validación de Estado: ' + e.message);
  }
  
  // 4. Ensure LOOKUPS sheet
  if (!ss.getSheetByName(SHEET_LOOKUPS)) {
    ss.insertSheet(SHEET_LOOKUPS);
  }
  
  // 5. Ensure GANTT_VIEW sheet
  var ganttSheet = ss.getSheetByName(SHEET_GANTT);
  if (!ganttSheet) {
    ganttSheet = ss.insertSheet(SHEET_GANTT);
  }
  ganttSheet.protect().setWarningOnly(true).setDescription('Hoja generada automáticamente por script.');

  // 6. Ensure ISSUES sheet
  var issuesSheet = ss.getSheetByName(SHEET_ISSUES);
  if (!issuesSheet) {
    issuesSheet = ss.insertSheet(SHEET_ISSUES);
    issuesSheet.getRange(1, 1, 1, HEADERS_ISSUES.length).setValues([HEADERS_ISSUES]);
    issuesSheet.getRange(1, 1, 1, HEADERS_ISSUES.length).setFontWeight('bold');
  }
  issuesSheet.protect().setWarningOnly(true).setDescription('Hoja generada automáticamente por validación.');

  timelineSheet.protect().setWarningOnly(true).setDescription('Hoja generada automáticamente por script.');

  dashboardSheet.protect().setWarningOnly(true).setDescription('Hoja generada automáticamente por script.');

  // 9. Ensure VIEWS sheet
  var viewsSheet = ss.getSheetByName(SHEET_VIEWS);
  if (!viewsSheet) {
    viewsSheet = ss.insertSheet(SHEET_VIEWS);
  }
  viewsSheet.protect().setWarningOnly(true).setDescription('Hoja generada automáticamente por script.');

  // 10. Ensure TEMPLATES sheet
  var templatesSheet = ss.getSheetByName(SHEET_TEMPLATES);
  if (!templatesSheet) {
    templatesSheet = ss.insertSheet(SHEET_TEMPLATES);
    templatesSheet.getRange(1, 1, 1, HEADERS_TEMPLATES.length).setValues([HEADERS_TEMPLATES]);
    templatesSheet.getRange(1, 1, 1, HEADERS_TEMPLATES.length).setFontWeight('bold');
    // Add example template row
    templatesSheet.appendRow(['Básico', 'Inicio Proyecto', 'Gestión', 'Planning', '', 5]);
  }
  templatesSheet.protect().setWarningOnly(true).setDescription('Define plantillas de tareas aquí.');

  // 11. Ensure APPSHEET_CONFIG sheet
  var appsheetSheet = ss.getSheetByName(SHEET_APPSHEET);
  if (!appsheetSheet) {
    appsheetSheet = ss.insertSheet(SHEET_APPSHEET);
    appsheetSheet.getRange(1, 1, 1, HEADERS_APPSHEET.length).setValues([HEADERS_APPSHEET]);
    appsheetSheet.getRange(1, 1, 1, HEADERS_APPSHEET.length).setFontWeight('bold');
    
    // Seed rows
    var seedData = [
      ['Tabla Principal', 'TASKS', 'Hoja de tareas para AppSheet'],
      ['Tabla Proyectos', 'PROJECTS', 'Hoja de proyectos para AppSheet'],
      ['Columna Clave TASKS', 'ID', 'Clave única de cada tarea'],
      ['Columna Clave PROJECTS', 'ProyectoID', 'Clave única de cada proyecto'],
      ['Columna Ref', 'Proyecto', 'Referencia de TASKS→PROJECTS (usa Nombre)']
    ];
    appsheetSheet.getRange(2, 1, seedData.length, seedData[0].length).setValues(seedData);
  }
  appsheetSheet.protect().setWarningOnly(true).setDescription('Hoja de configuración para AppSheet.');

  // --- Post-Structure Validation Setup ---
  
  // Ensure Row IDs
  ensureRowIds_(tasksSheet, 'ID');
  ensureRowIds_(projectsSheet, 'ProyectoID');
  
  // Apply Estado validation to PROJECTS
  var pMap = getHeaderMap_(projectsSheet);
  try {
    var pEstadoCol = getColIndex_(pMap, 'Estado');
    var pRange = projectsSheet.getRange(2, pEstadoCol, projectsSheet.getMaxRows() - 1, 1);
    var pRule = SpreadsheetApp.newDataValidation().requireValueInList(VALID_STATUSES).build();
    pRange.setDataValidation(pRule);
  } catch (e) {
    Logger.log('No se pudo aplicar validación de Estado en PROJECTS: ' + e.message);
  }

  // Apply Proyecto validation to TASKS (references PROJECTS.Nombre)
  try {
    var tMap = getHeaderMap_(tasksSheet);
    var tProyectoCol = getColIndex_(tMap, 'Proyecto');
    var pNombreCol = getColIndex_(pMap, 'Nombre');
    
    var tRange = tasksSheet.getRange(2, tProyectoCol, tasksSheet.getMaxRows() - 1, 1);
    var pSourceRange = projectsSheet.getRange(2, pNombreCol, projectsSheet.getMaxRows() - 1, 1);
    var tRule = SpreadsheetApp.newDataValidation().requireValueInRange(pSourceRange).build();
    tRange.setDataValidation(tRule);
  } catch (e) {
    Logger.log('No se pudo aplicar validación de Proyecto en TASKS: ' + e.message);
  }
  
  SpreadsheetApp.getUi().alert('Estructura inicializada / verificada correctamente.');
}


/**
 * Opens the sidebar for adding a new task.
 */
function showNewTaskSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Nueva Tarea')
      .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Returns a unique list of project names for the sidebar dropdown.
 */
function getProjectNames() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_PROJECTS);
  if (!sheet) return [];
  
  var hMap = getHeaderMap_(sheet);
  var nameCol = getColIndex_(hMap, 'Nombre');
  var data = sheet.getRange(2, nameCol, sheet.getLastRow() - 1, 1).getValues();
  
  return data.map(function(row) { return row[0]; }).filter(function(name) { return name !== ""; });
}

/**
 * Returns the list of valid statuses for the sidebar dropdown.
 */
function getValidStatuses() {
  return VALID_STATUSES;
}

/**
 * Appends a new task from the sidebar data.
 */
function addTaskFromSidebar(formData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_TASKS);
  if (!sheet) throw new Error('Hoja TASKS no encontrada.');
  
  var hMap = getHeaderMap_(sheet);
  var numCols = Object.keys(hMap).length;
  var row = new Array(numCols).fill("");
  
  // Map formData to row based on headers
  row[getColIndex_(hMap, 'Proyecto') - 1] = formData.Proyecto;
  row[getColIndex_(hMap, 'ID') - 1] = generateTaskId_();
  row[getColIndex_(hMap, 'Area') - 1] = formData.Area;
  row[getColIndex_(hMap, 'Tarea') - 1] = formData.Tarea;
  row[getColIndex_(hMap, 'Responsable') - 1] = formData.Responsable;
  
  // Dates from <input type="date"> are "YYYY-MM-DD"
  if (formData.Inicio) row[getColIndex_(hMap, 'Inicio') - 1] = new Date(formData.Inicio + 'T00:00:00');
  if (formData.Fin) row[getColIndex_(hMap, 'Fin') - 1] = new Date(formData.Fin + 'T00:00:00');
  row[getColIndex_(hMap, 'Estado') - 1] = formData.Estado;
  
  sheet.appendRow(row);
  return 'Tarea añadida correctamente: ' + formData.Tarea;
}

/**
 * Applies a project template to the TASKS sheet.
 */
function applyTemplate() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var templatesSheet = ss.getSheetByName(SHEET_TEMPLATES);
  var projectsSheet = ss.getSheetByName(SHEET_PROJECTS);
  var tasksSheet = ss.getSheetByName(SHEET_TASKS);
  
  if (!templatesSheet || !projectsSheet || !tasksSheet) {
    SpreadsheetApp.getUi().alert('Error: No se encontraron las hojas necesarias (TEMPLATES, PROJECTS o TASKS).');
    return;
  }
  
  // 1. Get unique template names
  var tData = templatesSheet.getDataRange().getValues();
  if (tData.length <= 1) {
    SpreadsheetApp.getUi().alert('No hay plantillas definidas en la hoja TEMPLATES.');
    return;
  }
  
  var templateNames = [...new Set(tData.slice(1).map(row => row[0]).filter(val => val !== ""))];
  
  // 2. Get project names
  var projectNames = getProjectNames();
  
  // 3. Prompt user for Template and Project
  // We use a simple prompt since we don't have a complex UI yet
  var ui = SpreadsheetApp.getUi();
  var templateMsg = 'Plantillas disponibles:\n' + templateNames.join(', ') + '\n\nEscriba el nombre exacto de la plantilla:';
  var tPrompt = ui.prompt('Aplicar Plantilla', templateMsg, ui.ButtonSet.OK_CANCEL);
  if (tPrompt.getSelectedButton() !== ui.Button.OK) return;
  var selectedTemplate = tPrompt.getResponseText();
  
  if (!templateNames.includes(selectedTemplate)) {
    ui.alert('Error: Plantilla no válida.');
    return;
  }
  
  var projectMsg = 'Proyectos disponibles:\n' + projectNames.join(', ') + '\n\nEscriba el nombre del proyecto destino:';
  var pPrompt = ui.prompt('Aplicar Plantilla', projectMsg, ui.ButtonSet.OK_CANCEL);
  if (pPrompt.getSelectedButton() !== ui.Button.OK) return;
  var selectedProject = pPrompt.getResponseText();
  
  if (!projectNames.includes(selectedProject)) {
    ui.alert('Error: Proyecto no válido.');
    return;
  }
  
  // 4. Filter tasks of the template
  var templateTasks = tData.filter(row => row[0] === selectedTemplate);
  
  // 5. Append to TASKS
  var tMap = getHeaderMap_(tasksSheet);
  var today = new Date();
  today.setHours(0,0,0,0);
  
  templateTasks.forEach(tRow => {
    var row = new Array(Object.keys(tMap).length).fill("");
    var duration = parseInt(tRow[5]) || 0;
    var fin = new Date(today);
    fin.setDate(today.getDate() + duration);
    
    row[getColIndex_(tMap, 'Proyecto') - 1] = selectedProject;
    row[getColIndex_(tMap, 'ID') - 1] = generateTaskId_();
    row[getColIndex_(tMap, 'Tarea') - 1] = tRow[1];
    row[getColIndex_(tMap, 'Area') - 1] = tRow[2];
    row[getColIndex_(tMap, 'Subarea') - 1] = tRow[3];
    row[getColIndex_(tMap, 'Responsable') - 1] = tRow[4];
    row[getColIndex_(tMap, 'Inicio') - 1] = today;
    row[getColIndex_(tMap, 'Fin') - 1] = fin;
    row[getColIndex_(tMap, 'Estado') - 1] = 'No iniciado';
    
    tasksSheet.appendRow(row);
  });
  
  autoUpdateProjectStatuses_();
  refreshGanttView();
  
  ui.alert('Plantilla "' + selectedTemplate + '" aplicada exitosamente al proyecto "' + selectedProject + '".');
}






