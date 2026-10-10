'use client';

import React, { useState, useTransition, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '@/app/actions/auth';
import BackButton from '@/components/BackButton';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await login(formData);
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        router.push(redirectUrl);
      }
    });
  };

  return (
    <div className="bg-surface-container rounded-3xl p-section-gap shadow-xl border border-white/5">
      <h1 className="font-display-md text-display-md text-on-surface mb-2 text-center">Login or Sign Up</h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-8 text-center">
        Enter your details to continue booking.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-stack-md">
        {error && (
          <div className="p-4 bg-error/10 text-error rounded-xl font-body-md text-sm border border-error/20">
            {error}
          </div>
        )}
        
        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="email">Email Address</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            required
            className="bg-surface-container-low border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
            placeholder="you@example.com"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="password">Password</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            required
            className="bg-surface-container-low border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="mt-4 w-full bg-primary text-on-primary font-headline-md text-body-lg py-4 rounded-xl shadow-[0_0_20px_rgba(46,204,113,0.3)] hover:shadow-[0_0_30px_rgba(46,204,113,0.5)] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isPending ? 'Authenticating...' : 'Continue'}
          {!isPending && <span className="material-symbols-outlined">arrow_forward</span>}
        </button>
        <p className="text-center font-body-sm text-sm text-on-surface-variant mt-2">
          Don&apos;t have an account? It will be created automatically.
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="w-full pt-32 pb-section-gap min-h-screen bg-background flex justify-center items-start">
      <div className="w-full max-w-md px-container-padding">
        <div className="mb-8">
          <BackButton />
        </div>
        <Suspense fallback={<div className="text-center py-10 font-mono text-slate-400">Loading login...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
