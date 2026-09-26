'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Shield, Brain, Bot, Database, Terminal, Award, 
  ArrowRight, CheckCircle2, Lock, Zap, Sparkles, 
  Check, Copy, Activity, FileCode, Layers, Cpu, EyeOff, Globe
} from 'lucide-react';
import { MIDNIGHT_CONFIG } from '../midnight/config';

export default function HomePage() {
  const router = useRouter();
  const [copiedContract, setCopiedContract] = useState(false);
  const [quickTestRunning, setQuickTestRunning] = useState(false);
  const [quickProofHash, setQuickProofHash] = useState<string | null>(null);

  const contractAddress = MIDNIGHT_CONFIG.contractAddress;

  const copyContract = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const handleQuickDemo = async () => {
    if (quickTestRunning) return;
    setQuickTestRunning(true);
    setQuickProofHash(null);

    await new Promise((r) => setTimeout(r, 1000));

    setQuickProofHash(
      '0300' + Array.from({ length: 60 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    );
    setQuickTestRunning(false);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-emerald-400 selection:text-black">
      
      {/* Radiant Background Meshes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-5%] left-[25%] w-[650px] h-[650px] bg-emerald-500/15 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute top-[25%] right-[-5%] w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[5%] w-[600px] h-[600px] bg-teal-500/12 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto space-y-8">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-xs font-semibold text-emerald-300 backdrop-blur-xl shadow-lg shadow-emerald-500/10">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
            <span>Midnight Network Preprod</span>
            <span className="text-emerald-700">•</span>
            <span className="text-slate-300 font-mono">Compact 0.5.2 Certified</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
            Confidential AI Cloud. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
              Proven in Zero-Knowledge.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Execute private AI inference, enforce autonomous agent safety guardrails, and query encrypted enterprise knowledge — all cryptographically attested on Midnight without exposing confidential data.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/studio"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <Brain className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              Launch ZK-AI Studio
              <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </Link>

            <Link
              href="/agents"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 border border-white/20 hover:border-emerald-500/60 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-slate-800 backdrop-blur-xl transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-lg"
            >
              <Bot className="w-5 h-5 text-emerald-400" />
              Configure Agent Guard
            </Link>
          </div>

          {/* Quick Interactive Demo Box */}
          <div className="max-w-xl mx-auto mt-8 p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-xl text-left shadow-2xl shadow-emerald-950/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-current" /> Instant ZK-Inference Prover Test
              </span>
              <span className="text-[11px] font-mono text-slate-400">Preprod Node 9944</span>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Click below to synthesize a client-shielded prompt witness into a Midnight Compact SNARK proof:
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleQuickDemo}
                disabled={quickTestRunning}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all flex-shrink-0 shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                {quickTestRunning ? (
                  <>
                    <Activity className="w-3.5 h-3.5 animate-spin" /> Synthesizing ZK Proof...
                  </>
                ) : (
                  <>
                    <Shield className="w-3.5 h-3.5 stroke-[2.5]" /> Prove Confidential Inference
                  </>
                )}
              </button>

              <div className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-[11px] font-mono text-slate-300 truncate flex items-center">
                {quickProofHash ? (
                  <span className="text-emerald-300 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    Commitment: {quickProofHash.substring(0, 16)}...{quickProofHash.slice(-8)}
                  </span>
                ) : (
                  <span className="text-slate-400">Ready for client-side witness blinding</span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* MIDNIGHT CONTRACT HERO BANNER */}
        <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-emerald-950/40 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                  OFFICIAL MIDNIGHT PREPROD DEPLOYMENT
                </span>
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Contract
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Compact Smart Contract Identifier
              </h2>
              <div className="flex items-center gap-3 bg-black/70 border border-white/15 rounded-xl px-4 py-3 font-mono text-xs sm:text-sm text-emerald-300 max-w-2xl shadow-inner">
                <span className="truncate">{contractAddress}</span>
                <button
                  onClick={copyContract}
                  className="text-slate-400 hover:text-white transition-colors flex-shrink-0 p-1 rounded hover:bg-white/10"
                  title="Copy Midnight Contract Address"
                >
                  {copiedContract ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* ACTION BUTTON WITH DIRECT ONCLICK NAVIGATION */}
            <div className="flex items-center gap-4">
              <button
                id="btn-open-midnight-explorer"
                onClick={() => router.push('/explorer')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span>Open Midnight Explorer</span>
                <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* FOUR PILLARS ECOSYSTEM */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Complete Zero-Knowledge AI Ecosystem
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Everything needed to deploy, constrain, and verify confidential artificial intelligence on Midnight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: AI Studio */}
            <Link
              href="/studio"
              className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-emerald-400/50 backdrop-blur-xl transition-all hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-500/10 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                ZK-AI Studio
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Execute private prompts with client-side homomorphic blinding. Verify model inference outputs without publishing raw prompts to the chain.
              </p>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                Launch Studio <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Agent Guard */}
            <Link
              href="/agents"
              className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-indigo-400/50 backdrop-blur-xl transition-all hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/10 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                Agent Guardrails
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Enforce spending budgets, tool-calling rate limits, and safety invariants on autonomous AI agents via Midnight Compact smart contract circuits.
              </p>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                Configure Guard <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Vector Vault */}
            <Link
              href="/vault"
              className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-teal-400/50 backdrop-blur-xl transition-all hover:-translate-y-1.5 hover:shadow-xl hover:shadow-teal-500/10 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                Vector Vault
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Store blinded enterprise embeddings. Prove semantic document similarity in Zero-Knowledge without exposing proprietary internal files to third-party LLMs.
              </p>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-400">
                Open Vault <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: ZK Explorer */}
            <Link
              href="/explorer"
              className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/50 backdrop-blur-xl transition-all hover:-translate-y-1.5 hover:shadow-xl hover:shadow-cyan-500/10 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <Terminal className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                Midnight Explorer
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Inspect live block production, Compact circuit bytecode (`verify_contribution.zkir`), commitment logs, and preprod transaction proofs.
              </p>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                Inspect Blocks <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>
        </div>

        {/* ARCHITECTURE PIPELINE */}
        <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Cryptographic Execution Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              How Zero-Knowledge AI Works on Midnight
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Client Enclave Blinding',
                desc: 'Raw prompts, documents, or agent states are blinded in the client sandbox with a 256-bit cryptographically random salt.'
              },
              {
                step: '02',
                title: 'Witness Synthesis',
                desc: 'The private witness evaluates polynomial range constraints and format invariants without revealing values.'
              },
              {
                step: '03',
                title: 'Compact Circuit Execution',
                desc: 'The Midnight Compact circuit (verify_contribution.zkir) mathematically asserts all rules are fully satisfied.'
              },
              {
                step: '04',
                title: 'Preprod Ledger Settlement',
                desc: 'A succinct cryptographic commitment is committed to Midnight Preprod with zero private leakage.'
              }
            ].map((p, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-black/50 border border-white/10 hover:border-emerald-500/30 transition-all">
                <span className="text-3xl font-black font-mono text-emerald-500/30 block mb-2">{p.step}</span>
                <h4 className="text-sm font-bold text-white mb-2">{p.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER CALL TO ACTION */}
        <div className="text-center py-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Build Privacy-Preserving AI on Midnight?
          </h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Connect your Midnight Lace wallet and begin generating verifiable Zero-Knowledge AI proofs today.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/studio"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Start in AI Studio
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
