// =============================================================================
// PrivateData AI - Policies and Requirement Specifications (Spec 5, Spec 15)
// Immutable Requirement Versioning & Verification Policies
// =============================================================================

import { createHash } from 'crypto';

export interface CustomCondition {
  field: string;
  operator: '>=' | '<=' | '==' | '!=' | '>' | '<';
  value: number | string;
  description: string;
}

export interface ProjectRequirementPolicy {
  projectId: string;
  projectName: string;
  category: 'Healthcare' | 'Finance' | 'Education' | 'Retail' | 'Research' | 'Manufacturing' | 'Other';
  version: string; // e.g. "1.0", "1.1"
  requirements: {
    minRecords: number;
    minCompleteness: number; // percentage (0 - 100)
    maxDuplicateRate: number; // percentage (0 - 100)
    minQualityScore: number; // score (0 - 100)
    requiredFormat: string[]; // ["CSV", "JSON"]
    requiredFields: string[];
    customConditions?: CustomCondition[];
  };
  policyHash: string; // SHA-256 canonical hash ensuring immutability
  createdAt: number;
  publishedBy: string;
  isImmutable: boolean;
}

export class PolicyManager {
  /**
   * Computes deterministic SHA-256 hash of requirement specification
   */
  public static hashPolicy(policy: Omit<ProjectRequirementPolicy, 'policyHash'>): string {
    const canonical = {
      projectId: policy.projectId,
      version: policy.version,
      minRecords: policy.requirements.minRecords,
      minCompleteness: policy.requirements.minCompleteness,
      maxDuplicateRate: policy.requirements.maxDuplicateRate,
      minQualityScore: policy.requirements.minQualityScore,
      requiredFormat: [...policy.requirements.requiredFormat].sort(),
      requiredFields: [...policy.requirements.requiredFields].map(f => f.toLowerCase().trim()).sort(),
      customConditions: (policy.requirements.customConditions || []).map(c => ({
        field: c.field,
        operator: c.operator,
        value: c.value
      }))
    };
    return createHash('sha256').update(JSON.stringify(canonical)).digest('hex');
  }

  /**
   * Create an immutable requirement version
   */
  public static createRequirementPolicy(
    projectId: string,
    projectName: string,
    category: ProjectRequirementPolicy['category'],
    version: string,
    requirements: ProjectRequirementPolicy['requirements'],
    publishedBy: string = 'dev-admin'
  ): ProjectRequirementPolicy {
    const draft: Omit<ProjectRequirementPolicy, 'policyHash'> = {
      projectId,
      projectName,
      category,
      version,
      requirements,
      createdAt: Date.now(),
      publishedBy,
      isImmutable: true
    };

    const policyHash = this.hashPolicy(draft);

    return {
      ...draft,
      policyHash
    };
  }

  /**
   * Validates if a dataset metric evaluation satisfies the policy
   */
  public static evaluateSatisfaction(
    policy: ProjectRequirementPolicy,
    metrics: {
      recordCount: number;
      completeness: number;
      duplicateRate: number;
      qualityScore: number;
      format: string;
      detectedFields: string[];
    }
  ) {
    const r = policy.requirements;
    const recordsPass = metrics.recordCount >= r.minRecords;
    const compPass = metrics.completeness >= r.minCompleteness;
    const dupPass = metrics.duplicateRate <= r.maxDuplicateRate;
    const qualPass = metrics.qualityScore >= r.minQualityScore;
    const formatPass = r.requiredFormat.includes(metrics.format);

    const detectedSet = new Set(metrics.detectedFields.map(f => f.toLowerCase().trim()));
    const missingFields: string[] = [];
    for (const reqField of r.requiredFields) {
      if (!detectedSet.has(reqField.toLowerCase().trim())) {
        missingFields.push(reqField);
      }
    }
    const schemaPass = missingFields.length === 0;

    const satisfiedCount = [recordsPass, compPass, dupPass, qualPass, formatPass, schemaPass].filter(Boolean).length;
    const totalCount = 6;
    const allPassed = satisfiedCount === totalCount;

    return {
      allPassed,
      satisfiedCount,
      totalCount,
      checks: {
        records: { passed: recordsPass, actual: metrics.recordCount, required: r.minRecords },
        completeness: { passed: compPass, actual: metrics.completeness, required: r.minCompleteness },
        duplicateRate: { passed: dupPass, actual: metrics.duplicateRate, maxAllowed: r.maxDuplicateRate },
        qualityScore: { passed: qualPass, actual: metrics.qualityScore, required: r.minQualityScore },
        format: { passed: formatPass, actual: metrics.format, allowed: r.requiredFormat },
        schema: { passed: schemaPass, missingFields, required: r.requiredFields }
      }
    };
  }
}
