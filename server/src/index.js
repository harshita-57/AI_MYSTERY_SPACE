import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import app from './app.js';
import { connectDatabase } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the main project folder
dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

const port = Number(process.env.PORT) || 4000;

try {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`AI Mystery Space API listening on http://localhost:${port}`);
  });
} catch (error) {
  console.error(`Server could not start: ${error.message}`);
  process.exitCode = 1;
}
