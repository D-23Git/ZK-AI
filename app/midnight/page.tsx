'use client';

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Code,
  Terminal,
  ExternalLink,
  Layers,
  Copy,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { MidnightIntegrationStatus } from '@/midnight/adapter';

export default function MidnightPage() {
  const [status, setStatus] = useState<MidnightIntegrationStatus | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/midnight/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStatus(data.status);
      })
      .catch((e) => console.error(e));
  }, []);

  const compactContractSnippet = `// =============================================================================
// Midnight Compact Smart Contract: PrivateData AI
// "Prove that your data qualifies without revealing your data"
// Language: Midnight Compact DSL (Preprod / Testnet compatible)
// =============================================================================

pragma language_version >= 0.14.0;
import CompactStandardLibrary;

export ledger verified_contributions: Map<Bytes<32>, ContributionRecord>;
export ledger project_requirements: Map<Bytes<32>, RequirementSpec>;

export circuit verify_dataset_qualification(
    contribution_id: Bytes<32>,
    project_id: Bytes<32>,
    requirement_version: Uint<32>,
    dataset_commitment: Bytes<32>,
    contributor_id: Bytes<32>,
    timestamp: Uint<64>
): Boolean {
    // 1. Fetch requirement specification
    const req_key = hash_requirement_key(project_id, requirement_version);
    assert project_requirements.member(req_key) "Target project requirement does not exist";
    const req = project_requirements.lookup(req_key);

    // 2. Prevent replay attacks
    assert !verified_contributions.member(contribution_id) "Contribution ID has already been verified";

    // 3. Obtain private dataset witness inside ZK prover sandbox
    const (
        actual_records,
        actual_completeness,
        actual_duplicate_rate,
        actual_quality,
        actual_format_hash,
        actual_schema_hash,
        witness_salt
    ) = dataset_private_witness(dataset_commitment);

    // 4. Verify cryptographic commitment integrity: H(salt || data)
    assert compute_dataset_commitment(witness_salt, actual_records, actual_completeness, actual_quality, actual_schema_hash) == dataset_commitment;

    // 5. Zero-Knowledge Range & Compatibility Constraints
    const is_qualified = (actual_records >= req.min_records) &&
                         (actual_completeness >= req.min_completeness) &&
                         (actual_duplicate_rate <= req.max_duplicate_rate) &&
                         (actual_quality >= req.min_quality_score);
    assert is_qualified "Dataset does not meet project requirements";

    // 6. Record verifiable qualification on the ledger (No raw records)
    verified_contributions.insert(contribution_id, ContributionRecord {
        contribution_id: contribution_id,
        project_id: project_id,
        requirement_version: requirement_version,
        dataset_commitment: dataset_commitment,
        contributor_id: contributor_id,
        verified_at: timestamp,
        is_qualified: true,
        proof_reference: dataset_commitment
    });

    return true;
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(compactContractSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-cyan-950/80 pb-6">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-cyan-950 text-cyan-300 border border-cyan-800">
            Spec 8 & 24 • Midnight Zero-Knowledge Infrastructure
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Midnight Smart Contract & ZK Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Architecture, Compact DSL contract specifications, cryptographic guarantees, and live Preprod deployment configuration.
        </p>
      </div>

      {/* DISCLOSURE CARD (Mandatory Spec 24) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-cyan-950/30 via-[#0A1224] to-[#070B14] border border-cyan-500/40 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Midnight Integration Disclosure (Spec 24)</h2>
              <p className="text-xs text-slate-400">Transparent distinction between Cryptographic vs Simulated Components</p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
            Target: Preprod & Devnet
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* What is Cryptographic */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-3">
            <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>WHAT IS CRYPTOGRAPHICALLY ENFORCED:</span>
            </div>
            <ul className="space-y-2 text-slate-300 font-mono text-[11px]">
              <li>
                <strong className="text-white">• Dataset Commitments:</strong> SHA-256 / Poseidon hashing with 256-bit blinding salt, binding private dataset rows to on-chain commitments.
              </li>
              <li>
                <strong className="text-white">• Range-Proof Constraints:</strong> Strict predicate math evaluating record volume, completeness %, duplicate ceiling, and schema match.
              </li>
              <li>
                <strong className="text-white">• Replay Protection:</strong> Cryptographic nonces, signatures, and time-to-live expiration timestamps.
              </li>
              <li>
                <strong className="text-white">• Tamper-Evident Audit Chain:</strong> Chained SHA-256 hashes ensuring historical audit records cannot be mutated.
              </li>
            </ul>
          </div>

          {/* What is Simulated */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40 space-y-3">
            <div className="text-cyan-300 font-bold flex items-center gap-1.5 text-sm">
              <Cpu className="w-4 h-4" />
              <span>WHAT IS LOCALLY SIMULATED / MODULAR:</span>
            </div>
            <ul className="space-y-2 text-slate-300 font-mono text-[11px]">
              <li>
                <strong className="text-white">• In-Process Devnet Ledger:</strong> Provides instantaneous, zero-latency verification without waiting for block confirmations or wallet popups during hackathon evaluation.
              </li>
              <li>
                <strong className="text-white">• Modular Proof Service Interface:</strong> Follows exact <code className="text-cyan-400">DatasetProofService</code> contract, allowing seamless swap with the live Midnight SDK.
              </li>
              <li>
                <strong className="text-white">• Authentic Compact Contract:</strong> Pre-compiled in <code className="text-cyan-400">midnight/contract/privatedata_ai.compact</code> ready for Preprod deployment.
              </li>
            </ul>
          </div>
        </div>

        {/* How to Connect Live Network */}
        <div className="p-4 rounded-xl bg-black/50 border border-slate-800 text-xs font-mono space-y-2">
          <div className="text-slate-300 font-bold">HOW TO CONNECT LIVE MIDNIGHT PREPROD:</div>
          <ol className="text-slate-400 space-y-1 text-[11px]">
            {status?.howToConnectLiveNetwork.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* COMPACT SMART CONTRACT VIEWER */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white">Midnight Compact Smart Contract</h3>
              <p className="text-xs text-slate-400 font-mono">midnight/contract/privatedata_ai.compact</p>
            </div>
          </div>
          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        <pre className="p-5 rounded-xl bg-[#060A14] border border-cyan-950 text-xs font-mono text-cyan-300 overflow-x-auto max-h-[500px] leading-relaxed">
          {compactContractSnippet}
        </pre>
      </div>

      {/* SPEC 8: PROOF SERVICE INTERFACE */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Spec 8: Proof Service Interface</h3>
        </div>
        <pre className="p-4 rounded-xl bg-[#070B14] border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto">
{`interface DatasetProofService {
  generateProof(input: ProofInput): Promise<Proof>;
  verifyProof(proof: Proof): Promise<VerificationResult>;
}`}
        </pre>
        <p className="text-xs text-slate-400">
          Implemented in <code className="text-cyan-400 font-mono">zk/proofEngine.ts</code> and bridged via <code className="text-cyan-400 font-mono">midnight/adapter.ts</code>.
        </p>
      </div>
    </div>
  );
}
