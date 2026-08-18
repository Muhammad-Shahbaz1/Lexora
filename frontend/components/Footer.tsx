import Link from 'next/link';
import { Scale, Github, Linkedin, MessageCircle } from 'lucide-react';

interface FooterProps {
  githubUrl?: string;
  linkedinUrl?: string;
  whatsappUrl?: string;
}

export default function Footer({
  githubUrl = 'https://github.com/Muhammad-Shahbaz1',
  linkedinUrl = 'https://www.linkedin.com/in/muhammad-shahbaz-a74ba5249',
  whatsappUrl = 'https://wa.me/923417570902',
}: FooterProps) {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        background: 'rgba(10, 15, 29, 0.95)',
        backdropFilter: 'blur(20px)',
        padding: '36px 24px 28px',
        marginTop: '60px',
      }}
    >
      <div className="container-wide">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '24px',
          }}
        >
          {/* Logo & Tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                background: 'var(--color-gold)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(245,197,65,0.25)',
              }}
            >
              <Scale size={18} color="hsl(222, 47%, 7%)" strokeWidth={2.5} />
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: '700',
                  fontSize: '19px',
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.01em',
                }}
              >
                Lexora
              </span>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', letterSpacing: '0.02em' }}>
                Understand Before You Sign
              </p>
            </div>
          </div>

          {/* Developer Credit */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              Crafted with excellence by{' '}
              <strong style={{ color: 'var(--color-gold)', fontWeight: '700' }}>
                Muhammad Shahbaz
              </strong>
            </p>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '3px' }}>
              Full Stack AI Engineer
            </p>
          </div>

          {/* Social Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              style={{
                padding: '9px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--color-bg-tertiary)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
                transition: 'all 0.2s ease',
              }}
              title="GitHub Profile - Muhammad Shahbaz"
            >
              <Github size={18} />
            </Link>

            <Link
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              style={{
                padding: '9px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--color-bg-tertiary)',
                color: '#0a66c2',
                border: '1px solid var(--color-border)',
                transition: 'all 0.2s ease',
              }}
              title="LinkedIn Profile - Muhammad Shahbaz"
            >
              <Linkedin size={18} />
            </Link>

            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              style={{
                padding: '9px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--color-bg-tertiary)',
                color: '#25D366',
                border: '1px solid var(--color-border)',
                transition: 'all 0.2s ease',
              }}
              title="Chat with Muhammad Shahbaz on WhatsApp"
            >
              <MessageCircle size={18} />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: 'var(--color-border)',
            marginBottom: '18px',
          }}
        />

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
          }}
        >
          <p>
            ⚖️ For informational & educational purposes only. Not official legal advice.
          </p>
          <p>© {new Date().getFullYear()} Lexora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
