'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  Shield,
  CheckCircle2,
  Lock,
  TrendingUp,
  Activity,
  Star,
  Users,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { ContributorReputation } from '@/database/db';

export default function ReputationPage() {
  const [reputation, setReputation] = useState<ContributorReputation | null>(null);

  useEffect(() => {
    fetch('/api/reputation?contributorId=contrib-001')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setReputation(data.reputation);
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-cyan-950/80 pb-6">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-cyan-950 text-cyan-300 border border-cyan-800">
            Spec 13 • Zero-Knowledge Trust Scores
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Privacy-Preserving Dataset Reputation
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Certifies contributor dataset credibility and verification success rates without revealing sensitive contents or records.
        </p>
      </div>

      {/* Main Reputation Card (Spec 13) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0C152B] via-[#091024] to-[#070B14] border border-cyan-500/30 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg shadow-cyan-500/20">
              <Award className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">
                  {reputation?.name || 'Dr. Sarah Lin (BioStat Lab)'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  TOP 1% CONTRIBUTOR
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Contributor ID: contrib-001 • Midnight DID Verified
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
            <EyeOff className="w-4 h-4" />
            <span>ZERO DATA EXPOSED</span>
          </div>
        </div>

        {/* 4 Core Reputation Metrics (Spec 13) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Verified Contributions</span>
            <span className="text-3xl font-extrabold text-white mt-1 block">
              {reputation?.verifiedContributions || 14}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">100% ZK Audited</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Average Quality</span>
            <span className="text-3xl font-extrabold text-cyan-400 mt-1 block">
              {reputation?.averageQuality || 94.7}
            </span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Benchmark &ge; 90</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Successful Verifications</span>
            <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">
              {reputation?.successfulVerifications || 13}
            </span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Passed on Midnight</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Requirement Match</span>
            <span className="text-3xl font-extrabold text-purple-400 mt-1 block">
              {reputation?.requirementMatchRate || 96}%
            </span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">High Schema Fit</span>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="p-4 rounded-xl bg-black/40 border border-cyan-950 text-xs text-slate-400 space-y-1">
          <span className="text-cyan-300 font-semibold font-mono block">Zero-Knowledge Reputation Guarantee:</span>
          <p className="leading-relaxed">
            This reputation score is computed from verified zero-knowledge proof outcomes registered on the Midnight ledger. No private records, sample entries, medical diagnoses, or financial balances are ever revealed or linked to this reputation profile.
          </p>
        </div>
      </div>
    </div>
  );
}
