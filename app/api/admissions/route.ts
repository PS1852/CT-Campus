import { NextResponse } from 'next/server';
import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

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

    let dbClient;
    try {
      dbClient = createAdminClient();
    } catch {
      dbClient = createServerSupabase();
    }

    // 3. SECURE / LINK STUDENT PROFILE
    // Check if a profile with the same phone already exists
    let { data: existingProfile } = await dbClient
      .from('profiles')
      .select('*')
      .eq('phone', cleanPhone)
      .maybeSingle();

    let studentProfileId = '';

    if (existingProfile) {
      studentProfileId = existingProfile.id;
    } else {
      // Create a student placeholder profile
      const { data: newProfile, error: profileError } = await dbClient
        .from('profiles')
        .insert({
          full_name: name.trim(),
          phone: cleanPhone,
          email: email ? email.trim() : null,
          role: 'student'
        })
        .select()
        .single();

      if (profileError) {
        throw profileError;
      }
      studentProfileId = newProfile.id;
    }

    // 4. INSERT ADMISSIONS RECORD
    const { data: admission, error: admissionError } = await dbClient
      .from('admissions')
      .insert({
        student_id: studentProfileId,
        course_id: course_id,
        status: 'pending',
        payment_submitted: false,
        documents_url: documents_url ? [documents_url] : []
      })
      .select()
      .single();

    if (admissionError) {
      throw admissionError;
    }

    // 5. REGISTER LEAD ACTIVITY
    await dbClient.from('leads').insert({
      source: 'admission_portal',
      name: name.trim(),
      phone: cleanPhone,
      email: email ? email.trim() : null,
      course_id: course_id,
      utm_params: {
        board_percentage: board_percentage || 'not_provided',
        comments: message ? message.trim() : 'none',
        referrer: request.headers.get('referer') || 'direct'
      }
    });

    return NextResponse.json({ success: true, admission });
  } catch (err: any) {
    console.error('Error handling admissions submission:', err);
    return NextResponse.json(
      { error: err.message || 'Internal database write failed.' },
      { status: 500 }
    );
  }
}
