import { NextResponse } from 'next/server';
import { db } from '@/database/db';
import { PolicyManager } from '@/policies/schema';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const project = db.getProject(params.id);
  if (!project) {
    return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
  }
  const contributions = db.getContributions(params.id);
  return NextResponse.json({ success: true, project, contributions });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const project = db.getProject(params.id);
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const body = await req.json();
    const { action, newVersionRequirements } = body;

    if (action === 'PUBLISH_NEW_VERSION' && newVersionRequirements) {
      const currentVerNum = parseFloat(project.currentVersion);
      const nextVersion = (currentVerNum + 0.1).toFixed(1);

      const policy = PolicyManager.createRequirementPolicy(
        project.id,
        project.name,
        project.category,
        nextVersion,
        {
          minRecords: Number(newVersionRequirements.minRecords) || project.requirements.minRecords,
          minCompleteness: Number(newVersionRequirements.minCompleteness) || project.requirements.minCompleteness,
          maxDuplicateRate: Number(newVersionRequirements.maxDuplicateRate) || project.requirements.maxDuplicateRate,
          minQualityScore: Number(newVersionRequirements.minQualityScore) || project.requirements.minQualityScore,
          requiredFormat: newVersionRequirements.requiredFormat || project.requirements.requiredFormat,
          requiredFields: newVersionRequirements.requiredFields || project.requirements.requiredFields,
          customConditions: newVersionRequirements.customConditions || project.requirements.customConditions
        }
      );

      project.currentVersion = nextVersion;
      project.requirements = {
        ...policy.requirements,
        allowedFormats: policy.requirements.requiredFormat || project.requirements.allowedFormats || ['CSV', 'JSON'],
        requiredFields: policy.requirements.requiredFields || project.requirements.requiredFields || ['age', 'gender', 'diagnosis', 'treatment', 'outcome'],
      };
      project.requirementVersions.unshift({
        version: nextVersion,
        publishedAt: Date.now(),
        policyHash: policy.policyHash,
        minRecords: policy.requirements.minRecords,
        minQualityScore: policy.requirements.minQualityScore
      });

      db.saveProject(project);

      return NextResponse.json({ success: true, project, newPolicy: policy });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
