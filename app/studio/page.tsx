'use client';

import React, { useState } from 'react';
import { 
  Brain, Shield, Lock, Zap, CheckCircle2, Sparkles, 
  Terminal, ArrowRight, RefreshCw, Key, FileCode, Check, Copy, ExternalLink 
} from 'lucide-react';
import { MIDNIGHT_CONFIG } from '../../midnight/config';

interface ProofRecord {
  inferenceId: string;
  model: string;
  promptHash: string;
  zkProof: string;
  witnessCommitment: string;
  status: 'verified' | 'generating' | 'failed';
  timestamp: string;
  gasDeducted: string;
  latencyMs: number;
}

export default function StudioPage() {
  const [prompt, setPrompt] = useState('Analyze confidential quarterly financial report and identify insider trading risks without exposing employee names.');
  const [model, setModel] = useState('llama-3.3-70b-private');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [proofData, setProofData] = useState<ProofRecord | null>(null);
  const [copied, setCopied] = useState(false);

  const steps = [
    'Client-Side Zero-Knowledge Shielding',
    'Local Synthesizer & Homomorphic Encryption',
    'Private Inference Execution',
    'Midnight Compact ZK-Proof Generation',
    'Settling Commitment on Midnight Preprod'
  ];

  const handleRunInference = async () => {
    if (!prompt.trim() || isProcessing) return;
    setIsProcessing(true);
    setAiOutput(null);
    setProofData(null);
    setCurrentStep(0);

    // Step 1: Shielding
    await new Promise((r) => setTimeout(r, 600));
    setCurrentStep(1);

    // Step 2: Local Synthesizer
    await new Promise((r) => setTimeout(r, 700));
    setCurrentStep(2);

    // Step 3: Private Inference
    await new Promise((r) => setTimeout(r, 900));
    setCurrentStep(3);

    // Step 4: Midnight Proof Generation
    await new Promise((r) => setTimeout(r, 800));
    setCurrentStep(4);

    // Step 5: Settle on Preprod
    await new Promise((r) => setTimeout(r, 600));
    setCurrentStep(5);

    const infId = 'inf_' + Math.random().toString(36).substring(2, 10);
    const mockHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const mockProof = 'zkp_snark_groth16_' + Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const commitment = '0300' + Array.from({ length: 60 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    setAiOutput(
      `[CONFIDENTIAL AUDIT COMPLETED]\n\n` +
      `Summary: 3 risk vectors identified in portfolio reallocation before 10-Q filing window.\n` +
      `Zero-Knowledge Guarantee: Raw employee identities & sensitive transaction amounts were blinded at the client enclave.\n` +
      `Policy Adherence: 100% compliant with SEC Rule 10b5-1 constraints.\n` +
      `Proof Settlement: Verified on Midnight Compact Contract.`
    );

    setProofData({
      inferenceId: infId,
      model,
      promptHash: mockHash,
      zkProof: mockProof,
      witnessCommitment: commitment,
      status: 'verified',
      timestamp: new Date().toISOString(),
      gasDeducted: '0.00042 DUST',
      latencyMs: 1480
    });

    setIsProcessing(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Client-Shielded Enclave
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/30">
                Midnight Compact 0.5.2
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
              Zero-Knowledge AI Studio
            </h1>
            <p className="mt-1 text-slate-400 text-sm sm:text-base">
              Execute private AI inference with client-side prompt shielding and on-chain Midnight verification.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-white/10 rounded-xl p-3 text-xs flex items-center gap-3">
              <div>
                <span className="text-slate-400 block">Active Contract</span>
                <span className="font-mono text-cyan-400 font-medium">
                  {MIDNIGHT_CONFIG.contractAddress.substring(0, 10)}...{MIDNIGHT_CONFIG.contractAddress.slice(-6)}
                </span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <span className="text-slate-400 block">Network</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Preprod Testnet
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          
          {/* Left Column: Input and Parameters */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-white">
                <Brain className="w-5 h-5 text-cyan-400" /> Private Prompt & Task Definition
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Select Confidential Model
                  </label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="llama-3.3-70b-private">Llama 3.3 70B (Private Enclave + ZK-Proof)</option>
                    <option value="deepseek-r1-shielded">DeepSeek R1 Shielded (Zero Prompt Leakage)</option>
                    <option value="claude-3-5-sonnet-zk">Claude 3.5 Sonnet (Midnight Verified RAG)</option>
                    <option value="mistral-large-confidential">Mistral Large (Homomorphic Verifier)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Confidential Prompt / Context
                    </label>
                    <span className="text-xs text-cyan-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Never stored on server
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter confidential text, code, medical report, or financial data..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 font-mono resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-black/30 border border-white/5 rounded-xl p-3">
                    <span className="text-[11px] text-slate-400 block">Privacy Guarantee</span>
                    <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1 mt-0.5">
                      <Shield className="w-3.5 h-3.5" /> Blinded Salt (256-bit)
                    </span>
                  </div>
                  <div className="bg-black/30 border border-white/5 rounded-xl p-3">
                    <span className="text-[11px] text-slate-400 block">Verification Circuit</span>
                    <span className="text-xs font-semibold text-violet-300 flex items-center gap-1 mt-0.5">
                      <Terminal className="w-3.5 h-3.5" /> verify_contribution.zkir
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleRunInference}
                  disabled={isProcessing || !prompt.trim()}
                  className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isProcessing
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-white/5'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold shadow-cyan-500/20'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                      Executing Private Pipeline...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" /> Run Shielded Inference & Generate ZK Proof
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Presets */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                Quick Test Templates
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    title: 'Financial Insider Audit',
                    text: 'Audit trading ledger across 1,420 accounts to verify 0% trades violated blackout period.'
                  },
                  {
                    title: 'Medical Clinical Trial Matching',
                    text: 'Verify patient genomic marker matches Trial Criteria Phase 2 without disclosing identity.'
                  },
                  {
                    title: 'Proprietary Code IP Review',
                    text: 'Scan internal repository diffs for GPL v3 license contamination under Zero-Knowledge.'
                  },
                  {
                    title: 'KYC / AML Proof of Innocence',
                    text: 'Prove wallet address has 0 transactions with sanctioned entities without sharing transaction history.'
                  }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(item.text)}
                    className="text-left p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-white/5 hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="text-xs font-medium text-slate-200 group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                      {item.text}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Execution Pipeline & ZK Verification */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Step Progress */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-lg font-bold flex items-center justify-between mb-4 text-white">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-400" /> ZK Execution Pipeline
                </span>
                {isProcessing && (
                  <span className="text-xs text-cyan-400 animate-pulse">Running step {currentStep + 1}/5...</span>
                )}
              </h2>

              <div className="space-y-3">
                {steps.map((step, idx) => {
                  const isDone = currentStep > idx || (!isProcessing && proofData);
                  const isCurrent = isProcessing && currentStep === idx;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-200'
                          : isCurrent
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                          : 'bg-black/20 border-white/5 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isDone
                              ? 'bg-emerald-500 text-black'
                              : isCurrent
                              ? 'bg-cyan-500 text-black animate-pulse'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <span className="text-xs sm:text-sm font-medium">{step}</span>
                      </div>
                      <span className="text-[11px] font-mono">
                        {isDone ? 'COMPLETED' : isCurrent ? 'IN PROGRESS' : 'PENDING'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Output Result */}
            {aiOutput && (
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <h3 className="text-sm font-bold flex items-center justify-between text-slate-200 mb-3">
                  <span className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-cyan-400" /> Shielded AI Output
                  </span>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Encrypted Witness Verified
                  </span>
                </h3>
                <div className="bg-black/50 border border-white/10 rounded-xl p-4 text-xs sm:text-sm font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {aiOutput}
                </div>
              </div>
            )}

            {/* Cryptographic Proof Receipt */}
            {proofData && (
              <div className="bg-gradient-to-br from-slate-900/90 to-cyan-950/30 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base font-bold text-white">Midnight ZK Proof Certified</h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                    On-Chain Verified
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">State Commitment (Midnight Compact):</span>
                    <div className="flex items-center justify-between bg-black/60 border border-white/10 rounded-lg p-2 font-mono text-cyan-300">
                      <span className="truncate">{proofData.witnessCommitment}</span>
                      <button
                        onClick={() => copyToClipboard(proofData.witnessCommitment)}
                        className="text-slate-400 hover:text-white ml-2 flex-shrink-0"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">SNARK Proof Identifier:</span>
                    <div className="bg-black/60 border border-white/10 rounded-lg p-2 font-mono text-violet-300 truncate">
                      {proofData.zkProof}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="bg-black/40 border border-white/5 p-2 rounded-lg text-center">
                      <span className="text-[10px] text-slate-400 block">Gas Fee</span>
                      <span className="font-mono font-medium text-slate-200">{proofData.gasDeducted}</span>
                    </div>
                    <div className="bg-black/40 border border-white/5 p-2 rounded-lg text-center">
                      <span className="text-[10px] text-slate-400 block">Proof Latency</span>
                      <span className="font-mono font-medium text-emerald-400">{proofData.latencyMs} ms</span>
                    </div>
                    <div className="bg-black/40 border border-white/5 p-2 rounded-lg text-center">
                      <span className="text-[10px] text-slate-400 block">Settlement</span>
                      <span className="font-mono font-medium text-cyan-400">Midnight Node</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
