'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useSiteSettings } from '@/stores/settings-store';
import { Facebook, Youtube, MessageCircle, MapPin, Phone, Mail, Clock } from '@/components/animate-ui/icons';

export default function ShopFooter() {
  const { t } = useI18n();
  const { settings } = useSiteSettings();

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
              <a href="#" className="footer-social-link flex items-center justify-center" aria-label="Facebook">
                <Facebook size={18} animateOnHover />
              </a>
              <a href="#" className="footer-social-link flex items-center justify-center" aria-label="YouTube">
                <Youtube size={18} animateOnHover />
              </a>
              <a href="#" className="footer-social-link flex items-center justify-center" aria-label="WhatsApp">
                <MessageCircle size={18} animateOnHover />
              </a>
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

          {/* Contact & Map */}
          <div>
            <h4 className="footer-section-title">{t.contact.title}</h4>
            <div>
              <div className="footer-contact-item flex items-center gap-2">
                <span className="footer-contact-icon flex items-center justify-center">
                  <MapPin size={16} animateOnHover />
                </span>
                <span>{settings.address || 'Dhaka, Bangladesh'}</span>
              </div>
              <div className="footer-contact-item flex items-center gap-2">
                <span className="footer-contact-icon flex items-center justify-center">
                  <Phone size={16} animateOnHover />
                </span>
                <span>{settings.phone || '+880 1XXX-XXXXXX'}</span>
              </div>
              <div className="footer-contact-item flex items-center gap-2">
                <span className="footer-contact-icon flex items-center justify-center">
                  <Mail size={16} animateOnHover />
                </span>
                <span>{settings.email || 'info@rafsanagro.com'}</span>
              </div>
              <div className="footer-contact-item flex items-center gap-2">
                <span className="footer-contact-icon flex items-center justify-center">
                  <Clock size={16} animateOnHover />
                </span>
                <span>{t.contact.hoursText}</span>
              </div>

              {/* Nursery Map Widget */}
              <div style={{ marginTop: '14px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.15)', height: '130px' }}>
                <iframe
                  title="Footer Nursery Location Map"
                  width="100%"
                  height="130"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent((settings.address || 'Bazaar Road, Rangpur Sadar, Rangpur') + ', Bangladesh')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">{t.footer.copyright}</p>
          <div className="footer-payment-section">
            <span className="footer-payment-title">{t.footer.payWith}</span>
            <div className="footer-payment-card">
              <img
                src="/images/payment-methods.png"
                alt="We Accept Payment With bKash, Nagad, Rocket"
                className="footer-payment-img"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
