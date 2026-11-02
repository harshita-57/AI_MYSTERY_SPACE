
import dotenv from 'dotenv';
import path from 'node:path';
import dns from 'node:dns';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the main project folder
dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

// Fix MongoDB Atlas DNS resolution
if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

// Import the app only after loading environment variables
const [{ default: app }, { connectDatabase }] = await Promise.all([
  import('./app.js'),
  import('./config/db.js')
]);

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
