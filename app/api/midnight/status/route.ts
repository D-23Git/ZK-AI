import { NextResponse } from 'next/server';
import { MidnightAdapter } from '@/midnight/adapter';

export async function GET() {
  const status = MidnightAdapter.getStatus();
  return NextResponse.json({ success: true, status });
}
