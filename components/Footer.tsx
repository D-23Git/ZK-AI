import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Terminal, Cpu, Github, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#060911] text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-bold text-white tracking-wide">
                PrivateData <span className="text-cyan-400">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Privacy-preserving AI data contribution platform powered by Midnight zero-knowledge technology.
            </p>
            <div className="pt-2 text-[11px] text-cyan-400/80 font-mono">
              Core: "Prove that your data qualifies without revealing your data."
            </div>
          </div>

          {/* User Roles */}
          <div>
            <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider mb-3">User Roles</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/contributor" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-cyan-400" /> Data Contributor (Client ZK)
                </Link>
              </li>
              <li>
                <Link href="/developer" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-cyan-400" /> AI Developer (Requirement Engine)
                </Link>
              </li>
              <li>
                <Link href="/auditor" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-cyan-400" /> Auditor (Verification Registry)
                </Link>
              </li>
            </ul>
          </div>

          {/* Protocols & Midnight */}
          <div>
            <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider mb-3">Technology</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/midnight" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-cyan-400" /> Midnight Compact Smart Contract
                </Link>
              </li>
              <li>
                <span className="text-slate-500">BLS12-381 / Groth16 ZK Circuits</span>
              </li>
              <li>
                <span className="text-slate-500">Poseidon / SHA-256 Commitments</span>
              </li>
              <li>
                <span className="text-slate-500">Cryptographic Hash Audit Chaining</span>
              </li>
            </ul>
          </div>

          {/* Hackathon Resources */}
          <div>
            <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider mb-3">Hackathon Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://x.com/Dbadhe23"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-2 bg-slate-800/50 p-2 rounded-md border border-slate-700/50 hover:border-cyan-500/50 w-max"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                  <span className="font-semibold text-white tracking-wide">Public X Profile (@Dbadhe23)</span>
                  <ExternalLink className="w-3 h-3 text-cyan-500" />
                </a>
              </li>
              <li>
                <span className="text-slate-400">Midnight Preprod Contract:</span>
                <div className="font-mono text-[10px] text-cyan-400/90 truncate">
                  0x9a8f4c2b1e7d3a50987...
                </div>
              </li>
              <li>
                <span className="text-slate-500">CI/CD: GitHub Actions Passing</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© 2026 PrivateData AI. Built for the Midnight Zero-Knowledge AI Challenge.</p>
          <p className="mt-2 sm:mt-0 font-mono text-cyan-500/80">
            Raw Datasets Kept Confidential • Zero Server Ingestion
          </p>
        </div>
      </div>
    </footer>
  );
}
