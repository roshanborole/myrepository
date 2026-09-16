'use client';

import React from 'react';

export default function DownloadTicketButtons() {
  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center w-full max-w-md print:hidden">

      <button 
        onClick={handleDownload}
        className="flex-1 bg-primary hover:bg-primary/90 text-on-primary font-headline-md text-body-lg py-4 px-8 rounded-xl shadow-[0_0_15px_rgba(46,204,113,0.3)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest font-bold text-sm"
      >
        DOWNLOAD TICKET
      </button>
    </div>
  );
}
