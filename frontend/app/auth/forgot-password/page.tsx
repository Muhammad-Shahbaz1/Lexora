'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scale, ArrowRight, Loader2, KeyRound, CheckCircle2, ShieldCheck } from 'lucide-react';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Email, Step 2: Code + New Password
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; code?: string; password?: string; confirm?: string }>({});

  // Step 1: Request Reset Code
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrors({ email: 'Please enter your registered email address' });
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword({ email });
      toast.success('Reset code generated successfully! Check below.');
      if (res.data.resetCode) {
        setResetCode(res.data.resetCode); // Auto-fill for convenience
      }
      setStep(2);
      setErrors({});
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to request reset code. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password with Code
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!resetCode.trim()) errs.code = 'Verification code is required';
    if (!newPassword) errs.password = 'New password is required';
    else if (newPassword.length < 6) errs.password = 'Password must be at least 6 characters';
    if (newPassword !== confirmPassword) errs.confirm = 'Passwords do not match';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.resetPassword({
        email,
        resetCode: resetCode.trim(),
        newPassword,
      });

      if (res.data.token && typeof window !== 'undefined') {
        localStorage.setItem('lexora_auth_token', res.data.token);
      }

      toast.success('Password updated successfully! Welcome back 🎉');
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Password reset failed. Invalid or expired code.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(245,197,65,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="page-enter" style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                background: 'var(--color-gold)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 24px rgba(245,197,65,0.3)',
              }}
            >
              <Scale size={22} color="hsl(222, 47%, 7%)" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '24px',
                fontWeight: '800',
                color: 'var(--color-text-primary)',
              }}
            >
              Lexora
            </span>
          </Link>
          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '26px',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              marginBottom: '6px',
            }}
          >
            {step === 1 ? 'Forgot Password?' : 'Reset Password'}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            {step === 1
              ? 'Enter your email to receive a 6-digit reset code'
              : 'Enter the verification code and set your new password'}
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '32px' }}>
          {step === 1 ? (
            /* ── Step 1: Request Code ── */
            <form onSubmit={handleRequestCode} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label htmlFor="reset-email" className="label">
                  Registered Email Address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  className={`input ${errors.email ? 'error' : ''}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: '' });
                  }}
                  autoComplete="email"
                  disabled={loading}
                />
                {errors.email && (
                  <p style={{ fontSize: '12px', color: 'var(--color-risk-high)', marginTop: '6px' }}>
                    {errors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '13px', fontSize: '15px' }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Generating Code...
                  </>
                ) : (
                  <>
                    Send Reset Code <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ── Step 2: Enter Code + Set New Password ── */
            <form onSubmit={handleResetPassword} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Reset Code */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label htmlFor="reset-code" className="label" style={{ margin: 0 }}>
                    6-Digit Verification Code
                  </label>
                  <span style={{ fontSize: '11px', color: 'var(--color-gold)', fontWeight: '600' }}>
                    Valid for 15 mins
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reset-code"
                    type="text"
                    maxLength={6}
                    className={`input ${errors.code ? 'error' : ''}`}
                    placeholder="123456"
                    value={resetCode}
                    onChange={(e) => {
                      setResetCode(e.target.value);
                      setErrors({ ...errors, code: '' });
                    }}
                    style={{ letterSpacing: '0.25em', textAlign: 'center', fontSize: '18px', fontWeight: '700' }}
                    disabled={loading}
                  />
                  <KeyRound
                    size={16}
                    color="var(--color-text-muted)"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
                {errors.code && (
                  <p style={{ fontSize: '12px', color: 'var(--color-risk-high)', marginTop: '6px' }}>
                    {errors.code}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="new-password" className="label">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  className={`input ${errors.password ? 'error' : ''}`}
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setErrors({ ...errors, password: '' });
                  }}
                  autoComplete="new-password"
                  disabled={loading}
                />
                {errors.password && (
                  <p style={{ fontSize: '12px', color: 'var(--color-risk-high)', marginTop: '6px' }}>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label htmlFor="confirm-new-password" className="label">
                  Confirm New Password
                </label>
                <input
                  id="confirm-new-password"
                  type="password"
                  className={`input ${errors.confirm ? 'error' : ''}`}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors({ ...errors, confirm: '' });
                  }}
                  autoComplete="new-password"
                  disabled={loading}
                />
                {!errors.confirm && confirmPassword && newPassword === confirmPassword && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
                    <CheckCircle2 size={12} color="var(--color-risk-low)" />
                    <p style={{ fontSize: '12px', color: 'var(--color-risk-low)' }}>Passwords match</p>
                  </div>
                )}
                {errors.confirm && (
                  <p style={{ fontSize: '12px', color: 'var(--color-risk-high)', marginTop: '6px' }}>
                    {errors.confirm}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '13px', fontSize: '15px' }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Updating Password...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} /> Reset Password & Sign In
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-ghost"
                style={{ fontSize: '13px', padding: '8px' }}
              >
                ← Back to email input
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
              Remember your password?{' '}
              <Link
                href="/auth/login"
                style={{ color: 'var(--color-gold)', textDecoration: 'none', fontWeight: '600' }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/" style={{ fontSize: '13px', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
            ← Back to home
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 0.7s linear infinite;
        }
      `}</style>
    </div>
  );
}
