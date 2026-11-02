const ranks = [
  [0, 'Rookie Detective'], [250, 'Junior Investigator'], [700, 'Field Detective'],
  [1500, 'Senior Detective'], [3000, 'Chief Investigator'], [5500, 'Master Detective'], [9000, 'Legendary Detective']
];
export function rankFor(xp) { return [...ranks].reverse().find(([threshold]) => xp >= threshold)?.[1] || ranks[0][1]; }
export function earnedForCase({ won, difficulty, hintsUsed, discoveredCount, majorCount, ending }) {
  if (ending === 'unsolved') return Math.min(20, discoveredCount * 2);
  let xp = 20 + (won ? 100 : 0) + majorCount * 10 + discoveredCount * 2;
  if (won && difficulty === 'hard') xp += 50;
  if (hintsUsed) xp = Math.round(xp * Math.max(0.55, 1 - hintsUsed * 0.12));
  return xp;
}
