'use client';

import React, { useState, useTransition, use } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import { confirmBooking } from '@/app/actions/tickets';
import BackButton from '@/components/BackButton';
import { trackClientActivity } from '@/lib/activityLogger';

export default function PaymentPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = use(params);
  const router = useRouter();
  const { state, grandTotal, clearAll } = useBooking();
  const [method, setMethod] = useState('UPI');
  const [selectedUpi, setSelectedUpi] = useState('Google Pay');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handlePayment = () => {
    setError(null);
    if (state.seats.length === 0) {
      setError("Invalid booking state. Please go back and select seats.");
      return;
    }

    trackClientActivity('Payment initiated', `Initiated ₹${grandTotal.toLocaleString()} payment via ${method} (${selectedUpi}) for ${state.seats.length} seat(s)`);

    startTransition(async () => {
      const result = await confirmBooking(matchId, state.seats);
      
      if (result.error) {
        setError(result.error);
        trackClientActivity('Payment failed', `Transaction failed: ${result.error}`);
      } else if (result.success && result.bookingId) {
        clearAll(); // Clear local context state after successful booking
        router.push(`/tickets/${matchId}/confirmation?bookingId=${result.bookingId}`);
      }
    });
  };

  return (
    <main className="w-full pt-32 pb-section-gap bg-background min-h-screen">
      <div className="flex flex-col w-full px-container-padding max-w-4xl mx-auto gap-8">
        <BackButton />
        
        <h1 className="font-display-md text-display-md text-on-surface text-center mb-4">Payment</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-surface-container rounded-3xl p-8 shadow-xl border border-white/5 flex flex-col gap-6 h-fit">
            <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Select Method</h2>
            
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setMethod('UPI')}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${method === 'UPI' ? 'border-primary bg-primary/10' : 'border-white/10 bg-surface-container-low hover:bg-surface-container'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'UPI' ? 'border-primary' : 'border-on-surface-variant'}`}>
                  {method === 'UPI' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
                <span className={`font-body-lg ${method === 'UPI' ? 'text-primary font-bold' : 'text-on-surface'}`}>UPI</span>
              </button>
              
              {method === 'UPI' && (
                <div className="flex flex-col gap-4 mb-4 animate-in fade-in slide-in-from-top-4">
                  <div className="grid grid-cols-2 gap-3">
                    {['Google Pay', 'PhonePe', 'Paytm', 'Other UPI'].map(upi => (
                       <button 
                         key={upi} 
                         onClick={() => setSelectedUpi(upi)}
                         className={`p-3 rounded-lg border transition-all text-sm font-label-caps uppercase tracking-wider text-left flex items-center gap-3 ${selectedUpi === upi ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 bg-surface-container-highest hover:bg-surface hover:border-primary/50 text-on-surface'}`}
                       >
                         <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedUpi === upi ? 'border-primary' : 'border-on-surface-variant'}`}>
                           {selectedUpi === upi && <div className="w-2 h-2 rounded-full bg-primary" />}
                         </div>
                         {upi}
                       </button>
                    ))}
                  </div>
                  {selectedUpi === 'Other UPI' && (
                    <input type="text" placeholder="Enter UPI ID (e.g. name@upi)" className="bg-surface-container-low border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary mt-2 animate-in fade-in slide-in-from-top-2" />
                  )}
                </div>
              )}

              <div className="border-t border-white/10 my-2 pt-4">
                <h3 className="font-label-caps text-sm text-on-surface-variant uppercase tracking-widest mb-4">Other Payment Options</h3>
                <div className="flex flex-col gap-4">
                  {['Credit Card', 'Debit Card', 'Net Banking'].map(m => (
                    <button
                      key={m}
                      onClick={() => setMethod(m)}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${method === m ? 'border-primary bg-primary/10' : 'border-white/10 bg-surface-container-low hover:bg-surface-container'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === m ? 'border-primary' : 'border-on-surface-variant'}`}>
                        {method === m && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <span className={`font-body-lg ${method === m ? 'text-primary font-bold' : 'text-on-surface'}`}>{m}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {method !== 'UPI' && method !== 'Net Banking' && (
              <div className="flex flex-col gap-4 mt-4 animate-in fade-in slide-in-from-top-4">
                <input type="text" placeholder="Card Number" className="bg-surface-container-low border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary" />
                <div className="flex gap-4">
                  <input type="text" placeholder="MM/YY" className="w-1/2 bg-surface-container-low border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary" />
                  <input type="text" placeholder="CVV" className="w-1/2 bg-surface-container-low border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary" />
                </div>
              </div>
            )}
          </div>

          <div className="bg-surface-container rounded-3xl p-8 shadow-xl border border-white/5 flex flex-col gap-6 h-fit">
            <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Final Summary</h2>
            
            <div className="flex justify-between font-headline-md text-on-surface mt-4 text-3xl pb-6 border-b border-white/10">
              <span>Total</span>
              <span className="text-primary">₹{grandTotal}</span>
            </div>

            {error && (
              <div className="p-4 bg-error/10 text-error rounded-xl font-body-md text-sm border border-error/20">
                {error}
              </div>
            )}

            <button 
              onClick={handlePayment}
              disabled={isPending || grandTotal === 0}
              className="w-full mt-4 bg-primary text-on-primary font-headline-md text-body-lg py-4 rounded-xl shadow-[0_0_20px_rgba(46,204,113,0.3)] hover:shadow-[0_0_30px_rgba(46,204,113,0.5)] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isPending ? 'Processing Payment...' : `Pay ₹${grandTotal}`}
              {!isPending && <span className="material-symbols-outlined">lock</span>}
            </button>
            <p className="text-center font-body-sm text-xs text-on-surface-variant mt-2 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[16px]">verified_user</span> Secure Payment via RoshSpark Pay
            </p>
          </div>
          
        </div>
      </div>
    </main>
  );
}
