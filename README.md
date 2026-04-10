# 📊 Income Assessment System

A full-stack web application for loan income assessment of small businesses in the informal sector. Built to digitise the manual Excel-based workflow used by credit/loan officers.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Styling | Custom CSS (no UI library) |

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

## 🏗️ Project Structure

```
income-assessment/
├── backend/
│   ├── models/
│   │   └── Case.js          # MongoDB schema
│   ├── routes/
│   │   └── cases.js         # CRUD API routes
│   ├── server.js            # Express server
│   ├── .env                 # Environment variables
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── turnover/
│   │   │   │   └── TurnoverModule.js   # All 4 turnover types
│   │   │   ├── pnl/
│   │   │   │   └── PnLModule.js        # Expenses + Net Income
│   │   │   └── eligibility/
│   │   │       └── EligibilityModule.js # Loan calc + IIR
│   │   ├── pages/
│   │   │   ├── CaseList.js     # Dashboard with search/filter
│   │   │   ├── CaseForm.js     # Create/Edit case
│   │   │   ├── CaseDetail.js   # Tabbed case workspace
│   │   │   └── SummaryReport.js # Printable report
│   │   ├── utils/
│   │   │   ├── api.js           # Axios API calls
│   │   │   └── businessConfig.js # Margins, defaults, formulas
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── package.json             # Root with concurrently scripts
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v16+
- MongoDB (local) or MongoDB Atlas URI
- npm

### Step 1 — Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/income-assessment.git
cd income-assessment
```

### Step 2 — Configure Environment Variables

In `backend/.env` (already created):
```env
MONGODB_URI=mongodb://localhost:27017/income_assessment
PORT=5000
```

For MongoDB Atlas, replace the URI:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/income_assessment
```

### Step 3 — Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Step 4 — Run the Application

**Option A: Run both together (recommended)**
```bash
npm run dev
```

**Option B: Run separately**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start
```

### Step 5 — Open in Browser

```
Frontend: http://localhost:3000
Backend API: http://localhost:5000/api
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cases` | List all cases (supports `?search=`, `?businessType=`, `?status=`) |
| GET | `/api/cases/:id` | Get single case |
| POST | `/api/cases` | Create new case |
| PUT | `/api/cases/:id` | Update case (turnover, pnl, eligibility) |
| DELETE | `/api/cases/:id` | Delete case |
| GET | `/api/health` | Health check |

---

## 💡 How the Assessment Works

```
1. Loan officer creates a case (customer + business details)
2. Turnover Assessment
   → Enter items/sessions/garments with quantities and prices
   → System calculates Monthly Turnover
   → Apply Gross Margin % → Gross Profit
3. P&L Sheet
   → Enter monthly expenses (rent, salary, electricity etc.)
   → Net Monthly Income = Gross Profit − Total Expenses
4. Loan Eligibility
   → Enter ROI % and Tenure
   → EMI per Lakh = PMT(ROI/12, tenure×12, 100000)
   → Loan Eligibility = Net Income / EMI per Lakh × 100000
   → IIR = (EMI + Existing EMIs) / Net Income × 100
   → ⚠️ Warning if IIR > 50%
5. Print summary report
```

---

## 🧮 Key Formulas Implemented

```javascript
// EMI per lakh (mirrors Excel PMT function)
EMI_per_lakh = (P × r × (1+r)^n) / ((1+r)^n - 1)
where P = 100000, r = ROI/12/100, n = tenure × 12

// Loan Eligibility
Loan_Eligibility = Net_Income / EMI_per_lakh × 100000

// IIR (Income to Instalment Ratio)
IIR = (Proposed_EMI + Existing_EMIs) / Net_Income × 100
// Flag in RED if IIR > 50%
```

---

## 🤖 AI Tools Used

This project was built with assistance from **Claude (Anthropic)** as follows:

- **Excel Analysis**: Claude analyzed all 5 uploaded Excel income calculation sheets to extract business-specific formulas, gross margins, default expense values, and turnover calculation methods for each business type.
- **Code Generation**: The full backend (Node/Express/Mongoose) and frontend (React components, routing, CSS) were generated based on the Excel analysis and assignment requirements.
- **Business Logic**: The PMT formula replication, IIR calculation logic, and per-business-type turnover structures were derived from Claude's analysis of the original Excel templates.

All code was reviewed and understood before submission. The core business logic (gross margins, expense defaults, turnover formulas) directly mirrors the original Excel files provided.

---

## 🎯 Features

- ✅ Case management (create, list, search, filter, edit, delete)
- ✅ Business-type-specific turnover entry UI (4 different modes)
- ✅ Pre-populated default items & expense values from Excel templates
- ✅ Auto-calculated turnover, gross profit, net income
- ✅ Loan eligibility with IIR calculation
- ✅ IIR warning in red when > 50%
- ✅ Officer can override recommended loan amount
- ✅ Printable single-page summary report
- ✅ All figures in Indian Rupee format (Rs. 1,00,000)
- ✅ Mark cases as Draft / Completed

---

## 🌐 Deployment (Optional Bonus)

### Deploy Backend on Render
1. Push code to GitHub
2. Create a new Web Service on [render.com](https://render.com)
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variable: `MONGODB_URI=your_atlas_uri`

### Deploy Frontend on Vercel
1. Create project on [vercel.com](https://vercel.com)
2. Set root directory to `frontend`
3. Add environment variable: `REACT_APP_API_URL=https://your-render-backend.onrender.com`
4. Update `frontend/src/utils/api.js` baseURL to use `process.env.REACT_APP_API_URL`

---

## 📸 Screenshots

> Run locally and record Loom video showing:
> 1. Creating a Grocery case → filling turnover → P&L → eligibility → report
> 2. Creating a Dairy or Tailoring case showing different UI modes
