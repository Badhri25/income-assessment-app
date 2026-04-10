import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CaseList from './pages/CaseList';
import CaseForm from './pages/CaseForm';
import CaseDetail from './pages/CaseDetail';
import SummaryReport from './pages/SummaryReport';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <a href="/" className="nav-brand">
            <span className="nav-icon">📊</span>
            Income Assessment System
          </a>
          <a href="/cases/new" className="btn btn-primary btn-sm">+ New Case</a>
        </nav>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<CaseList />} />
            <Route path="/cases/new" element={<CaseForm />} />
            <Route path="/cases/:id/edit" element={<CaseForm />} />
            <Route path="/cases/:id" element={<CaseDetail />} />
            <Route path="/cases/:id/report" element={<SummaryReport />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
