"use client";
import Link from 'next/link';
import { useState } from 'react';
import BackButton from '@/components/BackButton';

export default function Page() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  if (selectedArticleId) {
    return (
      <main className="w-full pt-20 bg-background min-h-screen">
        <div className="max-w-4xl mx-auto px-container-padding py-section-gap">
          <div className="mb-8">
            <BackButton onClick={() => setSelectedArticleId(null)} label="Back to News" />
          </div>
          
          <article className="bg-surface-container rounded-2xl p-8 lg:p-12 shadow-2xl">
            <div className="flex flex-wrap items-center gap-3 text-on-surface-variant font-label-caps text-label-caps mb-6">
              <span className="text-primary font-semibold">STADIUM INFRASTRUCTURE</span>
              <span>•</span>
              <span>OCT 12, 2024</span>
              <span>•</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> 4 MIN READ</span>
            </div>
            
            <h1 className="font-headline-lg text-4xl lg:text-5xl text-on-background tracking-tight leading-snug mb-8">
              RoshSpark Unveils Next-Gen LED Floodlight Array Ahead of RPL Season 5 Opener
            </h1>
            
            <div className="w-full h-[400px] rounded-xl overflow-hidden mb-10">
              <img alt="RoshSpark Stadium Floodlight" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1XvBHQTzGyVyfV-y0KCVF0XIVJw_-2lTZowWJL_iWt-ZklMwhjDjmDFTZPREiPkc_yizf63A9PABALXe_ylm9XbLwHRXvKdSpMMjuS1MvrfI_DQtvCR_HEZ7De3aOicyQY6BNZzPFif2y0RjM75t7XDjHnTd1VZDWLDW9etCgLKO0j1RtZk79fUCUB7htnONY82axGfS--vxinXb_O0-vxqLOQu86daG2NspPZR76xSceph6mNTwR_Z1Gnn" />
            </div>
            
            <div className="prose prose-invert prose-emerald max-w-none font-body-lg text-on-surface-variant leading-relaxed space-y-6">
              <p>The venue completes a 3,200 lux dual-spectrum illumination overhaul designed to enhance night broadcast fidelity, eliminate deep shadowing on short deliveries, and optimize spectator field immersion.</p>
              <p>This major upgrade comes just in time for the highly anticipated RPL Season 5, ensuring that RoshSpark Cricket Stadium remains at the cutting edge of sports entertainment technology.</p>
            </div>
          </article>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="w-full pt-20 bg-background"><div className="flex flex-col w-full">
{/* Active Nav Highlighter via Inline Script */}

{/* Editorial Hero & Ambient Atmosphere */}
<section className="relative w-full overflow-hidden bg-surface-container-lowest pt-stack-lg pb-16">
{/* Stadium Ray Floodlight Ambient Gradient */}
<div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[480px] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-3xl opacity-70"></div>
<div className="pointer-events-none absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full"></div>
<div className="relative max-w-7xl mx-auto px-container-padding">
{/* Top Meta Breadcrumb & Category Pulse */}
<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high/90 backdrop-blur-md">
<span className="relative flex h-2 w-2">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
</span>
<span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">OFFICIAL MEDIA &amp; PRESS CENTER</span>
</div>
<div className="flex items-center gap-3 text-on-surface-variant font-label-caps text-label-caps">
<span className="inline-block w-2 h-2 rounded-full bg-primary/40"></span>
<span>ROSHSPARK NEWSROOM DISPATCH</span>
<span className="text-tertiary">/</span>
<span className="text-on-surface">EDITION 24.10</span>
</div>
</div>
{/* Hero Header & Editorial Introduction */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
<div className="max-w-3xl">
<h1 className="font-headline-lg text-headline-lg text-on-background tracking-tight">
            STADIUM DISPATCH <span className="text-primary">&amp;</span> NEWSROOM
          </h1>
<p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
            Real-time field advisories, infrastructure evolutions, curator turf analyses, and official statements straight from the elite home of RoshSpark Cricket.
          </p>
</div>
{/* Search Bar */}
<div className="w-full md:w-80 relative">
<div className="relative flex items-center bg-surface-container rounded-xl px-4 py-3 shadow-lg focus-within:ring-2 focus-within:ring-primary/40 transition-all">
<span className="material-symbols-outlined text-primary text-[20px] mr-3">search</span>
<input className="w-full bg-transparent text-on-background placeholder:text-on-surface-variant/60 font-body-md text-body-md focus:outline-none" id="newsSearch" placeholder="Search reports, turf briefs..." type="text" />
<span className="font-label-caps text-[10px] text-tertiary px-1.5 py-0.5 rounded bg-surface-container-high ml-2">ESC</span>
</div>
</div>
</div>
{/* Quick Filter Pills */}
<div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none" id="filterTabs">
<button className="filter-btn active px-4 py-2 rounded-full font-label-caps text-label-caps uppercase bg-primary text-on-primary transition-all" data-category="all">All News</button>
<button className="filter-btn px-4 py-2 rounded-full font-label-caps text-label-caps uppercase bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all" data-category="reports">Match Reports</button>
<button className="filter-btn px-4 py-2 rounded-full font-label-caps text-label-caps uppercase bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all" data-category="pitch">Stadium &amp; Pitch</button>
<button className="filter-btn px-4 py-2 rounded-full font-label-caps text-label-caps uppercase bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all" data-category="ticketing">Ticketing &amp; Fan Info</button>
<button className="filter-btn px-4 py-2 rounded-full font-label-caps text-label-caps uppercase bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all" data-category="tournament">Tournament &amp; RPL</button>
<button className="filter-btn px-4 py-2 rounded-full font-label-caps text-label-caps uppercase bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all" data-category="press">Press Releases</button>
</div>
{/* Main Lead Editorial Card (Split Showcase) */}
<div className="mt-4 rounded-xl bg-surface-container-low overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-primary/5">
<div className="grid grid-cols-1 lg:grid-cols-12">
{/* Left Visual (Lead Media) */}
<div className="relative lg:col-span-7 min-h-[380px] lg:min-h-[500px] overflow-hidden group">
<img alt="RoshSpark Stadium Floodlight Array Arena" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida/AEtjO1XvBHQTzGyVyfV-y0KCVF0XIVJw_-2lTZowWJL_iWt-ZklMwhjDjmDFTZPREiPkc_yizf63A9PABALXe_ylm9XbLwHRXvKdSpMMjuS1MvrfI_DQtvCR_HEZ7De3aOicyQY6BNZzPFif2y0RjM75t7XDjHnTd1VZDWLDW9etCgLKO0j1RtZk79fUCUB7htnONY82axGfS--vxinXb_O0-vxqLOQu86daG2NspPZR76xSceph6mNTwR_Z1Gnn" />
{/* Floodlight Overlay Gradient Scrim */}
<div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-surface-container-low/30 lg:to-surface-container-low"></div>
<div className="absolute top-6 left-6 flex items-center gap-3">
<span className="px-3 py-1 rounded-full font-label-caps text-[11px] font-bold bg-primary text-on-primary uppercase tracking-wider shadow-lg">
                Lead Story
              </span>
<span className="px-3 py-1 rounded-full font-label-caps text-[11px] bg-surface-container-lowest/80 text-primary backdrop-blur-md flex items-center gap-1.5">
<span className="material-symbols-outlined text-[14px]">bolt</span> 3,200 LUX UPGRADE
              </span>
</div>
{/* Bottom Floating Crest Watermark */}
<div className="absolute bottom-4 left-6 hidden sm:flex items-center gap-3 bg-surface-container-lowest/70 backdrop-blur-md px-3 py-1.5 rounded-lg">
<img alt="RoshSpark Crest" className="w-5 h-5 object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1UHm9ToIPCccdEAV_18zWWit8NRLDXuuiVhqQqh9t6x-MHqs5YbS5uDPSNrw1-9amYX1tGgTLUyQhQKKjVMtZWj8szLcy5DjeEK8vYHJX4ZL0cinMM5UUYfGX6YrjyGJJtVi1ran8XoS22pE6U3qU2NHJFFtT9GMMggjDgbJ4XIp06HTVbcqi_ap47rf8kbtImk7Q56w-VprtSTOQI4kar_PtjKYxgiGjDgv1MVFN3f3mr4eG4QtQCdhzoK" />
<span className="font-label-caps text-[11px] text-tertiary">ENGINEERING WING BULLETIN</span>
</div>
</div>
{/* Right Content Column */}
<div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between bg-surface-container-low">
<div className="space-y-4">
{/* Meta Tags */}
<div className="flex flex-wrap items-center gap-3 text-on-surface-variant font-label-caps text-label-caps">
<span className="text-primary font-semibold">STADIUM INFRASTRUCTURE</span>
<span>•</span>
<span>OCT 12, 2024</span>
<span>•</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> 4 MIN READ</span>
</div>
{/* Main Title */}
<h2 
  onClick={() => setSelectedArticleId('1')}
  className="font-headline-lg text-headline-lg text-on-background tracking-tight leading-snug hover:text-primary transition-colors cursor-pointer"
>
                RoshSpark Unveils Next-Gen LED Floodlight Array Ahead of RPL Season 5 Opener
              </h2>
{/* Summary */}
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                The venue completes a 3,200 lux dual-spectrum illumination overhaul designed to enhance night broadcast fidelity, eliminate deep shadowing on short deliveries, and optimize spectator field immersion.
              </p>
{/* Technical Metric Callout Box */}
<div className="grid grid-cols-2 gap-3 pt-2">
<div className="p-3.5 rounded-lg bg-surface-container">
<div className="font-label-caps text-[11px] text-on-surface-variant">COLOR TEMP RANGE</div>
<div className="font-headline-md text-headline-md text-primary mt-1">5600K <span className="text-[14px] text-on-surface-variant font-normal">CRI 95+</span></div>
</div>
<div className="p-3.5 rounded-lg bg-surface-container">
<div className="font-label-caps text-[11px] text-on-surface-variant">POWER EFFICIENCY</div>
<div className="font-headline-md text-headline-md text-on-surface mt-1">-38% <span className="text-[14px] text-primary font-normal">ECO-SAVE</span></div>
</div>
</div>
</div>
{/* Author info and interactive actions */}
<div className="pt-8 flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-headline-md text-[16px]">
                  SE
                </div>
<div>
<div className="font-headline-md text-[14px] text-on-surface">Stadium Operations &amp; Eng.</div>
<div className="font-label-caps text-[11px] text-on-surface-variant">Infrastructure Directorate</div>
</div>
</div>
<div className="flex items-center gap-2">
<button aria-label="Bookmark" className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[18px]">bookmark</span>
</button>
<button aria-label="Share" className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[18px]">share</span>
</button>
<a className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary font-headline-md text-[14px] hover:bg-primary-fixed-dim transition-all shadow-md" href="#">
<span>Read Full Release</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
{/* Trending & Category-Segmented News Grid */}
<section className="w-full py-16 bg-surface">
<div className="max-w-7xl mx-auto px-container-padding">
{/* Section Title & Status Indicator */}
<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
<div>
<div className="flex items-center gap-2 font-label-caps text-label-caps text-primary uppercase">
<span className="material-symbols-outlined text-[16px]">newspaper</span>
<span>PRESS RELEASES &amp; DISPATCHES</span>
</div>
<h2 className="font-headline-lg text-headline-lg text-on-background mt-1">
            Latest Tracked Bulletins
          </h2>
</div>
<div className="flex items-center gap-3">
<span className="font-label-caps text-label-caps text-on-surface-variant">DISPLAYING: 6 RECENT ANNOUNCEMENTS</span>
<span className="w-2 h-2 rounded-full bg-primary"></span>
</div>
</div>
{/* 3-Column Responsive Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{/* Card 1: Record Crowd */}
<article className="news-card flex flex-col justify-between rounded-xl bg-surface-container-low overflow-hidden hover:-translate-y-1.5 transition-all duration-300 group shadow-lg">
<div>
<div className="relative h-52 overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="An expansive panoramic night view of RoshSpark cricket stadium packed with 55,000 cheering spectators waving green glowing light sticks under bright modern floodlights, with players visible on the pristine grass pitch." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSMad_HmJUdNCH5hze8DMpzDTKQgLMhenqyStJu16ALKYdj07BXSgjhcOHG0Bi3-KOc8xZw1OXOAzR3y9Rh4yJsOSAaLmgR_wZiXFBaPXKHnzjjMwMg8Pv0-RE-qkrd77LnavTGNkhAvqaKb9W1WLP3pw20F4oflj3vTmm2Q1r90Q2QUmcihmUE6ryNbkksvsZ9uk47Vsx3J6pHDWywnYVykLZV8R2N3TIPiQumV0hdNIV2MYLKXyWNA" />
<div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent"></div>
<span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-error-container text-on-error-container font-label-caps text-[11px] font-bold uppercase tracking-wider">
                High Demand
              </span>
<span className="absolute bottom-3 right-4 font-label-caps text-[11px] text-tertiary bg-surface-container-lowest/80 px-2 py-0.5 rounded backdrop-blur">
                MATCH PREVIEW
              </span>
</div>
<div className="p-6">
<div className="flex items-center gap-2 font-label-caps text-[11px] text-on-surface-variant mb-2">
<span>OCT 11, 2024</span>
<span>•</span>
<span>3 MIN READ</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-background group-hover:text-primary transition-colors leading-snug line-clamp-2">
                Record 55,000 Capacity Crowd Expected for High-Stakes Clash
              </h3>
<p className="font-body-md text-body-md text-on-surface-variant mt-2 line-clamp-2">
                General admission stands hit instant sellout inside 42 minutes, prompting stadium management to activate standby overflow zones.
              </p>
</div>
</div>
<div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-white/5">
<span className="font-label-caps text-label-caps text-primary uppercase">Tickets Exhausted</span>
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
</div>
</article>
{/* Card 2: Curator Pitch Report */}
<article className="news-card flex flex-col justify-between rounded-xl bg-surface-container-low overflow-hidden hover:-translate-y-1.5 transition-all duration-300 group shadow-lg">
<div>
<div className="relative h-52 overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A close-up cinematic shot of a meticulously prepared cricket pitch turf at RoshSpark stadium, with the head curator checking grass moisture and compaction under natural sunlight, showing crisp white boundary creases and pitch rolling equipment in the blurred background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6XV1kdrZAqr7ZDLj6hcQRJ5oQnzE_iDWnP0CLvGYpxjg3lZbZKdYJjDTjoe3OKA3seoy4m3mGSebqpLGcpdci6bNQrBKYYkHbFjXJ8OT9_Q80FRLuDqvyOSlw4LWrY10du4sL5uoosgX41UzVeM1dkj8_IbvNQuQ8ta88H-OsBu63fKUvqBi77QeffAvmccFwQNJFkEYGZonwzEsGF5jiIzfu1ctBx2lgkWTehXlsBavlGXJCxFw4bQ" />
<div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent"></div>
<span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-primary-container text-on-primary-container font-label-caps text-[11px] font-bold uppercase tracking-wider">
                Pitch &amp; Conditions
              </span>
<div className="absolute bottom-3 left-4 flex items-center gap-2 bg-surface-container-lowest/80 px-2.5 py-1 rounded backdrop-blur font-label-caps text-[11px] text-primary">
<span className="material-symbols-outlined text-[14px]">speed</span> AVG 1ST INNINGS: 194
              </div>
</div>
<div className="p-6">
<div className="flex items-center gap-2 font-label-caps text-[11px] text-on-surface-variant mb-2">
<span>OCT 10, 2024</span>
<span>•</span>
<span>5 MIN READ</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-background group-hover:text-primary transition-colors leading-snug line-clamp-2">
                Curator Report: Dry Hard Turf Geared for High-Scoring Thrillers
              </h3>
<p className="font-body-md text-body-md text-on-surface-variant mt-2 line-clamp-2">
                Head groundsman verifies minimal grass cover on pitch track #4, ensuring true bounce and rapid outfield speeds favorable for attacking stroke-play.
              </p>
</div>
</div>
<div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-white/5">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Analysis Note #19</span>
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
</div>
</article>
{/* Card 3: VIP Pavilion Hospitality */}
<article className="news-card flex flex-col justify-between rounded-xl bg-surface-container-low overflow-hidden hover:-translate-y-1.5 transition-all duration-300 group shadow-lg">
<div>
<div className="relative h-52 overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Interior luxury VIP corporate hospitality lounge at RoshSpark stadium featuring sleek obsidian black leather seats, emerald mood lighting along ceiling recesses, VIP executive counter, and floor-to-ceiling glass windows overlooking the illuminated stadium pitch." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCM86ulKkYiBkee88w1LY0PLj5e8M2yONQNktWMgYmyqffNRXBOHlI3VMmk7HtWNfsAWS545J1snzLgBBLVy0H6M9Yuxm-eKNR-u8S2_nX86lbG89PNIpFmNlzkqtBeHd_x5X0DX1GM1uYWlh0gbuPzIuNN0-QmPyAixf8mSLLgNsqkWiBBBhOfMeHMJs4J13Dhf9TOF0kcB-j1GGMLTu2aPIn3j4bIjmk1XZ-zDmEOaZsUL_bU5KvMPg" />
<div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent"></div>
<span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container font-label-caps text-[11px] font-bold uppercase tracking-wider">
                Fan Experience
              </span>
<span className="absolute bottom-3 right-4 font-label-caps text-[11px] text-tertiary bg-surface-container-lowest/80 px-2 py-0.5 rounded backdrop-blur">
                HOSPITALITY
              </span>
</div>
<div className="p-6">
<div className="flex items-center gap-2 font-label-caps text-[11px] text-on-surface-variant mb-2">
<span>OCT 08, 2024</span>
<span>•</span>
<span>3 MIN READ</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-background group-hover:text-primary transition-colors leading-snug line-clamp-2">
                New VIP Pavilion Hospitality Suites Open for Premier League Bookings
              </h3>
<p className="font-body-md text-body-md text-on-surface-variant mt-2 line-clamp-2">
                Sixteen private corporate suites featuring chef-curated banquet service and premium balcony vantage points are now unlocked for reservation.
              </p>
</div>
</div>
<div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-white/5">
<span className="font-label-caps text-label-caps text-primary uppercase">Explore Suites</span>
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
</div>
</article>
{/* Card 4: ICC Elite Audit */}
<article className="news-card flex flex-col justify-between rounded-xl bg-surface-container-low overflow-hidden hover:-translate-y-1.5 transition-all duration-300 group shadow-lg">
<div>
<div className="relative h-52 overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Official cricket technical committee inspectors holding clipboards and digital measuring tablets at mid-wicket on RoshSpark Stadium, inspecting sight screens and digital boundary LED boards under clear daylight." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgGjlv69ioiJjEzAsI87oNFDtGwcJ1yDsLNIuiTTLnGLkAdkoLTGt0sVqLHKARpaS9GAYeR4SXv2Gt8we_gfBdJ_shA3v0v70yEhwUoWo_gLbXEUkA8rjb15I6SD-zRp55lioR8iFWdrJ2JKADwK-0z6OEabm5QVxWFAobjXBsJ2m5VwCEfYnhyeBgnhHtBE7DbWrruPO9-kXzShU4r5IZXEr-s4ygXFq_F9pAn1McDCjJmgXiPDiqcQ" />
<div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent"></div>
<span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-surface-container-high text-primary font-label-caps text-[11px] font-bold uppercase tracking-wider">
                Compliance &amp; Accreditations
              </span>
<span className="absolute bottom-3 right-4 font-label-caps text-[11px] text-tertiary bg-surface-container-lowest/80 px-2 py-0.5 rounded backdrop-blur">
                GOVERNANCE
              </span>
</div>
<div className="p-6">
<div className="flex items-center gap-2 font-label-caps text-[11px] text-on-surface-variant mb-2">
<span>OCT 04, 2024</span>
<span>•</span>
<span>4 MIN READ</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-background group-hover:text-primary transition-colors leading-snug line-clamp-2">
                Official ICC Elite Category-1 Audit Successfully Concluded
              </h3>
<p className="font-body-md text-body-md text-on-surface-variant mt-2 line-clamp-2">
                Independent panel awards RoshSpark highest marks for drainage recovery systems, anti-doping facilities, and DRS camera calibration sightlines.
              </p>
</div>
</div>
<div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-white/5">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Full Report Available</span>
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
</div>
</article>
{/* Card 5: Green Solar Energy */}
<article className="news-card flex flex-col justify-between rounded-xl bg-surface-container-low overflow-hidden hover:-translate-y-1.5 transition-all duration-300 group shadow-lg">
<div>
<div className="relative h-52 overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="An aerial high-tech architectural render of RoshSpark Cricket Stadium showing the sweeping curved East Stand roof outfitted with high-efficiency sleek black solar panels glistening under stadium floodlights and twilight sky." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQsxkOWFkRzmdXUYYCvwPWGZwhcQynO2JMmtDheF9x4uZ1dOBE7fO-bYpOvvGy62YNT2zNJBlRdiGjaI0w5ASFYC-NeOonXVbGVda70x2IqyjtiSyN19AsdLi0KCEwphKFnJDibl-QxiBjP7OHldlpcIPOWwgdk7vCEJ78Nr1uQEaQl2keo3HdO454yGvtyNdQadSBPExPGmqi62Seg53aJ9f2UU38Z5UEcIWPSe6eMbUpbkpY4_BEQw" />
<div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent"></div>
<span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-primary text-on-primary font-label-caps text-[11px] font-bold uppercase tracking-wider">
                Sustainability
              </span>
<span className="absolute bottom-3 right-4 font-label-caps text-[11px] text-primary bg-surface-container-lowest/80 px-2 py-0.5 rounded backdrop-blur flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">solar_power</span> 1.2MW OUTPUT
              </span>
</div>
<div className="p-6">
<div className="flex items-center gap-2 font-label-caps text-[11px] text-on-surface-variant mb-2">
<span>SEP 29, 2024</span>
<span>•</span>
<span>3 MIN READ</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-background group-hover:text-primary transition-colors leading-snug line-clamp-2">
                Green Energy Initiative: RoshSpark Deploys 1.2MW Solar Canopy on East Stand
              </h3>
<p className="font-body-md text-body-md text-on-surface-variant mt-2 line-clamp-2">
                Landmark clean energy initiative offsets 64% of baseline arena power requirements, solidifying RoshSpark as one of the world&apos;s most sustainable sporting complexes.
              </p>
</div>
</div>
<div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-white/5">
<span className="font-label-caps text-label-caps text-primary uppercase">Read ESG Paper</span>
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
</div>
</article>
{/* Card 6: QR Ticketing Fan Guide */}
<article className="news-card flex flex-col justify-between rounded-xl bg-surface-container-low overflow-hidden hover:-translate-y-1.5 transition-all duration-300 group shadow-lg">
<div>
<div className="relative h-52 overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A smartphone held by a cricket fan displaying a glowing dynamic NFC QR ticket passing over an automated turnstile scanner at RoshSpark Stadium entrance gate, with stadium concourse and glowing green signage in background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDClgYwGSiPkAUaGbF6a7XKcmbhrRm6CxFOmzupJmgFFWzopd_3rYlWS3fVYhpZgRn2E0C1eZIIewLYcJNJfYuXzCqT3UDtS3VDTVrHhBYkYLmukcZz3LIe8N19jZ_EFVJqz8BfwuyhofscBmrQeHcLBL901PNc2p0xaLe-g7OgkS8YlmZn_T5ftkNBF5IALevXYmcwWc3oFyncd2-T2OtiDbM2cjeowjiaUKFNmYvYEqqkkjPonlED4w" />
<div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent"></div>
<span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container font-label-caps text-[11px] font-bold uppercase tracking-wider">
                Fan Guide
              </span>
<span className="absolute bottom-3 right-4 font-label-caps text-[11px] text-tertiary bg-surface-container-lowest/80 px-2 py-0.5 rounded backdrop-blur">
                ADVISORY
              </span>
</div>
<div className="p-6">
<div className="flex items-center gap-2 font-label-caps text-[11px] text-on-surface-variant mb-2">
<span>SEP 25, 2024</span>
<span>•</span>
<span>2 MIN READ</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-background group-hover:text-primary transition-colors leading-snug line-clamp-2">
                Ticketing Advisory: Digital Entry QR Guidelines for Upcoming Derbies
              </h3>
<p className="font-body-md text-body-md text-on-surface-variant mt-2 line-clamp-2">
                Step-by-step instructions on offline wallet token verification, security lane allocation, and gate timing for seamless 10-second turnstile ingress.
              </p>
</div>
</div>
<div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-white/5">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">View Gates Map</span>
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
</div>
</article>
</div>
{/* Pagination / Load More Bar */}
<div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 rounded-xl bg-surface-container-low">
<span className="font-label-caps text-label-caps text-on-surface-variant">
          SHOWING <span className="text-on-background font-bold">1–6</span> OF 48 ARTICLES
        </span>
<div className="flex items-center gap-2">
<button className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-background hover:bg-surface-container-high transition-all text-label-caps font-label-caps">
            PREV
          </button>
<span className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-label-caps font-label-caps font-bold">1</span>
<button className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-background hover:bg-surface-container-high transition-all text-label-caps font-label-caps">2</button>
<button className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-background hover:bg-surface-container-high transition-all text-label-caps font-label-caps">3</button>
<span className="text-on-surface-variant px-1 font-label-caps">...</span>
<button className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-background hover:bg-surface-container-high transition-all text-label-caps font-label-caps">8</button>
<button className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-background hover:bg-surface-container-high transition-all text-label-caps font-label-caps">
            NEXT
          </button>
</div>
</div>
</div>
</section>
{/* Match Day Press Releases & Media Kit Section (Split Bento Layout) */}
<section className="w-full py-16 bg-surface-container-lowest">
<div className="max-w-7xl mx-auto px-container-padding">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
{/* Left: Official Media Downloads & Match Notes */}
<div className="lg:col-span-7 flex flex-col gap-6">
<div>
<div className="flex items-center gap-2 font-label-caps text-label-caps text-primary uppercase">
<span className="material-symbols-outlined text-[16px]">file_download</span>
<span>ACCREDITED JOURNALISTS &amp; BROADCAST DESK</span>
</div>
<h2 className="font-headline-lg text-headline-lg text-on-background mt-1">
              Match Day Media Kit &amp; Documents
            </h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Direct access to pre-match technical packages, referee designations, team press conference transcripts, and rights-holder assets.
            </p>
</div>
{/* Document List Group */}
<div className="flex flex-col gap-3">
{/* Doc 1 */}
<div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all group">
<div className="flex items-center gap-4 min-w-0">
<div className="w-12 h-12 rounded-lg bg-error-container/20 flex items-center justify-center text-error flex-shrink-0">
<span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
</div>
<div className="min-w-0">
<div className="font-headline-md text-[16px] text-on-background group-hover:text-primary transition-colors truncate">
                    Official RoshSpark Derby Match Notes &amp; Roster Sheets
                  </div>
<div className="flex items-center gap-2 text-[12px] font-label-caps text-on-surface-variant mt-0.5">
<span>PDF • 4.8 MB</span>
<span>•</span>
<span className="text-primary">RELEASED 2H AGO</span>
<span>•</span>
<span>VER 2.1</span>
</div>
</div>
</div>
<a className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary transition-all font-label-caps text-label-caps uppercase flex items-center gap-2 ml-4 flex-shrink-0" href="#">
<span className="material-symbols-outlined text-[16px]">download</span>
<span className="hidden sm:inline">Download</span>
</a>
</div>
{/* Doc 2 */}
<div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all group">
<div className="flex items-center gap-4 min-w-0">
<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
<span className="material-symbols-outlined text-[24px]">photo_library</span>
</div>
<div className="min-w-0">
<div className="font-headline-md text-[16px] text-on-background group-hover:text-primary transition-colors truncate">
                    Official RoshSpark 4K Stadium Photography &amp; Brand Assets
                  </div>
<div className="flex items-center gap-2 text-[12px] font-label-caps text-on-surface-variant mt-0.5">
<span>ZIP • 142 MB</span>
<span>•</span>
<span>ROYALTY-FREE EDITORIAL USE</span>
</div>
</div>
</div>
<a className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary transition-all font-label-caps text-label-caps uppercase flex items-center gap-2 ml-4 flex-shrink-0" href="#">
<span className="material-symbols-outlined text-[16px]">download</span>
<span className="hidden sm:inline">Download</span>
</a>
</div>
{/* Doc 3 */}
<div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all group">
<div className="flex items-center gap-4 min-w-0">
<div className="w-12 h-12 rounded-lg bg-secondary-container/30 flex items-center justify-center text-secondary flex-shrink-0">
<span className="material-symbols-outlined text-[24px]">calendar_month</span>
</div>
<div className="min-w-0">
<div className="font-headline-md text-[16px] text-on-background group-hover:text-primary transition-colors truncate">
                    Captain &amp; Coaching Staff Press Conference Timetable
                  </div>
<div className="flex items-center gap-2 text-[12px] font-label-caps text-on-surface-variant mt-0.5">
<span>PDF • 1.1 MB</span>
<span>•</span>
<span>MEDIA ROOM 2B</span>
</div>
</div>
</div>
<a className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary transition-all font-label-caps text-label-caps uppercase flex items-center gap-2 ml-4 flex-shrink-0" href="#">
<span className="material-symbols-outlined text-[16px]">download</span>
<span className="hidden sm:inline">Download</span>
</a>
</div>
{/* Doc 4 */}
<div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all group">
<div className="flex items-center gap-4 min-w-0">
<div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0">
<span className="material-symbols-outlined text-[24px]">badge</span>
</div>
<div className="min-w-0">
<div className="font-headline-md text-[16px] text-on-background group-hover:text-primary transition-colors truncate">
                    Seasonal Media Accreditation &amp; Dark-Period Pitch Access Rules
                  </div>
<div className="flex items-center gap-2 text-[12px] font-label-caps text-on-surface-variant mt-0.5">
<span>PDF • 820 KB</span>
<span>•</span>
<span>UPDATED OCT 2024</span>
</div>
</div>
</div>
<a className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary transition-all font-label-caps text-label-caps uppercase flex items-center gap-2 ml-4 flex-shrink-0" href="#">
<span className="material-symbols-outlined text-[16px]">download</span>
<span className="hidden sm:inline">Download</span>
</a>
</div>
</div>
</div>
{/* Right: Press Accreditation Card & Emergency Operations Desk */}
<div className="lg:col-span-5 flex flex-col gap-6">
{/* Accreditation Fast Pass */}
<div className="p-8 rounded-xl bg-gradient-to-br from-surface-container-high to-surface-container-low shadow-xl relative overflow-hidden">
<div className="absolute -right-10 -bottom-10 w-44 h-44 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
<div className="flex items-center justify-between mb-4">
<div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
<span className="material-symbols-outlined">badge</span>
</div>
<span className="font-label-caps text-[11px] px-2.5 py-1 rounded bg-primary/10 text-primary font-bold tracking-widest uppercase">
                PORTAL ACTIVE
              </span>
</div>
<h3 className="font-headline-md text-headline-md text-on-background mb-2">
              Media Accreditation Portal
            </h3>
<p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
              Applying for matchday press passes, broadcast box credentials, or pitch-side photo bibs? All requests must be lodged at least 48 hours prior to the toss.
            </p>
<div className="space-y-3 mb-6">
<div className="flex items-center gap-3 text-body-md text-on-surface">
<span className="material-symbols-outlined text-primary text-[18px]">verified</span>
<span>Fast-track ICC &amp; Board Affiliated Badges</span>
</div>
<div className="flex items-center gap-3 text-body-md text-on-surface">
<span className="material-symbols-outlined text-primary text-[18px]">wifi</span>
<span>Gigabit Media Center Dark-Fibre Dedicated LAN</span>
</div>
<div className="flex items-center gap-3 text-body-md text-on-surface">
<span className="material-symbols-outlined text-primary text-[18px]">videocam</span>
<span>Broadcast OB Van Tier-1 Hookup Bays</span>
</div>
</div>
<a className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-primary text-on-primary font-headline-md text-[14px] hover:bg-primary-fixed-dim transition-all shadow-lg" href="#">
<span>Apply for Match Accreditation</span>
<span className="material-symbols-outlined text-[18px]">open_in_new</span>
</a>
</div>
{/* Quick PR Contact Card */}
<div className="p-6 rounded-xl bg-surface-container-low flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
<span className="material-symbols-outlined">headset_mic</span>
</div>
<div>
<div className="font-headline-md text-[14px] text-on-surface">Press Officer Direct Line</div>
<div className="font-label-caps text-[12px] text-primary">press@roshsparkstadium.com</div>
</div>
</div>
<span className="font-label-caps text-[11px] text-tertiary bg-surface-container px-2.5 py-1 rounded">24/7 MATCHDAYS</span>
</div>
</div>
</div>
</div>
</section>
{/* Stadium Flash Fact Graphic Strip (Visual Richness) */}
<section className="w-full py-12 bg-surface-container border-y border-white/5">
<div className="max-w-7xl mx-auto px-container-padding">
<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
<div className="p-4">
<div className="font-label-caps text-label-caps text-on-surface-variant uppercase">BROADCAST AUDIENCE</div>
<div className="font-display-lg text-[42px] leading-tight text-on-background font-black mt-1">42.8M</div>
<div className="font-label-caps text-[11px] text-primary mt-1">GLOBAL REACH / DERBY</div>
</div>
<div className="p-4">
<div className="font-label-caps text-label-caps text-on-surface-variant uppercase">SUB-AIR DRAINAGE</div>
<div className="font-display-lg text-[42px] leading-tight text-primary font-black mt-1">15 MIN</div>
<div className="font-label-caps text-[11px] text-on-surface-variant mt-1">STORM TO MATCH-READY</div>
</div>
<div className="p-4">
<div className="font-label-caps text-label-caps text-on-surface-variant uppercase">BOUNDARY DISTANCE</div>
<div className="font-display-lg text-[42px] leading-tight text-on-background font-black mt-1">78.5M</div>
<div className="font-label-caps text-[11px] text-primary mt-1">MAX PITCH RADIUS</div>
</div>
<div className="p-4">
<div className="font-label-caps text-label-caps text-on-surface-variant uppercase">OFFICIAL MEDIA SEATS</div>
<div className="font-display-lg text-[42px] leading-tight text-on-background font-black mt-1">240</div>
<div className="font-label-caps text-[11px] text-on-surface-variant mt-1">LEVEL 4 PRESS BOX</div>
</div>
</div>
</div>
</section>
{/* Newsletter & Match Alerts Card (Interactive Subscription) */}
<section className="w-full py-20 bg-surface">
<div className="max-w-7xl mx-auto px-container-padding">
<div className="relative rounded-2xl bg-surface-container-low p-8 md:p-14 overflow-hidden shadow-2xl">
{/* Stadium Floodlight Ambient Background glow */}
<div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
<div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
<div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
<div className="lg:col-span-7">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-caps text-label-caps uppercase mb-4">
<span className="material-symbols-outlined text-[16px]">notifications_active</span>
<span>PRIORITY PRESS WIRE</span>
</div>
<h2 className="font-headline-lg text-headline-lg text-on-background tracking-tight">
              Get Match Reports &amp; Pitch Dispatches Directly
            </h2>
<p className="font-body-lg text-body-lg text-on-surface-variant mt-3 max-w-xl">
              Subscribe to official RoshSpark media dispatches, squad lineup drops, and urgent ground advisories 15 minutes before public broadcast.
            </p>
</div>
<div className="lg:col-span-5">
<form className="flex flex-col gap-3" id="subscribeForm" onSubmit={(e) => { e.preventDefault(); document.getElementById('subSuccess')?.classList.remove('hidden'); document.getElementById('subInputs')?.classList.add('hidden'); }}>
<div className="flex flex-col sm:flex-row gap-2" id="subInputs">
<input className="flex-1 bg-surface-container px-4 py-3.5 rounded-xl font-body-md text-body-md text-on-background placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner" placeholder="Enter editorial or fan email..." required type="email" />
<button className="px-6 py-3.5 rounded-xl bg-primary text-on-primary font-headline-md text-[14px] hover:bg-primary-fixed-dim transition-all shadow-lg flex items-center justify-center gap-2 font-semibold flex-shrink-0" type="submit">
<span>Subscribe</span>
<span className="material-symbols-outlined text-[18px]">send</span>
</button>
</div>
<div className="hidden p-4 rounded-xl bg-surface-container text-primary font-body-md text-body-md flex items-center gap-3" id="subSuccess">
<span className="material-symbols-outlined text-primary">check_circle</span>
<span>You&apos;re subscribed! RoshSpark official dispatches will arrive instantly.</span>
</div>
<p className="font-label-caps text-[11px] text-on-surface-variant">
                NO SPAM. UNSUBSCRIBE ANYTIME. ACCREDITED MEDIA DESK ENCRYPTION STANDARD.
              </p>
</form>
</div>
</div>
</div>
</div>
</section>
{/* Interactive JavaScript for Category Filtering and Live Search */}

</div></main>
    </>
  );
}
