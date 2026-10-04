'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  FiLogOut,
  FiUser,
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
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; name?: string; role?: string } | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // If on login page, render login UI cleanly without sidebar/topbar
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setIsCheckingAuth(false);
      return;
    }

    // Read session cookie
    const getCookie = (name: string) => {
      if (typeof document === 'undefined') return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const sessionCookie = getCookie('admin_session');

    if (sessionCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(sessionCookie));
        setUser(parsed);
        setIsCheckingAuth(false);
      } catch (err) {
        setUser({ email: 'Mdrasedmorol@gmail.com', name: 'Rashed Morol', role: 'SUPER_ADMIN' });
        setIsCheckingAuth(false);
      }
    } else {
      // Check if user credentials match default demo login or redirect
      router.push('/admin/login');
      setIsCheckingAuth(false);
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/login', { method: 'DELETE' });
    } catch (err) {}
    // Clear cookies & state
    document.cookie = 'admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setUser(null);
    router.push('/admin/login');
    router.refresh();
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isCheckingAuth) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#091e15',
          color: '#34d399',
          fontWeight: 700,
        }}
      >
        Authenticating Admin Portal...
      </div>
    );
  }

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

        <div className="admin-sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link href="/" className="admin-nav-link storefront-link">
            <span className="admin-nav-icon">
              <FiGlobe size={18} />
            </span>
            <span className="admin-nav-text">View Storefront</span>
          </Link>

          <button
            onClick={handleLogout}
            className="admin-nav-link"
            style={{
              background: 'none',
              border: 'none',
              width: '100%',
              cursor: 'pointer',
              color: '#f87171',
              justifyContent: 'flex-start',
            }}
          >
            <span className="admin-nav-icon">
              <FiLogOut size={18} />
            </span>
            <span className="admin-nav-text">Logout</span>
          </button>
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

            <div className="admin-user-profile" title={user?.email || 'Mdrasedmorol@gmail.com'}>
              <div className="admin-avatar">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'RM'}
              </div>
              <div className="hide-mobile admin-user-info">
                <p className="admin-user-name">{user?.name || 'Rashed Morol'}</p>
                <p className="admin-user-role" style={{ fontSize: '10.5px', color: '#059669', fontWeight: 600 }}>
                  {user?.email || 'Mdrasedmorol@gmail.com'}
                </p>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  marginLeft: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Logout"
              >
                <FiLogOut size={16} />
              </button>
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
