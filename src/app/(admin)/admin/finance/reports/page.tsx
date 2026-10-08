'use client';

import React, { useState, useEffect } from 'react';
import { FiFileText, FiDownload, FiPieChart, FiBarChart2, FiCheckCircle } from '@/components/animate-ui/icons';
import { formatCurrency } from '@/lib/utils';
import dynamic from 'next/dynamic';
import type { DemoTransaction } from '@/lib/demo-data';

const CategoryPieChart = dynamic(() => import('@/components/admin/CategoryPieChart'), { ssr: false });

export default function FinanceReportsPage() {
  const [transactions, setTransactions] = useState<DemoTransaction[]>([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netProfit: 0 });

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const res = await fetch('/api/finance');
        const json = await res.json();
        if (json.success) {
          if (json.summary) setSummary(json.summary);
          if (json.data) setTransactions(json.data);
        }
      } catch (err) {
        console.warn('Failed to load reports data:', err);
      }
    };
    fetchReportsData();
  }, []);

  const handleExportCSV = () => {
    const headers = ['ID,Type,Category,Amount (BDT),Description,Reference,Date'];
    const rows = transactions.map(
      (t) => `"${t.id}","${t.type}","${t.category}",${t.amount},"${t.description || ''}","${t.reference || ''}","${t.date}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rafsan_agro_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Financial Reports & Statements</h1>
          <p className="admin-page-header-subtitle">Generate exportable audit reports and expense breakdown statements from PostgreSQL database</p>
        </div>
        <div className="admin-page-actions">
          <button className="btn btn-primary" onClick={handleExportCSV}>
            <FiDownload size={16} /> Export Complete Audit CSV
          </button>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title"><FiPieChart /> Expense Distribution by Category</h3>
          </div>
          <CategoryPieChart transactions={transactions} height={300} />
        </div>

        <div className="chart-card" style={{ padding: '24px' }}>
          <h3 className="chart-card-title" style={{ marginBottom: '16px' }}><FiFileText /> Executive Financial Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '10px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Total Revenue / Sales:</span>
              <span style={{ fontWeight: 700, color: '#059669' }}>{formatCurrency(summary.totalIncome)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '10px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Total Expenditures / Costs:</span>
              <span style={{ fontWeight: 700, color: '#dc2626' }}>{formatCurrency(summary.totalExpense)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#ecfdf5', borderRadius: '10px', border: '1px solid #d1fae5' }}>
              <span style={{ color: '#047857', fontWeight: 700 }}>Net Operational Surplus:</span>
              <span style={{ fontWeight: 800, fontSize: '16px', color: summary.netProfit >= 0 ? '#059669' : '#dc2626' }}>
                {formatCurrency(summary.netProfit)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '10px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Total Transaction Records:</span>
              <span style={{ fontWeight: 700 }}>{transactions.length} DB records</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
