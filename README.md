# AI Mystery Space

An AI-powered detective investigation game. Choose a setting and difficulty, receive a newly generated confidential case, examine evidence, question suspects, connect clues, and submit a final accusation.

The repository was empty aside from `spec.md`; this implementation builds the first full-stack release around the specification. Case generation and AI interactions use Gemini through the server. MongoDB stores accounts, immutable case blueprints, conversations, discovered evidence, board layouts, outcomes, and progression.

## Requirements

- Node.js 20 or newer and npm 10 or newer
- A MongoDB database (MongoDB Atlas works for deployment)
- A Google Gemini API key for case generation and AI interactions

Optional Cloudinary and image-generation credentials enable media features. The core experience uses text evidence without them.

## Start locally

1. Copy `.env.example` to `.env` in the repository root (or create it using the variables below).
2. Set `MONGODB_URI`, `GEMINI_API_KEY`, and a long random `JWT_SECRET`.
3. Install the workspace dependencies with `npm install`.
4. Start MongoDB, then run `npm run dev`.
5. Open <http://localhost:5173>.

The Vite development server proxies `/api` to Express at `http://localhost:4000`. In production, `npm run build` creates the frontend and `npm start` serves both the frontend and API from one Express process. This same-origin setup also supports the HTTP-only login cookies.

## Deploy to Render

This is a practical first deployment using Render for the web service and MongoDB Atlas for the database. The included `render.yaml` describes the build and start commands.

1. **Prepare MongoDB Atlas.** Create a free cluster, create a database user with a strong password, and add the Render service's outbound access to Atlas Network Access. For a first deploy, Atlas can allow access from anywhere (`0.0.0.0/0`) while the database password remains strong; restrict this later if you use a fixed egress IP. Copy the application's `mongodb+srv://...` connection string and replace its password placeholder, URL-encoding special characters in the password.
2. **Prepare Gemini.** Create an API key in Google AI Studio. Keep it private; it belongs only in the Render server environment.
3. **Push this project to a GitHub repository.** Ensure `.env` is not committed; it is ignored by `.gitignore`.
4. **Create the Render service.** In Render, choose **New → Blueprint**, connect the repository, and apply the `render.yaml` blueprint. It creates one Node web service, builds the Vite client, then starts Express.
5. **Set the service environment variables** in Render's Environment page:
   - `MONGODB_URI`: the Atlas connection string.
   - `GEMINI_API_KEY`: the Google AI Studio key.
   - `JWT_SECRET`: a long random secret (at least 32 random bytes). Generate one locally with `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`.
   - `NODE_ENV`: `production` (the blueprint sets this).
   `PORT` is provided by Render. Leave `CLIENT_URL` unset for this single-origin deployment. Optional media variables can be added later.
6. **Deploy and check health.** Wait for the build to finish, open the Render service URL, then visit `<your-service-url>/api/health`. It should return JSON with `"status":"ok"`. Register an account and generate a case to verify MongoDB and Gemini connectivity.
7. **For later updates**, push commits to the connected branch; Render rebuilds and deploys automatically. If you add a separate frontend host later, set `CLIENT_URL` to that exact origin and review cross-site cookie requirements.

For local setup, create `.env` in the repository root and set `MONGODB_URI`, `GEMINI_API_KEY`, and a long random `JWT_SECRET`. Never put server credentials in Vite variables or commit `.env`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `PORT` | Express port (default `4000`) |
| `MONGODB_URI` | MongoDB connection string |
| `GEMINI_API_KEY` | Server-only Gemini credential |
| `GEMINI_MODEL` | Gemini model (default `gemini-2.5-flash`) |
| `CLIENT_URL` | Optional allowed browser origins for a separately hosted frontend; comma-separated origins are supported |
| `JWT_SECRET` | Random secret used to sign secure HTTP-only session cookies |
| `JWT_EXPIRES_IN` | Session duration (default `7d`) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Optional media storage credentials |
| `IMAGE_PROVIDER_URL`, `IMAGE_PROVIDER_API_KEY` | Optional image-generation provider adapter configuration |

Never put API credentials in the client environment or commit a real `.env` file.

## Gameplay flow

1. Register or sign in. Passwords are hashed with bcrypt and sessions use HTTP-only cookies.
2. Choose one of five themes and a difficulty. Gemini returns a structured case which is validated before it is stored.
3. Review the dossier, then open the case. Initial evidence is available in the evidence register; further evidence can unlock after examination or an interview.
4. Examine exhibits, interview suspects, present evidence, save notes and connections on the board, and review the timeline. Board changes and conversations persist in MongoDB.
5. Ask up to three progressive hints, then submit an accusation or close the case unsolved. The result is compared with the stored culprit ID, and the sealed solution is revealed only after completion.

The hidden case blueprint and solution are excluded from active-case responses. Suspect prompts receive only public case context and that suspect's established statements; AI does not decide the accusation outcome. The game remains available if optional image, audio, or video providers are absent.

## API overview

The Express API is mounted at `/api`. It includes authentication and profile endpoints, theme discovery, case generation and resumption, evidence examination, suspect interrogation, investigation board persistence and AI analysis, timeline review, hints, and final accusations. Every case endpoint checks ownership.

## Verification

- `npm test` runs backend unit tests and the client test command.
- `npm run build` creates the optimized Vite production build.
- `GET /api/health` reports API availability.

MongoDB and Gemini are external services: account registration, persistent gameplay, and real AI generation require their credentials and a reachable database. Optional image generation, Cloudinary uploads, multiplayer, voice, daily mysteries, and leaderboards are not configured in this initial release.

## Project layout

```text
client/                 React, Vite, interface and API client
server/src/config/      MongoDB connection
server/src/data/        Theme catalogue
server/src/middleware/   Authentication and errors
server/src/models/      Mongoose user and case models
server/src/routes/      REST API
server/src/services/    Gemini and progression services
spec.md                 Product and technical source of truth
```
