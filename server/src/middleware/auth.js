import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token || req.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ error: 'Sign in to access your investigations.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: 'This session has expired. Please sign in again.' });
    req.user = user;
    next();
  } catch { return res.status(401).json({ error: 'Your session has expired. Please sign in again.' }); }
}
