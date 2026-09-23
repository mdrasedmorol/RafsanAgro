'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';

export default function ContactPage() {
  const { t, lang } = useI18n();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
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
            {t.contact.title}
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', opacity: 0.8 }}>{t.contact.subtitle}</p>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-16) var(--container-padding)' }}>
        <div className="grid-2" style={{ gap: 'var(--space-10)' }}>
          {/* Contact Form */}
          <div className="card" style={{ padding: 'var(--space-8)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-6)' }}>
              {lang === 'bn' ? 'বার্তা পাঠান' : 'Send us a Message'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="input-group">
                <label className="input-label">{t.contact.nameLabel}</label>
                <input className="input" type="text" required />
              </div>
              <div className="input-group">
                <label className="input-label">{t.contact.emailLabel}</label>
                <input className="input" type="email" required />
              </div>
              <div className="input-group">
                <label className="input-label">{t.contact.messageLabel}</label>
                <textarea className="textarea" required style={{ minHeight: 150 }} />
              </div>
              <button type="submit" className="btn btn-primary btn-lg">
                {sent ? '✓ ' : ''}{t.contact.send}
              </button>
              {sent && (
                <p style={{ color: 'var(--color-success)', fontWeight: 600, textAlign: 'center' }}>
                  {lang === 'bn' ? 'বার্তা সফলভাবে পাঠানো হয়েছে!' : 'Message sent successfully!'}
                </p>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <div className="card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-6)' }}>
                {lang === 'bn' ? 'যোগাযোগের তথ্য' : 'Contact Information'}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'rgba(26, 107, 66, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>📍</div>
                  <div>
                    <h4 className="font-semibold">{t.contact.address}</h4>
                    <p className="text-sm text-muted">Dhaka, Bangladesh</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'rgba(26, 107, 66, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>📞</div>
                  <div>
                    <h4 className="font-semibold">{t.contact.phone}</h4>
                    <p className="text-sm text-muted">+880 1XXX-XXXXXX</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'rgba(26, 107, 66, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>✉️</div>
                  <div>
                    <h4 className="font-semibold">{t.contact.email}</h4>
                    <p className="text-sm text-muted">info@rafsanagro.com</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'rgba(26, 107, 66, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>🕐</div>
                  <div>
                    <h4 className="font-semibold">{t.contact.hours}</h4>
                    <p className="text-sm text-muted">{t.contact.hoursText}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
