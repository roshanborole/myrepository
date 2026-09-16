"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BackButtonProps {
  onClick?: () => void;
  href?: string;
  label?: string;
}

export default function BackButton({ onClick, href, label = "Back" }: BackButtonProps) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    } else if (!href) {
      e.preventDefault();
      router.back();
    }
  };

  const btnContent = (
    <span className="font-label-caps text-label-caps uppercase tracking-wider">
      Back
    </span>
  );

  const className = "group inline-flex items-center px-4 py-2 rounded-full bg-surface-container-high border border-white/10 text-on-surface hover:bg-surface hover:border-primary/50 hover:text-primary hover:shadow-[0_0_15px_rgba(52,211,153,0.15)] transition-all cursor-pointer z-50 shadow-md";

  if (href) {
    return (
      <Link href={href} className={className}>
        {btnContent}
      </Link>
    );
  }

  return (
    <button onClick={handleBack} className={className} aria-label="Go back">
      {btnContent}
    </button>
  );
}
