import { NextResponse } from 'next/server';
import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, course_interest, message, website_verify } = body;

    // 1. HONEYPOT BOT TRAP: If honeypot field has been filled, simulate successful submission
    if (website_verify && website_verify.trim() !== '') {
      console.warn('Bot detected via honeypot trap. Aborting write.');
      return NextResponse.json({ success: true, message: 'Inquiry registered successfully.' });
    }

    // 2. IP EXTRACTION FOR RATE LIMITING
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || '127.0.0.1';
    
    // Choose appropriate Supabase client (fallback to public anon if service role isn't configured)
    let dbClient;
    try {
      dbClient = createAdminClient();
    } catch {
      dbClient = createServerSupabase();
    }

    // 3. RATE LIMITING CHECK: Max 10 requests per minute per IP
    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
    const { count, error: countError } = await dbClient
      .from('rate_limit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .eq('endpoint', '/api/inquiries')
      .gte('created_at', oneMinuteAgo);

    if (count !== null && count >= 10) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait 1 minute before trying again.' },
        { status: 429 }
      );
    }

    // Register IP entry in rate limit logs
    await dbClient.from('rate_limit_logs').insert({
      ip_address: ip,
      endpoint: '/api/inquiries'
    });

    // 4. INPUT VALIDATION
    if (!name || !name.trim() || !phone || !phone.trim()) {
      return NextResponse.json({ error: 'Name and Phone number are required.' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit phone number.' }, { status: 400 });
    }

    // 5. DATABASE INSERTION (Inquiries Table)
    const { data: inquiry, error: dbError } = await dbClient
      .from('inquiries')
      .insert({
        name: name.trim(),
        phone: cleanPhone,
        email: email ? email.trim() : null,
        course_interest: course_interest || 'General Mentorship',
        message: message ? message.trim() : null,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    // 6. MARKETING LEAD FUNNEL INTEGRATION (Leads Table)
    // Find matching course ID if possible
    let courseId = null;
    if (course_interest) {
      const { data: course } = await dbClient
        .from('courses')
        .select('id')
        .eq('title', course_interest)
        .maybeSingle();
      if (course) {
        courseId = course.id;
      }
    }

    await dbClient.from('leads').insert({
      source: 'organic',
      name: name.trim(),
      phone: cleanPhone,
      email: email ? email.trim() : null,
      course_id: courseId,
      utm_params: {
        referrer: request.headers.get('referer') || 'direct',
        user_agent: request.headers.get('user-agent') || 'unknown'
      }
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (err: any) {
    console.error('Error handling inquiry submission:', err);
    return NextResponse.json(
      { error: err.message || 'Internal database execution failed.' },
      { status: 500 }
    );
  }
}
