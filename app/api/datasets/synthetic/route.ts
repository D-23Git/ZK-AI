import { NextResponse } from 'next/server';
import { SYNTHETIC_DATASETS } from '@/ai/synthetic';

export async function GET() {
  return NextResponse.json({
    success: true,
    datasets: Object.values(SYNTHETIC_DATASETS)
  });
}
