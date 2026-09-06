import { NextResponse } from 'next/server';
import { db, StoredContribution } from '@/database/db';
import { MidnightAdapter } from '@/midnight/adapter';
import { AuditRegistry } from '@/audit/registry';
import { Proof } from '@/zk/interface';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId') || undefined;
  const contributions = db.getContributions(projectId);
  return NextResponse.json({ success: true, contributions });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      projectId,
      datasetName,
      proof,
      metrics
    }: {
      projectId: string;
      datasetName: string;
      proof: Proof;
      metrics: {
        recordCount: number;
        completeness: number;
        duplicateRate: number;
        qualityScore: number;
        format: string;
      };
    } = body;

    // Reject if raw records are detected in payload (Enforce Spec 16: Zero Raw Data Leakage)
    if ((body as any).rawRecords || (body as any).rows || (body as any).dataRows) {
      return NextResponse.json(
        { success: false, error: 'SECURITY VIOLATION: Raw dataset records must never be transmitted.' },
        { status: 400 }
      );
    }

    if (!projectId || !proof || !metrics) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    const project = db.getProject(projectId);
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    // 1. Verify Proof via Midnight ZK Proof Service
    const verification = await MidnightAdapter.verifyProof(proof);

    // 2. Generate Contribution Record
    const contributionId = 'DC-' + Math.floor(1000 + Math.random() * 9000);
    const isValid = verification.isValid;

    const contribution: StoredContribution = {
      id: contributionId,
      projectId,
      projectName: project.name,
      category: project.category,
      contributorId: proof.publicInputs.contributorId || 'contrib-current',
      contributorName: 'Authenticated Contributor',
      datasetName: datasetName || 'Private Contribution Dataset',
      requirementVersion: proof.publicInputs.requirementVersion,
      policyHash: proof.publicInputs.requirementsHash,
      datasetCommitment: proof.datasetCommitment,
      status: isValid ? 'VERIFIED' : 'REJECTED',
      proofStatus: isValid ? 'VALID' : 'FAILED',
      qualityScore: metrics.qualityScore,
      completeness: metrics.completeness,
      duplicateRate: metrics.duplicateRate,
      recordCount: metrics.recordCount,
      format: metrics.format,
      submittedAt: Date.now(),
      proofId: proof.proofId,
      proof,
      verificationResult: verification,
      disclosureRequested: false,
      disclosureConsented: false,
      privacyNotice: isValid
        ? 'PROTECTED: Raw dataset rows remain isolated on contributor machine. Midnight ZK Proof verified.'
        : 'REJECTED: Dataset did not satisfy all cryptographic requirement constraints.'
    };

    db.saveContribution(contribution);

    // 3. Record in Cryptographic Audit Registry (Spec 14)
    AuditRegistry.logVerification({
      verificationId: verification.verificationId,
      contributionId,
      projectId,
      requirementVersion: proof.publicInputs.requirementVersion,
      requirementPolicyHash: proof.publicInputs.requirementsHash,
      proofStatus: isValid ? 'VERIFIED_VALID' : 'VERIFIED_REJECTED',
      timestamp: verification.verifiedAt,
      verifier: `Midnight Smart Contract (${verification.contractAddress.substring(0, 10)}...)`,
      proofReference: proof.proofId,
      datasetCommitment: proof.datasetCommitment,
      satisfiedRequirementsCount: isValid ? 6 : 4,
      totalRequirementsCount: 6,
      network: verification.networkTarget
    });

    // 4. Update Contributor Reputation (Spec 13)
    db.incrementReputation(proof.publicInputs.contributorId || 'contrib-current', metrics.qualityScore, isValid);

    return NextResponse.json({
      success: true,
      contribution,
      verification
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
