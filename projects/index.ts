// =============================================================================
// PrivateData AI - Seed Projects Module (Spec 4, Spec 10)
// =============================================================================

export interface ProjectData {
  id: string;
  name: string;
  category: 'Healthcare' | 'Finance' | 'Education' | 'Retail' | 'Research' | 'Manufacturing' | 'Other';
  description: string;
  leadDeveloper: string;
  organization: string;
  rewardPool: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  currentVersion: string;
  requirements: {
    minRecords: number;
    minCompleteness: number; // %
    maxDuplicateRate: number; // %
    minQualityScore: number; // 0-100
    allowedFormats: string[];
    requiredFields: string[];
    customConditions?: Array<{
      field: string;
      operator: '>=' | '<=' | '==' | '!=';
      value: number | string;
      description: string;
    }>;
  };
  stats: {
    contributionsCount: number;
    verifiedCount: number;
    pendingCount: number;
    rejectedCount: number;
    averageQuality: number;
  };
  requirementVersions: Array<{
    version: string;
    publishedAt: number;
    policyHash: string;
    minRecords: number;
    minQualityScore: number;
  }>;
}

export const SEED_PROJECTS: ProjectData[] = [
  {
    id: 'AI-PROJECT-001',
    name: 'Healthcare AI Research',
    category: 'Healthcare',
    description: 'Privacy-preserving AI model for multi-center clinical outcome prediction and therapeutic response modeling.',
    leadDeveloper: 'Dr. Elena Rostova',
    organization: 'Global Health AI Consortium',
    rewardPool: '45,000 DUST / $25,000',
    status: 'ACTIVE',
    currentVersion: '1.0',
    requirements: {
      minRecords: 10000,
      minCompleteness: 95,
      maxDuplicateRate: 5,
      minQualityScore: 90,
      allowedFormats: ['CSV', 'JSON'],
      requiredFields: ['age', 'gender', 'diagnosis', 'treatment', 'outcome'],
      customConditions: [
        { field: 'record_count', operator: '>=', value: 10000, description: 'Minimum 10k patient observations' },
        { field: 'completeness', operator: '>=', value: 95, description: 'Completeness >= 95%' },
        { field: 'duplicate_rate', operator: '<=', value: 5, description: 'Duplicate Rate <= 5%' },
        { field: 'quality_score', operator: '>=', value: 90, description: 'Quality benchmark >= 90' }
      ]
    },
    stats: {
      contributionsCount: 42,
      verifiedCount: 31,
      pendingCount: 7,
      rejectedCount: 4,
      averageQuality: 94.2
    },
    requirementVersions: [
      {
        version: '1.0',
        publishedAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
        policyHash: '7b2a9f14c8e3d09a25b84e1160a2b97c413e1f5798da2bf56e2978931b238d10',
        minRecords: 10000,
        minQualityScore: 90
      },
      {
        version: '1.1',
        publishedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
        policyHash: 'c90281be4a87d0912470ab1982736450fe1892740bc12984ef028374615a9108',
        minRecords: 20000,
        minQualityScore: 92
      }
    ]
  },
  {
    id: 'AI-PROJECT-002',
    name: 'Financial Fraud Detection AI',
    category: 'Finance',
    description: 'Cross-institutional federated transformer detecting complex laundering cascades without exposing client transactions.',
    leadDeveloper: 'Marcus Vance',
    organization: 'FinSec AI Labs',
    rewardPool: '60,000 DUST / $35,000',
    status: 'ACTIVE',
    currentVersion: '1.0',
    requirements: {
      minRecords: 25000,
      minCompleteness: 98,
      maxDuplicateRate: 2,
      minQualityScore: 92,
      allowedFormats: ['CSV', 'JSON'],
      requiredFields: ['transaction_id', 'amount', 'timestamp', 'account_id', 'is_fraud'],
      customConditions: [
        { field: 'record_count', operator: '>=', value: 25000, description: 'Minimum 25k records' },
        { field: 'duplicate_rate', operator: '<=', value: 2, description: 'Duplicate ceiling 2%' }
      ]
    },
    stats: {
      contributionsCount: 28,
      verifiedCount: 22,
      pendingCount: 3,
      rejectedCount: 3,
      averageQuality: 96.1
    },
    requirementVersions: [
      {
        version: '1.0',
        publishedAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
        policyHash: 'e49a8f102c9b7d3419087521abf089274c3e5912a784d0b138e652a91f34b870',
        minRecords: 25000,
        minQualityScore: 92
      }
    ]
  },
  {
    id: 'AI-PROJECT-003',
    name: 'Autonomous Driving Perception AI',
    category: 'Manufacturing',
    description: 'Robust sensor anomaly detection and edge case trajectory forecasting in extreme weather environments.',
    leadDeveloper: 'Kaito Tanaka',
    organization: 'Apex Mobility AI',
    rewardPool: '50,000 DUST / $30,000',
    status: 'ACTIVE',
    currentVersion: '1.0',
    requirements: {
      minRecords: 50000,
      minCompleteness: 96,
      maxDuplicateRate: 3,
      minQualityScore: 94,
      allowedFormats: ['JSON', 'CSV'],
      requiredFields: ['timestamp', 'sensor_id', 'velocity', 'obstacle_type', 'confidence']
    },
    stats: {
      contributionsCount: 19,
      verifiedCount: 15,
      pendingCount: 2,
      rejectedCount: 2,
      averageQuality: 95.4
    },
    requirementVersions: [
      {
        version: '1.0',
        publishedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
        policyHash: '3a8f12c9b4e087192a54bc0192847561de09128374a561029384756102938475',
        minRecords: 50000,
        minQualityScore: 94
      }
    ]
  }
];
