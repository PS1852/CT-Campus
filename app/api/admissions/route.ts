import { NextResponse } from 'next/server';
import { createClient as createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, course_id, board_percentage, documents_url, message, website_verify } = body;

    // 1. HONEYPOT TRAP
    if (website_verify && website_verify.trim() !== '') {
      return NextResponse.json({ success: true, message: 'Application logged successfully.' });
    }

    // 2. INPUT VALIDATION
    if (!name || !name.trim() || !phone || !phone.trim() || !course_id) {
      return NextResponse.json({ error: 'Name, phone, and program selection are required.' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit phone number.' }, { status: 400 });
    }

    const dbClient = createServerSupabase();

    const { data, error: rpcError } = await dbClient.rpc('submit_admission', {
      p_name: name.trim(),
      p_phone: phone,
      p_email: email ? email.trim() : null,
      p_course_id: course_id,
      p_board_percentage: board_percentage || 'not_provided',
      p_documents_url: documents_url || '',
      p_message: message ? message.trim() : '',
      p_referrer: request.headers.get('referer') || 'direct'
    });

    if (rpcError) {
      throw rpcError;
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Error handling admissions submission:', err);
    return NextResponse.json(
      { error: err.message || 'Internal database write failed.' },
      { status: 500 }
    );
  }
}
