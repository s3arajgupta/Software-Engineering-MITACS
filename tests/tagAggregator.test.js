const test = require('node:test');
const assert = require('node:assert/strict');
const { aggregateTagsByYear, toTagYearCsv } = require('../src/tagAggregator');

test('tagAggregator - aggregates tags by year correctly', () => {
  const mockRepos = [
    { createdAt: '2016-05-12T00:00:00Z', tags: ['unity', 'vr'] },
    { createdAt: '2016-08-20T00:00:00Z', _tags: ['unity', 'csharp'] },
    { createdAt: '2017-01-15T00:00:00Z', tags: ['unity'] }
  ];

  const result = aggregateTagsByYear(mockRepos);
  assert.equal(result.unity['2016'], 2);
  assert.equal(result.unity['2017'], 1);
  assert.equal(result.vr['2016'], 1);
  assert.equal(result.csharp['2016'], 1);
});

test('tagAggregator - handles empty and malformed records safely', () => {
  const mockRepos = [
    null,
    {},
    { createdAt: null, tags: null },
    { createdAt: '2019-11-01T00:00:00Z', tags: ['android'] }
  ];

  const result = aggregateTagsByYear(mockRepos);
  assert.equal(result.android['2019'], 1);
});

test('tagAggregator - converts tag-year data to CSV format', () => {
  const tagData = {
    unity: { '2016': 2, '2017': 5 },
    vr: { '2016': 1 }
  };

  const csv = toTagYearCsv(tagData);
  assert.ok(csv.startsWith('tag,year,count'));
  assert.ok(csv.includes('unity,2016,2'));
  assert.ok(csv.includes('unity,2017,5'));
  assert.ok(csv.includes('vr,2016,1'));
});
