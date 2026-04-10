import React, { useState, useEffect } from 'react';
import { formatINR, calcEmiPerLakh, calcLoanEligibility, calcEmi, calcIIR } from '../../utils/businessConfig';

export default function EligibilityModule({ caseData, onSave, saving }) {
  const netIncome = caseData.pnl?.netMonthlyIncome || 0;

  const [roi, setRoi] = useState(caseData.eligibility?.roi || 16.5);
  const [tenureYears, setTenureYears] = useState(caseData.eligibility?.tenureYears || 10);
  const [existingLoans, setExistingLoans] = useState(
    caseData.eligibility?.existingLoans?.length
      ? caseData.eligibility.existingLoans
      : [{ bankName: '', loanAmount: 0, emi: 0 }]
  );
  const [recommendedLoanAmount, setRecommendedLoanAmount] = useState(
    caseData.eligibility?.recommendedLoanAmount || 0
  );

  const emiPerLakh = calcEmiPerLakh(roi, tenureYears);
  const loanEligibility = calcLoanEligibility(netIncome, emiPerLakh);
  const totalExistingEmi = existingLoans.reduce((sum, l) => sum + (Number(l.emi) || 0), 0);
  const finalEmi = calcEmi(recommendedLoanAmount || loanEligibility, roi, tenureYears);
  const iir = calcIIR(finalEmi + totalExistingEmi, netIncome);

  function updateLoan(idx, field, val) {
    setExistingLoans(prev => prev.map((l, i) => i === idx ? { ...l, [field]: val } : l));
  }
  function addLoan() {
    setExistingLoans(prev => [...prev, { bankName: '', loanAmount: 0, emi: 0 }]);
  }
  function removeLoan(idx) {
    setExistingLoans(prev => prev.filter((_, i) => i !== idx));
  }

  function handleSave() {
    onSave({
      roi: Number(roi),
      tenureYears: Number(tenureYears),
      existingLoans,
      totalExistingEmi,
      emiPerLakh,
      loanEligibility,
      recommendedLoanAmount: Number(recommendedLoanAmount) || loanEligibility,
      finalEmi,
      iir,
      iirWarning: iir > 50,
    });
  }

  const iirWarning = iir > 50;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">🏦 Loan Eligibility Calculation</div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : '💾 Save'}
        </button>
      </div>

      {!netIncome && (
        <div className="alert alert-warning">⚠️ Please complete P&L module first to see accurate eligibility.</div>
      )}

      {iirWarning && (
        <div className="alert alert-danger">
          ⛔ <strong>IIR Warning:</strong> The Income to Instalment Ratio is {iir.toFixed(2)}%, which exceeds the 50% threshold. Loan is NOT recommended at this amount.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* LEFT — Inputs */}
        <div>
          <h3 style={{ marginBottom: 16, color: '#1e3a5f' }}>📋 Loan Parameters</h3>

          <div className="form-group">
            <label className="form-label">Rate of Interest (%) per annum</label>
            <input className="form-control" type="number" step="0.1" value={roi}
              onChange={e => setRoi(Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label className="form-label">Tenure (Years)</label>
            <input className="form-control" type="number" min="1" max="30" value={tenureYears}
              onChange={e => setTenureYears(Number(e.target.value))} />
          </div>

          <h4 style={{ margin: '20px 0 10px', color: '#444' }}>Existing Loan Obligations</h4>
          {existingLoans.map((loan, idx) => (
            <div key={idx} style={{ background: '#f8f9fa', borderRadius: 8, padding: 12, marginBottom: 10 }}>
              <div className="form-group">
                <label className="form-label">Bank Name</label>
                <input className="form-control" value={loan.bankName}
                  onChange={e => updateLoan(idx, 'bankName', e.target.value)} placeholder="e.g. SBI" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Loan Amount (Rs.)</label>
                  <input className="form-control" type="number" value={loan.loanAmount}
                    onChange={e => updateLoan(idx, 'loanAmount', Number(e.target.value))} />
                </div>
                <div className="form-group">
                  <label className="form-label">EMI/Month (Rs.)</label>
                  <input className="form-control" type="number" value={loan.emi}
                    onChange={e => updateLoan(idx, 'emi', Number(e.target.value))} />
                </div>
              </div>
              <button className="delete-btn" onClick={() => removeLoan(idx)}>🗑 Remove</button>
            </div>
          ))}
          <button className="add-row-btn" onClick={addLoan}>+ Add Existing Loan</button>

          <div className="form-group" style={{ marginTop: 20 }}>
            <label className="form-label">Recommended Loan Amount (Rs.) — Officer Override</label>
            <input className="form-control" type="number" value={recommendedLoanAmount}
              onChange={e => setRecommendedLoanAmount(e.target.value)}
              placeholder={`System calculated: ${Math.round(loanEligibility)}`} />
            <small style={{ color: '#666' }}>Leave blank to use system calculated eligibility</small>
          </div>
        </div>

        {/* RIGHT — Results */}
        <div>
          <h3 style={{ marginBottom: 16, color: '#1e3a5f' }}>📊 Eligibility Results</h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <tbody>
              {[
                ['Net Monthly Income', formatINR(netIncome), '#27ae60'],
                ['IIR Threshold (50%)', formatINR(netIncome * 0.5), '#2d6a9f'],
                ['EMI per Lakh (Rs.)', `Rs. ${emiPerLakh.toFixed(2)}`, '#444'],
                ['Loan Eligibility', formatINR(loanEligibility), '#1e3a5f'],
                ['Total Existing EMI', formatINR(totalExistingEmi), '#e67e22'],
                ['Recommended Loan', formatINR(Number(recommendedLoanAmount) || loanEligibility), '#1e3a5f'],
                ['EMI on Recommended', formatINR(finalEmi), '#8e44ad'],
              ].map(([label, value, color]) => (
                <tr key={label} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px 8px', color: '#666' }}>{label}</td>
                  <td style={{ padding: '10px 8px', fontWeight: 700, color, textAlign: 'right' }}>{value}</td>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid #1e3a5f' }}>
                <td style={{ padding: '14px 8px', fontWeight: 700, fontSize: 15 }}>IIR</td>
                <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                  <span className={iirWarning ? 'iir-warn' : 'iir-ok'} style={{ fontSize: 20 }}>
                    {iir.toFixed(2)}%
                  </span>
                  {iirWarning
                    ? <span style={{ display: 'block', color: '#e74c3c', fontSize: 12 }}>⛔ Exceeds 50% limit</span>
                    : <span style={{ display: 'block', color: '#27ae60', fontSize: 12 }}>✅ Within acceptable limit</span>
                  }
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: 20, background: iirWarning ? '#f8d7da' : '#d4edda', borderRadius: 10, padding: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: iirWarning ? '#721c24' : '#155724', marginBottom: 6 }}>
              {iirWarning ? '⛔ Loan NOT Recommended' : '✅ Loan Eligible'}
            </div>
            <div style={{ fontSize: 13, color: iirWarning ? '#721c24' : '#155724' }}>
              {iirWarning
                ? `IIR of ${iir.toFixed(1)}% exceeds 50% threshold. Consider reducing loan amount or tenure.`
                : `Customer is eligible for up to ${formatINR(Number(recommendedLoanAmount) || loanEligibility)} with an EMI of ${formatINR(finalEmi)}/month.`
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
