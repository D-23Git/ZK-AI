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

export default function ContributorPage() {
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

  // Privacy Center state (Spec 9)
  const [additionalDisclosureConsent, setAdditionalDisclosureConsent] = useState<boolean>(false);

  // My Datasets history
  const [myContributions, setMyContributions] = useState<any[]>([]);

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
          const report = AIDatasetAnalyzer.fromSummary(
            syn.name,
            {
              recordCount: syn.recordCount,
              completeness: syn.completeness,
              duplicateRate: syn.duplicateRate,
              fields: syn.schemaFields,
              category: syn.category
            },
            syn.format,
            activeProject.requirements.requiredFields
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
    const recordsPass = analysisReport.recordCount >= req.minRecords;
    const compPass = analysisReport.completeness >= req.minCompleteness;
    const dupPass = analysisReport.duplicateRate <= req.maxDuplicateRate;
    const qualPass = analysisReport.overallQuality >= req.minQualityScore;
    const formatPass = req.allowedFormats.includes(analysisReport.format);
    const schemaPass = analysisReport.requiredFieldsMatched >= req.requiredFields.length;

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

        {/* Live Privacy Guarantee Badge */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-900/40 text-xs font-mono flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <EyeOff className="w-4 h-4" />
          </div>
          <div>
            <div className="text-emerald-400 font-semibold">ZERO RAW DATA ACCESS</div>
            <div className="text-[10px] text-slate-400">Evaluated in local browser sandbox</div>
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
                  <span className="text-white font-bold">{activeProject.requirements.allowedFormats.join(', ')}</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">REQUIRED SCHEMA</span>
                  <span className="text-cyan-400 font-bold">{activeProject.requirements.requiredFields.length} Fields</span>
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
                  50k rows, 98% complete, 1% dup, 95 score.
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
                  50k rows, 81% complete, 8% dup, 72 score.
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
                  4.5k rows (fails &ge;10k), 99% complete, 96 score.
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

          {/* STEP 5 & 6: Live Requirement Matching Matrix */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm font-bold text-white">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
                  3
                </span>
                <span>Requirement Verification Matrix</span>
              </div>
              <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded border ${
                matchResults.allPassed
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-rose-950 text-rose-300 border-rose-800'
              }`}>
                {matchResults.passedCount} / 6 SATISFIED
              </span>
            </div>

            {analysisReport && (
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
                      {analysisReport.requiredFieldsMatched} / {activeProject.requirements.requiredFields.length} Fields
                    </span>
                    <span className="text-slate-500 text-[11px]"> ({activeProject.requirements.requiredFields.join(', ')})</span>
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
