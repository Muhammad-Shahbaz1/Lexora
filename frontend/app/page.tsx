'use client';

import Link from 'next/link';
import { Scale, ShieldCheck, Zap, FileText, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const features = [
  {
    icon: FileText,
    title: 'Bilingual Summary',
    desc: 'Get a clear plain English and Roman Urdu summary of your entire contract — no legal jargon.',
    color: 'var(--color-gold)',
    bg: 'var(--color-gold-dim)',
  },
  {
    icon: AlertTriangle,
    title: 'Risk Radar',
    desc: 'AI highlights dangerous clauses with severity ratings — High, Medium, or Low — before you sign.',
    color: 'var(--color-risk-high)',
    bg: 'var(--color-risk-high-bg)',
  },
  {
    icon: Lightbulb,
    title: 'Negotiation Tips',
    desc: 'Get 3–5 smart, actionable questions to ask before signing any contract.',
    color: 'var(--color-teal)',
    bg: 'var(--color-teal-dim)',
  },
  {
    icon: ShieldCheck,
    title: 'Key Clause Breakdown',
    desc: 'Every important clause explained in simple language. Know exactly what you\'re agreeing to.',
    color: 'hsl(260, 75%, 68%)',
    bg: 'rgba(139, 92, 246, 0.12)',
  },
];

const steps = [
  { num: '01', title: 'Upload Your Contract', desc: 'Upload a PDF or image of your rent agreement, job offer, or business contract.' },
  { num: '02', title: 'AI Analysis Runs', desc: 'Lexora\'s Gemini AI reads every clause and identifies risks in seconds.' },
  { num: '03', title: 'Understand & Decide', desc: 'Review the bilingual summary, risk flags, and negotiation tips — then sign with confidence.' },
];

const supportedTypes = [
  { label: 'Rent Agreement', emoji: '🏠' },
  { label: 'Job Offer Letter', emoji: '💼' },
  { label: 'Business Contract', emoji: '🤝' },
  { label: 'NDA / Confidentiality', emoji: '🔒' },
  { label: 'Service Agreement', emoji: '📋' },
  { label: 'Vendor Contract', emoji: '📦' },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      <Navbar />

      {/* ── Hero Section ── */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(32px, 5vw, 56px) 24px clamp(48px, 6vw, 80px)',
        textAlign: 'center',
      }}>
        {/* Background glow blobs */}
        <div style={{
          position: 'absolute', top: '-120px', left: '50%',
          transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(245,197,65,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '15%',
          width: '300px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(38,198,175,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container-narrow page-enter" style={{ position: 'relative' }}>
          {/* Tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px',
            background: 'var(--color-gold-dim)',
            border: '1px solid rgba(245,197,65,0.2)',
            borderRadius: '99px',
            marginBottom: '20px',
          }}>
            <Scale size={13} color="var(--color-gold)" />
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-gold)', letterSpacing: '0.04em' }}>
              AI-POWERED LEGAL ASSISTANT
            </span>
          </div>

          {/* Main headline */}
          <h1 style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(38px, 6vw, 68px)',
            fontWeight: '800',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            marginBottom: '24px',
            color: 'var(--color-text-primary)',
          }}>
            Understand Your Legal <br />
            <span className="gradient-text">Contracts Before You Sign</span>
          </h1>

          {/* Subheadline */}
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.7',
            maxWidth: '560px',
            margin: '0 auto 40px',
          }}>
            Upload any contract. Lexora AI instantly breaks it down in <strong style={{ color: 'var(--color-text-primary)' }}>plain English and Roman Urdu</strong> — flagging risks and helping you negotiate like a pro.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href={user ? '/analyze' : '/auth/register'}
              className="btn btn-primary"
              style={{ fontSize: '15px', padding: '14px 28px', gap: '8px' }}
            >
              Analyze a Contract Free
              <ArrowRight size={16} />
            </Link>
            <Link
              href={user ? '/dashboard' : '/auth/login'}
              className="btn btn-secondary"
              style={{ fontSize: '15px', padding: '14px 28px' }}
            >
              {user ? 'My Dashboard' : 'Log In'}
            </Link>
          </div>

          {/* Trust signals */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '20px', marginTop: '40px', flexWrap: 'wrap',
          }}>
            {['PDF & Image support', 'Gemini AI powered', 'Roman Urdu summary'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={13} color="var(--color-risk-low)" />
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Supported Contract Types ── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div className="container-wide">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
          }}>
            {supportedTypes.map((type) => (
              <div key={type.label} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '22px' }}>{type.emoji}</span>
                <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-secondary)' }}>{type.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 24px' }}>
        <div className="container-wide">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              marginBottom: '16px',
            }}>
              Everything You Need to Understand Any Contract
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>
              Lexora&apos;s AI doesn&apos;t just translate legal text — it actively protects you from unfair terms.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}>
            {features.map((f) => (
              <div key={f.title} className="card" style={{ padding: '28px' }}>
                <div style={{
                  width: '48px', height: '48px',
                  background: f.bg,
                  borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  <f.icon size={22} color={f.color} />
                </div>
                <h3 style={{
                  fontSize: '17px', fontWeight: '700',
                  color: 'var(--color-text-primary)',
                  marginBottom: '10px',
                }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.65' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 24px', background: 'var(--color-bg-secondary)' }}>
        <div className="container-wide">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              marginBottom: '14px',
            }}>
              How Lexora Works
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '17px' }}>
              From upload to full analysis in under 30 seconds.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
          }}>
            {steps.map((step) => (
              <div key={step.num} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  fontSize: '48px',
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: '800',
                  color: 'var(--color-gold-dim)',
                  lineHeight: '1',
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.65' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) 24px', textAlign: 'center' }}>
        <div className="container-narrow">
          <div style={{
            padding: 'clamp(48px, 6vw, 72px) clamp(32px, 5vw, 64px)',
            background: 'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-tertiary))',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-60px', right: '-60px',
              width: '220px', height: '220px',
              background: 'radial-gradient(circle, rgba(245,197,65,0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <Scale size={40} color="var(--color-gold)" style={{ marginBottom: '20px' }} />
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(26px, 4vw, 38px)',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              marginBottom: '16px',
            }}>
              Stop Signing Blind.<br />Start Understanding.
            </h2>
            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: '16px',
              marginBottom: '32px',
              maxWidth: '420px',
              margin: '0 auto 32px',
            }}>
              Join thousands of people who use Lexora to protect themselves from unfair contracts.
            </p>
            <Link
              href={user ? '/analyze' : '/auth/register'}
              className="btn btn-primary"
              style={{ fontSize: '15px', padding: '14px 32px', gap: '8px' }}
            >
              <Zap size={16} />
              Analyze Your First Contract Free
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
