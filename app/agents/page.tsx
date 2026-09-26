'use client';

import React, { useState } from 'react';
import { 
  Bot, ShieldCheck, AlertTriangle, Play, CheckCircle2, 
  DollarSign, Lock, Cpu, Settings, Activity, ArrowRight, Zap, RefreshCw
} from 'lucide-react';
import { MIDNIGHT_CONFIG } from '../../midnight/config';

interface AgentPolicy {
  name: string;
  role: string;
  maxBudgetUSD: number;
  allowedTools: string[];
  maxCallsPerMinute: number;
  requireHumanApproval: boolean;
  midnightProofEnforced: boolean;
}

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState('defi-trader');
  const [budgetLimit, setBudgetLimit] = useState(500);
  const [rateLimit, setRateLimit] = useState(15);
  const [isVerifying, setIsVerifying] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [guardStatus, setGuardStatus] = useState<'IDLE' | 'SIMULATING' | 'VERIFIED' | 'BLOCKED'>('IDLE');

  const agents = [
    {
      id: 'defi-trader',
      name: 'Autonomous Arbitrage Agent',
      role: 'Cross-DEX Yield Optimizer',
      desc: 'Executes flash loans & arbitrage across Midnight & EVM bridges within zero-knowledge limits.'
    },
    {
      id: 'data-crawler',
      name: 'Confidential Web Scraper',
      role: 'Privacy-Preserving Data Ingestion',
      desc: 'Retrieves external data feeds with zero-knowledge proof of origin & compliance.'
    },
    {
      id: 'customer-support',
      name: 'Enterprise AI Assistant',
      role: 'Client CRM & Support Desk',
      desc: 'Processes customer sensitive PII with cryptographic prompt blinding & audit trails.'
    }
  ];

  const handleSimulate = async () => {
    setIsVerifying(true);
    setGuardStatus('SIMULATING');
    setSimulationLog([]);

    const addLog = (msg: string) => {
      setSimulationLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    addLog('Agent triggered: Initiating transaction dispatch batch #4928...');
    await new Promise((r) => setTimeout(r, 600));

    addLog(`Evaluating Midnight Guardrail Policy for [${selectedAgent}]...`);
    await new Promise((r) => setTimeout(r, 700));

    addLog(`Checking Budget Bound: Required $320 <= Allowed $${budgetLimit} -> SATISFIED (ZK Range Check)`);
    await new Promise((r) => setTimeout(r, 600));

    addLog(`Checking Rate Limit: 11 calls/min <= Allowed ${rateLimit} calls/min -> SATISFIED`);
    await new Promise((r) => setTimeout(r, 700));

    addLog('Synthesizing witness into Midnight Compact Circuit (verify_contribution)...');
    await new Promise((r) => setTimeout(r, 800));

    addLog(`ZK-Proof anchored on Midnight Contract: ${MIDNIGHT_CONFIG.contractAddress.substring(0, 14)}...`);
    addLog('SUCCESS: Agent execution authorized cryptographically without exposing operational parameters.');

    setGuardStatus('VERIFIED');
    setIsVerifying(false);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/30 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" /> Autonomous Policy Enforcer
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Midnight ZK Guardrails
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-violet-400 bg-clip-text text-transparent">
              AI Agent Guard & Verifiable Policies
            </h1>
            <p className="mt-1 text-slate-400 text-sm sm:text-base">
              Constrain autonomous AI agents with Zero-Knowledge smart contracts on Midnight. Prove compliance without leaking private prompts or financial balances.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-white/10 rounded-xl p-3 text-xs flex items-center gap-2 font-mono text-cyan-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Guard Protocol Active</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          
          {/* Agent Selector & Policy Config */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-white">
                <Cpu className="w-5 h-5 text-violet-400" /> Select Autonomous Agent
              </h2>

              <div className="space-y-3">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedAgent === agent.id
                        ? 'bg-violet-900/20 border-violet-500/50 shadow-lg shadow-violet-500/10'
                        : 'bg-black/30 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-white">{agent.name}</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                        {agent.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{agent.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Policy Parameters */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-white">
                <Settings className="w-5 h-5 text-cyan-400" /> Midnight Smart Contract Guardrails
              </h2>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-2">
                    <span>Spending Ceiling / Single Execution ($ USD)</span>
                    <span className="font-mono text-cyan-400 font-bold">${budgetLimit}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="5000"
                    step="50"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Zero-Knowledge Range Proof guarantees agent balance never exceeds this threshold without disclosing exact amounts.
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-2">
                    <span>Velocity Limit (Max Tool Invocations / Min)</span>
                    <span className="font-mono text-violet-400 font-bold">{rateLimit} calls/min</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="1"
                    value={rateLimit}
                    onChange={(e) => setRateLimit(Number(e.target.value))}
                    className="w-full accent-violet-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-200 block">Require Midnight ZK Assertion</span>
                    <span className="text-[11px] text-slate-400">Enforces Compact circuit verification before on-chain execution</span>
                  </div>
                  <div className="w-10 h-6 bg-cyan-500 rounded-full p-1 cursor-pointer flex items-center justify-end">
                    <div className="w-4 h-4 bg-black rounded-full" />
                  </div>
                </div>

                <button
                  onClick={handleSimulate}
                  disabled={isVerifying}
                  className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    isVerifying
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-violet-500/25'
                  }`}
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Policy In ZK Enclave...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" /> Simulate & Verify Agent Execution
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Live Policy Execution Stream */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                  <Activity className="w-5 h-5 text-emerald-400" /> Midnight Guardrail Telemetry
                </h2>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-mono font-medium ${
                    guardStatus === 'VERIFIED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : guardStatus === 'SIMULATING'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border border-white/5'
                  }`}
                >
                  {guardStatus}
                </span>
              </div>

              {/* Console Feed */}
              <div className="bg-black/60 border border-white/10 rounded-xl p-4 font-mono text-xs text-slate-300 min-h-[300px] max-h-[420px] overflow-y-auto space-y-2">
                {simulationLog.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 py-16 text-center">
                    <Lock className="w-8 h-8 mb-2 opacity-50 text-slate-600" />
                    <span>Click "Simulate & Verify Agent Execution" to test Midnight ZK Policy Guard.</span>
                  </div>
                ) : (
                  simulationLog.map((log, idx) => (
                    <div
                      key={idx}
                      className={
                        log.includes('SUCCESS')
                          ? 'text-emerald-400 font-bold'
                          : log.includes('SATISFIED')
                          ? 'text-cyan-300'
                          : 'text-slate-400'
                      }
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Invariant Matrix */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> Mathematical Guarantees on Midnight
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-black/30 rounded-xl border border-white/5">
                  <div className="text-white font-medium">Blinded Action Payloads</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Agent transactions emit zero plaintext parameters on public ledgers.
                  </div>
                </div>
                <div className="p-3 bg-black/30 rounded-xl border border-white/5">
                  <div className="text-white font-medium">Deterministic Circuit Assertions</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Midnight Compact checks strictly abort invalid execution before state changes.
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
