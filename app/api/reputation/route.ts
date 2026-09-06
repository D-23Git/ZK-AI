import { NextResponse } from 'next/server';
import { db } from '@/database/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const contributorId = searchParams.get('contributorId') || 'contrib-001';
  const reputation = db.getReputation(contributorId);
  return NextResponse.json({ success: true, reputation });
}
