'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AlertTriangle, Lightbulb, FileText, Scale, ArrowLeft,
  CheckCircle2, XCircle, Clock, RotateCcw, ChevronDown,
  ChevronUp, ShieldCheck, Languages,
} from 'lucide-react';
import { contractsAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

interface Contract {
  _id: string;
  title: string;
  category: string;
  status: 'pending' | 'analyzing' | 'done' | 'error';
  fileUrl: string;
  fileType: string;
  mimeType: string;
  createdAt: string;
  errorMessage?: string;
  analysis?: {
    summary: { english: string; romanUrdu: string };
    riskFlags: { title: string; description: string; severity: 'low' | 'medium' | 'high' }[];
    keyClauses: { clause: string; explanation: string }[];
    negotiationTips: string[];
    overallRiskLevel: 'low' | 'medium' | 'high' | 'unknown';
    disclaimer: string;
  };
}

const TABS = [
  { id: 'summary', label: 'Summary', icon: Languages },
  { id: 'risks', label: 'Risk Radar', icon: AlertTriangle },
  { id: 'clauses', label: 'Key Clauses', icon: FileText },
  { id: 'negotiate', label: 'Negotiation Tips', icon: Lightbulb },
];

const severityConfig = {
  high: { label: 'HIGH RISK', color: 'var(--color-risk-high)', bg: 'var(--color-risk-high-bg)', border: 'rgba(239,68,68,0.25)' },
  medium: { label: 'MEDIUM RISK', color: 'var(--color-risk-medium)', bg: 'var(--color-risk-medium-bg)', border: 'rgba(245,158,11,0.25)' },
  low: { label: 'LOW RISK', color: 'var(--color-risk-low)', bg: 'var(--color-risk-low-bg)', border: 'rgba(34,197,94,0.25)' },
};

function ExpandableClause({ clause, explanation }: { clause: string; explanation: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '14px 18px',
          background: 'var(--color-bg-secondary)',
          border: 'none', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: '12px',
          textAlign: 'left',
        }}
      >
        <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)', lineHeight: '1.5', flex: 1 }}>
          {clause}
        </p>
        {open ? <ChevronUp size={16} color="var(--color-text-muted)" /> : <ChevronDown size={16} color="var(--color-text-muted)" />}
      </button>
      {open && (
        <div style={{ padding: '14px 18px', background: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.65' }}>
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  const [urduMode, setUrduMode] = useState(false);

  const fetchContract = useCallback(async () => {
    try {
      const res = await contractsAPI.getOne(id);
      setContract(res.data.data);
    } catch {
      toast.error('Contract not found');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => { fetchContract(); }, [fetchContract]);

  // Poll while analyzing
  useEffect(() => {
    if (!contract || contract.status === 'done' || contract.status === 'error') return;
    const interval = setInterval(fetchContract, 4000);
    return () => clearInterval(interval);
  }, [contract, fetchContract]);

  const handleReanalyze = async () => {
    try {
      await contractsAPI.reanalyze(id);
      setContract((c) => c ? { ...c, status: 'analyzing', analysis: undefined } : c);
      toast.success('Re-analysis started');
    } catch {
      toast.error('Re-analysis failed');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px', width: '32px', height: '32px' }} />
          <p style={{ color: 'var(--color-text-muted)' }}>Loading contract...</p>
        </div>
      </div>
    );
  }

  if (!contract) return null;

  const { analysis, status } = contract;
  const riskLevel = analysis?.overallRiskLevel || 'unknown';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      <Navbar />

      <div className="container-wide page-enter" style={{ padding: '32px 24px 80px' }}>
        {/* Back link */}
        <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-muted)', textDecoration: 'none', marginBottom: '24px' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        {/* Contract header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: '20px', marginBottom: '32px', flexWrap: 'wrap',
        }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '10px' }}>
              {contract.title}
            </h1>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                {contract.category.charAt(0).toUpperCase() + contract.category.slice(1)} ·{' '}
                {new Date(contract.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              {status === 'done' && riskLevel !== 'unknown' && (
                <span className={`badge badge-${riskLevel}`}>
                  Overall: {riskLevel} risk
                </span>
              )}
            </div>
          </div>

          {status === 'error' && (
            <button onClick={handleReanalyze} className="btn btn-secondary" style={{ gap: '8px' }}>
              <RotateCcw size={15} /> Re-analyze
            </button>
          )}
        </div>

        {/* Split layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)',
          gap: '24px',
          alignItems: 'start',
        }} className="results-grid">
          {/* LEFT — Document preview */}
          <div className="card" style={{ overflow: 'hidden', position: 'sticky', top: '80px' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={15} color="var(--color-text-muted)" />
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Original Document</span>
            </div>
            <div style={{ padding: '20px' }}>
              {contract.mimeType === 'application/pdf' ? (
                <iframe
                  src={`${contract.fileUrl}#toolbar=0`}
                  style={{ width: '100%', height: '560px', border: 'none', borderRadius: 'var(--radius-md)', background: '#fff' }}
                  title="Contract PDF"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={contract.fileUrl}
                  alt="Contract document"
                  style={{ width: '100%', borderRadius: 'var(--radius-md)', objectFit: 'contain', maxHeight: '560px' }}
                />
              )}
            </div>
          </div>

          {/* RIGHT — Analysis results */}
          <div>
            {/* Analyzing state */}
            {(status === 'analyzing' || status === 'pending') && (
              <div className="card" style={{ padding: '48px 32px', textAlign: 'center' }}>
                <div style={{ position: 'relative', width: '64px', height: '64px', margin: '0 auto 24px' }}>
                  <div className="spinner" style={{ width: '64px', height: '64px', borderWidth: '3px' }} />
                  <Scale size={24} color="var(--color-gold)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '12px' }}>
                  AI is analyzing your contract...
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '320px', margin: '0 auto' }}>
                  Lexora Gemini AI is reading every clause, identifying risks, and preparing your analysis. This usually takes 10–30 seconds.
                </p>
                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '6px' }}>
                  {['Reading clauses', 'Identifying risks', 'Generating summary'].map((step, i) => (
                    <div key={step} style={{
                      padding: '5px 12px', borderRadius: '99px',
                      background: 'var(--color-bg-tertiary)',
                      border: '1px solid var(--color-border)',
                      fontSize: '11px', color: 'var(--color-text-muted)',
                      animation: `pulse-gold 2s ease-in-out ${i * 0.4}s infinite`,
                    }}>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error state */}
            {status === 'error' && (
              <div className="card" style={{ padding: '40px 32px', textAlign: 'center' }}>
                <XCircle size={44} color="var(--color-risk-high)" style={{ margin: '0 auto 18px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '10px' }}>Analysis Failed</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                  {contract.errorMessage || 'An error occurred during analysis.'}
                </p>
                <button onClick={handleReanalyze} className="btn btn-primary">
                  <RotateCcw size={16} /> Try Again
                </button>
              </div>
            )}

            {/* Done state — Full analysis */}
            {status === 'done' && analysis && (
              <div>
                {/* Overall Risk Banner */}
                {riskLevel !== 'unknown' && (
                  <div style={{
                    padding: '14px 20px',
                    background: severityConfig[riskLevel as keyof typeof severityConfig]?.bg || 'var(--color-bg-tertiary)',
                    border: `1px solid ${severityConfig[riskLevel as keyof typeof severityConfig]?.border || 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    marginBottom: '20px',
                  }}>
                    <ShieldCheck size={20} color={severityConfig[riskLevel as keyof typeof severityConfig]?.color || 'var(--color-text-muted)'} />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.06em', color: severityConfig[riskLevel as keyof typeof severityConfig]?.color || 'var(--color-text-primary)' }}>
                        OVERALL RISK: {riskLevel.toUpperCase()}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        {riskLevel === 'high' ? 'Several concerning clauses found. Review carefully before signing.' :
                         riskLevel === 'medium' ? 'Some clauses to be aware of. Negotiate where possible.' :
                         'Low risk contract. Still review the key clauses.'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tabs */}
                <div style={{
                  display: 'flex', gap: '4px',
                  background: 'var(--color-bg-secondary)',
                  padding: '4px', borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                  overflowX: 'auto',
                }}>
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        flex: '1 0 auto',
                        padding: '9px 14px',
                        background: activeTab === tab.id ? 'var(--color-bg-card)' : 'transparent',
                        border: `1px solid ${activeTab === tab.id ? 'var(--color-border)' : 'transparent'}`,
                        borderRadius: 'calc(var(--radius-md) - 4px)',
                        color: activeTab === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                        fontSize: '12px', fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                      }}
                    >
                      <tab.icon size={13} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                {activeTab === 'summary' && (
                  <div className="card" style={{ padding: '24px' }}>
                    {/* Language toggle */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                        Contract Summary
                      </h3>
                      <button
                        onClick={() => setUrduMode(!urduMode)}
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '6px 14px', gap: '6px' }}
                      >
                        <Languages size={13} />
                        {urduMode ? 'Switch to English' : 'Roman Urdu mein dekho'}
                      </button>
                    </div>
                    <div style={{
                      padding: '18px',
                      background: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                    }}>
                      <p style={{
                        fontSize: '14px', lineHeight: '1.8',
                        color: 'var(--color-text-secondary)',
                        direction: 'ltr',
                      }}>
                        {urduMode ? analysis.summary.romanUrdu : analysis.summary.english}
                      </p>
                    </div>
                    {/* Disclaimer */}
                    <div style={{
                      marginTop: '16px', padding: '12px 16px',
                      background: 'var(--color-bg-tertiary)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                    }}>
                      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                        ⚖️ {analysis.disclaimer}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'risks' && (
                  <div>
                    {analysis.riskFlags.length === 0 ? (
                      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                        <CheckCircle2 size={40} color="var(--color-risk-low)" style={{ margin: '0 auto 16px' }} />
                        <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-primary)' }}>No major risk flags found</p>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>This contract appears relatively straightforward.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {analysis.riskFlags
                          .sort((a, b) => {
                            const order = { high: 0, medium: 1, low: 2 };
                            return order[a.severity] - order[b.severity];
                          })
                          .map((flag, i) => {
                            const sc = severityConfig[flag.severity];
                            return (
                              <div key={i} className="card" style={{
                                padding: '18px 20px',
                                borderLeft: `3px solid ${sc.color}`,
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                                    {flag.title}
                                  </h4>
                                  <span className={`badge badge-${flag.severity}`}>{sc.label}</span>
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.65' }}>
                                  {flag.description}
                                </p>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'clauses' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {analysis.keyClauses.map((kc, i) => (
                      <ExpandableClause key={i} clause={kc.clause} explanation={kc.explanation} />
                    ))}
                  </div>
                )}

                {activeTab === 'negotiate' && (
                  <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: 'var(--color-teal-dim)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Lightbulb size={18} color="var(--color-teal)" />
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                        Negotiation Tips
                      </h3>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '18px' }}>
                      Ask these questions before signing:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {analysis.negotiationTips.map((tip, i) => (
                        <div key={i} style={{
                          display: 'flex', gap: '14px', alignItems: 'flex-start',
                          padding: '14px 16px',
                          background: 'var(--color-bg-secondary)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-border)',
                        }}>
                          <div style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            background: 'var(--color-teal-dim)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, fontSize: '12px', fontWeight: '800',
                            color: 'var(--color-teal)',
                          }}>
                            {i + 1}
                          </div>
                          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.65', flex: 1 }}>
                            {tip}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.7s linear infinite; }
        @media (max-width: 900px) {
          .results-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
