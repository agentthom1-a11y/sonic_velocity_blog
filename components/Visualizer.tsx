
import React from 'react';

interface VisualizerProps {
  status: 'queued' | 'processing' | 'done' | 'error';
  progress?: number;
  className?: string;
  active?: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({ status, progress = 0, className = '', active = false }) => {
  const isProcessing = status === 'processing' || status === 'queued';
  
  if (!isProcessing && !active) return null;

  // For processing, we use the progress to slightly influence the speed or intensity
  // For 'active' (playing), we just show a generic animation
  
  const barCount = 12;
  const bars = Array.from({ length: barCount });

  return (
    <div className={`flex items-end gap-[1px] h-4 ${className}`}>
      {bars.map((_, i) => {
        // Deterministic but "random-looking" delay and duration
        const duration = 0.4 + (i % 3) * 0.2;
        const delay = (i % 4) * 0.1;
        
        // If processing, use progress to scale the height a bit
        const intensity = isProcessing ? 0.5 + (progress / 200) : 1;
        
        return (
          <div
            key={i}
            className="w-[2px] bg-white opacity-80 animate-bar"
            style={{
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              height: `${20 + (i % 5) * 15}%`, // Initial height
              transform: `scaleY(${intensity})`,
              transformOrigin: 'bottom',
            }}
          />
        );
      })}
    </div>
  );
};
