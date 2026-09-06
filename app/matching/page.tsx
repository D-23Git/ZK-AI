'use client';

import React, { useState } from 'react';
import {
  Search,
  Lock,
  CheckCircle2,
  Sparkles,
  Shield,
  ArrowRight,
  Database,
  Cpu,
  EyeOff,
  Filter
} from 'lucide-react';
import Link from 'next/link';

export default function MatchingPage() {
  const [category, setCategory] = useState<string>('Healthcare');
  const [minRecords, setMinRecords] = useState<number>(50000);
  const [minCompleteness, setMinCompleteness] = useState<number>(95);
  const [minQuality, setMinQuality] = useState<number>(90);
  const [hasSearched, setHasSearched] = useState<boolean>(true);

  // Simulated private matching: Contributor's local dataset matches without revealing records
  const isMatch = category === 'Healthcare' && minRecords <= 50000 && minCompleteness <= 98 && minQuality <= 95;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-cyan-950/80 pb-6">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-cyan-950 text-cyan-300 border border-cyan-800">
            Spec 12 • Privacy-Preserving Discovery
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Privacy-Preserving Data Matching
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Search for AI training datasets by mathematical qualification predicates without contributors revealing raw sensitive rows.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Search Predicate Filters */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-white mb-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span>Developer Search Query</span>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Target Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Manufacturing">Manufacturing</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Minimum Records: <span className="text-white font-bold">{minRecords.toLocaleString()}+</span>
            </label>
            <input
              type="range"
              min="5000"
              max="100000"
              step="5000"
              value={minRecords}
              onChange={(e) => setMinRecords(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Minimum Completeness: <span className="text-white font-bold">{minCompleteness}%+</span>
            </label>
            <input
              type="range"
              min="80"
              max="99"
              value={minCompleteness}
              onChange={(e) => setMinCompleteness(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Minimum Quality Score: <span className="text-white font-bold">{minQuality} / 100</span>
            </label>
            <input
              type="range"
              min="70"
              max="98"
              value={minQuality}
              onChange={(e) => setMinQuality(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <button
            onClick={() => setHasSearched(true)}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Privacy Registry</span>
          </button>
        </div>

        {/* Matching Result Display */}
        <div className="lg:col-span-7 space-y-6">
          {hasSearched && isMatch ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-[#0B1526] to-[#070B14] border border-emerald-500/40 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-emerald-300">MATCH FOUND</h2>
                    <p className="text-xs text-slate-400">Contributor dataset qualified in local zero-knowledge sandbox</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
                  5 / 5 SATISFIED
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">CATEGORY</span>
                  <span className="text-white font-bold">{category}</span>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">ZK PROOF</span>
                  <span className="text-emerald-400 font-bold">AVAILABLE</span>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">RAW DATASET</span>
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> PRIVATE
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="text-slate-400 font-semibold font-mono">Qualification Audit Proof:</div>
                <ul className="space-y-1 font-mono text-[11px] text-slate-300">
                  <li className="text-emerald-400">✓ Record count constraint (&ge; {minRecords.toLocaleString()}) satisfied</li>
                  <li className="text-emerald-400">✓ Completeness constraint (&ge; {minCompleteness}%) satisfied</li>
                  <li className="text-emerald-400">✓ Quality score constraint (&ge; {minQuality}) satisfied</li>
                  <li className="text-emerald-400">✓ Schema integrity certified</li>
                </ul>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
                <p className="text-xs text-slate-400">
                  The contributor chooses whether to proceed and submit their proof to your project.
                </p>
                <Link
                  href="/contributor"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 whitespace-nowrap"
                >
                  <span>Proceed to Contribution</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <EyeOff className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Matching Datasets Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No active contributor datasets satisfy your specified criteria thresholds. Try adjusting the record volume or completeness parameters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
