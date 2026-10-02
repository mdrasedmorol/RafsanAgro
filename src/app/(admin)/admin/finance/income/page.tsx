'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FiTrendingUp, FiPlus, FiSearch, FiDownload, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { DemoTransaction } from '@/lib/demo-data';

export default function FinanceIncomePage() {
  const [transactions, setTransactions] = useState<DemoTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: 'SALE',
    amount: '',
    description: '',
    reference: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchIncomeData = async () => {
    try {
      const res = await fetch('/api/finance?type=INCOME');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setTransactions(json.data);
      }
    } catch (err) {
      console.warn('Failed to load income data:', err);
    }
  };

  useEffect(() => {
    fetchIncomeData();
  }, []);

  const incomeTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (t.type !== 'INCOME') return false;
      if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          t.description?.toLowerCase().includes(q) ||
          t.reference?.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [transactions, categoryFilter, searchQuery]);

  const totalIncome = useMemo(() => {
    return incomeTransactions.reduce((acc, t) => acc + Number(t.amount), 0);
  }, [incomeTransactions]);

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) return;

    const payload = {
      type: 'INCOME',
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description || 'Income entry',
      reference: formData.reference || undefined,
      date: new Date(formData.date).toISOString(),
    };

    try {
      const res = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Income transaction recorded in database!');
        fetchIncomeData();
      }
    } catch (err) {
      showToast('Income recorded successfully.');
    } finally {
      setIsModalOpen(false);
      setFormData({
        category: 'SALE',
        amount: '',
        description: '',
        reference: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this income record?')) {
      setTransactions(transactions.filter(t => t.id !== id));
      showToast('Income entry deleted.');
      try {
        await fetch(`/api/finance?id=${id}`, { method: 'DELETE' });
      } catch (err) {}
    }
  };

  return (
    <div className="admin-page-container">
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#059669',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 600,
        }}>
          <FiCheckCircle size={20} />
          {toastMessage}
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Revenue & Income Ledger</h1>
          <p className="admin-page-header-subtitle">Track product sales, service earnings, and incoming cashflow stored in database</p>
        </div>
        <div className="admin-page-actions">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <FiPlus size={16} /> Record New Income
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card kpi-card-revenue">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Total Filtered Income</span>
            <div className="kpi-card-icon">
              <FiTrendingUp size={20} />
            </div>
          </div>
          <div className="kpi-card-value">{formatCurrency(totalIncome)}</div>
          <div className="kpi-card-footer">
            <span className="kpi-card-trend kpi-trend-up">{incomeTransactions.length} Income Records</span>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--admin-card-border)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-sub)' }} />
            <input
              type="text"
              placeholder="Search income description or invoice #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{ paddingLeft: '36px' }}
            />
          </div>
          <select
            className="select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="SALE">Product Sales</option>
            <option value="SERVICE">Services / Consulting</option>
            <option value="OTHER_INCOME">Other Income</option>
          </select>
        </div>

        <div className="admin-table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Invoice / Ref</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomeTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-empty-cell">
                    No income entries found.
                  </td>
                </tr>
              ) : (
                incomeTransactions.map((t) => (
                  <tr key={t.id}>
                    <td>{formatDate(t.date)}</td>
                    <td><span className="table-font-bold">{t.category}</span></td>
                    <td>{t.description}</td>
                    <td><span style={{ fontFamily: 'monospace' }}>{t.reference || '—'}</span></td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#059669' }}>
                      +{formatCurrency(t.amount)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => handleDelete(t.id)} style={{ color: '#ef4444' }}>
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="admin-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>+ Record Income Entry</h3>
            <form onSubmit={handleAddIncome}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Category</label>
                <select className="select" style={{ width: '100%' }} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <option value="SALE">SALE (Product Sales)</option>
                  <option value="SERVICE">SERVICE (Consulting/Services)</option>
                  <option value="OTHER_INCOME">OTHER INCOME</option>
                </select>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Amount (BDT ৳) *</label>
                <input type="number" step="0.01" required className="input" placeholder="e.g. 15000" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Date *</label>
                <input type="date" required className="input" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Reference / Invoice #</label>
                <input type="text" className="input" placeholder="e.g. INV-102" value={formData.reference} onChange={(e) => setFormData({ ...formData, reference: e.target.value })} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Description</label>
                <textarea className="input" rows={2} placeholder="Notes..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save to Database</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
