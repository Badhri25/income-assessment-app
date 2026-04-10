const mongoose = require('mongoose');

const TurnoverItemSchema = new mongoose.Schema({
  itemName: String,
  qtyPerDay: Number,
  price: Number,
  perDaySales: Number,
  perMonthSales: Number,
}, { _id: false });

const SessionRowSchema = new mongoose.Schema({
  session: String,
  qtyLtrs: Number,
  societyQty: Number,
  societyRate: Number,
  individualQty: Number,
  individualRate: Number,
}, { _id: false });

const TeaRowSchema = new mongoose.Schema({
  product: String,
  litresOfMilk: Number,
  teaPerLitre: Number,
  rate: Number,
}, { _id: false });

const TailoringItemSchema = new mongoose.Schema({
  clothType: String,
  qtyPerMonth: Number,
  ratePerPiece: Number,
}, { _id: false });

const TurnoverSchema = new mongoose.Schema({
  grossMargin: { type: Number, default: 0 },
  // Grocery / Hotel — item-wise
  items: [TurnoverItemSchema],
  // Dairy — session-wise
  sessions: [SessionRowSchema],
  // Tea shop
  teaRows: [TeaRowSchema],
  // Tailoring — order-note
  tailoringItems: [TailoringItemSchema],
  totalMonthlyTurnover: { type: Number, default: 0 },
  grossProfit: { type: Number, default: 0 },
}, { _id: false });

const ExpenseSchema = new mongoose.Schema({
  shopRent: { type: Number, default: 0 },
  electricity: { type: Number, default: 0 },
  laborSalary: { type: Number, default: 0 },
  officeExpenses: { type: Number, default: 0 },
  transportation: { type: Number, default: 0 },
  ratesAndTaxes: { type: Number, default: 0 },
  loadingUnloading: { type: Number, default: 0 },
  telephoneExpenses: { type: Number, default: 0 },
  repairMaintenance: { type: Number, default: 0 },
  stationaryExp: { type: Number, default: 0 },
  donationsPooja: { type: Number, default: 0 },
  miscExpenses: { type: Number, default: 0 },
  businessPromotion: { type: Number, default: 0 },
  interestExternalBorrowings: { type: Number, default: 0 },
  chitsPayment: { type: Number, default: 0 },
  bankCharges: { type: Number, default: 0 },
  goldLoanInterest: { type: Number, default: 0 },
  autoLoanEmi: { type: Number, default: 0 },
  tds: { type: Number, default: 0 },
  totalExpenses: { type: Number, default: 0 },
  netMonthlyIncome: { type: Number, default: 0 },
}, { _id: false });

const ExistingLoanSchema = new mongoose.Schema({
  bankName: String,
  loanAmount: { type: Number, default: 0 },
  emi: { type: Number, default: 0 },
}, { _id: false });

const EligibilitySchema = new mongoose.Schema({
  roi: { type: Number, default: 16.5 },
  tenureYears: { type: Number, default: 10 },
  existingLoans: [ExistingLoanSchema],
  totalExistingEmi: { type: Number, default: 0 },
  emiPerLakh: { type: Number, default: 0 },
  loanEligibility: { type: Number, default: 0 },
  recommendedLoanAmount: { type: Number, default: 0 },
  finalEmi: { type: Number, default: 0 },
  iir: { type: Number, default: 0 },
  iirWarning: { type: Boolean, default: false },
}, { _id: false });

const CaseSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  businessName: { type: String, required: true },
  businessType: {
    type: String,
    required: true,
    enum: ['GROCERY', 'DAIRY', 'TEA_SHOP', 'HOTEL', 'TAILORING'],
  },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['DRAFT', 'COMPLETED'], default: 'DRAFT' },
  turnover: { type: TurnoverSchema, default: () => ({}) },
  pnl: { type: ExpenseSchema, default: () => ({}) },
  eligibility: { type: EligibilitySchema, default: () => ({}) },
}, { timestamps: true });

module.exports = mongoose.model('Case', CaseSchema);
