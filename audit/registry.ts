// =============================================================================
// PrivateData AI - Audit Registry Module (Spec 14)
// Cryptographic, tamper-evident audit record store
// "Was this dataset proven to satisfy the requirements that existed at that time?"
// =============================================================================

import { createHash } from 'crypto';

export interface AuditRecord {
  verificationId: string;
  contributionId: string;
  projectId: string;
  requirementVersion: string;
  requirementPolicyHash: string;
  contributorId: string;
  proofStatus: 'VERIFIED_VALID' | 'VERIFIED_REJECTED' | 'INVALID_PROOF';
  timestamp: number;
  verifier: string; // e.g. "Midnight Preprod Contract 0x9a8f..." or "Devnet Verifier"
  proofReference: string;
  datasetCommitment: string; // H(salt || data)
  satisfiedRequirementsCount: number;
  totalRequirementsCount: number;
  network: 'MIDNIGHT_PREPROD' | 'MIDNIGHT_DEVNET_SIMULATOR';
  rawDatasetExposed: false; // Always false
  previousAuditHash: string; // Blockchain-like hash chaining
  entryHash: string;
}

export class AuditRegistry {
  private static records: AuditRecord[] = [];
  private static latestHash: string = '0000000000000000000000000000000000000000000000000000000000000000';

  /**
   * Records an audit event with cryptographic chaining
   */
  public static logVerification(entry: Omit<AuditRecord, 'previousAuditHash' | 'entryHash' | 'rawDatasetExposed'>): AuditRecord {
    const previousAuditHash = this.latestHash;

    const payload = `${entry.verificationId}:${entry.contributionId}:${entry.projectId}:${entry.requirementVersion}:${entry.proofStatus}:${entry.timestamp}:${entry.proofReference}:${entry.datasetCommitment}:${previousAuditHash}`;
    const entryHash = createHash('sha256').update(payload).digest('hex');

    const record: AuditRecord = {
      ...entry,
      rawDatasetExposed: false,
      previousAuditHash,
      entryHash
    };

    this.records.unshift(record); // newest first
    this.latestHash = entryHash;
    return record;
  }

  /**
   * Retrieves all audit records
   */
  public static getAllRecords(): AuditRecord[] {
    return [...this.records];
  }

  /**
   * Verifies the integrity of the audit chain
   */
  public static verifyChainIntegrity(): { isValid: boolean; totalBlocks: number; tamperedIndex?: number } {
    const list = [...this.records].reverse(); // oldest to newest
    let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';

    for (let i = 0; i < list.length; i++) {
      const rec = list[i];
      if (rec.previousAuditHash !== prevHash) {
        return { isValid: false, totalBlocks: list.length, tamperedIndex: i };
      }

      const payload = `${rec.verificationId}:${rec.contributionId}:${rec.projectId}:${rec.requirementVersion}:${rec.proofStatus}:${rec.timestamp}:${rec.proofReference}:${rec.datasetCommitment}:${rec.previousAuditHash}`;
      const recomputed = createHash('sha256').update(payload).digest('hex');

      if (recomputed !== rec.entryHash) {
        return { isValid: false, totalBlocks: list.length, tamperedIndex: i };
      }

      prevHash = rec.entryHash;
    }

    return { isValid: true, totalBlocks: list.length };
  }

  /**
   * Initialize with pre-seeded demo audit events
   */
  public static initSeedData() {
    if (this.records.length > 0) return;

    this.logVerification({
      verificationId: 'ver-a189f4b73210',
      contributionId: 'DC-1024',
      projectId: 'AI-PROJECT-001',
      contributorId: 'contrib-001',
      requirementVersion: '1.0',
      requirementPolicyHash: '7b2a9f14c8e3d09a25b84e1160a2b97c413e1f5798da2bf56e2978931b238d10',
      proofStatus: 'VERIFIED_VALID',
      timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
      verifier: 'Midnight Preprod Validator (0x9a8f4c2b...)',
      proofReference: 'zk-proof-8f12c9b3a401',
      datasetCommitment: '9e4a8b723f501c6d8923a105ef29487b3a9c6d123e45f78a01b23c4d5e6f7a8b',
      satisfiedRequirementsCount: 6,
      totalRequirementsCount: 6,
      network: 'MIDNIGHT_PREPROD'
    });

    this.logVerification({
      verificationId: 'ver-c89201f92e34',
      contributionId: 'DC-1023',
      projectId: 'AI-PROJECT-001',
      contributorId: 'contrib-002',
      requirementVersion: '1.0',
      requirementPolicyHash: '7b2a9f14c8e3d09a25b84e1160a2b97c413e1f5798da2bf56e2978931b238d10',
      proofStatus: 'VERIFIED_REJECTED',
      timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
      verifier: 'Midnight Compact Engine (0x9a8f4c2b...)',
      proofReference: 'zk-proof-10928bf347ad',
      datasetCommitment: '3d87f9104c2b9a8f7e615024acb1e987f2305612847a9cb021e87d45f3192084',
      satisfiedRequirementsCount: 3,
      totalRequirementsCount: 6,
      network: 'MIDNIGHT_PREPROD'
    });

    this.logVerification({
      verificationId: 'ver-f02384a71b95',
      contributionId: 'DC-1022',
      projectId: 'AI-PROJECT-002',
      contributorId: 'mn_addr_preprod1karph55n2rqcdcxlpvm7ljk39fxep0aqtcca5fskq0cf03lcqujq0gugeh',
      requirementVersion: '1.1',
      requirementPolicyHash: 'e49a8f102c9b7d3419087521abf089274c3e5912a784d0b138e652a91f34b870',
      proofStatus: 'VERIFIED_VALID',
      timestamp: Date.now() - 1000 * 60 * 60 * 8, // 8 hours ago
      verifier: 'Midnight Preprod Validator (0x9a8f4c2b...)',
      proofReference: 'zk-proof-7289f30b91e2',
      datasetCommitment: '8a1290fe347bc9102458f3910abec479018274d56ef190432bc78901ad45ef67',
      satisfiedRequirementsCount: 6,
      totalRequirementsCount: 6,
      network: 'MIDNIGHT_PREPROD'
    });
  }
}

// Seed on module load
AuditRegistry.initSeedData();
