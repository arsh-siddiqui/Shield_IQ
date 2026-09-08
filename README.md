# DetectIQ — Multi-Layer Cyber Fraud Awareness & Phishing Protection

**Learn Smart. Detect Fast. Stay Safe.**

DetectIQ is an advanced cybersecurity platform that combines a multi-layer threat detection engine (Heuristics + Trained ML + PhishDestroy Threat Intelligence + Groq LLM) with personalized RAG retrieval and Paper 4-inspired vulnerability-focused learning with controlled practice preview.

---

## 🌟 Key Features

### 🛡️ Paper 1: Personalized RAG-Based Phishing Detection Architecture Implemented
DetectIQ evaluates URLs, emails, SMS texts, WhatsApp messages, and QR codes using a calibrated detection pipeline:

1. **Layer 1 — Deterministic Heuristic Engine**: High-speed keyword, domain, urgency, and pattern analysis. Provides baseline security with zero external dependencies.
2. **Layer 2 — Scikit-Learn ML Model**: Trained on 18,650 real-world phishing and legitimate email samples using TF-IDF vectorization and Logistic Regression.
3. **Layer 3 — PhishDestroy Threat Intelligence**: Domain reputation checks (Note: Currently integrated but API service returns 502/down, so system safely bypasses it via mock-like fallback).
4. **Layer 4 — Personalized RAG Retrieval**: Fetches Top-K legitimate historical emails using semantic FAISS similarity.
5. **Layer 5 — Groq LLM Contextual Analysis**: Evaluates spear-phishing deviations against personalized email history context.
6. **Evidence Fusion Layer**: Synthesizes all detection signals deterministically into a unified risk level.

### 📚 Paper 4: Vulnerability-Focused Learning and Assessment Architecture Implemented
- **Vulnerability Curriculum**: Structured knowledge base focusing on theory, identification, impact, and prevention strategies.
- **Adaptive Assessments**: Server-side evaluations to validate understanding, track learner weaknesses safely, and isolate progress.
- **Security Profile Tracking**: Real-time mastery mapping that ties learning outcomes directly to the user's overarching security posture.

### 🔐 User Isolation & Security
- **Clean Slate for New Users**: Authenticated user accounts start securely with isolated data.
- **Strict JWT Isolation**: FAISS retrieval and MongoDB learning progress are robustly user-isolated.

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18+ and npm
- **Python**: v3.9+ (for ML inference microservice)
- **MongoDB Atlas** or local MongoDB instance

---

### 1. Frontend Setup
```bash
npm install
npm run dev
```

### 2. Backend API Setup
```bash
cd server
npm install
cp .env.example .env
npm run seed
npm run dev
```

### 3. ML/RAG Microservice Setup
```bash
cd ml
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn api.main:app --port 8543
```

---

## 📄 License
MIT License. Built for cybersecurity awareness and fraud protection.
