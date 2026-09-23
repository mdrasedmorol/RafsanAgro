'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { demoOrders } from '@/lib/demo-data';
import { formatPrice } from '@/lib/utils';

export default function TrackOrderPage() {
  const { t, lang } = useI18n();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<typeof demoOrders[0] | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const order = demoOrders.find(
      (o) => o.orderNumber.toLowerCase() === query.toLowerCase() || o.customerPhone === query
    );
    if (order) {
      setResult(order);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  const statusSteps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const statusLabels: Record<string, { en: string; bn: string }> = {
    PENDING: { en: 'Pending', bn: 'অপেক্ষমাণ' },
    CONFIRMED: { en: 'Confirmed', bn: 'নিশ্চিত' },
    PROCESSING: { en: 'Processing', bn: 'প্রক্রিয়াধীন' },
    SHIPPED: { en: 'Shipped', bn: 'শিপ করা হয়েছে' },
    DELIVERED: { en: 'Delivered', bn: 'ডেলিভারি সম্পন্ন' },
    CANCELLED: { en: 'Cancelled', bn: 'বাতিল' },
  };

  return (
    <div className="page-enter">
      <div style={{
        background: 'linear-gradient(135deg, var(--green-800), var(--green-700))',
        padding: 'var(--space-16) 0',
        textAlign: 'center',
        color: 'white',
      }}>
        <div className="container">
          <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, color: 'white', marginBottom: 'var(--space-4)' }}>
            {t.order.trackTitle}
          </h1>
          <p style={{ opacity: 0.8, marginBottom: 'var(--space-8)' }}>
            {lang === 'bn' ? 'আপনার অর্ডার নম্বর বা ফোন নম্বর দিয়ে ট্র্যাক করুন' : 'Enter your order number or phone number to track'}
          </p>
          <form onSubmit={handleTrack} style={{ display: 'flex', gap: 'var(--space-3)', maxWidth: 500, margin: '0 auto' }}>
            <input
              className="input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.order.trackPlaceholder}
              style={{ flex: 1, background: 'rgba(255,255,255,0.95)', color: 'var(--text-primary)' }}
              required
            />
            <button type="submit" className="btn btn-accent btn-lg">
              🔍 {t.order.trackBtn}
            </button>
          </form>
          <p style={{ fontSize: 'var(--text-xs)', opacity: 0.5, marginTop: 'var(--space-3)' }}>
            {lang === 'bn' ? 'ডেমো: RA-M1K2N3-ABC বা 01712345678 ট্রাই করুন' : 'Demo: Try RA-M1K2N3-ABC or 01712345678'}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-10) var(--container-padding)' }}>
        {notFound && (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>😕</div>
            <h3>{lang === 'bn' ? 'অর্ডার পাওয়া যায়নি' : 'Order not found'}</h3>
            <p className="text-muted">
              {lang === 'bn' ? 'দয়া করে আপনার অর্ডার নম্বর চেক করুন' : 'Please check your order number and try again'}
            </p>
          </div>
        )}

        {result && (
          <div className="card" style={{ padding: 'var(--space-8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>
                  {t.order.orderNumber}: {result.orderNumber}
                </h2>
                <p className="text-muted">{new Date(result.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`status-badge status-${result.status.toLowerCase()}`}>
                <span className="status-dot" />
                {statusLabels[result.status]?.[lang] || result.status}
              </span>
            </div>

            {/* Progress Bar */}
            {result.status !== 'CANCELLED' && (
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: 16,
                    left: '10%',
                    right: '10%',
                    height: 3,
                    background: 'var(--border-light)',
                    borderRadius: 'var(--radius-full)',
                  }}>
                    <div style={{
                      width: `${(statusSteps.indexOf(result.status) / (statusSteps.length - 1)) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--green-600), var(--green-400))',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                  {statusSteps.map((step, i) => {
                    const isActive = statusSteps.indexOf(result.status) >= i;
                    return (
                      <div key={step} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: isActive ? 'var(--green-600)' : 'var(--border-light)',
                          color: isActive ? 'white' : 'var(--text-tertiary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto var(--space-2)',
                          fontWeight: 700,
                          fontSize: 'var(--text-xs)',
                          transition: 'all 0.3s ease',
                        }}>
                          {isActive ? '✓' : i + 1}
                        </div>
                        <span style={{ fontSize: 'var(--text-xs)', color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)', fontWeight: isActive ? 600 : 400 }}>
                          {statusLabels[step]?.[lang]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Details */}
            <div className="grid-2" style={{ gap: 'var(--space-6)' }}>
              <div>
                <h3 className="font-semibold" style={{ marginBottom: 'var(--space-4)' }}>
                  {lang === 'bn' ? 'গ্রাহকের তথ্য' : 'Customer Details'}
                </h3>
                <p><strong>{result.customerName}</strong></p>
                <p className="text-muted">{result.customerPhone}</p>
                <p className="text-muted">{result.customerAddress}</p>
              </div>
              <div>
                <h3 className="font-semibold" style={{ marginBottom: 'var(--space-4)' }}>
                  {lang === 'bn' ? 'আইটেম সমূহ' : 'Items'}
                </h3>
                {result.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span className="text-sm">{item.productName} × {item.quantity}</span>
                    <span className="text-sm font-semibold">{formatPrice(item.total)}</span>
                  </div>
                ))}
                <hr className="divider" />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{t.cart.total}</strong>
                  <strong style={{ color: 'var(--green-700)' }}>{formatPrice(result.total)}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
