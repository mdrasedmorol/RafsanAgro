'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FiTrendingDown, FiPlus, FiSearch, FiTrash2, FiCheckCircle } from '@/components/animate-ui/icons';
import { formatCurrency, formatDate, formatCategoryName } from '@/lib/utils';
import type { DemoTransaction } from '@/lib/demo-data';

export default function FinanceExpensesPage() {
  const [transactions, setTransactions] = useState<DemoTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: 'PURCHASE',
    customCategory: '',
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

  const fetchExpenseData = async () => {
    try {
      const res = await fetch('/api/finance?type=EXPENSE');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setTransactions(json.data);
      }
    } catch (err) {
      console.warn('Failed to load expense data:', err);
    }
  };

  useEffect(() => {
    fetchExpenseData();
  }, []);

  const expenseTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (t.type !== 'EXPENSE') return false;
      if (categoryFilter !== 'ALL') {
        if (categoryFilter === 'OTHER') {
          if (t.category !== 'OTHER' && !t.category.startsWith('OTHER') && ['PURCHASE', 'SALARY', 'RENT', 'TRANSPORT', 'UTILITY', 'MARKETING', 'EQUIPMENT'].includes(t.category)) {
            return false;
          }
        } else if (t.category !== categoryFilter) {
          return false;
        }
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          t.description?.toLowerCase().includes(q) ||
          t.reference?.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, categoryFilter, searchQuery]);

  const totalExpense = useMemo(() => {
    return expenseTransactions.reduce((acc, t) => acc + Number(t.amount), 0);
  }, [expenseTransactions]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) return;

    const isOther = formData.category === 'OTHER' || formData.category === 'OTHER_INCOME';
    const finalCategory = isOther && formData.customCategory.trim()
      ? `OTHER: ${formData.customCategory.trim()}`
      : formData.category;

    const payload = {
      type: 'EXPENSE',
      category: finalCategory,
      amount: parseFloat(formData.amount),
      description: formData.description || 'Expense entry',
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
        showToast('Expense transaction stored in database!');
        fetchExpenseData();
      }
    } catch (err) {
      showToast('Expense recorded.');
    } finally {
      setIsModalOpen(false);
      setFormData({
        category: 'PURCHASE',
        customCategory: '',
        amount: '',
        description: '',
        reference: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this expense record?')) {
      setTransactions(transactions.filter(t => t.id !== id));
      showToast('Expense entry deleted.');
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
          background: '#dc2626',
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
          <h1 className="admin-page-title">Expenditures Ledger</h1>
          <p className="admin-page-header-subtitle">Manage supplier payments, payroll, rent, utilities, and stock purchases</p>
        </div>
        <div className="admin-page-actions">
          <button className="btn btn-primary" style={{ background: '#dc2626' }} onClick={() => setIsModalOpen(true)}>
            <FiPlus size={16} /> Record New Expense
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card kpi-card-expense">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Total Filtered Expenses</span>
            <div className="kpi-card-icon">
              <FiTrendingDown size={20} />
            </div>
          </div>
          <div className="kpi-card-value">{formatCurrency(totalExpense)}</div>
          <div className="kpi-card-footer">
            <span className="kpi-card-trend kpi-trend-down">{expenseTransactions.length} Expense Entries</span>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--admin-card-border)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-sub)' }} />
            <input
              type="text"
              placeholder="Search expense details or invoice #..."
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
            <option value="ALL">All Categories - সকল ক্যাটাগরি</option>
            <option value="PURCHASE">Inventory Purchase - পণ্য ক্রয়</option>
            <option value="SALARY">Salary & Wages - কর্মী বেতন</option>
            <option value="RENT">Shop & Land Rent - দোকান ও জমি ভাড়া</option>
            <option value="TRANSPORT">Transport & Freight - পরিবহন খরচ</option>
            <option value="UTILITY">Utility Bills - ইউটিলিটি বিল</option>
            <option value="MARKETING">Marketing & Ads - বিজ্ঞাপন ও প্রচার</option>
            <option value="EQUIPMENT">Machinery & Equipment - যন্ত্রপাতি ও সরঞ্জাম</option>
            <option value="OTHER">Other Expense - অন্যান্য ব্যয়</option>
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
              {expenseTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-empty-cell">
                    No expense records found.
                  </td>
                </tr>
              ) : (
                expenseTransactions.map((t) => (
                  <tr key={t.id}>
                    <td>{formatDate(t.date)}</td>
                    <td><span className="table-font-bold">{formatCategoryName(t.category)}</span></td>
                    <td>{t.description}</td>
                    <td><span style={{ fontFamily: 'monospace' }}>{t.reference || '—'}</span></td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#dc2626' }}>
                      -{formatCurrency(t.amount)}
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
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#dc2626' }}>- Record Expense Entry</h3>
            <form onSubmit={handleAddExpense}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Category</label>
                <select className="select" style={{ width: '100%' }} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <option value="PURCHASE">Inventory Purchase - পণ্য ক্রয়</option>
                  <option value="SALARY">Salary & Wages - কর্মী বেতন</option>
                  <option value="RENT">Shop & Land Rent - দোকান ও জমি ভাড়া</option>
                  <option value="TRANSPORT">Transport & Freight - পরিবহন খরচ</option>
                  <option value="UTILITY">Utility Bills - ইউটিলিটি বিল</option>
                  <option value="MARKETING">Marketing & Ads - বিজ্ঞাপন ও প্রচার</option>
                  <option value="EQUIPMENT">Machinery & Equipment - যন্ত্রপাতি ও সরঞ্জাম</option>
                  <option value="OTHER">Others / Other Expense - অন্যান্য ব্যয়</option>
                </select>

                {(formData.category === 'OTHER' || formData.category === 'OTHER_INCOME') && (
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                      Specific Category Name / নির্দিষ্ট ক্যাটাগরির নাম *
                    </label>
                    <input
                      type="text"
                      required
                      className="input"
                      style={{ width: '100%' }}
                      placeholder="Enter specific category name (e.g. Machine Repair, Feed Purchase)..."
                      value={formData.customCategory}
                      onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                    />
                  </div>
                )}
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Amount (BDT ৳) *</label>
                <input type="number" step="0.01" required className="input" placeholder="e.g. 8500" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Date *</label>
                <input type="date" required className="input" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Reference / Invoice #</label>
                <input type="text" className="input" placeholder="e.g. EXP-501" value={formData.reference} onChange={(e) => setFormData({ ...formData, reference: e.target.value })} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Description</label>
                <textarea className="input" rows={2} placeholder="Notes..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#dc2626' }}>Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
