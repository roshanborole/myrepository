"use client";

import { MULTI_CAMS } from '../data';

interface MultiCamGridProps {
  onSelectFeed: (url: string, name: string, label: string) => void;
  activeUrl?: string;
}

export default function MultiCamGrid({ onSelectFeed, activeUrl }: MultiCamGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-10 w-full" id="multiCamSection">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-widest text-red-500 font-bold">LIVE STADIUM FEED GRID</span>
          </div>
          <h3 className="font-sans text-xl md:text-2xl text-white font-bold tracking-tight uppercase">
            SYNCHRONOUS MULTI-CAM EXPERIENCE
          </h3>
        </div>
        <div className="flex items-center gap-2 text-slate-300 font-mono text-xs">
          <span className="px-2.5 py-1 rounded bg-[#1e2024] text-emerald-400 font-bold border border-emerald-500/20">LATENCY: 0.38s</span>
          <span className="px-2.5 py-1 rounded bg-[#1e2024] border border-white/5">AUDIO: FIELD AMBIENCE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MULTI_CAMS.map((cam, idx) => {
          const isActive = activeUrl === cam.url;
          return (
            <div 
              key={cam.id}
              onClick={() => onSelectFeed(cam.url, cam.name, cam.label)}
              className={`group relative rounded-xl overflow-hidden shadow-lg transition-all cursor-pointer border ${isActive ? 'border-emerald-500 ring-1 ring-emerald-500/50 bg-[#1e2024]' : 'border-white/5 bg-[#16181c] hover:border-emerald-500/30'}`}
            >
              <div className="aspect-video w-full relative overflow-hidden bg-black">
                {/* Simulated Thumbnail for Cam Feed (using specific indices from design) */}
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" 
                  src={
                    idx === 0 ? "https://lh3.googleusercontent.com/aida-public/AB6AXuBe-WG2RSK1E662RumnnuBUm07DSNfec2iRPmRhsYpjQ42-ldohQHCEmD3DwsYeew_a7klJgenbTVxKAwb9-ArXm6w8xAeY1dR-Bf0vFsG4_P2EZd8DtkFXg57Db5njsrx44MjeITQhqyQZvSzn8-f5KZ6GLNXTpZxmZRvU3jb4Y8pdaSAnY8d79jV-_QJHNty4ROAgDsp1hzwi-glwnFLMctIKDg8pF-6Wr94XTWCgQLc4p-j_YXBbMg" :
                    idx === 1 ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAAO4IMylU3ncde-se6S0wvHO7ipmZN-UtBrKBfsI4-RHnNOdry9G1ZfjLT1oCp9-6qtD7RVmEVDssNJxRMYyH5vhbvTcRhLKoKPxpHAnPQTa-oc7Ptm6BSkXol_bhvQPfySHoFtw_mmgorD6kC8bxe5NowaS2Hv7G97xXMJHQIcFsP3efrqd9_Y23oER6OCdoj0zdBnYy0j1dAqRSWktK1AmkGCoPnWDOK54b7WOd_C3QJ3fWuEx7jpA" :
                    idx === 2 ? "https://lh3.googleusercontent.com/aida-public/AB6AXuCAxlo3L6PWzK9EEFxU6fV27Wf7Eosx4FtDccgI7XpL-iIEzcMxRJT04O_pAfhuI5q2aN9HWCATQ8twA1s8MZKRZg2iBmDXMUmRV_hz2PKPUhMELu9jRVA64_XnYwb3o540hBTMRuVxQsKAbKLbgicvJ18KduuC0caLLMopXA61nVaiOIcdwlW3evDi66D-WnlO-tcR0SfdUTZA-jfg_g4hFOpKQiAJMtCEEaxSdC7TVrsY1FRvha118Q" :
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDosBbp54KCXFpRNOx27M8oHbj18rryx9W072dV4DMybJdEoE4Whb2-k8a7fZA-G_VKkY8eV48-h8rHM8TzuReCyHErSpmlQIazqhJcvoedQe3LjPe1yVEgbs6CCRxidonC39D4jJ33UcfmzIuJre1q2VgM-Dp3AzmitTqaJ1PP9nUM8mxLjyrNA1yz6F4ZA8N8nbvHBR24lRtKBT0RMTrvYbJWHhfqUWuDaGIgfzs2JZ-3gPhh5a_C4g"
                  } 
                  alt={cam.name} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
                
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600/90 text-white font-mono text-[10px] tracking-widest uppercase shadow-md backdrop-blur">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span> LIVE
                </div>
                
                <span className="absolute bottom-3 right-3 font-mono text-[10px] text-slate-300 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur">
                  {cam.id.toUpperCase()}
                </span>

                {isActive && (
                  <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center pointer-events-none">
                    <span className="px-3 py-1 bg-black/80 text-emerald-400 font-mono text-[10px] tracking-widest rounded shadow-xl border border-emerald-500/30">CURRENT FEED</span>
                  </div>
                )}
              </div>
              <div className="p-3.5 bg-transparent flex items-center justify-between border-t border-white/5">
                <span className="font-sans text-sm text-white tracking-wide font-medium">{cam.name}</span>
                <svg className={`w-5 h-5 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-emerald-400'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
