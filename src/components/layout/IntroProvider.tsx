"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BloomingFlower, LogoSVG } from "@/components/ui/BloomingFlower";

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

    // Check query params for forced development preview
    const urlParams = new URLSearchParams(window.location.search);
    const forceIntro = urlParams.get("forceIntro") === "true";

    const isShown = localStorage.getItem("startup-animation-shown");
    
    // Defer state updates to avoid synchronous cascading render warnings
    const mountTimer = setTimeout(() => {
      setIsMounted(true);
      if (prefersReduced) {
        setReducedMotion(true);
      }
      
      if (isShown === "true" && !forceIntro) {
        setHasShownBefore(true);
        setShowIntro(false);
      } else {
        setHasShownBefore(false);
      }
    }, 0);

    let animationTimer: NodeJS.Timeout | undefined;

    if (isShown !== "true" || forceIntro) {
      const duration = prefersReduced ? 1500 : 3600;
      animationTimer = setTimeout(() => {
        setShowIntro(false);
        try {
          if (!forceIntro) {
            localStorage.setItem("startup-animation-shown", "true");
          }
        } catch (e) {
          console.error("Failed to set localStorage key:", e);
        }
      }, duration);
    }

    return () => {
      clearTimeout(mountTimer);
      if (animationTimer) clearTimeout(animationTimer);
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div
            key="intro-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#fcfcfc]"
            style={{ willChange: "opacity" }}
          >
            {isMounted && !reducedMotion ? (
              <BloomingFlower />
            ) : isMounted && reducedMotion ? (
              // Simple fade branding for prefers-reduced-motion
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center flex flex-col items-center gap-4"
              >
                <LogoSVG className="drop-shadow-[0_4px_12px_rgba(26,95,122,0.1)]" />
                <div className="flex flex-col gap-1">
                  <span className="font-serif text-3xl sm:text-4xl font-bold tracking-wide text-dark">
                    Centre for <span className="text-primary">Peace Praxis</span>
                  </span>
                  <span className="text-[10px] tracking-[0.25em] font-display uppercase font-semibold text-gray-text">
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
                opacity: !isMounted || showIntro ? 0 : 1,
                transition: "opacity 0.6s ease-out",
                willChange: "opacity"
              }
        }
      >
        {children}
      </div>
    </>
  );
};
