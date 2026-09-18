'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Lock,
  Brain,
  Scale,
  Cpu,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Database,
  EyeOff,
  Layers,
  FileCheck,
  TrendingUp,
  Activity,
  Award,
  Zap,
  Play
} from 'lucide-react';
import ArchitectureDiagram from '@/components/ArchitectureDiagram';
import LivePlayground from '@/components/LivePlayground';
import { WalletButton } from '@/components/WalletConnect';

export default function HomePage() {
  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 pb-8 overflow-hidden">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-purple-600/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-4 shadow-sm shadow-cyan-500/10">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Midnight Zero-Knowledge AI Data Infrastructure • Preprod Live</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Contribute Data to AI.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Keep Your Data Private.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Prove your dataset meets AI project requirements without exposing the underlying sensitive records.
          </p>

          {/* Portal Wallet Connect & Quick Guide Callout */}
          <div className="mt-6 max-w-2xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-cyan-950/40 to-slate-900/90 border border-cyan-800/50 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div>
              <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                <span>⏱️ Midnight 1AM &amp; Lace Wallet Integration</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Connect your 1AM Wallet or Midnight Lace Wallet to sign ZK proofs &amp; submit verified dataset metrics on Preprod.
              </p>
            </div>
            <div className="shrink-0">
              <WalletButton />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contributor"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-105 animate-neon-pulse"
            >
              <Lock className="w-4 h-4" />
              <span>Contribute Data (Role 1)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/developer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 font-semibold text-sm flex items-center justify-center space-x-2 transition-all"
            >
              <Brain className="w-4 h-4 text-cyan-400" />
              <span>AI Developer Portal (Role 2)</span>
            </Link>

            <Link
              href="/auditor"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 text-slate-300 border border-slate-800 font-medium text-sm flex items-center justify-center space-x-2 transition-all"
            >
              <Scale className="w-4 h-4 text-purple-400" />
              <span>Auditor Registry (Role 3)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 1.5 LIVE NETWORK STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-xl text-center shadow-lg shadow-cyan-900/20">
            <div className="text-cyan-400 text-sm font-semibold mb-1">Preprod Node</div>
            <div className="text-white text-lg font-bold flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Online
            </div>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center shadow-lg shadow-blue-900/20">
            <div className="text-blue-400 text-sm font-semibold mb-1">ZK Proofs Verified</div>
            <div className="text-white text-2xl font-bold font-mono">1,420</div>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center shadow-lg shadow-purple-900/20">
            <div className="text-purple-400 text-sm font-semibold mb-1">Total DUST Rewarded</div>
            <div className="text-white text-2xl font-bold font-mono">45,000</div>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center shadow-lg shadow-emerald-900/20">
            <div className="text-emerald-400 text-sm font-semibold mb-1">Active Projects</div>
            <div className="text-white text-2xl font-bold font-mono">12</div>
          </div>
        </div>
      </section>

      {/* 2. INSTANT 1-CLICK DEMO SANDBOX (Answers "What to do right now!") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LivePlayground />
      </section>

      {/* 3. PRODUCT DIFFERENTIATOR (Spec 22) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">Product Differentiator • Spec 22</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            The Paradigm Shift in AI Data Sourcing
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Marketplace */}
          <div className="p-7 rounded-2xl border border-rose-950/60 bg-gradient-to-b from-rose-950/20 to-[#0B101E] relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800">
                TRADITIONAL DATA MARKETPLACE
              </span>
              <XCircle className="w-6 h-6 text-rose-500" />
            </div>

            <div className="text-2xl font-extrabold text-rose-200 mb-3">
              &ldquo;Give me your data.&rdquo;
            </div>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Forces contributors to upload raw, unprotected datasets directly to central servers and untrusted third parties.
            </p>

            <div className="space-y-3 pt-4 border-t border-rose-900/30 text-xs text-slate-300">
              <div className="flex items-center space-x-2 text-rose-400">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>Severe Privacy & HIPAA/GDPR Compliance Violations</span>
              </div>
              <div className="flex items-center space-x-2 text-rose-400">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>Permanent Data Leakage & Intellectual Property Loss</span>
              </div>
              <div className="flex items-center space-x-2 text-rose-400">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>Security Breaches at Central Storage Nodes</span>
              </div>
            </div>
          </div>

          {/* PrivateData AI */}
          <div className="p-7 rounded-2xl border border-cyan-500/50 bg-gradient-to-b from-cyan-950/30 to-[#0B101E] relative overflow-hidden shadow-xl shadow-cyan-500/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                PRIVACY-PRESERVING DATA CONTRIBUTION
              </span>
              <CheckCircle2 className="w-6 h-6 text-cyan-400" />
            </div>

            <div className="text-2xl font-extrabold text-cyan-200 mb-3">
              &ldquo;Prove your data qualifies.&rdquo;
            </div>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Enables contributors to generate mathematical Zero-Knowledge proofs that their data satisfies requirements without exposing a single sensitive record.
            </p>

            <div className="space-y-3 pt-4 border-t border-cyan-800/40 text-xs text-slate-200">
              <div className="flex items-center space-x-2 text-cyan-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>100% Client-Side Privacy: Raw data remains isolated</span>
              </div>
              <div className="flex items-center space-x-2 text-cyan-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Midnight Compact ZK Contract: Cryptographic guarantees</span>
              </div>
              <div className="flex items-center space-x-2 text-cyan-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Immutable Requirement Policy Versioning (v1.0, v1.1)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ARCHITECTURE VISUALIZATION (Spec 21) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ArchitectureDiagram />
      </section>

      {/* 5. THREE USER ROLES (Spec 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">Multi-Role Architecture • Spec 2</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Choose Your Role in the AI Data Lifecycle
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Role A: Contributor */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-bold text-white">Data Contributor</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-800">
                  Role A
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Analyze datasets privately on your device. Match against AI project specifications, generate Midnight ZK proofs, and control consent.
              </p>
            </div>
            <Link
              href="/contributor"
              className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Open Contributor Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Role B: AI Developer */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-bold text-white">AI Developer</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-950 text-blue-300 rounded border border-blue-800">
                  Role B
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Define rigorous dataset requirement policies, publish immutable versions, verify incoming ZK proofs, and interact with the AI Assistant.
              </p>
            </div>
            <Link
              href="/developer"
              className="w-full py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Open Developer Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Role C: Auditor */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                <Scale className="w-6 h-6" />
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-bold text-white">Auditor</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-950 text-purple-300 rounded border border-purple-800">
                  Role C
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Review immutable verification logs, audit requirement versions at timestamp of proof, and answer verification questions without raw data.
              </p>
            </div>
            <Link
              href="/auditor"
              className="w-full py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Open Auditor Registry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
