'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useWallet } from './WalletContext';

function shortenAddress(addr: string) {
  if (!addr) return '';
  if (addr.length > 18) return addr.slice(0, 8) + '...' + addr.slice(-6);
  return addr;
}

// ─── OFFICIAL 1AM WALLET SYNC & AUTHORIZATION MODAL ────────────────────────────
function OfficialSyncModal({
  onClose,
  errorMessage,
  onRetry,
  onDevnetSync,
}: {
  onClose: () => void;
  errorMessage: string | null;
  onRetry: () => void;
  onDevnetSync: () => void;
}) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  const isNotDetected = errorMessage === 'NO_OFFICIAL_EXTENSION_DETECTED' || errorMessage?.includes('NOT_DETECTED');

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999999,
        background: 'rgba(3, 7, 18, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'backdropFadeIn 0.2s ease',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: '450px',
          maxWidth: '96vw',
          background: '#0B0F17',
          borderRadius: '22px',
          boxShadow: '0 30px 100px rgba(0, 0, 0, 0.95), 0 0 50px rgba(6, 182, 212, 0.45)',
          border: isNotDetected ? '2px solid rgba(239, 68, 68, 0.7)' : '2px solid rgba(6, 182, 212, 0.75)',
          overflow: 'hidden',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          animation: 'popupSpring 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            background: '#070A0F',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '22px' }}>⏱</span>
            <span style={{ fontWeight: 800, fontSize: '18px', color: '#fff' }}>1AM Wallet</span>
            <span style={{ color: '#FACC15', fontSize: '15px' }}>⚡</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                background: 'rgba(16,185,129,0.18)',
                border: '1px solid rgba(16,185,129,0.45)',
                color: '#34D399',
                fontSize: '10px',
                fontWeight: 800,
                fontFamily: 'monospace',
                padding: '3px 8px',
                borderRadius: '6px',
              }}
            >
              PREPROD SYNC
            </span>

            <div style={{ background: '#fff', color: '#070A0F', fontWeight: 900, fontSize: '12px', padding: '3px 7px', borderRadius: '5px' }}>
              WA
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                fontSize: '15px',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 20px', textAlign: 'center', background: '#0F172A' }}>
          {isNotDetected ? (
            <div>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '2px solid rgba(239, 68, 68, 0.5)',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}
              >
                ⚠️
              </div>

              <h3 style={{ margin: '0 0 8px', color: '#fff', fontSize: '17px', fontWeight: 800 }}>
                1AM Chrome Extension Sync
              </h3>

              <p style={{ margin: '0 0 16px', color: '#94A3B8', fontSize: '13px', lineHeight: 1.5 }}>
                Chrome टूलबारमधील <strong>⏱️ 1AM Wallet</strong> चिन्हावर एकदा क्लिक करून या टॅबसाठी सक्रिय करा, किंवा थेट प्रीप्रॉड सिंक वापरा:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  onClick={onRetry}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#030712',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(6,182,212,0.4)',
                  }}
                >
                  🔄 Retry Official Sync (window.midnight)
                </button>

                <button
                  type="button"
                  onClick={onDevnetSync}
                  style={{
                    width: '100%',
                    padding: '11px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '12px',
                    color: '#CBD5E1',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  ⚡ Authorize &amp; Sync Preprod Account (WA)
                </button>
              </div>
            </div>
          ) : errorMessage ? (
            <div>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '2px solid rgba(239, 68, 68, 0.5)',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}
              >
                ✕
              </div>

              <h3 style={{ margin: '0 0 8px', color: '#fff', fontSize: '17px', fontWeight: 800 }}>
                Extension Response
              </h3>

              <p style={{ margin: '0 0 18px', color: '#FCA5A5', fontSize: '13px', lineHeight: 1.5 }}>
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={onRetry}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#030712',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                🔄 Retry Official Connection
              </button>
            </div>
          ) : (
            <div>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(6, 182, 212, 0.15)',
                  border: '2px solid rgba(6, 182, 212, 0.6)',
                  margin: '0 auto 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '30px',
                  animation: 'spinPulse 1.6s infinite ease-in-out',
                }}
              >
                ⏱️
              </div>

              <h3 style={{ margin: '0 0 8px', color: '#fff', fontSize: '18px', fontWeight: 800 }}>
                Syncing with 1AM Wallet Extension...
              </h3>

              <p style={{ margin: '0 0 16px', color: '#94A3B8', fontSize: '13px', lineHeight: 1.5 }}>
                Official Midnight DApp Connector द्वारे विनंती पाठवली आहे. कृपया तुमच्या 1AM Extension Pop-up मध्ये मान्यता द्या.
              </p>

              <div
                style={{
                  background: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  marginBottom: '18px',
                  fontSize: '11px',
                  color: '#38BDF8',
                  fontFamily: 'monospace',
                }}
              >
                ⚡ Calling: <code>window.midnight.connect(&apos;preprod&apos;)</code>
              </div>

              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '9px 20px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                  color: '#CBD5E1',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes backdropFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes popupSpring {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spinPulse {
          0%   { transform: scale(1); box-shadow: 0 0 0 rgba(6, 182, 212, 0.4); }
          50%  { transform: scale(1.1); box-shadow: 0 0 25px rgba(6, 182, 212, 0.7); }
          100% { transform: scale(1); box-shadow: 0 0 0 rgba(6, 182, 212, 0.4); }
        }
      `}</style>
    </div>,
    document.body
  );
}

// ─── WALLET BUTTON ────────────────────────────────────────────────────────────
export function WalletButton() {
  const { isConnected, address, balance, disconnect, connect, connectDevnet } = useWallet();
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleConnectClick = async () => {
    setIsSyncing(true);
    setErrorMessage(null);

    try {
      // Calls the official Midnight DApp connector protocol
      await connect('1am');
      setIsSyncing(false);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Connection failed');
    }
  };

  const handleDevnetSync = () => {
    connectDevnet('1am');
    setIsSyncing(false);
    setErrorMessage(null);
  };

  const handleCopy = () => {
    if (address) {
      navigator.clipboard?.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {isConnected ? (
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              background: 'rgba(6, 182, 212, 0.12)',
              border: '1px solid rgba(6, 182, 212, 0.45)',
              borderRadius: '12px',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = '1px solid rgba(6, 182, 212, 0.8)';
              e.currentTarget.style.background = 'rgba(6, 182, 212, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = '1px solid rgba(6, 182, 212, 0.45)';
              e.currentTarget.style.background = 'rgba(6, 182, 212, 0.12)';
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 6px #10b981',
                display: 'inline-block',
              }}
            />
            <span>⏱️</span>
            <span style={{ fontFamily: 'monospace' }}>WA ({shortenAddress(address || '')})</span>
            <span style={{ color: '#94a3b8', fontSize: '10px' }}>▼</span>
          </button>

          {showDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                background: '#070b14',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                borderRadius: '16px',
                padding: '14px',
                minWidth: '260px',
                zIndex: 1000,
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 20px rgba(6, 182, 212, 0.15)',
              }}
            >
              <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '8px' }}>
                <div style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>
                  CONNECTED MIDNIGHT WALLET
                </div>
                <div style={{ color: '#fff', fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>
                  ⏱️ 1AM Wallet • Account WA
                </div>
              </div>

              <div style={{ padding: '6px 10px' }}>
                <div style={{ color: '#94a3b8', fontSize: '10px' }}>Address</div>
                <div
                  onClick={handleCopy}
                  title="Click to copy address"
                  style={{
                    color: '#22d3ee',
                    fontSize: '11px',
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    marginTop: '2px',
                  }}
                >
                  {address} {copied ? '✅' : '📋'}
                </div>
              </div>

              <div style={{ padding: '6px 10px' }}>
                <div style={{ color: '#94a3b8', fontSize: '10px' }}>DUST Balance</div>
                <div style={{ color: '#10b981', fontSize: '13px', fontWeight: 700, fontFamily: 'monospace' }}>
                  {balance}
                </div>
              </div>

              <div style={{ padding: '6px 10px', marginBottom: '8px' }}>
                <div style={{ color: '#94a3b8', fontSize: '10px' }}>Network</div>
                <div style={{ color: '#fff', fontSize: '11px', fontWeight: 600 }}>
                  Midnight Preprod Live
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  disconnect();
                  setShowDropdown(false);
                }}
                style={{
                  width: '100%',
                  padding: '9px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
                  color: '#fca5a5',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 700,
                  transition: 'all 0.15s',
                }}
              >
                🔌 Disconnect Wallet
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleConnectClick}
          disabled={isSyncing}
          style={{
            padding: '9px 18px',
            background: isSyncing
              ? 'rgba(6, 182, 212, 0.4)'
              : 'linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#030712',
            fontWeight: 800,
            fontSize: '13px',
            cursor: isSyncing ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 16px rgba(6, 182, 212, 0.3)',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
          }}
          onMouseEnter={(e) => {
            if (!isSyncing) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(6, 182, 212, 0.45)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(6, 182, 212, 0.3)';
          }}
        >
          <span>🔗</span>
          <span>{isSyncing ? 'Syncing 1AM...' : 'Connect Wallet'}</span>
        </button>
      )}

      {isSyncing && (
        <OfficialSyncModal
          onClose={() => {
            setIsSyncing(false);
            setErrorMessage(null);
          }}
          errorMessage={errorMessage}
          onRetry={handleConnectClick}
          onDevnetSync={handleDevnetSync}
        />
      )}
    </>
  );
}

export default WalletButton;
