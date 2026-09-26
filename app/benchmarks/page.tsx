'use client';

import React, { useState } from 'react';
import { 
  Award, ShieldCheck, CheckCircle2, TrendingUp, BarChart3, 
  Sparkles, ExternalLink, Zap, Lock, RefreshCw, Cpu
} from 'lucide-react';
import { MIDNIGHT_CONFIG } from '../../midnight/config';

interface ModelBenchmark {
  modelName: string;
  provider: string;
  accuracyScore: number;
  biasRisk: string;
  proofHash: string;
  verifiedAt: string;
  isCompliant: boolean;
}

export default function BenchmarksPage() {
  const [selectedDomain, setSelectedDomain] = useState('Financial Risk & Fraud');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditSuccess, setAuditSuccess] = useState(false);

  const benchmarkList: ModelBenchmark[] = [
    {
      modelName: 'Llama 3.3 70B Instruct (Shielded)',
      provider: 'Meta / Midnight Enclave',
      accuracyScore: 94.6,
      biasRisk: '< 0.02% (Pass)',
      proofHash: '0300a719...4bf1',
      verifiedAt: 'Sep 2026',
      isCompliant: true
    },
    {
      modelName: 'DeepSeek R1 (Confidential)',
      provider: 'DeepSeek AI / ZK-Sandbox',
      accuracyScore: 92.8,
      biasRisk: '< 0.05% (Pass)',
      proofHash: '0300bc82...198e',
      verifiedAt: 'Sep 2026',
      isCompliant: true
    },
    {
      modelName: 'Mistral Large 2 (Zero-Knowledge)',
      provider: 'Mistral / Midnight Preprod',
      accuracyScore: 91.2,
      biasRisk: '< 0.04% (Pass)',
      proofHash: '03008891...33d2',
      verifiedAt: 'Aug 2026',
      isCompliant: true
    }
  ];

  const handleRunAudit = async () => {
    setIsAuditing(true);
    setAuditSuccess(false);

    await new Promise((r) => setTimeout(r, 1400));

    setAuditSuccess(true);
    setIsAuditing(false);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/30 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> Verifiable Model Leaderboard
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Zero-Knowledge Compliance
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-violet-400 bg-clip-text text-transparent">
              Verifiable AI Benchmarks & Safety Audits
            </h1>
            <p className="mt-1 text-slate-400 text-sm sm:text-base">
              Prove AI model compliance, accuracy, and hallucination bounds without exposing proprietary model weights or confidential evaluation prompts.
            </p>
          </div>

          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
          >
            {isAuditing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying in ZK Enclave...
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" /> Submit Model for ZK Audit
              </>
            )}
          </button>
        </div>

        {/* Audit Alert */}
        {auditSuccess && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Model Benchmark Assertion Verified: Compact Contract updated with verified 95.2% accuracy assertion.</span>
            </div>
            <span className="font-mono text-[10px] bg-black/40 px-2 py-1 rounded border border-emerald-500/20">
              Tx: 0300b886...b3896
            </span>
          </div>
        )}

        {/* Domain Filter */}
        <div className="flex flex-wrap gap-2 mt-8">
          {[
            'Financial Risk & Fraud',
            'Healthcare HIPAA Compliance',
            'Legal & Regulatory Adherence',
            'Cybersecurity Vulnerability Audit'
          ].map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedDomain === domain
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {benchmarkList.map((m, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden hover:border-cyan-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  {m.provider}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>

              <h3 className="text-base font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                {m.modelName}
              </h3>

              <div className="space-y-3 text-xs mb-6">
                <div className="flex justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-slate-400">Proven Accuracy:</span>
                  <span className="font-mono font-bold text-emerald-400">{m.accuracyScore}%</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-slate-400">Bias Risk Level:</span>
                  <span className="font-mono text-cyan-300">{m.biasRisk}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-slate-400">ZK Proof:</span>
                  <span className="font-mono text-violet-300">{m.proofHash}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span>Audited on Midnight</span>
                <span className="text-slate-300 font-medium">{m.verifiedAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works on Midnight */}
        <div className="mt-12 bg-slate-900/40 border border-white/5 rounded-2xl p-8">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" /> How Verifiable Model Benchmarks Work on Midnight
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 text-xs text-slate-400 leading-relaxed">
            <div className="p-4 rounded-xl bg-black/30 border border-white/5">
              <span className="font-bold text-slate-200 block mb-1">1. Private Witness Evaluation</span>
              <span>Model inference outputs are computed in a secure sandbox against proprietary benchmark datasets. Neither the weights nor test prompts are ever made public.</span>
            </div>
            <div className="p-4 rounded-xl bg-black/30 border border-white/5">
              <span className="font-bold text-slate-200 block mb-1">2. Zero-Knowledge Range Checks</span>
              <span>Compact circuits evaluate that output correctness exceeds the requested SLA (e.g. &gt;= 90%) and bias error rate remains beneath statutory thresholds.</span>
            </div>
            <div className="p-4 rounded-xl bg-black/30 border border-white/5">
              <span className="font-bold text-slate-200 block mb-1">3. Immutable Ledger Certification</span>
              <span>A verifiable cryptographic certificate is minted on the Midnight Preprod network, giving clients indisputable proof of AI safety.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
