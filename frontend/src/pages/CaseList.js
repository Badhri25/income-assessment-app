import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCases, deleteCase } from '../utils/api';
import { BUSINESS_TYPES, formatINR } from '../utils/businessConfig';

export default function CaseList() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCases();
  }, [search, filterType, filterStatus]);

  async function loadCases() {
    setLoading(true);
    try {
      const res = await getCases({ search, businessType: filterType, status: filterStatus });
      setCases(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete case for ${name}?`)) return;
    await deleteCase(id);
    loadCases();
  }

  const businessColors = {
    GROCERY: '#27ae60', DAIRY: '#2980b9', TEA_SHOP: '#e67e22',
    HOTEL: '#8e44ad', TAILORING: '#c0392b',
  };

  return (
    <div>
      <div className="page-header">
        <h1>📋 Income Assessment Cases</h1>
        <p>Manage and track all loan income assessments</p>
      </div>

      <div className="search-bar">
        <input
          className="form-control"
          placeholder="🔍 Search by name, business or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <select className="form-control" style={{ width: 200 }} value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Business Types</option>
          {Object.entries(BUSINESS_TYPES).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select className="form-control" style={{ width: 160 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <Link to="/cases/new" className="btn btn-primary">+ New Case</Link>
      </div>

      {loading ? (
        <div className="loading">Loading cases...</div>
      ) : cases.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📂</div>
          <h3>No cases found</h3>
          <p>Create your first income assessment case to get started.</p>
          <br />
          <Link to="/cases/new" className="btn btn-primary">+ New Case</Link>
        </div>
      ) : (
        cases.map(c => (
          <div key={c._id} className="case-card" style={{ borderLeftColor: businessColors[c.businessType] }}>
            <div className="case-card-left" style={{ cursor: 'pointer', flex: 1 }} onClick={() => navigate(`/cases/${c._id}`)}>
              <h3>{c.customerName} — {c.businessName}</h3>
              <p>
                📍 {c.location} &nbsp;|&nbsp;
                🏪 {BUSINESS_TYPES[c.businessType]?.label} &nbsp;|&nbsp;
                📅 {new Date(c.date).toLocaleDateString('en-IN')} &nbsp;|&nbsp;
                Net Income: <strong>{formatINR(c.pnl?.netMonthlyIncome || 0)}</strong>
              </p>
            </div>
            <div className="case-card-right">
              <span className={`badge badge-${c.status === 'COMPLETED' ? 'success' : 'warning'}`}>
                {c.status}
              </span>
              <Link to={`/cases/${c._id}`} className="btn btn-outline btn-sm">View</Link>
              <Link to={`/cases/${c._id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id, c.customerName)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
