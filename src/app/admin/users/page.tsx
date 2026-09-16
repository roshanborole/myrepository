'use client';

import React, { useState, useEffect } from 'react';
import { adminEngine, AdminUserAccount } from '@/lib/adminStore';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserAccount[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    setUsers(adminEngine.getUsers());
  }, []);

  const refreshUsers = () => {
    setUsers([...adminEngine.getUsers()]);
  };

  const handleToggleStatus = (userId: string, currentStatus: AdminUserAccount['status']) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    adminEngine.toggleUserStatus(userId, nextStatus);
    refreshUsers();
    showToast(`User status updated to ${nextStatus}`);
  };

  const handleResetPassword = (email: string) => {
    adminEngine.logActivity('PASSWORD_RESET_DISPATCHED', `Reset link sent to registered fan: ${email}`);
    showToast(`Password reset link dispatched to ${email}`);
  };

  const filtered = users.filter(u => {
    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#10b981]"></span>
            Fan Directory & User Accounts
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage registered spectators, booking entitlements, password assistance, and access permissions.
          </p>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Registered Spectators</div>
          <div className="text-2xl font-black text-white mt-1">{users.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-emerald-400 font-medium">Active Accounts</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {users.filter(u => u.status === 'ACTIVE').length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-rose-400 font-medium">Suspended Accounts</div>
          <div className="text-2xl font-black text-rose-400 mt-1">
            {users.filter(u => u.status === 'SUSPENDED').length}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
        <div className="flex items-center gap-2">
          {(['ALL', 'ACTIVE', 'SUSPENDED'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Contact Details</th>
              <th className="py-3 px-4">Registered Date</th>
              <th className="py-3 px-4 text-center">Tickets Purchased</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-500">
                  No registered users match your filter.
                </td>
              </tr>
            ) : (
              filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{u.name}</div>
                    <div className="text-[10px] font-mono text-slate-500">{u.id}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-200">{u.email}</div>
                    <div className="text-[11px] text-slate-400">{u.phone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-400">{u.registeredDate}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono font-bold text-white">{u.ticketsBooked}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      u.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleResetPassword(u.email)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Reset PW
                      </button>
                      <button
                        onClick={() => handleToggleStatus(u.id, u.status)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                          u.status === 'ACTIVE'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
