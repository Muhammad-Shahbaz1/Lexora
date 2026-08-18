'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText, Upload, Trash2, RotateCcw, AlertTriangle,
  CheckCircle2, Clock, XCircle, BarChart3, Scale, ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { contractsAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

interface Contract {
  _id: string;
  title: string;
  category: string;
  status: 'pending' | 'analyzing' | 'done' | 'error';
  fileType: string;
  createdAt: string;
  analysis?: {
    overallRiskLevel?: string;
  };
}

const categoryEmoji: Record<string, string> = {
  rent: '🏠',
  job: '💼',
  business: '🤝',
  other: '📄',
};

const statusConfig = {
  done: { label: 'Done', icon: CheckCircle2, color: 'var(--color-risk-low)', bg: 'var(--color-risk-low-bg)' },
  analyzing: { label: 'Analyzing', icon: Clock, color: 'var(--color-gold)', bg: 'var(--color-gold-dim)' },
  pending: { label: 'Pending', icon: Clock, color: 'var(--color-text-muted)', bg: 'var(--color-bg-tertiary)' },
  error: { label: 'Error', icon: XCircle, color: 'var(--color-risk-high)', bg: 'var(--color-risk-high-bg)' },
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchContracts = useCallback(async () => {
    try {
      const res = await contractsAPI.getAll({ limit: 20 });
      setContracts(res.data.data);
    } catch {
      toast.error('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }
    if (user) fetchContracts();
  }, [user, authLoading, router, fetchContracts]);

  // Poll for analyzing contracts
  useEffect(() => {
    const hasAnalyzing = contracts.some((c) => c.status === 'analyzing' || c.status === 'pending');
    if (!hasAnalyzing) return;
    const interval = setInterval(fetchContracts, 5000);
    return () => clearInterval(interval);
  }, [contracts, fetchContracts]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await contractsAPI.delete(id);
      setContracts((prev) => prev.filter((c) => c._id !== id));
      toast.success('Contract deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleReanalyze = async (id: string) => {
    try {
      await contractsAPI.reanalyze(id);
      setContracts((prev) => prev.map((c) => c._id === id ? { ...c, status: 'analyzing' } : c));
      toast.success('Re-analysis started');
    } catch {
      toast.error('Re-analysis failed');
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px', width: '32px', height: '32px' }} />
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const doneCount = contracts.filter((c) => c.status === 'done').length;
  const analyzingCount = contracts.filter((c) => c.status === 'analyzing' || c.status === 'pending').length;
  const highRiskCount = contracts.filter((c) => c.analysis?.overallRiskLevel === 'high').length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      <Navbar />

      <div className="container-wide page-enter" style={{ padding: '40px 24px 80px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
              Manage and review your analyzed contracts
            </p>
          </div>
          <Link href="/analyze" className="btn btn-primary" style={{ gap: '8px', padding: '11px 22px' }}>
            <Upload size={16} />
            Analyze New Contract
          </Link>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'Total Contracts', value: contracts.length, icon: FileText, color: 'var(--color-gold)' },
            { label: 'Analyzed', value: doneCount, icon: CheckCircle2, color: 'var(--color-risk-low)' },
            { label: 'In Progress', value: analyzingCount, icon: Clock, color: 'var(--color-risk-medium)' },
            { label: 'High Risk Found', value: highRiskCount, icon: AlertTriangle, color: 'var(--color-risk-high)' },
          ].map((stat) => (
            <div key={stat.label} className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: `${stat.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <div>
                <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--color-text-primary)', lineHeight: '1.1' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Contracts list */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <BarChart3 size={18} color="var(--color-text-muted)" />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
              Your Contracts
            </h2>
          </div>

          {contracts.length === 0 ? (
            <div className="card" style={{ padding: '64px 32px', textAlign: 'center' }}>
              <Scale size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 20px', opacity: 0.4 }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '10px' }}>
                No contracts yet
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                Upload your first contract and let Lexora AI analyze it for you.
              </p>
              <Link href="/analyze" className="btn btn-primary">
                <Upload size={16} /> Analyze First Contract
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {contracts.map((contract) => {
                const st = statusConfig[contract.status];
                const StatusIcon = st.icon;
                return (
                  <div key={contract._id} className="card" style={{
                    padding: '18px 24px',
                    display: 'flex', alignItems: 'center', gap: '16px',
                    transition: 'all 0.2s ease',
                  }}>
                    {/* Category emoji */}
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: 'var(--color-bg-tertiary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '20px', flexShrink: 0,
                    }}>
                      {categoryEmoji[contract.category] || '📄'}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '15px', fontWeight: '600',
                          color: 'var(--color-text-primary)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          maxWidth: '300px',
                        }}>
                          {contract.title}
                        </span>
                        {/* Status badge */}
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '3px 8px', borderRadius: '99px',
                          background: st.bg,
                          fontSize: '11px', fontWeight: '700', letterSpacing: '0.04em',
                          color: st.color,
                        }}>
                          <StatusIcon size={10} />
                          {st.label}
                          {contract.status === 'analyzing' && (
                            <span className="animate-pulse-gold">•</span>
                          )}
                        </div>
                        {/* Risk level */}
                        {contract.status === 'done' && contract.analysis?.overallRiskLevel && (
                          <span className={`badge badge-${contract.analysis.overallRiskLevel}`}>
                            {contract.analysis.overallRiskLevel} risk
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        {contract.category.charAt(0).toUpperCase() + contract.category.slice(1)} ·{' '}
                        {new Date(contract.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      {contract.status === 'error' && (
                        <button
                          onClick={() => handleReanalyze(contract._id)}
                          className="btn btn-ghost"
                          style={{ padding: '8px', width: '36px', height: '36px' }}
                          title="Re-analyze"
                        >
                          <RotateCcw size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(contract._id, contract.title)}
                        className="btn btn-ghost"
                        disabled={deletingId === contract._id}
                        style={{ padding: '8px', width: '36px', height: '36px', color: 'var(--color-risk-high)' }}
                        title="Delete"
                      >
                        {deletingId === contract._id
                          ? <div className="spinner" style={{ width: '14px', height: '14px' }} />
                          : <Trash2 size={15} />}
                      </button>
                      {contract.status === 'done' && (
                        <Link
                          href={`/results/${contract._id}`}
                          className="btn btn-secondary"
                          style={{ padding: '7px 14px', fontSize: '13px', gap: '4px' }}
                        >
                          View <ChevronRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
