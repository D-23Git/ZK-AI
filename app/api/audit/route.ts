import { NextResponse } from 'next/server';
import { AuditRegistry } from '@/audit/registry';

export async function GET() {
  const records = AuditRegistry.getAllRecords();
  const integrity = AuditRegistry.verifyChainIntegrity();
  return NextResponse.json({
    success: true,
    totalRecords: records.length,
    integrity,
    records
  });
}
