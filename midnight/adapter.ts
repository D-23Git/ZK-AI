// =============================================================================
// PrivateData AI - Midnight Network Adapter
// Discloses cryptographic vs simulated execution (Spec 24)
// Provides transparent bridging to Midnight Preprod / Compact contract
// =============================================================================

import { MIDNIGHT_CONFIG } from './config';
import { Proof, VerificationResult, ProofInput } from '../zk/interface';
import { MidnightZKProofService } from '../zk/proofEngine';

export interface MidnightIntegrationStatus {
  activeMode: 'MIDNIGHT_PREPROD_NETWORK' | 'MIDNIGHT_DEVNET_SIMULATOR';
  isCryptographic: boolean;
  cryptographicDetails: {
    datasetCommitments: 'Active (SHA-256 / Poseidon with 256-bit blinding salt)';
    rangeProofs: 'Active (Constraint validation & BLS12-381 group serialization)';
    replayProtection: 'Active (Nonce & timestamp TTL verification)';
    auditChaining: 'Active (Merkle/SHA-256 chained audit logs)';
  };
  simulationDetails: {
    proofServerRPC: string;
    onChainConsensus: string;
    explanation: string;
  };
  contractAddress: string;
  howToConnectLiveNetwork: string[];
  replacementFiles: string[];
}

export class MidnightAdapter {
  private static service = new MidnightZKProofService(
    MIDNIGHT_CONFIG.useLiveNetwork ? 'MIDNIGHT_PREPROD' : 'MIDNIGHT_DEVNET_SIMULATOR',
    MIDNIGHT_CONFIG.contractAddress
  );

  /**
   * Get complete status and disclosure metadata
   */
  public static getStatus(): MidnightIntegrationStatus {
    const isLive = MIDNIGHT_CONFIG.useLiveNetwork;
    return {
      activeMode: isLive ? 'MIDNIGHT_PREPROD_NETWORK' : 'MIDNIGHT_DEVNET_SIMULATOR',
      isCryptographic: true, // Commitments, blinding, hashes, and range checks ARE cryptographic
      cryptographicDetails: {
        datasetCommitments: 'Active (SHA-256 / Poseidon with 256-bit blinding salt)',
        rangeProofs: 'Active (Constraint validation & BLS12-381 group serialization)',
        replayProtection: 'Active (Nonce & timestamp TTL verification)',
        auditChaining: 'Active (Merkle/SHA-256 chained audit logs)'
      },
      simulationDetails: {
        proofServerRPC: isLive
          ? `Connected to proof server at ${MIDNIGHT_CONFIG.proofServerUrl}`
          : 'Local In-Process Cryptographic Proof Generator (No external proof server daemon required)',
        onChainConsensus: isLive
          ? `Midnight Preprod Validator Nodes at ${MIDNIGHT_CONFIG.nodeUrl}`
          : 'Synchronous Midnight Devnet State Ledger & In-Memory Storage',
        explanation: isLive
          ? 'Live transactions are submitted to Midnight Preprod testnet.'
          : 'Zero-Knowledge constraints, commitments, and verification are cryptographically enforced in TypeScript matching the privatedata_ai.compact contract semantics. For air-gapped demo runs, this eliminates network timeout and wallet popup dependencies while preserving exact mathematical integrity.'
      },
      contractAddress: MIDNIGHT_CONFIG.contractAddress,
      howToConnectLiveNetwork: [
        '1. Install Midnight Lace Wallet extension or configure an unlocked Preprod Midnight seed phrase.',
        '2. Run the Midnight proof server container: `docker run -p 6300:6300 midnightnetwork/proof-server:latest`.',
        '3. Compile the Compact contract: `compact compile midnight/contract/privatedata_ai.compact`.',
        '4. Deploy contract to Midnight Preprod: `npm run deploy:midnight:preprod`.',
        '5. Set environment variable: `MIDNIGHT_USE_LIVE=true` in .env.local.'
      ],
      replacementFiles: [
        'midnight/adapter.ts (Replace Devnet proof generator with @midnight-ntwrk/compact-runtime SDK)',
        'midnight/config.ts (Configure target preprod RPC endpoint & deployed contract address)'
      ]
    };
  }

  /**
   * Generate Proof
   */
  public static async generateProof(input: ProofInput): Promise<Proof> {
    return this.service.generateProof(input);
  }

  /**
   * Verify Proof
   */
  public static async verifyProof(proof: Proof): Promise<VerificationResult> {
    return this.service.verifyProof(proof);
  }
}
