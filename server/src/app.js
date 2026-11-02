import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import api from './routes/api.js';
import { errorHandler, notFound } from './middleware/errors.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, '../../client/dist');
app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CLIENT_URL?.split(',').map(s => s.trim()) || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' })); app.use(cookieParser());
app.use('/api', rateLimit({ windowMs: 60_000, limit: 100, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60_000, limit: 12, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use('/api/auth/register', rateLimit({ windowMs: 15 * 60_000, limit: 8, standardHeaders: 'draft-7', legacyHeaders: false }));
const aiLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 24, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'The bureau has reached its AI request limit for now. Please try again shortly.' } });
app.use('/api/cases/generate', aiLimiter);
app.use('/api/cases/:caseId/interrogate', aiLimiter);
app.use('/api/cases/:caseId/board/analyze', aiLimiter);
app.use('/api/cases/:caseId/timeline/analyze', aiLimiter);
app.use('/api/cases/:caseId/hints', aiLimiter);
app.use('/api', api);

// In production, serve the Vite build from the same origin as the API so
// authentication cookies work without cross-site cookie configuration.
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.method !== 'GET' || !req.accepts('html')) return next();
  res.sendFile(path.join(clientDist, 'index.html'), error => {
    if (error) next();
  });
});

app.use(notFound); app.use(errorHandler);
export default app;
