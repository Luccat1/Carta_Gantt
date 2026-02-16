/**
 * Envía alertas por email para tareas vencidas o próximas a vencer (3 días).
 * Agrupa las tareas por responsable y envía un resumen HTML.
 */
function sendTaskAlerts() {
  var alerts = getAlertData_();
  if (Object.keys(alerts).length === 0) {
    SpreadsheetApp.getUi().alert('No hay tareas vencidas o próximas a vencer que requieran notificación.');
    return;
  }
  
  var sentCount = 0;
  for (var email in alerts) {
    var htmlBody = buildAlertHtml_(alerts[email]);
    var subject = '🔔 Alertas Gantt: ' + alerts[email].all.length + ' tareas requieren atención';
    
    try {
      MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: htmlBody
      });
      sentCount++;
    } catch (e) {
      Logger.log('Error enviando email a ' + email + ': ' + e.message);
    }
  }
  
  SpreadsheetApp.getUi().alert('Notificaciones enviadas a ' + sentCount + ' destinatarios.');
}

/**
 * Muestra un preview de las alertas en un diálogo HTML sin enviar emails.
 */
function sendTaskAlertsPreview() {
  var alerts = getAlertData_();
  var currentUser = Session.getActiveUser().getEmail();
  var data = alerts[currentUser] || (Object.keys(alerts).length > 0 ? alerts[Object.keys(alerts)[0]] : null);
  
  if (!data) {
    SpreadsheetApp.getUi().alert('No hay alertas para mostrar en el preview.');
    return;
  }
  
  var html = buildAlertHtml_(data);
  var userInterface = HtmlService.createHtmlOutput(html)
      .setWidth(600)
      .setHeight(400);
  SpreadsheetApp.getUi().showModalDialog(userInterface, 'Preview de Alertas (Ejemplo)');
}

/**
 * Recopila datos de tareas que requieren alerta.
 * Retorna un objeto: { email: { overdue: [], upcoming: [], all: [] } }
 */
function getAlertData_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_TASKS);
  var data = sheet.getDataRange().getValues();
  var hMap = getHeaderMap_(sheet);
  
  var colTarea = getColIndex_(hMap, 'Tarea');
  var colFin = getColIndex_(hMap, 'Fin');
  var colEstado = getColIndex_(hMap, 'Estado');
  var colProyecto = getColIndex_(hMap, 'Proyecto');
  var colResp = getColIndex_(hMap, 'Responsable');
  
  var alertsByEmail = {};
  var today = new Date();
  today.setHours(0,0,0,0);
  
  var threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var taskName = row[colTarea - 1];
    var endDate = row[colFin - 1];
    var estado = row[colEstado - 1];
    var proyecto = row[colProyecto - 1];
    var resp = row[colResp - 1];
    
    if (!taskName || !(endDate instanceof Date) || estado === 'Terminado' || estado === 'Cancelado') continue;
    
    var alertType = '';
    if (endDate < today) {
      alertType = 'overdue';
    } else if (endDate <= threeDaysFromNow) {
      alertType = 'upcoming';
    }
    
    if (alertType) {
      var email = (resp && resp.indexOf('@') !== -1) ? resp : Session.getActiveUser().getEmail();
      if (!alertsByEmail[email]) {
        alertsByEmail[email] = { overdue: [], upcoming: [], all: [] };
      }
      
      var taskInfo = {
        name: taskName,
        project: proyecto,
        due: endDate,
        status: estado
      };
      
      alertsByEmail[email][alertType].push(taskInfo);
      alertsByEmail[email].all.push(taskInfo);
    }
  }
  
  return alertsByEmail;
}

/**
 * Construye el cuerpo HTML del email de alerta.
 */
function buildAlertHtml_(data) {
  var html = '<div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">';
  html += '<h2 style="color: #2c3e50;">Resumen de Alertas Gantt</h2>';
  html += '<p>Las siguientes tareas requieren tu atención:</p>';
  
  if (data.overdue.length > 0) {
    html += '<h3 style="color: #c0392b;">🔴 Tareas Vencidas</h3><ul>';
    data.overdue.forEach(function(t) {
      html += '<li><b>' + t.name + '</b> (' + t.project + ') - Venció el ' + Utilities.formatDate(t.due, Session.getScriptTimeZone(), 'dd/MM/yyyy') + '</li>';
    });
    html += '</ul>';
  }
  
  if (data.upcoming.length > 0) {
    html += '<h3 style="color: #f39c12;">🟡 Próximas a Vencer (3 días)</h3><ul>';
    data.upcoming.forEach(function(t) {
      html += '<li><b>' + t.name + '</b> (' + t.project + ') - Vence el ' + Utilities.formatDate(t.due, Session.getScriptTimeZone(), 'dd/mm/yyyy') + '</li>';
    });
    html += '</ul>';
  }
  
  html += '<br><hr><p style="font-size: 12px; color: #7f8c8d;">Este es un mensaje automático generado por el Sistema de Gantt. <br>';
  html += '<a href="' + SpreadsheetApp.getActiveSpreadsheet().getUrl() + '">Abrir Planilla</a></p></div>';
  
  return html;
}
