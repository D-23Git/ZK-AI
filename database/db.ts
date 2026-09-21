// =============================================================================
// PrivateData AI - Data Store Layer (/database/db.ts)
// Zero-dependency runtime data store with instant reactivity & PostgreSQL parity
// =============================================================================

import { SEED_PROJECTS, ProjectData } from '../projects';
import { AuditRegistry, AuditRecord } from '../audit/registry';
import { Proof, VerificationResult } from '../zk/interface';

export interface StoredContribution {
  id: string; // e.g. DC-1024
  projectId: string;
  projectName: string;
  category: string;
  contributorId: string;
  contributorName: string;
  datasetName: string;
  requirementVersion: string;
  policyHash: string;
  datasetCommitment: string; // H(salt || rawData) - NEVER RAW DATA
  status: 'PENDING' | 'VERIFIED' | 'ACCEPTED' | 'REJECTED';
  proofStatus: 'VALID' | 'FAILED' | 'PENDING';
  qualityScore: number;
  completeness: number;
  duplicateRate: number;
  recordCount: number;
  format: string;
  submittedAt: number;
  proofId?: string;
  proof?: Proof;
  verificationResult?: VerificationResult;
  disclosureRequested: boolean;
  disclosureConsented: boolean;
  privacyNotice: string;
}

export interface ContributorReputation {
  contributorId: string;
  name: string;
  verifiedContributions: number;
  successfulVerifications: number;
  averageQuality: number;
  requirementMatchRate: number; // %
  lastActivity: number;
}

class InMemoryDB {
  public projects: Map<string, ProjectData> = new Map();
  public contributions: Map<string, StoredContribution> = new Map();
  public reputations: Map<string, ContributorReputation> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    // Seed Projects
    SEED_PROJECTS.forEach(p => this.projects.set(p.id, { ...p }));

    // Seed Reputations (Spec 13)
    this.reputations.set('contrib-001', {
      contributorId: 'contrib-001',
      name: 'Dr. Sarah Lin (BioStat Lab)',
      verifiedContributions: 14,
      successfulVerifications: 13,
      averageQuality: 94.7,
      requirementMatchRate: 96.0,
      lastActivity: Date.now() - 1000 * 60 * 30
    });

    this.reputations.set('contrib-002', {
      contributorId: 'contrib-002',
      name: 'Apex Data Guild',
      verifiedContributions: 8,
      successfulVerifications: 7,
      averageQuality: 92.4,
      requirementMatchRate: 91.5,
      lastActivity: Date.now() - 1000 * 60 * 60 * 4
    });

    // Seed Contributions (Spec 9 & 10)
    const seedContribs: StoredContribution[] = [
      {
        id: 'DC-1024',
        projectId: 'AI-PROJECT-001',
        projectName: 'Healthcare AI Research',
        category: 'Healthcare',
        contributorId: 'contrib-001',
        contributorName: 'Dr. Sarah Lin (BioStat Lab)',
        datasetName: 'Medical Dataset A',
        requirementVersion: '1.0',
        policyHash: '7b2a9f14c8e3d09a25b84e1160a2b97c413e1f5798da2bf56e2978931b238d10',
        datasetCommitment: '9e4a8b723f501c6d8923a105ef29487b3a9c6d123e45f78a01b23c4d5e6f7a8b',
        status: 'ACCEPTED',
        proofStatus: 'VALID',
        qualityScore: 94,
        completeness: 97.8,
        duplicateRate: 0.4,
        recordCount: 125430,
        format: 'CSV',
        submittedAt: Date.now() - 1000 * 60 * 60 * 3,
        proofId: 'zk-proof-8f12c9b3a401',
        disclosureRequested: false,
        disclosureConsented: false,
        privacyNotice: 'PROTECTED: Raw dataset rows remain isolated on contributor machine.'
      },
      {
        id: 'DC-1023',
        projectId: 'AI-PROJECT-001',
        projectName: 'Healthcare AI Research',
        category: 'Healthcare',
        contributorId: 'contrib-002',
        contributorName: 'Apex Data Guild',
        datasetName: 'Medical Dataset B',
        requirementVersion: '1.0',
        policyHash: '7b2a9f14c8e3d09a25b84e1160a2b97c413e1f5798da2bf56e2978931b238d10',
        datasetCommitment: '3d87f9104c2b9a8f7e615024acb1e987f2305612847a9cb021e87d45f3192084',
        status: 'REJECTED',
        proofStatus: 'FAILED',
        qualityScore: 72,
        completeness: 81.0,
        duplicateRate: 8.0,
        recordCount: 50000,
        format: 'CSV',
        submittedAt: Date.now() - 1000 * 60 * 60 * 5,
        proofId: 'zk-proof-10928bf347ad',
        disclosureRequested: false,
        disclosureConsented: false,
        privacyNotice: 'Failed completeness and quality threshold in Zero-Knowledge.'
      },
      {
        id: 'DC-1022',
        projectId: 'AI-PROJECT-002',
        projectName: 'Financial Fraud Detection AI',
        category: 'Finance',
        contributorId: 'mn_addr_preprod1karph55n2rqcdcxlpvm7ljk39fxep0aqtcca5fskq0cf03lcqujq0gugeh',
        contributorName: 'Anonymous 1AM Wallet',
        datasetName: 'Banking Fraud Feed 2026',
        requirementVersion: '1.0',
        policyHash: 'e49a8f102c9b7d3419087521abf089274c3e5912a784d0b138e652a91f34b870',
        datasetCommitment: '8a1290fe347bc9102458f3910abec479018274d56ef190432bc78901ad45ef67',
        status: 'VERIFIED',
        proofStatus: 'VALID',
        qualityScore: 96,
        completeness: 98.4,
        duplicateRate: 1.1,
        recordCount: 32000,
        format: 'CSV',
        submittedAt: Date.now() - 1000 * 60 * 60 * 8,
        proofId: 'zk-proof-7289f30b91e2',
        disclosureRequested: false,
        disclosureConsented: false,
        privacyNotice: 'PROTECTED: Raw dataset rows remain isolated on contributor machine.'
      }
    ];

    seedContribs.forEach(c => this.contributions.set(c.id, c));
  }

  // Projects API
  public getProjects(): ProjectData[] {
    return Array.from(this.projects.values());
  }

  public getProject(id: string): ProjectData | undefined {
    return this.projects.get(id);
  }

  public saveProject(project: ProjectData): ProjectData {
    this.projects.set(project.id, project);
    return project;
  }

  // Contributions API
  public getContributions(projectId?: string): StoredContribution[] {
    const all = Array.from(this.contributions.values()).sort((a, b) => b.submittedAt - a.submittedAt);
    if (projectId) {
      return all.filter(c => c.projectId === projectId);
    }
    return all;
  }

  public getContribution(id: string): StoredContribution | undefined {
    return this.contributions.get(id);
  }

  public saveContribution(contribution: StoredContribution): StoredContribution {
    this.contributions.set(contribution.id, contribution);

    // Update project stats
    const proj = this.projects.get(contribution.projectId);
    if (proj) {
      const projContribs = this.getContributions(proj.id);
      proj.stats.contributionsCount = projContribs.length;
      proj.stats.verifiedCount = projContribs.filter(c => c.status === 'VERIFIED' || c.status === 'ACCEPTED').length;
      proj.stats.pendingCount = projContribs.filter(c => c.status === 'PENDING').length;
      proj.stats.rejectedCount = projContribs.filter(c => c.status === 'REJECTED').length;
      const totalQuality = projContribs.reduce((acc, curr) => acc + curr.qualityScore, 0);
      proj.stats.averageQuality = projContribs.length > 0 ? Number((totalQuality / projContribs.length).toFixed(1)) : 94.0;
      this.projects.set(proj.id, proj);
    }

    return contribution;
  }

  // Reputation API
  public getReputation(contributorId: string): ContributorReputation {
    return this.reputations.get(contributorId) || {
      contributorId,
      name: 'Contributor',
      verifiedContributions: 1,
      successfulVerifications: 1,
      averageQuality: 95.0,
      requirementMatchRate: 98.0,
      lastActivity: Date.now()
    };
  }

  public incrementReputation(contributorId: string, quality: number, success: boolean) {
    const rep = this.getReputation(contributorId);
    rep.verifiedContributions++;
    if (success) rep.successfulVerifications++;
    rep.averageQuality = Number(((rep.averageQuality * (rep.verifiedContributions - 1) + quality) / rep.verifiedContributions).toFixed(1));
    rep.lastActivity = Date.now();
    this.reputations.set(contributorId, rep);
  }
}

// Global singleton
export const db = new InMemoryDB();
