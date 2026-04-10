import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCase, getCase, updateCase } from '../utils/api';
import { BUSINESS_TYPES } from '../utils/businessConfig';

export default function CaseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    customerName: '', businessName: '', businessType: 'GROCERY',
    location: '', date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      getCase(id).then(res => {
        const c = res.data;
        setForm({
          customerName: c.customerName,
          businessName: c.businessName,
          businessType: c.businessType,
          location: c.location,
          date: c.date?.split('T')[0] || '',
        });
      });
    }
  }, [id, isEdit]);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await updateCase(id, form);
        navigate(`/cases/${id}`);
      } else {
        const res = await createCase(form);
        navigate(`/cases/${res.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="page-header">
        <h1>{isEdit ? '✏️ Edit Case' : '➕ New Assessment Case'}</h1>
        <p>Fill in the customer and business details</p>
      </div>

      <div className="card">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Customer Name *</label>
              <input name="customerName" className="form-control" value={form.customerName}
                onChange={handleChange} required placeholder="e.g. M/s Murugan Stores" />
            </div>
            <div className="form-group">
              <label className="form-label">Business Name *</label>
              <input name="businessName" className="form-control" value={form.businessName}
                onChange={handleChange} required placeholder="e.g. Murugan Provision Store" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Business Type *</label>
              <select name="businessType" className="form-control" value={form.businessType}
                onChange={handleChange} required disabled={isEdit}>
                {Object.entries(BUSINESS_TYPES).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
              {isEdit && <small style={{ color: '#888' }}>Business type cannot be changed after creation</small>}
            </div>
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input name="location" className="form-control" value={form.location}
                onChange={handleChange} required placeholder="e.g. Chennai, Tamil Nadu" />
            </div>
          </div>
          <div className="form-group" style={{ maxWidth: 240 }}>
            <label className="form-label">Assessment Date</label>
            <input name="date" type="date" className="form-control" value={form.date} onChange={handleChange} />
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Saving...' : (isEdit ? '💾 Save Changes' : '✅ Create Case')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
