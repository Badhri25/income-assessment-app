import React, { useState, useEffect } from 'react';
import { BUSINESS_TYPES, formatINR } from '../../utils/businessConfig';

const EXPENSE_FIELDS = [
  { key: 'shopRent', label: 'Shop Rent' },
  { key: 'electricity', label: 'Electricity' },
  { key: 'laborSalary', label: 'Labor / Staff Salary' },
  { key: 'officeExpenses', label: 'Office Expenses' },
  { key: 'transportation', label: 'Transportation' },
  { key: 'ratesAndTaxes', label: 'Rates & Taxes' },
  { key: 'loadingUnloading', label: 'Loading & Unloading' },
  { key: 'telephoneExpenses', label: 'Telephone Expenses' },
  { key: 'repairMaintenance', label: 'Repair & Maintenance' },
  { key: 'stationaryExp', label: 'Stationery' },
  { key: 'donationsPooja', label: 'Donations & Pooja' },
  { key: 'miscExpenses', label: 'Miscellaneous Expenses' },
  { key: 'businessPromotion', label: 'Business Promotion' },
  { key: 'interestExternalBorrowings', label: 'Interest on Borrowings' },
  { key: 'chitsPayment', label: 'Chits Payment' },
  { key: 'bankCharges', label: 'Bank Charges / OD Interest' },
  { key: 'goldLoanInterest', label: 'Gold Loan Interest' },
  { key: 'autoLoanEmi', label: 'Auto Loan EMI' },
  { key: 'tds', label: 'TDS' },
];

export default function PnLModule({ caseData, onSave, saving }) {
  const bt = BUSINESS_TYPES[caseData.businessType];
  const grossProfit = caseData.turnover?.grossProfit || 0;

  const initExpenses = () => {
    const defaults = bt.defaultExpenses;
    const saved = caseData.pnl || {};
    const result = {};
    EXPENSE_FIELDS.forEach(f => {
      result[f.key] = saved[f.key] !== undefined ? saved[f.key] : (defaults[f.key] || 0);
    });
    return result;
  };

  const [expenses, setExpenses] = useState(initExpenses);

  function updateExpense(key, val) {
    setExpenses(prev => ({ ...prev, [key]: Number(val) || 0 }));
  }

  const totalExpenses = EXPENSE_FIELDS.reduce((sum, f) => sum + (Number(expenses[f.key]) || 0), 0);
  const netMonthlyIncome = grossProfit - totalExpenses;

  function handleSave() {
    onSave({ ...expenses, totalExpenses, netMonthlyIncome });
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">💰 Profit & Loss Sheet</div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : '💾 Save'}
        </button>
      </div>

      {!grossProfit && (
        <div className="alert alert-warning">
          ⚠️ Please complete the Turnover Assessment first to populate Gross Profit.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* EXPENSES */}
        <div>
          <h3 style={{ marginBottom: 16, color: '#e74c3c' }}>📤 Monthly Expenses</h3>
          {EXPENSE_FIELDS.map(f => (
            <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <label style={{ flex: 1, color: '#444', fontSize: 13 }}>{f.label}</label>
              <input
                className="form-control"
                type="number"
                min="0"
                value={expenses[f.key]}
                onChange={e => updateExpense(f.key, e.target.value)}
                style={{ width: 140, textAlign: 'right' }}
              />
            </div>
          ))}
          <div style={{ borderTop: '2px solid #e74c3c', paddingTop: 10, marginTop: 6, display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#e74c3c', fontSize: 15 }}>
            <span>Total Expenses</span>
            <span>{formatINR(totalExpenses)}</span>
          </div>
        </div>

        {/* INCOME */}
        <div>
          <h3 style={{ marginBottom: 16, color: '#27ae60' }}>📥 Income Summary</h3>
          <div className="stat-card" style={{ marginBottom: 16 }}>
            <div className="stat-label">Gross Profit from Turnover</div>
            <div className="stat-value">{formatINR(grossProfit)}</div>
            <div className="stat-sub">({((caseData.turnover?.grossMargin || bt.grossMargin) * 100).toFixed(0)}% of {formatINR(caseData.turnover?.totalMonthlyTurnover)})</div>
          </div>

          <div style={{ background: '#f8f9fa', borderRadius: 10, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#444' }}>
              <span>Gross Profit</span>
              <span>{formatINR(grossProfit)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#e74c3c' }}>
              <span>(-) Total Expenses</span>
              <span>({formatINR(totalExpenses)})</span>
            </div>
            <div style={{ borderTop: '2px solid #1e3a5f', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 17, color: netMonthlyIncome >= 0 ? '#27ae60' : '#e74c3c' }}>
              <span>Net Monthly Income</span>
              <span>{formatINR(netMonthlyIncome)}</span>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <h4 style={{ marginBottom: 12, color: '#666' }}>Assessment Methodology</h4>
            <div style={{ background: '#e8f4fd', borderRadius: 8, padding: 14, fontSize: 13, color: '#444', lineHeight: 1.7 }}>
              <div>📝 <strong>Method:</strong> Self Assessment</div>
              <div>💬 <strong>Source:</strong> Personal Discussion</div>
              <div>🏪 <strong>Business:</strong> {bt.label}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="stat-grid" style={{ marginTop: 24 }}>
        <div className="stat-card orange">
          <div className="stat-label">Net Monthly Income</div>
          <div className="stat-value">{formatINR(netMonthlyIncome)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">IIR Base (50% of Net Income)</div>
          <div className="stat-value">{formatINR(netMonthlyIncome * 0.5)}</div>
          <div className="stat-sub">Max EMI capacity</div>
        </div>
      </div>
    </div>
  );
}
