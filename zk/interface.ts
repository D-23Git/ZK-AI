// =============================================================================
// PrivateData AI - Zero-Knowledge Proof Service Interface
// Spec 8: interface DatasetProofService
// =============================================================================

export interface DatasetMetrics {
  recordCount: number;
  completeness: number; // e.g. 97.8 for 97.8%
  duplicateRate: number; // e.g. 0.4 for 0.4%
  qualityScore: number; // 0 - 100
  format: string; // 'CSV' | 'JSON'
  schemaFields: string[];
  category: string; // 'Healthcare' | 'Finance' | 'Education' | 'Retail' | 'Research' | 'Manufacturing' | 'Other'
}

export interface DatasetRequirements {
  projectId: string;
  version: string; // e.g. "1.0", "1.1"
  minRecords: number;
  minCompleteness: number; // percentage
  maxDuplicateRate: number; // percentage
  minQualityScore: number; // 0-100
  allowedFormats: string[];
  requiredFields: string[];
  category?: string;
  customConditions?: Array<{
    field: string;
    operator: '>=' | '<=' | '==' | '!=' | '>' | '<';
    value: number | string;
    description: string;
  }>;
}

export interface ProofInput {
  // Private Inputs (Held securely by contributor, NEVER transmitted raw)
  privateData: {
    metrics: DatasetMetrics;
    rawDatasetHash: string; // SHA-256 hash of raw records
    salt: string; // Cryptographic blinding factor (32-byte hex)
    recordsSampleCount?: number;
  };
  // Public Inputs (Known to both parties and verifiable on-chain/ledger)
  publicInputs: {
    projectId: string;
    requirementVersion: string;
    requirementsHash: string;
    contributorId: string;
    datasetCommitment: string; // H(salt || rawDatasetHash || metricsSummary)
    nonce: string; // Replay attack protection
    timestamp: number; // Unix epoch ms
  };
  requirements: DatasetRequirements;
}

export interface Proof {
  proofId: string;
  proofType: 'MIDNIGHT_COMPACT_SIMULATED' | 'MIDNIGHT_COMPACT_PREPROD';
  publicInputs: ProofInput['publicInputs'];
  // Cryptographic zero-knowledge proof payload
  zkPayload: {
    a: [string, string];
    b: [[string, string], [string, string]];
    c: [string, string];
    protocol: 'groth16_midnight' | 'plonk_midnight';
    curve: 'bls12-381';
    circuitHash: string;
    compactContractAddress?: string;
  };
  satisfiedConditions: {
    recordRequirement: boolean;
    completenessRequirement: boolean;
    duplicateRateRequirement: boolean;
    qualityRequirement: boolean;
    formatRequirement: boolean;
    schemaRequirement: boolean;
    customConditionsCount: number;
    allSatisfied: boolean;
  };
  datasetCommitment: string;
  signature: string; // Contributor ECDSA / Ed25519 signature over commitment + nonce
  createdAt: number;
  expiresAt: number; // Replay / TTL expiration
}

export interface VerificationResult {
  isValid: boolean;
  verifiedAt: number;
  verificationId: string;
  proofReference: string;
  requirementVersion: string;
  projectId: string;
  contributorId: string;
  details: {
    recordsSatisfied: boolean;
    completenessSatisfied: boolean;
    duplicateRateSatisfied: boolean;
    qualitySatisfied: boolean;
    formatSatisfied: boolean;
    schemaSatisfied: boolean;
    allSatisfied: boolean;
    commitmentVerified: boolean;
    replayNonceValid: boolean;
    timestampValid: boolean;
  };
  networkTarget: 'MIDNIGHT_PREPROD' | 'MIDNIGHT_DEVNET_SIMULATOR';
  contractAddress: string;
  message: string;
  rawDatasetAccessible: false; // Explicit guarantee: raw data is never exposed
}

export interface DatasetProofService {
  /**
   * Generates a Zero-Knowledge proof locally in the contributor's private environment.
   * Proves requirements are met without exposing sensitive underlying records.
   */
  generateProof(input: ProofInput): Promise<Proof>;

  /**
   * Verifies the cryptographic proof against public inputs and requirement version.
   * Can be executed by the AI Developer, Auditor, or Midnight Smart Contract.
   */
  verifyProof(proof: Proof): Promise<VerificationResult>;
}
