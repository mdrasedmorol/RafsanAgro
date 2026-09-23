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
        <ShopHeader />
        <main>{children}</main>
        <ShopFooter />
        <CartDrawer />
      </div>
    </I18nProvider>
  );
}
