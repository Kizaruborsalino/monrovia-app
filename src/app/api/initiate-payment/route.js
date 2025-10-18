// src/app/api/initiate-payment/route.js
import { NextResponse } from 'next/server';

// M-Pesa Configuration (from environment variables)
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const BUSINESS_SHORT_CODE = process.env.MPESA_BUSINESS_SHORT_CODE;
const PASSKEY = process.env.MPESA_PASSKEY;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL;

// M-Pesa API URLs
const AUTH_URL = process.env.MPESA_ENV === 'production'
  ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
  : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

const STK_PUSH_URL = process.env.MPESA_ENV === 'production'
  ? 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
  : 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

/**
 * Get M-Pesa Access Token
 */
async function getAccessToken() {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  
  const response = await fetch(AUTH_URL, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get M-Pesa access token');
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Generate M-Pesa Password
 */
function generatePassword(timestamp) {
  const data = `${BUSINESS_SHORT_CODE}${PASSKEY}${timestamp}`;
  return Buffer.from(data).toString('base64');
}

/**
 * Format phone number to M-Pesa format (254XXXXXXXXX)
 */
function formatPhoneNumber(phone) {
  // Remove any spaces, dashes, or plus signs
  phone = phone.replace(/[\s\-+]/g, '');
  
  // If starts with 0, replace with 254
  if (phone.startsWith('0')) {
    return '254' + phone.substring(1);
  }
  
  // If doesn't start with 254, add it
  if (!phone.startsWith('254')) {
    return '254' + phone;
  }
  
  return phone;
}

/**
 * Initiate M-Pesa STK Push
 */
export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, phone, amount } = data;

    // Validate required fields
    if (!name || !email || !phone || !amount) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!CONSUMER_KEY || !CONSUMER_SECRET || !BUSINESS_SHORT_CODE || !PASSKEY) {
      console.error('❌ M-Pesa credentials not configured');
      return NextResponse.json(
        { success: false, message: 'M-Pesa not configured on server' },
        { status: 500 }
      );
    }

    console.log('📱 Initiating M-Pesa payment for:', { name, email, phone, amount });

    // Format phone number
    const formattedPhone = formatPhoneNumber(phone);
    console.log('📞 Formatted phone:', formattedPhone);

    // Get access token
    const accessToken = await getAccessToken();
    console.log('🔑 Access token obtained');

    // Generate timestamp and password
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = generatePassword(timestamp);

    // Prepare STK Push request
    const stkPushPayload = {
      BusinessShortCode: BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount), // M-Pesa requires whole numbers
      PartyA: formattedPhone, // Customer phone
      PartyB: BUSINESS_SHORT_CODE, // Your business
      PhoneNumber: formattedPhone, // Customer phone
      CallBackURL: CALLBACK_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa-callback`,
      AccountReference: `GlobalWorkWays-${Date.now()}`, // Unique reference
      TransactionDesc: `Payment for ${name}`, // Description
    };

    console.log('📤 Sending STK Push request...');

    // Send STK Push request
    const response = await fetch(STK_PUSH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(stkPushPayload),
    });

    const result = await response.json();
    console.log('📥 M-Pesa response:', result);

    // Check if STK Push was successful
    if (result.ResponseCode === '0') {
      return NextResponse.json({
        success: true,
        message: 'STK Push sent successfully. Please check your phone.',
        data: {
          merchantRequestId: result.MerchantRequestID,
          checkoutRequestId: result.CheckoutRequestID,
          responseCode: result.ResponseCode,
          responseDescription: result.ResponseDescription,
          customerMessage: result.CustomerMessage,
        },
      });
    } else {
      console.error('❌ M-Pesa error:', result);
      return NextResponse.json(
        {
          success: false,
          message: result.ResponseDescription || 'Failed to initiate payment',
          errorCode: result.ResponseCode,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('❌ Error processing payment:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing payment',
        error: error.message,
      },
      { status: 500 }
    );
  }
}