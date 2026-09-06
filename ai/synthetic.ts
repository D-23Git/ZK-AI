// =============================================================================
// PrivateData AI - Synthetic Demo Datasets (Spec 19)
// Provides certified synthetic benchmarks for Dataset A, B, and C
// =============================================================================

export interface SyntheticDataset {
  id: string;
  name: string;
  badge: string;
  description: string;
  category: 'Healthcare' | 'Finance' | 'Education' | 'Retail' | 'Research' | 'Manufacturing';
  format: 'CSV' | 'JSON';
  recordCount: number;
  completeness: number; // percentage
  duplicateRate: number; // percentage
  qualityScore: number; // 0 - 100
  schemaFields: string[];
  expectedResult: 'QUALIFIED' | 'NOT_QUALIFIED';
  failureReasons?: string[];
  sampleCsvPreview: string;
}

export const SYNTHETIC_DATASETS: Record<string, SyntheticDataset> = {
  'dataset-a': {
    id: 'dataset-a',
    name: 'Dataset A — Valid Clinical Records',
    badge: 'QUALIFIED',
    description: 'High-fidelity synthetic clinical trial outcome data satisfying all enterprise health AI benchmarks.',
    category: 'Healthcare',
    format: 'CSV',
    recordCount: 50000,
    completeness: 98.0,
    duplicateRate: 1.0,
    qualityScore: 95,
    schemaFields: ['patient_id', 'age', 'gender', 'diagnosis', 'treatment', 'outcome', 'biomarker_score'],
    expectedResult: 'QUALIFIED',
    sampleCsvPreview: `patient_id,age,gender,diagnosis,treatment,outcome,biomarker_score
P-1001,45,Female,Type 2 Diabetes,Metformin,Stabilized,1.24
P-1002,62,Male,Hypertension,Lisinopril,Improved,0.85
P-1003,34,Female,Asthma,Albuterol,Controlled,1.10
P-1004,58,Male,Coronary Artery Disease,Atorvastatin,Recovered,1.45
P-1005,29,Female,Migraine,Sumatriptan,Resolved,0.92
P-1006,71,Male,Osteoarthritis,Physical Therapy,Managing,1.15
P-1007,51,Female,Hypothyroidism,Levothyroxine,Normalized,1.05
... [50,000 synthetic records preserved privately]`
  },
  'dataset-b': {
    id: 'dataset-b',
    name: 'Dataset B — Low Quality Clinical Feed',
    badge: 'LOW QUALITY',
    description: 'Messy clinical data scrape with severe null rates and high duplicate records failing quality standards.',
    category: 'Healthcare',
    format: 'CSV',
    recordCount: 50000,
    completeness: 81.0,
    duplicateRate: 8.0,
    qualityScore: 72,
    schemaFields: ['patient_id', 'age', 'gender', 'diagnosis', 'treatment', 'outcome'],
    expectedResult: 'NOT_QUALIFIED',
    failureReasons: ['Completeness (81% < 95% required)', 'Quality Score (72 < 90 required)', 'Duplicate Rate (8% > 5% allowed)'],
    sampleCsvPreview: `patient_id,age,gender,diagnosis,treatment,outcome
P-9001,45,Female,NULL,,Unknown
P-9001,45,Female,NULL,,Unknown
P-9002,,Male,Hypertension,Lisinopril,
P-9003,34,,Asthma,,Controlled
P-9004,58,Male,CAD,Atorvastatin,Recovered
P-9004,58,Male,CAD,Atorvastatin,Recovered
P-9005,,,Migraine,NULL,Resolved
... [50,000 uncleaned synthetic records]`
  },
  'dataset-c': {
    id: 'dataset-c',
    name: 'Dataset C — Insufficient Volume Pilot',
    badge: 'INSUFFICIENT RECORDS',
    description: 'Pristine small-scale pilot dataset with stellar quality but lacking the minimum statistical volume.',
    category: 'Healthcare',
    format: 'CSV',
    recordCount: 4500,
    completeness: 99.0,
    duplicateRate: 0.5,
    qualityScore: 96,
    schemaFields: ['patient_id', 'age', 'gender', 'diagnosis', 'treatment', 'outcome', 'biomarker_score'],
    expectedResult: 'NOT_QUALIFIED',
    failureReasons: ['Minimum Record Count (4,500 < 10,000 required)'],
    sampleCsvPreview: `patient_id,age,gender,diagnosis,treatment,outcome,biomarker_score
P-001,42,Female,Cardiology Stage 1,Beta Blocker,Optimal,1.31
P-002,55,Male,Cardiology Stage 2,ACE Inhibitor,Improved,1.18
P-003,38,Female,Cardiology Stage 1,Lifestyle Intervention,Optimal,1.05
P-004,67,Male,Cardiology Stage 3,Combination,Stable,1.40
... [4,500 pilot synthetic records]`
  }
};
