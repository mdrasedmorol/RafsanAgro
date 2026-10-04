'use client';

import React, { useState, useMemo } from 'react';
import RevenueChart from '@/components/admin/RevenueChart';
import CategoryPieChart from '@/components/admin/CategoryPieChart';
import {
  demoTransactions as initialTransactions,
  getFinanceSummary,
  getMonthlyData,
  DemoTransaction,
} from '@/lib/demo-data';
import { formatCurrency, formatDate, EXPENSE_CATEGORIES, formatCategoryName } from '@/lib/utils';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiPlusCircle,
  FiMinusCircle,
  FiFilter,
  FiDownload,
  FiSearch,
  FiCalendar,
  FiTrash2,
  FiPieChart,
  FiBarChart2,
  FiCheckCircle,
  FiX,
} from 'react-icons/fi';

export default function AdminFinancePage() {
  const [transactions, setTransactions] = useState<DemoTransaction[]>(initialTransactions);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<'ALL' | 'THIS_MONTH' | 'LAST_30' | 'THIS_YEAR'>('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
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

  // Fetch transactions from backend database API on mount
  React.useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/finance');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setTransactions(json.data);
        }
      } catch (err) {
        console.warn('Failed to load transactions from API database:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Type Filter
      if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;
      // Category Filter
      if (categoryFilter !== 'ALL') {
        if (categoryFilter === 'OTHER' || categoryFilter === 'OTHER_INCOME') {
          if (t.category !== 'OTHER' && t.category !== 'OTHER_INCOME' && !t.category.startsWith('OTHER') && ['SALE', 'SERVICE', 'PURCHASE', 'SALARY', 'RENT', 'TRANSPORT', 'UTILITY', 'MARKETING', 'EQUIPMENT'].includes(t.category)) {
            return false;
          }
        } else if (t.category !== categoryFilter) {
          return false;
        }
      }
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesDesc = t.description?.toLowerCase().includes(q);
        const matchesRef = t.reference?.toLowerCase().includes(q);
        const matchesCat = t.category.toLowerCase().includes(q);
        if (!matchesDesc && !matchesRef && !matchesCat) return false;
      }
      // Date Range
      if (dateRange !== 'ALL') {
        const txnDate = new Date(t.date);
        const now = new Date();
        if (dateRange === 'THIS_MONTH') {
          if (txnDate.getMonth() !== now.getMonth() || txnDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        } else if (dateRange === 'LAST_30') {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (txnDate < thirtyDaysAgo) return false;
        } else if (dateRange === 'THIS_YEAR') {
          if (txnDate.getFullYear() !== now.getFullYear()) return false;
        }
      }
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, typeFilter, categoryFilter, searchQuery, dateRange]);

  // Financial Summaries
  const summary = useMemo(() => getFinanceSummary(filteredTransactions), [filteredTransactions]);
  const monthlyData = useMemo(() => getMonthlyData(transactions), [transactions]);

  const marginPercentage = summary.totalIncome > 0
    ? ((summary.netProfit / summary.totalIncome) * 100).toFixed(1)
    : '0';

  // Handle Form Submit to Database
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) return;

    const isOtherCategory = formData.category === 'OTHER' || formData.category === 'OTHER_INCOME';
    const finalCategory = isOtherCategory && formData.customCategory.trim()
      ? `OTHER: ${formData.customCategory.trim()}`
      : formData.category;

    const payload = {
      type: modalType,
      category: finalCategory,
      amount: parseFloat(formData.amount),
      description: formData.description || `${modalType === 'INCOME' ? 'Income' : 'Expense'} entry`,
      reference: formData.reference || undefined,
      date: new Date(formData.date).toISOString(),
    };

    // Optimistic state update
    const tempTxn: DemoTransaction = {
      id: `txn-db-${Date.now()}`,
      ...payload,
    };
    setTransactions([tempTxn, ...transactions]);

    setIsModalOpen(false);
    setFormData({
      category: 'PURCHASE',
      customCategory: '',
      amount: '',
      description: '',
      reference: '',
      date: new Date().toISOString().split('T')[0],
    });

    try {
      const res = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.data) {
        showToast(`Stored ${modalType.toLowerCase()} entry in database!`);
        // Refresh full list from DB
        const refreshRes = await fetch('/api/finance');
        const refreshJson = await refreshRes.json();
        if (refreshJson.success && Array.isArray(refreshJson.data)) {
          setTransactions(refreshJson.data);
        }
      } else {
        showToast(`${modalType === 'INCOME' ? 'Income' : 'Expense'} recorded!`);
      }
    } catch (err) {
      showToast(`${modalType === 'INCOME' ? 'Income' : 'Expense'} recorded successfully!`);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction entry?')) {
      setTransactions(transactions.filter((t) => t.id !== id));
      showToast('Transaction removed.');

      try {
        await fetch(`/api/finance?id=${id}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('Failed to delete transaction on server:', err);
      }
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID,Type,Category,Amount (BDT),Description,Reference,Date'];
    const rows = filteredTransactions.map(
      (t) => `"${t.id}","${t.type}","${t.category}",${t.amount},"${t.description || ''}","${t.reference || ''}","${t.date}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rafsan_agro_financials_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-page-container">
      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--color-primary-dark)',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 600,
          animation: 'fadeIn 0.3s ease'
        }}>
          <FiCheckCircle size={20} color="var(--color-accent-amber)" />
          {toastMessage}
        </div>
      )}

      {/* Top Action Bar */}
      <div className="admin-header-actions" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            Financial & Cash Flow Tracker
          </h1>
          <p style={{ color: 'var(--color-slate-500)', fontSize: '0.9rem', marginTop: '4px' }}>
            Monitor company revenues, expenditures, profit margins, and granular ledger details
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-outline"
            onClick={handleExportCSV}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FiDownload /> Export Ledger (CSV)
          </button>
          <button
            className="btn"
            style={{ background: '#4BA625', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => {
              setModalType('INCOME');
              setFormData((prev) => ({ ...prev, category: 'SALE' }));
              setIsModalOpen(true);
            }}
          >
            <FiPlusCircle /> Record Income
          </button>
          <button
            className="btn btn-primary"
            style={{ background: '#dc2626', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => {
              setModalType('EXPENSE');
              setFormData((prev) => ({ ...prev, category: 'PURCHASE' }));
              setIsModalOpen(true);
            }}
          >
            <FiMinusCircle /> Record Expense
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: '28px' }}>
        <div className="kpi-card" style={{ borderLeft: '4px solid #4BA625' }}>
          <div className="kpi-card-header">
            <span className="kpi-card-title">Total Revenue / Income</span>
            <div className="kpi-card-icon" style={{ background: '#d1fae5', color: '#4BA625' }}>
              <FiTrendingUp size={22} />
            </div>
          </div>
          <div className="kpi-card-value">{formatCurrency(summary.totalIncome)}</div>
          <div className="kpi-card-trend kpi-trend-up">
            ↑ Active Earnings
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #dc2626' }}>
          <div className="kpi-card-header">
            <span className="kpi-card-title">Total Expenditures</span>
            <div className="kpi-card-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
              <FiTrendingDown size={22} />
            </div>
          </div>
          <div className="kpi-card-value">{formatCurrency(summary.totalExpense)}</div>
          <div className="kpi-card-trend kpi-trend-down">
            ↓ Operational & Purchases
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: `4px solid ${summary.netProfit >= 0 ? '#10b981' : '#f59e0b'}` }}>
          <div className="kpi-card-header">
            <span className="kpi-card-title">Net Profit / Loss</span>
            <div className="kpi-card-icon" style={{ background: '#ecfdf5', color: '#4BA625' }}>
              <FiDollarSign size={22} />
            </div>
          </div>
          <div className="kpi-card-value" style={{ color: summary.netProfit >= 0 ? '#4BA625' : '#dc2626' }}>
            {formatCurrency(summary.netProfit)}
          </div>
          <div className={`kpi-card-trend ${summary.netProfit >= 0 ? 'kpi-trend-up' : 'kpi-trend-down'}`}>
            {summary.netProfit >= 0 ? '✓ Net Surplus' : '⚠ Deficit Period'}
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #6366f1' }}>
          <div className="kpi-card-header">
            <span className="kpi-card-title">Profit Margin</span>
            <div className="kpi-card-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
              <FiBarChart2 size={22} />
            </div>
          </div>
          <div className="kpi-card-value">{marginPercentage}%</div>
          <div className="kpi-card-trend kpi-trend-up">
            Return on Turnover
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        <div className="admin-card">
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiBarChart2 /> Monthly Cash Flow Comparison
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-slate-500)', marginTop: '2px' }}>
                Income vs Expenditure trajectory over recent months
              </p>
            </div>
          </div>
          <div style={{ padding: '20px 12px' }}>
            <RevenueChart data={monthlyData} height={280} />
          </div>
        </div>

        <div className="admin-card">
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiPieChart /> Expenditure Breakdown by Category
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-slate-500)', marginTop: '2px' }}>
                Where your farm and business funds are spent
              </p>
            </div>
          </div>
          <div style={{ padding: '20px 12px' }}>
            <CategoryPieChart transactions={transactions} height={280} />
          </div>
        </div>
      </div>

      {/* Cash Flow Ledger Table Section */}
      <div className="admin-card">
        {/* Table Filters & Toolbar */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-slate-200)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              Transaction Ledger ({filteredTransactions.length})
            </h3>

            {/* Type Tabs */}
            <div style={{ display: 'flex', background: 'var(--color-slate-100)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
              {(['ALL', 'INCOME', 'EXPENSE'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background: typeFilter === t ? '#fff' : 'transparent',
                    color: typeFilter === t ? 'var(--color-primary-dark)' : 'var(--color-slate-600)',
                    boxShadow: typeFilter === t ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {t === 'ALL' ? 'All Ledger' : t === 'INCOME' ? '💚 Income' : '🔴 Expenses'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-slate-400)' }} />
              <input
                type="text"
                placeholder="Search reference, description, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-slate-300)',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            {/* Category Filter */}
            <div style={{ position: 'relative' }}>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-slate-300)',
                  fontSize: '0.875rem',
                  background: '#fff',
                }}
              >
                <option value="ALL">All Categories - সকল ক্যাটাগরি</option>
                <option value="SALE">Product Sales - পণ্য বিক্রয়</option>
                <option value="SERVICE">Services & Consulting - সেবা ও পরামর্শ</option>
                <option value="OTHER_INCOME">Other Income - অন্যান্য আয়</option>
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

            {/* Date Range Filter */}
            <div style={{ position: 'relative' }}>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-slate-300)',
                  fontSize: '0.875rem',
                  background: '#fff',
                }}
              >
                <option value="ALL">All Time</option>
                <option value="THIS_MONTH">This Month</option>
                <option value="LAST_30">Last 30 Days</option>
                <option value="THIS_YEAR">This Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Ref / Invoice</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-slate-500)' }}>
                    No financial records match your selected filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.slice(0, 50).map((txn) => {
                  const isInc = txn.type === 'INCOME';
                  return (
                    <tr key={txn.id}>
                      <td style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', whiteSpace: 'nowrap' }}>
                        {formatDate(txn.date)}
                      </td>
                      <td>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: isInc ? '#d1fae5' : '#fee2e2',
                            color: isInc ? '#065f46' : '#991b1b',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {isInc ? '↑ INCOME' : '↓ EXPENSE'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{formatCategoryName(txn.category)}</span>
                      </td>
                      <td style={{ fontSize: '0.875rem', color: 'var(--color-slate-800)', maxWidth: '280px' }}>
                        {txn.description}
                      </td>
                      <td style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--color-slate-500)' }}>
                        {txn.reference || '—'}
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          color: isInc ? '#4BA625' : '#dc2626',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {isInc ? '+' : '-'}{formatCurrency(txn.amount)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteTransaction(txn.id)}
                          style={{
                            border: 'none',
                            background: 'none',
                            color: 'var(--color-slate-400)',
                            cursor: 'pointer',
                            padding: '6px',
                            borderRadius: '4px',
                            transition: 'color 0.2s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-slate-400)')}
                          title="Delete entry"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
              width: '100%',
              maxWidth: '520px',
              overflow: 'hidden',
              animation: 'scaleUp 0.25s ease',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                background: modalType === 'INCOME' ? '#4BA625' : '#dc2626',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {modalType === 'INCOME' ? <FiPlusCircle /> : <FiMinusCircle />} Record New {modalType === 'INCOME' ? 'Income' : 'Expense'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddTransaction} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid #4BA625',
                    background: modalType === 'INCOME' ? '#4BA625' : '#fff',
                    color: modalType === 'INCOME' ? '#fff' : '#4BA625',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setModalType('INCOME');
                    setFormData((prev) => ({ ...prev, category: 'SALE' }));
                  }}
                >
                  Income (+)
                </button>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid #dc2626',
                    background: modalType === 'EXPENSE' ? '#dc2626' : '#fff',
                    color: modalType === 'EXPENSE' ? '#fff' : '#dc2626',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setModalType('EXPENSE');
                    setFormData((prev) => ({ ...prev, category: 'PURCHASE' }));
                  }}
                >
                  Expense (-)
                </button>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-slate-300)',
                    fontSize: '0.9rem',
                  }}
                >
                  {modalType === 'INCOME' ? (
                    <>
                      <option value="SALE">Product Sales - পণ্য বিক্রয়</option>
                      <option value="SERVICE">Services & Consulting - সেবা ও পরামর্শ</option>
                      <option value="OTHER_INCOME">Others / Other Income - অন্যান্য আয়</option>
                    </>
                  ) : (
                    <>
                      <option value="PURCHASE">Inventory Purchase - পণ্য ক্রয়</option>
                      <option value="SALARY">Salary & Wages - কর্মী বেতন</option>
                      <option value="RENT">Shop & Land Rent - দোকান ও জমি ভাড়া</option>
                      <option value="TRANSPORT">Transport & Freight - পরিবহন খরচ</option>
                      <option value="UTILITY">Utility Bills - ইউটিলিটি বিল</option>
                      <option value="MARKETING">Marketing & Ads - বিজ্ঞাপন ও প্রচার</option>
                      <option value="EQUIPMENT">Machinery & Equipment - যন্ত্রপাতি ও সরঞ্জাম</option>
                      <option value="OTHER">Others / Other Expense - অন্যান্য ব্যয়</option>
                    </>
                  )}
                </select>

                {(formData.category === 'OTHER' || formData.category === 'OTHER_INCOME') && (
                  <div style={{ marginTop: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                      Specific Category Name / নির্দিষ্ট ক্যাটাগরির নাম *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter specific category name (e.g. Seed Sales, Custom Freight)..."
                      value={formData.customCategory}
                      onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-slate-300)',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                  Amount (BDT ৳) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 5000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-slate-300)',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-slate-300)',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                    Ref / Invoice #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. INV-2024-001"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-slate-300)',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                  Description / Remarks
                </label>
                <textarea
                  rows={3}
                  placeholder="Notes regarding this entry..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-slate-300)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: modalType === 'INCOME' ? '#4BA625' : '#dc2626' }}
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
