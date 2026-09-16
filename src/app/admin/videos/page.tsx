'use client';

import React, { useState, useEffect } from 'react';
import { adminEngine, AdminVideoItem } from '@/lib/adminStore';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<AdminVideoItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [newVideo, setNewVideo] = useState({
    title: '',
    category: 'Highlights' as AdminVideoItem['category'],
    duration: '09:45',
    thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    setVideos(adminEngine.getVideos());
  }, []);

  const refreshVideos = () => {
    setVideos([...adminEngine.getVideos()]);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Remove video "${title}" from the video vault?`)) {
      adminEngine.deleteVideo(id);
      refreshVideos();
      showToast('Video removed');
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AdminVideoItem = {
      id: `vid-${Date.now()}`,
      title: newVideo.title,
      category: newVideo.category,
      duration: newVideo.duration,
      views: '1.2K',
      thumbnail: newVideo.thumbnail
    };
    adminEngine.addVideo(created);
    refreshVideos();
    setShowAddModal(false);
    setNewVideo({
      title: '',
      category: 'Highlights',
      duration: '08:30',
      thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80'
    });
    showToast('Video uploaded to RoshSpark Vault!');
  };

  const filtered = videos.filter(v => categoryFilter === 'ALL' || v.category === categoryFilter);

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
            Video Vault & Broadcast Highlights
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage match highlights, classic finishes, press conferences, and official stadium archive footage.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Publish New Video
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 overflow-x-auto">
        {(['ALL', 'Highlights', 'Classics', 'Interviews', 'Features'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              categoryFilter === cat
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {cat === 'ALL' ? 'All Videos' : cat}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(video => (
          <div
            key={video.id}
            className="rounded-2xl bg-slate-900/40 border border-slate-800/80 overflow-hidden group hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg"
          >
            {/* Thumbnail Header */}
            <div className="relative aspect-video bg-slate-950 overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
              <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] font-bold text-white">
                {video.duration}
              </div>
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-emerald-500/80 text-slate-950 font-bold text-[10px]">
                {video.category}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-white text-sm line-clamp-2 group-hover:text-emerald-300 transition-colors">
                {video.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                <span>{video.views} Views</span>
                <button
                  onClick={() => handleDelete(video.id, video.title)}
                  className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                  title="Delete Video"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Video Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Publish Video to Vault
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Video Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Last Over Thriller: India vs Australia RoshSpark 2026"
                  value={newVideo.title}
                  onChange={e => setNewVideo({ ...newVideo, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                  <select
                    value={newVideo.category}
                    onChange={e => setNewVideo({ ...newVideo, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Highlights">Highlights</option>
                    <option value="Classics">Classics</option>
                    <option value="Interviews">Interviews</option>
                    <option value="Features">Features</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Duration (MM:SS)</label>
                  <input
                    type="text"
                    required
                    placeholder="08:45"
                    value={newVideo.duration}
                    onChange={e => setNewVideo({ ...newVideo, duration: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Cover Thumbnail URL</label>
                <input
                  type="url"
                  required
                  value={newVideo.thumbnail}
                  onChange={e => setNewVideo({ ...newVideo, thumbnail: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
                >
                  Upload Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
