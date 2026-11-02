import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the main project folder
dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

// Import the app only after loading local environment variables. In hosted
// environments these values are supplied by the platform instead.
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
