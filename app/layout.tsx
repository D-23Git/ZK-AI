import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HelpAssistantWidget from '@/components/HelpAssistantWidget';

export const metadata: Metadata = {
  title: 'PrivateData AI — Privacy-Preserving AI Data Contribution Platform',
  description: 'Contribute private datasets to AI projects without exposing raw records using Midnight zero-knowledge technology. Prove data qualification without revealing data.',
  keywords: [
    'PrivateData AI',
    'Midnight Network',
    'Zero Knowledge',
    'ZK Proofs',
    'AI Data Marketplace',
    'Privacy Preserving AI',
    'Compact Smart Contract',
    'Preprod'
  ],
  authors: [{ name: 'PrivateData AI Team' }],
  openGraph: {
    title: 'PrivateData AI — Prove That Your Data Qualifies Without Revealing Your Data',
    description: 'Privacy-preserving AI data contribution platform powered by Midnight zero-knowledge technology.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070B14] text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <HelpAssistantWidget />
        <Footer />
      </body>
    </html>
  );
}
