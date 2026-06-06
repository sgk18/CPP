"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DandelionSplash } from "@/components/ui/DandelionSplash";

interface IntroProviderProps {
  children: React.ReactNode;
}

export const IntroProvider: React.FC<IntroProviderProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [hasShownBefore, setHasShownBefore] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReduced = mediaQuery.matches;

    // Defer state updates to avoid synchronous cascading render warnings
    const mountTimer = setTimeout(() => {
      setIsMounted(true);
      if (prefersReduced) {
        setReducedMotion(true);
      }
      setHasShownBefore(false);
    }, 0);

    let animationTimer: NodeJS.Timeout | undefined;

    if (prefersReduced) {
      // If reduced motion is true, fallback to a simple short animation
      const duration = 2000;
      animationTimer = setTimeout(() => {
        handleComplete();
      }, duration);
    }

    return () => {
      clearTimeout(mountTimer);
      if (animationTimer) clearTimeout(animationTimer);
    };
  }, []);

  const handleComplete = () => {
    setShowIntro(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div
            key="intro-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-transparent pointer-events-none"
            style={{ willChange: "opacity" }}
          >
            {isMounted && !reducedMotion ? (
              <DandelionSplash onComplete={handleComplete} onSkip={handleComplete} />
            ) : isMounted && reducedMotion ? (
              // Simple fade branding for prefers-reduced-motion
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative flex flex-col items-center justify-center px-6 pointer-events-auto bg-[#050816] w-full h-full"
              >
                {/* Logo - Exact Center */}
                <div className="w-24 h-24 relative flex items-center justify-center">
                  <img
                    src="/assets/current_logo.png"
                    alt="Centre for Peace Praxis Logo"
                    className="w-full h-full object-contain drop-shadow-[0_6px_16px_rgba(26,95,122,0.15)]"
                  />
                </div>

                {/* Text Title - Positioned Absolutely below the logo */}
                <div className="absolute top-full mt-4 text-center flex flex-col gap-1.5 w-[90vw] sm:w-[500px]">
                  <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-white">
                    Centre for <span className="text-[#38bdf8]">Peace Praxis</span>
                  </h1>
                  <span className="text-[10px] sm:text-xs tracking-[0.3em] font-display uppercase font-semibold text-white/80">
                    Hope • Healing • Resilience
                  </span>
                </div>
              </motion.div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main app container */}
      <div
        className="w-full min-h-screen"
        style={
          hasShownBefore === true
            ? {} // Instant rendering with no performance overhead for returning users
            : {
                opacity: isMounted ? 1 : 0,
                transition: "opacity 0.8s ease-out",
                willChange: "opacity"
              }
        }
      >
        {children}
      </div>
    </>
  );
};
