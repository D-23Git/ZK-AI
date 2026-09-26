'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bot, ArrowRight } from 'lucide-react';

export default function DeveloperRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/agents');
    }, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md bg-slate-900/60 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
        <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mx-auto mb-4 animate-pulse">
          <Bot className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold mb-2">Upgraded to Agent Guard</h2>
        <p className="text-xs text-slate-400 mb-6">
          The developer requirement builder has evolved into Autonomous AI Agent Policy Guardrails on Midnight. Redirecting you now...
        </p>
        <Link
          href="/agents"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-500 transition-all"
        >
          Go to Agent Guard <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
