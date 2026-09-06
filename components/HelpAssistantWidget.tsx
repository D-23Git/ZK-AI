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
  const [lang, setLang] = useState<'mr' | 'en'>('mr'); // Default Marathi for user convenience!
  const pathname = usePathname();
  const router = useRouter();

  // Guidance content based on current page
  const getPageGuide = () => {
    switch (pathname) {
      case '/contributor':
        return {
          title: lang === 'mr' ? 'डेटा देणारा (Data Contributor)' : 'Data Contributor Studio',
          explanation:
            lang === 'mr'
              ? 'येथे तुम्ही स्वतःचा खाजगी डेटा निवडून, तो AI साठी योग्य आहे हे Zero-Knowledge प्रूफने सिद्ध करता.'
              : 'Here you privately analyze your dataset and generate a Zero-Knowledge proof of qualification without uploading raw data.',
          steps:
            lang === 'mr'
              ? [
                  '१. "Dataset A" आधीच निवडलेला आहे (किंवा स्वतःची CSV अपलोड करा).',
                  '२. खाली असलेले निळे "Generate Privacy Proof" बटण दाबा.',
                  '३. नंतर हिरवे "Submit Proof to Midnight" बटण दाबा.',
                  '४. उजवीकडे बघा: Raw Dataset = PRIVATE राहील!'
                ]
              : [
                  '1. Dataset A is pre-selected (or upload your custom CSV).',
                  '2. Click the blue "Generate Privacy Proof" button.',
                  '3. Click the green "Submit Proof to Midnight" button.',
                  '4. Notice: Raw Dataset remains PRIVATE on your device.'
                ],
          actionLabel: lang === 'mr' ? 'प्रूफ जनरेट करून बघा' : 'Try Generating Proof',
          actionHref: '/contributor'
        };

      case '/developer':
        return {
          title: lang === 'mr' ? 'AI डेव्हलपर पोर्टल (AI Developer)' : 'AI Developer Portal',
          explanation:
            lang === 'mr'
              ? 'येथे AI डेव्हलपर आपल्या प्रोजेक्टच्या अटी ठरवतो आणि आलेले ZK प्रूफ्स तपासतो.'
              : 'Here AI developers define dataset requirements and verify incoming zero-knowledge proofs.',
          steps:
            lang === 'mr'
              ? [
                  '१. डॅशबोर्ड कार्ड्स तपासा (Total Projects, Verified, Avg Quality).',
                  '२. "Requirement Builder" बटण दाबून नवीन नियम ठरवून बघा.',
                  '३. "What kind of data do I need for this project?" हे AI बटण दाबून बघा.',
                  '४. खालील टेबलमध्ये आलेले ZK प्रूफ्स तपासा.'
                ]
              : [
                  '1. Check dashboard metrics (Total Projects, Verified, Quality).',
                  '2. Click "Requirement Builder" to define custom conditions.',
                  '3. Click "What kind of data do I need for this project?" for AI suggestions.',
                  '4. Review incoming contributions in the table.'
                ],
          actionLabel: lang === 'mr' ? 'डेव्हलपर फीचर्स वापरा' : 'Explore Developer Features',
          actionHref: '/developer'
        };

      case '/auditor':
        return {
          title: lang === 'mr' ? 'ऑडिटर पोर्टल (Auditor Registry)' : 'Auditor Registry',
          explanation:
            lang === 'mr'
              ? 'येथे कोणताही ऑडिटर कच्चा डेटा न पाहता संपूर्ण ब्लॉकचेन प्रूफ्सची सत्यता तपासू शकतो.'
              : 'Here independent auditors verify cryptographic verification events without accessing raw datasets.',
          steps:
            lang === 'mr'
              ? [
                  '१. वरील "AUDIT CHAIN INTEGRITY: 100% VALID" हिरवा बॅज बघा.',
                  '२. खाली "DC-1024" आधीच टाईप आहे, फक्त "Audit Query" बटण दाबा.',
                  '३. सिस्टीम दाखवेल: "YES — MATHEMATICALLY CERTIFIED".'
                ]
              : [
                  '1. Observe the "AUDIT CHAIN INTEGRITY: 100% VALID" badge.',
                  '2. With "DC-1024" pre-filled, click the "Audit Query" button.',
                  '3. The system confirms: "YES — MATHEMATICALLY CERTIFIED".'
                ],
          actionLabel: lang === 'mr' ? 'ऑडिट तपासा' : 'Test Audit Query',
          actionHref: '/auditor'
        };

      default:
        return {
          title: lang === 'mr' ? 'PrivateData AI मध्ये स्वागत आहे!' : 'Welcome to PrivateData AI!',
          explanation:
            lang === 'mr'
              ? 'हा ॲप तुम्हाला खाजगी डेटा कोणालाही न दाखवता AI मॉडेल्ससाठी सुरक्षितपणे वापरण्याची मुभा देतो.'
              : 'This platform lets you prove datasets meet AI requirements without revealing the underlying sensitive records.',
          steps:
            lang === 'mr'
              ? [
                  '१. खालील "10-Second Instant Demo Sandbox" मध्ये १-क्लिक ZK चाचणी घ्या.',
                  '२. वरच्या मेनूमधून "Data Contributor" वर क्लिक करून स्वतः डेटा सबमिट करा.',
                  '३. नंतर "AI Developer" बनून तो पुरावा तपासा.'
                ]
              : [
                  '1. Try the "10-Second Instant Demo Sandbox" on the home page.',
                  '2. Visit "Data Contributor" to test generating a ZK proof.',
                  '3. Visit "AI Developer" to review incoming proofs without raw data.'
                ],
          actionLabel: lang === 'mr' ? 'डेटा कॉन्ट्रिब्युटर पेजवर जा' : 'Go to Contributor Flow',
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
            {lang === 'mr' ? 'काय करायचं? (मदत)' : 'What To Do? (Help)'}
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
                  {lang === 'mr' ? 'सोपा गाईड' : 'Interactive Guide'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === 'mr' ? 'en' : 'mr')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-cyan-300 border border-slate-700 flex items-center gap-1"
                title="Change Language"
              >
                <Languages className="w-3 h-3" />
                <span>{lang === 'mr' ? 'English' : 'मराठी'}</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Explanation */}
          <p className="text-slate-300 mb-3 leading-relaxed">
            {guide.explanation}
          </p>

          {/* What To Do Checklist */}
          <div className="p-3 rounded-xl bg-black/50 border border-slate-800 mb-4 space-y-2">
            <span className="text-[11px] font-bold text-cyan-300 font-mono block">
              {lang === 'mr' ? '🎯 आता काय करायचं? (Step-by-Step):' : '🎯 What to do right now:'}
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
