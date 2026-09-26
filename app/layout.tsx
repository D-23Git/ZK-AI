import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HelpAssistantWidget from '@/components/HelpAssistantWidget';
import { WalletProvider } from '@/components/WalletContext';

export const metadata: Metadata = {
  title: 'AURA ZK-AI — Confidential AI Cloud & Autonomous Agent Guard',
  description: 'Execute private AI inferences, enforce autonomous AI agent safety guardrails, and query encrypted enterprise knowledge — powered by Midnight Network Zero-Knowledge smart contracts.',
  keywords: [
    'AURA ZK-AI',
    'Midnight Network',
    'Zero Knowledge AI',
    'ZK Proofs',
    'Confidential AI',
    'Autonomous Agent Guard',
    'Compact Smart Contract',
    'Preprod'
  ],
  authors: [{ name: 'AURA ZK-AI Team' }],
  openGraph: {
    title: 'AURA ZK-AI — Confidential AI Cloud. Proven in Zero-Knowledge.',
    description: 'Privacy-preserving AI inference & autonomous agent guardrails on Midnight Network.',
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
      <body className="min-h-screen bg-[#07090e] text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
        <WalletProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <HelpAssistantWidget />
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
