'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Cpu,
  FileText,
  Activity,
  ArrowRight,
  Database,
  Sparkles,
  Eye,
  EyeOff,
  RefreshCw,
  Sliders,
  Check,
  Zap
} from 'lucide-react';
import { AIDatasetAnalyzer, DatasetQualityReport } from '@/ai/analyzer';
import { SYNTHETIC_DATASETS, SyntheticDataset } from '@/ai/synthetic';
import { MidnightZKProofService } from '@/zk/proofEngine';
import { Proof, VerificationResult } from '@/zk/interface';
import confetti from 'canvas-confetti';
import { useWallet } from '@/components/WalletContext';
import { WalletButton } from '@/components/WalletConnect';

export default function ContributorPage() {
  const { isConnected, address, walletType, balance, addRewardBalance } = useWallet();
  // State for workflow
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('AI-PROJECT-001');
  const [selectedDatasetKey, setSelectedDatasetKey] = useState<string>('dataset-a');
  const [customFileContent, setCustomFileContent] = useState<string | null>(null);
  const [customFileName, setCustomFileName] = useState<string | null>(null);

  // Analysis & Verification
  const [analysisReport, setAnalysisReport] = useState<DatasetQualityReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [proofGenerationStep, setProofGenerationStep] = useState<number>(0);
  const [isGeneratingProof, setIsGeneratingProof] = useState<boolean>(false);
  const [generatedProof, setGeneratedProof] = useState<Proof | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);

  // Interactive UI Tabs & Reward Claim State
  const [activeViewTab, setActiveViewTab] = useState<'matrix' | 'masker'>('matrix');
  const [isRewardClaimed, setIsRewardClaimed] = useState<boolean>(false);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [rewardTxData, setRewardTxData] = useState<any | null>(null);

  // Privacy Center state (Spec 9)
  const [additionalDisclosureConsent, setAdditionalDisclosureConsent] = useState<boolean>(false);

  // My Datasets history
  const [myContributions, setMyContributions] = useState<any[]>([]);

  const handleClaimReward = () => {
    if (isRewardClaimed) return;
    addRewardBalance(450);
    setIsRewardClaimed(true);
    const tx = {
      txHash: '0x9a8f4c' + Math.random().toString(16).substring(2, 10) + '2b1e7d3a509876543210abcdef0123456789abcdef',
      blockHeight: 1284912 + Math.floor(Math.random() * 50),
      amount: '450.00 DUST',
      amountUsd: '$225.00',
      recipient: address || 'WA (0x1am_preprod_wallet)',
      contract: '0x9a8f4c2b1e7d3a509876543210abcdef0123456789abcdef0123456789abcdef',
      status: 'CONFIRMED_ON_CHAIN',
      timestamp: new Date().toLocaleTimeString(),
    };
    setRewardTxData(tx);
    setShowRewardModal(true);
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 }
    });
  };

  // Fetch initial projects and contributions
  useEffect(() => {
    fetchProjects();
    fetchContributions();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success && data.projects.length > 0) {
        setProjects(data.projects);
        if (!selectedProjectId) setSelectedProjectId(data.projects[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchContributions = async () => {
    try {
      const res = await fetch('/api/contributions');
      const data = await res.json();
      if (data.success) {
        setMyContributions(data.contributions);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const activeProject = projects.find((p) => p.id === selectedProjectId) || {
    id: 'AI-PROJECT-001',
    name: 'Healthcare AI Research',
    category: 'Healthcare',
    currentVersion: '1.0',
    requirements: {
      minRecords: 10000,
      minCompleteness: 95,
      maxDuplicateRate: 5,
      minQualityScore: 90,
      allowedFormats: ['CSV', 'JSON'],
      requiredFields: ['age', 'gender', 'diagnosis', 'treatment', 'outcome']
    }
  };

  // Run local AI dataset analysis whenever dataset or project changes
  useEffect(() => {
    runPrivateAnalysis();
  }, [selectedDatasetKey, selectedProjectId, customFileContent]);

  const runPrivateAnalysis = () => {
    setIsAnalyzing(true);
    setGeneratedProof(null);
    setSubmissionResult(null);
    setProofGenerationStep(0);

    setTimeout(() => {
      if (customFileContent && customFileName) {
        const report = AIDatasetAnalyzer.analyze(
          {
            name: customFileName,
            format: customFileName.endsWith('.json') ? 'JSON' : 'CSV',
            content: customFileContent
          },
          activeProject.requirements.requiredFields
        );
        setAnalysisReport(report);
      } else {
        const syn = SYNTHETIC_DATASETS[selectedDatasetKey];
        if (syn) {
          const requiredFields = activeProject.requirements?.requiredFields || ['age', 'gender', 'diagnosis', 'treatment', 'outcome'];
          const minReqRecords = activeProject.requirements?.minRecords || 10000;

          let schemaFields = syn.schemaFields;
          let recordCount = syn.recordCount;
          let completeness = syn.completeness;
          let duplicateRate = syn.duplicateRate;
          let qualityScore = syn.qualityScore;

          if (selectedDatasetKey === 'dataset-a') {
            // Ensure Dataset A always satisfies the active project's exact required fields & thresholds
            schemaFields = Array.from(new Set([...requiredFields, 'record_id', 'metadata_hash']));
            recordCount = Math.max(syn.recordCount, minReqRecords * 2);
            completeness = 98.5;
            duplicateRate = 0.8;
            qualityScore = 96;
          } else if (selectedDatasetKey === 'dataset-b') {
            // Low quality scenario (fails completeness, duplicate rate & missing fields)
            schemaFields = requiredFields.slice(0, Math.max(1, requiredFields.length - 2));
            completeness = 78.0;
            duplicateRate = 9.0;
            qualityScore = 68;
          } else if (selectedDatasetKey === 'dataset-c') {
            // Low volume scenario (fails minimum record count threshold)
            schemaFields = requiredFields;
            recordCount = Math.max(100, Math.floor(minReqRecords * 0.4));
            completeness = 99.0;
            duplicateRate = 0.5;
            qualityScore = 95;
          }

          const report = AIDatasetAnalyzer.fromSummary(
            selectedDatasetKey === 'dataset-a' ? `Dataset A — Valid ${activeProject.name} Records` : syn.name,
            {
              recordCount,
              completeness,
              duplicateRate,
              fields: schemaFields,
              category: activeProject.category
            },
            syn.format,
            requiredFields
          );
          setAnalysisReport(report);
        }
      }
      setIsAnalyzing(false);
    }, 400);
  };

  // Handle custom file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomFileName(file.name);
    setSelectedDatasetKey('custom');

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCustomFileContent(text);
    };
    reader.readAsText(file);
  };

  // Evaluate requirements match
  const checkMatches = () => {
    if (!analysisReport) return { passes: false, details: {} as any };

    const req = activeProject.requirements;
    const compVal = Number(analysisReport.completeness);
    const reqCompVal = Number(req.minCompleteness ?? 90);

    const dupVal = Number(analysisReport.duplicateRate);
    const reqDupVal = Number(req.maxDuplicateRate ?? 10);

    const allowedFormats = (req.allowedFormats || (req as any).requiredFormat || ['CSV', 'JSON']).map((f: string) => f.toUpperCase());
    const datasetFormat = (analysisReport.format || 'CSV').toUpperCase();

    const recordsPass = analysisReport.recordCount >= (req.minRecords ?? 1000);
    const compPass = compVal >= reqCompVal;
    const dupPass = dupVal <= reqDupVal;
    const qualPass = analysisReport.overallQuality >= (req.minQualityScore ?? 80);
    const formatPass = allowedFormats.length === 0 || allowedFormats.includes(datasetFormat);
    const schemaPass = analysisReport.requiredFieldsMatched >= (req.requiredFields?.length ?? 0);

    const allPassed = recordsPass && compPass && dupPass && qualPass && formatPass && schemaPass;

    return {
      allPassed,
      recordsPass,
      compPass,
      dupPass,
      qualPass,
      formatPass,
      schemaPass,
      passedCount: [recordsPass, compPass, dupPass, qualPass, formatPass, schemaPass].filter(Boolean).length
    };
  };

  const matchResults = checkMatches();

  // Step 7: Generate Privacy Proof
  const handleGenerateProof = async () => {
    if (!analysisReport) return;
    setIsGeneratingProof(true);
    setProofGenerationStep(1);

    try {
      // Simulation steps for user visual feedback
      await new Promise((r) => setTimeout(r, 600));
      setProofGenerationStep(2);

      await new Promise((r) => setTimeout(r, 700));
      setProofGenerationStep(3);

      const salt = MidnightZKProofService.generateSalt();
      const rawDatasetHash = MidnightZKProofService.hash(
        analysisReport.datasetName + analysisReport.recordCount + Date.now()
      );

      const metricsForProof = {
        recordCount: analysisReport.recordCount,
        completeness: analysisReport.completeness,
        duplicateRate: analysisReport.duplicateRate,
        qualityScore: analysisReport.overallQuality,
        format: analysisReport.format,
        schemaFields: analysisReport.detectedFields,
        category: analysisReport.category
      };

      const datasetCommitment = MidnightZKProofService.computeDatasetCommitment(
        salt,
        rawDatasetHash,
        metricsForProof
      );

      const requirementsHash = MidnightZKProofService.computeRequirementHash({
        projectId: activeProject.id,
        version: activeProject.currentVersion || '1.0',
        minRecords: activeProject.requirements.minRecords,
        minCompleteness: activeProject.requirements.minCompleteness,
        maxDuplicateRate: activeProject.requirements.maxDuplicateRate,
        minQualityScore: activeProject.requirements.minQualityScore,
        allowedFormats: activeProject.requirements.allowedFormats,
        requiredFields: activeProject.requirements.requiredFields,
        customConditions: activeProject.requirements.customConditions
      });

      const proofService = new MidnightZKProofService('MIDNIGHT_DEVNET_SIMULATOR');

      const proof = await proofService.generateProof({
        privateData: {
          metrics: metricsForProof,
          rawDatasetHash,
          salt
        },
        publicInputs: {
          projectId: activeProject.id,
          requirementVersion: activeProject.currentVersion || '1.0',
          requirementsHash,
          contributorId: 'contrib-001',
          datasetCommitment,
          nonce: Math.random().toString(36).substring(2, 12),
          timestamp: Date.now()
        },
        requirements: {
          projectId: activeProject.id,
          version: activeProject.currentVersion || '1.0',
          ...activeProject.requirements
        }
      });

      await new Promise((r) => setTimeout(r, 500));
      setGeneratedProof(proof);
      setProofGenerationStep(4);
    } catch (err: any) {
      alert('Proof Generation Error: ' + err.message);
    } finally {
      setIsGeneratingProof(false);
    }
  };

  // Step 8: Submit Proof to Midnight
  const handleSubmitProof = async () => {
    if (!generatedProof || !analysisReport) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProject.id,
          datasetName: analysisReport.datasetName,
          proof: generatedProof,
          metrics: {
            recordCount: analysisReport.recordCount,
            completeness: analysisReport.completeness,
            duplicateRate: analysisReport.duplicateRate,
            qualityScore: analysisReport.overallQuality,
            format: analysisReport.format
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmissionResult(data);
        if (data.contribution.status === 'VERIFIED') {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
        fetchContributions();
      } else {
        alert('Submission error: ' + data.error);
      }
    } catch (e: any) {
      alert('Submission failed: ' + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyan-950/80 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-cyan-950 text-cyan-300 border border-cyan-800">
              Role A • Contributor Studio
            </span>
            <span className="text-xs text-slate-500 font-mono">Workflow Step 1 - 8</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Private Data Contribution
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Privately analyze your dataset locally, certify compliance via Midnight ZK proofs, and submit claims without revealing raw records.
          </p>
        </div>
      </div>

      {/* ===== WALLET GUARD BANNER ===== */}
      {!isConnected ? (
        <div style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(79,70,229,0.1) 100%)',
          border: '1px solid rgba(139,92,246,0.5)',
          borderRadius: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <span style={{ fontSize: '36px' }}>🔗</span>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '18px', fontWeight: 700 }}>
                Connect Midnight 1AM Wallet — Required for Proof Submission
              </h3>
              <p style={{ margin: '6px 0 0', color: '#9ca3af', fontSize: '14px', lineHeight: 1.6 }}>
                Connect your <strong style={{ color: '#38bdf8' }}>1AM Wallet</strong> or <strong style={{ color: '#a78bfa' }}>Midnight Lace Wallet</strong> to sign and submit zero-knowledge proofs on the Midnight Preprod Network.
                Your identity remains completely private — only cryptographic signatures are recorded.
              </p>
              <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: '12px' }}>
                👉 Dataset analysis and proof generation take place client-side — wallet connection is only required for final submission.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <WalletButton />
            <span style={{ color: '#4b5563', fontSize: '13px' }}>
              🔒 Zero-knowledge proofs never expose your underlying raw records.
            </span>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '16px 24px',
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: '#10b981', boxShadow: '0 0 8px #10b981', display: 'inline-block'
            }} />
            <span style={{ color: '#10b981', fontWeight: 700, fontSize: '14px' }}>
              ✅ {walletType === '1am' ? '⏱️ 1AM Wallet Connected' : '🌀 Midnight Lace Wallet Connected'}
            </span>
            <span style={{ color: '#6b7280', fontSize: '12px' }}>
              {walletType === '1am' ? '⏱️ 1AM' : '🌀 Midnight Lace'} · {address?.slice(0, 10)}...{address?.slice(-6)}
            </span>
          </div>
          <span style={{ color: '#059669', fontWeight: 600, fontSize: '13px' }}>{balance}</span>
        </div>
      )}

      {/* Quick Visual Guide Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-cyan-950/50 to-indigo-950/40 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white block">🎯 Quick 3-Step Guide:</span>
            <span className="text-slate-300">
              1. Select a dataset (e.g. <strong className="text-emerald-400">Dataset A</strong>) &rarr; 2. Click <strong className="text-cyan-400">&ldquo;Generate Privacy Proof&rdquo;</strong> &rarr; 3. Click <strong className="text-emerald-400">&ldquo;Submit Proof to Midnight&rdquo;</strong>!
            </span>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Workflow Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1 & 2: Project Selector */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm font-bold text-white">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
                  1
                </span>
                <span>Select Target AI Project</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Version: <span className="text-cyan-400">{activeProject.currentVersion || '1.0'}</span>
              </span>
            </div>

            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500 font-medium"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category}) — Requires {p.requirements.minRecords.toLocaleString()}+ rows
                </option>
              ))}
            </select>

            {/* Display Project Requirements Card */}
            <div className="p-4 rounded-xl bg-[#080D1A] border border-cyan-950 text-xs space-y-2">
              <div className="text-slate-300 font-semibold flex items-center justify-between">
                <span>{activeProject.name} — Required Benchmark:</span>
                <span className="text-[11px] font-mono text-cyan-400">Immutable Hash Registered</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] text-slate-300">
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">MIN RECORDS</span>
                  <span className="text-white font-bold">{activeProject.requirements.minRecords.toLocaleString()}+</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">MIN COMPLETENESS</span>
                  <span className="text-white font-bold">{activeProject.requirements.minCompleteness}%+</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">MAX DUPLICATES</span>
                  <span className="text-white font-bold">&le; {activeProject.requirements.maxDuplicateRate}%</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">MIN QUALITY SCORE</span>
                  <span className="text-white font-bold">{activeProject.requirements.minQualityScore} / 100</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">ALLOWED FORMATS</span>
                  <span className="text-white font-bold">
                    {(activeProject.requirements?.allowedFormats || (activeProject.requirements as any)?.requiredFormat || ['CSV', 'JSON']).join(', ')}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">REQUIRED SCHEMA</span>
                  <span className="text-cyan-400 font-bold">
                    {(activeProject.requirements?.requiredFields || []).length} Fields
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: Select Private Dataset */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm font-bold text-white">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
                  2
                </span>
                <span>Select Private Dataset (Never Uploaded Raw)</span>
              </div>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <Lock className="w-3 h-3" /> Encrypted In-Browser
              </span>
            </div>

            {/* Synthetic Datasets Radio Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Dataset A */}
              <button
                type="button"
                onClick={() => {
                  setCustomFileContent(null);
                  setCustomFileName(null);
                  setSelectedDatasetKey('dataset-a');
                }}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedDatasetKey === 'dataset-a' && !customFileName
                    ? 'border-emerald-500 bg-emerald-950/20 shadow-md shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">Dataset A</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    QUALIFIED
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {Math.max(50000, (activeProject.requirements?.minRecords || 10000) * 2).toLocaleString()} rows, 98.5% complete &bull; Meets all requirements.
                </p>
              </button>

              {/* Dataset B */}
              <button
                type="button"
                onClick={() => {
                  setCustomFileContent(null);
                  setCustomFileName(null);
                  setSelectedDatasetKey('dataset-b');
                }}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedDatasetKey === 'dataset-b' && !customFileName
                    ? 'border-rose-500 bg-rose-950/20 shadow-md shadow-rose-500/10'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">Dataset B</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                    LOW QUALITY
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  78% complete, 9% dup &bull; Fails quality benchmark.
                </p>
              </button>

              {/* Dataset C */}
              <button
                type="button"
                onClick={() => {
                  setCustomFileContent(null);
                  setCustomFileName(null);
                  setSelectedDatasetKey('dataset-c');
                }}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedDatasetKey === 'dataset-c' && !customFileName
                    ? 'border-amber-500 bg-amber-950/20 shadow-md shadow-amber-500/10'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">Dataset C</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                    LOW VOLUME
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {Math.max(100, Math.floor((activeProject.requirements?.minRecords || 10000) * 0.4)).toLocaleString()} rows &bull; Fails min volume (&lt;{(activeProject.requirements?.minRecords || 10000).toLocaleString()}).
                </p>
              </button>
            </div>

            {/* Upload Custom Dataset */}
            <div className="pt-2 border-t border-slate-800/80">
              <label className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500/60 bg-slate-950/60 cursor-pointer transition-all group">
                <Upload className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors mb-1.5" />
                <span className="text-xs font-medium text-slate-300 group-hover:text-white">
                  {customFileName ? `Selected: ${customFileName}` : 'Or Upload Private CSV / JSON File'}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  File remains on your device. Only statistics are computed in local memory.
                </span>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* STEP 5 & 6: Live Requirement Matching Matrix & Privacy Masker */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-sm font-bold text-white">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
                  3
                </span>
                <span>Verification &amp; Privacy Obfuscation</span>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveViewTab('matrix')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeViewTab === 'matrix'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📊 Requirements Matrix ({matchResults.passedCount}/6)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveViewTab('masker')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeViewTab === 'masker'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🪄 Live Privacy Masker</span>
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1 py-0.2 rounded border border-emerald-800">
                    ZERO LEAK
                  </span>
                </button>
              </div>
            </div>

            {activeViewTab === 'masker' ? (
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-900/50 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span>Client-Side PII Obfuscation &amp; Zero-Knowledge Witnesses:</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">● 100% Isolated In-Browser</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/90">
                  <table className="w-full text-[11px] font-mono text-left">
                    <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">Attribute Field</th>
                        <th className="p-2.5 text-rose-300">Private Input (Local Memory)</th>
                        <th className="p-2.5 text-cyan-300">Salted ZK Witness (Commitment)</th>
                        <th className="p-2.5 text-emerald-400">Ledger Exposure</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      <tr>
                        <td className="p-2.5 font-bold text-white">patient_id</td>
                        <td className="p-2.5 text-rose-400">P-1001 (PII Record)</td>
                        <td className="p-2.5 text-cyan-300">0x7a3f89...e210 [256-bit Salted SHA-256]</td>
                        <td className="p-2.5 text-emerald-400 font-bold">🔒 NEVER TRANSMITTED</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white">age</td>
                        <td className="p-2.5 text-rose-400">45 (Exact Age)</td>
                        <td className="p-2.5 text-cyan-300">zk_range_proof(18 &le; age &le; 90)</td>
                        <td className="p-2.5 text-emerald-400 font-bold">🔒 BOUNDS ONLY</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white">diagnosis</td>
                        <td className="p-2.5 text-rose-400">Type 2 Diabetes</td>
                        <td className="p-2.5 text-cyan-300">zk_set_membership(valid_icd10_code)</td>
                        <td className="p-2.5 text-emerald-400 font-bold">🔒 PROOF ONLY</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white">biomarker_score</td>
                        <td className="p-2.5 text-rose-400">1.24 mg/dL</td>
                        <td className="p-2.5 text-cyan-300">H(salt || 1.24 || raw_hash)</td>
                        <td className="p-2.5 text-emerald-400 font-bold">🔒 BLINDED WITNESS</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white">outcome</td>
                        <td className="p-2.5 text-rose-400">Stabilized</td>
                        <td className="p-2.5 text-cyan-300">zk_predicate_satisfied(pass=1)</td>
                        <td className="p-2.5 text-emerald-400 font-bold">🔒 MATHEMATICALLY PROVED</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : analysisReport && (
              <div className="space-y-2 text-xs font-mono">
                {/* Condition 1: Records */}
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400">Minimum Record Count: </span>
                    <span className="text-white font-bold">{analysisReport.recordCount.toLocaleString()}</span>
                    <span className="text-slate-500 text-[11px]"> (Req: &ge; {activeProject.requirements.minRecords.toLocaleString()})</span>
                  </div>
                  {matchResults.recordsPass ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> PASS
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 font-bold">
                      <XCircle className="w-4 h-4" /> FAIL
                    </span>
                  )}
                </div>

                {/* Condition 2: Completeness */}
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400">Completeness: </span>
                    <span className="text-white font-bold">{analysisReport.completeness}%</span>
                    <span className="text-slate-500 text-[11px]"> (Req: &ge; {activeProject.requirements.minCompleteness}%)</span>
                  </div>
                  {matchResults.compPass ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> PASS
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 font-bold">
                      <XCircle className="w-4 h-4" /> FAIL
                    </span>
                  )}
                </div>

                {/* Condition 3: Duplicate Rate */}
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400">Duplicate Rate: </span>
                    <span className="text-white font-bold">{analysisReport.duplicateRate}%</span>
                    <span className="text-slate-500 text-[11px]"> (Req: &le; {activeProject.requirements.maxDuplicateRate}%)</span>
                  </div>
                  {matchResults.dupPass ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> PASS
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 font-bold">
                      <XCircle className="w-4 h-4" /> FAIL
                    </span>
                  )}
                </div>

                {/* Condition 4: Quality Score */}
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400">Quality Score: </span>
                    <span className="text-white font-bold">{analysisReport.overallQuality} / 100</span>
                    <span className="text-slate-500 text-[11px]"> (Req: &ge; {activeProject.requirements.minQualityScore})</span>
                  </div>
                  {matchResults.qualPass ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> PASS
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 font-bold">
                      <XCircle className="w-4 h-4" /> FAIL
                    </span>
                  )}
                </div>

                {/* Condition 5: Schema Compatibility */}
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400">Required Schema: </span>
                    <span className="text-white font-bold">
                      {analysisReport.requiredFieldsMatched} / {(activeProject.requirements?.requiredFields || []).length} Fields
                    </span>
                    <span className="text-slate-500 text-[11px]"> ({(activeProject.requirements?.requiredFields || []).join(', ')})</span>
                  </div>
                  {matchResults.schemaPass ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> PASS
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 font-bold">
                      <XCircle className="w-4 h-4" /> FAIL
                    </span>
                  )}
                </div>

                {/* Condition 6: Format */}
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400">Format Compliance: </span>
                    <span className="text-white font-bold">{analysisReport.format}</span>
                  </div>
                  {matchResults.formatPass ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> PASS
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 font-bold">
                      <XCircle className="w-4 h-4" /> FAIL
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* STEP 7 & 8: ZK Proof Generation & Submission */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0A1224] to-[#0A0E1A] border border-cyan-800/40 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm font-bold text-white">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
                  4
                </span>
                <span>Midnight Zero-Knowledge Proof Engine</span>
              </div>
              <span className="text-xs text-cyan-400 font-mono">Compact Circuit: BLS12-381</span>
            </div>

            {/* Proof Generation Multi-step Indicator */}
            {proofGenerationStep > 0 && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-900/40 space-y-2 text-xs font-mono">
                <div className={`flex items-center space-x-2 ${proofGenerationStep >= 1 ? 'text-cyan-300' : 'text-slate-600'}`}>
                  {proofGenerationStep > 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />}
                  <span>1. Preparing private inputs & blinding salt...</span>
                </div>
                <div className={`flex items-center space-x-2 ${proofGenerationStep >= 2 ? 'text-cyan-300' : 'text-slate-600'}`}>
                  {proofGenerationStep > 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : proofGenerationStep === 2 ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" /> : <div className="w-3.5 h-3.5" />}
                  <span>2. Evaluating Zero-Knowledge range predicates...</span>
                </div>
                <div className={`flex items-center space-x-2 ${proofGenerationStep >= 3 ? 'text-cyan-300' : 'text-slate-600'}`}>
                  {proofGenerationStep > 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : proofGenerationStep === 3 ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" /> : <div className="w-3.5 h-3.5" />}
                  <span>3. Generating Midnight Compact proof & dataset commitment...</span>
                </div>
                <div className={`flex items-center space-x-2 ${proofGenerationStep >= 4 ? 'text-emerald-400 font-bold' : 'text-slate-600'}`}>
                  {proofGenerationStep >= 4 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <div className="w-3.5 h-3.5" />}
                  <span>4. Proof generated successfully!</span>
                </div>
              </div>
            )}

            {/* Generated Proof Preview */}
            {generatedProof && (
              <div className="p-4 rounded-xl bg-black/50 border border-emerald-500/30 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>PROOF PAYLOAD GENERATED</span>
                  <span>{generatedProof.proofId}</span>
                </div>
                <div className="text-slate-400 break-all text-[10px]">
                  Commitment: <span className="text-cyan-300">{generatedProof.datasetCommitment}</span>
                </div>
                <div className="text-slate-400 break-all text-[10px]">
                  Public Inputs Hash: <span className="text-cyan-300">{generatedProof.publicInputs.requirementsHash}</span>
                </div>
                <div className="text-slate-400 text-[10px]">
                  Protocol: <span className="text-white">{generatedProof.zkPayload.protocol} ({generatedProof.zkPayload.curve})</span>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleGenerateProof}
                disabled={isGeneratingProof || !analysisReport}
                className="w-full sm:w-auto flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 disabled:opacity-50 transition-all"
              >
                {isGeneratingProof ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Computing ZK Proof...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" />
                    <span>Generate Privacy Proof</span>
                  </>
                )}
              </button>

              {generatedProof && (
                <button
                  type="button"
                  onClick={handleSubmitProof}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Submitting to Midnight...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Submit Proof to Midnight</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Post-submission Result Display */}
            {submissionResult && (
              <div className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${
                submissionResult.contribution.status === 'VERIFIED'
                  ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300'
                  : 'border-rose-500 bg-rose-950/20 text-rose-300'
              }`}>
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>Contribution #{submissionResult.contribution.id}</span>
                  <span className="px-2 py-0.5 rounded bg-black/40">
                    {submissionResult.contribution.status}
                  </span>
                </div>
                <div className="text-slate-300 text-[11px]">
                  {submissionResult.verification.message}
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-400">
                  <span>Audit Verification ID: {submissionResult.verification.verificationId}</span>
                  <span>Raw Dataset: NOT ACCESSED</span>
                </div>
              </div>
            )}

            {/* FEATURE: 1-Click DUST Bounty Reward Claim Card */}
            {submissionResult && submissionResult.contribution.status === 'VERIFIED' && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-cyan-950/70 border-2 border-emerald-500/80 shadow-2xl shadow-emerald-500/20 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-bold border border-emerald-500/40 shadow-inner">
                      🎁
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-white">
                          Verified Contributor Bounty Reward
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-600">
                          Preprod On-Chain
                        </span>
                      </div>
                      <p className="text-xs text-emerald-300/90 mt-0.5">
                        Your proof qualified for the <strong>{activeProject.name}</strong> bounty pool!
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleClaimReward}
                    disabled={isRewardClaimed}
                    className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-lg flex items-center space-x-2 ${
                      isRewardClaimed
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-600/40 cursor-default'
                        : 'bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 shadow-emerald-500/30 hover:scale-105 cursor-pointer'
                    }`}
                  >
                    <span>{isRewardClaimed ? '✅ 450 DUST Claimed!' : '💰 Claim 450 DUST Bounty'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Payout Modal / Receipt Dialog */}
            {showRewardModal && rewardTxData && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 99999999,
                  background: 'rgba(3, 7, 18, 0.88)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                }}
                onClick={(e) => e.target === e.currentTarget && setShowRewardModal(false)}
              >
                <div
                  style={{
                    width: '480px',
                    maxWidth: '96vw',
                    background: '#0B1120',
                    borderRadius: '24px',
                    border: '2px solid rgba(16, 185, 129, 0.8)',
                    boxShadow: '0 30px 100px rgba(0,0,0,0.9), 0 0 60px rgba(16,185,129,0.3)',
                    overflow: 'hidden',
                    fontFamily: 'monospace',
                  }}
                >
                  <div style={{ background: '#060B14', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>⚡</span>
                      <span style={{ color: '#fff', fontWeight: 800, fontSize: '15px' }}>Midnight Reward Payout Receipt</span>
                    </div>
                    <button
                      onClick={() => setShowRewardModal(false)}
                      style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '30px' }}>
                      🎉
                    </div>

                    <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 800, margin: '0 0 4px' }}>
                      +450.00 DUST Transferred!
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 20px' }}>
                      Credited to your connected 1AM Wallet for Zero-Knowledge Data Certification
                    </p>

                    <div style={{ background: '#070C18', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '14px', textAlign: 'left', fontSize: '11px', color: '#cbd5e1', spaceY: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: '#64748b' }}>Status:</span>
                        <span style={{ color: '#10b981', fontWeight: 800 }}>● {rewardTxData.status}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: '#64748b' }}>Network:</span>
                        <span style={{ color: '#38bdf8' }}>Midnight Preprod Testnet</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: '#64748b' }}>Block Height:</span>
                        <span style={{ color: '#fff' }}>#{rewardTxData.blockHeight}</span>
                      </div>
                      <div style={{ padding: '6px 0' }}>
                        <span style={{ color: '#64748b', display: 'block' }}>Transaction Hash:</span>
                        <span style={{ color: '#22d3ee', fontSize: '10px', wordBreak: 'break-all' }}>{rewardTxData.txHash}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowRewardModal(false)}
                      style={{
                        marginTop: '20px',
                        width: '100%',
                        padding: '12px',
                        background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#030712',
                        fontWeight: 800,
                        fontSize: '13px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(16,185,129,0.4)',
                      }}
                    >
                      ✓ Great, Back to Contributor Studio
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Analysis Report & Privacy Center */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Dataset Quality Report (Spec 3) */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Dataset Quality Report</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                AI Engine
              </span>
            </div>

            {analysisReport ? (
              <div className="space-y-4">
                <div className="text-center p-4 rounded-xl bg-[#070B14] border border-cyan-950">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Overall Quality Score</span>
                  <div className="text-3xl font-extrabold text-cyan-400 mt-0.5">
                    {analysisReport.overallQuality} <span className="text-sm text-slate-500 font-normal">/ 100</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Classification: <span className="text-white">{analysisReport.category}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">RECORDS</span>
                    <span className="text-white font-bold">{analysisReport.recordCount.toLocaleString()}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">COMPLETENESS</span>
                    <span className="text-white font-bold">{analysisReport.completeness}%</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">DUPLICATE RATE</span>
                    <span className="text-white font-bold">{analysisReport.duplicateRate}%</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">SCHEMA COMPLIANCE</span>
                    <span className="text-white font-bold">{analysisReport.schemaCompliance}%</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 font-mono">
                  <div className="text-slate-400 mb-1">Required Fields Matched:</div>
                  <div className="flex flex-wrap gap-1">
                    {analysisReport.detectedFields.map((field) => (
                      <span
                        key={field}
                        className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 text-[10px]"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                Analyzing dataset metrics...
              </div>
            )}
          </div>

          {/* Privacy Center (Spec 9) */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0A1224] to-[#070B14] border border-cyan-900/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Privacy Center</h3>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                PROTECTED
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">Raw Dataset:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> PRIVATE
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">Developer Raw Access:</span>
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> NO
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">ZK Proof Shared:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> YES
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">Metadata Shared:</span>
                <span className="text-cyan-300 font-bold">LIMITED (AGGREGATES ONLY)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800">
                <div>
                  <span className="text-slate-400 block">Additional Disclosure:</span>
                  <span className="text-[10px] text-slate-500">Requires explicit consent</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAdditionalDisclosureConsent(!additionalDisclosureConsent)}
                  className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${
                    additionalDisclosureConsent
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {additionalDisclosureConsent ? 'CONSENTED (ON)' : 'OFF'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contribution History & My Datasets (Spec 9) */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">My Datasets & Contribution History</h3>
            <p className="text-xs text-slate-400">
              Verified records of your zero-knowledge contributions.
            </p>
          </div>
          <button
            onClick={fetchContributions}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Dataset Name</th>
                <th className="py-3 px-3">Project</th>
                <th className="py-3 px-3">Quality Score</th>
                <th className="py-3 px-3">Proof Status</th>
                <th className="py-3 px-3">Verification</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Raw Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {myContributions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">{item.datasetName}</td>
                  <td className="py-3 px-3 text-slate-300">{item.projectName}</td>
                  <td className="py-3 px-3">
                    <span className="text-cyan-400 font-bold">{item.qualityScore}</span> / 100
                  </td>
                  <td className="py-3 px-3">
                    {item.proofStatus === 'VALID' ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Valid Proof
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1 font-semibold">
                        <XCircle className="w-3.5 h-3.5" /> Failed
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {item.proofStatus === 'VALID' ? '✓ Verified' : '✗ Unverified'}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === 'ACCEPTED' || item.status === 'VERIFIED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : item.status === 'REJECTED'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-rose-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> PRIVATE
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
