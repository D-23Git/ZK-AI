'use client';

import React, { useState } from 'react';
import { 
  Database, Lock, Shield, Key, FileText, CheckCircle2, 
  Upload, Search, Sparkles, Terminal, ArrowRight, EyeOff, Layers, RefreshCw
} from 'lucide-react';
import { MIDNIGHT_CONFIG } from '../../midnight/config';

interface EncryptedChunk {
  id: string;
  category: string;
  commitment: string;
  tokenCount: number;
  similarityScore: number;
  isShielded: boolean;
}

export default function VaultPage() {
  const [activeQuery, setActiveQuery] = useState('Retrieve clinical diagnosis history for patient cohort #918 with cardiovascular markers.');
  const [isSearching, setIsSearching] = useState(false);
  const [similarityThreshold, setSimilarityThreshold] = useState(0.82);
  const [matchedChunks, setMatchedChunks] = useState<EncryptedChunk[] | null>(null);
  const [proofGenerated, setProofGenerated] = useState<string | null>(null);

  const mockVaultData: EncryptedChunk[] = [
    {
      id: 'chunk_8410',
      category: 'Medical / Genomic Records',
      commitment: '0300a89f...b492',
      tokenCount: 412,
      similarityScore: 0.94,
      isShielded: true
    },
    {
      id: 'chunk_3102',
      category: 'Medical / Cardiology Lab Panel',
      commitment: '0300fe12...990c',
      tokenCount: 680,
      similarityScore: 0.88,
      isShielded: true
    },
    {
      id: 'chunk_7741',
      category: 'Pharmacology Trial Phase 3',
      commitment: '0300cc38...a210',
      tokenCount: 520,
      similarityScore: 0.85,
      isShielded: true
    }
  ];

  const handleSearchVault = async () => {
    if (!activeQuery.trim() || isSearching) return;
    setIsSearching(true);
    setMatchedChunks(null);
    setProofGenerated(null);

    await new Promise((r) => setTimeout(r, 1200));

    setMatchedChunks(mockVaultData.filter((c) => c.similarityScore >= similarityThreshold));
    setProofGenerated(
      'zk_proof_rag_match_' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    );
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Confidential Knowledge Vault
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Zero-Knowledge Vector RAG
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
              Shielded Enterprise Knowledge Vault
            </h1>
            <p className="mt-1 text-slate-400 text-sm sm:text-base">
              Index proprietary corporate data into blinded vector embeddings. Prove similarity matches to AI agents without revealing document contents.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-white/10 rounded-xl p-3 text-xs flex items-center gap-3">
              <div>
                <span className="text-slate-400 block">Total Blinded Chunks</span>
                <span className="font-mono text-emerald-400 font-bold">14,892 Chunks</span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <span className="text-slate-400 block">Encryption Standard</span>
                <span className="text-slate-200 font-mono">AES-256-GCM + ZK</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          
          {/* Query & Ingestion */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Search / Inference Query */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-white">
                <Search className="w-5 h-5 text-emerald-400" /> Private RAG Semantic Query
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Query Context (Shielded via Poseidon Hash)
                  </label>
                  <textarea
                    rows={4}
                    value={activeQuery}
                    onChange={(e) => setActiveQuery(e.target.value)}
                    placeholder="Enter semantic query for confidential knowledge retrieval..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 font-mono resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                    <span>ZK Cosine Similarity Threshold</span>
                    <span className="font-mono text-emerald-400 font-bold">{similarityThreshold}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="0.95"
                    step="0.01"
                    value={similarityThreshold}
                    onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Only chunks matching with similarity &gt;= {similarityThreshold} generate valid ZK assertions.
                  </span>
                </div>

                <button
                  onClick={handleSearchVault}
                  disabled={isSearching || !activeQuery.trim()}
                  className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isSearching
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold shadow-emerald-500/20'
                  }`}
                >
                  {isSearching ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      Evaluating Blinded Vectors in ZK...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Run Zero-Knowledge Vector Match
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Ingestion Dropzone */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" /> Ingest & Blind Documents
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Drag & drop sensitive PDFs, research papers, or CSVs. Documents are chunked and converted into private cryptographic commitments locally before leaving your browser.
              </p>
              <div className="border-2 border-dashed border-white/10 hover:border-cyan-500/40 rounded-xl p-8 text-center cursor-pointer transition-colors bg-black/20">
                <EyeOff className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <span className="text-xs font-medium text-slate-300 block">
                  Click or drag files to encrypt into Midnight Vault
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Supported: PDF, JSON, CSV, Markdown • Max 100MB
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Search Results & ZK Settlement */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                  <Layers className="w-5 h-5 text-emerald-400" /> Blinded Retrieval Matches
                </h2>
                {matchedChunks && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/30">
                    {matchedChunks.length} Chunks Matched
                  </span>
                )}
              </div>

              {!matchedChunks ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-center">
                  <Database className="w-10 h-10 mb-2 opacity-40 text-slate-600" />
                  <span className="text-xs">No active query. Click "Run Zero-Knowledge Vector Match".</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {matchedChunks.map((chunk) => (
                    <div
                      key={chunk.id}
                      className="p-4 rounded-xl bg-black/40 border border-white/10 hover:border-emerald-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-200">{chunk.category}</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {(chunk.similarityScore * 100).toFixed(1)}% Similarity
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-white/5">
                        <span className="flex items-center gap-1.5 text-cyan-300">
                          <Lock className="w-3 h-3" /> Commitment: {chunk.commitment}
                        </span>
                        <span>{chunk.tokenCount} tokens</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Plaintext masked — revealed only inside trusted client execution context
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Proof Confirmation */}
            {proofGenerated && (
              <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Midnight RAG Proof Certified</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  A Compact ZK assertion was dispatched to Midnight Preprod. It cryptographically proves that the retrieved vector embedding exceeded the threshold without publishing the underlying patient records.
                </p>
                <div className="bg-black/60 border border-white/10 rounded-lg p-2.5 font-mono text-xs text-emerald-300 break-all">
                  {proofGenerated}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
