'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scale, LogOut, LayoutDashboard, Upload, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
      toast.success('Logged out successfully');
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="navbar">
      <div className="container-wide">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'var(--color-gold)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(245,197,65,0.3)',
            }}>
              <Scale size={20} color="hsl(222, 47%, 7%)" strokeWidth={2.5} />
            </div>
            <span style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '22px',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.01em',
            }}>
              Lexora
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden-mobile">
            {user ? (
              <>
                <Link href="/dashboard" className="btn btn-ghost" style={{ fontSize: '14px', padding: '8px 16px' }}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <Link href="/analyze" className="btn btn-ghost" style={{ fontSize: '14px', padding: '8px 16px' }}>
                  <Upload size={16} />
                  Analyze
                </Link>
                <div style={{ width: '1px', height: '20px', background: 'var(--color-border)', margin: '0 4px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px', height: '32px',
                    background: 'var(--color-gold-dim)',
                    border: '1px solid rgba(245,197,65,0.25)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: '700',
                    color: 'var(--color-gold)',
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{user.name}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-ghost" style={{ fontSize: '14px', padding: '8px 14px' }}>
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-ghost" style={{ fontSize: '14px', padding: '8px 18px' }}>
                  Log In
                </Link>
                <Link href="/auth/register" className="btn btn-primary" style={{ fontSize: '14px', padding: '9px 20px' }}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="btn btn-ghost show-mobile"
            style={{ padding: '8px', width: '40px', height: '40px' }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{
            padding: '16px 0 20px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            {user ? (
              <>
                <Link href="/dashboard" className="btn btn-ghost" onClick={() => setMobileOpen(false)}>
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <Link href="/analyze" className="btn btn-ghost" onClick={() => setMobileOpen(false)}>
                  <Upload size={16} /> Analyze Contract
                </Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="btn btn-danger">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-secondary" onClick={() => setMobileOpen(false)}>Log In</Link>
                <Link href="/auth/register" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
