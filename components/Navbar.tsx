'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Brain, Scale, Cpu, Search, Award, Lock, ExternalLink, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Platform Home', href: '/', icon: Shield },
    { label: 'Data Contributor', href: '/contributor', icon: Lock, badge: 'Role 1' },
    { label: 'AI Developer', href: '/developer', icon: Brain, badge: 'Role 2' },
    { label: 'Auditor Portal', href: '/auditor', icon: Scale, badge: 'Role 3' },
    { label: 'Data Matching', href: '/matching', icon: Search },
    { label: 'Reputation', href: '/reputation', icon: Award },
    { label: 'Midnight ZK', href: '/midnight', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-950/60 bg-[#070B14]/85 backdrop-blur-md">
      {/* Top Protocol Status Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-purple-950/40 px-4 py-1 text-xs text-cyan-300 flex items-center justify-between border-b border-cyan-900/30">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="font-mono font-medium text-slate-300">
            Midnight Zero-Knowledge Layer Active
          </span>
          <span className="hidden md:inline-block text-slate-500">|</span>
          <span className="hidden md:inline-block text-slate-400">
            Compact DSL Contract: <code className="text-cyan-400 font-mono">privatedata_ai.compact</code>
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <Shield className="w-3 h-3" /> ZERO RAW DATA TRANSMITTED
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Network: Preprod / Devnet</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-all duration-300">
              <div className="w-full h-full bg-[#070B14] rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  PrivateData <span className="text-cyan-400">AI</span>
                </span>
                <span className="text-[10px] font-mono uppercase bg-cyan-950/80 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800/40">
                  ZK v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5">
                Prove qualification without revealing data
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 shadow-sm shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1 py-0.2 bg-slate-800 text-slate-300 rounded border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2">
            <Link
              href="/contributor"
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-medium px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 font-semibold shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Contribute Data</span>
            </Link>
            <Link
              href="/developer"
              className="inline-flex items-center space-x-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all"
            >
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Developer</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Bar */}
      <div className="lg:hidden flex overflow-x-auto px-4 py-2 space-x-2 border-t border-slate-800/80 bg-[#0B1120]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap px-2.5 py-1.5 rounded-md text-xs flex items-center space-x-1.5 ${
                isActive ? 'text-cyan-300 bg-cyan-950/80 border border-cyan-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
