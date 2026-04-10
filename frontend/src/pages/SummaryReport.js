import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCase } from '../utils/api';
import { BUSINESS_TYPES, formatINR } from '../utils/businessConfig';

export default function SummaryReport() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    getCase(id).then(res => setCaseData(res.data));
  }, [id]);

  if (!caseData) return <div className="loading">Loading report...</div>;

  const bt = BUSINESS_TYPES[caseData.businessType];
  const t = caseData.turnover || {};
  const pnl = caseData.pnl || {};
  const elig = caseData.eligibility || {};
  const iirWarning = (elig.iir || 0) > 50;

  const expenseLabels = {
    shopRent: 'Shop Rent', electricity: 'Electricity', laborSalary: 'Labor / Staff Salary',
    officeExpenses: 'Office Expenses', transportation: 'Transportation',
    ratesAndTaxes: 'Rates & Taxes', loadingUnloading: 'Loading & Unloading',
    telephoneExpenses: 'Telephone Expenses', repairMaintenance: 'Repair & Maintenance',
    stationaryExp: 'Stationery', donationsPooja: 'Donations & Pooja',
    miscExpenses: 'Miscellaneous', businessPromotion: 'Business Promotion',
    interestExternalBorrowings: 'Interest on Borrowings', chitsPayment: 'Chits Payment',
    bankCharges: 'Bank Charges / OD Interest', goldLoanInterest: 'Gold Loan Interest',
    autoLoanEmi: 'Auto Loan EMI', tds: 'TDS',
  };

  return (
    <div>
      <div className="no-print" style={{ marginBottom: 20, display: 'flex', gap: 12 }}>
        <Link to={`/cases/${id}`} className="btn btn-secondary">← Back</Link>
        <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Print Report</button>
      </div>

      <div ref={printRef} style={{ background: 'white', padding: 32, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: 28, borderBottom: '3px double #1e3a5f', paddingBottom: 16 }}>
          <h1 style={{ fontSize: 22, color: '#1e3a5f', fontWeight: 800 }}>INCOME ASSESSMENT REPORT</h1>
          <p style={{ color: '#666', marginTop: 4 }}>Loan Eligibility Evaluation — Personal Discussion Method</p>
        </div>

        {/* CUSTOMER DETAILS */}
        <div className="summary-section">
          <h3>Customer & Business Details</h3>
          <table style={{ width: '100%', fontSize: 13 }}>
            <tbody>
              {[
                ['Customer Name', caseData.customerName, 'Business Name', caseData.businessName],
                ['Business Type', bt.label, 'Location', caseData.location],
                ['Assessment Date', new Date(caseData.date).toLocaleDateString('en-IN'), 'Status', caseData.status],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '8px 0', fontWeight: 600, color: '#555', width: '20%' }}>{row[0]}</td>
                  <td style={{ padding: '8px 12px', width: '30%' }}>{row[1]}</td>
                  <td style={{ padding: '8px 0', fontWeight: 600, color: '#555', width: '20%' }}>{row[2]}</td>
                  <td style={{ padding: '8px 12px', width: '30%' }}>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TURNOVER */}
        <div className="summary-section">
          <h3>Turnover Assessment</h3>

          {bt.turnoverType === 'item-wise' && t.items?.length > 0 && (
            <table style={{ width: '100%', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#1e3a5f', color: 'white' }}>
                  <th style={{ padding: '7px 10px', textAlign: 'left' }}>#</th>
                  <th style={{ padding: '7px 10px', textAlign: 'left' }}>Item</th>
                  <th style={{ padding: '7px 10px', textAlign: 'right' }}>Qty/Day</th>
                  <th style={{ padding: '7px 10px', textAlign: 'right' }}>Rate (Rs.)</th>
                  <th style={{ padding: '7px 10px', textAlign: 'right' }}>Per Day</th>
                  <th style={{ padding: '7px 10px', textAlign: 'right' }}>Per Month</th>
                </tr>
              </thead>
              <tbody>
                {t.items.map((item, idx) => {
                  const perDay = (item.qtyPerDay || 0) * (item.price || 0);
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0', background: idx % 2 === 0 ? 'white' : '#f8f9fa' }}>
                      <td style={{ padding: '6px 10px' }}>{idx + 1}</td>
                      <td style={{ padding: '6px 10px' }}>{item.itemName}</td>
                      <td style={{ padding: '6px 10px', textAlign: 'right' }}>{item.qtyPerDay}</td>
                      <td style={{ padding: '6px 10px', textAlign: 'right' }}>{formatINR(item.price)}</td>
                      <td style={{ padding: '6px 10px', textAlign: 'right' }}>{formatINR(perDay)}</td>
                      <td style={{ padding: '6px 10px', textAlign: 'right' }}>{formatINR(perDay * bt.daysPerMonth)}</td>
                    </tr>
                  );
                })}
                <tr style={{ background: '#1e3a5f', color: 'white', fontWeight: 700 }}>
                  <td colSpan={5} style={{ padding: '8px 10px' }}>Total Monthly Turnover</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>{formatINR(t.totalMonthlyTurnover)}</td>
                </tr>
              </tbody>
            </table>
          )}

          {bt.turnoverType === 'session-dairy' && (
            <table style={{ width: '100%', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#1e3a5f', color: 'white' }}>
                  <th style={{ padding: '7px 10px' }}>Session</th>
                  <th style={{ padding: '7px 10px', textAlign: 'right' }}>Society Qty</th>
                  <th style={{ padding: '7px 10px', textAlign: 'right' }}>Society Rate</th>
                  <th style={{ padding: '7px 10px', textAlign: 'right' }}>Ind. Qty</th>
                  <th style={{ padding: '7px 10px', textAlign: 'right' }}>Ind. Rate</th>
                  <th style={{ padding: '7px 10px', textAlign: 'right' }}>Per Month</th>
                </tr>
              </thead>
              <tbody>
                {(t.sessions || []).map((s, i) => {
                  const income = ((s.societyQty || 0) * (s.societyRate || 0) + (s.individualQty || 0) * (s.individualRate || 0)) * 30;
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '6px 10px' }}>{s.session}</td>
                      <td style={{ padding: '6px 10px', textAlign: 'right' }}>{s.societyQty}</td>
                      <td style={{ padding: '6px 10px', textAlign: 'right' }}>{s.societyRate}</td>
                      <td style={{ padding: '6px 10px', textAlign: 'right' }}>{s.individualQty || 0}</td>
                      <td style={{ padding: '6px 10px', textAlign: 'right' }}>{s.individualRate || 0}</td>
                      <td style={{ padding: '6px 10px', textAlign: 'right' }}>{formatINR(income)}</td>
                    </tr>
                  );
                })}
                <tr style={{ background: '#1e3a5f', color: 'white', fontWeight: 700 }}>
                  <td colSpan={5} style={{ padding: '8px 10px' }}>Total Monthly Turnover</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>{formatINR(t.totalMonthlyTurnover)}</td>
                </tr>
              </tbody>
            </table>
          )}

          {bt.turnoverType === 'order-note' && (
            <table style={{ width: '100%', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#1e3a5f', color: 'white' }}>
                  <th style={{ padding: '7px 10px' }}>Garment Type</th>
                  <th style={{ padding: '7px 10px', textAlign: 'right' }}>Qty/Month</th>
                  <th style={{ padding: '7px 10px', textAlign: 'right' }}>Rate/Piece</th>
                  <th style={{ padding: '7px 10px', textAlign: 'right' }}>Income/Month</th>
                </tr>
              </thead>
              <tbody>
                {(t.tailoringItems || []).map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? 'white' : '#f8f9fa' }}>
                    <td style={{ padding: '6px 10px' }}>{item.clothType}</td>
                    <td style={{ padding: '6px 10px', textAlign: 'right' }}>{item.qtyPerMonth}</td>
                    <td style={{ padding: '6px 10px', textAlign: 'right' }}>{formatINR(item.ratePerPiece)}</td>
                    <td style={{ padding: '6px 10px', textAlign: 'right' }}>{formatINR((item.qtyPerMonth || 0) * (item.ratePerPiece || 0))}</td>
                  </tr>
                ))}
                <tr style={{ background: '#1e3a5f', color: 'white', fontWeight: 700 }}>
                  <td colSpan={3} style={{ padding: '8px 10px' }}>Total Monthly Turnover</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>{formatINR(t.totalMonthlyTurnover)}</td>
                </tr>
              </tbody>
            </table>
          )}

          <div style={{ marginTop: 12, display: 'flex', gap: 24 }}>
            <div style={{ background: '#e8f4fd', padding: 12, borderRadius: 8, flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#666' }}>Gross Margin Applied</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{((t.grossMargin || bt.grossMargin) * 100).toFixed(0)}%</div>
            </div>
            <div style={{ background: '#d4edda', padding: 12, borderRadius: 8, flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#666' }}>Gross Profit</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#155724' }}>{formatINR(t.grossProfit)}</div>
            </div>
          </div>
        </div>

        {/* P&L */}
        <div className="summary-section">
          <h3>Profit & Loss Account</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8, color: '#e74c3c' }}>Expenses</div>
              {Object.entries(expenseLabels).map(([key, label]) => {
                const val = pnl[key];
                if (!val) return null;
                return (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f5f5f5', fontSize: 13 }}>
                    <span style={{ color: '#555' }}>{label}</span>
                    <span>{formatINR(val)}</span>
                  </div>
                );
              })}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontWeight: 700, color: '#e74c3c', borderTop: '2px solid #e74c3c', marginTop: 4 }}>
                <span>Total Expenses</span>
                <span>{formatINR(pnl.totalExpenses)}</span>
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8, color: '#27ae60' }}>Income</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f5f5f5', fontSize: 13 }}>
                <span style={{ color: '#555' }}>Gross Profit</span>
                <span>{formatINR(t.grossProfit)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f5f5f5', fontSize: 13, color: '#e74c3c' }}>
                <span>(-) Total Expenses</span>
                <span>({formatINR(pnl.totalExpenses)})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 700, fontSize: 16, color: '#27ae60', borderTop: '2px solid #27ae60', marginTop: 4 }}>
                <span>Net Monthly Income</span>
                <span>{formatINR(pnl.netMonthlyIncome)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ELIGIBILITY */}
        <div className="summary-section">
          <h3>Loan Eligibility</h3>
          <table style={{ width: '100%', fontSize: 13 }}>
            <tbody>
              {[
                ['Net Monthly Income (from P&L)', formatINR(pnl.netMonthlyIncome)],
                ['Rate of Interest', `${elig.roi || 16.5}% p.a.`],
                ['Tenure', `${elig.tenureYears || 10} Years (${(elig.tenureYears || 10) * 12} months)`],
                ['EMI per Lakh', `Rs. ${(elig.emiPerLakh || 0).toFixed(2)}`],
                ['System Loan Eligibility', formatINR(elig.loanEligibility)],
                ['Existing EMI Obligations', formatINR(elig.totalExistingEmi)],
                ['Recommended Loan Amount', formatINR(elig.recommendedLoanAmount || elig.loanEligibility)],
                ['EMI on Recommended Loan', formatINR(elig.finalEmi)],
              ].map(([label, val]) => (
                <tr key={label} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '8px 0', color: '#555', width: '60%' }}>{label}</td>
                  <td style={{ padding: '8px 0', fontWeight: 600, textAlign: 'right' }}>{val}</td>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid #1e3a5f' }}>
                <td style={{ padding: '12px 0', fontWeight: 700, fontSize: 15 }}>
                  IIR (Income to Instalment Ratio)
                </td>
                <td style={{ padding: '12px 0', textAlign: 'right' }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: iirWarning ? '#e74c3c' : '#27ae60' }}>
                    {(elig.iir || 0).toFixed(2)}%
                  </span>
                  <span style={{ display: 'block', fontSize: 12, color: iirWarning ? '#e74c3c' : '#27ae60' }}>
                    {iirWarning ? '⛔ Exceeds 50% — Not Recommended' : '✅ Within 50% Limit'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          {elig.existingLoans?.filter(l => l.bankName)?.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Existing Loan Details:</div>
              <table style={{ width: '100%', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#f0f2f5' }}>
                    <th style={{ padding: '6px 10px', textAlign: 'left' }}>Bank</th>
                    <th style={{ padding: '6px 10px', textAlign: 'right' }}>Loan Amount</th>
                    <th style={{ padding: '6px 10px', textAlign: 'right' }}>EMI/Month</th>
                  </tr>
                </thead>
                <tbody>
                  {elig.existingLoans.filter(l => l.bankName).map((l, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '6px 10px' }}>{l.bankName}</td>
                      <td style={{ padding: '6px 10px', textAlign: 'right' }}>{formatINR(l.loanAmount)}</td>
                      <td style={{ padding: '6px 10px', textAlign: 'right' }}>{formatINR(l.emi)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div style={{ borderTop: '2px solid #1e3a5f', marginTop: 28, paddingTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888' }}>
          <span>Generated on {new Date().toLocaleDateString('en-IN')}</span>
          <span>Income Assessment System | Self Assessment Method | Personal Discussion</span>
        </div>
      </div>
    </div>
  );
}
