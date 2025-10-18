// src/app/page.js
'use client';

import { useState } from 'react';

// Apple Pay Icon Component
const ApplePayIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path
      d="M21.7 15.6c-.1-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.1-1.7-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.8-2.8-.8-1.4 0-2.7.8-3.4 2.1-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.5 2.1 2.6 2.1 1 0 1.3-.7 2.6-.7s1.5.7 2.6.7c1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3 0-.1-2.1-.8-2.1-3.1zm-2-5.7c.6-.7 1-1.7.9-2.7-.9.1-2 .6-2.6 1.3-.6.7-1 1.6-.9 2.6 1 .1 2-.5 2.6-1.2z"
      fill="#fff"
    />
  </svg>
);

export default function PaymentPage() {
  // State for M-Pesa form
  const [mpesaName, setMpesaName] = useState('');
  const [mpesaEmail, setMpesaEmail] = useState('');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Payment amount (you can make this dynamic)
  const PAYMENT_AMOUNT = 300;

  const handleMpesaSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      // Validate phone number format
      const phoneRegex = /^(?:254|0)?[17]\d{8}$/;
      if (!phoneRegex.test(mpesaPhone.replace(/[\s\-]/g, ''))) {
        setMessage('Please enter a valid M-Pesa phone number (e.g., 254712345678 or 0712345678)');
        setMessageType('error');
        setIsLoading(false);
        return;
      }

      console.log('📱 Initiating M-Pesa payment...');
      
      const response = await fetch('/api/initiate-payment', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          name: mpesaName,
          email: mpesaEmail,
          phone: mpesaPhone,
          amount: PAYMENT_AMOUNT,
        }),
      });

      const data = await response.json();
      console.log('📥 Response:', data);

      if (data.success) {
        setMessage('✅ STK Push sent! Please check your phone and enter your M-Pesa PIN.');
        setMessageType('success');
        
        // Optional: Clear form after successful submission
        // setMpesaName('');
        // setMpesaEmail('');
        // setMpesaPhone('');
      } else {
        setMessage(`❌ ${data.message || 'Payment failed. Please try again.'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setMessage('❌ Failed to connect to payment server. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-lg p-6 space-y-4">
        
        <h1 className="text-2xl font-semibold text-center text-gray-800">M-Pesa Payments</h1>
        <h2 className="text-3xl font-bold text-center text-gray-900">Global Work Ways</h2>
        
        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Apple Pay / Google Pay Button (Optional - can be removed if not using) */}
          <button 
            className="w-full flex items-center justify-center bg-black text-white rounded-md p-3 font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
            title="Apple Pay coming soon"
          >
            <ApplePayIcon />
            <span className="ml-2">Pay</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="px-4 text-gray-500">Pay with M-Pesa</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          {/* Success/Error Message */}
          {message && (
            <div 
              className={`mb-6 p-4 rounded-lg ${
                messageType === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {/* M-Pesa Form */}
          <div className="border border-gray-300 rounded-lg p-6 transition-colors duration-200 hover:border-green-500 hover:shadow-md">
            <form onSubmit={handleMpesaSubmit} className="space-y-4">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">M-Pesa Payment</h3>
                <span className="ml-auto text-2xl">📱</span>
              </div>

              <div>
                <label htmlFor="mpesaName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="mpesaName" 
                  value={mpesaName} 
                  onChange={(e) => setMpesaName(e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="John Doe"
                  required 
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="mpesaEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  id="mpesaEmail" 
                  value={mpesaEmail} 
                  onChange={(e) => setMpesaEmail(e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="john@example.com"
                  required 
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="mpesaPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  M-Pesa Phone Number <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel" 
                  id="mpesaPhone" 
                  value={mpesaPhone} 
                  onChange={(e) => setMpesaPhone(e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="254712345678 or 0712345678"
                  required 
                  disabled={isLoading}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Enter your M-Pesa registered phone number (format: 254XXXXXXXXX or 07XXXXXXXX)
                </p>
              </div>

              {/* Payment Amount Display */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Amount to Pay:</span>
                  <span className="text-2xl font-bold text-green-600">${PAYMENT_AMOUNT}.00</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Pay $${PAYMENT_AMOUNT}.00 with M-Pesa`
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                🔒 Secure payment powered by Safaricom M-Pesa
              </p>
            </form>
          </div>

          {/* Information Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">How to pay:</h4>
            <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
              <li>Enter your details above</li>
              <li>Click the "Pay" button</li>
              <li>You'll receive an STK Push on your phone</li>
              <li>Enter your M-Pesa PIN to complete payment</li>
              <li>You'll receive a confirmation SMS from M-Pesa</li>
            </ol>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Powered by M-Pesa • Secure Payment Gateway
        </p>
      </div>
    </main>
  );
}