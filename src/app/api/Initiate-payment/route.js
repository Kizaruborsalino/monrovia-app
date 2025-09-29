import { NextResponse } from 'next/server';

// Handles POST requests to /api/initiate-payment
export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, phone, amount } = data;
    console.log('✅ Received payment request on the backend:');
    console.log({ name, email, phone, amount });

    // (Future: Add M-Pesa integration here)

    return NextResponse.json({ 
      success: true, 
      message: 'Payment request received successfully.',
      data: { name, email, phone, amount } 
    });
  } catch (error) {
    console.error('❌ Error processing payment request:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to process payment request.' 
    }, { status: 500 });
  }
}