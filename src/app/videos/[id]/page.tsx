"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getVideoById, getRelatedVideos, Video } from '../data';
import VideoPlayer from '../components/VideoPlayer';
import MultiCamGrid from '../components/MultiCamGrid';
import { trackClientActivity } from '@/lib/activityLogger';

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === 'string' ? params.id : '';

  const video = id ? getVideoById(id) : null;
  const related = video ? getRelatedVideos(video.category, video.id) : [];
  
  // State for multi-cam feed overrides
  const [activeFeedUrl, setActiveFeedUrl] = useState<string>('');
  const [activeFeedName, setActiveFeedName] = useState<string>('');
  const [activeFeedLabel, setActiveFeedLabel] = useState<string>('');

  useEffect(() => {
    if (id && !video) {
      router.push('/videos');
    } else if (video) {
      setActiveFeedUrl('');
      setActiveFeedName('');
      setActiveFeedLabel('');
      trackClientActivity('Video opened', `${video.title} (${video.category})`);
    }
  }, [id, video, router]);

  if (!video) {
    return (
      <div className="w-full min-h-screen bg-[#0c0e12] pt-32 flex justify-center items-start">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Determine what to play based on whether a multi-cam feed is selected
  const playVideoData = {
    ...video,
    videoUrl: activeFeedUrl || video.videoUrl,
    title: activeFeedName ? `Live Stadium Feed: ${activeFeedName} (Synchronous 4K)` : video.title,
    category: activeFeedLabel || video.category,
    description: activeFeedName 
      ? `Real-time multi-angle stadium feed direct from ${activeFeedName}. Zero latency audio and pitch telemetry active.`
      : video.description
  };

  const handleSelectFeed = (url: string, name: string, label: string) => {
    setActiveFeedUrl(url);
    setActiveFeedName(name);
    setActiveFeedLabel(label);
    
    // Scroll up to player
    document.getElementById('theaterSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="w-full pt-20 bg-[#0c0e12] min-h-screen">
      <div className="flex flex-col w-full relative">
        {/* Ambient Top Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

        {/* Back Navigation Bar */}
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-10 py-4 relative z-10 flex items-center justify-between border-b border-white/5">
          <Link href="/videos" className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors font-mono text-xs tracking-wider uppercase">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            BACK TO VIDEO VAULT
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">ROSHSPARK SECURE STREAM</span>
          </div>
        </div>

        {/* 1. Main Video Player */}
        <div className="relative z-10 w-full mt-4">
          <VideoPlayer video={playVideoData} />
        </div>

        {/* 2. Multi-Cam Switcher (only show if it's a match-related video maybe? let's show for all per design) */}
        <div className="relative z-10 w-full bg-[#16181c] border-y border-white/5 mt-8">
          <MultiCamGrid onSelectFeed={handleSelectFeed} activeUrl={activeFeedUrl} />
        </div>

        {/* 3. Related Videos */}
        {related.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12 w-full relative z-10">
            <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
              <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/></svg>
              <h3 className="font-sans text-xl text-white font-bold tracking-tight uppercase">
                UP NEXT & RELATED CONTENT
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map(v => (
                <Link 
                  key={v.id} 
                  href={`/videos/${v.id}`}
                  className="group bg-[#1e2024] rounded-xl overflow-hidden shadow-lg border border-white/5 hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <img src={v.poster} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-300 bg-black/60 px-1.5 py-0.5 rounded">{v.duration}</div>
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-emerald-950 flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h5 className="font-sans text-sm text-white font-semibold group-hover:text-emerald-400 transition-colors line-clamp-2">{v.title}</h5>
                    <span className="text-[10px] font-mono text-emerald-400 mt-2 tracking-widest uppercase">{v.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
