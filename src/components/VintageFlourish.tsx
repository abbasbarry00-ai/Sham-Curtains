import React from 'react';

// Default export: Center heading flourish/medallion
export default function VintageFlourish() {
  return (
    <div className="vintage-flourish" aria-hidden="true" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <svg width="220" height="20" viewBox="0 0 220 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '15px auto', display: 'block' }}>
        {/* Left elegant swirly line */}
        <path d="M10 10 C 35 10, 45 4, 60 7 C 75 10, 85 13, 100 10" stroke="var(--accent, #AD8B4A)" strokeWidth="1.2" strokeLinecap="round" />
        
        {/* Right elegant swirly line */}
        <path d="M210 10 C 185 10, 175 4, 160 7 C 145 10, 135 13, 120 10" stroke="var(--accent, #AD8B4A)" strokeWidth="1.2" strokeLinecap="round" />
        
        {/* Center floral leaf crown/ornament */}
        <path d="M110 3 C 110 3, 107 8, 102 9 C 99 10, 96 9, 97 11 C 98 13, 102 12, 104 14 C 107 16, 110 15, 110 15 C 110 15, 113 16, 116 14 C 118 12, 122 13, 123 11 C 124 9, 121 10, 118 9 C 113 8, 110 3, 110 3 Z" fill="var(--accent, #AD8B4A)" />
        
        {/* Small detail leaf arches */}
        <path d="M105 10 Q 110 13 115 10" stroke="var(--accent, #AD8B4A)" strokeWidth="1" fill="none" />
        
        {/* Decorative small circles/diamonds */}
        <circle cx="110" cy="10" r="1.5" fill="var(--accent, #AD8B4A)" />
        <circle cx="95" cy="10" r="1" fill="var(--accent, #AD8B4A)" />
        <circle cx="125" cy="10" r="1" fill="var(--accent, #AD8B4A)" />
        <circle cx="78" cy="9.5" r="0.8" fill="var(--accent, #AD8B4A)" />
        <circle cx="142" cy="9.5" r="0.8" fill="var(--accent, #AD8B4A)" />
      </svg>
    </div>
  );
}

// Elegant section divider with gradient lines and scroll center
export function VintageDivider() {
  return (
    <div className="vintage-divider" aria-hidden="true">
      <div className="divider-line left-line"></div>
      <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="divider-center">
        <path d="M5 10 C15 10, 20 4, 30 10 C40 4, 45 10, 55 10" stroke="var(--accent, #AD8B4A)" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="30" cy="10" r="2.5" fill="var(--accent, #AD8B4A)" />
        <circle cx="20" cy="10" r="1.2" fill="var(--accent, #AD8B4A)" />
        <circle cx="40" cy="10" r="1.2" fill="var(--accent, #AD8B4A)" />
      </svg>
      <div className="divider-line right-line"></div>
    </div>
  );
}

// Large backdrop watermark medallion/crest (3% opacity)
export function VintageWatermark() {
  return (
    <div className="vintage-watermark" aria-hidden="true">
      <svg width="420" height="420" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="210" cy="210" r="160" stroke="var(--accent, #AD8B4A)" strokeWidth="0.8" strokeDasharray="3 4" />
        <circle cx="210" cy="210" r="100" stroke="var(--accent, #AD8B4A)" strokeWidth="0.6" />
        <circle cx="210" cy="210" r="190" stroke="var(--accent, #AD8B4A)" strokeWidth="0.5" strokeDasharray="8 6" />
        
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12;
          return (
            <g key={i} transform={`rotate(${angle} 210 210)`}>
              <line x1="210" y1="210" x2="210" y2="110" stroke="var(--accent, #AD8B4A)" strokeWidth="0.6" />
              <path d="M 210 130 L 206 150 L 210 160 L 214 150 Z" fill="var(--accent, #AD8B4A)" opacity="0.4" />
              <circle cx="210" cy="95" r="1.8" fill="var(--accent, #AD8B4A)" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Side-floating vertical vine columns for the left/right screen edges on desktop
export function VintageSideVines() {
  const vineSvg = (
    <svg width="35" height="500" viewBox="0 0 35 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 0 V500" stroke="var(--accent, #AD8B4A)" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.25" />
      
      {/* Scroll branches */}
      <path d="M17 40 Q30 50 30 65 T17 80" stroke="var(--accent, #AD8B4A)" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="30" cy="65" r="1.2" fill="var(--accent, #AD8B4A)" opacity="0.6" />
      <path d="M17 120 Q5 130 5 145 T17 160" stroke="var(--accent, #AD8B4A)" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="5" cy="145" r="1.2" fill="var(--accent, #AD8B4A)" opacity="0.6" />
      <path d="M17 200 Q30 210 30 225 T17 240" stroke="var(--accent, #AD8B4A)" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="30" cy="225" r="1.2" fill="var(--accent, #AD8B4A)" opacity="0.6" />
      <path d="M17 280 Q5 290 5 305 T17 320" stroke="var(--accent, #AD8B4A)" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="5" cy="305" r="1.2" fill="var(--accent, #AD8B4A)" opacity="0.6" />
      <path d="M17 360 Q30 370 30 385 T17 400" stroke="var(--accent, #AD8B4A)" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="30" cy="385" r="1.2" fill="var(--accent, #AD8B4A)" opacity="0.6" />
      <path d="M17 440 Q5 450 5 465 T17 480" stroke="var(--accent, #AD8B4A)" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="5" cy="465" r="1.2" fill="var(--accent, #AD8B4A)" opacity="0.6" />
      
      {/* Leaves */}
      <path d="M17 60 C24 58 26 52 22 48 C18 50 17 56 17 60 Z" fill="var(--accent, #AD8B4A)" opacity="0.35" />
      <path d="M17 140 C10 138 8 132 12 128 C16 130 17 136 17 140 Z" fill="var(--accent, #AD8B4A)" opacity="0.35" />
      <path d="M17 220 C24 218 26 212 22 208 C18 210 17 216 17 220 Z" fill="var(--accent, #AD8B4A)" opacity="0.35" />
      <path d="M17 300 C10 298 8 292 12 288 C16 290 17 296 17 300 Z" fill="var(--accent, #AD8B4A)" opacity="0.35" />
      <path d="M17 380 C24 378 26 372 22 368 C18 370 17 376 17 380 Z" fill="var(--accent, #AD8B4A)" opacity="0.35" />
      <path d="M17 460 C10 458 8 452 12 448 C16 450 17 456 17 460 Z" fill="var(--accent, #AD8B4A)" opacity="0.35" />
    </svg>
  );

  return (
    <div className="vintage-side-vines-container" aria-hidden="true">
      <div className="vintage-side-vine vine-left">{vineSvg}</div>
      <div className="vintage-side-vine vine-right" style={{ transform: 'scaleX(-1)' }}>{vineSvg}</div>
    </div>
  );
}

// Delicate L-shaped corner scroll ornament for boxes and cards
interface VintageCornerProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function VintageCorner({ position }: VintageCornerProps) {
  const getStyle = () => {
    switch (position) {
      case 'top-left':
        return { top: '6px', left: '6px' };
      case 'top-right':
        return { top: '6px', right: '6px', transform: 'scaleX(-1)' };
      case 'bottom-left':
        return { bottom: '6px', left: '6px', transform: 'scaleY(-1)' };
      case 'bottom-right':
        return { bottom: '6px', right: '6px', transform: 'scale(-1)' };
    }
  };

  return (
    <div 
      className={`vintage-corner vintage-corner--${position}`} 
      aria-hidden="true" 
      style={{ 
        position: 'absolute', 
        width: '24px', 
        height: '24px', 
        pointerEvents: 'none', 
        zIndex: 2,
        opacity: 0.65,
        ...getStyle() 
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 22 V2 Q2 2 22 2" stroke="var(--accent, #AD8B4A)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M5 18 V5 Q5 5 18 5" stroke="var(--accent, #AD8B4A)" strokeWidth="0.8" strokeDasharray="1 1.5" fill="none" />
        <circle cx="2" cy="2" r="1.5" fill="var(--accent, #AD8B4A)" />
        <circle cx="9" cy="2" r="0.8" fill="var(--accent, #AD8B4A)" />
        <circle cx="2" cy="9" r="0.8" fill="var(--accent, #AD8B4A)" />
      </svg>
    </div>
  );
}
