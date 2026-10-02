'use client';

import React, { useState, useEffect } from 'react';
import { FiActivity, FiDollarSign, FiTrendingUp, FiTrendingDown, FiCalendar } from 'react-icons/fi';
import { formatCurrency } from '@/lib/utils';
import dynamic from 'next/dynamic';
import type { DemoTransaction } from '@/lib/demo-data';

const RevenueChart = dynamic(() => import('@/components/admin/RevenueChart'), { ssr: false });

export default function FinanceCashflowPage() {
  const [transactions, setTransactions] = useState<DemoTransaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netProfit: 0 });

  useEffect(() => {
    const fetchCashflow = async () => {
      try {
        const res = await fetch('/api/finance');
        const json = await res.json();
        if (json.success) {
          if (json.summary) setSummary(json.summary);
          if (json.monthlyData) setMonthlyData(json.monthlyData);
          if (json.data) setTransactions(json.data);
        }
      } catch (err) {
        console.warn('Failed to load cashflow data:', err);
      }
    };
    fetchCashflow();
  }, []);

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Cash Flow & Liquidity Statement</h1>
          <p className="admin-page-header-subtitle">Real-time net cash flow movement and operating surplus from database records</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card kpi-card-revenue">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Operating Inflow</span>
            <div className="kpi-card-icon"><FiTrendingUp size={20} /></div>
          </div>
          <div className="kpi-card-value">{formatCurrency(summary.totalIncome)}</div>
        </div>

        <div className="kpi-card kpi-card-expense">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Operating Outflow</span>
            <div className="kpi-card-icon"><FiTrendingDown size={20} /></div>
          </div>
          <div className="kpi-card-value">{formatCurrency(summary.totalExpense)}</div>
        </div>

        <div className="kpi-card kpi-card-profit">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Net Cash Position</span>
            <div className="kpi-card-icon"><FiDollarSign size={20} /></div>
          </div>
          <div className="kpi-card-value" style={{ color: summary.netProfit >= 0 ? '#059669' : '#dc2626' }}>
            {formatCurrency(summary.netProfit)}
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiActivity /> Monthly Cashflow Trajectory
        </h3>
        <RevenueChart data={monthlyData} height={320} />
      </div>
    </div>
  );
}
