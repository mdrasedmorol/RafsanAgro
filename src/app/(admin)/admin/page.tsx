'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { demoOrders, demoTransactions, getFinanceSummary, getMonthlyData, demoProducts } from '@/lib/demo-data';
import { formatPrice, formatCompact, ORDER_STATUS_COLORS } from '@/lib/utils';

const RevenueChart = dynamic(() => import('@/components/admin/RevenueChart'), { ssr: false });
const CategoryPieChart = dynamic(() => import('@/components/admin/CategoryPieChart'), { ssr: false });

export default function AdminDashboard() {
  const summary = getFinanceSummary(demoTransactions);
  const monthlyData = getMonthlyData(demoTransactions);
  const pendingOrders = demoOrders.filter((o) => o.status === 'PENDING' || o.status === 'PROCESSING').length;
  const lowStockProducts = demoProducts.filter((p) => p.stock < 30);

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)' }}>Dashboard</h1>
          <p className="admin-page-header-subtitle">Welcome back! Here&apos;s your business overview.</p>
        </div>
        <div className="admin-page-actions">
          <Link href="/admin/finance/income" className="btn btn-primary">
            + Add Income
          </Link>
          <Link href="/admin/finance/expenses" className="btn btn-secondary">
            + Add Expense
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-card-revenue">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Total Revenue</span>
            <div className="kpi-card-icon">💰</div>
          </div>
          <div className="kpi-card-value">{formatPrice(summary.totalIncome)}</div>
          <span className="kpi-card-trend kpi-trend-up">↑ 12.5% vs last month</span>
        </div>

        <div className="kpi-card kpi-card-expense">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Total Expenses</span>
            <div className="kpi-card-icon">📉</div>
          </div>
          <div className="kpi-card-value">{formatPrice(summary.totalExpense)}</div>
          <span className="kpi-card-trend kpi-trend-down">↑ 3.2% vs last month</span>
        </div>

        <div className="kpi-card kpi-card-profit">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Net Profit</span>
            <div className="kpi-card-icon">📊</div>
          </div>
          <div className="kpi-card-value" style={{ color: summary.netProfit >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
            {formatPrice(summary.netProfit)}
          </div>
          <span className={`kpi-card-trend ${summary.netProfit >= 0 ? 'kpi-trend-up' : 'kpi-trend-down'}`}>
            {summary.netProfit >= 0 ? '↑ Profitable' : '↓ Loss'}
          </span>
        </div>

        <div className="kpi-card kpi-card-orders">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Pending Orders</span>
            <div className="kpi-card-icon">🛒</div>
          </div>
          <div className="kpi-card-value">{pendingOrders}</div>
          <span className="kpi-card-trend kpi-trend-up">{demoOrders.length} total orders</span>
        </div>
      </div>

      {/* Charts */}
      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">Revenue vs Expenses</h3>
              <p className="chart-card-subtitle">Last 6 months financial overview</p>
            </div>
          </div>
          <RevenueChart data={monthlyData} />
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">Expense Breakdown</h3>
              <p className="chart-card-subtitle">By category</p>
            </div>
          </div>
          <CategoryPieChart transactions={demoTransactions} />
        </div>
      </div>

      {/* Bottom Grid: Recent Orders + Low Stock */}
      <div className="chart-grid">
        {/* Recent Orders */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Recent Orders</h3>
            <Link href="/admin/orders" className="section-link">View All →</Link>
          </div>
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {demoOrders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600 }}>{order.orderNumber}</td>
                    <td>{order.customerName}</td>
                    <td style={{ fontWeight: 600 }}>{formatPrice(order.total)}</td>
                    <td>
                      <span className={`status-badge ${ORDER_STATUS_COLORS[order.status] || ''}`}>
                        <span className="status-dot" />
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">⚠️ Low Stock Alerts</h3>
            <Link href="/admin/products" className="section-link">View All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{product.nameEn}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{product.categoryName}</p>
                </div>
                <span
                  className={`badge ${product.stock < 10 ? 'badge-error' : 'badge-warning'}`}
                >
                  {product.stock} left
                </span>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <p className="text-muted text-center" style={{ padding: 'var(--space-6)' }}>
                All products are well-stocked ✓
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

