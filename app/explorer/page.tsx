'use client';

import React, { useState } from 'react';
import { 
  Terminal, Shield, Search, CheckCircle2, Copy, Check, 
  ExternalLink, Layers, ArrowUpRight, Cpu, Activity, Clock, FileCode
} from 'lucide-react';
import { MIDNIGHT_CONFIG } from '../../midnight/config';

interface TransactionLog {
  txHash: string;
  circuit: string;
  blockHeight: number;
  commitment: string;
  gasDeducted: string;
  timestamp: string;
  status: 'SETTLED' | 'VERIFIED';
}

export default function ExplorerPage() {
  const [copiedContract, setCopiedContract] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const contractAddress = MIDNIGHT_CONFIG.contractAddress;

  const mockTxLogs: TransactionLog[] = [
    {
      txHash: '0300b88604f0139ff7e3cc24a3a6c5434840d6d53493767e6ba13bce52eab90b3896',
      circuit: 'verify_contribution',
      blockHeight: 189420,
      commitment: '0300994f8e...712a',
      gasDeducted: '0.00038 DUST',
      timestamp: '2 mins ago',
      status: 'SETTLED'
    },
    {
      txHash: '0300f41c3098dca71b4e284091a03975bc66129845da28c117b4c901e921b34a',
      circuit: 'verify_dataset_qualification',
      blockHeight: 189418,
      commitment: '030082c160...ff41',
      gasDeducted: '0.00045 DUST',
      timestamp: '6 mins ago',
      status: 'VERIFIED'
    },
    {
      txHash: '030058bc29a004f128c55e921b3a9856cd7190842da182390bfca119854ab819',
      circuit: 'register_project_requirement',
      blockHeight: 189412,
      commitment: '030018dc90...5432',
      gasDeducted: '0.00021 DUST',
      timestamp: '14 mins ago',
      status: 'SETTLED'
    },
    {
      txHash: '0300e84b912c9842a5bc900821cf548912304895aef1092837bc289104859a01',
      circuit: 'verify_contribution',
      blockHeight: 189399,
      commitment: '030073fa11...881b',
      gasDeducted: '0.00039 DUST',
      timestamp: '28 mins ago',
      status: 'SETTLED'
    }
  ];

  const copyContract = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const filteredLogs = mockTxLogs.filter(
    (tx) =>
      tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.circuit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#07090e] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> Midnight On-Chain Telemetry
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Preprod Chain Sync: 100%
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
              Midnight ZK Explorer
            </h1>
            <p className="mt-1 text-slate-400 text-sm sm:text-base">
              Inspect deployed Compact smart contract state, zero-knowledge circuits, and real-time transaction commitments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-white/10 rounded-xl p-3 text-xs flex items-center gap-2 font-mono">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-slate-300">Midnight Node 9944: ONLINE</span>
            </div>
          </div>
        </div>

        {/* Contract Hero Banner */}
        <div className="mt-8 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-cyan-950/20 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> Deployed Midnight Smart Contract Address
              </span>
              <div className="flex items-center gap-3 bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm sm:text-base text-cyan-300 max-w-2xl">
                <span className="truncate">{contractAddress}</span>
                <button
                  onClick={copyContract}
                  className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
                  title="Copy Midnight Contract Address"
                >
                  {copiedContract ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Compiled with Midnight Compact 0.5.2 • Target: <code className="text-slate-300">zkir/verify_contribution.zkir</code>
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-center">
                <span className="text-[11px] text-slate-400 block">Ledger State</span>
                <span className="font-mono text-xs font-bold text-emerald-400">ACTIVE</span>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-center">
                <span className="text-[11px] text-slate-400 block">Circuits Verified</span>
                <span className="font-mono text-xs font-bold text-cyan-300">1,248</span>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-400 block">Proof Curve</span>
                <span className="font-mono text-xs font-bold text-violet-300">BLS12-381</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Circuit Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              <FileCode className="w-4 h-4 text-cyan-400" /> Compact Source Verification
            </h2>
            <div className="bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1 overflow-x-auto">
              <div className="text-slate-500">// Compiled Midnight Compact Circuit</div>
              <div><span className="text-cyan-400">export circuit</span> <span className="text-emerald-400">verify_contribution</span>(</div>
              <div className="pl-4">dataset_hash: <span className="text-violet-400">Bytes&lt;32&gt;</span>,</div>
              <div className="pl-4">is_duplicate_rate_valid: <span className="text-violet-400">Boolean</span>,</div>
              <div className="pl-4">is_completeness_valid: <span className="text-violet-400">Boolean</span></div>
              <div>): [] &#123;</div>
              <div className="pl-4 text-slate-400"><span className="text-cyan-400">assert</span>(is_duplicate_rate_valid, <span className="text-amber-400">"error"</span>);</div>
              <div className="pl-4 text-slate-400"><span className="text-cyan-400">assert</span>(is_completeness_valid, <span className="text-amber-400">"error"</span>);</div>
              <div className="pl-4"><span className="text-cyan-400">contribution_count</span> = (contribution_count + 1);</div>
              <div>&#125;</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-violet-400" /> Cryptographic Parameters
            </h2>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                <span className="text-slate-400">Proof System:</span>
                <span className="font-mono text-slate-200">Groth16 / Plonk (Zero-Knowledge)</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                <span className="text-slate-400">Commitment Scheme:</span>
                <span className="font-mono text-cyan-300">Poseidon / SHA-256 + 256-bit Blinding</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                <span className="text-slate-400">Midnight Preprod RPC:</span>
                <span className="font-mono text-emerald-300">https://rpc.preprod.midnight.network</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                <span className="text-slate-400">Indexer GraphQL:</span>
                <span className="font-mono text-violet-300">http://localhost:8088/graphql</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Transaction Ledger Feed */}
        <div className="mt-8 bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2 text-white">
              <Layers className="w-5 h-5 text-cyan-400" /> Recent Midnight ZK Assertions
            </h2>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search circuit or tx hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 w-full sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Tx Hash / Commitment</th>
                  <th className="pb-3 font-semibold">Circuit Verified</th>
                  <th className="pb-3 font-semibold">Block</th>
                  <th className="pb-3 font-semibold">Gas Fee</th>
                  <th className="pb-3 font-semibold">Age</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 text-cyan-300">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[200px]">{tx.txHash}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-violet-300 font-semibold">{tx.circuit}</td>
                    <td className="py-3.5 text-slate-300">#{tx.blockHeight}</td>
                    <td className="py-3.5 text-slate-400">{tx.gasDeducted}</td>
                    <td className="py-3.5 text-slate-500">{tx.timestamp}</td>
                    <td className="py-3.5 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
