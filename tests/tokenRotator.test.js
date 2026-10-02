const test = require('node:test');
const assert = require('node:assert/strict');
const TokenRotator = require('../src/tokenRotator');

test('tokenRotator - initializes with provided token array', () => {
  const rotator = new TokenRotator(['token_a', 'token_b', 'token_c']);
  assert.equal(rotator.tokenCount, 3);
  assert.equal(rotator.getCurrentToken(), 'token_a');
});

test('tokenRotator - rotates tokens in round-robin sequence', () => {
  const rotator = new TokenRotator(['token_1', 'token_2']);
  assert.equal(rotator.getNextToken(), 'token_1');
  assert.equal(rotator.getNextToken(), 'token_2');
  assert.equal(rotator.getNextToken(), 'token_1'); // wraps around
});

test('tokenRotator - detects placeholder tokens', () => {
  const placeholderRotator = new TokenRotator(['PERSONAL_ACCESS_TOKEN_1', 'ghp_SAMPLE_TOKEN']);
  assert.equal(placeholderRotator.isUsingPlaceholders(), true);

  const realRotator = new TokenRotator(['ghp_customToken12345']);
  assert.equal(realRotator.isUsingPlaceholders(), false);
});
