'use client';

import React from 'react';

export default function PrintTicketButton() {
  return (
    <button 
      className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-headline-md py-4 rounded-xl transition-all flex justify-center items-center gap-2"
      onClick={() => {
        if (typeof window !== 'undefined') window.print();
      }}
    >
      <span className="material-symbols-outlined text-[20px]">download</span>
      Download Ticket
    </button>
  );
}
