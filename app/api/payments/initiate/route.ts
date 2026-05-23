import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { course_id, name, phone, email, amount } = body;

    if (!course_id || !name || !phone || !amount) {
      return NextResponse.json({ error: 'Missing required billing details.' }, { status: 400 });
    }

    // Simulate order ID generation using Razorpay standard structures
    const order_id = `order_MOCK_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // Return the mock Razorpay details
    return NextResponse.json({
      success: true,
      order_id,
      amount: amount * 100, // Razorpay amount in paise
      currency: 'INR',
      mock_key: 'rzp_test_placeholder_key_id',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal payment gateway initiation error.' },
      { status: 500 }
    );
  }
}
