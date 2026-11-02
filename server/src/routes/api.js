import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';
import Case from '../models/Case.js';
import { themes } from '../data/themes.js';
import { generateCase, answerSuspect, analyzeBoard, getHint, analyzeTimeline } from '../services/ai.js';
import { generateEvidenceMedia } from '../services/media.js';
import { requireAuth } from '../middleware/auth.js';
import { earnedForCase, rankFor } from '../services/progression.js';

const router = Router();
const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const signToken = user => jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
const setToken = (res, token) => res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 86400000, path: '/' });
const userDTO = user => ({ id: user.id, name: user.name, email: user.email, totalXP: user.totalXP, rank: user.rank, gamesPlayed: user.gamesPlayed, gamesWon: user.gamesWon, culpritsIdentified: user.culpritsIdentified, achievements: user.achievements, themePreferences: user.themePreferences });
const caseDTO = (c, includeSolution = false) => ({
  id: c.caseId, themeId: c.themeId, title: c.title, difficulty: c.difficulty, incidentDate: c.incidentDate, location: c.location,
  incidentReport: c.incidentReport, victimProfile: c.victimProfile,
  suspects: c.suspects.map(({ id, name, age, occupation, relationship, background, initialStatement, avatar }) => ({ id, name, age, occupation, relationship, background, initialStatement, avatar, suspicion: c.suspicions?.get(id) || 0 })),
  evidence: c.evidence.filter(e => c.discoveredEvidence.includes(e.id)).map(e => ({ id: e.id, title: e.title, category: e.category, description: e.description, transcript: e.transcript, mediaUrl: e.mediaUrl, mediaProvider: e.mediaProvider, mediaGenerationStatus: e.mediaGenerationStatus, relatedSuspects: e.relatedSuspects, relatedEvents: e.relatedEvents, reliability: e.reliability, major: e.major, examined: c.examinedEvidence.includes(e.id) })),
  timeline: c.timeline.filter(event => c.discoveredEvidence.some(id => c.evidence.find(item => item.id === id)?.relatedEvents?.includes(event.id))), missionObjectives: c.missionObjectives, completedObjectives: c.completedObjectives,
  status: c.status, discoveredEvidence: c.discoveredEvidence, examinedEvidence: c.examinedEvidence, hintsUsed: c.hintsUsed, validDeductionCount: c.validDeductionKeys?.length || 0,
  conversations: Object.fromEntries(c.conversations || []), board: c.board, accusation: c.accusation, result: c.result, earnedXP: c.earnedXP,
  ...(includeSolution || c.status === 'completed' ? { solution: c.solution, allEvidence: c.evidence } : {}), createdAt: c.createdAt, completedAt: c.completedAt
});
async function ownedCase(req, privateData = false) {
  let query = Case.findOne({ caseId: req.params.caseId, userId: req.user.id });
  query = query.select('+caseBlueprint +solution');
  let record = await query;
  if (!record) throw Object.assign(new Error('Investigation not found.'), { status: 404 });
  if (record.status === 'resolving' && record.updatedAt < new Date(Date.now() - 120000)) {
    await Case.updateOne({ _id: record._id, status: 'resolving' }, { $set: { status: 'in_progress' } });
    record = await Case.findById(record._id).select('+caseBlueprint +solution');
  }
  return record;
}

router.get('/health', (req, res) => res.json({ status: 'ok', service: 'AI Mystery Space API' }));
router.get('/themes', (req, res) => res.json({ themes }));
router.get('/themes/:themeId', (req, res) => {
  const theme = themes.find(item => item.id === req.params.themeId);
  return theme ? res.json({ theme }) : res.status(404).json({ error: 'Mystery theme not found.' });
});

router.post('/auth/register', wrap(async (req, res) => {
  const body = z.object({ name: z.string().trim().min(2).max(60), email: z.string().trim().email().max(255), password: z.string().min(8).max(100) }).parse(req.body);
  if (await User.exists({ email: body.email.toLowerCase() })) return res.status(409).json({ error: 'An account with that email already exists.' });
  const user = await User.create({ name: body.name, email: body.email, passwordHash: await bcrypt.hash(body.password, 12) });
  setToken(res, signToken(user)); res.status(201).json({ user: userDTO(user) });
}));
router.post('/auth/login', wrap(async (req, res) => {
  const body = z.object({ email: z.string().email(), password: z.string().min(1).max(100) }).parse(req.body);
  const user = await User.findOne({ email: body.email.toLowerCase() }).select('+passwordHash');
  if (!user || !await bcrypt.compare(body.password, user.passwordHash)) return res.status(401).json({ error: 'Email or password is incorrect.' });
  setToken(res, signToken(user)); res.json({ user: userDTO(user) });
}));
router.post('/auth/logout', (req, res) => { res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' }); res.json({ ok: true }); });
router.get('/auth/me', requireAuth, (req, res) => res.json({ user: userDTO(req.user) }));

router.get('/users/profile', requireAuth, wrap(async (req, res) => {
  const cases = await Case.find({ userId: req.user.id }).sort({ updatedAt: -1 }).limit(6);
  const all = await Case.countDocuments({ userId: req.user.id });
  res.json({ user: userDTO(req.user), stats: { casesCompleted: await Case.countDocuments({ userId: req.user.id, status: 'completed' }), winRate: req.user.gamesPlayed ? Math.round(req.user.gamesWon / req.user.gamesPlayed * 100) : 0 }, recent: cases.map(c => ({ id: c.caseId, title: c.title, themeId: c.themeId, difficulty: c.difficulty, status: c.status, createdAt: c.createdAt, earnedXP: c.earnedXP })), totalCases: all });
}));
router.put('/users/profile', requireAuth, wrap(async (req, res) => {
  const body = z.object({ name: z.string().trim().min(2).max(60).optional(), themePreferences: z.array(z.string()).max(5).optional() }).parse(req.body);
  Object.assign(req.user, body); await req.user.save(); res.json({ user: userDTO(req.user) });
}));
router.get('/users/achievements', requireAuth, async (req, res) => {
  const catalog = [
    ['first-case', 'First Case Solved', 'Close your first investigation.', '✦'], ['sharp-eyes', 'Sharp Eyes', 'Discover every major clue in a case.', '◉'], ['master-interrogator', 'Master Interrogator', 'Question every suspect.', '◌'], ['evidence-expert', 'Evidence Expert', 'Connect clues on your investigation board.', '⌘'], ['no-hints', 'No Hints Needed', 'Solve a case without requesting a hint.', '◇'], ['perfect-investigation', 'Perfect Investigation', 'Solve a hard case with strong evidence.', '✧'], ['mystery-master', 'Mystery Master', 'Investigate three different themes.', '⌖']
  ].map(([id, title, description, icon]) => ({ id, title, description, icon, unlocked: req.user.achievements.includes(id) }));
  res.json({ achievements: catalog });
});
router.get('/users/progress', requireAuth, wrap(async (req, res) => { res.json({ cases: (await Case.find({ userId: req.user.id }).sort({ updatedAt: -1 }).limit(50)).map(c => ({ id: c.caseId, title: c.title, themeId: c.themeId, difficulty: c.difficulty, status: c.status, createdAt: c.createdAt, completedAt: c.completedAt, earnedXP: c.earnedXP })) }); }));

router.post('/cases/generate', requireAuth, wrap(async (req, res) => {
  const { themeId, difficulty } = z.object({ themeId: z.string(), difficulty: z.enum(['easy', 'medium', 'hard']).default('medium') }).parse(req.body);
  const generated = await generateEvidenceMedia(await generateCase(themeId, difficulty));
  const record = await Case.create({ ...generated, caseId: `AMS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, userId: req.user.id, discoveredEvidence: generated.evidence.filter(e => !e.unlockAfter).map(e => e.id), status: 'ready' });
  await User.updateOne({ _id: req.user.id }, { $inc: { gamesPlayed: 1 } });
  res.status(201).json({ case: caseDTO(record) });
}));
router.get('/cases', requireAuth, wrap(async (req, res) => { const items = await Case.find({ userId: req.user.id }).sort({ updatedAt: -1 }).limit(50); res.json({ cases: items.map(c => ({ id: c.caseId, title: c.title, themeId: c.themeId, difficulty: c.difficulty, status: c.status, createdAt: c.createdAt, completedAt: c.completedAt, earnedXP: c.earnedXP })) }); }));
router.get('/cases/:caseId', requireAuth, wrap(async (req, res) => { const c = await ownedCase(req); res.json({ case: caseDTO(c) }); }));
router.get('/cases/:caseId/dossier', requireAuth, wrap(async (req, res) => { const c = await ownedCase(req); res.json({ case: caseDTO(c) }); }));
router.post('/cases/:caseId/start', requireAuth, wrap(async (req, res) => { const c = await ownedCase(req); if (c.status === 'ready' || c.status === 'paused') c.status = 'in_progress'; await c.save(); res.json({ case: caseDTO(c) }); }));
router.post('/cases/:caseId/pause', requireAuth, wrap(async (req, res) => { const c = await ownedCase(req); if (c.status === 'in_progress') c.status = 'paused'; await c.save(); res.json({ ok: true, status: c.status }); }));

router.get('/cases/:caseId/evidence', requireAuth, wrap(async (req, res) => { const c = await ownedCase(req); res.json({ evidence: caseDTO(c).evidence }); }));
router.get('/cases/:caseId/evidence/:evidenceId', requireAuth, wrap(async (req, res) => { const c = await ownedCase(req); const evidence = caseDTO(c).evidence.find(e => e.id === req.params.evidenceId); if (!evidence) return res.status(404).json({ error: 'Evidence not discovered yet.' }); res.json({ evidence }); }));
router.post('/cases/:caseId/evidence/:evidenceId/media/retry', requireAuth, wrap(async (req, res) => {
  const c = await ownedCase(req); const item = c.evidence.find(e => e.id === req.params.evidenceId && c.discoveredEvidence.includes(e.id));
  if (!item) return res.status(404).json({ error: 'Evidence not discovered yet.' });
  if (!['photograph', 'cctv'].includes(item.category)) return res.status(400).json({ error: 'This exhibit does not have a generated image.' });
  if (!process.env.IMAGE_PROVIDER_URL) return res.status(503).json({ error: 'No image provider is configured. The text evidence is still available.' });
  const copy = item.toObject();
  await generateEvidenceMedia({ themeId: c.themeId, location: c.location, incidentReport: c.incidentReport, evidence: [copy] }, [item.id]);
  item.mediaUrl = copy.mediaUrl || ''; item.mediaProvider = copy.mediaProvider || ''; item.mediaGenerationStatus = copy.mediaGenerationStatus || 'unavailable';
  await c.save();
  res.json({ evidence: caseDTO(c).evidence.find(e => e.id === item.id) });
}));
router.post('/cases/:caseId/evidence/:evidenceId/examine', requireAuth, wrap(async (req, res) => {
  const c = await ownedCase(req); const item = c.evidence.find(e => e.id === req.params.evidenceId && c.discoveredEvidence.includes(e.id));
  if (c.status === 'completed') return res.status(409).json({ error: 'This investigation is complete. You can review examined evidence from the case record.' });
  if (!item) return res.status(404).json({ error: 'Evidence not discovered yet.' });
  const next = c.evidence.find(e => e.unlockAfter && !c.discoveredEvidence.includes(e.id) && (e.unlockAfter === item.id || e.unlockAfter === 'any-examination'));
  const changes = { $addToSet: { examinedEvidence: item.id, completedObjectives: 'examine-evidence' } };
  if (next) changes.$addToSet.discoveredEvidence = next.id;
  const claimed = await Case.updateOne({ _id: c._id, examinedEvidence: { $ne: item.id } }, changes);
  const fresh = claimed.modifiedCount > 0;
  if (fresh && item.major) {
    const updated = await User.findByIdAndUpdate(req.user.id, { $inc: { totalXP: 10 } }, { new: true });
    updated.rank = rankFor(updated.totalXP); await updated.save();
    await Case.updateOne({ _id: c._id }, { $inc: { earnedXP: 10 } });
  }
  const record = await Case.findById(c._id).select('+caseBlueprint +solution');
  const safe = caseDTO(record);
  res.json({ evidence: safe.evidence.find(e => e.id === item.id), unlocked: next && safe.evidence.find(e => e.id === next.id), case: safe });
}));

router.get('/cases/:caseId/interrogate/:suspectId/history', requireAuth, wrap(async (req, res) => { const c = await ownedCase(req); const suspect = c.suspects.find(s => s.id === req.params.suspectId); if (!suspect) return res.status(404).json({ error: 'Suspect not found.' }); res.json({ suspect, messages: c.conversations.get(suspect.id) || [] }); }));
router.put('/cases/:caseId/suspects/:suspectId/suspicion', requireAuth, wrap(async (req, res) => {
  const { level } = z.object({ level: z.number().int().min(0).max(3) }).parse(req.body);
  const c = await ownedCase(req); if (!c.suspects.some(s => s.id === req.params.suspectId)) return res.status(404).json({ error: 'Suspect not found.' });
  c.suspicions.set(req.params.suspectId, level); await c.save(); res.json({ level, case: caseDTO(c) });
}));
router.post('/cases/:caseId/interrogate/:suspectId', requireAuth, wrap(async (req, res) => {
  const body = z.object({ question: z.string().trim().min(1).max(1000), evidenceIds: z.array(z.string()).max(5).default([]) }).parse(req.body);
  const c = await ownedCase(req, true); const suspect = c.suspects.find(s => s.id === req.params.suspectId); if (!suspect) return res.status(404).json({ error: 'Suspect not found.' });
  if (c.status === 'completed') return res.status(409).json({ error: 'This investigation is complete.' });
  const history = c.conversations.get(suspect.id) || [];
  const response = await answerSuspect({ caseRecord: c, suspect, question: body.question, presentedEvidence: body.evidenceIds, history });
  const updated = [...history, { role: 'detective', text: body.question, at: new Date(), evidenceIds: body.evidenceIds }, { role: 'suspect', text: response.reply, at: new Date() }];
  c.conversations.set(suspect.id, updated); c.completedObjectives.addToSet('question-suspect');
  const unseen = c.evidence.find(e => e.unlockAfter === suspect.id && !c.discoveredEvidence.includes(e.id));
  if (unseen) c.discoveredEvidence.push(unseen.id);
  await c.save(); res.json({ reply: response.reply, suspicionShift: response.suspicionShift, unlockedEvidenceId: unseen?.id || null, messages: updated, case: caseDTO(c) });
}));
router.post('/cases/:caseId/interrogate/:suspectId/present-evidence', requireAuth, wrap(async (req, res) => {
  const body = z.object({ evidenceId: z.string(), question: z.string().trim().max(1000).default('What can you tell me about this?') }).parse(req.body);
  const c = await ownedCase(req); if (!c.discoveredEvidence.includes(body.evidenceId)) return res.status(403).json({ error: 'You have not discovered that evidence.' });
  res.json({ presented: true, evidenceId: body.evidenceId, question: body.question });
}));

router.get('/cases/:caseId/board', requireAuth, wrap(async (req, res) => { const c = await ownedCase(req); res.json({ board: c.board }); }));
router.put('/cases/:caseId/board', requireAuth, wrap(async (req, res) => {
  const board = z.object({ nodes: z.array(z.any()).max(100), connections: z.array(z.any()).max(200), notes: z.array(z.any()).max(100), viewport: z.object({ x: z.number().default(0), y: z.number().default(0), zoom: z.number().min(0.4).max(2).default(1) }).default({ x: 0, y: 0, zoom: 1 }) }).parse(req.body);
  const c = await ownedCase(req); c.board = board;
  const nodes = new Set(board.nodes.map(node => node.id));
  const keys = new Set();
  for (const connection of board.connections) {
    if (typeof connection.from !== 'string' || typeof connection.to !== 'string' || !nodes.has(connection.from) || !nodes.has(connection.to) || connection.from === connection.to) continue;
    const pair = [connection.from, connection.to].sort(); const key = pair.join(':');
    const first = c.evidence.find(item => item.id === pair[0] && c.discoveredEvidence.includes(item.id)); const second = c.evidence.find(item => item.id === pair[1] && c.discoveredEvidence.includes(item.id));
    const suspectId = c.suspects.find(item => item.id === pair[0] || item.id === pair[1])?.id;
    const evidence = first || second;
    const relatedEvidence = first && second && ((first.relatedSuspects || []).some(id => second.relatedSuspects?.includes(id)) || (first.relatedEvents || []).some(id => second.relatedEvents?.includes(id)));
    const relatedSuspect = evidence && suspectId && evidence.relatedSuspects?.includes(suspectId);
    if (relatedEvidence || relatedSuspect) keys.add(key);
  }
  if (board.connections.length) c.completedObjectives.addToSet('board-connection');
  await c.save();
  let xpAwarded = 0;
  for (const key of c.status === 'completed' ? [] : keys) {
    const claimed = await Case.updateOne({ _id: c._id, validDeductionKeys: { $ne: key } }, { $addToSet: { validDeductionKeys: key }, $inc: { earnedXP: 15 } });
    if (claimed.modifiedCount) { xpAwarded += 15; const updated = await User.findByIdAndUpdate(req.user.id, { $inc: { totalXP: 15 } }, { new: true }); updated.rank = rankFor(updated.totalXP); await updated.save(); }
  }
  const latest = await Case.findById(c._id).select('+caseBlueprint +solution');
  if (latest.validDeductionKeys.length >= 3) await User.updateOne({ _id: req.user.id }, { $addToSet: { achievements: 'evidence-expert' } });
  res.json({ board: latest.board, xpAwarded, validDeductionCount: latest.validDeductionKeys.length, case: caseDTO(latest) });
}));
router.post('/cases/:caseId/board/analyze', requireAuth, wrap(async (req, res) => { const c = await ownedCase(req, true); const analysis = await analyzeBoard(c, c.board); res.json({ analysis }); }));
router.get('/cases/:caseId/timeline', requireAuth, wrap(async (req, res) => { const c = await ownedCase(req); res.json({ timeline: caseDTO(c).timeline }); }));
router.post('/cases/:caseId/timeline/analyze', requireAuth, wrap(async (req, res) => {
  const c = await ownedCase(req); const analysis = await analyzeTimeline(c); res.json({ analysis });
}));

router.post('/cases/:caseId/hints', requireAuth, wrap(async (req, res) => {
  const body = z.object({ level: z.number().int().min(1).max(3).optional() }).parse(req.body || {}); const c = await ownedCase(req, true);
  if (c.status === 'completed') return res.status(409).json({ error: 'This case is complete. Review the revealed solution instead.' });
  const level = c.hintsUsed + 1; if (level > 3) return res.status(429).json({ error: 'You have used all three hints for this investigation.' });
  const hint = await getHint(c, level); c.hintsUsed = Math.max(c.hintsUsed, level); await c.save(); res.json({ ...hint, level, hintsUsed: c.hintsUsed });
}));
router.post('/cases/:caseId/accusation', requireAuth, wrap(async (req, res) => {
  const body = z.object({ suspectId: z.string().optional(), explanation: z.string().trim().max(3000).default(''), motive: z.string().trim().max(1000).default(''), method: z.string().trim().max(1000).default(''), evidenceIds: z.array(z.string()).max(20).default([]), ending: z.enum(['accuse', 'unsolved']).default('accuse') }).parse(req.body);
  const c = await ownedCase(req, true); if (c.status === 'completed') return res.status(409).json({ error: 'This accusation has already been resolved.', case: caseDTO(c, true) });
  if (body.ending === 'accuse' && !c.suspects.some(s => s.id === body.suspectId)) return res.status(400).json({ error: 'Choose a suspect before submitting your accusation.' });
  const claim = await Case.findOneAndUpdate({ _id: c._id, status: { $in: ['ready', 'in_progress', 'paused'] } }, { $set: { status: 'resolving' } }, { new: true });
  if (!claim) return res.status(409).json({ error: 'This investigation is already being closed. Refresh the case file.' });
  const won = body.ending === 'accuse' && body.suspectId === c.caseBlueprint.culpritId;
  const majorCount = c.evidence.filter(e => e.major && c.discoveredEvidence.includes(e.id)).length;
  const xp = earnedForCase({ won, difficulty: c.difficulty, hintsUsed: c.hintsUsed, discoveredCount: c.discoveredEvidence.length, majorCount, ending: body.ending });
  const result = { ending: body.ending === 'unsolved' ? 'unsolved' : won ? 'correct' : 'incorrect', won, accusedSuspectId: body.suspectId || null, submittedExplanation: body.explanation, revealed: true };
  c.accusation = { ...body, submittedAt: new Date() }; c.result = result; c.status = 'completed'; c.completedAt = new Date(); c.earnedXP += xp; await c.save();
  const increments = { totalXP: xp };
  if (body.ending === 'accuse') increments.gamesWon = won ? 1 : 0;
  const update = { $inc: increments };
  if (body.ending === 'accuse' && won) update.$inc.culpritsIdentified = 1;
  const achievements = [];
  if (body.ending === 'accuse' && won) { achievements.push('first-case'); if (!c.hintsUsed) achievements.push('no-hints'); if (c.difficulty === 'hard' && majorCount >= 3) achievements.push('perfect-investigation'); }
  if (c.suspects.every(s => (c.conversations.get(s.id) || []).length >= 2)) achievements.push('master-interrogator');
  if (c.discoveredEvidence.filter(id => c.evidence.find(e => e.id === id)?.major).length === c.evidence.filter(e => e.major).length) achievements.push('sharp-eyes');
  if (achievements.length) update.$addToSet = { achievements: { $each: achievements } };
  const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }); user.rank = rankFor(user.totalXP); await user.save();
  res.json({ result, xpAwarded: xp, user: userDTO(user), case: caseDTO(c, true) });
}));

export default router;
export { caseDTO };
