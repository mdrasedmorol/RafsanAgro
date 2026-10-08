'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice, generateOrderNumber } from '@/lib/utils';
import { User, CreditCard, DollarSign, PhoneCall, ArrowRight, LoaderCircle, ShoppingCart } from '@/components/animate-ui/icons';

export default function CheckoutPage() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    area: '',
    city: '',
    notes: '',
  });

  const subtotal = items.reduce(
    (sum, item) => sum + (item.discountPrice ?? item.price) * item.quantity, 0
  );
  const deliveryCharge = subtotal > 3000 ? 0 : 80;
  const total = subtotal + deliveryCharge;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate order processing
    await new Promise((r) => setTimeout(r, 1500));
    const orderNumber = generateOrderNumber();
    clearCart();
    router.push(`/order-success?order=${orderNumber}`);
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: 'var(--space-20) var(--container-padding)', textAlign: 'center' }}>
        <div className="empty-state">
          <div className="empty-state-icon flex justify-center py-4">
            <ShoppingCart size={54} className="text-gray-400" animateOnHover />
          </div>
          <h2 className="empty-state-title">{t.cart.empty}</h2>
          <p className="empty-state-text">{t.cart.emptyText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="container">
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, padding: 'var(--space-8) 0 var(--space-4)' }}>
          {t.checkout.title}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">
            {/* Left: Form */}
            <div>
              {/* Customer Info */}
              <div className="checkout-form-section">
                <h2 className="checkout-form-title flex items-center gap-2">
                  <User size={20} animateOnHover className="text-emerald-600" />
                  <span>{t.checkout.customerInfo}</span>
                </h2>
                <div className="checkout-form-grid">
                  <div className="input-group">
                    <label className="input-label">{t.checkout.name} *</label>
                    <input className="input" type="text" name="name" required value={form.name} onChange={handleInputChange} placeholder={lang === 'bn' ? 'আপনার নাম' : 'Enter your name'} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">{t.checkout.phone} *</label>
                    <input className="input" type="tel" name="phone" required value={form.phone} onChange={handleInputChange} placeholder="01XXXXXXXXX" />
                  </div>
                  <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="input-label">{t.checkout.email}</label>
                    <input className="input" type="email" name="email" value={form.email} onChange={handleInputChange} placeholder="email@example.com" />
                  </div>
                  <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="input-label">{t.checkout.address} *</label>
                    <textarea className="textarea" name="address" required value={form.address} onChange={handleInputChange} placeholder={lang === 'bn' ? 'পূর্ণ ঠিকানা লিখুন' : 'Enter full delivery address'} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">{t.checkout.area}</label>
                    <input className="input" type="text" name="area" value={form.area} onChange={handleInputChange} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">{t.checkout.city}</label>
                    <input className="input" type="text" name="city" value={form.city} onChange={handleInputChange} />
                  </div>
                  <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="input-label">{t.checkout.notes}</label>
                    <textarea className="textarea" name="notes" value={form.notes} onChange={handleInputChange} style={{ minHeight: 80 }} />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="checkout-form-section">
                <h2 className="checkout-form-title flex items-center gap-2">
                  <CreditCard size={20} animateOnHover className="text-emerald-600" />
                  <span>{t.checkout.paymentMethod}</span>
                </h2>
                <div className="payment-methods">
                  <label className={`payment-method-option ${paymentMethod === 'CASH_ON_DELIVERY' ? 'selected' : ''}`} onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}>
                    <div className="payment-method-icon flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                      <DollarSign size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <div className="payment-method-name">{t.checkout.cashOnDelivery}</div>
                      <div className="payment-method-desc">{lang === 'bn' ? 'ডেলিভারির সময় পেমেন্ট করুন' : 'Pay when you receive your order'}</div>
                    </div>
                  </label>
                  <label className={`payment-method-option ${paymentMethod === 'BKASH' ? 'selected' : ''}`} onClick={() => setPaymentMethod('BKASH')}>
                    <div className="payment-method-icon flex items-center justify-center" style={{ background: 'rgba(220, 53, 69, 0.1)' }}>
                      <PhoneCall size={20} className="text-rose-600" />
                    </div>
                    <div>
                      <div className="payment-method-name">{t.checkout.bkash}</div>
                      <div className="payment-method-desc">{lang === 'bn' ? 'বিকাশ দিয়ে পেমেন্ট করুন' : 'Pay with bKash mobile wallet'}</div>
                    </div>
                  </label>
                  <label className={`payment-method-option ${paymentMethod === 'NAGAD' ? 'selected' : ''}`} onClick={() => setPaymentMethod('NAGAD')}>
                    <div className="payment-method-icon flex items-center justify-center" style={{ background: 'rgba(245, 130, 32, 0.1)' }}>
                      <PhoneCall size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <div className="payment-method-name">{t.checkout.nagad}</div>
                      <div className="payment-method-desc">{lang === 'bn' ? 'নগদ দিয়ে পেমেন্ট করুন' : 'Pay with Nagad mobile wallet'}</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div>
              <div className="order-summary-card">
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
                  {t.checkout.orderSummary}
                </h3>

                {items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ flex: 1 }}>
                      <p className="text-sm font-semibold">{lang === 'bn' ? item.nameBn : item.nameEn}</p>
                      <p className="text-xs text-muted">× {item.quantity}</p>
                    </div>
                    <span className="font-semibold">{formatPrice((item.discountPrice ?? item.price) * item.quantity)}</span>
                  </div>
                ))}

                <hr className="divider" />
                <div className="cart-summary-row">
                  <span className="text-sm text-muted">{t.cart.subtotal}</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="cart-summary-row">
                  <span className="text-sm text-muted">{t.cart.deliveryCharge}</span>
                  <span className="font-semibold">{deliveryCharge === 0 ? (lang === 'bn' ? 'ফ্রি' : 'Free') : formatPrice(deliveryCharge)}</span>
                </div>
                <hr className="divider" style={{ margin: 'var(--space-3) 0' }} />
                <div className="cart-summary-row">
                  <span className="font-bold">{t.cart.total}</span>
                  <span style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--green-700)' }}>{formatPrice(total)}</span>
                </div>

                <button
                  type="submit"
                  className="cart-checkout-btn flex items-center justify-center gap-2"
                  disabled={loading}
                  id="place-order-btn"
                  style={{ marginTop: 'var(--space-6)' }}
                >
                  {loading ? (
                    <>
                      <LoaderCircle size={20} className="animate-spin inline-block mr-2" />
                      <span>{t.checkout.processing}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.checkout.placeOrder}</span>
                      <ArrowRight size={18} animateOnHover />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
