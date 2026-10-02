const test = require('node:test');
const assert = require('node:assert/strict');
const { isTagInText, extractTagsFromText, deduplicate } = require('../src/tagExtractor');

test('tagExtractor - isTagInText matches single-word tags', () => {
  assert.equal(isTagInText('unity', 'This is a Unity game project'), true);
  assert.equal(isTagInText('react', 'Built with React and Redux'), true);
  assert.equal(isTagInText('c', 'C++ library for graphics'), false); // not isolated 'c'
  assert.equal(isTagInText('c', 'written in c and assembly'), true);
});

test('tagExtractor - isTagInText matches hyphenated tags and space variants', () => {
  // Directly matches hyphenated form
  assert.equal(isTagInText('3d-graphics', 'Uses 3d-graphics pipeline'), true);
  // Matches space-separated variant from description
  assert.equal(isTagInText('unity-vr', 'An experimental unity vr headset app'), true);
  assert.equal(isTagInText('augmented-reality', 'Awesome augmented reality toolkit'), true);
  assert.equal(isTagInText('unity-vr', 'Unrelated machine learning tool'), false);
});

test('tagExtractor - extractTagsFromText extracts dictionary matches', () => {
  const dictionary = [
    { tag: 'unity' },
    { tag: '3d-graphics' },
    { tag: 'augmented-reality' },
    { tag: 'pytorch' }
  ];
  const text = 'A 3D graphics experience built with unity and augmented reality support';
  const matches = extractTagsFromText(dictionary, text);

  assert.ok(matches.includes('unity'));
  assert.ok(matches.includes('3d-graphics'));
  assert.ok(matches.includes('augmented-reality'));
  assert.ok(!matches.includes('pytorch'));
});

test('tagExtractor - deduplicate eliminates duplicates and sorts', () => {
  const input = ['unity', 'react', 'unity', 'android', 'react'];
  const output = deduplicate(input);
  assert.deepEqual(output, ['android', 'react', 'unity']);
});
