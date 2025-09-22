// src/app/page.js

'use client';

import { useState } from 'react';

// A better SVG icon for the Apple logo to use in the button
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

  // State for Card form
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

  const handleMpesaSubmit = (event) => {
    event.preventDefault();
    alert(`Initiating M-Pesa payment for ${mpesaPhone}`);
    // This is where we will call our M-Pesa API endpoint
  };

  const handleCardSubmit = (event) => {
    event.preventDefault();
    alert(`Submitting card payment...`);
    // This is where we would call our Stripe API endpoint
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-lg p-6 space-y-4">
        
        <h1 className="text-2xl font-semibold text-center text-gray-800">Stripe Payments</h1>
        <h2 className="text-3xl font-bold text-center text-gray-900">Global Work Ways</h2>
        
        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Apple Pay / Google Pay Button */}
          <button className="w-full flex items-center justify-center bg-black text-white rounded-md p-3 font-semibold hover:bg-gray-800">
            <ApplePayIcon />
            <span className="ml-2">Pay</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="px-4 text-gray-500">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          {/* M-Pesa Form */}
          <div className="border border-gray-300 rounded-lg p-4 transition-colors duration-200 hover:border-indigo-500 hover:shadow-md mb-8">
            <form onSubmit={handleMpesaSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">M-Pesa Global</h3>
              <div>
                <label htmlFor="mpesaName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" id="mpesaName" value={mpesaName} onChange={(e) => setMpesaName(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label htmlFor="mpesaEmail" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="mpesaEmail" value={mpesaEmail} onChange={(e) => setMpesaEmail(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label htmlFor="mpesaPhone" className="block text-sm font-medium text-gray-700">M-Pesa Phone Number</label>
                <input type="tel" id="mpesaPhone" value={mpesaPhone} onChange={(e) => setMpesaPhone(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="254XXXXXXXXX" required />
                <p className="mt-1 text-xs text-gray-500">Enter your M-Pesa registered phone number (format: 254000000000)</p>
              </div>
            </form>
          </div>

          {/* Card Payment Form */}
          <div className="border border-gray-300 rounded-lg p-4 transition-colors duration-200 hover:border-indigo-500 hover:shadow-md mb-8">
            <h3 className="text-lg font-semibold text-gray-800">Card Payment</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Information</label>
                <input type="text" id="cardNumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="1234 1234 1234 1234" required />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input type="text" id="expiryDate" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="MM/YY" required />
                </div>
                <div className="flex-1">
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                  <input type="text" id="cvc" value={cvc} onChange={(e) => setCvc(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="CVC" required />
                </div>
              </div>
            </div>
          </div>

          
          {/* Final Submit Button */}
          <div className="mt-8">
            <p className="text-sm text-gray-600 mb-2">Global Payment</p>
            <p className="text-xs text-gray-500 mb-4">Pay with Stripe (credit cards, bank transfers, etc.)</p>
            <button
              onClick={handleCardSubmit}
              className="w-full px-4 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Pay $300.00
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}