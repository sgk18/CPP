"use client";

import React from "react";
import { motion } from "framer-motion";

export const BloomingFlower: React.FC = () => {
  // SVG Petal path: teardrop curved petal starting from center (100, 100) extending upwards to (100, 30)
  const petalPath = "M 100 100 C 75 75, 75 40, 100 30 C 125 40, 125 75, 100 100 Z";
  
  // 6 symmetric petals angles
  const angles = [0, 60, 120, 180, 240, 300];

  // Animation timeline container
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.4,
      },
    },
  };

  // Petal bloom variant (scale up, rotate to position, and fade in)
  const petalVariants = (angle: number) => ({
    initial: {
      scale: 0,
      opacity: 0,
      rotate: 0,
      originX: "100px",
      originY: "100px",
    },
    animate: {
      scale: 1,
      opacity: 0.9,
      rotate: angle,
      transition: {
        type: "spring" as const,
        stiffness: 75,
        damping: 15,
        mass: 0.8,
      },
    },
  });

  // Glowing bud core variant
  const coreVariants = {
    initial: {
      scale: 0,
      opacity: 0,
    },
    animate: {
      scale: [0, 1.2, 1],
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 1.0,
        ease: "easeOut" as const,
      },
    },
  };

  // Brand text reveal variant
  const textVariants = {
    initial: {
      y: 20,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 1.6,
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center select-none pointer-events-none">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="relative flex items-center justify-center"
        style={{ willChange: "transform" }}
      >
        {/* Glow backdrop behind the flower */}
        <motion.div
          animate={{
            scale: [0.95, 1.08, 0.95],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-56 h-56 rounded-full bg-secondary/30 blur-[40px] z-0"
        />

        {/* SVG Drawing Canvas */}
        <svg
          width="240"
          height="240"
          viewBox="0 0 200 200"
          className="relative z-10 filter drop-shadow-[0_10px_20px_rgba(26,95,122,0.15)]"
        >
          <defs>
            {/* Soft linear gradient from ocean blue to calm emerald */}
            <linearGradient id="petalGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#1a5f7a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2a9d8f" stopOpacity="0.95" />
            </linearGradient>
            
            {/* Elegant warm coral gradient for alternate accents */}
            <linearGradient id="petalGradAccent" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#2a9d8f" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#e76f51" stopOpacity="0.95" />
            </linearGradient>

            {/* Glowing Core Filter */}
            <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Render Petals */}
          {angles.map((angle, index) => {
            const useAccent = index % 2 === 1;
            return (
              <motion.path
                key={angle}
                d={petalPath}
                fill={`url(#${useAccent ? "petalGradAccent" : "petalGrad"})`}
                variants={petalVariants(angle)}
                style={{ originX: "100px", originY: "100px" }}
              />
            );
          })}

          {/* Center Glowing Pistil/Core */}
          <motion.circle
            cx="100"
            cy="100"
            r="12"
            fill="#ffffff"
            filter="url(#coreGlow)"
            className="shadow-2xl"
            variants={coreVariants}
            style={{ originX: "100px", originY: "100px" }}
            animate={{
              boxShadow: ["0 0 10px #ffffff", "0 0 20px #2a9d8f", "0 0 10px #ffffff"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </motion.div>

      {/* Brand Logo Text */}
      <motion.div
        variants={textVariants}
        initial="initial"
        animate="animate"
        className="mt-8 text-center flex flex-col gap-1.5"
      >
        <span className="font-serif text-3xl sm:text-4xl font-bold tracking-wide text-dark">
          Centre for <span className="text-primary">Peace Praxis</span>
        </span>
        <span className="text-[10px] tracking-[0.25em] font-display uppercase font-semibold text-gray-text">
          Hope • Healing • Resilience
        </span>
      </motion.div>
    </div>
  );
};
