'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n';
import { ShieldCheck, Truck, UserRound, DollarSign, Sparkles, Eye } from '@/components/animate-ui/icons';

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="page-enter">
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--green-800), var(--green-700))',
        padding: 'var(--space-16) 0',
        textAlign: 'center',
        color: 'white',
      }}>
        <div className="container">
          <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, color: 'white', marginBottom: 'var(--space-4)' }}>
            {t.about.title}
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', opacity: 0.8, maxWidth: 600, margin: '0 auto' }}>
            {t.about.description}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-16) var(--container-padding)' }}>
        {/* Mission & Vision */}
        <div className="grid-2" style={{ gap: 'var(--space-8)', marginBottom: 'var(--space-16)' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--green-600)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Sparkles size={24} className="text-emerald-600" animateOnHover />
              <span>{t.about.mission}</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
              {t.about.missionText}
            </p>
          </div>
          <div className="card" style={{ borderLeft: '4px solid var(--gold-400)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Eye size={24} className="text-amber-500" animateOnHover />
              <span>{t.about.vision}</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
              {t.about.visionText}
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          {t.about.whyUs}
        </h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-card-icon flex items-center justify-center">
              <ShieldCheck size={36} className="text-emerald-600" animateOnHover />
            </div>
            <h3 className="feature-card-title">{t.about.quality}</h3>
            <p className="feature-card-desc">{t.about.qualityText}</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon flex items-center justify-center">
              <Truck size={36} className="text-emerald-600" animateOnHover />
            </div>
            <h3 className="feature-card-title">{t.about.delivery}</h3>
            <p className="feature-card-desc">{t.about.deliveryText}</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon flex items-center justify-center">
              <UserRound size={36} className="text-emerald-600" animateOnHover />
            </div>
            <h3 className="feature-card-title">{t.about.support}</h3>
            <p className="feature-card-desc">{t.about.supportText}</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon flex items-center justify-center">
              <DollarSign size={36} className="text-emerald-600" animateOnHover />
            </div>
            <h3 className="feature-card-title">{t.about.affordable}</h3>
            <p className="feature-card-desc">{t.about.affordableText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
