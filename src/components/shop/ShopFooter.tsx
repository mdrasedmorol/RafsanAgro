'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function ShopFooter() {
  const { t } = useI18n();

  return (
    <footer className="shop-footer" id="shop-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-brand-name" style={{ marginBottom: '16px' }}>
              <img src="/images/logo.png" alt="Rafsan Agro" style={{ height: '52px', width: 'auto', background: '#fff', padding: '6px', borderRadius: '10px' }} />
            </div>
            <p className="footer-brand-desc">
              {t.about.description}
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social-link" aria-label="Facebook">📘</a>
              <a href="#" className="footer-social-link" aria-label="YouTube">📺</a>
              <a href="#" className="footer-social-link" aria-label="WhatsApp">💬</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-section-title">{t.footer.quickLinks}</h4>
            <div className="footer-links">
              <Link href="/" className="footer-link">{t.common.home}</Link>
              <Link href="/products" className="footer-link">{t.common.products}</Link>
              <Link href="/categories" className="footer-link">{t.common.categories}</Link>
              <Link href="/about" className="footer-link">{t.common.about}</Link>
              <Link href="/contact" className="footer-link">{t.common.contact}</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="footer-section-title">{t.footer.support}</h4>
            <div className="footer-links">
              <Link href="/track-order" className="footer-link">{t.order.trackOrder}</Link>
              <Link href="#" className="footer-link">{t.footer.returnPolicy}</Link>
              <Link href="#" className="footer-link">{t.footer.faq}</Link>
              <Link href="#" className="footer-link">{t.footer.privacyPolicy}</Link>
              <Link href="#" className="footer-link">{t.footer.termsOfService}</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-section-title">{t.contact.title}</h4>
            <div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">📍</span>
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">📞</span>
                <span>+880 1XXX-XXXXXX</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">✉️</span>
                <span>info@rafsanagro.com</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">🕐</span>
                <span>{t.contact.hoursText}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">{t.footer.copyright}</p>
          <div className="footer-payment-methods">
            <span className="footer-payment-badge">💳 bKash</span>
            <span className="footer-payment-badge">💳 Nagad</span>
            <span className="footer-payment-badge">💵 COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
