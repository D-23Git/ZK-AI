// =============================================================================
// PrivateData AI - ZK Proof Engine Test Suite
// =============================================================================

import { MidnightZKProofService } from '../zk/proofEngine';
import { ProofInput } from '../zk/interface';

export async function runZKTests() {
  console.log('--- Running ZK Proof Engine Tests ---');
  const service = new MidnightZKProofService('MIDNIGHT_DEVNET_SIMULATOR');

  const salt = MidnightZKProofService.generateSalt();
  const rawHash = MidnightZKProofService.hash('synthetic-dataset-sample-records-2026');

  const validMetrics = {
    recordCount: 50000,
    completeness: 98.0,
    duplicateRate: 1.0,
    qualityScore: 95,
    format: 'CSV',
    schemaFields: ['patient_id', 'age', 'gender', 'diagnosis', 'treatment', 'outcome'],
    category: 'Healthcare'
  };

  const datasetCommitment = MidnightZKProofService.computeDatasetCommitment(salt, rawHash, validMetrics);

  const requirements = {
    projectId: 'AI-PROJECT-001',
    version: '1.0',
    minRecords: 10000,
    minCompleteness: 95,
    maxDuplicateRate: 5,
    minQualityScore: 90,
    allowedFormats: ['CSV', 'JSON'],
    requiredFields: ['age', 'gender', 'diagnosis', 'treatment', 'outcome']
  };

  const reqHash = MidnightZKProofService.computeRequirementHash(requirements);

  const proofInput: ProofInput = {
    privateData: {
      metrics: validMetrics,
      rawDatasetHash: rawHash,
      salt
    },
    publicInputs: {
      projectId: requirements.projectId,
      requirementVersion: requirements.version,
      requirementsHash: reqHash,
      contributorId: 'contrib-test-01',
      datasetCommitment,
      nonce: 'nonce-' + Math.random().toString(36).substring(2),
      timestamp: Date.now()
    },
    requirements
  };

  // Test 1: Valid proof generation & verification
  console.log('Test 1: Generate and verify valid proof...');
  const proof = await service.generateProof(proofInput);
  if (!proof || !proof.proofId) throw new Error('Failed to generate proof');

  const verification = await service.verifyProof(proof);
  if (!verification.isValid) throw new Error('Valid proof failed verification');
  if (verification.rawDatasetAccessible !== false) throw new Error('Raw dataset must remain inaccessible');
  console.log('  ✓ Test 1 Passed: Valid proof certified without raw data exposure.');

  // Test 2: Replay attack prevention (re-submitting same nonce)
  console.log('Test 2: Replay attack prevention...');
  const replayVerification = await service.verifyProof(proof);
  if (replayVerification.isValid) throw new Error('Replay attack was not prevented! Same nonce was accepted twice.');
  console.log('  ✓ Test 2 Passed: Replay attack rejected by nonce registry.');

  // Test 3: Constraint violation (low completeness)
  console.log('Test 3: Reject dataset violating completeness constraint...');
  const lowCompMetrics = { ...validMetrics, completeness: 81.0, qualityScore: 72 };
  const lowCompSalt = MidnightZKProofService.generateSalt();
  const lowCompCommitment = MidnightZKProofService.computeDatasetCommitment(lowCompSalt, rawHash, lowCompMetrics);

  const invalidInput: ProofInput = {
    ...proofInput,
    privateData: {
      metrics: lowCompMetrics,
      rawDatasetHash: rawHash,
      salt: lowCompSalt
    },
    publicInputs: {
      ...proofInput.publicInputs,
      datasetCommitment: lowCompCommitment,
      nonce: 'nonce-' + Math.random().toString(36).substring(2)
    }
  };

  const invalidProof = await service.generateProof(invalidInput);
  const invalidVerification = await service.verifyProof(invalidProof);
  if (invalidVerification.isValid) throw new Error('Proof should have failed completeness constraint!');
  console.log('  ✓ Test 3 Passed: Low quality dataset rejected by ZK circuit.');

  console.log('All ZK Proof Engine tests passed successfully!\n');
}
