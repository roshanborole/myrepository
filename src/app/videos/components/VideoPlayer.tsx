"use client";

import { useEffect, useRef, useState } from 'react';
import { Video } from '../data';

interface VideoPlayerProps {
  video: Video;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const speeds = [1.0, 1.25, 1.5, 2.0];

  useEffect(() => {
    // Reset state on video change
    if (videoRef.current) {
      videoRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
      setHasError(false);
      
      // Auto-play the new video
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  }, [video]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleProgress = () => {
    if (videoRef.current && videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      setBuffered(bufferedEnd);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (timelineRef.current && videoRef.current && duration) {
      const rect = timelineRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const clampedPos = Math.max(0, Math.min(1, pos));
      videoRef.current.currentTime = clampedPos * duration;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (newMuted) {
        setVolume(0);
      } else {
        setVolume(videoRef.current.volume || 1);
      }
    }
  };

  const cycleSpeed = () => {
    const nextIdx = (speedIdx + 1) % speeds.length;
    setSpeedIdx(nextIdx);
    if (videoRef.current) {
      videoRef.current.playbackRate = speeds[nextIdx];
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const formatTime = (sec: number) => {
    if (isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPct = duration ? (currentTime / duration) * 100 : 0;
  const bufferPct = duration ? (buffered / duration) * 100 : 0;

  return (
    <section className={`mx-auto px-6 lg:px-10 py-2 transition-all duration-300 ${isTheaterMode ? 'w-full max-w-none' : 'max-w-7xl w-full'}`} id="theaterSection">
      <div className="bg-[#0c0e12] rounded-2xl overflow-hidden shadow-2xl border border-white/5 relative" ref={containerRef}>
        
        {/* 16:9 Interactive Video Player Viewport Frame */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden group">
          <video 
            ref={videoRef}
            src={video.videoUrl}
            poster={video.poster}
            className="w-full h-full object-contain bg-black"
            playsInline
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onProgress={handleProgress}
            onLoadedMetadata={handleTimeUpdate}
            onWaiting={() => setIsWaiting(true)}
            onCanPlay={() => setIsWaiting(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => { setIsWaiting(false); setHasError(true); }}
            onClick={togglePlay}
          />

          {/* Graceful Video Error Overlay */}
          {hasError && (
            <div className="absolute inset-0 bg-[#0c0e12]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
              <div className="w-16 h-16 rounded-full bg-red-900/40 text-red-500 flex items-center justify-center mb-3">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 className="font-sans text-lg text-white font-bold mb-1">Video stream unavailable. Please try again.</h4>
              <p className="font-sans text-sm text-slate-400 max-w-md mb-4">Our high-bitrate stadium broadcast node encountered an issue. Switch to standard backup stream or retry now.</p>
              <button 
                onClick={() => { setHasError(false); videoRef.current?.load(); videoRef.current?.play(); }} 
                className="px-5 py-2.5 rounded-lg bg-emerald-500 text-emerald-950 font-mono text-xs uppercase font-bold tracking-wider hover:bg-emerald-400 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Retry Stream
              </button>
            </div>
          )}

          {/* Video Buffering Spinner */}
          {isWaiting && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="w-14 h-14 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Top Broadcast Overlay Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none opacity-90 transition-opacity duration-300">
            <div className="flex items-center gap-2.5">
              <span className="bg-emerald-500/95 text-emerald-950 px-3 py-1 rounded font-mono text-[11px] uppercase font-bold tracking-widest shadow-md">
                {video.category}
              </span>
              <span className="bg-[#282a2e]/80 backdrop-blur-md text-slate-300 px-3 py-1 rounded font-mono text-[11px] uppercase flex items-center gap-1.5 shadow-sm border border-white/5">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg> 
                Sky & Star Dual Audio
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#0c0e12]/80 backdrop-blur-md text-white px-3 py-1 rounded font-mono text-[11px] uppercase tracking-wider border border-white/5">
                {video.duration} • 4K 60FPS HDR
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-500/90 text-white font-mono text-[10px] tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span> 3,200 LUX
              </span>
            </div>
          </div>

          {/* Big Center Play Button Overlay (when paused) */}
          <div 
            className={`absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-20 bg-black/30 group-hover:bg-black/20 transition-all ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            onClick={togglePlay}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-emerald-500 text-emerald-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 relative">
              <span className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping"></span>
              <svg className="w-12 h-12 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <span className="mt-4 font-mono text-xs tracking-widest text-white uppercase bg-black/60 backdrop-blur-sm px-4 py-1 rounded-full border border-white/10">
              CLICK TO PLAY STREAM
            </span>
          </div>

          {/* Bottom Interactive Controls Bar */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black via-black/85 to-transparent flex flex-col gap-2 z-20 transition-opacity duration-300 ${isPlaying && !isTheaterMode ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
            {/* Interactive Timeline Scrubber */}
            <div 
              className="w-full h-2.5 bg-[#333539]/80 hover:h-3.5 rounded-full overflow-visible relative cursor-pointer group/bar transition-all"
              ref={timelineRef}
              onClick={handleSeek}
            >
              <div className="absolute left-0 top-0 h-full bg-white/20 rounded-full pointer-events-none" style={{ width: `${bufferPct}%` }}></div>
              <div className="h-full bg-emerald-500 rounded-full relative pointer-events-none" style={{ width: `${progressPct}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-100 ring-2 ring-emerald-500 transform translate-x-1/2"></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2">
              <div className="flex items-center gap-3">
                <button onClick={togglePlay} className="text-white hover:text-emerald-400 transition-colors flex items-center">
                  {isPlaying ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </button>
                
                <div className="flex items-center gap-1.5 group/vol">
                  <button onClick={toggleMute} className="text-white hover:text-emerald-400 transition-colors">
                    {isMuted || volume === 0 ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                    ) : volume < 0.5 ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                    )}
                  </button>
                  <input 
                    type="range" min="0" max="1" step="0.05" 
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 md:w-20 h-1 accent-emerald-500 bg-[#333539] rounded cursor-pointer" 
                  />
                </div>
                
                <div className="flex items-center gap-1.5 ml-2">
                  <span className="text-emerald-400 font-bold">{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={cycleSpeed} className="px-2 py-0.5 rounded bg-[#1e2024] text-slate-300 hover:text-emerald-400 text-[11px] font-mono border border-white/5">
                  {speeds[speedIdx].toFixed(1)}x
                </button>
                <button onClick={() => setIsTheaterMode(!isTheaterMode)} className="text-white hover:text-emerald-400 transition-colors hidden sm:inline-block">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 19H5V5h14v14zM3 3v18h18V3H3zm14 11H7v-2h10v2zm0-4H7V8h10v2z"/></svg>
                </button>
                <button onClick={toggleFullscreen} className="text-white hover:text-emerald-400 transition-colors">
                  {isFullscreen ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Spotlight Meta Information */}
        <div className="p-6 md:p-8 bg-[#1e2024] flex flex-col lg:flex-row justify-between gap-6 border-t border-white/5">
          <div className="max-w-3xl flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
              <span className="text-emerald-400 font-bold">{video.date}</span>
              <span>•</span>
              <span>{video.views}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/></svg>
                {video.likes} Like Ratio
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-[#282a2e] text-slate-300 text-[10px] border border-white/5">STADIUM 4K FEED</span>
            </div>
            <h2 className="font-sans text-2xl text-white font-semibold tracking-tight mt-1">
              {video.title}
            </h2>
            <p className="font-sans text-base text-slate-300 mt-2">
              {video.description}
            </p>

            <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-4 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5"><span className="text-emerald-400 font-bold">VENUE:</span> RoshSpark Main Ring</div>
              <div className="flex items-center gap-1.5"><span className="text-emerald-400 font-bold">BITRATE:</span> 38.4 Mbps HDR</div>
              <div className="flex items-center gap-1.5"><span className="text-emerald-400 font-bold">CAM SYSTEM:</span> Sony HDC-4300 8x</div>
              <div className="flex items-center gap-1.5"><span className="text-emerald-400 font-bold">TURF MOISTURE:</span> 14.2%</div>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-col items-start lg:items-end justify-start gap-3">
            <button 
              onClick={() => document.getElementById('multiCamSection')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 text-emerald-950 font-mono text-xs uppercase font-bold shadow-md hover:bg-emerald-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/></svg> 
              Multi-Cam Grid
            </button>
            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-lg bg-[#282a2e] text-slate-400 hover:text-emerald-400 hover:bg-[#333539] transition-colors" title="Save to Watchlist">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13zM11 7h2v3h3v2h-3v3h-2v-3H8v-2h3z"/></svg>
              </button>
              <button className="p-2.5 rounded-lg bg-[#282a2e] text-slate-400 hover:text-emerald-400 hover:bg-[#333539] transition-colors" title="Share Replay">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
              </button>
              <button className="p-2.5 rounded-lg bg-[#282a2e] text-slate-400 hover:text-emerald-400 hover:bg-[#333539] transition-colors" title="Download 1080p Clip">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
