import test from 'node:test';
import assert from 'node:assert/strict';
import { caseDTO } from '../routes/api.js';

const fixture = status => ({
  caseId: 'AMS-TEST', themeId: 'dark-academia', title: 'The Quiet Archive', difficulty: 'medium',
  incidentDate: 'Friday, 9:15 PM', location: 'North Wing', incidentReport: 'A fictional case report.',
  victimProfile: {}, suspects: [{ id: 'suspect-1', name: 'Ada Vale', age: 33, occupation: 'Archivist', relationship: 'Colleague', background: 'A reserved records keeper.', initialStatement: 'I stayed at my desk.', avatar: '' }],
  evidence: [{ id: 'evidence-1', title: 'The Missing Ledger', category: 'document', description: 'A torn inventory sheet.', transcript: '', mediaUrl: '', relatedSuspects: ['suspect-1'], relatedEvents: ['event-1'], significance: 'Privately ties the suspect to the scene.', isRedHerring: false, reliability: 'high', major: true }],
  discoveredEvidence: ['evidence-1'], examinedEvidence: [], timeline: [{ id: 'event-1', time: '9:15 PM', event: 'A page was filed.', source: 'Security log', suspectIds: [] }],
  missionObjectives: [], completedObjectives: [], suspicions: new Map(), conversations: new Map(), board: { nodes: [], connections: [], notes: [], viewport: { x: 0, y: 0, zoom: 1 } },
  status, hintsUsed: 0, accusation: null, result: null, earnedXP: 0,
  solution: { culpritId: 'suspect-1', motive: 'Private financial motive.', method: 'Swapped the ledger.' },
  caseBlueprint: { culpritId: 'suspect-1', secrets: ['Confidential fact'] }, createdAt: new Date(), completedAt: null
});

test('active case responses omit the solution, blueprint, and hidden clue significance', () => {
  const data = caseDTO(fixture('in_progress'));
  assert.equal('solution' in data, false);
  assert.equal('blueprint' in data, false);
  assert.equal(data.evidence[0].significance, undefined);
  assert.equal(data.evidence[0].isRedHerring, undefined);
  assert.equal(data.timeline.length, 1);
});

test('completed cases reveal the solution but never return the internal blueprint', () => {
  const data = caseDTO(fixture('completed'));
  assert.equal(data.solution.culpritId, 'suspect-1');
  assert.equal('blueprint' in data, false);
  assert.equal(data.allEvidence[0].significance, 'Privately ties the suspect to the scene.');
});
