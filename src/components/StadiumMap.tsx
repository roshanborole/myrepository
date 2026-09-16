'use client';

import React from 'react';

type Props = {
  interactive?: boolean;
  onStandClick?: (stand: string) => void;
  selectedStand?: string;
  highlightedSeats?: string[]; // E.g., ['A12']
};

export default function StadiumMap({ interactive = false, onStandClick, selectedStand, highlightedSeats }: Props) {
  // SVG constants
  const center = 250;

  // View descriptions based on stand
  const getStandView = (stand: string) => {
    switch (stand) {
      case 'North Stand':
      case 'South Stand':
        return "Behind the bowler's arm / Straight boundary";
      case 'East Stand':
      case 'West Stand':
        return "Side-on view of the pitch";
      case 'VIP Pavilion':
        return "Premium side-on view with hospitality";
      case 'Premium Stand':
        return "Excellent corner view of the ground";
      default:
        return "Great view of the stadium";
    }
  };

  const stands = [
    {
      id: 'North Stand',
      color: '#54e98a', // Green
      path: 'M 150 100 Q 250 50 350 100 L 330 130 Q 250 90 170 130 Z',
      pulsePos: { x: 250, y: 90 },
      textPos: { x: 250, y: 85 }
    },
    {
      id: 'South Stand',
      color: '#54e98a', // Green
      path: 'M 150 400 Q 250 450 350 400 L 330 370 Q 250 410 170 370 Z',
      pulsePos: { x: 250, y: 410 },
      textPos: { x: 250, y: 415 }
    },
    {
      id: 'West Stand',
      color: '#54e98a', // Green
      path: 'M 100 150 Q 50 250 100 350 L 130 330 Q 90 250 130 170 Z',
      pulsePos: { x: 90, y: 250 },
      textPos: { x: 85, y: 250 },
      textRotate: -90
    },
    {
      id: 'East Stand',
      color: '#54e98a', // Green
      path: 'M 400 150 Q 450 250 400 350 L 370 330 Q 410 250 370 170 Z',
      pulsePos: { x: 410, y: 250 },
      textPos: { x: 415, y: 250 },
      textRotate: 90
    },
    {
      id: 'VIP Pavilion',
      color: '#f1c40f', // Yellow
      path: 'M 150 100 Q 120 120 100 150 L 130 170 Q 150 150 170 130 Z',
      pulsePos: { x: 125, y: 125 },
      textPos: { x: 130, y: 130 },
      textRotate: -45
    },
    {
      id: 'Premium Stand',
      color: '#3498db', // Blue
      path: 'M 400 350 Q 380 380 350 400 L 330 370 Q 350 350 370 330 Z',
      pulsePos: { x: 375, y: 375 },
      textPos: { x: 370, y: 370 },
      textRotate: -45
    }
  ];

  return (
    <div className="relative w-full max-w-3xl aspect-square mx-auto flex items-center justify-center p-4">
      {/* Direction Labels */}
      <div className="absolute top-0 font-label-caps text-on-surface-variant tracking-widest text-sm z-10 bg-background/80 px-2 rounded">NORTH ↑</div>
      <div className="absolute bottom-0 font-label-caps text-on-surface-variant tracking-widest text-sm z-10 bg-background/80 px-2 rounded">SOUTH ↓</div>
      <div className="absolute left-0 -rotate-90 origin-center font-label-caps text-on-surface-variant tracking-widest text-sm z-10 bg-background/80 px-2 rounded">WEST ←</div>
      <div className="absolute right-0 rotate-90 origin-center font-label-caps text-on-surface-variant tracking-widest text-sm z-10 bg-background/80 px-2 rounded">EAST →</div>

      {/* SVG Map */}
      <svg className="w-full h-full relative z-20" viewBox="0 0 500 500">
        
        {/* Grass Background / Field */}
        <ellipse cx="250" cy="250" rx="180" ry="180" fill="#2d4a36" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.3" />
        
        {/* 30 Yard Circle (Inner Circle) */}
        <ellipse cx="250" cy="250" rx="90" ry="90" fill="none" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="5,5" />
        
        {/* Cricket Pitch */}
        <rect x="235" y="200" width="30" height="100" fill="#e0cda5" rx="2" />
        {/* Creases */}
        <line x1="230" y1="210" x2="270" y2="210" stroke="#ffffff" strokeWidth="1" />
        <line x1="230" y1="290" x2="270" y2="290" stroke="#ffffff" strokeWidth="1" />
        <line x1="235" y1="200" x2="235" y2="300" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.5" />
        <line x1="265" y1="200" x2="265" y2="300" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.5" />
        {/* Wickets */}
        <line x1="247" y1="205" x2="253" y2="205" stroke="#ffffff" strokeWidth="2" />
        <line x1="247" y1="295" x2="253" y2="295" stroke="#ffffff" strokeWidth="2" />
        
        <text dominantBaseline="middle" fill="#ffffff" fontFamily="JetBrains Mono" fontSize="10" fontWeight="bold" letterSpacing="0.1em" textAnchor="middle" x="250" y="250" transform="rotate(-90 250 250)">PITCH</text>

        {/* Stands */}
        {stands.map((stand) => {
          const isSelected = selectedStand === stand.id;
          const isDimmed = selectedStand && !isSelected;
          
          return (
            <g 
              key={stand.id} 
              className={`
                transition-all duration-300 origin-center
                ${interactive ? 'cursor-pointer hover:scale-[1.02]' : ''}
                ${isDimmed ? 'opacity-30' : 'opacity-90 hover:opacity-100'}
              `}
              onClick={() => {
                if (interactive && onStandClick) onStandClick(stand.id);
              }}
            >
              <path 
                d={stand.path} 
                fill={isSelected ? stand.color : '#282a2e'} 
                stroke={stand.color} 
                strokeWidth={isSelected ? "0" : "2"}
                className="transition-colors duration-300"
              />
              <text 
                x={stand.textPos.x} 
                y={stand.textPos.y} 
                fill={isSelected ? '#121212' : stand.color} 
                fontSize="12" 
                fontFamily="system-ui" 
                fontWeight="700" 
                textAnchor="middle" 
                dominantBaseline="middle"
                transform={stand.textRotate ? `rotate(${stand.textRotate} ${stand.textPos.x} ${stand.textPos.y})` : ''}
                className="pointer-events-none transition-colors duration-300"
              >
                {stand.id}
              </text>

              {/* Pulse marker for selected seat inside this stand */}
              {isSelected && highlightedSeats && highlightedSeats.length > 0 && (
                <g transform={`translate(${stand.pulsePos.x}, ${stand.pulsePos.y})`}>
                  <circle r="8" fill="#3b82f6" className="animate-ping opacity-75" />
                  <circle r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                  {/* Connection line to pitch */}
                  <line 
                    x1="0" 
                    y1="0" 
                    x2={250 - stand.pulsePos.x} 
                    y2={250 - stand.pulsePos.y} 
                    stroke="#3b82f6" 
                    strokeWidth="1" 
                    strokeDasharray="4,4" 
                    strokeOpacity="0.5" 
                  />
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* View Information Panel (shown when a stand is selected) */}
      {selectedStand && (
        <div className="absolute bottom-12 right-4 bg-surface-container-highest/90 backdrop-blur border border-white/10 p-4 rounded-xl shadow-2xl z-30 max-w-[200px] animate-fade-in">
          <div className="font-label-caps text-xs text-primary uppercase tracking-widest mb-1">View Info</div>
          <div className="font-headline-sm text-on-surface mb-2 leading-tight">{selectedStand}</div>
          <div className="font-body-sm text-sm text-on-surface-variant leading-snug">
            &ldquo;{getStandView(selectedStand)}&rdquo;
          </div>
        </div>
      )}
    </div>
  );
}
