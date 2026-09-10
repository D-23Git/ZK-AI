'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  HelpCircle,
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Brain,
  Scale,
  Languages,
  Zap,
  Play
} from 'lucide-react';

export default function HelpAssistantWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  // Guidance content based on current page
  const getPageGuide = () => {
    switch (pathname) {
      case '/contributor':
        return {
          title: 'Data Contributor Studio',
          explanation: 'Privately analyze your dataset and generate a Zero-Knowledge proof of qualification without uploading raw records.',
          steps: [
            '1. Dataset A is pre-selected (or upload your custom CSV).',
            '2. Click the blue "Generate Privacy Proof" button.',
            '3. Click the green "Submit Proof to Midnight" button.',
            '4. Notice: Raw Dataset remains PRIVATE on your device.'
          ],
          actionLabel: 'Try Generating Proof',
          actionHref: '/contributor'
        };

      case '/developer':
        return {
          title: 'AI Developer Portal',
          explanation: 'Define dataset requirements, publish immutable requirement policy versions, and verify incoming zero-knowledge proofs.',
          steps: [
            '1. Check dashboard metrics (Total Projects, Verified, Quality).',
            '2. Click "Requirement Builder" to define custom conditions.',
            '3. Click "What kind of data do I need for this project?" for AI suggestions.',
            '4. Review incoming contributions in the table.'
          ],
          actionLabel: 'Explore Developer Features',
          actionHref: '/developer'
        };

      case '/auditor':
        return {
          title: 'Auditor Registry',
          explanation: 'Independent auditors verify tamper-evident cryptographic proof events without accessing raw datasets.',
          steps: [
            '1. Observe the "AUDIT CHAIN INTEGRITY: 100% VALID" badge.',
            '2. With "DC-1024" pre-filled, click the "Audit Query" button.',
            '3. System confirms: "YES — MATHEMATICALLY CERTIFIED".'
          ],
          actionLabel: 'Test Audit Query',
          actionHref: '/auditor'
        };

      default:
        return {
          title: 'Welcome to PrivateData AI!',
          explanation: 'This platform enables data contributors to prove datasets meet AI requirements without exposing sensitive records.',
          steps: [
            '1. Try the "10-Second Instant Demo Sandbox" on the home page.',
            '2. Visit "Data Contributor" to test generating a ZK proof.',
            '3. Visit "AI Developer" to review incoming proofs without raw data.'
          ],
          actionLabel: 'Go to Contributor Flow',
          actionHref: '/contributor'
        };
    }
  };

  const guide = getPageGuide();

  return (
    <>
      {/* Floating Button in Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center space-x-2 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-2xl shadow-cyan-500/40 transition-all hover:scale-105"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
          <span className="font-extrabold tracking-wide">
            Interactive Help Guide
          </span>
        </button>
      </div>

      {/* Slide-in / Popup Help Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 max-w-[90vw] rounded-2xl bg-[#091122] border border-cyan-500/50 shadow-2xl shadow-cyan-500/20 p-5 text-xs text-slate-200 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{guide.title}</h4>
                <p className="text-[10px] text-slate-400 font-mono">
                  Interactive Guide
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Explanation */}
          <p className="text-slate-300 mb-3 leading-relaxed">
            {guide.explanation}
          </p>

          {/* What To Do Checklist */}
          <div className="p-3 rounded-xl bg-black/50 border border-slate-800 mb-4 space-y-2">
            <span className="text-[11px] font-bold text-cyan-300 font-mono block">
              🎯 What to do right now:
            </span>
            <ul className="space-y-1.5 text-[11px] text-slate-300 font-mono">
              {guide.steps.map((s, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-cyan-400 shrink-0">👉</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Action Links */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-medium text-center">
              <button
                onClick={() => {
                  router.push('/contributor');
                  setIsOpen(false);
                }}
                className={`py-1.5 px-1 rounded border transition-all ${
                  pathname === '/contributor'
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                1. Contributor
              </button>
              <button
                onClick={() => {
                  router.push('/developer');
                  setIsOpen(false);
                }}
                className={`py-1.5 px-1 rounded border transition-all ${
                  pathname === '/developer'
                    ? 'bg-blue-500 text-slate-950 font-bold border-blue-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                2. Developer
              </button>
              <button
                onClick={() => {
                  router.push('/auditor');
                  setIsOpen(false);
                }}
                className={`py-1.5 px-1 rounded border transition-all ${
                  pathname === '/auditor'
                    ? 'bg-purple-500 text-slate-950 font-bold border-purple-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                3. Auditor
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
