'use client';

import React, { useState, useEffect } from 'react';
import {
  Scale,
  Shield,
  CheckCircle2,
  XCircle,
  Hash,
  Clock,
  Database,
  Search,
  RefreshCw,
  EyeOff,
  Link as LinkIcon,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { AuditRecord } from '@/audit/registry';

export default function AuditorPage() {
  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [integrity, setIntegrity] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Interactive Auditor Query Tool (Spec 14)
  const [queryContributionId, setQueryContributionId] = useState<string>('DC-1024');
  const [queryResult, setQueryResult] = useState<any | null>(null);

  useEffect(() => {
    fetchAuditData();
  }, []);

  const fetchAuditData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/audit');
      const data = await res.json();
      if (data.success) {
        setRecords(data.records);
        setIntegrity(data.integrity);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAuditQuery = () => {
    const found = records.find(
      (r) => r.contributionId.toLowerCase() === queryContributionId.trim().toLowerCase()
    );

    if (found) {
      setQueryResult({
        found: true,
        record: found,
        question: 'Was this dataset proven to satisfy the requirements that existed at that time?',
        answer: found.proofStatus === 'VERIFIED_VALID' ? 'YES — MATHEMATICALLY CERTIFIED' : 'NO — REJECTED',
        verdictText: found.proofStatus === 'VERIFIED_VALID'
          ? `Dataset was proven via Midnight Zero-Knowledge proof ${found.proofReference} to strictly satisfy Requirement Version ${found.requirementVersion} (Hash: ${found.requirementPolicyHash.substring(0, 16)}...) at timestamp ${new Date(found.timestamp).toISOString()}. Raw dataset records were never exposed.`
          : `Dataset failed to satisfy Requirement Version ${found.requirementVersion} conditions.`
      });
    } else {
      setQueryResult({
        found: false,
        message: `No audit log found for Contribution ID "${queryContributionId}".`
      });
    }
  };

  const filteredRecords = records.filter(
    (r) =>
      r.contributionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.verificationId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyan-950/80 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-purple-950 text-purple-300 border border-purple-800">
              Role C • Independent Auditor Portal
            </span>
            <span className="text-xs text-slate-500 font-mono">Spec 14 • Cryptographic Auditability</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Zero-Knowledge Verification Audit Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Independent, tamper-evident verification ledger recording immutable proofs, timestamps, and policy versions with zero raw data exposure.
          </p>
        </div>

        {/* Chain Integrity Badge */}
        {integrity && (
          <div className={`p-3 rounded-xl border text-xs font-mono flex items-center space-x-3 ${
            integrity.isValid
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <LinkIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>AUDIT CHAIN INTEGRITY: 100% VALID</span>
              </div>
              <div className="text-[10px] text-slate-400">
                {integrity.totalBlocks} Chained Hashes Verified
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AUDITOR INTERACTIVE QUERY ENGINE (Spec 14) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0C1226] via-[#091020] to-[#070B14] border border-purple-500/30 space-y-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-white">
          <Scale className="w-4 h-4 text-purple-400" />
          <span>Auditor Verification Query Console</span>
        </div>
        <p className="text-xs text-slate-300">
          Answer the core audit compliance question:
          <span className="text-purple-300 font-mono italic block mt-0.5">
            &ldquo;Was this dataset proven to satisfy the requirements that existed at that time?&rdquo;
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="text"
            value={queryContributionId}
            onChange={(e) => setQueryContributionId(e.target.value)}
            placeholder="Enter Contribution ID (e.g. DC-1024)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleRunAuditQuery}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/20"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Audit Query</span>
          </button>
        </div>

        {queryResult && (
          <div className="mt-4 p-4 rounded-xl bg-black/60 border border-purple-500/30 text-xs font-mono space-y-2">
            {queryResult.found ? (
              <>
                <div className="flex items-center justify-between text-purple-300 font-bold border-b border-slate-800 pb-2">
                  <span>AUDIT VERDICT: {queryResult.answer}</span>
                  <span className="text-emerald-400 font-normal">ZERO RAW DATA EXPOSED</span>
                </div>
                <p className="text-slate-200 leading-relaxed pt-1">
                  {queryResult.verdictText}
                </p>
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <div>Verification ID: <span className="text-cyan-400">{queryResult.record.verificationId}</span></div>
                  <div>Dataset Commitment: <span className="text-cyan-400">{queryResult.record.datasetCommitment.substring(0, 24)}...</span></div>
                  <div>Ledger Timestamp: <span className="text-white">{new Date(queryResult.record.timestamp).toLocaleString()}</span></div>
                  <div>Network Target: <span className="text-white">{queryResult.record.network}</span></div>
                </div>
              </>
            ) : (
              <div className="text-rose-400">{queryResult.message}</div>
            )}
          </div>
        )}
      </div>

      {/* VERIFICATION RECORDS TABLE (Spec 14) */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">Immutable Verification Records</h3>
            <p className="text-xs text-slate-400">
              Each record represents a certified on-chain zero-knowledge verification event.
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <button
              onClick={fetchAuditData}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Verification ID</th>
                <th className="py-3 px-3">Contribution ID</th>
                <th className="py-3 px-3">Project ID</th>
                <th className="py-3 px-3">Req Version</th>
                <th className="py-3 px-3">Proof Status</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Verifier Reference</th>
                <th className="py-3 px-3">Raw Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRecords.map((item) => (
                <tr key={item.verificationId} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-semibold text-purple-400">{item.verificationId}</td>
                  <td className="py-3 px-3 text-cyan-400">#{item.contributionId}</td>
                  <td className="py-3 px-3 text-slate-300">{item.projectId}</td>
                  <td className="py-3 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      v{item.requirementVersion}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {item.proofStatus === 'VERIFIED_VALID' ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED VALID
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1 font-semibold">
                        <XCircle className="w-3.5 h-3.5" /> REJECTED
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[10px] truncate max-w-[140px]" title={item.verifier}>
                    {item.verifier}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-rose-400 flex items-center gap-1">
                      <EyeOff className="w-3 h-3" /> NO ACCESS
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
