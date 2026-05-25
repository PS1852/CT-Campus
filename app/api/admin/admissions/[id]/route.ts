import { NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/admin/auth';
import { updateAdminAdmissionStatus } from '@/lib/admin/admissions';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { authorized, error: authError } = await requireAdminUser();

    if (!authorized) {
      return NextResponse.json({ error: authError || 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const status = body?.status;

    if (status !== 'approved' && status !== 'rejected') {
      return NextResponse.json({ error: 'Status must be approved or rejected.' }, { status: 400 });
    }

    const admission = await updateAdminAdmissionStatus(params.id, status);

    return NextResponse.json({ admission });
  } catch (err: any) {
    console.error('Admin admission update failed:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update admission status.' },
      { status: 500 }
    );
  }
}
