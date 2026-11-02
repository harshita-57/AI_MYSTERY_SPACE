# AI Mystery Space

An AI-powered detective investigation game. Choose a setting and difficulty, receive a newly generated confidential case, examine evidence, question suspects, connect clues, and submit a final accusation.

The repository was empty aside from `spec.md`; this implementation builds the first full-stack release around the specification. Case generation and AI interactions use Gemini through the server. MongoDB stores accounts, immutable case blueprints, conversations, discovered evidence, board layouts, outcomes, and progression.

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- MongoDB (local or hosted)
- A Google Gemini API key for case generation and AI interactions

Optional Cloudinary and image-generation credentials are listed in `.env.example`. The core experience works without media generation and uses clearly described text evidence instead of unrelated generated images. Audio evidence is labeled as a transcript when no audio provider is configured.

## Start locally

1. Copy `.env.example` to `.env` in the repository root.
2. Set `MONGODB_URI`, `GEMINI_API_KEY`, and a long random `JWT_SECRET`.
3. Install the workspace dependencies with `npm install`.
4. Start MongoDB, then run `npm run dev`.
5. Open <http://localhost:5173>.

The Vite development server proxies `/api` to Express at `http://localhost:4000`. To run the production build, use `npm run build`, then run `npm start` for the API. Serve the `client/dist` directory from a static host or reverse proxy and set `CLIENT_URL` to that origin.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `PORT` | Express port (default `4000`) |
| `MONGODB_URI` | MongoDB connection string |
| `GEMINI_API_KEY` | Server-only Gemini credential |
| `GEMINI_MODEL` | Gemini model (default `gemini-2.5-flash`) |
| `CLIENT_URL` | Allowed browser origin; comma-separated origins are supported |
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
