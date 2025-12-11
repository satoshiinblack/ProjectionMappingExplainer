import React, { useState, useEffect, useRef } from 'react';
import { LayersIcon } from './Icons';

const InteractiveDemo: React.FC = () => {
  const [isProjectorOn, setIsProjectorOn] = useState(true);
  const [isWarped, setIsWarped] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);
  
  // Projector Position State (Draggable)
  const [projPos, setProjPos] = useState({ x: 150, y: 250 });
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Animation loop for the projection texture
  useEffect(() => {
    let animationId: number;
    const animate = () => {
      setAnimationFrame(prev => (prev + 1) % 100);
      animationId = requestAnimationFrame(animate);
    };
    if (isProjectorOn) {
      animate();
    }
    return () => cancelAnimationFrame(animationId);
  }, [isProjectorOn]);

  // Handle Dragging Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !svgRef.current) return;
    
    e.preventDefault();
    const svg = svgRef.current;
    const CTM = svg.getScreenCTM();
    
    if (CTM) {
      // Convert screen coordinates to SVG coordinates
      const svgX = (e.clientX - CTM.e) / CTM.a;
      const svgY = (e.clientY - CTM.f) / CTM.d;
      
      // Clamp coordinates to keep projector in the left area
      const clampedX = Math.max(60, Math.min(350, svgX));
      const clampedY = Math.max(60, Math.min(440, svgY));
      
      setProjPos({ x: clampedX, y: clampedY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Coordinates for the "Statue" (A low poly head silhouette)
  const statuePath = "M550,400 L550,300 L540,250 L550,200 L580,150 L620,150 L650,200 L660,250 L650,300 L650,400 Z";

  // Base Projection Screen (Target parameters on the statue plane)
  // The plane of projection is at x=520
  const baseRect = { x: 520, y: 130, w: 160, h: 300 };
  const baseProjPos = { x: 150, y: 250 }; // Reference position where size is exactly baseRect

  // --- Physics Calculation for Projection Cone ---
  const targetPlaneX = 520; // The X coordinate where the statue sits
  const refDistance = targetPlaneX - baseProjPos.x; // 370
  const currentDistance = targetPlaneX - projPos.x;
  
  // Throw Ratio Scale: Closer = Smaller image, Further = Larger image
  const scale = Math.max(0.1, currentDistance / refDistance);

  // Center point of the base projection
  const baseCenterX = baseRect.x + baseRect.w / 2;
  const baseCenterY = baseRect.y + baseRect.h / 2;

  // 1. Calculate Physical Projection Rect (The Projector's "Throw")
  // This represents the full area the projector *can* light up, based on optics.
  // It always scales with distance.
  const rawW = baseRect.w * scale;
  const rawH = baseRect.h * scale;
  const rawX = baseCenterX - (rawW / 2);
  const rawY = baseCenterY + (projPos.y - baseProjPos.y) - (rawH / 2);

  const rawRect = { x: rawX, y: rawY, w: rawW, h: rawH };

  // 2. Calculate Active Content Rect (Where the pixels are actually drawn)
  let contentRect;

  if (isWarped) {
    // Mapped Mode: Software compensates to match the target perfectly
    // The image size and position are locked to the statue
    contentRect = { ...baseRect };
  } else {
    // Raw Mode: The image fills the entire physical projection area
    contentRect = rawRect;
  }
  
  // Dynamic Pattern Logic
  // We use SVG pattern to simulate a video texture
  const offset = animationFrame * 2; 

  return (
    <div className="w-full max-w-5xl bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col md:flex-row select-none">
      
      {/* Visual Canvas */}
      <div className="relative w-full h-[400px] md:h-[500px] bg-slate-950 overflow-hidden flex-grow">
        
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <svg 
          ref={svgRef}
          className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-default'}`}
          viewBox="0 0 800 500" 
          preserveAspectRatio="xMidYMid meet"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          
          <defs>
            {/* The Projection Texture (Stripes moving) */}
            <pattern id="projectionPattern" x={-offset} y={offset} width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="20" height="40" fill={isWarped ? "#22d3ee" : "#f472b6"} fillOpacity="0.8" />
              <rect x="20" width="20" height="40" fill={isWarped ? "#0891b2" : "#db2777"} fillOpacity="0.8" />
            </pattern>
            
            {/* The Clip Path for "Mapping" - The Statue Shape */}
            <clipPath id="statueClip">
              <path d={statuePath} />
            </clipPath>

            {/* NEW: The Clip Path for "Physical Light" - The Beam Area */}
            {/* This ensures that even if software maps the image, it can only appear where there is physical light. */}
            <clipPath id="beamClip">
               <rect x={rawRect.x} y={rawRect.y} width={rawRect.w} height={rawRect.h} />
            </clipPath>
          </defs>

          {/* 1. The Projector (Draggable Group) */}
          <g 
            transform={`translate(${projPos.x}, ${projPos.y})`} 
            onMouseDown={handleMouseDown}
            className="cursor-grab active:cursor-grabbing hover:opacity-90 transition-opacity"
          >
            {/* Hitbox area for easier grabbing */}
            <rect x="-50" y="-40" width="100" height="140" fill="transparent" />
            
            {/* Stand */}
            <rect x="-10" y="30" width="20" height="60" fill="#475569" />
            <rect x="-20" y="90" width="40" height="10" fill="#334155" />
            {/* Body */}
            <rect x="-40" y="-30" width="80" height="60" rx="4" fill="#cbd5e1" stroke={isDragging ? "#22d3ee" : "none"} strokeWidth="2" />
            {/* Lens */}
            <circle cx="40" cy="0" r="10" fill="#22d3ee" className={isProjectorOn ? "animate-pulse" : "opacity-50"} />
            <text x="0" y="5" textAnchor="middle" fontSize="10" fill="#0f172a" fontWeight="bold">PROJECTOR</text>
            <text x="0" y="120" textAnchor="middle" fontSize="10" fill="#64748b">(Drag me)</text>
          </g>

          {/* 2. The Light Beam (Only if ON) */}
          {/* CRITICAL CHANGE: The beam always follows 'rawRect' (physics), not 'contentRect' (software). */}
          {isProjectorOn && (
            <g className="animate-beam mix-blend-screen pointer-events-none">
              {/* Beam connects projector lens to the corners of the RAW projection rect */}
              <polygon 
                points={`${projPos.x+40},${projPos.y-5} ${rawRect.x},${rawRect.y} ${rawRect.x},${rawRect.y+rawRect.h} ${projPos.x+40},${projPos.y+5}`} 
                fill="url(#beamGradient)" 
                opacity="0.2" 
              />
              <defs>
                <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                  <stop offset="100%" stopColor={isWarped ? "#22d3ee" : "#f472b6"} stopOpacity="0.05" />
                </linearGradient>
              </defs>
            </g>
          )}

          {/* 3. The Statue (Physical Object) */}
          <g filter="drop-shadow(0px 10px 10px rgba(0,0,0,0.5))" className="pointer-events-none">
            <path d={statuePath} fill="#334155" stroke="#94a3b8" strokeWidth="2" />
            <text x="600" y="440" textAnchor="middle" fill="#94a3b8" fontSize="14">實體雕像 (Target)</text>
          </g>

          {/* 4. The Projected Image */}
          {isProjectorOn && (
            <g className="pointer-events-none">
              {isWarped ? (
                // MAPPED: Content is clipped to the shape AND the physical beam availability
                <g clipPath="url(#beamClip)">
                  <g clipPath="url(#statueClip)" opacity="0.9" style={{ mixBlendMode: 'overlay' }}>
                     <rect 
                      x={contentRect.x} 
                      y={contentRect.y} 
                      width={contentRect.w} 
                      height={contentRect.h} 
                      fill="url(#projectionPattern)" 
                    />
                    {/* Highlight edges when mapped to show fit */}
                    <path d={statuePath} fill="none" stroke="#22d3ee" strokeWidth="4" strokeOpacity="0.6" className="animate-pulse" />
                  </g>
                </g>
              ) : (
                // UNMAPPED: Just a rectangle thrown on top
                <g opacity="0.6">
                  <rect 
                    x={contentRect.x} 
                    y={contentRect.y} 
                    width={contentRect.w} 
                    height={contentRect.h} 
                    fill="url(#projectionPattern)" 
                  />
                  {/* Show "Spill" area indicator */}
                  <text x={contentRect.x + contentRect.w/2} y={contentRect.y - 10} fill="#f472b6" fontSize="12" textAnchor="middle">
                    Unmapped: Image Spills Over
                  </text>
                  <rect 
                    x={contentRect.x} 
                    y={contentRect.y} 
                    width={contentRect.w} 
                    height={contentRect.h} 
                    fill="none" 
                    stroke="#f472b6" 
                    strokeWidth="2" 
                    strokeDasharray="5,5"
                  />
                </g>
              )}
            </g>
          )}

        </svg>

        {/* Status Indicator */}
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full text-xs font-mono border border-slate-700 pointer-events-none">
          STATUS: <span className={isProjectorOn ? "text-green-400" : "text-red-400"}>{isProjectorOn ? "PROJECTING" : "OFF"}</span>
          <span className="mx-2">|</span>
          MODE: <span className={isWarped ? "text-cyan-400" : "text-pink-400"}>{isWarped ? "MAPPED (WARPED)" : "RAW PROJECTION"}</span>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-full md:w-72 bg-slate-900 p-6 flex flex-col space-y-6 border-l border-slate-700">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
           控制台 Control Panel
        </h3>
        
        <div className="space-y-4">
          {/* Projector Power */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Projector Power</span>
            <button 
              onClick={() => setIsProjectorOn(!isProjectorOn)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${isProjectorOn ? 'bg-green-500' : 'bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isProjectorOn ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <hr className="border-slate-700" />

          {/* Warping Toggle (The Main Concept) */}
          <div className="space-y-2">
            <label className="text-slate-300 font-medium flex items-center gap-2">
              <LayersIcon size={16} /> Projection Mapping
            </label>
            <p className="text-xs text-slate-500 mb-2">
              開啟 "Masking" 與 "Warping" 來修正投影畫面。
            </p>
            <button
              onClick={() => setIsWarped(!isWarped)}
              disabled={!isProjectorOn}
              className={`w-full py-2 px-4 rounded-lg font-bold transition-all ${
                !isProjectorOn ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-500' :
                isWarped 
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)]' 
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
            >
              {isWarped ? "Mapping Active" : "Enable Mapping"}
            </button>
          </div>

        </div>

        <div className="mt-auto bg-slate-800 p-3 rounded text-xs text-slate-400 leading-relaxed">
          <strong className="text-cyan-400 block mb-1">觀察重點：</strong>
          當 Mapping 關閉時，試著前後拖動投影機，你會發現投影畫面會因為距離而放大縮小（光學原理）。開啟 Mapping 後，軟體會自動補償，確保畫面始終貼合。
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;