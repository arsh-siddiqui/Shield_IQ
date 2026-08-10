# ShieldIQ — Multi-Layer Cyber Fraud Awareness & Phishing Protection

**Learn Smart. Detect Fast. Stay Safe.**

ShieldIQ is an advanced cybersecurity platform that combines a multi-layer threat detection engine (Heuristics + Trained ML + PhishDestroy Threat Intelligence + Groq LLM) with an interactive, card-based educational hub (25 interactive lessons, scam decoder, and simulator).

---

## 🌟 Key Features

### 🛡️ Multi-Layer Threat Detection Architecture
ShieldIQ evaluates URLs, emails, SMS texts, WhatsApp messages, and QR codes using a calibrated 4-layer detection pipeline:

1. **Layer 1 — Deterministic Heuristic Engine**: High-speed keyword, domain, urgency, and pattern analysis. Provides baseline security with zero external dependencies.
2. **Layer 2 — Scikit-Learn ML Model**: Trained on 18,650 real-world phishing and legitimate email samples using TF-IDF vectorization and Logistic Regression.
   - **Accuracy**: `98.8%`
   - **F1 Score**: `98.4%`
   - **Precision**: `97.8%`
   - **Recall**: `99.0%`
3. **Layer 3 — PhishDestroy Threat Intelligence**: Live domain reputation checks via the official PhishDestroy Threat API.
4. **Layer 4 — Groq LLM Contextual Analysis**: AI-assisted natural language contextual analysis for deep threat explanation.
5. **Evidence Fusion Layer**: Safe combiner that synthesizes all detection signals into a unified risk level, confidence score, and actionable security recommendations.

### 📚 Interactive Educational Hub
- **25 Interactive Micro-Lessons**: Organized into 6 modules (Phishing, UPI & Payment Scams, Social Engineering, Safe Browsing, Online Account Security, Modern Scams).
  - Every lesson features: *Quick Intro → 4–5 Understand Cards → Interactive "See It" Red Flag Reveal → "Try It" Activity → Real-World Scenario → Knowledge Check → Takeaway Checklist*.
- **Quick Learns & Safety Tips**: Instant bite-sized security tips and domain verification checks.
- **Scam Decoder**: Breakdown of suspicious messages line by line with color-coded red flag tags.
- **Scam Simulator**: Interactive sandbox to practice spotting phishing emails and scam calls safely.

### 🔐 User Isolation & Security
- **Clean Slate for New Users**: Authenticated user accounts start with 0 scans, 0 XP, and 0 fake activity metrics.
- **JWT & HTTP-Only Cookies**: Secure authentication backed by Bcrypt password hashing.
- **Protected Routes**: `/dashboard`, `/profile`, and `/admin` routes require authentication and redirect cleanly on logout.
- **Admin Control Panel**: Real-time management of learning articles, scam templates, and users.

---

## 📁 Repository Structure

```text
shieldiq/
├── src/                    # React + Vite Frontend (UI, AppDataContext, Components, Pages)
├── server/                 # Node.js + Express + MongoDB Backend API
│   ├── config/             # Environment & DB configuration
│   ├── controllers/        # Auth, Scan, User, and Learn controllers
│   ├── middleware/         # Auth verification & error handling
│   ├── models/             # Mongoose Schemas (User, Lesson, ScanHistory, ThreatIntelCache, etc.)
│   ├── routes/             # REST API Routes (/api/auth, /api/scan, /api/learn, /api/users)
│   ├── services/           # Evidence Fusion, PhishDestroy, ML client, and Groq services
│   └── utils/              # Database Seed (seed.js) & Cleanup (cleanup.js) scripts
└── ml/                     # Python ML Inference Microservice
    ├── api/                # FastAPI app (main.py, predictor.py, schemas.py)
    ├── artifacts/          # Trained model artifacts & metadata
    ├── reports/            # Evaluation metrics (evaluation.json, classifier_tests.json)
    ├── download_dataset.py # Automated phishing dataset downloader
    ├── train.py            # Model training script (TF-IDF + Logistic Regression)
    └── evaluate.py         # Model evaluation & metrics reporter
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18+ and `npm`
- **Python**: v3.9+ (for ML inference microservice)
- **MongoDB Atlas** or local MongoDB instance

---

### 1. Frontend Setup
```bash
# In the root repository directory
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

---

### 2. Backend API Setup
```bash
cd server
npm install

# Configure environment variables
cp .env.example .env
# Edit .env to add your MONGO_URI and JWT_SECRET

# Seed educational content (25 lessons, articles, simulations, quizzes)
npm run seed

# Start Express server
npm run dev
# Backend runs at http://localhost:5000
```

---

### 3. ML Inference Microservice Setup (Optional but Recommended)
```bash
cd ml

# Set up virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download dataset & train model (if artifacts are not present)
python download_dataset.py
python train.py

# Start FastAPI ML server
python -m uvicorn ml.api.main:app --port 8001
# ML service runs at http://localhost:8001
```

---

## 🧪 Testing & Verification

### Run Frontend Production Build
```bash
npm run build
```

### Run Backend Unit & Integration Tests
```bash
cd server
npm test
```

### Run ML Classifier Unit Tests
```bash
cd ml
python -m unittest discover -s tests
```

---

## 🛠️ Database Utility Scripts

- **Seed Database**: `npm run seed` (upserts educational content, admin user `admin@shieldiq.app`).
- **Cleanup Demo Data**: `npm run cleanup` (removes legacy test users while preserving real users and administrative content).

---

## 📄 License
MIT License. Built for cybersecurity awareness and fraud protection.
