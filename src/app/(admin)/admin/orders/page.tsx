'use client';

import React, { useState, useMemo } from 'react';
import { demoOrders as initialOrders, DemoOrder } from '@/lib/demo-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  FiShoppingBag,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiEye,
  FiPrinter,
  FiPhone,
  FiMapPin,
  FiDollarSign,
  FiX,
  FiEdit,
} from '@/components/animate-ui/icons';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<DemoOrder[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<DemoOrder | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchOrdersFromDB = async () => {
    try {
      const res = await fetch('/api/orders');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setOrders(json.data);
      }
    } catch (err) {
      console.warn('Failed to load orders from DB:', err);
    }
  };

  React.useEffect(() => {
    fetchOrdersFromDB();
  }, []);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchNum = o.orderNumber.toLowerCase().includes(q);
        const matchName = o.customerName.toLowerCase().includes(q);
        const matchPhone = o.customerPhone.toLowerCase().includes(q);
        if (!matchNum && !matchName && !matchPhone) return false;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Statistics
  const totalOrders = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const processingCount = orders.filter((o) => o.status === 'PROCESSING').length;
  const shippedCount = orders.filter((o) => o.status === 'SHIPPED').length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;

  // Change Status in Database
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Order status updated to ${newStatus}`);

    try {
      await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      showToast(`Order status saved to database!`);
    } catch (err) {}
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, background: '#fef3c7', color: '#92400e' }}>⏳ PENDING</span>;
      case 'PROCESSING':
        return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, background: '#e0e7ff', color: '#3730a3' }}>⚙ PROCESSING</span>;
      case 'SHIPPED':
        return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, background: '#dbeafe', color: '#1e40af' }}>🚚 SHIPPED</span>;
      case 'DELIVERED':
        return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, background: '#d1fae5', color: '#065f46' }}>✓ DELIVERED</span>;
      case 'CANCELLED':
        return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, background: '#fee2e2', color: '#991b1b' }}>✕ CANCELLED</span>;
      default:
        return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>{status}</span>;
    }
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
        }}>
          <FiCheckCircle size={20} color="var(--color-accent-amber)" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
          Order Fulfillment Management
        </h1>
        <p style={{ color: 'var(--color-slate-500)', fontSize: '0.9rem', marginTop: '4px' }}>
          Process incoming customer orders, track dispatch logistics, update status & print invoices
        </p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: '28px' }}>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Total Orders</span>
            <div className="kpi-card-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
              <FiShoppingBag size={20} />
            </div>
          </div>
          <div className="kpi-card-value">{totalOrders}</div>
          <div className="kpi-card-trend kpi-trend-up">Lifetime Orders</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Pending Orders</span>
            <div className="kpi-card-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <FiClock size={20} />
            </div>
          </div>
          <div className="kpi-card-value" style={{ color: pendingCount > 0 ? '#d97706' : 'inherit' }}>
            {pendingCount}
          </div>
          <div className="kpi-card-trend kpi-trend-down">Awaiting Confirmation</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Processing & Shipped</span>
            <div className="kpi-card-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
              <FiTruck size={20} />
            </div>
          </div>
          <div className="kpi-card-value">{processingCount + shippedCount}</div>
          <div className="kpi-card-trend kpi-trend-up">In Fulfillment Pipeline</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Delivered Orders</span>
            <div className="kpi-card-icon" style={{ background: '#d1fae5', color: '#059669' }}>
              <FiCheckCircle size={20} />
            </div>
          </div>
          <div className="kpi-card-value">{deliveredCount}</div>
          <div className="kpi-card-trend kpi-trend-up">Successfully Completed</div>
        </div>
      </div>

      {/* Main Card */}
      <div className="admin-card">
        {/* Filter bar */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-slate-200)', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: statusFilter === st ? 'var(--color-primary-dark)' : 'var(--color-slate-100)',
                  color: statusFilter === st ? '#fff' : 'var(--color-slate-600)',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                {st} {st !== 'ALL' && `(${orders.filter((o) => o.status === st).length})`}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', width: '280px' }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-slate-400)' }} />
            <input
              type="text"
              placeholder="Search order #, customer, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-slate-300)',
                fontSize: '0.85rem',
              }}
            />
          </div>
        </div>

        {/* Orders Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Date</th>
                <th>Customer Info</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-slate-500)' }}>
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-primary-dark)', fontSize: '0.9rem' }}>
                        {order.orderNumber}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
                        {order.items.length} item(s)
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)' }}>
                      {formatDate(order.createdAt)}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{order.customerName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-slate-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiPhone size={12} /> {order.customerPhone}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {order.paymentMethod.replace(/_/g, ' ')}
                      </div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: order.paymentStatus === 'PAID' ? '#059669' : '#dc2626',
                        }}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary-dark)' }}>
                      {formatCurrency(order.total)}
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-slate-300)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          background: '#fff',
                        }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '4px 10px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <FiEye /> View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
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
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              animation: 'scaleUp 0.25s ease',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 24px',
                background: 'var(--color-primary-dark)',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Order Summary & Invoice</h3>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace' }}>
                  #{selectedOrder.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px' }}>
              {/* Customer & Address Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', background: 'var(--color-slate-50)', padding: '16px', borderRadius: 'var(--radius-lg)' }}>
                <div>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-slate-500)', marginBottom: '8px' }}>Customer Info</h4>
                  <div style={{ fontWeight: 700 }}>{selectedOrder.customerName}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', marginTop: '2px' }}>
                    📞 {selectedOrder.customerPhone}
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-slate-500)', marginBottom: '8px' }}>Delivery Address</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-slate-700)' }}>
                    📍 {selectedOrder.customerAddress}, {selectedOrder.customerArea}
                  </div>
                </div>
              </div>

              {/* Status & Payment Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '12px 16px', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-slate-500)', marginRight: '8px' }}>Payment Method:</span>
                  <strong style={{ fontSize: '0.9rem' }}>{selectedOrder.paymentMethod.replace(/_/g, ' ')}</strong>
                  <span style={{ marginLeft: '12px', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: selectedOrder.paymentStatus === 'PAID' ? '#d1fae5' : '#fee2e2', color: selectedOrder.paymentStatus === 'PAID' ? '#065f46' : '#991b1b', fontWeight: 700 }}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
                <div>
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </div>

              {/* Items Table */}
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', color: 'var(--color-primary-dark)' }}>Purchased Items</h4>
              <table className="admin-table" style={{ marginBottom: '20px' }}>
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th style={{ textAlign: 'center' }}>Qty</th>
                    <th style={{ textAlign: 'right' }}>Unit Price</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{item.productName}</td>
                      <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Calculation */}
              <div style={{ width: '240px', marginLeft: 'auto', borderTop: '2px dashed var(--color-slate-300)', paddingTop: '12px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--color-slate-600)' }}>
                  <span>Delivery Charge:</span>
                  <span>{formatCurrency(selectedOrder.deliveryCharge)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary-dark)', borderTop: '1px solid var(--color-slate-200)', paddingTop: '8px' }}>
                  <span>Grand Total:</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', paddingTop: '16px', borderTop: '1px solid var(--color-slate-200)' }}>
                <button
                  className="btn btn-outline"
                  onClick={() => window.print()}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <FiPrinter /> Print Invoice
                </button>
                <button className="btn btn-primary" onClick={() => setSelectedOrder(null)}>
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
