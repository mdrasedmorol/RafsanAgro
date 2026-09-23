'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { t, lang } = useI18n();
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();

  const subtotal = items.reduce(
    (sum, item) => sum + (item.discountPrice ?? item.price) * item.quantity,
    0
  );
  const deliveryCharge = subtotal > 3000 ? 0 : 80;
  const total = subtotal + deliveryCharge;

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-drawer-overlay" onClick={closeCart} />
      <div className="cart-drawer" id="cart-drawer">
        {/* Header */}
        <div className="cart-drawer-header">
          <div>
            <h3 className="cart-drawer-title">{t.cart.title}</h3>
            <span className="cart-drawer-count">
              {items.length} {lang === 'bn' ? 'টি আইটেম' : 'items'}
            </span>
          </div>
          <button className="cart-drawer-close" onClick={closeCart} id="cart-close-btn">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="cart-drawer-items">
          {items.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-12) var(--space-4)' }}>
              <div className="empty-state-icon">🛒</div>
              <h4 className="empty-state-title">{t.cart.empty}</h4>
              <p className="empty-state-text">{t.cart.emptyText}</p>
              <Link
                href="/products"
                className="btn btn-primary"
                onClick={closeCart}
                style={{ marginTop: 'var(--space-4)' }}
              >
                {t.cart.continueShopping}
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  {item.image ? (
                    <span style={{ fontSize: '2rem' }}>📦</span>
                  ) : (
                    <span style={{ fontSize: '2rem' }}>📦</span>
                  )}
                </div>
                <div className="cart-item-info">
                  <p className="cart-item-name">
                    {lang === 'bn' ? item.nameBn : item.nameEn}
                  </p>
                  <p className="cart-item-price">
                    {formatPrice(item.discountPrice ?? item.price)}
                  </p>
                  <div className="cart-item-controls">
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="cart-qty-value">{item.quantity}</span>
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove item"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span className="cart-summary-label">{t.cart.subtotal}</span>
              <span className="cart-summary-value">{formatPrice(subtotal)}</span>
            </div>
            <div className="cart-summary-row">
              <span className="cart-summary-label">{t.cart.deliveryCharge}</span>
              <span className="cart-summary-value">
                {deliveryCharge === 0 ? (lang === 'bn' ? 'ফ্রি' : 'Free') : formatPrice(deliveryCharge)}
              </span>
            </div>
            <hr className="divider" style={{ margin: 'var(--space-3) 0' }} />
            <div className="cart-summary-row">
              <span className="cart-summary-label" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {t.cart.total}
              </span>
              <span className="cart-summary-total">{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" onClick={closeCart}>
              <button className="cart-checkout-btn" id="checkout-btn">
                {t.cart.proceedCheckout} →
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
