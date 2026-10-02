/**
 * Date arithmetic and windowing utilities for GitHub GraphQL search queries.
 */

/**
 * Add days to a date string (YYYY-MM-DD) and return new date string.
 * @param {string|Date} date - Starting date
 * @param {number} days - Number of days to add
 * @returns {string} Formatted date string (YYYY-MM-DD)
 */
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().substring(0, 10);
}

/**
 * Calculate the number of days between two dates.
 * @param {string|Date} startDate
 * @param {string|Date} endDate
 * @returns {number}
 */
function daysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.ceil((end - start) / msPerDay);
}

/**
 * Generate windows of a given day size between startDate and endDate.
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate - YYYY-MM-DD
 * @param {number} windowDays - Days per window (default 30)
 * @returns {Array<{start: string, end: string}>}
 */
function generateDateWindows(startDate, endDate, windowDays = 30) {
  const windows = [];
  let currentStart = startDate;

  while (currentStart <= endDate) {
    let currentEnd = addDays(currentStart, windowDays);
    if (currentEnd > endDate) {
      currentEnd = endDate;
    }
    windows.push({ start: currentStart, end: currentEnd });
    if (currentEnd === endDate) break;
    currentStart = addDays(currentEnd, 1);
  }

  return windows;
}

module.exports = {
  addDays,
  daysBetween,
  generateDateWindows
};
