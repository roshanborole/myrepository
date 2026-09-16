'use client';

import React, { useState, useEffect } from 'react';
import { adminEngine, AdminNewsItem } from '@/lib/adminStore';

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<AdminNewsItem[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Stadium Announcement' as AdminNewsItem['category'],
    summary: '',
    author: 'Chief Media Officer',
    published: true
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    setArticles(adminEngine.getNews());
  }, []);

  const refreshArticles = () => {
    setArticles([...adminEngine.getNews()]);
  };

  const handleTogglePublish = (id: string) => {
    const art = articles.find(a => a.id === id);
    if (!art) return;
    const newStatus = !art.published;
    adminEngine.updateNewsStatus(id, newStatus);
    refreshArticles();
    showToast(`Article ${newStatus ? 'published live' : 'un-published to draft'}`);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete article "${title}"?`)) {
      adminEngine.deleteNews(id);
      refreshArticles();
      showToast('Article deleted');
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AdminNewsItem = {
      id: `news-${Date.now()}`,
      headline: formData.title,
      title: formData.title,
      category: formData.category,
      summary: formData.summary,
      description: formData.summary,
      date: new Date().toISOString().split('T')[0],
      publishDate: new Date().toISOString().split('T')[0],
      author: formData.author,
      published: formData.published
    };
    adminEngine.addNews(created);
    refreshArticles();
    setShowCreateModal(false);
    setFormData({
      title: '',
      category: 'Stadium Announcement',
      summary: '',
      author: 'Chief Media Officer',
      published: true
    });
    showToast('Article created and published!');
  };

  const filtered = articles.filter(a => {
    const matchCat = categoryFilter === 'ALL' || a.category === categoryFilter;
    const matchSearch =
      (a.title || a.headline || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.summary || a.description || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
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
            Press Releases & News Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish official announcements, match reports, pitch condition dossiers, and stadium bulletins.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Compose Article
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          {(['ALL', 'Match Report', 'Stadium Announcement', 'Team News', 'Pitch Analysis'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {cat === 'ALL' ? 'All Stories' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* News List */}
      <div className="space-y-3">
        {filtered.map(article => (
          <div
            key={article.id}
            className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
                  {article.category}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{article.date}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">By {article.author}</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                {article.title || article.headline}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                {article.summary || article.description}
              </p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <button
                onClick={() => handleTogglePublish(article.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  article.published
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                }`}
              >
                {article.published ? '● Live' : '○ Draft'}
              </button>
              <button
                onClick={() => handleDelete(article.id, article.title)}
                className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Delete Article"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Compose Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Compose Official Article
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RoshSpark Stadium Installs Next-Gen High-Definition LED Lighting"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Match Report">Match Report</option>
                    <option value="Stadium Announcement">Stadium Announcement</option>
                    <option value="Team News">Team News</option>
                    <option value="Pitch Analysis">Pitch Analysis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Author / Byline</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Summary / Lead Paragraph</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter the full report or stadium advisory..."
                  value={formData.summary}
                  onChange={e => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pubNow"
                  checked={formData.published}
                  onChange={e => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="pubNow" className="text-slate-300 font-semibold cursor-pointer">
                  Publish live to public portal immediately
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
