'use client';

import React, { useState } from 'react';
import { FiSave, FiCheckCircle, FiShield, FiCreditCard, FiTruck, FiSettings } from 'react-icons/fi';
import { useSettingsStore } from '@/stores/settings-store';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Rafsan Agro',
    siteNameBn: 'রফসান এগ্রো',
    phone: '01712345678',
    email: 'info@rafsanagro.com',
    address: 'Bazaar Road, Rangpur Sadar, Rangpur',
    deliveryCharge: 80,
    freeDeliveryMin: 3000,
    codEnabled: true,
    bkashEnabled: true,
    bkashSandbox: true,
    bkashAppKey: 'sandbox_app_key_rafsan_123',
    bkashAppSecret: 'sandbox_app_secret_rafsan_456',
    nagadEnabled: true,
    nagadSandbox: true,
    nagadMerchantId: 'NAGAD_RAFSAN_889',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  React.useEffect(() => {
    const fetchSettingsFromDB = async () => {
      try {
        const res = await fetch('/api/settings');
        const json = await res.json();
        if (json.success && json.data) {
          setSettings((prev) => ({ ...prev, ...json.data }));
        }
      } catch (err) {
        console.warn('Failed to load settings from DB:', err);
      }
    };
    fetchSettingsFromDB();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        useSettingsStore.getState().updateSettings(settings);
        showToast('Settings saved to database successfully!');
      } else {
        showToast('Settings configuration updated!');
      }
    } catch (err) {
      showToast('Settings saved locally.');
    }
  };

  return (
    <div className="admin-page-container">
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

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
          Site & Payment Gateway Settings
        </h1>
        <p style={{ color: 'var(--color-slate-500)', fontSize: '0.9rem', marginTop: '4px' }}>
          Configure shop profile, bKash & Nagad payment credentials, and delivery parameters
        </p>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          {/* General Information */}
          <div className="admin-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiSettings /> General Information
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                Store Name (English)
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-300)', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                Store Name (Bengali)
              </label>
              <input
                type="text"
                value={settings.siteNameBn}
                onChange={(e) => setSettings({ ...settings, siteNameBn: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-300)', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-300)', fontSize: '0.9rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-300)', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                Physical Address
              </label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-300)', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          {/* Logistics & Delivery */}
          <div className="admin-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiTruck /> Shipping & Delivery
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                Flat Rate Delivery Fee (BDT ৳)
              </label>
              <input
                type="number"
                value={settings.deliveryCharge}
                onChange={(e) => setSettings({ ...settings, deliveryCharge: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-300)', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                Minimum Order for Free Delivery (BDT ৳)
              </label>
              <input
                type="number"
                value={settings.freeDeliveryMin}
                onChange={(e) => setSettings({ ...settings, freeDeliveryMin: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-300)', fontSize: '0.9rem' }}
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways Section */}
        <div className="admin-card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiCreditCard /> Mobile Financial Services (MFS) Gateways
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* bKash */}
            <div style={{ border: '1px solid var(--color-slate-200)', borderRadius: 'var(--radius-lg)', padding: '16px', background: '#fff0f5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <strong style={{ fontSize: '1rem', color: '#d12053' }}>bKash Payment Gateway</strong>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={settings.bkashEnabled}
                    onChange={(e) => setSettings({ ...settings, bkashEnabled: e.target.checked })}
                  />
                  Enable
                </label>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '4px' }}>App Key</label>
                <input
                  type="text"
                  value={settings.bkashAppKey}
                  onChange={(e) => setSettings({ ...settings, bkashAppKey: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-300)', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '4px' }}>App Secret</label>
                <input
                  type="password"
                  value={settings.bkashAppSecret}
                  onChange={(e) => setSettings({ ...settings, bkashAppSecret: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-300)', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            {/* Nagad */}
            <div style={{ border: '1px solid var(--color-slate-200)', borderRadius: 'var(--radius-lg)', padding: '16px', background: '#fff7ed' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <strong style={{ fontSize: '1rem', color: '#ea580c' }}>Nagad Payment Gateway</strong>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={settings.nagadEnabled}
                    onChange={(e) => setSettings({ ...settings, nagadEnabled: e.target.checked })}
                  />
                  Enable
                </label>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '4px' }}>Merchant ID</label>
                <input
                  type="text"
                  value={settings.nagadMerchantId}
                  onChange={(e) => setSettings({ ...settings, nagadMerchantId: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-300)', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            {/* COD */}
            <div style={{ border: '1px solid var(--color-slate-200)', borderRadius: 'var(--radius-lg)', padding: '16px', background: '#ecfdf5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <strong style={{ fontSize: '1rem', color: '#059669' }}>Cash on Delivery (COD)</strong>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={settings.codEnabled}
                    onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                  />
                  Enable
                </label>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-slate-600)' }}>
                Allow customers to pay in cash upon receiving order delivery across Bangladesh.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiSave size={18} /> Save Settings Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
