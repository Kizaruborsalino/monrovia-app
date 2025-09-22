// src/app/api/initiate-payment/route.js

import { NextResponse } from 'next/server';

// This function handles POST requests to /api/initiate-payment
export async function POST(request) {
  try {
    // 1. Parse the incoming data from the request body
    const data = await request.json();
    const { name, email, phone, amount } = data;

    // 2. Log the data to the server terminal to confirm we received it
    console.log('✅ Received payment request on the backend:');
    console.log({ name, email, phone, amount });

    // 3. (Future Step) This is where we will add the code
    //    to talk to the M-Pesa Payment Gateway (like Africa's Talking).
    //    For now, we'll just simulate a success.

    // 4. Send a success response back to the frontend
    return NextResponse.json({ 
      success: true, 
      message: 'Payment request received successfully.',
      data: { name, email, phone, amount } 
    });

  } catch (error) {
    // If anything goes wrong, log the error and send back an error response
    console.error('❌ Error processing payment request:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to process payment request.' 
    }, { status: 500 });
  }
}