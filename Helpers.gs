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
