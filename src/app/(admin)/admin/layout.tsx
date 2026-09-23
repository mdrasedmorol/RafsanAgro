'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/styles/admin.css';

const navSections = [
  {
    title: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: '📊' },
    ],
  },
  {
    title: 'Shop Management',
    items: [
      { href: '/admin/products', label: 'Products', icon: '📦' },
      { href: '/admin/categories', label: 'Categories', icon: '🏷️' },
      { href: '/admin/orders', label: 'Orders', icon: '🛒', badge: 3 },
    ],
  },
  {
    title: 'Finance',
    items: [
      { href: '/admin/finance', label: 'Dashboard', icon: '💰' },
      { href: '/admin/finance/income', label: 'Income', icon: '📈' },
      { href: '/admin/finance/expenses', label: 'Expenses', icon: '📉' },
      { href: '/admin/finance/cashflow', label: 'Cash Flow', icon: '💹' },
      { href: '/admin/finance/reports', label: 'Reports', icon: '📋' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} id="admin-sidebar">
        <div className="admin-sidebar-header" style={{ justifyContent: 'center', padding: '16px' }}>
          <img src="/images/logo.png" alt="Rafsan Agro" style={{ height: '52px', width: 'auto', background: '#fff', borderRadius: '10px', padding: '6px' }} />
        </div>

        <nav className="admin-sidebar-nav">
          {navSections.map((section) => (
            <div key={section.title} className="admin-nav-section">
              <div className="admin-nav-section-title">{section.title}</div>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-link ${pathname === item.href ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="admin-nav-icon">{item.icon}</span>
                  {item.label}
                  {item.badge && <span className="admin-nav-badge">{item.badge}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-nav-link" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <span className="admin-nav-icon">🌐</span>
            View Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar" id="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-hamburger"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              id="admin-hamburger"
            >
              ☰
            </button>
          </div>
          <div className="admin-topbar-right">
            <button className="admin-topbar-btn" aria-label="Notifications">
              🔔
              <span className="admin-topbar-notification-dot" />
            </button>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, var(--green-600), var(--green-500))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: 'var(--text-sm)',
                }}
              >
                AD
              </div>
              <div className="hide-mobile">
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Admin</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content page-enter">{children}</div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="overlay"
          onClick={() => setSidebarOpen(false)}
          style={{ display: 'none' }}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .admin-layout .overlay { display: block !important; }
        }
      `}</style>
    </div>
  );
}
