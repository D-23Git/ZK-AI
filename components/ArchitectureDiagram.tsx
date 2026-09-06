'use client';

import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ArrowDown, Cpu, Database, Server, FileText, Activity } from 'lucide-react';

export default function ArchitectureDiagram() {
  const [activeTab, setActiveTab] = useState<'all' | 'private' | 'verifiable'>('all');

  return (
    <div className="w-full rounded-2xl border border-cyan-900/40 bg-[#0B1120]/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
              Interactive System Architecture
            </span>
            <span className="text-xs text-slate-400 font-mono">Spec 21</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Midnight Zero-Knowledge Data Flow
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict cryptographic boundary isolating private sensitive data from public verifiable proofs.
          </p>
        </div>

        {/* Boundary Filter Toggle */}
        <div className="flex items-center space-x-1 p-1 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Components
          </button>
          <button
            onClick={() => setActiveTab('private')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'private'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            <EyeOff className="w-3 h-3" />
            <span className="font-mono">PRIVATE ONLY</span>
          </button>
          <button
            onClick={() => setActiveTab('verifiable')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'verifiable'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span className="font-mono">VERIFIABLE ONLY</span>
          </button>
        </div>
      </div>

      {/* Boundary Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className={`p-3.5 rounded-xl transition-all ${
          activeTab === 'verifiable' ? 'opacity-30' : 'private-box'
        }`}>
          <div className="flex items-center space-x-2 text-rose-400 font-semibold text-xs mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>CONFIDENTIAL BOUNDARY (Never Transmitted Off-Device)</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Raw patient/financial records, personal identifiers, unaggregated metrics, blinding salt.
          </p>
        </div>

        <div className={`p-3.5 rounded-xl transition-all ${
          activeTab === 'private' ? 'opacity-30' : 'verifiable-box'
        }`}>
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>VERIFIABLE BOUNDARY (Auditable On Midnight Ledger)</span>
          </div>
          <p className="text-[11px] text-slate-300">
            ZK Proof (Groth16/Plonk), requirement compliance predicates, dataset commitment hash, timestamps.
          </p>
        </div>
      </div>

      {/* Visual Flow Diagram */}
      <div className="space-y-6">
        {/* Tier 1: AI Developer */}
        <div className="flex flex-col items-center">
          <div className={`w-full max-w-xl p-4 rounded-xl border bg-[#0E172A] transition-all ${
            activeTab === 'private' ? 'opacity-40' : 'border-blue-500/40 shadow-md shadow-blue-500/10'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">1. AI DEVELOPER</h4>
                  <p className="text-xs text-slate-400">Defines Dataset Requirements</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-950 text-blue-300 rounded border border-blue-800">
                Specification Engine
              </span>
            </div>
            <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-300 font-mono flex flex-wrap gap-2">
              <span className="bg-slate-900 px-2 py-0.5 rounded text-cyan-300">Min Records &ge; 10,000</span>
              <span className="bg-slate-900 px-2 py-0.5 rounded text-cyan-300">Completeness &ge; 95%</span>
              <span className="bg-slate-900 px-2 py-0.5 rounded text-cyan-300">Quality &ge; 90</span>
              <span className="bg-slate-900 px-2 py-0.5 rounded text-cyan-300">CSV/JSON</span>
            </div>
          </div>

          <div className="my-2 text-cyan-400/80 flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Requirement Hash Published</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>

        {/* Tier 2: Contributor Local Sandbox */}
        <div className="flex flex-col items-center">
          <div className={`w-full max-w-2xl p-5 rounded-xl border transition-all ${
            activeTab === 'verifiable' ? 'opacity-30' : 'border-rose-500/40 bg-rose-950/10 shadow-lg shadow-rose-950/20'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-white">2. DATA CONTRIBUTOR (Client Device)</h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-rose-950 text-rose-300 rounded border border-rose-800">
                      STRICTLY PRIVATE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Private Dataset Analyzed Locally — Never Leaves Machine</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-black/40 border border-rose-900/40">
                <div className="flex items-center justify-between text-rose-300 font-semibold mb-1">
                  <span>Raw Private Dataset</span>
                  <EyeOff className="w-3 h-3" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Sensitive clinical, financial, or user records stored on contributor device only.
                </p>
                <div className="mt-2 text-[10px] font-mono text-slate-500">
                  H(salt || records) &rarr; Commitment Generated
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-cyan-900/40">
                <div className="flex items-center justify-between text-cyan-300 font-semibold mb-1">
                  <span>AI Quality & ZK Engine</span>
                  <Cpu className="w-3 h-3" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Computes completeness (98%), duplicates (1%), and evaluates range predicates in ZK sandbox.
                </p>
                <div className="mt-2 text-[10px] font-mono text-cyan-400">
                  Generates Midnight Compact Proof
                </div>
              </div>
            </div>
          </div>

          <div className="my-2 text-cyan-400/80 flex flex-col items-center">
            <span className="text-[10px] font-mono text-emerald-400 uppercase">Proof & Minimal Metadata Transmitted (Zero Raw Rows)</span>
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Tier 3: Midnight Layer */}
        <div className="flex flex-col items-center">
          <div className={`w-full max-w-xl p-5 rounded-xl border bg-gradient-to-br from-[#0B132B] to-[#0A192F] transition-all ${
            activeTab === 'private' ? 'opacity-30' : 'border-cyan-500/50 shadow-xl shadow-cyan-500/15'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>3. MIDNIGHT ZERO-KNOWLEDGE LAYER</span>
                    <span className="text-[10px] font-mono text-cyan-300 px-1.5 py-0.5 bg-cyan-950 rounded border border-cyan-800">
                      Preprod
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">Compact Smart Contract Execution & Verification</p>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-cyan-900/30 text-[11px] font-mono space-y-1">
              <div className="text-slate-300 flex justify-between">
                <span>Contract Circuit:</span>
                <span className="text-cyan-400">verify_dataset_qualification()</span>
              </div>
              <div className="text-slate-300 flex justify-between">
                <span>Cryptographic Proof:</span>
                <span className="text-emerald-400">BLS12-381 Groth16 VALID</span>
              </div>
              <div className="text-slate-300 flex justify-between">
                <span>Raw Dataset State:</span>
                <span className="text-rose-400">NOT ON LEDGER / UNACCESSED</span>
              </div>
            </div>
          </div>

          <div className="my-2 text-cyan-400/80 flex items-center space-x-6">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-blue-400">Verification Result</span>
              <ArrowDown className="w-4 h-4" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-purple-400">Audit Proof Log</span>
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Tier 4: Developer & Auditor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {/* AI Developer Result */}
          <div className={`p-4 rounded-xl border bg-[#0E172A] transition-all ${
            activeTab === 'private' ? 'opacity-30' : 'border-blue-500/30'
          }`}>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">4A. AI DEVELOPER</h5>
                <p className="text-[10px] text-slate-400">Receives Qualification Proof</p>
              </div>
            </div>
            <ul className="text-[11px] text-slate-300 space-y-1 font-mono">
              <li className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Requirements: 6 / 6 SATISFIED
              </li>
              <li className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> ZK Proof: VERIFIED VALID
              </li>
              <li className="text-rose-400 flex items-center gap-1">
                <EyeOff className="w-3 h-3" /> Raw Dataset: NOT ACCESSIBLE
              </li>
            </ul>
          </div>

          {/* Auditor Record */}
          <div className={`p-4 rounded-xl border bg-[#0E172A] transition-all ${
            activeTab === 'private' ? 'opacity-30' : 'border-purple-500/30'
          }`}>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">4B. AUDITOR</h5>
                <p className="text-[10px] text-slate-400">Immutable Audit Record</p>
              </div>
            </div>
            <ul className="text-[11px] text-slate-300 space-y-1 font-mono">
              <li>Verification ID: <span className="text-purple-300">ver-a189f4b7</span></li>
              <li>Version Hash: <span className="text-slate-400">7b2a9f14...</span></li>
              <li className="text-cyan-300">Chained Merkle Audit Log</li>
              <li className="text-slate-500">Zero raw records stored</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
