import Stadium3D from '@/components/Stadium3D';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <main className="h-screen pt-20 flex flex-col overflow-hidden relative">
        {/* BEGIN: Hero3DStadium */}
        <section className="relative w-full flex-1 overflow-hidden flex flex-col items-center justify-center" data-purpose="hero-arena-stage">
          {/* Background Ambient Glow Behind Stadium */}
          <div className="absolute inset-0 stadium-ambient-glow pointer-events-none z-0"></div>
          
          {/* Live Three.js 3D Stadium Scene */}
          <div className="absolute inset-0 w-full h-full stadium-mask-vignette pointer-events-auto z-0">
            <Stadium3D />
          </div>

          {/* Architectural 3D Stadium Nameplate */}
          <div className="absolute top-6 sm:top-8 md:top-10 z-10 pointer-events-none flex flex-col items-center text-center px-4 max-w-5xl select-none animate-in fade-in zoom-in-95 duration-1000">
            <h1 className="font-headline-md font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider text-white uppercase leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
              <span className="bg-gradient-to-b from-white via-slate-100 to-emerald-200/90 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(16,185,129,0.3)]">
                ROSHSPARK CRICKET STADIUM
              </span>
            </h1>
          </div>

          {/* Interactive 3D Stadium Camera Indicator at Base */}
          <div className="absolute bottom-6 sm:bottom-8 z-10 pointer-events-none flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/5 text-slate-400 text-[10px] sm:text-[11px] font-mono select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>INTERACTIVE 3D VIEW • MOVE CURSOR TO EXPLORE ARENA</span>
          </div>


        </section>
        {/* END: Hero3DStadium */}

        
      </main>

      {/* BEGIN: MinimalFooter */}
      
      {/* END: MinimalFooter */}
    </>
  );
}
