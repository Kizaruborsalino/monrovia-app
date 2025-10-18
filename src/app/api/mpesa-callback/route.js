// src/app/api/mpesa-callback/route.js
import { NextResponse } from 'next/server';

/**
 * M-Pesa Callback Handler
 * This endpoint receives payment confirmations from M-Pesa
 */
export async function POST(request) {
  try {
    const callbackData = await request.json();
    
    console.log('📞 M-Pesa Callback Received:', JSON.stringify(callbackData, null, 2));

    const { Body } = callbackData;
    
    if (!Body || !Body.stkCallback) {
      console.error('❌ Invalid callback data');
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid callback data' 
      }, { status: 400 });
    }

    const { stkCallback } = Body;
    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    console.log('📊 Payment Status:', {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
    });

    // ResultCode 0 means success
    if (ResultCode === 0) {
      console.log('✅ Payment successful!');
      
      // Extract payment details from CallbackMetadata
      if (CallbackMetadata && CallbackMetadata.Item) {
        const metadata = {};
        CallbackMetadata.Item.forEach(item => {
          metadata[item.Name] = item.Value;
        });

        console.log('💰 Payment Details:', {
          Amount: metadata.Amount,
          MpesaReceiptNumber: metadata.MpesaReceiptNumber,
          TransactionDate: metadata.TransactionDate,
          PhoneNumber: metadata.PhoneNumber,
        });

        // TODO: Save payment details to your database
        // Example:
        // await savePaymentToDatabase({
        //   merchantRequestId: MerchantRequestID,
        //   checkoutRequestId: CheckoutRequestID,
        //   amount: metadata.Amount,
        //   mpesaReceiptNumber: metadata.MpesaReceiptNumber,
        //   transactionDate: metadata.TransactionDate,
        //   phoneNumber: metadata.PhoneNumber,
        //   status: 'completed'
        // });

        // TODO: Send confirmation email to customer
        // await sendConfirmationEmail(customerEmail, metadata);
      }
    } else {
      console.error('❌ Payment failed:', ResultDesc);
      
      // TODO: Update payment status in database
      // await updatePaymentStatus(CheckoutRequestID, 'failed', ResultDesc);
      
      // Common error codes:
      // 1032 - Request cancelled by user
      // 2001 - Wrong PIN
      // 1 - Insufficient balance
      // 1037 - Timeout (user didn't enter PIN in time)
    }

    // Always return success to M-Pesa to acknowledge receipt
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Success',
    });

  } catch (error) {
    console.error('❌ Callback error:', error);
    
    // Still return success to M-Pesa to prevent retries
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Success',
    });
  }
}

/**
 * Handle GET requests (for testing)
 */
export async function GET() {
  return NextResponse.json({
    message: 'M-Pesa callback endpoint is active',
    note: 'This endpoint receives POST requests from M-Pesa',
  });
}