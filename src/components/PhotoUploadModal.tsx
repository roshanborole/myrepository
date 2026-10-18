"use client";

import React, { useState, useRef, useEffect } from 'react';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (url: string) => void;
  currentPhotoUrl?: string;
  title?: string;
}

interface S3Status {
  configured: boolean;
  bucket: string;
  region: string;
  isSecure?: boolean;
}

export default function PhotoUploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
  currentPhotoUrl,
  title = "Upload Photo to AWS S3",
}: PhotoUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedMeta, setUploadedMeta] = useState<{
    name: string;
    key: string;
    size: number;
    originalSize?: number;
    savingsPercent?: number;
    dimensions?: { width: number; height: number };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorHint, setErrorHint] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [s3Status, setS3Status] = useState<S3Status | null>(null);
  const [manualUrl, setManualUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch S3 configuration status
  useEffect(() => {
    if (isOpen) {
      fetch('/api/upload')
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            setS3Status(data.status);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;

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
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setError(null);
    setErrorHint(null);
    setUploadedUrl(null);
    setUploadedMeta(null);

    // Validate image format
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP, GIF, SVG).');
      return;
    }

    // Validate size (15MB)
    if (file.size > 15 * 1024 * 1024) {
      setError(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds 15MB limit.`);
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    setErrorHint(null);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('folder', 'new/profiles'); // Prefix starts with new/

    try {
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 15 : prev));
      }, 150);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressTimer);
      setUploadProgress(100);

      const data = await response.json();

      if (data.success && data.file?.url) {
        setUploadedUrl(data.file.url);
        setUploadedMeta({
          name: data.file.name,
          key: data.file.key,
          size: data.file.size,
          originalSize: data.file.originalSize,
          savingsPercent: data.file.savingsPercent,
          dimensions: data.file.dimensions,
        });
        onUploadSuccess(data.file.url);
      } else {
        setError(data.error || 'Failed to upload photo to AWS S3');
        setErrorHint(data.hint || null);
      }
    } catch (err: any) {
      setError(err?.message || 'Network error occurred while uploading.');
      setErrorHint('Please ensure the server is running and your AWS credentials are valid.');
    } finally {
      setUploading(false);
    }
  };

  const handleApplyManualUrl = () => {
    if (!manualUrl.trim()) return;
    onUploadSuccess(manualUrl.trim());
    onClose();
  };

  const handleCopyUrl = () => {
    if (uploadedUrl) {
      navigator.clipboard.writeText(uploadedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-[#121418] border border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top ambient glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                AWS S3 STORAGE CLOUD
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1e2024] hover:bg-[#282a2e] text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-white/5"
          >
            ✕
          </button>
        </div>

        {/* AWS S3 Connection Telemetry Badge */}
        <div className="my-4 p-3 rounded-2xl bg-[#16181c] border border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-slate-400">Bucket:</span>
            <span className="text-emerald-400 font-bold">{s3Status?.bucket || 'mystadi'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Region:</span>
            <span className="text-slate-300 font-semibold">{s3Status?.region || 'ap-south-1'}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
              ENCRYPTED
            </span>
          </div>
        </div>

        {/* Tab Toggle: Direct S3 Upload vs Image URL */}
        <div className="flex items-center gap-2 mb-4 bg-[#0a0c0e] p-1 rounded-xl border border-white/5 font-mono text-xs">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'upload'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Select &amp; Upload Image
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'url'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Paste Image URL
          </button>
        </div>

        {activeTab === 'upload' ? (
          <div className="space-y-4">
            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                dragActive
                  ? 'border-emerald-400 bg-emerald-950/20 scale-[0.99]'
                  : 'border-white/10 hover:border-emerald-500/50 bg-[#16181c]/60 hover:bg-[#16181c]'
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
                <div className="relative group w-28 h-28 rounded-2xl overflow-hidden border-2 border-emerald-400/50 shadow-lg">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-mono">
                    Change
                  </div>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-2xl">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-sm font-bold text-white">
                  {selectedFile ? selectedFile.name : 'Click to browse or drag and drop your photo'}
                </p>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedFile
                    ? `${formatFileSize(selectedFile.size)} • ${selectedFile.type}`
                    : 'Supported: JPEG, PNG, WebP, GIF, SVG (Max 10MB)'}
                </p>
              </div>

              {!selectedFile && (
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-[#22252a] hover:bg-[#2c3036] text-emerald-400 font-mono text-xs font-bold transition-all border border-white/5"
                >
                  Browse Files
                </button>
              )}
            </div>

            {/* Error Message & Hints */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-red-400">
                  <span>⚠️</span>
                  <span>Upload Failed</span>
                </div>
                <p>{error}</p>
                {errorHint && <p className="text-slate-400 text-[11px] mt-1 pt-1 border-t border-red-500/20">{errorHint}</p>}
              </div>
            )}

            {/* Uploading Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Uploading to AWS S3...</span>
                  <span className="text-emerald-400 font-bold">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1e2024] overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Upload Success State */}
            {uploadedUrl && (
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Compressed &amp; Uploaded to AWS S3!</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-mono font-bold uppercase tracking-wider">
                    1:1 SQUARE
                  </span>
                </div>

                {/* Compression & Prefix Telemetry */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-xl bg-[#0c0e12] border border-white/5 space-y-0.5">
                    <span className="text-slate-500 text-[10px] uppercase block">S3 Prefix</span>
                    <span className="text-emerald-400 font-bold">new/</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#0c0e12] border border-white/5 space-y-0.5">
                    <span className="text-slate-500 text-[10px] uppercase block">Aspect Ratio</span>
                    <span className="text-slate-200 font-bold">
                      {uploadedMeta?.dimensions ? `${uploadedMeta.dimensions.width}×${uploadedMeta.dimensions.height} (1:1)` : '1:1 Square'}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#0c0e12] border border-white/5 space-y-0.5 col-span-2 sm:col-span-1">
                    <span className="text-slate-500 text-[10px] uppercase block">Compression</span>
                    <span className="text-emerald-300 font-bold">
                      {uploadedMeta?.savingsPercent ? `-${uploadedMeta.savingsPercent}% Size` : 'Optimized'}
                    </span>
                  </div>
                </div>

                {uploadedMeta?.name && (
                  <div className="px-3 py-1.5 rounded-xl bg-[#0c0e12] border border-white/5 text-[11px] font-mono flex items-center justify-between">
                    <span className="text-slate-400">File Name:</span>
                    <span className="text-emerald-400 font-semibold truncate ml-2">{uploadedMeta.name}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 bg-[#0c0e12] p-2 rounded-xl border border-white/10 font-mono text-xs">
                  <input
                    type="text"
                    readOnly
                    value={uploadedUrl}
                    className="bg-transparent flex-1 text-slate-300 truncate focus:outline-none"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="px-2.5 py-1 rounded bg-[#1e2024] hover:bg-[#282a2e] text-emerald-400 font-bold text-[11px] transition-colors whitespace-nowrap"
                  >
                    {copied ? 'Copied!' : 'Copy S3 Link'}
                  </button>
                </div>
              </div>
            )}

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#1e2024] hover:bg-[#282a2e] text-slate-300 font-mono text-xs font-semibold transition-colors"
              >
                Close
              </button>

              {uploadedUrl ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20"
                >
                  Done
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!selectedFile || uploading}
                  onClick={handleUpload}
                  className={`px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    !selectedFile || uploading
                      ? 'bg-emerald-950/50 text-slate-500 cursor-not-allowed border border-white/5'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span>Upload to S3</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Manual Image URL Tab */
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400">Direct Image / S3 URL</label>
              <input
                type="url"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                placeholder="https://roshspark-uploads.s3.amazonaws.com/photos/image.jpg"
                className="w-full bg-[#0a0c0e] border border-white/10 rounded-xl px-4 py-3 text-slate-200 text-sm font-mono focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-500 font-mono">
                You can paste an existing AWS S3 URL or external image link.
              </p>
            </div>

            {manualUrl && (
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#16181c] border border-white/5">
                <img
                  src={manualUrl}
                  alt="Preview"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  className="w-16 h-16 rounded-xl object-cover border border-white/10"
                />
                <span className="text-xs font-mono text-slate-400 truncate flex-1">{manualUrl}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#1e2024] hover:bg-[#282a2e] text-slate-300 font-mono text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!manualUrl.trim()}
                onClick={handleApplyManualUrl}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase disabled:opacity-50"
              >
                Apply Image URL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
