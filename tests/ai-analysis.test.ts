// =============================================================================
// PrivateData AI - AI Dataset Analysis Engine Test Suite
// =============================================================================

import { AIDatasetAnalyzer } from '../ai/analyzer';

export function runAITests() {
  console.log('--- Running AI Dataset Analysis Tests ---');

  const csvSample = `age,gender,diagnosis,treatment,outcome,patient_id
45,Female,Type 2 Diabetes,Metformin,Stabilized,P101
62,Male,Hypertension,Lisinopril,Improved,P102
34,Female,Asthma,Albuterol,Controlled,P103
58,Male,CAD,Atorvastatin,Recovered,P104
29,Female,Migraine,Sumatriptan,Resolved,P105`;

  const requiredFields = ['age', 'gender', 'diagnosis', 'treatment', 'outcome'];

  console.log('Test 1: Analyze raw clinical CSV in local memory...');
  const report = AIDatasetAnalyzer.analyze(
    {
      name: 'test-clinical.csv',
      format: 'CSV',
      content: csvSample
    },
    requiredFields
  );

  if (report.recordCount !== 5) throw new Error(`Expected 5 records, got ${report.recordCount}`);
  if (report.completeness !== 100) throw new Error(`Expected 100% completeness, got ${report.completeness}`);
  if (report.duplicateRate !== 0) throw new Error(`Expected 0% duplicates, got ${report.duplicateRate}`);
  if (report.requiredFieldsMatched !== 5) throw new Error(`Expected 5 matched fields, got ${report.requiredFieldsMatched}`);
  if (report.overallQuality < 90) throw new Error(`Expected high quality score, got ${report.overallQuality}`);
  if (report.category !== 'Healthcare') throw new Error(`Expected Healthcare classification, got ${report.category}`);

  console.log('  ✓ Test 1 Passed: Local private analysis computed accurate metrics and classification.');

  console.log('Test 2: Analyze duplicate rows...');
  const duplicateCsv = `age,gender,diagnosis,treatment,outcome
45,Female,Type 2 Diabetes,Metformin,Stabilized
45,Female,Type 2 Diabetes,Metformin,Stabilized`;

  const dupReport = AIDatasetAnalyzer.analyze({
    name: 'dup.csv',
    format: 'CSV',
    content: duplicateCsv
  }, requiredFields);

  if (dupReport.duplicateRate !== 50) throw new Error(`Expected 50% duplicate rate, got ${dupReport.duplicateRate}`);
  console.log('  ✓ Test 2 Passed: Duplicate detection identified repeated records correctly.');

  console.log('All AI Dataset Analysis tests passed successfully!\n');
}
