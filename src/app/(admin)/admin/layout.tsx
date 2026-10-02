'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiGrid,
  FiPackage,
  FiTag,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiFileText,
  FiSettings,
  FiGlobe,
  FiMenu,
  FiX,
  FiBell,
} from 'react-icons/fi';
import '@/styles/admin.css';

const navSections = [
  {
    title: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: FiGrid },
    ],
  },
  {
    title: 'Shop Management',
    items: [
      { href: '/admin/products', label: 'Products', icon: FiPackage },
      { href: '/admin/categories', label: 'Categories', icon: FiTag },
      { href: '/admin/orders', label: 'Orders', icon: FiShoppingCart, badge: 3 },
    ],
  },
  {
    title: 'Finance',
    items: [
      { href: '/admin/finance', label: 'Dashboard', icon: FiDollarSign },
      { href: '/admin/finance/income', label: 'Income', icon: FiTrendingUp },
      { href: '/admin/finance/expenses', label: 'Expenses', icon: FiTrendingDown },
      { href: '/admin/finance/cashflow', label: 'Cash Flow', icon: FiActivity },
      { href: '/admin/finance/reports', label: 'Reports', icon: FiFileText },
    ],
  },
  {
    title: 'Settings',
    items: [
      { href: '/admin/settings', label: 'Settings', icon: FiSettings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      {/* Soft Ambient Minimalist Background */}
      <div className="liquid-mesh-container" aria-hidden="true">
        <div className="liquid-orb liquid-orb-1" />
        <div className="liquid-orb liquid-orb-2" />
      </div>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} id="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/images/logo.png"
              alt="Rafsan Agro"
              style={{
                height: '40px',
                width: 'auto',
                background: '#ffffff',
                borderRadius: '8px',
                padding: '4px',
              }}
            />
            <div className="admin-brand-text">
              <span className="brand-title">Rafsan Agro</span>
              <span className="brand-badge">ADMIN</span>
            </div>
          </Link>
          <button
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {navSections.map((section) => (
            <div key={section.title} className="admin-nav-section">
              <div className="admin-nav-section-title">{section.title}</div>
              {section.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="admin-nav-icon">
                      <IconComponent size={18} />
                    </span>
                    <span className="admin-nav-text">{item.label}</span>
                    {item.badge && <span className="admin-nav-badge">{item.badge}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-nav-link storefront-link">
            <span className="admin-nav-icon">
              <FiGlobe size={18} />
            </span>
            <span className="admin-nav-text">View Storefront</span>
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
              aria-label="Toggle navigation"
            >
              <FiMenu size={22} />
            </button>
            <div className="admin-topbar-title-wrapper">
              <span className="admin-topbar-context">Rafsan Agro System</span>
            </div>
          </div>

          <div className="admin-topbar-right">
            <button className="admin-topbar-btn" aria-label="Notifications">
              <FiBell size={18} />
              <span className="admin-topbar-notification-dot" />
            </button>

            <div className="admin-user-profile">
              <div className="admin-avatar">AD</div>
              <div className="hide-mobile admin-user-info">
                <p className="admin-user-name">Admin User</p>
                <p className="admin-user-role">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content page-enter">{children}</div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

