import { NextResponse } from 'next/server';
import { db } from '@/database/db';
import { PolicyManager } from '@/policies/schema';
import { ProjectData } from '@/projects';

export async function GET() {
  const projects = db.getProjects();
  return NextResponse.json({ success: true, projects });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category, description, organization, rewardPool, requirements } = body;

    if (!name || !description || !requirements) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const projectId = 'AI-PROJECT-' + Math.floor(100 + Math.random() * 900);
    const version = '1.0';

    const policy = PolicyManager.createRequirementPolicy(
      projectId,
      name,
      category || 'Healthcare',
      version,
      {
        minRecords: Number(requirements.minRecords) || 10000,
        minCompleteness: Number(requirements.minCompleteness) || 95,
        maxDuplicateRate: Number(requirements.maxDuplicateRate) || 5,
        minQualityScore: Number(requirements.minQualityScore) || 90,
        requiredFormat: requirements.requiredFormat || ['CSV', 'JSON'],
        requiredFields: requirements.requiredFields || ['age', 'gender', 'diagnosis', 'treatment', 'outcome'],
        customConditions: requirements.customConditions || []
      }
    );

    const newProject: ProjectData = {
      id: projectId,
      name,
      category: category || 'Healthcare',
      description,
      leadDeveloper: 'Primary AI Researcher',
      organization: organization || 'Open AI Research Consortium',
      rewardPool: rewardPool || '25,000 DUST / $15,000',
      status: 'ACTIVE',
      currentVersion: version,
      requirements: policy.requirements,
      stats: {
        contributionsCount: 0,
        verifiedCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
        averageQuality: 0
      },
      requirementVersions: [
        {
          version,
          publishedAt: Date.now(),
          policyHash: policy.policyHash,
          minRecords: policy.requirements.minRecords,
          minQualityScore: policy.requirements.minQualityScore
        }
      ]
    };

    db.saveProject(newProject);

    return NextResponse.json({ success: true, project: newProject, policy });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
