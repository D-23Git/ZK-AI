'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Brain, Scale, Cpu, Search, Award, Lock, Sparkles } from 'lucide-react';
import { WalletButton } from '@/components/WalletConnect';

import { useWallet } from '@/components/WalletContext';

export default function Navbar() {
  const pathname = usePathname();
  const { isConnected, address, walletType } = useWallet();

  const navItems = [
    { label: 'Platform Home', href: '/', icon: Shield },
    { label: 'Data Contributor', href: '/contributor', icon: Lock },
    { label: 'AI Developer', href: '/developer', icon: Brain },
    { label: 'Auditor Portal', href: '/auditor', icon: Scale },
    { label: 'Data Matching', href: '/matching', icon: Search },
    { label: 'Reputation', href: '/reputation', icon: Award },
    { label: 'Midnight ZK', href: '/midnight', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#060911]/60 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      {/* Top Protocol Status Banner */}
      <div className="bg-gradient-to-r from-blue-950/50 via-cyan-950/40 to-purple-950/50 px-4 py-1 text-[11px] text-cyan-300 flex items-center justify-between border-b border-cyan-900/30">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="font-mono font-medium text-slate-200">
            Midnight ZK Preprod Network Active
          </span>
          <span className="hidden md:inline-block text-slate-600">|</span>
          <span className="hidden md:inline-block text-slate-400">
            Contract: <code className="text-cyan-400 font-mono">privatedata_ai.compact</code>
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          {isConnected ? (
            <span className="text-cyan-300 font-mono flex items-center gap-1.5 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{walletType === '1am' ? '⏱️ 1AM Wallet:' : '🌀 Midnight Lace:'}</span>
              <span className="text-white font-bold">{address ? address.slice(0, 6) + '...' + address.slice(-4) : ''}</span>
            </span>
          ) : (
            <span className="text-slate-400 font-medium flex items-center gap-1">
              ⏱️ Midnight 1AM Wallet Disconnected
            </span>
          )}
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-mono font-semibold">Preprod Live</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-all duration-300">
              <div className="w-full h-full bg-[#070B14] rounded-[9px] flex items-center justify-center">
                <Shield className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                PrivateData <span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[10px] font-mono font-semibold uppercase bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800/60">
                Preprod ZK
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/70 border border-cyan-800/60 shadow-sm shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Wallet Action Button */}
          <div className="flex items-center space-x-2 shrink-0">
            <WalletButton />
          </div>
        </div>
      </div>

      {/* Secondary Bar for Mobile screens */}
      <div className="lg:hidden flex overflow-x-auto px-4 py-2 space-x-2 border-t border-slate-800/80 bg-[#0B1120] scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap px-2.5 py-1.5 rounded-md text-xs flex items-center space-x-1.5 font-medium ${
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
