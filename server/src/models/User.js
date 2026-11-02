import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  totalXP: { type: Number, default: 0 },
  rank: { type: String, default: 'Rookie Detective' },
  gamesPlayed: { type: Number, default: 0 },
  gamesWon: { type: Number, default: 0 },
  culpritsIdentified: { type: Number, default: 0 },
  achievements: { type: [String], default: [] },
  themePreferences: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
