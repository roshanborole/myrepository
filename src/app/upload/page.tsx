"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface UploadedFileRecord {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
  key: string;
  bucket: string;
}

export default function PhotoUploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [errorHint, setErrorHint] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [s3Status, setS3Status] = useState<any>(null);
  const [uploadedGallery, setUploadedGallery] = useState<UploadedFileRecord[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load past uploads from localStorage for quick preview
  useEffect(() => {
    try {
      const saved = localStorage.getItem('roshspark_s3_uploads');
      if (saved) {
        setUploadedGallery(JSON.parse(saved));
      }
    } catch {}

    fetch('/api/upload')
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setS3Status(data.status);
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setError(null);
    setErrorHint(null);

    if (!file.type.startsWith('image/')) {
      setError('Unsupported file type. Please select an image (JPEG, PNG, WebP, GIF, SVG).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds 10MB limit.`);
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    setErrorHint(null);
    setUploadProgress(15);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('folder', 'gallery');

    try {
      const timer = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 15 : prev));
      }, 150);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(timer);
      setUploadProgress(100);

      const data = await res.json();

      if (data.success && data.file) {
        const newRecord: UploadedFileRecord = {
          id: `s3-${Date.now()}`,
          name: data.file.name,
          url: data.file.url,
          size: data.file.size,
          uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          key: data.file.key,
          bucket: data.file.bucket,
        };

        const updated = [newRecord, ...uploadedGallery];
        setUploadedGallery(updated);
        try {
          localStorage.setItem('roshspark_s3_uploads', JSON.stringify(updated));
        } catch {}

        showToast('Photo uploaded successfully to AWS S3!');
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        setError(data.error || 'Failed to upload photo to AWS S3');
        setErrorHint(data.hint || null);
      }
    } catch (err: any) {
      setError(err?.message || 'Network connection failed.');
      setErrorHint('Ensure local dev server is operational and AWS credentials in .env are active.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('AWS S3 Public URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleRemoveFromHistory = (id: string) => {
    const updated = uploadedGallery.filter((item) => item.id !== id);
    setUploadedGallery(updated);
    try {
      localStorage.setItem('roshspark_s3_uploads', JSON.stringify(updated));
    } catch {}
    showToast('Removed from recent uploads list.');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <main className="min-h-screen pt-24 pb-20 bg-[#0c0e12] text-slate-100 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-black px-5 py-3 rounded-xl shadow-2xl font-mono text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                AWS S3 CLOUD STORAGE
              </span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase mt-1">
              PHOTO UPLOADER &amp; VAULT
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1e2024] hover:bg-[#282a2e] text-slate-300 hover:text-white font-mono text-xs transition-colors border border-white/5"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Back to Profile</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase transition-all shadow-lg shadow-emerald-500/20"
            >
              <span>Home</span>
            </Link>
          </div>
        </div>

        {/* AWS S3 Configuration Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="bg-[#16181c] p-4 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
              IAM USER CREDENTIAL
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-slate-200 font-bold">
                {s3Status?.maskedAccessKey || 'AKIAX2...NWY'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">Secured in Server .env</p>
          </div>

          <div className="bg-[#16181c] p-4 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
              TARGET S3 BUCKET
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-emerald-400 font-bold">
                {s3Status?.bucket || 'roshspark-uploads'}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {s3Status?.region || 'us-east-1'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">AWS Simple Storage Service</p>
          </div>

          <div className="bg-[#16181c] p-4 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
              MAX FILE SIZE &amp; FORMAT
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-white font-bold">10 MB Limit</span>
              <span className="text-xs font-mono text-slate-400">JPEG, PNG, WebP</span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">High-speed multipart upload</p>
          </div>
        </div>

        {/* Upload Dropzone Section */}
        <div className="bg-[#16181c] rounded-3xl p-6 sm:p-8 border border-white/5 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-xl font-bold text-white tracking-tight">Upload New Photo</h2>
              <p className="text-xs text-slate-400 font-mono">
                Select an image file from your device or drag and drop into the zone below.
              </p>
            </div>
            {selectedFile && (
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="text-xs font-mono text-slate-400 hover:text-red-400 underline"
              >
                Clear Selection
              </button>
            )}
          </div>

          {/* Drag & Drop Card */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-4 ${
              dragActive
                ? 'border-emerald-400 bg-emerald-950/20 scale-[0.99]'
                : 'border-white/10 hover:border-emerald-500/50 bg-[#121418] hover:bg-[#15171b]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              onChange={handleFileChange}
              className="hidden"
            />

            {previewUrl ? (
              <div className="space-y-3 flex flex-col items-center">
                <div className="relative group w-36 h-36 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-2xl">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-mono font-bold">
                    Click to Change
                  </div>
                </div>
                <div className="text-center space-y-0.5">
                  <p className="text-sm font-bold text-white font-mono">{selectedFile?.name}</p>
                  <p className="text-xs text-emerald-400 font-mono">
                    {selectedFile ? `${formatFileSize(selectedFile.size)} • ${selectedFile.type}` : ''}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-3xl shadow-lg">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-white">Drag and drop your image here, or browse files</p>
                  <p className="text-xs text-slate-400 font-mono">
                    Supports high-resolution JPG, PNG, WebP, GIF, SVG (up to 10MB)
                  </p>
                </div>
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-[#22252a] hover:bg-[#2c3036] text-emerald-400 font-mono text-xs font-bold transition-all border border-white/5"
                >
                  Browse Device Storage
                </button>
              </>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono space-y-1">
              <div className="font-bold flex items-center gap-2 text-red-400">
                <span>⚠️</span>
                <span>Upload Error</span>
              </div>
              <p>{error}</p>
              {errorHint && <p className="text-slate-400 text-[11px] mt-1 pt-1 border-t border-red-500/20">{errorHint}</p>}
            </div>
          )}

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-2 bg-[#121418] p-4 rounded-2xl border border-white/5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Uploading to AWS S3 ({s3Status?.bucket})...</span>
                <span className="text-emerald-400 font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#1e2024] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Upload Action Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={!selectedFile || isUploading}
              onClick={handleUpload}
              className={`px-8 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg ${
                !selectedFile || isUploading
                  ? 'bg-emerald-950/50 text-slate-500 cursor-not-allowed border border-white/5'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
              }`}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Uploading to S3 Bucket...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Upload Image to S3</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Uploaded Photos Gallery Section */}
        <div className="mt-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-semibold">
                S3 OBJECT VAULT
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Recently Uploaded Images ({uploadedGallery.length})
              </h3>
            </div>
            {uploadedGallery.length > 0 && (
              <button
                onClick={() => {
                  setUploadedGallery([]);
                  try {
                    localStorage.removeItem('roshspark_s3_uploads');
                  } catch {}
                  showToast('Gallery history cleared.');
                }}
                className="text-xs font-mono text-slate-400 hover:text-red-400 underline"
              >
                Clear History
              </button>
            )}
          </div>

          {uploadedGallery.length === 0 ? (
            <div className="text-center py-12 bg-[#16181c]/50 rounded-2xl border border-white/5 space-y-2">
              <div className="w-12 h-12 rounded-xl bg-[#22252a] text-slate-400 mx-auto flex items-center justify-center text-xl">
                📷
              </div>
              <p className="text-sm font-mono text-slate-400">No photos uploaded yet in this session.</p>
              <p className="text-xs text-slate-500 font-mono">
                Select an image above and upload it to see it stored in your AWS S3 bucket.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedGallery.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#16181c] rounded-2xl border border-white/5 overflow-hidden group hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="aspect-video w-full bg-black/60 relative overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-white/10">
                      {formatFileSize(item.size)}
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-mono text-white font-bold truncate" title={item.name}>
                        {item.name}
                      </h4>
                      <p className="text-[10px] font-mono text-slate-500 truncate" title={item.key}>
                        {item.key}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleCopyLink(item.url, item.id)}
                        className="flex-1 py-1.5 rounded-lg bg-[#22252a] hover:bg-[#2c3036] text-emerald-400 font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-white/5"
                      >
                        {copiedId === item.id ? (
                          <span>✓ Copied</span>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Copy S3 URL</span>
                          </>
                        )}
                      </button>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        title="Open in new tab"
                        className="w-8 h-8 rounded-lg bg-[#22252a] hover:bg-[#2c3036] text-slate-300 hover:text-white flex items-center justify-center text-xs transition-colors border border-white/5"
                      >
                        ↗
                      </a>

                      <button
                        onClick={() => handleRemoveFromHistory(item.id)}
                        title="Remove from history"
                        className="w-8 h-8 rounded-lg bg-[#22252a] hover:bg-red-950/60 text-slate-400 hover:text-red-400 flex items-center justify-center text-xs transition-colors border border-white/5"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AWS S3 Architecture & Setup Guide */}
        <div className="mt-12 p-6 rounded-3xl bg-[#16181c]/60 border border-white/5 space-y-4">
          <h4 className="text-sm font-bold font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <span>🛡️</span>
            <span>AWS S3 Security &amp; Credentials Notice</span>
          </h4>
          <div className="text-xs text-slate-300 font-mono space-y-2 leading-relaxed">
            <p>
              • <strong>Server-Side Security</strong>: IAM user credentials (<code className="text-emerald-300">AWS_ACCESS_KEY_ID</code> and <code className="text-emerald-300">AWS_SECRET_ACCESS_KEY</code>) are securely held on the Node.js server within <code className="text-slate-100">.env</code>. They are never sent to or visible inside client-side JavaScript bundles.
            </p>
            <p>
              • <strong>Bucket Configuration</strong>: Ensure your AWS S3 bucket exists with <code className="text-slate-100">PutObject</code> permission granted to your IAM user. If public viewing is enabled on the bucket, uploaded photos can be rendered directly by any web browser.
            </p>
            <p>
              • <strong>CORS Configuration</strong>: Because uploads are streamed securely through the <code className="text-emerald-400">/api/upload</code> server route, direct browser-to-S3 CORS restrictions are completely bypassed!
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
