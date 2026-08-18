'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scale, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (k: string, v: string) => {
    setForm({ ...form, [k]: v });
    setErrors({ ...errors, [k]: '' });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name.trim(), form.email, form.password);
      toast.success('Account created! Welcome to Lexora 🎉');
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed. Try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2 : 3;

  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];
  const strengthColors = ['', 'var(--color-risk-high)', 'var(--color-risk-medium)', 'var(--color-risk-low)'];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '-200px', right: '-100px',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(38,198,175,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="page-enter" style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '24px' }}>
            <div style={{
              width: '44px', height: '44px',
              background: 'var(--color-gold)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 28px rgba(245,197,65,0.35)',
            }}>
              <Scale size={22} color="hsl(222, 47%, 7%)" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'var(--font-playfair)', fontSize: '26px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
              Lexora
            </span>
          </Link>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
            Create your account
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
            Start understanding your contracts today — free
          </p>
        </div>

        {/* Form Card */}
        <div className="card" style={{ padding: '36px' }}>
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="label">Full Name</label>
              <input
                id="name" type="text" className={`input ${errors.name ? 'error' : ''}`}
                placeholder="Your full name"
                value={form.name} onChange={(e) => update('name', e.target.value)}
                autoComplete="name" disabled={loading}
              />
              {errors.name && <p style={{ fontSize: '12px', color: 'var(--color-risk-high)', marginTop: '6px' }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="label">Email address</label>
              <input
                id="reg-email" type="email" className={`input ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                value={form.email} onChange={(e) => update('email', e.target.value)}
                autoComplete="email" disabled={loading}
              />
              {errors.email && <p style={{ fontSize: '12px', color: 'var(--color-risk-high)', marginTop: '6px' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password" type={showPass ? 'text' : 'password'}
                  className={`input ${errors.password ? 'error' : ''}`}
                  placeholder="At least 6 characters"
                  value={form.password} onChange={(e) => update('password', e.target.value)}
                  style={{ paddingRight: '44px' }} autoComplete="new-password" disabled={loading}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px',
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength indicator */}
              {form.password.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '5px' }}>
                    {[1, 2, 3].map((level) => (
                      <div key={level} style={{
                        flex: 1, height: '3px', borderRadius: '99px',
                        background: passwordStrength >= level ? strengthColors[passwordStrength] : 'var(--color-border)',
                        transition: 'background 0.3s ease',
                      }} />
                    ))}
                  </div>
                  <p style={{ fontSize: '11px', color: strengthColors[passwordStrength] }}>{strengthLabels[passwordStrength]}</p>
                </div>
              )}
              {errors.password && <p style={{ fontSize: '12px', color: 'var(--color-risk-high)', marginTop: '4px' }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm" className="label">Confirm Password</label>
              <input
                id="confirm" type="password" className={`input ${errors.confirm ? 'error' : ''}`}
                placeholder="Re-enter your password"
                value={form.confirm} onChange={(e) => update('confirm', e.target.value)}
                autoComplete="new-password" disabled={loading}
              />
              {!errors.confirm && form.confirm && form.password === form.confirm && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
                  <CheckCircle2 size={12} color="var(--color-risk-low)" />
                  <p style={{ fontSize: '12px', color: 'var(--color-risk-low)' }}>Passwords match</p>
                </div>
              )}
              {errors.confirm && <p style={{ fontSize: '12px', color: 'var(--color-risk-high)', marginTop: '6px' }}>{errors.confirm}</p>}
            </div>

            {/* Terms note */}
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              By creating an account, you agree that Lexora AI is for informational purposes and does not constitute legal advice.
            </p>

            {/* Submit */}
            <button
              type="submit" className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '13px', fontSize: '15px' }}
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Creating account...</>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
              Already have an account?{' '}
              <Link href="/auth/login" style={{ color: 'var(--color-gold)', textDecoration: 'none', fontWeight: '600' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/" style={{ fontSize: '13px', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
            ← Back to home
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.7s linear infinite; }
      `}</style>
    </div>
  );
}
