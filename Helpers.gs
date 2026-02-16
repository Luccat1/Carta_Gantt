/**
 * Helper Functions
 */

/**
 * Returns the Spanish name for a given month number (1-12).
 * @param {number} monthNumber - 1 for January, 12 for December.
 * @return {string} Month name in Spanish (e.g., 'ene').
 */
function monthNameEs_(monthNumber) {
  var months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return months[monthNumber - 1] || '';
}

/**
 * Returns an array of 4 week objects for the given month.
 * Logic: S1 (1-7), S2 (8-14), S3 (15-21), S4 (22-end).
 * 
 * @param {number} year 
 * @param {number} month (1-12)
 * @return {Array<Object>} [{start: Date, end: Date, label: string}, ...]
 */
function weeksOfMonth_(year, month) {
  var weeks = [];
  var monthName = monthNameEs_(month);
  
  // S1: 1-7
  weeks.push({
    start: new Date(year, month - 1, 1),
    end: new Date(year, month - 1, 7),
    label: monthName + ' S1'
  });
  
  // S2: 8-14
  weeks.push({
    start: new Date(year, month - 1, 8),
    end: new Date(year, month - 1, 14),
    label: monthName + ' S2'
  });
  
  // S3: 15-21
  weeks.push({
    start: new Date(year, month - 1, 15),
    end: new Date(year, month - 1, 21),
    label: monthName + ' S3'
  });
  
  // S4: 22-End of Month
  // Use day 0 of the *next* month to get the last day of the *current* month
  var lastDayOfMonth = new Date(year, month, 0).getDate();
  weeks.push({
    start: new Date(year, month - 1, 22),
    end: new Date(year, month - 1, lastDayOfMonth),
    label: monthName + ' S4'
  });
  
  return weeks;
}

/**
 * Returns an object mapping header names to 1-based column indices.
 * @param {Sheet} sheet 
 * @return {Object} {HeaderName: index}
 */
function getHeaderMap_(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol === 0) return {};
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var map = {};
  for (var i = 0; i < headers.length; i++) {
    if (headers[i]) {
      map[headers[i].toString().trim()] = i + 1;
    }
  }
  return map;
}

/**
 * Returns the 1-based index from headerMap for the given colName.
 * Throws an error if not found.
 * @param {Object} headerMap 
 * @param {string} colName 
 * @return {number}
 */
function getColIndex_(headerMap, colName) {
  if (headerMap[colName] === undefined) {
    throw new Error('Columna no encontrada: ' + colName);
  }
  return headerMap[colName];
}

/**
 * Generates a unique Task ID.
 * @return {string}
 */
function generateTaskId_() {
  var timestamp = new Date().getTime().toString().slice(-6);
  var random = Math.floor(1000 + Math.random() * 9000);
  return 'T-' + timestamp + '-' + random;
}

/**
 * Converts a column index (1-based) to its letter representation (e.g., 1 -> A, 27 -> AA).
 * @param {number} colIndex 
 * @return {string}
 */
function colToLetter_(colIndex) {
  var letter = '';
  while (colIndex > 0) {
    var temp = (colIndex - 1) % 26;
    letter = String.fromCharCode(65 + temp) + letter;
    colIndex = (colIndex - temp - 1) / 26;
  }
  return letter;
}
