import { NextResponse } from 'next/server';
import { db } from '@/database/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const contribution = db.getContribution(params.id);
  if (!contribution) {
    return NextResponse.json({ success: false, error: 'Contribution not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, contribution });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const contribution = db.getContribution(params.id);
    if (!contribution) {
      return NextResponse.json({ success: false, error: 'Contribution not found' }, { status: 404 });
    }

    const body = await req.json();
    const { action } = body;

    if (action === 'ACCEPT') {
      contribution.status = 'ACCEPTED';
    } else if (action === 'REJECT') {
      contribution.status = 'REJECTED';
    } else if (action === 'REQUEST_DISCLOSURE') {
      contribution.disclosureRequested = true;
    } else if (action === 'CONSENT_DISCLOSURE') {
      contribution.disclosureConsented = true;
    } else if (action === 'REVOKE_DISCLOSURE') {
      contribution.disclosureConsented = false;
      contribution.disclosureRequested = false;
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    db.saveContribution(contribution);

    return NextResponse.json({ success: true, contribution });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
