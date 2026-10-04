'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiShoppingCart,
  FiPlus,
  FiArrowRight,
  FiAlertTriangle,
  FiPackage,
  FiLayers,
} from 'react-icons/fi';
import { demoOrders, demoTransactions, getFinanceSummary, getMonthlyData, demoProducts } from '@/lib/demo-data';
import { formatPrice, ORDER_STATUS_COLORS } from '@/lib/utils';

const RevenueChart = dynamic(() => import('@/components/admin/RevenueChart'), { ssr: false });
const CategoryPieChart = dynamic(() => import('@/components/admin/CategoryPieChart'), { ssr: false });

export default function AdminDashboard() {
  const summary = getFinanceSummary(demoTransactions);
  const monthlyData = getMonthlyData(demoTransactions);
  const pendingOrders = demoOrders.filter((o) => o.status === 'PENDING' || o.status === 'PROCESSING').length;
  const [products, setProducts] = React.useState<any[]>(demoProducts);

  React.useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setProducts(json.data);
        }
      })
      .catch(() => { });
  }, []);

  const lowStockProducts = products.filter((p) => p.stock < 30);

  return (
    <div className="admin-dashboard-wrapper">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-header-subtitle">Welcome back! Here&apos;s your business overview.</p>
        </div>
        <div className="admin-page-actions">
          <Link href="/admin/finance" className="btn btn-primary">
            <FiDollarSign size={16} /> Finance Tracker
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-card-revenue">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Total Revenue</span>
            <div className="kpi-card-icon">
              <FiDollarSign size={20} />
            </div>
          </div>
          <div className="kpi-card-value">{formatPrice(summary.totalIncome)}</div>
          <div className="kpi-card-footer">
            <span className="kpi-card-trend kpi-trend-up">
              <FiTrendingUp size={12} /> +12.5% vs last month
            </span>
          </div>
        </div>

        <div className="kpi-card kpi-card-expense">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Total Expenses</span>
            <div className="kpi-card-icon">
              <FiTrendingDown size={20} />
            </div>
          </div>
          <div className="kpi-card-value">{formatPrice(summary.totalExpense)}</div>
          <div className="kpi-card-footer">
            <span className="kpi-card-trend kpi-trend-down">
              <FiTrendingDown size={12} /> +3.2% vs last month
            </span>
          </div>
        </div>

        <div className="kpi-card kpi-card-profit">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Net Profit</span>
            <div className="kpi-card-icon">
              <FiLayers size={20} />
            </div>
          </div>
          <div
            className="kpi-card-value"
            style={{ color: summary.netProfit >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}
          >
            {formatPrice(summary.netProfit)}
          </div>
          <div className="kpi-card-footer">
            <span className={`kpi-card-trend ${summary.netProfit >= 0 ? 'kpi-trend-up' : 'kpi-trend-down'}`}>
              {summary.netProfit >= 0 ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
              {summary.netProfit >= 0 ? 'Profitable' : 'Loss'}
            </span>
          </div>
        </div>

        <div className="kpi-card kpi-card-orders">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Pending Orders</span>
            <div className="kpi-card-icon">
              <FiShoppingCart size={20} />
            </div>
          </div>
          <div className="kpi-card-value">{pendingOrders}</div>
          <div className="kpi-card-footer">
            <span className="kpi-card-trend kpi-trend-up">{demoOrders.length} total orders</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">Revenue vs Expenses</h3>
              <p className="chart-card-subtitle">Last 6 months financial overview</p>
            </div>
          </div>
          <div className="chart-container">
            <RevenueChart data={monthlyData} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">Expense Breakdown</h3>
              <p className="chart-card-subtitle">Distribution by category</p>
            </div>
          </div>
          <div className="chart-container">
            <CategoryPieChart transactions={demoTransactions} />
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Orders + Low Stock */}
      <div className="chart-grid">
        {/* Recent Orders */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Recent Orders</h3>
            <Link href="/admin/orders" className="section-link">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="admin-table-container">
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
                {demoOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="table-empty-cell">
                      No recent orders found.
                    </td>
                  </tr>
                ) : (
                  demoOrders.slice(0, 5).map((order) => (
                    <tr key={order.id}>
                      <td className="table-font-bold">{order.orderNumber}</td>
                      <td>{order.customerName}</td>
                      <td className="table-font-bold">{formatPrice(order.total)}</td>
                      <td>
                        <span className={`status-badge ${ORDER_STATUS_COLORS[order.status] || ''}`}>
                          <span className="status-dot" />
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiAlertTriangle style={{ color: 'var(--color-warning)' }} size={18} /> Low Stock Alerts
            </h3>
            <Link href="/admin/products" className="section-link">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="low-stock-list">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="low-stock-item">
                <div className="low-stock-info">
                  <p className="low-stock-title">{product.nameEn}</p>
                  <p className="low-stock-category">{product.categoryName}</p>
                </div>
                <span className={`status-badge ${product.stock < 10 ? 'status-cancelled' : 'status-pending'}`}>
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


