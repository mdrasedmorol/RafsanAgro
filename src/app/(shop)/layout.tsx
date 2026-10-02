'use client';

import React from 'react';
import { I18nProvider } from '@/lib/i18n';
import ShopHeader from '@/components/shop/ShopHeader';
import ShopFooter from '@/components/shop/ShopFooter';
import CartDrawer from '@/components/shop/CartDrawer';
import '@/styles/shop.css';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <div className="shop-layout">
        {/* Ambient Liquid Canvas Background */}
        <div className="liquid-mesh-container" aria-hidden="true">
          <div className="liquid-orb liquid-orb-1" />
          <div className="liquid-orb liquid-orb-2" />
          <div className="liquid-orb liquid-orb-3" />
          <div className="liquid-orb liquid-orb-4" />
        </div>
        <ShopHeader />
        <main>{children}</main>
        <ShopFooter />
        <CartDrawer />
      </div>
    </I18nProvider>
  );
}
