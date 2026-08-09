# ShieldIQ

AI-powered Cyber Fraud Awareness & Phishing Detection platform.
**Learn Smart. Detect Fast. Stay Safe.**

Full-stack project: a React/Vite frontend (fully interactive on its own,
dummy-data-driven) plus an Express/MongoDB backend that the frontend now
talks to for auth and scanning — with automatic fallback to local demo
logic whenever the backend isn't reachable.

```
shieldiq/
  src/            React frontend (see src-level README notes below)
  server/         Express + MongoDB API — see server/README.md
```

## Quick start

**Frontend:**
```bash
npm install
npm run dev          # http://localhost:5173
```

**Backend** (optional — the frontend works without it):
```bash
cd server
npm install
cp .env.example .env # then set MONGO_URI to a real MongoDB Atlas cluster
npm run seed          # creates an admin account + demo content
npm run dev            # http://localhost:5000
```

Run both together for the full experience, or just the frontend for a
pure-demo build — nothing breaks either way.

## How the integration works

The frontend never assumes the backend is available. Every backend call
goes through `src/services/`, and `AppDataContext` wraps each one so it:

1. Tries the real API first.
2. If the backend answers with a real error (bad password, validation
   failure), shows that error to the person.
3. If the backend can't be reached at all (not running, wrong URL, CORS
   issue), silently falls back to the exact same local dummy-data logic
   the frontend shipped with before the backend existed.

Concretely, today that covers:

- **Login / Register** — try `POST /api/auth/login` / `/register` (JWT in
  an httpOnly cookie); falls back to the local "demo login" flow if the
  API is unreachable.
- **AI Scanner** — tries `POST /api/scan`; falls back to the identical
  heuristic in `src/utils/scanEngine.js` if the API is unreachable. Either
  way the result shape — and the UI — is exactly the same.
- **Session restore** — on load, silently checks for an existing backend
  session so a real login persists across a refresh.

Articles, the Scam Simulator, Quizzes, and the Admin Dashboard's CRUD
still run on local React state / dummy data (as they did before this
backend phase) — the corresponding REST APIs exist and are fully built in
`server/`, but wiring every remaining page's read/write path to them was
out of scope for this pass. See `server/README.md` for the full endpoint
list if you want to continue that wiring.

## What wasn't verified

This sandbox has no MongoDB available (no local `mongod`, no network path
to Atlas), so the backend's database-dependent behavior — actually
registering a user and reading it back, persisted scan history, the admin
analytics aggregations — could not be exercised end-to-end here. Everything
that doesn't require a live database was verified directly (server boots
cleanly, health check, anonymous scan endpoint, CORS/cookie config against
the real Vite origin, JWT/bcrypt round-trips, Mongoose schema validation).
Point `MONGO_URI` at a real cluster and re-test the auth + persistence
flows before treating this as production-verified.
