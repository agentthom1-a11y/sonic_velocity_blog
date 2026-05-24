'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Preloader from './Preloader';

export default function PreloaderWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative flex-1 flex flex-col w-full min-h-screen">
      {/* 
        We unconditionally render children so search engine crawlers 
        and initial SSR HTML get the full page content immediately.
      */}
      {children}
      
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="preloader-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', pointerEvents: 'none' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 z-[9999] bg-black flex flex-col"
          >
            <Preloader onComplete={() => setIsLoading(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
