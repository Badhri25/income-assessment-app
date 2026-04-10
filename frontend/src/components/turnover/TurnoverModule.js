import React, { useState, useEffect } from 'react';
import { BUSINESS_TYPES, formatINR } from '../../utils/businessConfig';

export default function TurnoverModule({ caseData, onSave, saving }) {
  const bt = BUSINESS_TYPES[caseData.businessType];
  const turnoverType = bt.turnoverType;

  const [grossMargin, setGrossMargin] = useState(
    caseData.turnover?.grossMargin || bt.grossMargin
  );
  const [items, setItems] = useState(
    caseData.turnover?.items?.length ? caseData.turnover.items : (bt.defaultItems || [])
  );
  const [sessions, setSessions] = useState(
    caseData.turnover?.sessions?.length ? caseData.turnover.sessions : (bt.defaultSessions || [])
  );
  const [teaRows, setTeaRows] = useState(
    caseData.turnover?.teaRows?.length ? caseData.turnover.teaRows : (bt.defaultTeaRows || [])
  );
  const [tailoringItems, setTailoringItems] = useState(
    caseData.turnover?.tailoringItems?.length ? caseData.turnover.tailoringItems : (bt.defaultTailoringItems || [])
  );

  // Computed
  const days = bt.daysPerMonth;

  function calcTurnover() {
    if (turnoverType === 'item-wise') {
      return items.reduce((sum, item) => {
        const perDay = (Number(item.qtyPerDay) || 0) * (Number(item.price) || 0);
        return sum + perDay * days;
      }, 0);
    }
    if (turnoverType === 'session-dairy') {
      return sessions.reduce((sum, s) => {
        const societyIncome = (Number(s.societyQty) || 0) * (Number(s.societyRate) || 0);
        const individualIncome = (Number(s.individualQty) || 0) * (Number(s.individualRate) || 0);
        return sum + (societyIncome + individualIncome) * 30;
      }, 0);
    }
    if (turnoverType === 'session-tea') {
      return teaRows.reduce((sum, row) => {
        const perDay = (Number(row.litresOfMilk) || 0) * (Number(row.teaPerLitre) || 0) * (Number(row.rate) || 0);
        return sum + perDay * 30;
      }, 0);
    }
    if (turnoverType === 'order-note') {
      return tailoringItems.reduce((sum, item) => {
        return sum + (Number(item.qtyPerMonth) || 0) * (Number(item.ratePerPiece) || 0);
      }, 0);
    }
    return 0;
  }

  const totalMonthlyTurnover = calcTurnover();
  const grossProfit = totalMonthlyTurnover * grossMargin;

  // Item-wise helpers
  function updateItem(idx, field, val) {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  }
  function addItem() {
    setItems(prev => [...prev, { itemName: '', qtyPerDay: 0, price: 0 }]);
  }
  function removeItem(idx) {
    setItems(prev => prev.filter((_, i) => i !== idx));
  }

  // Session dairy helpers
  function updateSession(idx, field, val) {
    setSessions(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));
  }

  // Tea helpers
  function updateTeaRow(idx, field, val) {
    setTeaRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: val } : r));
  }
  function addTeaRow() {
    setTeaRows(prev => [...prev, { product: '', litresOfMilk: 0, teaPerLitre: 0, rate: 0 }]);
  }

  // Tailoring helpers
  function updateTailoringItem(idx, field, val) {
    setTailoringItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  }
  function addTailoringItem() {
    setTailoringItems(prev => [...prev, { clothType: '', qtyPerMonth: 0, ratePerPiece: 0 }]);
  }
  function removeTailoringItem(idx) {
    setTailoringItems(prev => prev.filter((_, i) => i !== idx));
  }

  function handleSave() {
    onSave({
      grossMargin: Number(grossMargin),
      items, sessions, teaRows, tailoringItems,
      totalMonthlyTurnover,
      grossProfit,
    });
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">📊 Turnover Assessment — {bt.label}</div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : '💾 Save'}
        </button>
      </div>

      {/* ITEM-WISE (Grocery & Hotel) */}
      {turnoverType === 'item-wise' && (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Name</th>
                  <th>Qty/Day</th>
                  <th>Sale Price (Rs.)</th>
                  <th>Per Day Sales (Rs.)</th>
                  <th>Per Month ({days} days) Rs.</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const perDay = (Number(item.qtyPerDay) || 0) * (Number(item.price) || 0);
                  const perMonth = perDay * days;
                  return (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <input className="form-control" value={item.itemName}
                          onChange={e => updateItem(idx, 'itemName', e.target.value)} placeholder="Item name" />
                      </td>
                      <td>
                        <input className="form-control" type="number" min="0" value={item.qtyPerDay}
                          onChange={e => updateItem(idx, 'qtyPerDay', e.target.value)} style={{ width: 90 }} />
                      </td>
                      <td>
                        <input className="form-control" type="number" min="0" value={item.price}
                          onChange={e => updateItem(idx, 'price', e.target.value)} style={{ width: 100 }} />
                      </td>
                      <td><strong>{formatINR(perDay)}</strong></td>
                      <td><strong>{formatINR(perMonth)}</strong></td>
                      <td>
                        <button className="delete-btn" onClick={() => removeItem(idx)}>🗑</button>
                      </td>
                    </tr>
                  );
                })}
                <tr className="total-row">
                  <td colSpan={5}>Total Monthly Turnover</td>
                  <td colSpan={2}><strong>{formatINR(totalMonthlyTurnover)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="add-row-btn" onClick={addItem}>+ Add Item</button>
        </>
      )}

      {/* DAIRY — SESSION-WISE */}
      {turnoverType === 'session-dairy' && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Session</th>
                <th>Society Qty (Ltrs)</th>
                <th>Society Rate/Ltr</th>
                <th>Society Income/Day</th>
                <th>Individual Qty (Ltrs)</th>
                <th>Individual Rate/Ltr</th>
                <th>Individual Income/Day</th>
                <th>Total/Day</th>
                <th>Per Month (×30)</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, idx) => {
                const societyIncome = (Number(s.societyQty) || 0) * (Number(s.societyRate) || 0);
                const individualIncome = (Number(s.individualQty) || 0) * (Number(s.individualRate) || 0);
                const totalDay = societyIncome + individualIncome;
                return (
                  <tr key={idx}>
                    <td><strong>{s.session}</strong></td>
                    <td><input className="form-control" type="number" value={s.societyQty} onChange={e => updateSession(idx, 'societyQty', e.target.value)} style={{ width: 90 }} /></td>
                    <td><input className="form-control" type="number" value={s.societyRate} onChange={e => updateSession(idx, 'societyRate', e.target.value)} style={{ width: 90 }} /></td>
                    <td>{formatINR(societyIncome)}</td>
                    <td><input className="form-control" type="number" value={s.individualQty || 0} onChange={e => updateSession(idx, 'individualQty', e.target.value)} style={{ width: 90 }} /></td>
                    <td><input className="form-control" type="number" value={s.individualRate || 0} onChange={e => updateSession(idx, 'individualRate', e.target.value)} style={{ width: 90 }} /></td>
                    <td>{formatINR(individualIncome)}</td>
                    <td><strong>{formatINR(totalDay)}</strong></td>
                    <td><strong>{formatINR(totalDay * 30)}</strong></td>
                  </tr>
                );
              })}
              <tr className="total-row">
                <td colSpan={8}>Total Monthly Turnover</td>
                <td><strong>{formatINR(totalMonthlyTurnover)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* TEA SHOP */}
      {turnoverType === 'session-tea' && (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Litres of Milk (A)</th>
                  <th>Cups per Litre (B)</th>
                  <th>Rate per Cup (C)</th>
                  <th>Sales/Day (A×B×C)</th>
                  <th>Sales/Month (×30)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {teaRows.map((row, idx) => {
                  const perDay = (Number(row.litresOfMilk) || 0) * (Number(row.teaPerLitre) || 0) * (Number(row.rate) || 0);
                  return (
                    <tr key={idx}>
                      <td><input className="form-control" value={row.product} onChange={e => updateTeaRow(idx, 'product', e.target.value)} /></td>
                      <td><input className="form-control" type="number" value={row.litresOfMilk} onChange={e => updateTeaRow(idx, 'litresOfMilk', e.target.value)} style={{ width: 90 }} /></td>
                      <td><input className="form-control" type="number" value={row.teaPerLitre} onChange={e => updateTeaRow(idx, 'teaPerLitre', e.target.value)} style={{ width: 90 }} /></td>
                      <td><input className="form-control" type="number" value={row.rate} onChange={e => updateTeaRow(idx, 'rate', e.target.value)} style={{ width: 90 }} /></td>
                      <td><strong>{formatINR(perDay)}</strong></td>
                      <td><strong>{formatINR(perDay * 30)}</strong></td>
                      <td><button className="delete-btn" onClick={() => setTeaRows(prev => prev.filter((_, i) => i !== idx))}>🗑</button></td>
                    </tr>
                  );
                })}
                <tr className="total-row">
                  <td colSpan={5}>Total Monthly Turnover</td>
                  <td colSpan={2}><strong>{formatINR(totalMonthlyTurnover)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="add-row-btn" onClick={addTeaRow}>+ Add Product</button>
        </>
      )}

      {/* TAILORING — ORDER NOTE */}
      {turnoverType === 'order-note' && (
        <>
          <p style={{ color: '#666', marginBottom: 12 }}>
            Based on past 3 months order notes — average monthly stitching quantities
          </p>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type of Cloth</th>
                  <th>Stitching/Month (A)</th>
                  <th>Rate per Piece Rs. (B)</th>
                  <th>Income/Month (A×B)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tailoringItems.map((item, idx) => {
                  const income = (Number(item.qtyPerMonth) || 0) * (Number(item.ratePerPiece) || 0);
                  return (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td><input className="form-control" value={item.clothType} onChange={e => updateTailoringItem(idx, 'clothType', e.target.value)} /></td>
                      <td><input className="form-control" type="number" value={item.qtyPerMonth} onChange={e => updateTailoringItem(idx, 'qtyPerMonth', e.target.value)} style={{ width: 110 }} /></td>
                      <td><input className="form-control" type="number" value={item.ratePerPiece} onChange={e => updateTailoringItem(idx, 'ratePerPiece', e.target.value)} style={{ width: 110 }} /></td>
                      <td><strong>{formatINR(income)}</strong></td>
                      <td><button className="delete-btn" onClick={() => removeTailoringItem(idx)}>🗑</button></td>
                    </tr>
                  );
                })}
                <tr className="total-row">
                  <td colSpan={4}>Total Monthly Turnover</td>
                  <td colSpan={2}><strong>{formatINR(totalMonthlyTurnover)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="add-row-btn" onClick={addTailoringItem}>+ Add Garment Type</button>
        </>
      )}

      {/* GROSS MARGIN */}
      <div className="margin-row">
        <label>Gross Margin %:</label>
        <input
          className="form-control"
          type="number"
          step="0.01"
          min="0"
          max="1"
          value={grossMargin}
          onChange={e => setGrossMargin(Number(e.target.value))}
          style={{ width: 100 }}
        />
        <span style={{ color: '#666' }}>= <strong>{(grossMargin * 100).toFixed(0)}%</strong></span>
        <span style={{ marginLeft: 'auto', color: '#666' }}>
          Default for {bt.label}: <strong>{(bt.grossMargin * 100).toFixed(0)}%</strong>
        </span>
      </div>

      {/* SUMMARY */}
      <div className="stat-grid" style={{ marginTop: 20 }}>
        <div className="stat-card">
          <div className="stat-label">Total Monthly Turnover</div>
          <div className="stat-value">{formatINR(totalMonthlyTurnover)}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Gross Profit ({(grossMargin * 100).toFixed(0)}%)</div>
          <div className="stat-value">{formatINR(grossProfit)}</div>
        </div>
      </div>
    </div>
  );
}
