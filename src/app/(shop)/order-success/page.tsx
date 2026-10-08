'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { PartyPopper, Package, ShoppingCart } from '@/components/animate-ui/icons';

function OrderSuccessContent() {
  const { t, lang } = useI18n();
  const params = useSearchParams();
  const orderNumber = params.get('order') || 'N/A';

  return (
    <div className="page-enter" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 500, padding: 'var(--space-8)' }}>
        <div className="flex justify-center mb-6">
          <PartyPopper size={72} className="text-emerald-600" animateOnHover />
        </div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--green-700)', marginBottom: 'var(--space-4)' }}>
          {t.order.success}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', lineHeight: 'var(--leading-relaxed)' }}>
          {t.order.successText}
        </p>

        <div style={{
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-8)',
        }}>
          <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-2)' }}>
            {t.order.orderNumber}
          </p>
          <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--green-700)', letterSpacing: '0.05em' }}>
            {orderNumber}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/track-order" className="btn btn-primary inline-flex items-center gap-2">
            <Package size={18} animateOnHover />
            <span>{t.order.trackOrder}</span>
          </Link>
          <Link href="/products" className="btn btn-secondary inline-flex items-center gap-2">
            <ShoppingCart size={18} animateOnHover />
            <span>{lang === 'bn' ? 'আরো কেনাকাটা' : 'Continue Shopping'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner spinner-lg" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
