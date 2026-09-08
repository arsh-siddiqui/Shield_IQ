# DetectIQ Backend API

Express + MongoDB backend for DetectIQ.

## Architecture

- `routes/`: Express routers organized by feature (Auth, Scan, Investigations, Progress, etc.).
- `controllers/`: Business logic handling requests and returning API responses.
- `models/`: Mongoose schemas (`User`, `ScanHistory`, `Vulnerability`, `LearningProgress`, `AssessmentAttempt`, `Investigation`, `Indicator`, etc.).
- `middleware/`: Auth validation (`protect`), error handlers, etc.
- `services/`: Specialized service classes (e.g., threat intelligence wrappers, scan engines).
- `scripts/`: Database seeding scripts.

## Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env to set MONGO_URI, JWT_SECRET, CLIENT_URL, etc.
npm run seed
npm run dev
```

## Environment variables

See `.env.example`. 

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB Atlas (or local) connection string |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `CLIENT_URL` | Frontend origin (e.g., `http://localhost:5173`) |
| `NODE_ENV` | `development` or `production` |

## Authentication

Authentication is handled via JWT tokens stored in **HTTP-only cookies**. 
- `protect` middleware ensures routes are secured and contextually aware of the `req.user`.

## Core Domains

1. **Threat Detection (`/api/scan`)**: Multi-layered analysis of emails, URLs, text, QR codes, and screenshots.
2. **Investigations (`/api/investigations`)**: Detailed forensic breakdowns of uploaded email artifacts, extracting IOCs and generating timelines.
3. **Indicators (`/api/indicators`)**: Centralized repository of extracted threat intelligence (IPs, domains) mapped to external intel like VirusTotal.
4. **Vulnerability Learning (`/api/vulnerabilities` & `/api/progress`)**: Educational knowledge base and assessment engine to evaluate user security mastery. Updates the user's `Security Profile`.
