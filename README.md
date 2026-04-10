# 📊 Income Assessment System

A full-stack web application for loan income assessment of small businesses in the informal sector. Built to digitise the manual Excel-based workflow used by credit/loan officers when assessing borrowers from the informal sector.

---

## 🌐 Live Demo

| | Link |
|--|------|
| **🖥️ Live App** | https://income-assessment-app.vercel.app |
| **📦 Backend API** | https://income-assessment-backend.onrender.com/api |
| **💻 GitHub Repo** | https://github.com/Badhri25/income-assessment-app |
| **🎥 Loom Walkthrough** | https://www.loom.com/share/2a01f601e81a473d951740d8405ee032 |

> ⚠️ **Note:** Backend is hosted on Render free tier. First load may take 30–50 seconds to wake up after inactivity. Please wait and refresh if the app appears slow on first visit.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Styling | Custom CSS (no UI library) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📋 Supported Business Types

| Business | Turnover Method | Gross Margin |
|----------|----------------|--------------|
| Grocery / Kirana / Provision Shop | Item-wise (qty × price × 25 days) | 25% |
| Dairy Business | Session-wise (Morning/Evening, Society + Individual) | 70% |
| Tea Shop / Snack Bar | Litres × Cups/Litre × Rate × 30 days | 50% |
| Hotel / Restaurant / Eatery | Item-wise (qty × price × 25 days) | 50% |
| Tailoring Business | Order-note (qty/month × rate/piece) | 85% |

---

## 🎯 Features

- ✅ Case management — create, list, search, filter, edit, delete
- ✅ Business-type-specific turnover entry UI (4 different modes)
- ✅ Pre-populated default items & expense values from Excel templates
- ✅ Auto-calculated turnover, gross profit, net income
- ✅ Loan eligibility with IIR calculation (PMT formula — mirrors Excel)
- ✅ IIR warning in red when > 50%
- ✅ Officer can override recommended loan amount
- ✅ Printable single-page summary report
- ✅ All figures in Indian Rupee format (Rs. 1,00,000)
- ✅ Mark cases as Draft / Completed

---

## 🏗️ Project Structure

```
income-assessment/
├── backend/
│   ├── models/
│   │   └── Case.js              # MongoDB schema (all 5 business types)
│   ├── routes/
│   │   └── cases.js             # CRUD API routes
│   ├── server.js                # Express server entry point
│   ├── .env.sample              # Environment variable template
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── turnover/
│   │   │   │   └── TurnoverModule.js    # All 4 turnover types
│   │   │   ├── pnl/
│   │   │   │   └── PnLModule.js         # Expenses + Net Income
│   │   │   └── eligibility/
│   │   │       └── EligibilityModule.js  # Loan calc + IIR
│   │   ├── pages/
│   │   │   ├── CaseList.js       # Dashboard with search/filter
│   │   │   ├── CaseForm.js       # Create / Edit case
│   │   │   ├── CaseDetail.js     # Tabbed case workspace
│   │   │   └── SummaryReport.js  # Printable report
│   │   ├── utils/
│   │   │   ├── api.js            # Axios API calls
│   │   │   └── businessConfig.js # Margins, defaults, formulas
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── package.json                  # Root scripts (concurrently)
```

---

## ⚙️ Setup & Run Locally

### Prerequisites
- Node.js v16+
- MongoDB installed locally OR a MongoDB Atlas URI
- npm

---

### Step 1 — Clone the Repository
```bash
git clone https://github.com/Badhri25/income-assessment-app.git
cd income-assessment-app
```

---

### Step 2 — Configure Environment Variables

Create a `.env` file inside the `backend/` folder:
```env
MONGODB_URI=mongodb://localhost:27017/income_assessment
PORT=5000
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/income_assessment
PORT=5000
```

---

### Step 3 — Install Dependencies

```bash
# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

---

### Step 4 — Run the Application

**Option A — Run both together (recommended):**
```bash
npm install
npm run dev
```

**Option B — Run separately:**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start
```

---

### Step 5 — Open in Browser

```
Frontend:    http://localhost:3000
Backend API: http://localhost:5000/api
Health Check: http://localhost:5000/api/health
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/cases` | List all cases (supports `?search=`, `?businessType=`, `?status=`) |
| GET | `/api/cases/:id` | Get single case |
| POST | `/api/cases` | Create new case |
| PUT | `/api/cases/:id` | Update case (turnover, pnl, eligibility) |
| DELETE | `/api/cases/:id` | Delete case |

---

## 💡 How the Assessment Works

```
1. Loan officer creates a case (customer + business details)

2. Turnover Assessment
   → Enter items / sessions / garments with quantities and prices
   → System calculates Monthly Turnover automatically
   → Apply Gross Margin % → Gross Profit

3. P&L Sheet
   → Enter monthly expenses (rent, salary, electricity etc.)
   → Net Monthly Income = Gross Profit − Total Expenses

4. Loan Eligibility
   → Enter ROI % and Tenure (years)
   → EMI per Lakh = PMT(ROI/12, tenure×12, 100000)
   → Loan Eligibility = Net Income / EMI per Lakh × 100000
   → IIR = (EMI + Existing EMIs) / Net Income × 100
   → ⚠️ Red warning if IIR > 50%

5. Print single-page summary report
```

---

## 🧮 Key Formulas Implemented

```javascript
// EMI per lakh — mirrors Excel PMT function exactly
EMI_per_lakh = (P × r × (1+r)^n) / ((1+r)^n - 1)
// where P = 100000, r = ROI/12/100, n = tenure × 12

// Loan Eligibility
Loan_Eligibility = Net_Income / EMI_per_lakh × 100000

// IIR — Income to Instalment Ratio
IIR = (Proposed_EMI + Existing_EMIs) / Net_Income × 100
// Highlighted RED with warning if IIR > 50%
```

---

## 🌍 Deployment

### Frontend — Vercel
- Root directory: `frontend`
- Build command: `npm run build`
- Environment variable: `REACT_APP_API_URL=https://income-assessment-backend.onrender.com/api`

### Backend — Render
- Root directory: `backend`
- Build command: `npm install`
- Start command: `node server.js`
- Environment variable: `MONGODB_URI=your_mongodb_atlas_uri`

### Database — MongoDB Atlas
- Free M0 cluster
- Network access: `0.0.0.0/0` (allow all IPs for Render compatibility)

---

## 🤖 AI Tools Used

This project was built with assistance from **Claude by Anthropic**. Claude was used to analyse the five Excel income calculation templates provided in the assignment and extract all business-specific formulas, gross margin percentages, default expense values, and turnover calculation structures for each business type. Claude then generated the complete codebase — including the MongoDB schema, Express REST API, React components, routing, and CSS styling — based on the domain logic extracted from those Excel files. The PMT formula replication, IIR calculation, and per-business-type UI rendering logic were all derived through Claude's analysis of the original templates. All generated code was reviewed, tested, and understood before submission.

---

## .env Sample

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/income_assessment
PORT=5000
```
