'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Sliders,
  Sparkles,
  Shield,
  Layers,
  FileCode,
  TrendingUp,
  Activity,
  AlertCircle,
  EyeOff,
  Search,
  ExternalLink,
  MessageSquare,
  Lock
} from 'lucide-react';
import { StoredContribution } from '@/database/db';
import { ProjectData } from '@/projects';

export default function DeveloperPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('AI-PROJECT-001');
  const [contributions, setContributions] = useState<StoredContribution[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Requirement Builder State (Spec 5)
  const [showBuilder, setShowBuilder] = useState<boolean>(false);
  const [builderProjectName, setBuilderProjectName] = useState<string>('Oncology Biomarker AI');
  const [builderCategory, setBuilderCategory] = useState<string>('Healthcare');
  const [builderDescription, setBuilderDescription] = useState<string>('Deep learning model predicting tumor responsiveness.');
  const [builderMinRecords, setBuilderMinRecords] = useState<number>(10000);
  const [builderMinCompleteness, setBuilderMinCompleteness] = useState<number>(95);
  const [builderMaxDuplicates, setBuilderMaxDuplicates] = useState<number>(5);
  const [builderMinQuality, setBuilderMinQuality] = useState<number>(90);
  const [builderFormats, setBuilderFormats] = useState<string[]>(['CSV', 'JSON']);
  const [builderFields, setBuilderFields] = useState<string>('age, gender, diagnosis, treatment, outcome');

  // AI Assistant State (Spec 11)
  const [aiPrompt, setAiPrompt] = useState<string>('What kind of data do I need for this project?');
  const [aiResponse, setAiResponse] = useState<any | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiSummary, setAiSummary] = useState<any | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchContributions();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchContributions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/contributions');
      const data = await res.json();
      if (data.success) {
        setContributions(data.contributions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0] || {
    id: 'AI-PROJECT-001',
    name: 'Healthcare AI Research',
    category: 'Healthcare',
    currentVersion: '1.0',
    stats: {
      contributionsCount: 42,
      verifiedCount: 31,
      pendingCount: 7,
      rejectedCount: 4,
      averageQuality: 94.2
    }
  };

  const projectContributions = contributions.filter((c) => c.projectId === activeProject.id);

  // Handle contribution actions (Accept, Reject, Request Disclosure)
  const handleContributionAction = async (id: string, action: string) => {
    try {
      const res = await fetch(`/api/contributions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        fetchContributions();
        fetchProjects();
      }
    } catch (e: any) {
      alert('Action error: ' + e.message);
    }
  };

  // Submit Requirement Builder form
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fieldsArray = builderFields.split(',').map((f) => f.trim()).filter(Boolean);

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: builderProjectName,
          category: builderCategory,
          description: builderDescription,
          requirements: {
            minRecords: builderMinRecords,
            minCompleteness: builderMinCompleteness,
            maxDuplicateRate: builderMaxDuplicates,
            minQualityScore: builderMinQuality,
            requiredFormat: builderFormats,
            requiredFields: fieldsArray,
            customConditions: [
              { field: 'record_count', operator: '>=', value: builderMinRecords, description: `Records >= ${builderMinRecords}` },
              { field: 'completeness', operator: '>=', value: builderMinCompleteness, description: `Completeness >= ${builderMinCompleteness}%` },
              { field: 'quality_score', operator: '>=', value: builderMinQuality, description: `Quality Score >= ${builderMinQuality}` }
            ]
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setShowBuilder(false);
        fetchProjects();
        setSelectedProjectId(data.project.id);
        alert('AI Project and immutable requirement policy created successfully!');
      }
    } catch (err: any) {
      alert('Creation failed: ' + err.message);
    }
  };

  // Bump requirement version (v1.0 -> v1.1)
  const handlePublishNewVersion = async () => {
    try {
      const res = await fetch(`/api/projects/${activeProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'PUBLISH_NEW_VERSION',
          newVersionRequirements: {
            minRecords: activeProject.requirements.minRecords + 5000,
            minQualityScore: Math.min(100, activeProject.requirements.minQualityScore + 2)
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchProjects();
        alert(`Published immutable Version ${data.project.currentVersion} on Midnight ledger!`);
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Ask AI Assistant (Spec 11)
  const handleAskAI = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectDescription: activeProject.description || builderDescription,
          category: activeProject.category
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiResponse(data.recommendations);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Summarize Contributions with AI
  const handleSummarizeAI = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: activeProject.id })
      });
      const data = await res.json();
      if (data.success) {
        setAiSummary(data.summary);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Structured JSON representation preview (Spec 5)
  const structuredJsonPreview = {
    projectId: activeProject.id,
    version: activeProject.currentVersion || '1.0',
    requirements: {
      minRecords: builderMinRecords,
      minCompleteness: builderMinCompleteness,
      maxDuplicateRate: builderMaxDuplicates,
      minQualityScore: builderMinQuality,
      requiredFormat: builderFormats,
      requiredFields: builderFields.split(',').map((f) => f.trim()).filter(Boolean)
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyan-950/80 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-blue-950 text-blue-300 border border-blue-800">
              Role B • AI Developer Portal
            </span>
            <span className="text-xs text-slate-500 font-mono">Project & Requirement Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            AI Project Management & Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Specify dataset requirements, publish immutable policy versions, and verify Zero-Knowledge contribution proofs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowBuilder(!showBuilder)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>{showBuilder ? 'Close Builder' : 'Requirement Builder'}</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD CARDS (Spec 10) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-400 text-[11px] font-mono uppercase block">Total Projects</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">{projects.length}</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-400 text-[11px] font-mono uppercase block">Contributions</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">
            {activeProject.stats?.contributionsCount || 42}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-emerald-400 text-[11px] font-mono uppercase block">Verified (ZK)</span>
          <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">
            {activeProject.stats?.verifiedCount || 31}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-amber-400 text-[11px] font-mono uppercase block">Pending</span>
          <span className="text-2xl font-extrabold text-amber-400 mt-1 block">
            {activeProject.stats?.pendingCount || 7}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-rose-400 text-[11px] font-mono uppercase block">Rejected</span>
          <span className="text-2xl font-extrabold text-rose-400 mt-1 block">
            {activeProject.stats?.rejectedCount || 4}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-cyan-400 text-[11px] font-mono uppercase block">Avg Quality</span>
          <span className="text-2xl font-extrabold text-cyan-400 mt-1 block">
            {activeProject.stats?.averageQuality || 94.2}
          </span>
        </div>
      </div>

      {/* REQUIREMENT BUILDER MODAL / DRAWER (Spec 5) */}
      {showBuilder && (
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0C152B] to-[#0A0F1D] border border-cyan-500/40 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Dataset Requirement Builder</h2>
                <p className="text-xs text-slate-400">Spec 5 • Define custom predicate thresholds and export structured JSON</p>
              </div>
            </div>
            <button
              onClick={() => setShowBuilder(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateProject} className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Name</label>
                <input
                  type="text"
                  value={builderProjectName}
                  onChange={(e) => setBuilderProjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dataset Category</label>
                  <select
                    value={builderCategory}
                    onChange={(e) => setBuilderCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Retail">Retail</option>
                    <option value="Research">Research</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Minimum Records</label>
                  <input
                    type="number"
                    value={builderMinRecords}
                    onChange={(e) => setBuilderMinRecords(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Min Completeness (%)</label>
                  <input
                    type="number"
                    value={builderMinCompleteness}
                    onChange={(e) => setBuilderMinCompleteness(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Max Duplicate (%)</label>
                  <input
                    type="number"
                    value={builderMaxDuplicates}
                    onChange={(e) => setBuilderMaxDuplicates(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Min Quality Score</label>
                  <input
                    type="number"
                    value={builderMinQuality}
                    onChange={(e) => setBuilderMinQuality(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Required Schema Fields (comma-separated)</label>
                <input
                  type="text"
                  value={builderFields}
                  onChange={(e) => setBuilderFields(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none font-mono"
                  placeholder="e.g. age, gender, diagnosis, treatment, outcome"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
              >
                Publish Project & Register Immutable Requirement Hash
              </button>
            </div>

            {/* Live Structured JSON Preview (Spec 5) */}
            <div className="space-y-2">
              <span className="block text-slate-300 font-semibold">Structured Policy JSON (Immutable Target)</span>
              <pre className="p-4 rounded-xl bg-black/70 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto h-72">
                {JSON.stringify(structuredJsonPreview, null, 2)}
              </pre>
            </div>
          </form>
        </div>
      )}

      {/* ACTIVE PROJECT INSPECTION & VERSIONING (Spec 15) */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">{activeProject.name}</h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                v{activeProject.currentVersion || '1.0'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{activeProject.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePublishNewVersion}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Publish Next Version (Immutable)</span>
            </button>
          </div>
        </div>

        {/* Version History Chips */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-400">Registered Immutable Versions:</span>
          {activeProject.requirementVersions?.map((v: any) => (
            <span
              key={v.version}
              className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 flex items-center gap-1"
            >
              <span>v{v.version}</span>
              <span className="text-slate-500 text-[10px]">({v.minRecords.toLocaleString()} rows, {v.minQualityScore}+ qual)</span>
            </span>
          ))}
        </div>
      </div>

      {/* AI ASSISTANT FOR DEVELOPERS (Spec 11) */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#091224] to-[#0A0D18] border border-cyan-900/40 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">AI Developer Assistant</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            Assistant Spec 11
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleAskAI}
            disabled={isAiLoading}
            className="px-4 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>&ldquo;What kind of data do I need for this project?&rdquo;</span>
          </button>

          <button
            type="button"
            onClick={handleSummarizeAI}
            disabled={isAiLoading}
            className="px-4 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Summarize Contributions (Zero Raw Exposure)</span>
          </button>
        </div>

        {/* AI Recommendation Output */}
        {aiResponse && (
          <div className="p-4 rounded-xl bg-black/50 border border-cyan-500/30 text-xs font-mono space-y-2">
            <div className="text-cyan-400 font-bold">AI RECOMMENDED REQUIREMENTS:</div>
            <p className="text-slate-300 leading-relaxed">{aiResponse.explanation}</p>
            <ul className="text-slate-400 space-y-1 pt-1">
              <li>• Minimum {aiResponse.minRecords.toLocaleString()} records</li>
              <li>• Completeness &ge; {aiResponse.minCompleteness}%</li>
              <li>• Duplicate rate &le; {aiResponse.maxDuplicateRate}%</li>
              <li>• Required fields: {(aiResponse.requiredFields || []).join(', ')}</li>
              <li>• Quality score &ge; {aiResponse.minQualityScore}</li>
            </ul>
          </div>
        )}

        {/* AI Summary Output */}
        {aiSummary && (
          <div className="p-4 rounded-xl bg-black/50 border border-purple-500/30 text-xs font-mono space-y-2">
            <div className="text-purple-400 font-bold">CONTRIBUTION INTELLIGENCE SUMMARY:</div>
            <p className="text-slate-200 leading-relaxed">{aiSummary.narrative}</p>
            <div className="text-[11px] text-emerald-400 font-semibold pt-1">
              {aiSummary.privacyGuarantee}
            </div>
          </div>
        )}
      </div>

      {/* INCOMING CONTRIBUTIONS TABLE (Spec 10) */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">Incoming Zero-Knowledge Contributions</h3>
            <p className="text-xs text-slate-400">
              Review certified proofs and privacy-safe metadata without direct raw dataset access.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {projectContributions.length} Total Submitted
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Contribution ID</th>
                <th className="py-3 px-3">Dataset Category</th>
                <th className="py-3 px-3">Requirement Match</th>
                <th className="py-3 px-3">ZK Proof</th>
                <th className="py-3 px-3">Quality</th>
                <th className="py-3 px-3">Raw Dataset</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {projectContributions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-semibold text-cyan-400">#{item.id}</td>
                  <td className="py-3 px-3 text-slate-300">{item.category}</td>
                  <td className="py-3 px-3">
                    <span className="text-emerald-400 font-bold">
                      {item.proofStatus === 'VALID' ? '6 / 6 SATISFIED' : '3 / 6 SATISFIED'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {item.proofStatus === 'VALID' ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> VALID
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1 font-semibold">
                        <XCircle className="w-3.5 h-3.5" /> FAILED
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-bold text-white">{item.qualityScore}</td>
                  <td className="py-3 px-3">
                    <span className="text-rose-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> NOT ACCESSIBLE
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === 'ACCEPTED' || item.status === 'VERIFIED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : item.status === 'REJECTED'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-1.5">
                    {item.status === 'PENDING' || item.status === 'VERIFIED' ? (
                      <>
                        <button
                          onClick={() => handleContributionAction(item.id, 'ACCEPT')}
                          className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px]"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleContributionAction(item.id, 'REJECT')}
                          className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold text-[11px]"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Finalized</span>
                    )}

                    {!item.disclosureRequested ? (
                      <button
                        onClick={() => handleContributionAction(item.id, 'REQUEST_DISCLOSURE')}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                        title="Request Additional Disclosure (Requires Contributor Consent)"
                      >
                        Request Disclosure
                      </button>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-mono">
                        {item.disclosureConsented ? 'Consent Granted' : 'Consent Pending'}
                      </span>
                    )}
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
