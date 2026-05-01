'use client';
import React, { useState } from 'react';
import { Star, AudioLines, Zap, Check } from 'lucide-react';
import { useAppContext } from './AppContext';

export default function DailyHitsRateForm() {
  const { isMinimalist } = useAppContext();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setIsSubmitting(true);
    // Simulate API call to register rating
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
         setIsSuccess(false);
         setRating(0);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="p-8 border border-neutral-900 bg-neutral-950 relative overflow-hidden group">
       {/* Background graphic */}
       {!isMinimalist && (
         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AudioLines className="w-20 h-20 text-cyan-500" />
         </div>
       )}
       
       <h4 className="text-[11px] font-mono font-black text-white uppercase tracking-[0.4em] mb-8 border-b border-neutral-800 pb-4 flex items-center gap-2">
          <Zap className="w-3 h-3 text-cyan-500" /> Rate Daily Hits
       </h4>
       
       {isSuccess ? (
          <div className={`py-8 flex flex-col items-center justify-center space-y-4 ${!isMinimalist ? 'animate-[fadeIn_0.5s_ease-out]' : ''}`}>
             <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500">
                <Check className="w-6 h-6 text-cyan-400" />
             </div>
             <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.2em] text-center leading-relaxed">
                Rating Locked.<br/>Network Updated.
             </p>
          </div>
       ) : (
          <form onSubmit={handleSubmit} className={`space-y-8 relative z-10 ${!isMinimalist ? 'animate-[fadeIn_0.5s_ease-out]' : ''}`}>
             <div className="space-y-3">
                <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-[0.3em]">Current Top Signal:</p>
                <div className="px-4 py-3 bg-neutral-900/40 border border-neutral-800/80 rounded-sm shadow-inner">
                   <p className="text-xs font-bold text-white uppercase tracking-wider mb-1">Neural Anthem Vol. 4</p>
                   <p className="text-[8px] font-mono text-cyan-500/70 uppercase tracking-widest">Sonic Velocity Genesis</p>
                </div>
             </div>

             <div className="space-y-4">
                <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-[0.3em]">Your Assessment:</p>
                <div className="flex items-center gap-3">
                   {[1, 2, 3, 4, 5].map((star) => (
                      <button
                         key={star}
                         type="button"
                         onMouseEnter={() => setHoverRating(star)}
                         onMouseLeave={() => setHoverRating(0)}
                         onClick={() => setRating(star)}
                         className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                      >
                         <Star 
                            className={`w-6 h-6 transition-all duration-300 ${
                               star <= (hoverRating || rating) 
                                 ? `fill-cyan-500 text-cyan-400 ${!isMinimalist ? 'drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]' : ''}` 
                                 : 'fill-transparent text-neutral-800'
                            }`} 
                         />
                      </button>
                   ))}
                </div>
                <div className="h-4">
                  <p className="text-[8px] font-mono text-cyan-500/50 uppercase tracking-[0.2em] transition-opacity">
                     {rating > 0 ? `Signal Strength: ${rating}/5` : hoverRating > 0 ? `Assessing: ${hoverRating}` : 'Awaiting Input'}
                  </p>
                </div>
             </div>

             <button 
                type="submit"
                disabled={rating === 0 || isSubmitting}
                className="w-full py-4 border border-cyan-900/80 bg-cyan-950/20 text-[10px] font-mono font-bold text-cyan-500 uppercase tracking-[0.4em] hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-cyan-500 disabled:hover:shadow-none"
             >
                {isSubmitting ? 'TRANSMITTING...' : 'SUBMIT RATING'}
             </button>
          </form>
       )}
    </div>
  );
}
