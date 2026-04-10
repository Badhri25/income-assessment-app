import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCase, updateCase } from '../utils/api';
import { BUSINESS_TYPES, formatINR } from '../utils/businessConfig';
import TurnoverModule from '../components/turnover/TurnoverModule';
import PnLModule from '../components/pnl/PnLModule';
import EligibilityModule from '../components/eligibility/EligibilityModule';

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [activeTab, setActiveTab] = useState('turnover');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    loadCase();
  }, [id]);

  async function loadCase() {
    const res = await getCase(id);
    setCaseData(res.data);
  }

  async function handleSave(section, data) {
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await updateCase(id, { [section]: data });
      setCaseData(res.data);
      setSaveMsg('✅ Saved successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e) {
      setSaveMsg('❌ Save failed. Please try again.');
    }
    setSaving(false);
  }

  async function markComplete() {
    await updateCase(id, { status: 'COMPLETED' });
    loadCase();
  }

  if (!caseData) return <div className="loading">Loading case...</div>;

  const bt = BUSINESS_TYPES[caseData.businessType];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>📁 {caseData.customerName}</h1>
          <p>{caseData.businessName} &nbsp;|&nbsp; {bt.label} &nbsp;|&nbsp; 📍 {caseData.location} &nbsp;|&nbsp; 📅 {new Date(caseData.date).toLocaleDateString('en-IN')}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span className={`badge badge-${caseData.status === 'COMPLETED' ? 'success' : 'warning'}`} style={{ fontSize: 13 }}>
            {caseData.status}
          </span>
          <Link to={`/cases/${id}/edit`} className="btn btn-secondary btn-sm">✏️ Edit</Link>
          {caseData.status !== 'COMPLETED' && (
            <button className="btn btn-success btn-sm" onClick={markComplete}>✅ Mark Complete</button>
          )}
          <Link to={`/cases/${id}/report`} className="btn btn-primary btn-sm">🖨️ Report</Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Monthly Turnover</div>
          <div className="stat-value">{formatINR(caseData.turnover?.totalMonthlyTurnover)}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Gross Profit</div>
          <div className="stat-value">{formatINR(caseData.turnover?.grossProfit)}</div>
          <div className="stat-sub">Margin: {((caseData.turnover?.grossMargin || bt.grossMargin) * 100).toFixed(0)}%</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">Net Monthly Income</div>
          <div className="stat-value">{formatINR(caseData.pnl?.netMonthlyIncome)}</div>
        </div>
        <div className={`stat-card ${(caseData.eligibility?.iir || 0) > 50 ? 'red' : 'green'}`}>
          <div className="stat-label">IIR</div>
          <div className="stat-value">{(caseData.eligibility?.iir || 0).toFixed(1)}%</div>
          <div className="stat-sub">{(caseData.eligibility?.iir || 0) > 50 ? '⚠️ Exceeds 50%' : '✅ Within limit'}</div>
        </div>
      </div>

      {saveMsg && <div className={`alert ${saveMsg.includes('✅') ? 'alert-success' : 'alert-danger'}`}>{saveMsg}</div>}

      <div className="tabs">
        {[
          { key: 'turnover', label: '📊 Turnover Assessment' },
          { key: 'pnl', label: '💰 P&L Sheet' },
          { key: 'eligibility', label: '🏦 Loan Eligibility' },
        ].map(t => (
          <button key={t.key} className={`tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'turnover' && (
        <TurnoverModule caseData={caseData} onSave={(data) => handleSave('turnover', data)} saving={saving} />
      )}
      {activeTab === 'pnl' && (
        <PnLModule caseData={caseData} onSave={(data) => handleSave('pnl', data)} saving={saving} />
      )}
      {activeTab === 'eligibility' && (
        <EligibilityModule caseData={caseData} onSave={(data) => handleSave('eligibility', data)} saving={saving} />
      )}
    </div>
  );
}
