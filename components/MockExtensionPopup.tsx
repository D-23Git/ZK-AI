'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface MockExtensionPopupProps {
  type: 'CONNECT' | 'SIGN';
  payload?: string;
  onApprove: () => void;
  onReject: () => void;
}

export function MockExtensionPopup({ type, payload, onApprove, onReject }: MockExtensionPopupProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '360px',
      background: '#1E1E24',
      border: '1px solid #333',
      borderRadius: '12px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      zIndex: 9999999999,
      fontFamily: 'sans-serif',
      color: '#fff',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: '#2A2A35',
        padding: '16px',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          1AM
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>1AM Wallet</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>Midnight Preprod Network</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 20px' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 600, textAlign: 'center' }}>
          {type === 'CONNECT' ? 'Connection Request' : 'Signature Request'}
        </h2>
        
        <div style={{
          background: '#2A2A35',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#9CA3AF' }}>
            <strong style={{ color: '#fff' }}>PrivateData AI</strong> is requesting permission to:
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#D1D5DB' }}>
            {type === 'CONNECT' ? (
              <>
                <li>View your wallet address</li>
                <li>View your DUST token balance</li>
              </>
            ) : (
              <>
                <li>Sign a Zero-Knowledge proof transaction</li>
                <li style={{ marginTop: '4px', color: '#9CA3AF', fontSize: '11px' }}>Payload: {payload}</li>
              </>
            )}
          </ul>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={onReject}
            style={{
              flex: 1,
              padding: '12px',
              background: 'transparent',
              border: '1px solid #4B5563',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Reject
          </button>
          <button 
            onClick={onApprove}
            style={{
              flex: 1,
              padding: '12px',
              background: '#06B6D4',
              border: 'none',
              borderRadius: '8px',
              color: '#000',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Approve
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
