import test from 'node:test';
import assert from 'node:assert/strict';
import { earnedForCase, rankFor } from './progression.js';

test('rank thresholds advance with XP', () => {
  assert.equal(rankFor(0), 'Rookie Detective');
  assert.equal(rankFor(700), 'Field Detective');
  assert.equal(rankFor(9000), 'Legendary Detective');
});
test('correct hard-case XP includes solving bonus and hints reduce reward', () => {
  const clean = earnedForCase({ won: true, difficulty: 'hard', hintsUsed: 0, discoveredCount: 4, majorCount: 2, ending: 'accuse' });
  const hinted = earnedForCase({ won: true, difficulty: 'hard', hintsUsed: 2, discoveredCount: 4, majorCount: 2, ending: 'accuse' });
  assert.equal(clean, 198); assert.ok(hinted < clean);
});
test('unsolved cases receive only a small capped exploration award', () => {
  assert.equal(earnedForCase({ won: false, difficulty: 'hard', hintsUsed: 0, discoveredCount: 99, majorCount: 10, ending: 'unsolved' }), 20);
});
