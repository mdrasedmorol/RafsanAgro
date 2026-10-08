'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useCartStore } from '@/stores/cart-store';

import { ShoppingCart, Menu, X } from '@/components/animate-ui/icons';

export default function ShopHeader() {
  const { t, lang, toggleLang } = useI18n();
  const pathname = usePathname();
  const cartItems = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.openCart);
  const [mounted, setMounted] = React.useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? cartItems.reduce((sum, i) => sum + i.quantity, 0) : 0;

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="shop-header" id="shop-header">
      <div className="shop-header-inner">
        {/* Logo */}
        <Link href="/" className="shop-logo" id="logo-link">
          <img src="/images/logo.png" alt="Rafsan Agro" style={{ height: '54px', width: 'auto', objectFit: 'contain' }} />
        </Link>

        {/* Navigation */}
        <nav className={`shop-nav ${mobileOpen ? 'mobile-open' : ''}`} id="main-nav">
          <Link href="/" className={`shop-nav-link ${isActive('/') ? 'active' : ''}`} id="nav-home">
            {t.common.home}
          </Link>
          <Link href="/products" className={`shop-nav-link ${isActive('/products') ? 'active' : ''}`} id="nav-products">
            {t.common.products}
          </Link>
          <Link href="/blog" className={`shop-nav-link ${isActive('/blog') ? 'active' : ''}`} id="nav-blog">
            {t.common.blog}
          </Link>
          <Link href="/about" className={`shop-nav-link ${isActive('/about') ? 'active' : ''}`} id="nav-about">
            {t.common.about}
          </Link>
          <Link href="/contact" className={`shop-nav-link ${isActive('/contact') ? 'active' : ''}`} id="nav-contact">
            {t.common.contact}
          </Link>
        </nav>

        {/* Actions */}
        <div className="shop-header-actions">
          {/* Language Toggle */}
          <button
            className="lang-toggle"
            onClick={toggleLang}
            id="lang-toggle"
            aria-label="Toggle language"
          >
            <span className={`lang-option ${lang === 'en' ? 'active' : ''}`}>EN</span>
            <span className={`lang-option ${lang === 'bn' ? 'active' : ''}`}>বাং</span>
          </button>

          {/* Cart */}
          <button
            className="cart-btn flex items-center justify-center"
            onClick={openCart}
            id="cart-btn"
            aria-label="Open cart"
          >
            <ShoppingCart animateOnHover size={22} />
            {totalItems > 0 && (
              <span className="cart-count" id="cart-count">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu */}
          <button
            className="mobile-menu-btn flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            id="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} animateOnHover /> : <Menu size={20} animateOnHover />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileOpen && (
        <nav className="mobile-nav" style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-light)',
          padding: 'var(--space-4) var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
        }}>
          <Link href="/" className={`shop-nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>{t.common.home}</Link>
          <Link href="/products" className={`shop-nav-link ${isActive('/products') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>{t.common.products}</Link>
          <Link href="/blog" className={`shop-nav-link ${isActive('/blog') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>{t.common.blog}</Link>
          <Link href="/about" className={`shop-nav-link ${isActive('/about') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>{t.common.about}</Link>
          <Link href="/contact" className={`shop-nav-link ${isActive('/contact') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>{t.common.contact}</Link>
        </nav>
      )}
    </header>
  );
}
