import Link from 'next/link';
import { Scale } from 'lucide-react';

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

          {/* Social Links with crisp SVG Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* GitHub */}
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
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="GitHub Profile - Muhammad Shahbaz"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </Link>

            {/* LinkedIn */}
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
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="LinkedIn Profile - Muhammad Shahbaz"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </Link>

            {/* WhatsApp */}
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
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Chat with Muhammad Shahbaz on WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.12-.22-.19-.47-.32z" />
              </svg>
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
