# Lexora — AI Legal Document Analyzer

> **Understand Before You Sign**

## 🚀 Quick Start

### 1. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy and fill in your credentials
copy .env.example .env
# Open .env and fill in: MONGO_URI, JWT_SECRET, CLOUDINARY_*, GEMINI_API_KEY

# Start development server
npm run dev
# Backend runs at http://localhost:5000
```

### 2. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend runs at http://localhost:3000
```

---

## 🔑 Environment Variables (Backend)

Open `backend/.env` and fill in:

| Variable | Where to get it |
|---|---|
| `MONGO_URI` | [MongoDB Atlas](https://cloud.mongodb.com) → Create free cluster → Connect |
| `JWT_SECRET` | Any long random string (e.g., `openssl rand -hex 32`) |
| `CLOUDINARY_CLOUD_NAME` | [Cloudinary Console](https://cloudinary.com/console) → Dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary Console → Dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary Console → Dashboard |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com) → Get API key |

---

## 📁 Project Structure

```
Lexora/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/          # DB + Cloudinary config
│   │   ├── controllers/     # Auth + Contract controllers
│   │   ├── middleware/      # JWT auth + file upload + error handler
│   │   ├── models/          # User + Contract Mongoose models
│   │   ├── routes/          # Auth + Contract routes
│   │   ├── services/        # Gemini AI analysis service
│   │   ├── utils/           # JWT token generator
│   │   └── index.js         # Express entry point
│   ├── .env                 # ← Fill this in!
│   └── package.json
│
└── frontend/                # Next.js 14 + Tailwind CSS
    ├── app/
    │   ├── page.tsx          # Landing page
    │   ├── auth/
    │   │   ├── login/        # Login page
    │   │   └── register/     # Register page
    │   ├── dashboard/        # User dashboard
    │   ├── analyze/          # Contract upload page
    │   └── results/[id]/     # Split-screen audit viewer
    ├── components/
    │   └── Navbar.tsx
    ├── context/
    │   └── AuthContext.tsx
    ├── lib/
    │   └── api.ts            # Axios API client
    └── .env.local            # Frontend env (already configured)
```

---

## 🤖 API Endpoints

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

### Contracts
| Method | Route | Description |
|---|---|---|
| POST | `/api/contracts/upload` | Upload + analyze contract |
| GET | `/api/contracts` | List all user contracts |
| GET | `/api/contracts/:id` | Get contract with full analysis |
| DELETE | `/api/contracts/:id` | Delete contract |
| POST | `/api/contracts/:id/reanalyze` | Re-run AI analysis |

---

## 🧠 AI Models Used (in priority order)
1. `gemini-2.5-flash` (fastest, most capable)
2. `gemini-2.0-flash` (fallback)
3. `gemini-1.5-flash` (final fallback)

---

## ✨ Features

- 📄 Upload PDF or image contracts (max 10MB)
- 🌍 Bilingual summary: **English + Roman Urdu**
- 🚨 Risk Radar with **High / Medium / Low** severity
- 📋 Key clause breakdown in plain language
- 💡 3–5 smart negotiation tips
- 🔄 Real-time polling while AI analyzes
- 📊 Dashboard with contract history
- 🔒 Secure JWT auth with HTTP-only cookies
- ☁️ Cloudinary file storage (CDN-backed)

---

*© 2026 Lexora. For informational purposes only. Not legal advice.*
