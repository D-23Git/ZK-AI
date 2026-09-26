import React from 'react';
import Link from 'next/link';
import { Shield, Brain, Bot, Database, Terminal, Award, ExternalLink } from 'lucide-react';
import { MIDNIGHT_CONFIG } from '../midnight/config';

export default function Footer() {
  const contractAddress = MIDNIGHT_CONFIG.contractAddress;

  return (
    <footer className="border-t border-slate-800/80 bg-[#05070c] text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-bold text-white tracking-wide">
                AURA <span className="text-cyan-400">ZK-AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Confidential AI Cloud & Autonomous Agent Guard powered by Midnight Zero-Knowledge technology.
            </p>
            <div className="pt-2 text-[11px] text-cyan-400/80 font-mono">
              "Prove AI execution & policy safety without revealing raw data."
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider mb-3">Platform Modules</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/studio" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-cyan-400" /> ZK-AI Inference Studio
                </Link>
              </li>
              <li>
                <Link href="/agents" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-violet-400" /> Agent Policy Guardrails
                </Link>
              </li>
              <li>
                <Link href="/vault" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-400" /> Confidential Vector Vault
                </Link>
              </li>
              <li>
                <Link href="/explorer" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" /> Midnight ZK Explorer
                </Link>
              </li>
              <li>
                <Link href="/benchmarks" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> Verifiable Model Benchmarks
                </Link>
              </li>
            </ul>
          </div>

          {/* Protocols & Midnight */}
          <div>
            <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider mb-3">Midnight Protocol</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-300 font-mono">Compact 0.5.2 DSL</span>
              </li>
              <li>
                <span className="text-slate-400">verify_contribution.zkir circuit</span>
              </li>
              <li>
                <span className="text-slate-400">BLS12-381 SNARK Proof System</span>
              </li>
              <li>
                <span className="text-slate-400">Poseidon Blinding Commitments</span>
              </li>
              <li>
                <span className="text-slate-400">DUST Gas Settlement</span>
              </li>
            </ul>
          </div>

          {/* Hackathon Resources */}
          <div>
            <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider mb-3">Hackathon Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://x.com/PrivateDataAI"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-2 bg-slate-850 p-2 rounded-xl border border-white/10 hover:border-emerald-500/50 w-max"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                  <span className="font-semibold text-white tracking-wide">Public X Profile (@PrivateDataAI)</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                </a>
              </li>
              <li>
                <span className="text-slate-400">Midnight Preprod Contract:</span>
                <div className="font-mono text-[10px] text-cyan-400/90 truncate">
                  {contractAddress}
                </div>
              </li>
              <li>
                <span className="text-slate-400">GitHub CI: Passing</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© 2026 AURA ZK-AI. Built for the Midnight Zero-Knowledge AI Challenge.</p>
          <p className="mt-2 sm:mt-0 font-mono text-cyan-500/80">
            Raw Inferences Kept Confidential • Zero Server Ingestion
          </p>
        </div>
      </div>
    </footer>
  );
}
