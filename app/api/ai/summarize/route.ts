import { NextResponse } from 'next/server';
import { AIAssistant } from '@/ai/assistant';
import { db } from '@/database/db';

export async function POST(req: Request) {
  try {
    const { projectId } = await req.json();
    const contributions = db.getContributions(projectId);
    const summary = AIAssistant.summarizeContributions(contributions);
    return NextResponse.json({ success: true, summary });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
