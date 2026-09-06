'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Cpu,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  EyeOff,
  Zap,
  Play,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LivePlayground() {
  const [step, setStep] = useState<number>(0);
  const [selectedDataset, setSelectedDataset] = useState<'A' | 'B' | 'C'>('A');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  const runLiveDemo = async (datasetType: 'A' | 'B' | 'C' = selectedDataset) => {
    setIsRunning(true);
    setStep(1);
    setLogMessages(['[1/4] Loading private dataset into client sandbox (never uploaded)...']);

    await new Promise((r) => setTimeout(r, 600));
    setStep(2);
    if (datasetType === 'A') {
      setLogMessages((prev) => [
        ...prev,
        '[2/4] Private AI Analysis: 50,000 records, 98% completeness, 1% duplicates, Quality Score: 95/100.',
        '[3/4] Predicate Check: All 6 requirements satisfied (PASS).'
      ]);
    } else if (datasetType === 'B') {
      setLogMessages((prev) => [
        ...prev,
        '[2/4] Private AI Analysis: 50,000 records, 81% completeness, 8% duplicates, Quality Score: 72/100.',
        '[3/4] Predicate Check: Failed completeness (<95%) & quality score (<90).'
      ]);
    } else {
      setLogMessages((prev) => [
        ...prev,
        '[2/4] Private AI Analysis: 4,500 records, 99% completeness, Quality Score: 96/100.',
        '[3/4] Predicate Check: Failed record count (<10,000 required).'
      ]);
    }

    await new Promise((r) => setTimeout(r, 700));
    setStep(3);
    setLogMessages((prev) => [
      ...prev,
      '[4/4] Computing blinding salt & generating Midnight BLS12-381 ZK Proof...'
    ]);

    await new Promise((r) => setTimeout(r, 700));
    setStep(4);
    if (datasetType === 'A') {
      setLogMessages((prev) => [
        ...prev,
        '✓ SUCCESS: Proof verified on Midnight! Raw records remain 100% private.'
      ]);
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.7 } });
    } else {
      setLogMessages((prev) => [
        ...prev,
        '✗ REJECTED: ZK circuit mathematically proved dataset does NOT satisfy requirements.'
      ]);
    }
    setIsRunning(false);
  };

  const handleReset = () => {
    setStep(0);
    setLogMessages([]);
    setIsRunning(false);
  };

  return (
    <div className="w-full rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-[#091226] via-[#0B1528] to-[#070B14] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyan-950 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500 text-slate-950 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-current" />
              10-SECOND INSTANT DEMO SANDBOX
            </span>
            <span className="text-xs text-slate-400 font-mono">काय करायचं ते समजत नाही? फक्त खालील बटण दाबा!</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-1">
            Try Zero-Knowledge Verification in 1 Click
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            खालीलपैकी एक डेटासेट निवडा आणि <strong className="text-cyan-400">&ldquo;Run 1-Click ZK Demo&rdquo;</strong> दाबा. तुम्हाला संपूर्ण प्रोसेस डोळ्यांसमोर दिसेल!
          </p>
        </div>

        {step > 0 && (
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        )}
      </div>

      {/* Dataset Selection Chips */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => {
            setSelectedDataset('A');
            if (step > 0) runLiveDemo('A');
          }}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedDataset === 'A'
              ? 'border-emerald-500 bg-emerald-950/30 shadow-md shadow-emerald-500/10'
              : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-white">Dataset A (Valid)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              पास होतो ✓
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            50k रेकॉर्ड्स, 98% completeness &rarr; AI प्रोजेक्टसाठी परिपूर्ण.
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedDataset('B');
            if (step > 0) runLiveDemo('B');
          }}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedDataset === 'B'
              ? 'border-rose-500 bg-rose-950/30 shadow-md shadow-rose-500/10'
              : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-white">Dataset B (Low Quality)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
              फेल होतो ✗
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            81% completeness, 8% डुप्लिकेट्स &rarr; ZK रिजेक्ट करेल.
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedDataset('C');
            if (step > 0) runLiveDemo('C');
          }}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedDataset === 'C'
              ? 'border-amber-500 bg-amber-950/30 shadow-md shadow-amber-500/10'
              : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-white">Dataset C (Low Volume)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
              फेल होतो ✗
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            फक्त 4,500 रेकॉर्ड्स (&lt; 10,000 required) &rarr; व्हॉल्युम कमी आहे.
          </p>
        </button>
      </div>

      {/* Big Action Button */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
        <button
          type="button"
          onClick={() => runLiveDemo(selectedDataset)}
          disabled={isRunning}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-105 disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>प्रूफ बनत आहे (Evaluating ZK Circuit)...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run 1-Click ZK Demo ({selectedDataset === 'A' ? 'Dataset A' : selectedDataset === 'B' ? 'Dataset B' : 'Dataset C'})</span>
            </>
          )}
        </button>

        <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>कच्चा डेटा कधीही बाहेर पाठवला जात नाही (100% Client-Side ZK)</span>
        </div>
      </div>

      {/* Live Terminal Output & Progress */}
      {step > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-black/70 border border-cyan-900/40 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5 text-[11px]">
            <span>LIVE EXECUTION TERMINAL</span>
            <span className="text-cyan-400">Step {step} / 4</span>
          </div>
          <div className="space-y-1 text-slate-300">
            {logMessages.map((msg, i) => (
              <div
                key={i}
                className={`${
                  msg.includes('SUCCESS')
                    ? 'text-emerald-400 font-bold'
                    : msg.includes('REJECTED')
                    ? 'text-rose-400 font-bold'
                    : msg.includes('PASSED')
                    ? 'text-cyan-300'
                    : 'text-slate-300'
                }`}
              >
                {msg}
              </div>
            ))}
          </div>

          {step === 4 && (
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
              <div className="text-slate-400">
                Midnight Ledger: <span className="text-cyan-400 font-bold">0x9a8f4c2b1e7d...</span>
              </div>
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {selectedDataset === 'A'
                  ? 'AI डेव्हलपरला खात्री मिळाली, पण तुमचा डेटा सुरक्षित राहिला!'
                  : 'खराब डेटा ZK द्वारे आपोआप रिजेक्ट झाला!'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
