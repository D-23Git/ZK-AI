import { NextResponse } from 'next/server';
import { AIAssistant } from '@/ai/assistant';

export async function POST(req: Request) {
  try {
    const { projectDescription, category } = await req.json();
    const recommendations = AIAssistant.recommendRequirements(projectDescription || '', category || 'Healthcare');
    return NextResponse.json({ success: true, recommendations });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
