// All business logic extracted from Excel files
// Gross margins, default items, default expenses per business type

export const BUSINESS_TYPES = {
  GROCERY: {
    label: 'Grocery / Kirana / Provision Shop',
    turnoverType: 'item-wise',
    grossMargin: 0.25,
    daysPerMonth: 25,
    defaultItems: [
      { itemName: 'Crystal Salt', qtyPerDay: 10, price: 20 },
      { itemName: 'Turmeric Powder', qtyPerDay: 2, price: 150 },
      { itemName: 'Chilli Powder', qtyPerDay: 1, price: 140 },
      { itemName: 'Sambar Masala', qtyPerDay: 1, price: 140 },
      { itemName: 'Dhaniya Powder', qtyPerDay: 1, price: 160 },
      { itemName: 'Pepper', qtyPerDay: 1, price: 300 },
      { itemName: 'Red Chilli', qtyPerDay: 2, price: 500 },
      { itemName: 'Sugar', qtyPerDay: 4, price: 55 },
      { itemName: 'Garlic', qtyPerDay: 1, price: 120 },
      { itemName: 'Coconut Oil', qtyPerDay: 1, price: 220 },
      { itemName: 'Sun Flower Oil', qtyPerDay: 5, price: 150 },
      { itemName: 'Ground Nut Oil', qtyPerDay: 2, price: 240 },
      { itemName: 'Bengal Gram', qtyPerDay: 1, price: 120 },
      { itemName: 'Appalam', qtyPerDay: 3, price: 40 },
      { itemName: 'Shampoo', qtyPerDay: 20, price: 1 },
      { itemName: 'Noodles', qtyPerDay: 5, price: 40 },
      { itemName: 'Maida', qtyPerDay: 3, price: 240 },
      { itemName: 'Rava', qtyPerDay: 3, price: 120 },
      { itemName: 'Semiya', qtyPerDay: 4, price: 25 },
      { itemName: 'Rice Flour', qtyPerDay: 5, price: 30 },
      { itemName: 'Washing Powder', qtyPerDay: 2, price: 60 },
      { itemName: 'Milk Biscuit', qtyPerDay: 20, price: 10 },
      { itemName: 'Marie Biscuit', qtyPerDay: 30, price: 10 },
      { itemName: 'Cream Biscuit', qtyPerDay: 10, price: 10 },
      { itemName: 'Rice Raw', qtyPerDay: 10, price: 40 },
      { itemName: 'Others', qtyPerDay: 50, price: 30 },
    ],
    defaultExpenses: {
      shopRent: 0, electricity: 0, laborSalary: 0, officeExpenses: 2500,
      transportation: 4000, ratesAndTaxes: 0, loadingUnloading: 0,
      telephoneExpenses: 2000, repairMaintenance: 1000, stationaryExp: 0,
      donationsPooja: 500, miscExpenses: 5000, businessPromotion: 0,
      interestExternalBorrowings: 0, chitsPayment: 0, bankCharges: 0,
      goldLoanInterest: 0, autoLoanEmi: 0, tds: 0,
    },
  },
  DAIRY: {
    label: 'Dairy Business',
    turnoverType: 'session-dairy',
    grossMargin: 0.70,
    daysPerMonth: 30,
    defaultSessions: [
      { session: 'Morning', qtyLtrs: 40, societyQty: 40, societyRate: 35, individualQty: 0, individualRate: 0 },
      { session: 'Evening', qtyLtrs: 30, societyQty: 30, societyRate: 35, individualQty: 0, individualRate: 0 },
    ],
    defaultExpenses: {
      shopRent: 0, electricity: 0, laborSalary: 0, officeExpenses: 0,
      transportation: 2000, ratesAndTaxes: 0, loadingUnloading: 0,
      telephoneExpenses: 500, repairMaintenance: 0, stationaryExp: 0,
      donationsPooja: 0, miscExpenses: 0, businessPromotion: 5000,
      interestExternalBorrowings: 0, chitsPayment: 0, bankCharges: 0,
      goldLoanInterest: 0, autoLoanEmi: 0, tds: 0,
    },
  },
  TEA_SHOP: {
    label: 'Tea Shop / Snack Bar',
    turnoverType: 'session-tea',
    grossMargin: 0.50,
    daysPerMonth: 30,
    defaultTeaRows: [
      { product: 'Tea & Coffee', litresOfMilk: 30, teaPerLitre: 15, rate: 12 },
      { product: 'Vadai, Bajji', litresOfMilk: 100, teaPerLitre: 1, rate: 12 },
    ],
    defaultExpenses: {
      shopRent: 5000, electricity: 2000, laborSalary: 30000, officeExpenses: 0,
      transportation: 2000, ratesAndTaxes: 0, loadingUnloading: 0,
      telephoneExpenses: 500, repairMaintenance: 0, stationaryExp: 0,
      donationsPooja: 1000, miscExpenses: 2000, businessPromotion: 3000,
      interestExternalBorrowings: 0, chitsPayment: 0, bankCharges: 0,
      goldLoanInterest: 0, autoLoanEmi: 0, tds: 0,
    },
  },
  HOTEL: {
    label: 'Hotel / Restaurant / Eatery',
    turnoverType: 'item-wise',
    grossMargin: 0.50,
    daysPerMonth: 25,
    defaultItems: [
      // Breakfast
      { itemName: 'Tea', qtyPerDay: 100, price: 10 },
      { itemName: 'Coffee', qtyPerDay: 20, price: 9 },
      { itemName: 'Vadai, Bonda & Snacks', qtyPerDay: 50, price: 5 },
      { itemName: 'Idly', qtyPerDay: 40, price: 3 },
      { itemName: 'Dosai', qtyPerDay: 20, price: 15 },
      { itemName: 'Poori', qtyPerDay: 30, price: 10 },
      { itemName: 'Half Boil & Omlette', qtyPerDay: 20, price: 20 },
      // Lunch
      { itemName: 'Meals', qtyPerDay: 40, price: 80 },
      { itemName: 'Meals (Parcel)', qtyPerDay: 20, price: 100 },
      { itemName: 'Mutton Briyani', qtyPerDay: 20, price: 100 },
      { itemName: 'Chicken Briyani', qtyPerDay: 30, price: 100 },
      { itemName: 'Chicken Gravy', qtyPerDay: 15, price: 80 },
      { itemName: 'Fish Fry', qtyPerDay: 10, price: 50 },
      // Dinner
      { itemName: 'Dosai (Dinner)', qtyPerDay: 30, price: 15 },
      { itemName: 'Parotta', qtyPerDay: 50, price: 10 },
      { itemName: 'Chappathi', qtyPerDay: 20, price: 10 },
      { itemName: 'Idly (Dinner)', qtyPerDay: 40, price: 3 },
    ],
    defaultExpenses: {
      shopRent: 20000, electricity: 10000, laborSalary: 80000, officeExpenses: 5000,
      transportation: 5000, ratesAndTaxes: 5000, loadingUnloading: 5000,
      telephoneExpenses: 1000, repairMaintenance: 5000, stationaryExp: 0,
      donationsPooja: 0, miscExpenses: 5000, businessPromotion: 0,
      interestExternalBorrowings: 0, chitsPayment: 0, bankCharges: 0,
      goldLoanInterest: 0, autoLoanEmi: 0, tds: 0,
    },
  },
  TAILORING: {
    label: 'Tailoring Business',
    turnoverType: 'order-note',
    grossMargin: 0.85,
    daysPerMonth: 30,
    defaultTailoringItems: [
      { clothType: 'Pant', qtyPerMonth: 40, ratePerPiece: 400 },
      { clothType: 'Half Pant', qtyPerMonth: 20, ratePerPiece: 200 },
      { clothType: 'Full Shirt', qtyPerMonth: 40, ratePerPiece: 300 },
      { clothType: 'Half Shirt', qtyPerMonth: 20, ratePerPiece: 150 },
      { clothType: 'Blouse with Lining', qtyPerMonth: 50, ratePerPiece: 250 },
      { clothType: 'Blouse without Lining', qtyPerMonth: 50, ratePerPiece: 150 },
      { clothType: 'Chudithar with Lining', qtyPerMonth: 20, ratePerPiece: 500 },
      { clothType: 'Chudithar without Lining', qtyPerMonth: 20, ratePerPiece: 400 },
    ],
    defaultExpenses: {
      shopRent: 5000, electricity: 3000, laborSalary: 20000, officeExpenses: 1000,
      transportation: 1000, ratesAndTaxes: 0, loadingUnloading: 0,
      telephoneExpenses: 0, repairMaintenance: 0, stationaryExp: 0,
      donationsPooja: 0, miscExpenses: 0, businessPromotion: 0,
      interestExternalBorrowings: 0, chitsPayment: 0, bankCharges: 0,
      goldLoanInterest: 0, autoLoanEmi: 0, tds: 0,
    },
  },
};

// PMT formula (mirrors Excel PMT function)
export function calcEmiPerLakh(roiPercent, tenureYears) {
  const r = roiPercent / 100 / 12;
  const n = tenureYears * 12;
  if (r === 0) return 100000 / n;
  return (100000 * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function calcLoanEligibility(netIncome, emiPerLakh) {
  if (!emiPerLakh) return 0;
  return (netIncome / emiPerLakh) * 100000;
}

export function calcEmi(loanAmount, roiPercent, tenureYears) {
  const r = roiPercent / 100 / 12;
  const n = tenureYears * 12;
  if (r === 0) return loanAmount / n;
  return (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function calcIIR(emi, netIncome) {
  if (!netIncome) return 0;
  return (emi / netIncome) * 100;
}

// Format as Indian Rupees
export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rs. 0';
  return 'Rs. ' + Math.round(amount).toLocaleString('en-IN');
}

export function formatINRLakhs(amount) {
  if (!amount) return 'Rs. 0';
  const lakhs = amount / 100000;
  return `Rs. ${lakhs.toFixed(2)} L`;
}
