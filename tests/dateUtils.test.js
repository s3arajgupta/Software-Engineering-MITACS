const test = require('node:test');
const assert = require('node:assert/strict');
const { addDays, daysBetween, generateDateWindows } = require('../src/dateUtils');

test('dateUtils - addDays adds days correctly', () => {
  assert.equal(addDays('2020-01-01', 10), '2020-01-11');
  assert.equal(addDays('2020-01-25', 10), '2020-02-04');
  assert.equal(addDays('2020-12-25', 10), '2021-01-04');
  assert.equal(addDays('2020-02-28', 1), '2020-02-29'); // Leap year
});

test('dateUtils - daysBetween calculates day difference', () => {
  assert.equal(daysBetween('2020-01-01', '2020-01-11'), 10);
  assert.equal(daysBetween('2020-01-01', '2020-01-01'), 0);
  assert.equal(daysBetween('2020-01-01', '2020-01-31'), 30);
});

test('dateUtils - generateDateWindows partitions date ranges', () => {
  const windows = generateDateWindows('2020-01-01', '2020-02-15', 30);
  assert.ok(windows.length >= 2);
  assert.equal(windows[0].start, '2020-01-01');
  assert.equal(windows[0].end, '2020-01-31');
  assert.equal(windows[windows.length - 1].end, '2020-02-15');
});
