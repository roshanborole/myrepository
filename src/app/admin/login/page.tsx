"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminEngine, AdminRole } from '@/lib/adminStore';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('superadmin@roshspark.com');
  const [password, setPassword] = useState('roshadmin2026');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('SUPER_ADMIN');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter Admin ID/Email and Password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Set role in engine
      adminEngine.setAdminRole(selectedRole);
      adminEngine.logActivity('Admin Logged In', 'Authentication Gateway', `Logged in as ${selectedRole} (${email})`);
      setIsLoading(false);
      router.push('/admin');
    }, 600);
  };

  const handlePresetSelect = (role: AdminRole, presetEmail: string) => {
    setSelectedRole(role);
    setEmail(presetEmail);
    setPassword('roshadmin2026');
    setError('');
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setIsForgotPasswordOpen(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#07090d] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Ambient background stadium glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-emerald-700/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        
        {/* Card Frame */}
        <div className="bg-[#0c0f16]/95 border border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-xl">
          
          {/* Header & Logo */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-black border-2 border-emerald-500/40 p-1 mx-auto shadow-xl shadow-emerald-500/10 flex items-center justify-center">
              <img src="/logo_3d.jpg" alt="RoshSpark 3D Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-mono text-[11px] text-emerald-400 tracking-[0.2em] uppercase font-black block">
                ROSHSPARK CRICKET STADIUM
              </span>
              <h1 className="font-sans text-2xl font-black text-white tracking-tight uppercase mt-1">
                ADMIN PORTAL
              </h1>
              <p className="text-slate-400 text-xs font-mono mt-1">
                Authorized Operations &amp; Scoring Gateway
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 mb-5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
            <div>
              <label className="text-slate-400 text-[10px] uppercase block mb-1.5 font-bold">
                ADMIN ID / EMAIL
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@roshspark.com"
                className="w-full bg-[#07090e] border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-slate-400 text-[10px] uppercase block mb-1.5 font-bold">
                PASSWORD
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#07090e] border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-slate-400 text-[10px] uppercase block mb-1.5 font-bold">
                ACCESS ROLE LEVEL
              </label>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value as AdminRole)}
                className="w-full bg-[#07090e] border border-white/10 rounded-xl px-4 py-3 text-emerald-400 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer font-bold"
              >
                <option value="SUPER_ADMIN" className="bg-[#0c0f16] text-white">Super Admin (Full Access)</option>
                <option value="MATCH_ADMIN" className="bg-[#0c0f16] text-white">Match Admin (Live Scoring &amp; Squads)</option>
                <option value="TICKET_ADMIN" className="bg-[#0c0f16] text-white">Ticket Admin (Box Office &amp; Seats)</option>
                <option value="CONTENT_ADMIN" className="bg-[#0c0f16] text-white">Content Admin (News, Videos, Series)</option>
              </select>
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? 'Authenticating...' : 'LOGIN TO ADMIN CONSOLE'}
              </button>

              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className="w-full text-center text-slate-400 hover:text-emerald-400 text-[11px] font-mono transition-colors"
              >
                FORGOT PASSWORD?
              </button>
            </div>
          </form>

          {/* Quick Role Presets for Testing */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2 text-center">
              QUICK DEMO CREDENTIALS:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => handlePresetSelect('SUPER_ADMIN', 'superadmin@roshspark.com')}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  selectedRole === 'SUPER_ADMIN' ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400' : 'bg-[#141720] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <strong>Super Admin</strong>
                <span className="block text-[9px] text-slate-500">Full control</span>
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('MATCH_ADMIN', 'matchadmin@roshspark.com')}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  selectedRole === 'MATCH_ADMIN' ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400' : 'bg-[#141720] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <strong>Match Admin</strong>
                <span className="block text-[9px] text-slate-500">Scoring &amp; Teams</span>
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('TICKET_ADMIN', 'ticketadmin@roshspark.com')}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  selectedRole === 'TICKET_ADMIN' ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400' : 'bg-[#141720] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <strong>Ticket Admin</strong>
                <span className="block text-[9px] text-slate-500">Stands &amp; Pricing</span>
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('CONTENT_ADMIN', 'contentadmin@roshspark.com')}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  selectedRole === 'CONTENT_ADMIN' ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400' : 'bg-[#141720] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <strong>Content Admin</strong>
                <span className="block text-[9px] text-slate-500">News &amp; Media</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-[10px] font-mono text-slate-500">
            <span>Restricted personnel gateway &bull; All activity monitored</span>
          </div>

        </div>

        {/* Back to Public Site Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-xs font-mono text-slate-400 hover:text-emerald-400 transition-colors">
            &larr; Return to Public RoshSpark Website
          </Link>
        </div>

      </div>

      {/* FORGOT PASSWORD MODAL */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c0f16] border border-white/10 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsForgotPasswordOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto text-xl">
              🔑
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Reset Admin Credentials</h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Enter your authorized stadium administrator email to receive a temporary recovery token.
              </p>
            </div>

            {forgotSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono">
                Recovery instructions sent to {forgotEmail}! Check your inbox.
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3 font-mono text-xs">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="admin@roshspark.com"
                  className="w-full bg-[#07090e] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase transition-all"
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
