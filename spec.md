# AI MYSTERY SPACE
## Product Requirements Document & Technical Specification
### Spec-Driven Development — Single Source of Truth

**Project Name:** AI Mystery Space  
**Project Type:** AI-Powered Interactive Mystery Investigation Platform  
**Development Approach:** Spec-Driven Development (SDD)  
**AI Provider:** Google Gemini API  
**Architecture:** MERN Stack  
**Primary Goal:** Build a fully functional, immersive, visually impressive mystery-solving web application.

---

# 1. PROJECT OVERVIEW

## 1.1 Introduction

AI Mystery Space is an AI-powered interactive mystery investigation platform where users become detectives and investigate fictional incidents generated dynamically by artificial intelligence.

Users can select different mystery themes, enter unique investigations, examine confidential case files, interact with AI-powered suspects, collect digital evidence, connect clues on an interactive investigation board, and ultimately identify the culprit.

Unlike traditional mystery games that follow predefined stories, AI Mystery Space should generate new incidents, characters, personalities, evidence, conversations, and possible outcomes dynamically for every new game.

The platform should deliver an immersive detective experience inspired by crime investigation series, cinematic mystery thrillers, escape rooms, and professional detective investigation environments.

The application must combine:
- AI-powered storytelling.
- Dynamic mystery generation.
- Interactive suspect interrogation.
- AI-generated digital evidence.
- Visual investigation and clue analysis.
- Multiple investigation outcomes.
- Gamification through XP, ranks, and achievements.
- Premium, cinematic user interface.

## 1.2 Core Vision

Create a realistic digital detective environment where every investigation feels like a new case.

The user should not feel like they are simply answering questions or playing a guessing game. They should feel like an actual detective examining evidence, questioning suspects, identifying contradictions, developing theories, and solving a crime.

## 1.3 Target Audience

- Mystery and crime thriller enthusiasts.
- Students and casual gamers.
- Users interested in interactive storytelling.
- Users who enjoy puzzles, detective games, and investigation challenges.

## 1.4 Core Product Principles

1. Every new game must provide a fresh mystery.
2. Every mystery must have a logically consistent hidden solution.
3. Suspects must have distinct personalities, motivations, and backstories.
4. Evidence must be connected to the generated mystery.
5. The AI must never arbitrarily change the culprit or the established facts.
6. Players must be able to investigate independently rather than follow a fixed sequence.
7. The interface must feel professional, cinematic, and immersive.
8. All major game progress must be saved.
9. The application must remain usable if an optional AI media-generation service is unavailable.

---

# 2. TECHNOLOGY STACK

Use the following technologies unless a documented technical limitation requires an alternative.

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| Vite | Frontend build tool |
| Tailwind CSS | Responsive styling |
| Framer Motion | Animations and transitions |
| Node.js | Backend runtime |
| Express.js | REST API and backend services |
| MongoDB | Database |
| Mongoose | Database modelling |
| Google Gemini API | Mystery generation, suspect conversations, clue evaluation, and game logic |
| Cloudinary | Storage and delivery of generated evidence media |
| Socket.IO | Optional real-time multiplayer functionality |
| JWT / secure session mechanism | Authentication |
| bcrypt | Password hashing |

### 2.1 Architecture

Use a modular MERN architecture.

**Frontend**
- React + Vite.
- Reusable UI components.
- React Router for navigation.
- Tailwind CSS.
- Framer Motion.
- State management using an appropriate lightweight solution or React Context.
- API communication through a centralized service layer.

**Backend**
- Node.js + Express.
- RESTful API architecture.
- Controllers, services, routes, middleware, and models separated logically.
- Centralized error handling.
- Gemini integration through a dedicated AI service.
- Media generation and storage through dedicated services.

**Database**
- MongoDB.
- Mongoose schemas.
- Persistent user accounts, cases, evidence, conversations, progress, XP, and achievements.

### 2.2 Project Structure

Organize the application approximately as follows:

    ai-mystery-space/
    ├── client/
    │   ├── public/
    │   └── src/
    │       ├── assets/
    │       ├── components/
    │       ├── pages/
    │       ├── layouts/
    │       ├── hooks/
    │       ├── context/
    │       ├── services/
    │       ├── utils/
    │       └── styles/
    │
    ├── server/
    │   └── src/
    │       ├── config/
    │       ├── controllers/
    │       ├── middleware/
    │       ├── models/
    │       ├── routes/
    │       ├── services/
    │       ├── validators/
    │       ├── utils/
    │       └── app.js
    │
    ├── docs/
    ├── .env.example
    ├── .gitignore
    ├── README.md
    ├── spec.md
    └── package.json

Codex may improve this structure when necessary, but it must preserve separation of concerns and maintainability.

---

# 3. USER EXPERIENCE AND NAVIGATION

The application should provide a complete experience from registration to completing an investigation.

## 3.1 Main Navigation

Provide the following navigation items:

- Home
- Explore Mysteries
- My Investigations
- Detective Profile
- Achievements
- Settings

Navigation must be consistent across the application.

## 3.2 User Authentication

Users must be able to:

- Register using name, email, and password.
- Log in.
- Log out.
- Maintain authenticated sessions.
- Access their saved investigations.
- View their detective profile and game statistics.
- Resume unfinished investigations.

Passwords must be securely hashed. Protected APIs must verify the authenticated user.

## 3.3 Landing Page

Create a cinematic landing page introducing AI Mystery Space.

Required elements:

- Attractive hero section.
- Project logo and branding.
- A compelling tagline.
- Cinematic background image or animated visual.
- Short introduction explaining the platform.
- Featured mystery themes.
- How-it-works section.
- Feature highlights.
- Call-to-action buttons: Start Investigating and Explore Mysteries.
- Footer with navigation and project information.

The landing page should immediately communicate that this is an interactive AI-powered detective experience.

## 3.4 Dashboard

After login, users should see a personalized detective dashboard.

Display:

- Welcome message.
- Detective rank.
- Total XP.
- Cases completed.
- Cases solved successfully.
- Culprits identified.
- Current win rate.
- Recent investigations.
- Continue Investigation section.
- Available mystery themes.
- Unlocked achievements.
- Daily mystery challenge, if implemented.

The dashboard should feel like a professional detective command centre rather than a generic admin dashboard.

---

# 4. MYSTERY THEMES

Users must be able to select a mystery theme before starting an investigation.

Every theme should have its own visual identity, atmosphere, case types, and evidence presentation.

## 4.1 Initial Themes

### A. The Dark Academia Mystery

Setting: A prestigious university with hidden secrets.

Possible incidents:
- Professor mysteriously disappears.
- A student is found dead in the university library.
- A confidential research document is stolen.
- A secret society is involved in an incident.

Visual identity:
- Dark burgundy.
- Antique gold.
- Vintage paper textures.
- Gothic architecture.
- Library imagery.
- Elegant serif typography.

### B. The Mansion Files

Setting: A luxurious mansion occupied by a wealthy family.

Possible incidents:
- Murder during a family gathering.
- Missing family heirloom.
- Suspicious inheritance dispute.
- A mysterious disappearance during a party.

Visual identity:
- Emerald green.
- Black.
- Antique gold.
- Luxury interiors.
- Elegant typography.

### C. Cybercrime Division

Setting: A modern digital investigation environment.

Possible incidents:
- Identity theft.
- Corporate data breach.
- Digital blackmail.
- Hacked social media account.
- Suspicious financial transactions.

Visual identity:
- Dark interface.
- Neon blue and purple.
- Digital grids.
- Terminal-inspired components.
- Futuristic visual elements.

### D. The Forgotten Ward

Setting: An abandoned hospital with a mysterious past.

Possible incidents:
- Missing patient records.
- Disappearance of a doctor.
- Suspicious hospital incident.
- A mysterious patient identity.

Visual identity:
- Desaturated colors.
- Dark grey.
- Muted green.
- Eerie hospital environments.
- Subtle atmospheric animations.

### E. The Last Train

Setting: A luxury train travelling through the night.

Possible incidents:
- A passenger disappears.
- A valuable object is stolen.
- A suspicious incident occurs inside a locked compartment.
- Conflicting passenger alibis.

Visual identity:
- Vintage railway aesthetic.
- Sepia.
- Dark brown.
- Brass details.
- Cinematic nighttime imagery.

## 4.2 Additional Themes

Design the system so new themes can be added without rewriting the core game engine.

Future themes may include:

- The Haunted Hotel.
- The Royal Conspiracy.
- The Museum Heist.
- The Island Mystery.
- The Underground Files.
- The Time Capsule.
- The Space Station Incident.
- The Celebrity Scandal.

## 4.3 Theme Selection Page

Each theme must have:

- Theme cover image.
- Theme title.
- Short description.
- Atmospheric background.
- Difficulty indicator.
- Mystery category.
- Select Theme button.
- Hover animations.

Selecting a theme should transition into an immersive case-opening experience.

---

# 5. DYNAMIC AI MYSTERY GENERATION

This is the central feature of AI Mystery Space.

Every time a user starts a new investigation, the Gemini API must generate a new mystery based on the selected theme and difficulty.

## 5.1 Mystery Generation Requirements

Each generated mystery must contain:

1. Unique case ID.
2. Case title.
3. Incident description.
4. Location.
5. Date and time of incident.
6. Victim profile, where applicable.
7. Suspect profiles.
8. Suspect relationships.
9. Individual backstories.
10. Motives.
11. Timeline of events.
12. Hidden culprit identity.
13. Actual sequence of events.
14. Evidence list.
15. Red herrings.
16. Clue dependencies.
17. Mission objectives.
18. Final solution.
19. Possible endings.
20. Difficulty level.

## 5.2 Case Consistency

The AI must generate a complete internal case blueprint before exposing the investigation to the user.

This blueprint is the authoritative source of truth for the entire game.

The system must establish:
- Who committed the crime.
- Why the crime happened.
- How it happened.
- When it happened.
- Which suspects are innocent.
- Which statements are true or false.
- Which evidence proves or contradicts each statement.

The culprit and core facts must remain fixed throughout the investigation.

The AI must not invent new facts during interrogation that contradict the original case blueprint.

## 5.3 Fresh Incidents

Every new game should generate a different incident.

Variation should include:
- Different characters.
- Different names.
- Different relationships.
- Different motives.
- Different locations within the theme.
- Different crime methods.
- Different evidence.
- Different timelines.
- Different endings.

Do not simply change the names of characters while repeating the same mystery.

Previously generated cases must be stored in MongoDB.

Refreshing a page or reopening an existing case must NOT accidentally generate a new case.

A new case should only be generated when the user explicitly selects Start New Investigation.

## 5.4 Difficulty Levels

Provide:

- Easy: More direct evidence and fewer suspects.
- Medium: Multiple suspects, conflicting statements, and moderate difficulty.
- Hard: Complex timelines, misleading evidence, subtle contradictions, and more challenging deductions.

Difficulty must affect actual gameplay, not just its displayed label.

---

# 6. CONFIDENTIAL CASE FILE

Every investigation must begin with a cinematic confidential case file.

Before entering the investigation room, display a dossier containing:

### Case Information
- Case number.
- Case title.
- Classification: CONFIDENTIAL.
- Incident date.
- Location.
- Case description.
- Incident report.

### Victim Profile
Where applicable:
- Name.
- Age.
- Occupation.
- Background.
- Relationships.
- Relevant information.

### Suspect Profiles

Display each suspect with:
- AI-generated profile image.
- Name.
- Age.
- Occupation.
- Relationship to the victim or incident.
- Brief background.
- Initial statement.
- Suspicion indicator.

The initial suspicion indicator must not reveal the actual culprit.

### Mission Objectives

Examples:
- Investigate the incident.
- Examine available evidence.
- Question suspicious individuals.
- Identify contradictions.
- Establish a timeline.
- Identify the culprit.
- Submit a final accusation.

Provide an Open Case button.

The case file should use an animated opening transition, similar to opening a classified investigation folder.

---

# 7. AI-POWERED INTERROGATION ROOM

This is one of the most important features.

Users must be able to question suspects through an interactive AI-powered conversation interface.

## 7.1 Suspect Personalities

Every suspect must have:
- Unique personality.
- Distinct communication style.
- Personal history.
- Relationship to the incident.
- Motive or lack of motive.
- Secrets.
- Knowledge of relevant events.
- Established alibi.
- Truthful and deceptive statements, where appropriate.

Suspects must not all respond in the same generic AI style.

## 7.2 Interrogation Interface

The interrogation screen must include:

- Suspect profile image.
- Suspect name.
- Occupation.
- Background summary.
- Relationship to the case.
- Conversation history.
- Chat input.
- Send button.
- Optional suggested questions.
- Evidence presentation control.
- Interrogation status.

Users should be able to type natural-language questions.

Example:

Detective: Where were you at 9 PM?

Suspect: I was in my office. I had a lot of work to finish.

Detective: The security footage shows that your office was empty.

Suspect: I... stepped out for a few minutes.

The AI should respond according to the suspect's established personality and knowledge.

## 7.3 Suspect Behaviour

Suspects may:

- Cooperate.
- Become defensive.
- Avoid answering.
- Provide partial information.
- Lie about certain events.
- Reveal secrets gradually.
- Contradict previous statements.
- React to evidence presented by the user.

The AI must maintain conversational memory for each suspect within that case.

## 7.4 Evidence-Based Interrogation

Users must be able to present collected evidence during interrogation.

For example:
- Present CCTV evidence.
- Show a suspicious email.
- Reference a message.
- Challenge a timeline.
- Compare a statement against a photograph.

The suspect must react based on whether the presented evidence is relevant to their established knowledge.

Evidence must not automatically force a confession.

## 7.5 Dynamic Suspicion

Allow the user to change which suspects they consider suspicious.

Suspicion levels may be represented as:

- Low suspicion.
- Moderate suspicion.
- High suspicion.

These should reflect the player's own investigation notes or conclusions, not automatically reveal the actual culprit.

---

# 8. AI-GENERATED EVIDENCE SYSTEM

All evidence must be generated or assembled from the current AI-generated mystery.

Evidence must not be random media unrelated to the case.

The evidence service must use the case blueprint to ensure that every generated asset supports or challenges established facts.

## 8.1 Evidence Categories

### A. Photographic Evidence

Examples:
- Crime scene photographs.
- Objects found at the location.
- Room interiors.
- Personal belongings.
- Suspicious items.
- Relevant locations.
- Fingerprint or forensic-style visual evidence.

Use an AI image-generation provider for genuine generated images.

Store generated image URLs and metadata using Cloudinary.

Gemini should generate the visual descriptions and evidence context.

Do not assume text-generation models can directly produce image files. Implement a separate image-generation provider adapter when necessary.

### B. Messaging Evidence

Generate fictional digital conversations, including:

- WhatsApp-style messages.
- SMS conversations.
- Instagram DMs.
- Group chats.
- Deleted-message records.

Each conversation must include:
- Participants.
- Timestamps.
- Message content.
- Relevant context.
- Evidence reference.
- Relationship to the case.

Present these in realistic but clearly fictional interfaces.

### C. Email Evidence

Generate:
- Sender.
- Receiver.
- Subject.
- Date and time.
- Email body.
- Attachments, where relevant.

Some emails may contain contradictions or hidden information.

### D. CCTV Evidence

Provide simulated surveillance evidence:

- Camera ID.
- Location.
- Timestamp.
- Recorded events.
- Relevant people or objects.
- Description of what happened.

Where actual AI-generated video is unavailable, create a cinematic CCTV-style simulated clip or sequence of generated frames.

Do not claim that a still image is an actual video recording.

### E. Audio Evidence

Provide:
- Audio recording metadata.
- Recording location.
- Timestamp.
- Transcript.
- Relevant dialogue.
- Context.

If an audio-generation service is available, generate an audio clip. Otherwise, provide a transcript-based evidence item and clearly indicate that it is a transcript rather than playable audio.

### F. Social Media Evidence

Create fictional profiles with:
- Profile picture.
- Username.
- Biography.
- Posts.
- Comments.
- Followers/following counts.
- Post timestamps.
- Relevant interactions.

All profiles must be fictional and generated for the investigation.

## 8.2 Evidence Metadata

Every evidence item must have:

- Unique evidence ID.
- Evidence title.
- Evidence category.
- Description.
- Generated media URL, where applicable.
- Creation timestamp.
- Related suspect IDs.
- Related event IDs.
- Evidence significance.
- Reliability classification.
- Whether it is a red herring.
- Whether it has been discovered.
- Whether it has been examined.

## 8.3 Evidence Unlocking

Evidence should be revealed progressively.

Some evidence may become available:
- At the start of the investigation.
- After examining another clue.
- After questioning a suspect.
- After challenging a suspect with evidence.
- After completing a mission objective.

The player must not receive the entire solution immediately.

---

# 9. INTERACTIVE INVESTIGATION BOARD

Create a visual detective evidence board where users can organize and connect evidence.

The board should resemble a real detective's investigation wall.

## 9.1 Core Functionality

Users must be able to:

- Drag evidence cards onto the board.
- Move and reposition cards.
- Resize or inspect cards where appropriate.
- Connect two or more evidence items.
- Connect evidence to suspects.
- Connect suspects to locations.
- Draw relationship lines.
- Add personal notes.
- Edit notes.
- Delete notes.
- Remove evidence from the board.
- Zoom in and out.
- Pan around the board.
- Save board layout.
- Reopen the board with the previous layout intact.

Removing an item from the board must not delete the original evidence from the case.

## 9.2 Evidence Connections

Users should be able to create connections such as:

- Suspect A was present at Location B.
- Message C contradicts Suspect A's statement.
- Photograph D supports Event E.
- Two suspects may have coordinated their actions.

Connection labels may be added by the user.

## 9.3 AI Board Analysis

The user must be able to request AI analysis of their investigation board.

Gemini should evaluate:
- Connected clues.
- Evidence relevance.
- Suspect relationships.
- Timeline consistency.
- Contradictions.
- Missing connections.
- Unsupported assumptions.

The AI should return feedback such as:

"You have identified a strong connection between the 9:15 PM CCTV recording and the suspect's original statement. However, you have not yet considered the email sent shortly before the incident."

Feedback must guide the player without directly revealing the culprit.

The AI must distinguish between confirmed facts, reasonable deductions, and unsupported assumptions.

The system should not reward a connection merely because the player draws a line between two unrelated items.

---

# 10. INTERACTIVE TIMELINE

Provide an investigation timeline.

Users should be able to examine events in chronological order.

Display:
- Incident time.
- Suspect movements.
- CCTV timestamps.
- Message timestamps.
- Emails.
- Witness statements.
- Important discoveries.

Allow users to compare the timeline against suspect alibis.

The AI may highlight possible inconsistencies without revealing the complete solution.

---

# 11. FINAL ACCUSATION AND ENDINGS

Users must be able to submit their final accusation when they believe they have solved the mystery.

## 11.1 Accusation Interface

Display:
- List of suspects.
- Suspect profile information.
- Culprit selection.
- Explanation of the player's theory.
- Supporting evidence selection.
- Final submission button.

The user should identify:
1. Who committed the incident.
2. Why they did it.
3. How they did it.
4. Which evidence supports their conclusion.

## 11.2 Possible Outcomes

### Ending A: Correct Culprit

If the selected suspect is the actual culprit:
- Display a cinematic SUCCESS screen.
- Reveal the complete solution.
- Explain the motive.
- Explain how the crime happened.
- Explain the important clues.
- Explain which deductions were correct.
- Award XP according to performance.

### Ending B: Wrong Culprit

If the selected suspect is incorrect:
- Display an investigation failure or incorrect accusation screen.
- Reveal that the selected suspect was not responsible.
- Explain the major overlooked evidence after the attempt.
- Reveal the actual culprit and solution.
- Award XP according to the applicable rules.

### Ending C: Unsolved Case

If the player chooses to end without a correct accusation:
- Display the unsolved outcome.
- Reveal the solution if the user chooses to review it.
- Award XP based on investigation progress, if applicable.

### Ending D: Hidden Ending

Some cases may contain optional secrets or hidden objectives.

Discovering them may unlock special endings or bonus achievements.

## 11.3 AI Solution Evaluation

The final result must be evaluated against the original stored case blueprint.

Gemini may evaluate the player's explanation, but it must not independently decide or change the culprit.

The actual culprit identity must be checked using the authoritative stored solution.

AI-generated explanations must be grounded in the case's established facts and evidence.

---

# 12. XP, RANKS AND ACHIEVEMENTS

Implement a gamification system to encourage users to investigate more cases.

## 12.1 XP System

Users can earn XP through:

- Successfully identifying the culprit.
- Completing investigations.
- Discovering important evidence.
- Making valid evidence connections.
- Identifying contradictions.
- Completing optional objectives.
- Discovering hidden clues.
- Solving difficult cases.

XP must be awarded by the backend and must not be directly modifiable by the frontend.

Suggested starting rewards:

| Activity | Suggested XP |
|---|---:|
| Completing an investigation | 20 |
| Correct culprit identification | 100 |
| Discovering major evidence | 10 |
| Valid deduction | 15 |
| Completing a bonus objective | 20 |
| Solving a hard case | Additional 50 |

Prevent duplicate XP awards when the same action is submitted multiple times.

## 12.2 Detective Ranks

Suggested ranks:

1. Rookie Detective.
2. Junior Investigator.
3. Field Detective.
4. Senior Detective.
5. Chief Investigator.
6. Master Detective.
7. Legendary Detective.

Rank thresholds should be configurable.

## 12.3 Achievements

Examples:

- First Case Solved.
- Sharp Eyes: Discover all major evidence.
- Master Interrogator: Successfully expose a contradiction.
- Evidence Expert: Create multiple valid evidence connections.
- No Hints Needed: Solve a case without requesting hints.
- Perfect Investigation: Solve a hard case with strong supporting evidence.
- Mystery Master: Complete multiple themes.

Provide an achievement gallery on the user profile.

---

# 13. HINT SYSTEM

Provide an optional hint system.

Hints should be progressive:

- Hint 1: General direction.
- Hint 2: Points toward relevant evidence.
- Hint 3: Suggests a contradiction or suspect relationship.

Hints must not immediately reveal the culprit.

Using hints may reduce the maximum XP earned for that investigation.

---

# 14. DETECTIVE PROFILE

Each authenticated user must have a profile containing:

- Display name.
- Profile image or avatar.
- Detective rank.
- Total XP.
- Total cases played.
- Cases solved.
- Culprits identified.
- Win rate.
- Achievements.
- Theme preferences.
- Recent activity.
- Investigation history.

Users should be able to revisit completed investigations and review their final results.

---

# 15. VISUAL DESIGN AND USER INTERFACE

The UI is a major part of this project's identity.

It must be professional, premium, realistic, cinematic, and visually engaging.

Avoid generic dashboard templates and repetitive card layouts.

The interface should resemble a combination of:
- Professional detective command centre.
- Cinematic crime thriller.
- Premium investigation game.
- Classified case management environment.

## 15.1 Overall Design Direction

Use a dark cinematic design as the default visual direction.

Suggested base palette:

| Element | Color |
|---|---|
| Main background | #101114 |
| Secondary background | #191A20 |
| Card background | #202129 |
| Primary accent | #D6AE68 |
| Secondary accent | #762E3B |
| Main text | #F4F0E8 |
| Muted text | #A5A3A0 |
| Borders | #34343C |

Theme-specific colors and backgrounds should adapt to the selected mystery theme.

## 15.2 Typography

Use a combination of:
- Elegant serif typography for headings and case titles.
- Modern sans-serif typography for navigation and body text.
- Monospace typography for digital evidence and cybercrime interfaces.

Typography must remain readable and consistent.

## 15.3 AI-Generated Visual Assets

Use appropriate AI image-generation services for:
- Landing page backgrounds.
- Mystery theme covers.
- Suspect portraits.
- Locations.
- Crime scene environments.
- Evidence photographs.
- Case-specific visual assets.

Use Cloudinary to store and deliver generated media.

Use optimized image sizes and lazy loading.

Generated assets must correspond to the actual mystery and must not introduce contradictory visual facts.

## 15.4 Required Animations

Implement polished animations using Framer Motion.

Required experiences:

1. Cinematic landing-page entrance.
2. Animated case folder opening.
3. Classified file reveal.
4. Theme selection transitions.
5. Suspect profile transitions.
6. Interrogation message animations.
7. Evidence card drag-and-drop interactions.
8. Animated evidence connection lines.
9. Investigation board transitions.
10. XP earning animation.
11. Detective rank-up animation.
12. Final accusation reveal.
13. Case completion animation.

Animations must enhance the experience without slowing down navigation.

## 15.5 Sound Design

Where feasible, provide optional ambient background sound.

Examples:
- Subtle detective room ambience.
- Rain and thunder for selected themes.
- Keyboard and terminal sounds for cybercrime.
- Suspenseful case-opening sound effects.

Provide mute and volume controls.

Sound must be disabled by default until the user explicitly enables it.

## 15.6 Responsive Design

The application must work across:
- Desktop.
- Laptop.
- Tablet.
- Mobile.

The investigation board should support touch interaction or provide a usable alternative on smaller screens.

Do not simply shrink the desktop interface on mobile.

---

# 16. AI ARCHITECTURE AND GEMINI INTEGRATION

Gemini is the central AI provider.

All AI requests must go through the backend.

Never expose the Gemini API key in frontend code.

## 16.1 AI Services

Create separate, reusable services for:

- Mystery generation.
- Case validation.
- Suspect conversation.
- Evidence generation.
- Clue evaluation.
- Investigation board analysis.
- Timeline analysis.
- Hint generation.
- Final explanation generation.
- Performance evaluation.

## 16.2 Structured AI Responses

Use structured JSON responses wherever practical.

Validate all AI-generated content before saving it to MongoDB or returning it to the frontend.

Implement:
- Schema validation.
- Retry limits.
- Request timeouts.
- Error handling.
- Rate limiting.
- Safe fallback responses.

Never assume that AI-generated JSON is valid without checking it.

## 16.3 Case Memory

Every game must have a persistent case context.

The AI must receive only the necessary case information for each operation.

Maintain:
- Authoritative case facts.
- Suspect personalities.
- Suspect knowledge.
- Evidence records.
- Previous conversations.
- Discovered clues.
- Current investigation state.

The AI must not reveal confidential solution information during ordinary interrogation or hint requests.

## 16.4 Prompt Safety

Treat user input and AI-generated content as untrusted data.

A user attempting to manipulate the AI into revealing the solution must not override the game's rules.

The hidden solution must be protected by backend authorization and must never be sent to the browser during an active investigation unless the game has reached an appropriate reveal state.

---

# 17. MEDIA GENERATION AND CLOUDINARY

Implement a modular media-generation architecture.

Gemini should create evidence descriptions, visual instructions, captions, transcripts, and contextual information.

An appropriate image-generation provider should create image files.

An optional audio or video generation provider may be integrated if available.

Cloudinary should store and deliver generated media.

The backend should maintain:
- Provider name.
- Asset type.
- Asset URL.
- Related case ID.
- Related evidence ID.
- Generation status.
- Creation timestamp.

If a media-generation provider fails:
- Show a meaningful loading or error state.
- Allow retries.
- Preserve the rest of the investigation.
- Never display an unrelated image as generated evidence.

Do not hardcode provider-specific generation logic throughout the application. Use service adapters so providers can be changed later.

---

# 18. DATABASE DESIGN

Use MongoDB with Mongoose.

Create appropriate schemas and relationships.

## 18.1 User Model

Fields:
- name
- email
- passwordHash
- avatar
- totalXP
- rank
- gamesPlayed
- gamesWon
- culpritsIdentified
- achievements
- createdAt
- updatedAt

## 18.2 Case Model

Fields:
- caseId
- userId
- themeId
- title
- difficulty
- incidentReport
- victimProfile
- suspects
- timeline
- missionObjectives
- caseBlueprint
- solution
- status
- createdAt
- completedAt

The solution and hidden blueprint must be protected from unauthorized client access.

## 18.3 Evidence Model

Fields:
- evidenceId
- caseId
- title
- category
- description
- mediaUrl
- transcript
- relatedSuspects
- relatedEvents
- significance
- reliability
- isRedHerring
- discoveryStatus
- createdAt

## 18.4 Conversation Model

Fields:
- conversationId
- caseId
- suspectId
- messages
- createdAt
- updatedAt

## 18.5 Investigation Board Model

Fields:
- caseId
- userId
- nodes
- connections
- notes
- viewport
- updatedAt

## 18.6 Investigation Progress Model

Fields:
- userId
- caseId
- discoveredEvidence
- examinedEvidence
- interrogationProgress
- completedObjectives
- hintsUsed
- currentSuspicions
- finalAccusation
- result
- earnedXP
- updatedAt

## 18.7 Achievement Model

Fields:
- achievementId
- title
- description
- icon
- XPReward
- unlockCondition

The exact schema design may be refined during implementation, but all required functionality must be supported.

---

# 19. API REQUIREMENTS

Create RESTful endpoints using Express.

Suggested API groups:

## Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

## Themes
- GET /api/themes
- GET /api/themes/:themeId

## Cases
- POST /api/cases/generate
- GET /api/cases
- GET /api/cases/:caseId
- GET /api/cases/:caseId/dossier
- POST /api/cases/:caseId/start
- POST /api/cases/:caseId/complete

## Evidence
- GET /api/cases/:caseId/evidence
- GET /api/cases/:caseId/evidence/:evidenceId
- POST /api/cases/:caseId/evidence/:evidenceId/examine

## Interrogation
- POST /api/cases/:caseId/interrogate/:suspectId
- GET /api/cases/:caseId/interrogate/:suspectId/history
- POST /api/cases/:caseId/interrogate/:suspectId/present-evidence

## Investigation Board
- GET /api/cases/:caseId/board
- PUT /api/cases/:caseId/board
- POST /api/cases/:caseId/board/analyze

## Timeline
- GET /api/cases/:caseId/timeline
- POST /api/cases/:caseId/timeline/analyze

## Hints and Accusations
- POST /api/cases/:caseId/hints
- POST /api/cases/:caseId/accusation

## User Profile
- GET /api/users/profile
- PUT /api/users/profile
- GET /api/users/progress
- GET /api/users/achievements

Endpoint names may be adjusted during implementation, but equivalent functionality is mandatory.

Every protected endpoint must verify ownership of the relevant case.

---

# 20. GAME STATE AND PERSISTENCE

The game must support the following states:

- Generating.
- Ready.
- In Progress.
- Paused.
- Completed.
- Abandoned.
- Failed.

Save user progress throughout the investigation.

Users must be able to:
- Leave an investigation.
- Return later.
- Resume from the previous state.
- View previously discovered evidence.
- View their saved board.
- Continue suspect conversations.
- Review completed cases.

A page refresh must not destroy investigation progress.

Prevent accidental duplicate case generation and duplicate XP awards.

---

# 21. SECURITY AND RELIABILITY

Implement:

- Password hashing.
- Authentication middleware.
- Authorization and case ownership checks.
- Environment-based secret management.
- Input validation.
- API rate limiting.
- Secure CORS configuration.
- Error handling.
- Request timeouts.
- Protection against duplicate submissions.
- Safe file upload validation.
- Appropriate media access controls.
- Logging without exposing API keys or passwords.

Use `.env` for secrets.

Provide `.env.example` with variable names and placeholder values only.

Never commit real API keys or database credentials.

---

# 22. TESTING REQUIREMENTS

Codex must implement and execute tests.

## 22.1 Backend Tests

Test:
- User registration and login.
- Protected routes.
- Case generation.
- AI response validation.
- Case ownership.
- Evidence retrieval.
- Suspect interrogation.
- Board persistence.
- Final accusation.
- XP calculation.
- Duplicate XP prevention.

## 22.2 Frontend Tests

Test:
- Navigation.
- Theme selection.
- Case dossier display.
- Interrogation interactions.
- Evidence inspection.
- Board drag-and-drop.
- Notes and connections.
- Final accusation.
- Dashboard updates.
- Responsive layouts.

## 22.3 Integration Tests

Verify:
- Frontend communicates with backend.
- Backend connects to MongoDB.
- Gemini requests work.
- Generated evidence is associated with the correct case.
- Cloudinary uploads work when configured.
- Investigation progress persists.
- AI responses remain consistent with the case blueprint.

## 22.4 Error Scenarios

Test:
- Invalid Gemini credentials.
- AI timeout.
- Invalid AI response.
- Database disconnection.
- Media generation failure.
- Expired authentication.
- Network interruption.
- Invalid user input.

The application must display useful error messages instead of crashing.

---

# 23. PERFORMANCE AND ACCESSIBILITY

- Lazy-load large media assets.
- Optimize images.
- Avoid unnecessary AI requests.
- Cache appropriate static data.
- Paginate long investigation histories.
- Keep the UI responsive during AI requests.
- Use loading indicators.
- Support keyboard navigation where practical.
- Provide accessible labels and sufficient contrast.
- Respect reduced-motion preferences.
- Prevent long AI requests from freezing the interface.

---

# 24. OPTIONAL FUTURE FEATURES

These features should be designed for extensibility but are not required for the first release.

### Multiplayer Investigation
Use Socket.IO to allow multiple players to investigate the same case.

Potential functionality:
- Shared investigation board.
- Collaborative evidence collection.
- Team interrogation.
- Group accusations.
- Team XP.

### Voice Interrogation
- Speech-to-text questions.
- AI-generated suspect responses.
- Text-to-speech voices.

### Daily Mystery
- One new mystery challenge each day.
- Daily completion rewards.
- Streak tracking.

### Detective Leaderboard
- XP rankings.
- Cases solved.
- Challenge completion.

### Advanced Forensics
- Fingerprint comparison.
- Handwriting comparison.
- Photo examination.
- Digital metadata analysis.

### Secret Case Archive
Unlock special investigations through achievements and hidden discoveries.

---

# 25. IMPLEMENTATION PRIORITIES

The application must be developed as a complete product, not as a collection of disconnected screens.

Recommended implementation order:

**Priority 1 — Foundation**
- Project setup.
- Database connection.
- Authentication.
- Shared layouts.
- Theme configuration.
- Core navigation.

**Priority 2 — Core Mystery Engine**
- Gemini integration.
- Case generation.
- Case blueprint validation.
- Confidential dossier.
- Suspect generation.
- Evidence generation.
- Persistent case storage.

**Priority 3 — Investigation Experience**
- Interrogation room.
- Evidence inspection.
- Evidence collection.
- Investigation board.
- Timeline.
- AI clue evaluation.

**Priority 4 — Game Completion**
- Final accusation.
- Solution reveal.
- Multiple endings.
- XP calculation.
- Detective ranks.
- Achievements.

**Priority 5 — Premium Experience**
- Cinematic animations.
- Theme-specific UI.
- Generated visual assets.
- Responsive polish.
- Sound settings.
- Loading and transition effects.

**Priority 6 — Quality Assurance**
- Unit tests.
- Integration tests.
- End-to-end testing.
- Security review.
- Error handling.
- Performance optimization.
- Final documentation.

These priorities organize implementation; they do not authorize leaving required features as nonfunctional placeholders.

---

# 26. ACCEPTANCE CRITERIA

The project is considered complete only when all mandatory criteria below are satisfied.

## User Experience
- [ ] Users can register, log in, and log out.
- [ ] Users can explore and select mystery themes.
- [ ] The landing page and dashboard are fully implemented.
- [ ] The interface is responsive.
- [ ] Animations and visual transitions work.

## Mystery Generation
- [ ] A new case can be generated for each new investigation.
- [ ] Cases contain consistent suspects, motives, evidence, and solutions.
- [ ] Different games produce meaningfully different incidents.
- [ ] Existing cases remain unchanged when reopened.
- [ ] Confidential information is protected.

## Interrogation
- [ ] Users can question suspects.
- [ ] Suspects have distinct personalities.
- [ ] Suspects maintain conversation context.
- [ ] Users can present evidence.
- [ ] Suspects respond consistently with established case facts.

## Evidence
- [ ] AI-generated or AI-assembled evidence is available.
- [ ] Evidence belongs to the correct case.
- [ ] Users can inspect evidence.
- [ ] Evidence includes relevant metadata.
- [ ] Media-generation failures are handled gracefully.

## Investigation Board
- [ ] Users can drag and position evidence.
- [ ] Users can connect evidence.
- [ ] Users can add, edit, and remove notes.
- [ ] Board layouts are saved.
- [ ] AI can evaluate the investigation board.

## Game Completion
- [ ] Users can submit accusations.
- [ ] Correct and incorrect accusations are evaluated properly.
- [ ] The actual solution is revealed at the appropriate time.
- [ ] XP is awarded correctly.
- [ ] Achievements and ranks update correctly.

## Persistence and Reliability
- [ ] Investigation progress is saved.
- [ ] Users can resume unfinished cases.
- [ ] Duplicate submissions do not award duplicate XP.
- [ ] Protected routes enforce authorization.
- [ ] Core application tests pass.

---

# 27. CODEX DEVELOPMENT INSTRUCTIONS

This section defines how Codex must work on this project.

## 27.1 Specification Authority

This `spec.md` is the single source of truth for AI Mystery Space.

Before writing or modifying code, read the complete specification.

All implementation decisions must align with the requirements in this document.

Do not silently remove, simplify, or replace required features.

If a requirement is technically infeasible or requires an additional external service:
1. Explain the limitation.
2. Identify the required dependency or alternative.
3. Preserve the intended user experience.
4. Document the decision.
5. Update the implementation plan.

## 27.2 Development Behaviour

Codex must:

- Inspect the existing repository before making changes.
- Establish a complete implementation plan.
- Build the application end to end.
- Use clean, modular, maintainable code.
- Avoid unnecessary duplication.
- Implement real functionality behind every interactive control.
- Connect frontend screens to actual backend functionality.
- Persist all required information in MongoDB.
- Use Gemini through secure backend services.
- Implement proper loading, empty, success, and error states.
- Test each major feature.
- Fix discovered bugs.
- Update README and environment documentation.

Do not create a frontend-only mockup and claim that the application is complete.

Do not use hardcoded mystery data as a substitute for AI generation in the production gameplay flow.

Demo or seed data may be used for development and testing, but it must be clearly separated from actual generated investigations.

## 27.3 External Services

Codex must identify all required external credentials.

Create `.env.example` containing placeholders for:

- PORT
- MONGODB_URI
- GEMINI_API_KEY
- GEMINI_MODEL
- CLIENT_URL
- JWT_SECRET or SESSION_SECRET
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- Optional media-generation provider credentials

Do not assume that Gemini automatically generates images, playable audio, or video. Integrate appropriate media-generation providers through modular adapters.

The application must still support its core text-based investigation flow if optional media services are unavailable.

## 27.4 Definition of Done

Do not declare the project complete merely because the code has been generated.

Before declaring completion:

1. Verify that dependencies install successfully.
2. Verify that the frontend starts.
3. Verify that the backend starts.
4. Verify MongoDB connectivity.
5. Verify Gemini integration with a real test request when credentials are available.
6. Test the complete investigation lifecycle.
7. Test case persistence and resumption.
8. Test evidence board interactions.
9. Test accusation and XP calculation.
10. Run available automated tests.
11. Fix all critical errors.
12. Document any remaining limitations honestly.

Provide a final implementation report listing:
- Features completed.
- Features tested.
- Tests passed.
- External services configured.
- Remaining limitations.
- Commands to run the application.

---

# 28. FINAL PRODUCT EXPECTATION

AI Mystery Space must feel like a complete, immersive, AI-powered detective game.

The final product should combine:
- The storytelling of a crime thriller.
- The atmosphere of a mystery escape room.
- The investigation tools of a detective.
- The intelligence of an AI game master.
- The visual polish of a premium modern web application.

The most important objective is not the number of features. It is the quality, consistency, functionality, and integration of those features.

Every investigation should feel like a new story.

Every suspect should feel like a real character.

Every clue should have a purpose.

Every player should feel like a detective.

**AI MYSTERY SPACE — THE TRUTH IS HIDDEN. THE EVIDENCE IS YOURS TO DISCOVER.**