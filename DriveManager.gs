/**
 * Crea una estructura de carpetas en Google Drive para cada proyecto.
 * Repositorio centralizado: rootFolder > ProyectoFolder > [Documentos, Entregas, Recursos]
 */
function createProjectFolders() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt('Estructura de Carpetas en Drive', 'Ingresa el nombre de la carpeta raíz (se creará en la raíz de tu Drive):', ui.ButtonSet.OK_CANCEL);
  
  if (response.getSelectedButton() !== ui.Button.OK) return;
  
  var rootName = response.getResponseText().trim() || 'Gantt - Proyectos';
  var rootFolder;
  var folders = DriveApp.getFoldersByName(rootName);
  
  if (folders.hasNext()) {
    rootFolder = folders.next();
  } else {
    rootFolder = DriveApp.createFolder(rootName);
    ui.alert('Se ha creado la carpeta raíz: ' + rootName);
  }
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_PROJECTS);
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    ui.alert('No hay proyectos registrados para crear carpetas.');
    return;
  }
  
  var hMap = getHeaderMap_(sheet);
  var colNombre = getColIndex_(hMap, 'Nombre');
  
  var projectsCreated = 0;
  var foldersVerified = 0;
  
  var standardSubs = ['Documentos', 'Entregas', 'Recursos'];
  
  for (var i = 1; i < data.length; i++) {
    var projectName = data[i][colNombre - 1];
    if (!projectName) continue;
    
    // Buscar o crear carpeta del proyecto
    var projectFolder;
    var projectFolders = rootFolder.getFoldersByName(projectName);
    if (projectFolders.hasNext()) {
      projectFolder = projectFolders.next();
    } else {
      projectFolder = rootFolder.createFolder(projectName);
      projectsCreated++;
    }
    
    // Crear subcarpetas estándar
    for (var j = 0; j < standardSubs.length; j++) {
      var subName = standardSubs[j];
      if (!projectFolder.getFoldersByName(subName).hasNext()) {
        projectFolder.createFolder(subName);
        foldersVerified++;
      }
    }
  }
  
  ui.alert('Proceso completado.\nProyectos nuevos: ' + projectsCreated + '\nSubcarpetas creadas/verificadas: ' + (projectsCreated * 3 + foldersVerified));
}

/**
 * Helper para obtener la URL de la carpeta de un proyecto.
 */
function getProjectFolderUrl(projectName) {
  var folders = DriveApp.getFoldersByName('Gantt - Proyectos');
  if (!folders.hasNext()) return null;
  var root = folders.next();
  
  var projectFolders = root.getFoldersByName(projectName);
  if (projectFolders.hasNext()) {
    return projectFolders.next().getUrl();
  }
  return null;
}
