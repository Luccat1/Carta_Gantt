/**
 * Configuration and Constants
 */

var SHEET_CONFIG = 'CONFIG';
var SHEET_TASKS = 'TASKS';
var SHEET_PROJECTS = 'PROJECTS';
var SHEET_LOOKUPS = 'LOOKUPS';
var SHEET_GANTT = 'GANTT_VIEW';
var SHEET_ISSUES = 'ISSUES';
var SHEET_TIMELINE = 'TIMELINE_DATA';
var SHEET_DASHBOARD = 'DASHBOARD';
var SHEET_VIEWS = 'VIEWS';
var SHEET_TEMPLATES = 'TEMPLATES';
var SHEET_APPSHEET = 'APPSHEET_CONFIG';

// Headers for the TEMPLATES sheet
var HEADERS_TEMPLATES = [
  'Plantilla', 
  'Tarea', 
  'Area', 
  'Subarea', 
  'Responsable', 
  'DuraciónDías'
];

// Headers for the APPSHEET_CONFIG sheet
var HEADERS_APPSHEET = ['Parámetro', 'Valor', 'Descripción'];

// Headers for the ISSUES sheet
var HEADERS_ISSUES = [
  'Fecha', 
  'Hoja', 
  'Fila', 
  'Campo', 
  'Mensaje', 
  'Severidad'
];

// Headers for the TASKS sheet
var HEADERS_TASKS = [
  'Proyecto', 
  'ID', 
  'Area', 
  'Tarea', 
  'Subarea', 
  'Responsable', 
  'Ejecuta', 
  'Inicio', 
  'Fin', 
  'Estado', 
  'Etiquetas', 
  'Material',
  '_Acción'
];

// Headers for the PROJECTS sheet
var HEADERS_PROJECTS = [
  'ProyectoID', 
  'Nombre', 
  'Owner', 
  'Inicio', 
  'Fin', 
  'Estado', 
  'Color'
];

// Headers for the TIMELINE_DATA sheet
var HEADERS_TIMELINE = [
  'Proyecto', 
  'Tarea', 
  'Inicio', 
  'Fin'
];

// Valid Statuses for validation
var VALID_STATUSES = [
  'No iniciado', 
  'En curso', 
  'Bloqueado', 
  'Terminado', 
  'Cancelado'
];

// Configuration Defaults
var DEFAULT_YEAR = new Date().getFullYear();
var DEFAULT_MONTH = new Date().getMonth() + 1; // 1-12
var DEFAULT_MONTH_END = DEFAULT_MONTH;
var DEFAULT_COLOR = '#4a86e8';
