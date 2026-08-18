import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lexora — Understand Before You Sign',
  description:
    'Lexora uses AI to analyze your legal documents — rent agreements, job contracts, and business agreements — in plain English and Roman Urdu. Understand your rights before you sign.',
  keywords: 'legal document analyzer, AI legal assistant, contract analyzer, Lexora, understand legal documents',
  authors: [{ name: 'Lexora' }],
  openGraph: {
    title: 'Lexora — Understand Before You Sign',
    description: 'AI-powered legal document analyzer. Upload your contract and get plain English + Roman Urdu analysis instantly.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-inter antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a2e',
                color: '#e2e8f0',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                borderRadius: '12px',
                padding: '14px 18px',
                fontSize: '14px',
                fontFamily: 'var(--font-inter)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              },
              success: {
                iconTheme: { primary: '#10b981', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
