'use client';

import React, { useState } from 'react';
import { useWallet } from './WalletContext';
import { Shield, Check, Copy, ExternalLink, AlertCircle, RefreshCw, X, Download } from 'lucide-react';

function shortenAddress(addr: string | null) {
  if (!addr) return '';
  if (addr.length > 18) return addr.slice(0, 10) + '...' + addr.slice(-6);
  return addr;
}

export function WalletButton() {
  const { connected, address, balance, isConnecting, error, connect, disconnect, connectDemo, clearError } = useWallet();
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const copyAddr = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="relative">
        {!connected ? (
          <button
            onClick={connect}
            disabled={isConnecting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isConnecting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Approving in Wallet...</span>
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-xs font-mono text-emerald-300 hover:border-emerald-400 flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{shortenAddress(address)}</span>
              <span className="text-[10px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
                {balance}
              </span>
            </button>
          </div>
        )}

        {/* Dropdown Menu when Connected */}
        {connected && showDropdown && (
          <div className="absolute right-0 mt-2 w-64 p-3 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-slate-400 font-semibold">Midnight Preprod</span>
              <span className="text-emerald-400 text-[10px] font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <div className="bg-black/50 p-2 rounded-xl font-mono text-[11px] text-slate-300 flex items-center justify-between break-all">
              <span className="truncate mr-2">{address}</span>
              <button onClick={copyAddr} className="text-slate-400 hover:text-white flex-shrink-0">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Available Balance:</span>
              <span className="font-mono font-bold text-white">{balance}</span>
            </div>

            <button
              onClick={() => {
                disconnect();
                setShowDropdown(false);
              }}
              className="w-full py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-medium text-center transition-all cursor-pointer"
            >
              Disconnect Wallet
            </button>
          </div>
        )}
      </div>

      {/* Real Wallet Error / Installation Guidance Modal */}
      {error && (
        <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0a0f1d] border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400">
                <AlertCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <h3 className="text-sm font-bold text-white">
                  {error.code === 'not-detected'
                    ? 'Midnight Wallet Not Detected'
                    : error.code === 'rejected'
                    ? 'Connection Cancelled'
                    : 'Wallet Connection Notice'}
                </h3>
              </div>
              <button
                onClick={clearError}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {error.message}
            </p>

            {error.code === 'not-detected' && (
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-[11px] text-slate-400 space-y-1">
                <div className="text-slate-200 font-medium">To connect a real wallet:</div>
                <div>1. Install the official <strong>Midnight Lace Wallet</strong> extension.</div>
                <div>2. Set your network to <strong>Midnight Preprod</strong>.</div>
                <div>3. Refresh this page and click Connect.</div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              {error.code === 'not-detected' ? (
                <>
                  <a
                    href="https://docs.midnight.network/relnotes/lace"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
                  >
                    <Download className="w-3.5 h-3.5" /> Install Lace Wallet
                  </a>
                  <button
                    onClick={() => {
                      clearError();
                      connectDemo();
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-white/10 transition-all cursor-pointer"
                  >
                    Use Demo Session
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      clearError();
                      connect();
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => {
                      clearError();
                      connectDemo();
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-white/10 transition-all cursor-pointer"
                  >
                    Use Demo Session
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WalletButton;
