'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Database, ArrowRight } from 'lucide-react';

export default function MatchingRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/vault');
    }, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md bg-slate-900/60 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4 animate-pulse">
          <Database className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold mb-2">Upgraded to Vector Vault</h2>
        <p className="text-xs text-slate-400 mb-6">
          The matching engine has evolved into the Confidential Knowledge Vault & Zero-Knowledge Vector RAG. Redirecting you now...
        </p>
        <Link
          href="/vault"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all"
        >
          Go to Vector Vault <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
