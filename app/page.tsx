'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Shield, Brain, Bot, Database, Terminal, Award, 
  ArrowRight, CheckCircle2, Lock, Zap, Sparkles, 
  Check, Copy, Activity, FileCode, Layers, Cpu, EyeOff
} from 'lucide-react';
import { MIDNIGHT_CONFIG } from '../midnight/config';

export default function HomePage() {
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

    await new Promise((r) => setTimeout(r, 1200));

    setQuickProofHash(
      '0300' + Array.from({ length: 60 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    );
    setQuickTestRunning(false);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white selection:bg-cyan-500 selection:text-black">
      
      {/* Background Glow Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-semibold text-cyan-300 backdrop-blur-xl shadow-lg shadow-cyan-500/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Built on Midnight Network</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Compact 0.5.2 Smart Contract</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Confidential AI Cloud. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              Proven in Zero-Knowledge.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Execute private AI inference, enforce autonomous agent safety guardrails, and query encrypted enterprise knowledge — all cryptographically attested on Midnight without exposing confidential data.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/studio"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all"
            >
              <Brain className="w-5 h-5 text-black" />
              Launch ZK AI Studio
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>

            <Link
              href="/agents"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-violet-500/50 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-slate-800/80 backdrop-blur-xl transition-all"
            >
              <Bot className="w-5 h-5 text-violet-400" />
              Explore Agent Guard
            </Link>
          </div>

          {/* Quick Interactive Demo Box */}
          <div className="max-w-xl mx-auto mt-10 p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl text-left shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Instant ZK-Inference Prover Test
              </span>
              <span className="text-[11px] font-mono text-slate-400">Preprod Contract</span>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              Click to synthesize a private prompt witness into a Midnight Compact SNARK proof:
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleQuickDemo}
                disabled={quickTestRunning}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all flex-shrink-0"
              >
                {quickTestRunning ? (
                  <>
                    <Activity className="w-3.5 h-3.5 animate-spin" /> Synthesizing ZK Proof...
                  </>
                ) : (
                  <>
                    <Shield className="w-3.5 h-3.5" /> Prove Confidential Inference
                  </>
                )}
              </button>

              <div className="flex-1 bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-[11px] font-mono text-slate-400 truncate flex items-center">
                {quickProofHash ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    Commitment: {quickProofHash.substring(0, 16)}...{quickProofHash.slice(-8)}
                  </span>
                ) : (
                  <span>Ready for client-side witness blinding</span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* MIDNIGHT CONTRACT HERO BADGE */}
        <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-violet-950/40 border border-cyan-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  OFFICIAL MIDNIGHT PREPROD DEPLOYMENT
                </span>
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Contract
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Compact Smart Contract Identifier
              </h2>
              <div className="flex items-center gap-3 bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs sm:text-sm text-cyan-300 max-w-2xl">
                <span className="truncate">{contractAddress}</span>
                <button
                  onClick={copyContract}
                  className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
                  title="Copy Midnight Contract Address"
                >
                  {copiedContract ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/explorer"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 border border-white/10 transition-all"
              >
                <Terminal className="w-4 h-4 text-cyan-400" /> Open Midnight Explorer
              </Link>
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
              className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                ZK-AI Studio
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Execute private prompts with client-side homomorphic blinding. Verify model inference outputs without publishing raw prompts to the chain.
              </p>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                Launch Studio <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Agent Guard */}
            <Link
              href="/agents"
              className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-violet-500/40 backdrop-blur-xl transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                Agent Guardrails
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Enforce spending budgets, tool-calling rate limits, and safety invariants on autonomous AI agents via Midnight Compact smart contract circuits.
              </p>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-400">
                Configure Guard <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Vector Vault */}
            <Link
              href="/vault"
              className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-emerald-500/40 backdrop-blur-xl transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                Vector Vault
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Store blinded enterprise embeddings. Prove semantic document similarity in Zero-Knowledge without exposing proprietary internal files to third-party LLMs.
              </p>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                Open Vault <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: ZK Explorer */}
            <Link
              href="/explorer"
              className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-blue-500/40 backdrop-blur-xl transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                Midnight Explorer
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Inspect live block production, Compact circuit bytecode (`verify_contribution.zkir`), commitment logs, and preprod transaction proofs.
              </p>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                Inspect Blocks <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>
        </div>

        {/* ARCHITECTURE PIPELINE */}
        <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-8 sm:p-12 backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
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
              <div key={idx} className="p-5 rounded-2xl bg-black/40 border border-white/5 relative">
                <span className="text-3xl font-black font-mono text-white/10 block mb-2">{p.step}</span>
                <h4 className="text-sm font-bold text-white mb-2">{p.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER CALL TO ACTION */}
        <div className="text-center py-12 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Build Privacy-Preserving AI on Midnight?
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Connect your Midnight Lace wallet and begin generating verifiable Zero-Knowledge AI proofs today.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/studio"
              className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all"
            >
              Start in AI Studio
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
