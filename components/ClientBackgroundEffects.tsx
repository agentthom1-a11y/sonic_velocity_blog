'use client';

import { useAppContext } from './AppContext';

export default function ClientBackgroundEffects() {
  const { isMinimalist } = useAppContext();

  if (isMinimalist) return null;

  return (
    <>
      <div className="fixed inset-0 z-[-1] bg-grid opacity-[0.15] pointer-events-none transition-opacity duration-700"></div>
      <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-neutral-900/0 to-black pointer-events-none transition-opacity duration-700"></div>
    </>
  );
}
