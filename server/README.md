# ShieldIQ API

Express + MongoDB backend for ShieldIQ. Clean layered architecture:
`routes → middleware → controllers → models`, with shared logic in
`services/` and `utils/`.

## Setup

```bash
cd server
npm install
cp .env.example .env
# edit .env — at minimum set MONGO_URI to a real MongoDB Atlas connection string
npm run seed   # creates an admin account + demo content
npm run dev    # or `npm start` for production
```

The server **boots even without a reachable database** — `GET /api/health`
always answers, and any route that touches MongoDB returns a clear `503`
instead of hanging, so you can bring the API up before Atlas is configured
without it crashing.

## Environment variables

See `.env.example`. The important ones:

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB Atlas (or local) connection string |
| `JWT_SECRET` | Signs auth tokens — set a real random value in production |
| `CLIENT_URL` | Must match the frontend's origin (CORS + cookie settings) |
| `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` | Used only by `npm run seed` |

## Architecture

```
server/
  config/       env.js (central env access), db.js (Mongoose connection)
  models/       User, ScanHistory, Article, Simulation, SimulationResult,
                Quiz, QuizResult, AdminLog
  controllers/  business logic per resource
  routes/       thin route → validator → middleware → controller wiring
  middleware/   auth (JWT), requireDb (503 guard), validate (express-validator
                result handler), errorHandler (404 + global error handler)
  validators/   express-validator chains per resource
  services/     scanService.js — the mock analysis engine (see below)
  utils/        jwt.js, apiResponse.js, seed.js
```

## Auth model

JWTs are stored in an **httpOnly cookie**, not localStorage, so they aren't
reachable from JS running on the page. `role` (`user` | `admin`) gates admin
routes; `accountRole` (`Student` | `Professional` | `Business`) is the
user-facing "I am a..." selection from the frontend and has no bearing on
permissions.

## Scan analysis is intentionally mocked

Per the project brief, this phase does **not** wire up a real detection
model — `services/scanService.js` runs the same keyword-heuristic mock
analyzer as the frontend's `src/utils/scanEngine.js`, so the demo behaves
consistently whether it's hitting the API or (per the frontend's fallback
logic) running the identical logic locally. Swap `analyzeContent()` for a
real model call later; every caller only depends on the shape of the object
it returns.

## API reference

All responses share the shape `{ success, message, data, meta? }`.

### Auth — `/api/auth`
| Method | Path | Access | Notes |
|---|---|---|---|
| POST | `/register` | Public | `{ name, email, password, accountRole? }` |
| POST | `/login` | Public | `{ email, password }` |
| POST | `/logout` | Public | Clears the auth cookie |
| GET | `/me` | Private | Current user |

### Users — `/api/users`
| Method | Path | Access |
|---|---|---|
| GET | `/profile` | Private |
| PUT | `/profile` | Private |
| GET | `/dashboard` | Private — aggregated dashboard payload |
| GET | `/scans` | Private — paginated scan history |
| GET | `/progress` | Private — XP, level, simulations, quizzes, bookmarks |
| POST | `/articles/:id/bookmark` | Private — toggle |
| POST | `/articles/:id/like` | Private — toggle |
| POST | `/articles/:id/read` | Private — mark read |

### Articles — `/api/articles`
| Method | Path | Access |
|---|---|---|
| GET | `/` | Public (drafts hidden unless admin) — `?page&limit&category&difficulty&search` |
| GET | `/:id` | Public |
| POST | `/` | Admin |
| PUT | `/:id` | Admin |
| DELETE | `/:id` | Admin |

### Simulations — `/api/simulations`
| Method | Path | Access |
|---|---|---|
| GET | `/` | Public |
| GET | `/:id` | Public |
| POST | `/` | Admin |
| PUT | `/:id` | Admin |
| DELETE | `/:id` | Admin |
| POST | `/:id/submit` | Private — `{ choice: "open"\|"ignore"\|"report" }`, awards XP |

### Quizzes — `/api/quizzes`
| Method | Path | Access |
|---|---|---|
| GET | `/` | Public — `?article&category&difficulty` |
| GET | `/:id` | Public |
| POST | `/` | Admin |
| PUT | `/:id` | Admin |
| DELETE | `/:id` | Admin |
| POST | `/:id/submit` | Private — `{ optionId }`, awards XP |

### Scan — `/api/scan`
| Method | Path | Access |
|---|---|---|
| POST | `/` | Public, personalizes if logged in — `{ scanType, content }` |

### Admin — `/api/admin`
| Method | Path | Access |
|---|---|---|
| GET | `/stats` | Admin |
| GET | `/analytics` | Admin — 6-month growth + risk distribution |
| GET | `/users` | Admin — `?page&limit&search` |
| PUT | `/users/:id` | Admin |
| DELETE | `/users/:id` | Admin |

## What's verified vs. what needs a real database

This sandbox has no MongoDB available (no local `mongod`, no network route
to Atlas), so the following were verified without a live database:

- Every file passes `node --check` (no syntax errors).
- The server actually boots and stays up with **no** database connected —
  `/api/health` reports `dbConnected: false`, `POST /api/scan` works fully
  for anonymous users, and DB-backed routes correctly return `503` instead
  of hanging.
- `express-validator` chains and the 404/error handlers were exercised
  directly against the running server.
- JWT signing/verification and bcrypt hashing were round-tripped in
  isolation.
- Every Mongoose schema's validation rules were checked with
  `validateSync()` (catches bad emails, short passwords, missing required
  fields, quizzes with fewer than 2 options, etc.) without needing a
  connection.

**Not yet verified against a real database:** the actual persistence layer
— registering a user and reading it back, saving scan history, the
aggregation pipelines in `getAnalytics`. Point `MONGO_URI` at a real
MongoDB Atlas cluster and run `npm run seed`, then exercise the endpoints
above, before treating this as production-verified.
