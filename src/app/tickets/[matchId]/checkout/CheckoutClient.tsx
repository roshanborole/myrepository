'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import BackButton from '@/components/BackButton';
import { lockSeatsForPayment } from '@/app/actions/tickets';

type Props = {
  matchId: string;
  matchDetails: { team1: string; team2: string; date: Date };
  user: { name: string | null; email: string };
};

export default function CheckoutClient({ matchId, matchDetails, user }: Props) {
  const router = useRouter();
  const { state, totalPrice, serviceFee, grandTotal } = useBooking();
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactDetails, setContactDetails] = useState({ name: user.name || '', email: user.email });
  const [locking, setLocking] = useState(false);

  const attemptLock = React.useCallback(() => {
    if (state.seats.length === 0) return;
    setLocking(true);
    lockSeatsForPayment(matchId, state.seats)
      .then(res => {
        if (res.error) {
          setError(res.error);
        } else {
          setError(null);
        }
      })
      .catch(() => {
        setError('Failed to connect to server. Please try again.');
      })
      .finally(() => {
        setLocking(false);
      });
  }, [matchId, state.seats]);

  useEffect(() => {
    setMounted(true);
    if (state.seats.length === 0) {
      router.push(`/tickets/${matchId}`);
    } else {
      attemptLock();
    }
  }, [state.seats.length, matchId, router, attemptLock]);

  if (!mounted || state.seats.length === 0) return null;

  return (
    <main className="w-full pt-32 pb-section-gap bg-background min-h-screen">
      <div className="flex flex-col w-full px-container-padding max-w-2xl mx-auto gap-8">
        <BackButton />
        
        <h1 className="font-display-md text-display-md text-on-surface text-center mb-4">Order Details</h1>
        
        <div className="bg-surface-container rounded-3xl p-8 shadow-xl border border-white/5 flex flex-col gap-8">
          
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Booking Summary</h2>
              <button onClick={() => router.back()} className="text-primary font-label-caps text-xs uppercase tracking-widest hover:underline">EDIT</button>
            </div>
            
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex justify-between items-center font-body-md text-on-surface-variant">
                <span>Ticket Mode</span>
                <span className="text-on-surface font-semibold">{state.seats.length > 0 ? state.seats[0].stand : 'Standard Ticket'}</span>
              </div>
              <div className="flex justify-between items-center font-body-md text-on-surface-variant">
                <span>Ticket Price</span>
                <span className="text-on-surface font-semibold">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between items-center font-body-md text-on-surface-variant">
                <span>Convenience Fee</span>
                <span className="text-on-surface font-semibold">₹{serviceFee}</span>
              </div>
              <div className="flex justify-between items-center font-headline-md text-on-surface mt-2 text-2xl font-bold border-t border-white/10 pt-4">
                <span>Total Order</span>
                <span className="text-primary">₹{grandTotal}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Sending Booking Details To</h2>
              <button onClick={() => setIsEditingContact(!isEditingContact)} className="text-primary font-label-caps text-xs uppercase tracking-widest hover:underline">
                {isEditingContact ? 'SAVE' : 'EDIT'}
              </button>
            </div>
            
            <div className="flex flex-col gap-2 mt-4">
               {isEditingContact ? (
                 <>
                   <input 
                     type="text" 
                     value={contactDetails.name} 
                     onChange={e => setContactDetails({...contactDetails, name: e.target.value})}
                     className="bg-surface-container-low border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary text-sm"
                     placeholder="Full Name"
                   />
                   <input 
                     type="email" 
                     value={contactDetails.email} 
                     onChange={e => setContactDetails({...contactDetails, email: e.target.value})}
                     className="bg-surface-container-low border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary text-sm"
                     placeholder="Email Address"
                   />
                 </>
               ) : (
                 <>
                   <span className="text-on-surface font-semibold">{contactDetails.name || 'Guest User'}</span>
                   <span className="text-on-surface-variant font-body-md">{contactDetails.email}</span>
                 </>
               )}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 text-red-400 p-4 rounded-xl border border-red-500/50 text-center font-body-md mt-4 flex flex-col items-center gap-2">
              <span>{error}</span>
              <button 
                onClick={attemptLock}
                className="text-xs uppercase tracking-wider font-bold text-white underline hover:text-primary transition-colors"
              >
                Retry Reservation
              </button>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-4">
            <button 
              onClick={() => router.push(`/tickets/${matchId}/payment`)}
              disabled={!!error || locking}
              className="w-full bg-primary text-on-primary font-headline-md text-body-lg py-4 rounded-xl shadow-[0_0_20px_rgba(46,204,113,0.3)] hover:shadow-[0_0_30px_rgba(46,204,113,0.5)] transition-all flex justify-center items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed font-bold tracking-widest uppercase"
            >
              {locking ? 'Reserving Seats...' : 'CONTINUE'}
            </button>
          </div>
          
        </div>
      </div>
    </main>
  );
}
