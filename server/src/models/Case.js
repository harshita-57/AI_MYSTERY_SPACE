import mongoose from 'mongoose';

const SuspectSchema = new mongoose.Schema({
  id: String, name: String, age: Number, occupation: String, relationship: String,
  background: String, initialStatement: String, personality: String,
  publicKnowledge: String, avatar: String
}, { _id: false });
const EvidenceSchema = new mongoose.Schema({
  id: String, title: String, category: String, description: String, transcript: String,
  mediaUrl: String, mediaProvider: String, mediaGenerationStatus: { type: String, default: 'text_only' }, relatedSuspects: [String], relatedEvents: [String], significance: String,
  reliability: String, isRedHerring: Boolean, unlockAfter: String, major: Boolean
}, { _id: false });
const TimelineSchema = new mongoose.Schema({ id: String, time: String, event: String, source: String, suspectIds: [String] }, { _id: false });

const CaseSchema = new mongoose.Schema({
  caseId: { type: String, unique: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  themeId: { type: String, required: true }, title: String, difficulty: String,
  incidentDate: String, location: String, incidentReport: String,
  victimProfile: { name: String, age: Number, occupation: String, background: String, relationships: String },
  suspects: [SuspectSchema], timeline: [TimelineSchema], evidence: [EvidenceSchema],
  missionObjectives: [String], caseBlueprint: { type: mongoose.Schema.Types.Mixed, select: false },
  solution: { type: mongoose.Schema.Types.Mixed, select: false },
  status: { type: String, enum: ['ready', 'in_progress', 'paused', 'resolving', 'completed', 'abandoned', 'failed'], default: 'ready' },
  discoveredEvidence: { type: [String], default: [] }, examinedEvidence: { type: [String], default: [] },
  completedObjectives: { type: [String], default: [] }, hintsUsed: { type: Number, default: 0 },
  validDeductionKeys: { type: [String], default: [] },
  suspicions: { type: Map, of: Number, default: {} },
  conversations: { type: Map, of: [mongoose.Schema.Types.Mixed], default: {} },
  board: { type: mongoose.Schema.Types.Mixed, default: () => ({ nodes: [], connections: [], notes: [], viewport: { x: 0, y: 0, zoom: 1 } }) },
  accusation: { type: mongoose.Schema.Types.Mixed, default: null }, result: { type: mongoose.Schema.Types.Mixed, default: null },
  earnedXP: { type: Number, default: 0 }, completedAt: Date
}, { timestamps: true });

export default mongoose.model('Case', CaseSchema);
