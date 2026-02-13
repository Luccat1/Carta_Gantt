/**
 * Configuration and Constants
 */

var SHEET_CONFIG = 'CONFIG';
var SHEET_TASKS = 'TASKS';
var SHEET_LOOKUPS = 'LOOKUPS';
var SHEET_GANTT = 'GANTT_VIEW';

// Headers for the TASKS sheet
var HEADERS_TASKS = [
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
  'ID'
];

// Configuration Defaults
var DEFAULT_YEAR = new Date().getFullYear();
var DEFAULT_MONTH = new Date().getMonth() + 1; // 1-12
