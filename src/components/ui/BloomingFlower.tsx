"use client";

import React from "react";
import { motion } from "framer-motion";

// Custom SVG Brand Logo for the Centre for Peace Praxis
export const LogoSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    width="80"
    height="80"
  >
    {/* Outer elegant rings */}
    <circle cx="50" cy="50" r="45" fill="none" stroke="#1a5f7a" strokeWidth="1.5" opacity="0.8" />
    <circle cx="50" cy="50" r="41" fill="none" stroke="#1a5f7a" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.6" />
    
    {/* Stylized Olive Branch (Peace Symbol) */}
    <path
      d="M 50 78 C 50 65, 48 50, 62 40 M 50 65 C 50 55, 42 45, 38 38 M 50 50 C 50 40, 58 32, 65 28"
      fill="none"
      stroke="#2a9d8f"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Leaves */}
    <path d="M 62 40 C 65 38, 68 40, 66 43 C 63 46, 60 44, 62 40 Z" fill="#2a9d8f" />
    <path d="M 38 38 C 35 36, 33 39, 35 42 C 38 44, 40 41, 38 38 Z" fill="#2a9d8f" />
    <path d="M 65 28 C 68 26, 70 29, 68 31 C 65 33, 63 31, 65 28 Z" fill="#2a9d8f" />
    <path d="M 50 25 C 49 20, 52 18, 54 21 C 53 25, 51 27, 50 25 Z" fill="#2a9d8f" />
    <path d="M 44 55 C 41 53, 39 56, 41 59 C 44 61, 46 58, 44 55 Z" fill="#2a9d8f" />
  </svg>
);

export const BloomingFlower: React.FC = () => {
  const sporeCount = 36;
  
  // Generate spores with varying angles, lengths, and staggered flight timings
  const spores = Array.from({ length: sporeCount }).map((_, i) => {
    const angle = (i * 360) / sporeCount;
    const rad = (angle * Math.PI) / 180;
    const length = 28 + (i % 4) * 4; // seed stem length
    
    // Staggered flight times:
    // Some detach early (First Spores Lift: 1.2s)
    // Others detach later (Spore Release: 1.6s)
    const isEarly = i % 4 === 0;
    const detachDelay = isEarly 
      ? 1.2 + (i % 3) * 0.15 
      : 1.6 + (i % 6) * 0.12;

    // Float target coordinates (moving up and to the right off-screen)
    // Use deterministic sine/cosine offsets to preserve render purity (no Math.random)
    const targetX = 220 + (i % 5) * 40 + (Math.abs(Math.sin(i * 12.9898)) * 50);
    const targetY = -220 - (i % 3) * 50 - (Math.abs(Math.cos(i * 78.233)) * 50);

    return {
      id: i,
      angle,
      rad,
      length,
      detachDelay,
      targetX,
      targetY,
      tipX: length * Math.cos(rad),
      tipY: length * Math.sin(rad),
    };
  });

  // Background wind particles (small floating seeds floating from left to right)
  const bgParticles = Array.from({ length: 15 }).map((_, i) => {
    const startY = 50 + i * 15;
    const delay = i * 0.25;
    return { id: i, startY, delay };
  });

  // Timeline keyframe constants (mapped over 4.6 seconds before unmounting/fading out)
  const totalDuration = 4.6;

  // Spore flight animation path variants
  const sporeVariants = (spore: typeof spores[0]) => ({
    initial: {
      x: 0,
      y: 0,
      scale: 0,
      opacity: 0,
      rotate: 0,
    },
    animate: {
      scale: [0, 1, 1, 0.4, 0],
      opacity: [0, 1, 1, 0.8, 0],
      x: [0, 0, 0, spore.targetX * 0.4, spore.targetX],
      y: [0, 0, 0, spore.targetY * 0.4, spore.targetY],
      rotate: [0, 0, 15, 60, 120],
      transition: {
        duration: totalDuration,
        times: [
          0, 
          0.06, 
          spore.detachDelay / totalDuration, 
          (spore.detachDelay + 1.2) / totalDuration, 
          1
        ],
        ease: "easeInOut" as const,
      },
    },
  });

  return (
    <div className="relative w-full h-full min-h-screen flex items-center justify-center bg-[#fcfcfc] overflow-hidden select-none pointer-events-none">
      
      {/* Background Floating Wind Particles */}
      <div className="absolute inset-0 z-0">
        {bgParticles.map((part) => (
          <motion.div
            key={part.id}
            initial={{ x: "-10vw", y: `${part.startY}vh`, opacity: 0, scale: 0.3 }}
            animate={{
              x: "110vw",
              y: [`${part.startY}vh`, `${part.startY - 10}vh`, `${part.startY - 5}vh`],
              opacity: [0, 0.4, 0.4, 0],
              rotate: [0, 90, 180],
            }}
            transition={{
              duration: 5,
              delay: part.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute flex items-center gap-1 text-secondary/35"
          >
            {/* Minimalist Spore Icon */}
            <div className="w-1.5 h-1.5 rounded-full bg-secondary/40" />
            <div className="w-4 h-[1px] bg-secondary/20" />
          </motion.div>
        ))}
      </div>

      {/* Main Dandelion Graphic */}
      <div className="relative flex flex-col items-center justify-center z-10 w-96 h-96">
        
        {/* Glow behind the Dandelion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 0.25, 0.25, 0.1, 0, 0],
            scale: [0.8, 1.1, 1.1, 0.8, 0, 0],
          }}
          transition={{
            duration: totalDuration,
            times: [0, 0.13, 0.78, 0.87, 0.95, 1],
            ease: "easeInOut",
          }}
          className="absolute w-64 h-64 rounded-full bg-secondary/20 blur-[50px] pointer-events-none"
        />

        {/* Dynamic Dandelion SVG (Stem & Seeds) */}
        <motion.div
          animate={{
            opacity: [1, 1, 1, 0],
          }}
          transition={{
            duration: totalDuration,
            times: [0, 0.78, 0.87, 0.95],
          }}
          className="relative"
        >
          <svg
            width="260"
            height="260"
            viewBox="0 0 200 200"
            className="filter drop-shadow-[0_8px_16px_rgba(42,157,143,0.08)]"
          >
            <defs>
              {/* Soft glow filters */}
              <filter id="receptacleGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Dandelion Stem - Sways with the wind keyframes (Stage 03 - 08) */}
            <motion.path
              fill="none"
              stroke="#2a9d8f"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.85"
              initial={{ d: "M 100 180 Q 100 140, 100 100", pathLength: 0 }}
              animate={{
                pathLength: [0, 1, 1, 1, 1, 1],
                d: [
                  "M 100 180 Q 100 140, 100 100", // Fades in (Stage 02)
                  "M 100 180 Q 100 140, 100 100", // Stays still (Stage 02)
                  "M 100 180 Q 103 140, 107 100", // Wind Awakens (Stage 03)
                  "M 100 180 Q 106 140, 114 100", // Spore Release (Stage 05)
                  "M 100 180 Q 103 140, 106 100", // Sways back (Stage 08)
                  "M 100 180 Q 100 140, 100 100", // Settles (Stage 09)
                ],
              }}
              transition={{
                duration: totalDuration,
                times: [0, 0.08, 0.15, 0.38, 0.65, 0.85],
                ease: "easeInOut",
              }}
            />

            {/* Group containing Head Center Core and Spores - inherits the Stem Sway */}
            <motion.g
              animate={{
                x: [0, 0, 7, 14, 6, 0],
                y: [0, 0, 0, -1, 0, 0],
              }}
              transition={{
                duration: totalDuration,
                times: [0, 0.08, 0.15, 0.38, 0.65, 0.85],
                ease: "easeInOut",
              }}
            >
              {/* Spores List */}
              {spores.map((spore) => (
                <motion.g
                  key={spore.id}
                  variants={sporeVariants(spore)}
                  initial="initial"
                  animate="animate"
                  style={{ originX: "100px", originY: "100px" }}
                >
                  {/* Spore Stem Line */}
                  <line
                    x1="100"
                    y1="100"
                    x2={100 + spore.tipX}
                    y2={100 + spore.tipY}
                    stroke="#1a5f7a"
                    strokeWidth="0.8"
                    opacity="0.6"
                  />
                  {/* Spore Fluff tips (split branches) */}
                  <line
                    x1={100 + spore.tipX}
                    y1={100 + spore.tipY}
                    x2={100 + spore.tipX + 3.5 * Math.cos(spore.rad - 0.35)}
                    y2={100 + spore.tipY + 3.5 * Math.sin(spore.rad - 0.35)}
                    stroke="#2a9d8f"
                    strokeWidth="0.8"
                    opacity="0.85"
                  />
                  <line
                    x1={100 + spore.tipX}
                    y1={100 + spore.tipY}
                    x2={100 + spore.tipX + 3.5 * Math.cos(spore.rad + 0.35)}
                    y2={100 + spore.tipY + 3.5 * Math.sin(spore.rad + 0.35)}
                    stroke="#2a9d8f"
                    strokeWidth="0.8"
                    opacity="0.85"
                  />
                  <circle
                    cx={100 + spore.tipX}
                    cy={100 + spore.tipY}
                    r="1.2"
                    fill="#ffffff"
                    opacity="0.9"
                  />
                </motion.g>
              ))}

              {/* Central Receptacle Core Head */}
              <motion.circle
                cx="100"
                cy="100"
                r="7"
                fill="#2a9d8f"
                filter="url(#receptacleGlow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 1, 1],
                  opacity: [0, 0.9, 0.9, 0.4],
                }}
                transition={{
                  duration: totalDuration,
                  times: [0, 0.08, 0.78, 0.87],
                  ease: "easeOut",
                }}
              />
            </motion.g>
          </svg>
        </motion.div>

        {/* Stage 09 & 10: Light Converges to Center and Essence remains as a glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0, 0.8, 1, 0.5, 0],
            scale: [0, 0, 0.4, 1.2, 1, 0],
          }}
          transition={{
            duration: totalDuration,
            times: [0, 0.76, 0.82, 0.87, 0.92, 1],
            ease: "easeInOut",
          }}
          className="absolute w-12 h-12 rounded-full bg-light-blue blur-[6px] z-20 flex items-center justify-center"
        >
          <div className="w-4 h-4 rounded-full bg-white blur-[1px]" />
        </motion.div>

        {/* Stage 11: Brand Reveal (Center Peace Logo SVG and text grace reveal) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
          
          {/* Logo SVG Reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{
              opacity: [0, 0, 1, 1],
              scale: [0.85, 0.85, 1, 1],
              y: [15, 15, 0, 0],
            }}
            transition={{
              duration: totalDuration,
              times: [0, 0.84, 0.92, 1],
              ease: "easeOut",
            }}
            className="flex items-center justify-center mb-6"
          >
            <LogoSVG className="drop-shadow-[0_4px_12px_rgba(26,95,122,0.1)]" />
          </motion.div>

          {/* Text Title Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: [0, 0, 1, 1],
              y: [15, 15, 0, 0],
            }}
            transition={{
              duration: totalDuration,
              times: [0, 0.87, 0.94, 1],
              ease: "easeOut",
            }}
            className="text-center flex flex-col gap-1"
          >
            <span className="font-serif text-3xl sm:text-4xl font-bold tracking-wide text-dark">
              Centre for <span className="text-primary">Peace Praxis</span>
            </span>
            <span className="text-[10px] tracking-[0.25em] font-display uppercase font-semibold text-gray-text">
              Hope • Healing • Resilience
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
