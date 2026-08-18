'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';
import {
  Upload, FileText, Image, X, ArrowRight, Loader2,
  AlertTriangle, CheckCircle2, Scale,
} from 'lucide-react';
import { contractsAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'rent', label: 'Rent Agreement', emoji: '🏠', desc: 'Tenancy, lease, housing' },
  { value: 'job', label: 'Job / Employment', emoji: '💼', desc: 'Offer letter, employment contract' },
  { value: 'business', label: 'Business / Vendor', emoji: '🤝', desc: 'Service agreement, vendor contract' },
  { value: 'other', label: 'Other', emoji: '📄', desc: 'NDA, service agreement, etc.' },
];

export default function AnalyzePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('other');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (!f) return;
    setFile(f);
    // Auto-fill title from filename
    const name = f.name.replace(/\.(pdf|png|jpg|jpeg)$/i, '').replace(/_/g, ' ');
    setTitle(name);
    setErrors({});
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDropRejected: (fileRejections) => {
      const err = fileRejections[0]?.errors[0];
      if (err?.code === 'file-too-large') toast.error('File too large. Max size is 10MB.');
      else if (err?.code === 'file-invalid-type') toast.error('Only PDF, JPG, PNG files are allowed.');
    },
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!file) e.file = 'Please upload a contract file';
    if (!title.trim()) e.title = 'Contract title is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('contract', file!);
      formData.append('title', title.trim());
      formData.append('category', category);

      const res = await contractsAPI.upload(formData);
      const contractId = res.data.contractId;

      toast.success('Contract uploaded! AI is analyzing it now... 🤖');
      router.push(`/results/${contractId}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Upload failed. Try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const isPdf = file?.type === 'application/pdf';
  const fileSizeMB = file ? (file.size / (1024 * 1024)).toFixed(2) : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      <Navbar />

      <div className="container-narrow page-enter" style={{ padding: '48px 24px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Scale size={20} color="var(--color-gold)" />
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-gold)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              AI Analysis
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(26px, 4vw, 38px)',
            fontWeight: '700', color: 'var(--color-text-primary)',
            marginBottom: '10px',
          }}>
            Analyze Your Contract
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px', lineHeight: '1.6' }}>
            Upload a PDF or image of your contract. Lexora AI will explain it in plain English and Roman Urdu, flag risks, and give you negotiation tips.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* File Upload Dropzone */}
          <div>
            <label className="label">Contract File (PDF, JPG, PNG — max 10MB)</label>
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${errors.file ? 'var(--color-risk-high)' : isDragActive ? 'var(--color-gold)' : file ? 'var(--color-risk-low)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: file ? '24px' : '48px 32px',
                textAlign: 'center',
                cursor: 'pointer',
                background: isDragActive ? 'var(--color-gold-glow)' : file ? 'rgba(34, 197, 94, 0.04)' : 'var(--color-bg-secondary)',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
            >
              <input {...getInputProps()} id="contract-file" />

              {file ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isPdf ? <FileText size={22} color="var(--color-risk-low)" /> : <Image size={22} color="var(--color-risk-low)" />}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      {isPdf ? 'PDF' : 'Image'} · {fileSizeMB} MB
                    </div>
                  </div>
                  <CheckCircle2 size={20} color="var(--color-risk-low)" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); setTitle(''); }}
                    style={{
                      marginLeft: 'auto', background: 'none', border: 'none',
                      cursor: 'pointer', color: 'var(--color-text-muted)',
                      padding: '4px',
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={36} color={isDragActive ? 'var(--color-gold)' : 'var(--color-text-muted)'} style={{ margin: '0 auto 16px' }} />
                  <p style={{ fontSize: '15px', fontWeight: '600', color: isDragActive ? 'var(--color-gold)' : 'var(--color-text-primary)', marginBottom: '8px' }}>
                    {isDragActive ? 'Drop it here!' : 'Drop your contract here, or click to browse'}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    Supports PDF, JPG, PNG · Max 10MB
                  </p>
                </>
              )}
            </div>
            {errors.file && (
              <p style={{ fontSize: '12px', color: 'var(--color-risk-high)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle size={12} /> {errors.file}
              </p>
            )}
          </div>

          {/* Contract Title */}
          <div>
            <label htmlFor="contract-title" className="label">Contract Title</label>
            <input
              id="contract-title"
              type="text"
              className={`input ${errors.title ? 'error' : ''}`}
              placeholder="e.g., Apartment Rental Agreement – June 2026"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors({ ...errors, title: '' }); }}
              disabled={loading}
            />
            {errors.title && <p style={{ fontSize: '12px', color: 'var(--color-risk-high)', marginTop: '6px' }}>{errors.title}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="label">Contract Category</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  style={{
                    padding: '14px 16px',
                    background: category === cat.value ? 'var(--color-gold-dim)' : 'var(--color-bg-secondary)',
                    border: `1px solid ${category === cat.value ? 'rgba(245,197,65,0.4)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    display: 'flex', alignItems: 'center', gap: '12px',
                  }}
                >
                  <span style={{ fontSize: '22px' }}>{cat.emoji}</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: category === cat.value ? 'var(--color-gold)' : 'var(--color-text-primary)' }}>
                      {cat.label}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{cat.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{
            padding: '14px 16px',
            background: 'var(--color-risk-medium-bg)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 'var(--radius-md)',
            display: 'flex', gap: '10px', alignItems: 'flex-start',
          }}>
            <AlertTriangle size={15} color="var(--color-risk-medium)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.55' }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>Disclaimer:</strong> Lexora AI is for informational purposes only. This does not constitute legal advice. Always consult a qualified lawyer before making legal decisions.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !file}
            style={{ width: '100%', padding: '14px', fontSize: '16px', gap: '8px' }}
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Uploading & analyzing...</>
            ) : (
              <>Analyze Contract <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/dashboard" style={{ fontSize: '13px', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
            ← Back to Dashboard
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
