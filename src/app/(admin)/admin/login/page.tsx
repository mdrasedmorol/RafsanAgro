'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLock, FiMail, FiEye, FiEyeOff, FiShield, FiCheckCircle, FiAlertCircle } from '@/components/animate-ui/icons';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('Mdrasedmorol@gmail.com');
  const [password, setPassword] = useState('Rashed123@');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Redirect to admin dashboard
        router.push('/admin');
        router.refresh();
      } else {
        setErrorMessage(data.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Failed to connect to authentication server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('Mdrasedmorol@gmail.com');
    setPassword('Rashed123@');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #041f15 0%, #092e20 50%, #064e3b 100%)',
        position: 'relative',
        padding: '20px',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient blur circles */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'rgba(52, 211, 153, 0.12)',
          filter: 'blur(120px)',
          borderRadius: '50%',
          animation: 'admin-orb-1 18s ease-in-out infinite alternate',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'rgba(16, 185, 129, 0.1)',
          filter: 'blur(120px)',
          borderRadius: '50%',
          animation: 'admin-orb-2 22s ease-in-out infinite alternate-reverse',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '36px 32px 28px',
            textAlign: 'center',
            background: 'linear-gradient(180deg, #091e15 0%, #0f3d2a 100%)',
            color: '#ffffff',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              padding: '8px',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
              marginBottom: '16px',
            }}
          >
            <img
              src="/images/logo.png"
              alt="Rafsan Agro"
              style={{ height: '44px', width: 'auto' }}
            />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.01em', marginBottom: '4px' }}>
            Rafsan Agro System
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#a7f3d0', fontWeight: 500 }}>
            Admin Portal Security Authentication
          </p>
        </div>

        {/* Form body */}
        <div style={{ padding: '32px' }}>
          {errorMessage && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '20px',
                color: '#991b1b',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: 600,
              }}
            >
              <FiAlertCircle size={18} style={{ flexShrink: 0, color: '#dc2626' }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  marginBottom: '8px',
                }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                  }}
                />
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.95rem',
                    color: '#0f172a',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  marginBottom: '8px',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 44px 12px 42px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.95rem',
                    color: '#0f172a',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1rem',
                border: 'none',
                cursor: isLoading ? 'wait' : 'pointer',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <FiShield size={18} /> Login to Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Box */}
          <div
            style={{
              marginTop: '24px',
              padding: '14px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              fontSize: '0.8rem',
              color: '#475569',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiCheckCircle style={{ color: '#059669' }} /> Demo Credentials
              </span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#059669',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Auto Fill
              </button>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#334155' }}>
              <div><strong>Email:</strong> Mdrasedmorol@gmail.com</div>
              <div><strong>Password:</strong> Rashed123@</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
