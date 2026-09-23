'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';

/**
 * HeroPlant — Two caring hands cupping soil with a vibrant sapling.
 * The sapling leaves gently sway toward the cursor with spring physics.
 * When idle, a soft breeze animation plays.
 */
export default function HeroPlant() {
  const svgRef = useRef<SVGSVGElement>(null);
  const animFrameRef = useRef<number>(0);

  // Rotation state for each leaf pair
  const leafA = useRef({ current: 0, target: 0 }); // top leaf
  const leafB = useRef({ current: 0, target: 0 }); // left leaf
  const leafC = useRef({ current: 0, target: 0 }); // right leaf
  const leafD = useRef({ current: 0, target: 0 }); // small lower leaf

  const isHovering = useRef(false);
  const idleTime = useRef(0);
  const [glowIntensity, setGlowIntensity] = useState(0.3);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const cy = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    isHovering.current = true;
    idleTime.current = 0;

    // Each leaf responds slightly differently for organic motion
    leafA.current.target = cx * 12 + cy * 5;
    leafB.current.target = cx * 18 + cy * 6;
    leafC.current.target = cx * 15 - cy * 7;
    leafD.current.target = cx * 10 + cy * 8;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
    idleTime.current = 0;
  }, []);

  useEffect(() => {
    const hero = svgRef.current?.closest('#hero-section');
    if (!hero) return;

    hero.addEventListener('mousemove', handleMouseMove as EventListener);
    hero.addEventListener('mouseleave', handleMouseLeave);

    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isHovering.current) {
        idleTime.current += dt;
        const t = idleTime.current;
        leafA.current.target = Math.sin(t * 1.1) * 6 + Math.sin(t * 2.5) * 2;
        leafB.current.target = Math.sin(t * 0.9 + 0.3) * 8 + Math.cos(t * 2.1) * 3;
        leafC.current.target = Math.sin(t * 1.3 + 0.7) * 7 + Math.sin(t * 1.8) * 2;
        leafD.current.target = Math.sin(t * 1.0 + 1.0) * 5 + Math.cos(t * 2.8) * 2;
      }

      const spring = 1 - Math.pow(0.025, dt);
      leafA.current.current += (leafA.current.target - leafA.current.current) * spring;
      leafB.current.current += (leafB.current.target - leafB.current.current) * spring;
      leafC.current.current += (leafC.current.target - leafC.current.current) * spring;
      leafD.current.current += (leafD.current.target - leafD.current.current) * spring;

      const svg = svgRef.current;
      if (svg) {
        const applyRotation = (id: string, angle: number, px: number, py: number) => {
          const el = svg.querySelector(`#${id}`) as SVGGElement;
          if (el) el.setAttribute('transform', `rotate(${angle}, ${px}, ${py})`);
        };
        applyRotation('leaf-top', leafA.current.current, 150, 68);
        applyRotation('leaf-left', leafB.current.current, 143, 82);
        applyRotation('leaf-right', leafC.current.current, 157, 78);
        applyRotation('leaf-small', leafD.current.current, 148, 90);
      }

      setGlowIntensity(0.25 + Math.sin(now / 1200) * 0.15);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      hero.removeEventListener('mousemove', handleMouseMove as EventListener);
      hero.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div
      className="absolute bottom-0 right-[5%] md:right-[8%] z-[1] pointer-events-none select-none"
      style={{ width: 'clamp(180px, 22vw, 340px)', height: 'auto' }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 300 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: '100%',
          filter: 'drop-shadow(0 8px 24px rgba(5, 80, 50, 0.18))',
        }}
      >
        <defs>
          {/* Skin gradients */}
          <linearGradient id="skin-main" x1="100" y1="140" x2="200" y2="200">
            <stop offset="0%" stopColor="#deb896" />
            <stop offset="40%" stopColor="#d4a574" />
            <stop offset="100%" stopColor="#c49060" />
          </linearGradient>
          <linearGradient id="skin-shadow" x1="100" y1="170" x2="200" y2="220">
            <stop offset="0%" stopColor="#c49060" />
            <stop offset="100%" stopColor="#a87750" />
          </linearGradient>
          <linearGradient id="skin-highlight" x1="120" y1="140" x2="180" y2="160">
            <stop offset="0%" stopColor="#f0d0b0" />
            <stop offset="100%" stopColor="#deb896" />
          </linearGradient>

          {/* Soil gradient */}
          <radialGradient id="soil-grad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#5c3a1e" />
            <stop offset="50%" stopColor="#4a2e15" />
            <stop offset="100%" stopColor="#3d2510" />
          </radialGradient>
          <radialGradient id="soil-top" cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#6b4226" />
            <stop offset="100%" stopColor="#4a2e15" />
          </radialGradient>

          {/* Leaf gradients */}
          <linearGradient id="leaf-fresh-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="40%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="leaf-fresh-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="40%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
          <linearGradient id="leaf-fresh-3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#bbf7d0" />
          </linearGradient>
          <linearGradient id="stem-color" x1="150" y1="100" x2="150" y2="60">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>

          {/* Warm sunlight glow */}
          <radialGradient id="sun-glow" cx="80%" cy="10%" r="60%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#fde047" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
          </radialGradient>

          {/* Light rays filter */}
          <filter id="soft-blur">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <filter id="leaf-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Warm sunlight glow background */}
        <ellipse cx="240" cy="30" rx="140" ry="100" fill="url(#sun-glow)" />

        {/* Subtle light rays */}
        <g opacity={glowIntensity}>
          <line x1="250" y1="20" x2="200" y2="80" stroke="#fef9c3" strokeWidth="1.5" opacity="0.4" filter="url(#soft-blur)" />
          <line x1="260" y1="15" x2="180" y2="100" stroke="#fef9c3" strokeWidth="1" opacity="0.3" filter="url(#soft-blur)" />
          <line x1="270" y1="30" x2="190" y2="90" stroke="#fef9c3" strokeWidth="1.2" opacity="0.35" filter="url(#soft-blur)" />
        </g>

        {/* === LEFT HAND === */}
        {/* Left palm/base */}
        <path
          d="M80 175 C75 165, 78 155, 90 148 C100 142, 115 138, 130 136 
             L140 140 C130 142, 115 148, 105 155 C95 162, 88 170, 85 178 Z"
          fill="url(#skin-main)"
        />
        {/* Left fingers curving around soil */}
        {/* Pinky */}
        <path
          d="M80 175 C74 172, 68 166, 65 160 C62 154, 64 148, 70 145 
             C74 143, 78 145, 80 150 C82 155, 82 162, 82 170 Z"
          fill="url(#skin-main)"
        />
        {/* Ring finger */}
        <path
          d="M85 170 C78 165, 72 156, 70 148 C68 140, 72 134, 78 132 
             C84 130, 88 134, 89 140 C90 146, 89 158, 88 165 Z"
          fill="url(#skin-main)"
        />
        {/* Middle finger */}
        <path
          d="M92 162 C86 155, 80 144, 80 136 C80 128, 85 124, 91 123 
             C97 122, 100 126, 100 134 C100 142, 98 154, 95 160 Z"
          fill="url(#skin-highlight)"
        />
        {/* Index finger */}
        <path
          d="M100 155 C96 146, 93 136, 94 128 C95 122, 100 118, 106 118 
             C112 118, 115 122, 114 130 C113 138, 108 148, 104 154 Z"
          fill="url(#skin-highlight)"
        />
        {/* Left thumb */}
        <path
          d="M130 136 C125 130, 118 122, 116 116 C114 110, 118 106, 124 106 
             C130 106, 134 110, 134 118 C134 126, 132 132, 132 136 Z"
          fill="url(#skin-main)"
        />
        {/* Left palm inner shadow */}
        <path
          d="M90 160 C95 155, 105 148, 120 142 C130 138, 138 138, 142 140 
             L140 145 C130 145, 115 150, 105 157 C98 162, 93 165, 90 165 Z"
          fill="url(#skin-shadow)"
          opacity="0.4"
        />

        {/* === RIGHT HAND === */}
        {/* Right palm/base */}
        <path
          d="M220 175 C225 165, 222 155, 210 148 C200 142, 185 138, 170 136 
             L160 140 C170 142, 185 148, 195 155 C205 162, 212 170, 215 178 Z"
          fill="url(#skin-main)"
        />
        {/* Right pinky */}
        <path
          d="M220 175 C226 172, 232 166, 235 160 C238 154, 236 148, 230 145 
             C226 143, 222 145, 220 150 C218 155, 218 162, 218 170 Z"
          fill="url(#skin-main)"
        />
        {/* Right ring finger */}
        <path
          d="M215 170 C222 165, 228 156, 230 148 C232 140, 228 134, 222 132 
             C216 130, 212 134, 211 140 C210 146, 211 158, 212 165 Z"
          fill="url(#skin-main)"
        />
        {/* Right middle finger */}
        <path
          d="M208 162 C214 155, 220 144, 220 136 C220 128, 215 124, 209 123 
             C203 122, 200 126, 200 134 C200 142, 202 154, 205 160 Z"
          fill="url(#skin-highlight)"
        />
        {/* Right index finger */}
        <path
          d="M200 155 C204 146, 207 136, 206 128 C205 122, 200 118, 194 118 
             C188 118, 185 122, 186 130 C187 138, 192 148, 196 154 Z"
          fill="url(#skin-highlight)"
        />
        {/* Right thumb */}
        <path
          d="M170 136 C175 130, 182 122, 184 116 C186 110, 182 106, 176 106 
             C170 106, 166 110, 166 118 C166 126, 168 132, 168 136 Z"
          fill="url(#skin-main)"
        />
        {/* Right palm inner shadow */}
        <path
          d="M210 160 C205 155, 195 148, 180 142 C170 138, 162 138, 158 140 
             L160 145 C170 145, 185 150, 195 157 C202 162, 207 165, 210 165 Z"
          fill="url(#skin-shadow)"
          opacity="0.4"
        />

        {/* === SOIL MOUND === */}
        {/* Main soil mass */}
        <ellipse cx="150" cy="135" rx="42" ry="22" fill="url(#soil-grad)" />
        {/* Soil top highlight */}
        <ellipse cx="150" cy="130" rx="36" ry="14" fill="url(#soil-top)" />
        {/* Soil texture — tiny particles */}
        <circle cx="135" cy="128" r="1.5" fill="#7c5030" opacity="0.6" />
        <circle cx="155" cy="126" r="1" fill="#8b6040" opacity="0.5" />
        <circle cx="165" cy="130" r="1.2" fill="#6b4226" opacity="0.7" />
        <circle cx="142" cy="132" r="0.8" fill="#8b6040" opacity="0.4" />
        <circle cx="158" cy="134" r="1.3" fill="#5c3a1e" opacity="0.5" />
        <circle cx="140" cy="125" r="0.7" fill="#9a7050" opacity="0.5" />
        <circle cx="162" cy="127" r="0.9" fill="#7c5030" opacity="0.4" />
        {/* Soil crumbs falling */}
        <circle cx="128" cy="140" r="1.5" fill="#5c3a1e" opacity="0.35" />
        <circle cx="172" cy="138" r="1" fill="#4a2e15" opacity="0.3" />
        <circle cx="125" cy="145" r="0.8" fill="#6b4226" opacity="0.25" />

        {/* === SAPLING === */}
        {/* Main stem */}
        <path
          d="M150 125 C150 115, 149 105, 150 95 C150.5 85, 150 75, 150 68"
          stroke="url(#stem-color)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Stem detail line */}
        <path
          d="M150 120 C149.5 115, 149 110, 149.5 105"
          stroke="#15803d"
          strokeWidth="0.6"
          fill="none"
          opacity="0.3"
        />

        {/* Top leaf pair — most prominent, points upward */}
        <g id="leaf-top" filter="url(#leaf-glow)">
          {/* Right top leaf */}
          <path
            d="M150 68 C153 63, 160 55, 170 50 C175 47, 178 48, 177 52 
               C176 56, 168 62, 160 66 C155 68, 152 69, 150 68 Z"
            fill="url(#leaf-fresh-3)"
          />
          {/* Leaf vein */}
          <path d="M150 68 C156 62, 164 55, 172 51" stroke="#16a34a" strokeWidth="0.6" fill="none" opacity="0.4" />
          <path d="M156 63 C160 60, 163 58, 166 56" stroke="#16a34a" strokeWidth="0.3" fill="none" opacity="0.25" />
          {/* Left top leaf */}
          <path
            d="M150 68 C147 63, 140 55, 130 50 C125 47, 122 48, 123 52 
               C124 56, 132 62, 140 66 C145 68, 148 69, 150 68 Z"
            fill="url(#leaf-fresh-1)"
          />
          <path d="M150 68 C144 62, 136 55, 128 51" stroke="#15803d" strokeWidth="0.6" fill="none" opacity="0.4" />
          <path d="M144 63 C140 60, 137 58, 134 56" stroke="#15803d" strokeWidth="0.3" fill="none" opacity="0.25" />
          {/* Light catch on leaves */}
          <path
            d="M155 64 C160 59, 165 55, 168 53"
            stroke="#bbf7d0"
            strokeWidth="0.8"
            fill="none"
            opacity="0.35"
          />
        </g>

        {/* Left lower leaf */}
        <g id="leaf-left">
          <path
            d="M143 82 C138 78, 128 73, 118 72 C113 72, 111 74, 114 77 
               C117 80, 128 82, 138 83 C141 83, 143 83, 143 82 Z"
            fill="url(#leaf-fresh-1)"
          />
          <path d="M143 82 C135 78, 126 74, 118 73" stroke="#15803d" strokeWidth="0.5" fill="none" opacity="0.35" />
          <path d="M135 79 C131 77, 127 76, 124 75" stroke="#15803d" strokeWidth="0.3" fill="none" opacity="0.2" />
          {/* Light highlight */}
          <path d="M138 80 C132 77, 126 75, 122 74" stroke="#bbf7d0" strokeWidth="0.6" fill="none" opacity="0.25" />
        </g>

        {/* Right lower leaf */}
        <g id="leaf-right">
          <path
            d="M157 78 C162 74, 172 68, 182 66 C187 65, 190 67, 187 70 
               C184 73, 172 76, 162 78 C159 79, 157 79, 157 78 Z"
            fill="url(#leaf-fresh-2)"
          />
          <path d="M157 78 C165 74, 174 69, 182 67" stroke="#16a34a" strokeWidth="0.5" fill="none" opacity="0.35" />
          <path d="M165 75 C169 73, 174 71, 177 69" stroke="#16a34a" strokeWidth="0.3" fill="none" opacity="0.2" />
        </g>

        {/* Small emerging leaf bud */}
        <g id="leaf-small">
          <path
            d="M148 90 C145 87, 139 84, 134 84 C131 84, 130 86, 133 88 
               C136 90, 142 90, 146 90 C147 90, 148 90, 148 90 Z"
            fill="#4ade80"
            opacity="0.85"
          />
          <path d="M148 90 C143 87, 137 85, 134 85" stroke="#16a34a" strokeWidth="0.4" fill="none" opacity="0.3" />
        </g>

        {/* Dew drops on leaves */}
        <ellipse cx="163" cy="56" rx="1.8" ry="2.4" fill="#ecfdf5" opacity={glowIntensity + 0.3}>
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2.5s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="162.5" cy="55" rx="0.7" ry="0.9" fill="white" opacity="0.6" />

        <ellipse cx="125" cy="75" rx="1.2" ry="1.6" fill="#ecfdf5" opacity={glowIntensity + 0.2}>
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="124.7" cy="74.4" rx="0.5" ry="0.6" fill="white" opacity="0.5" />

        {/* Floating soil particles (subtle life) */}
        <circle cx="138" cy="118" r="0.6" fill="#8b6040" opacity="0.3">
          <animate attributeName="cy" values="118;114;118" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="162" cy="120" r="0.5" fill="#7c5030" opacity="0.25">
          <animate attributeName="cy" values="120;116;120" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0.08;0.25" dur="5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}
