import React, { useState, useRef } from 'react';
import { JobData, PRESETS } from '../types';
import { Download, Play, Pause, RotateCw, Music } from 'lucide-react';
import { Visualizer } from './Visualizer';

interface JobListProps {
  jobs: JobData[];
}

const JobList: React.FC<JobListProps> = ({ jobs }) => {
  const [playingJobId, setPlayingJobId] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  const togglePlay = (jobId: string) => {
    const audio = audioRefs.current[jobId];
    if (!audio) return;

    if (playingJobId === jobId) {
      audio.pause();
      setPlayingJobId(null);
    } else {
      // Pause currently playing if different
      if (playingJobId && audioRefs.current[playingJobId]) {
        audioRefs.current[playingJobId]?.pause();
      }
      
      audio.play().catch(e => {
        console.error("Playback failed", e);
        setPlayingJobId(null);
      });
      setPlayingJobId(jobId);
    }
  };

  if (jobs.length === 0) return null;

  return (
    <div className="mt-20 border-t border-neutral-800 pt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest">
          Output Log // Recent Generations
        </h2>
        <span className="text-xs font-mono text-neutral-600">{jobs.length} ENTRIES</span>
      </div>
      
      <div className="w-full border border-neutral-800 bg-black">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-neutral-800 bg-neutral-900/30 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Timestamp</div>
          <div className="col-span-2">Preset</div>
          <div className="col-span-4">Prompt Details</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-neutral-800">
          {jobs.map((job) => {
            const presetInfo = PRESETS.find(p => p.id === job.preset);
            const isPlaying = playingJobId === job.jobId;
            
            return (
              <div 
                key={job.jobId} 
                className={`group relative bg-black transition-colors p-6 md:p-0 md:grid md:grid-cols-12 md:gap-4 md:items-center md:h-16 md:px-6 ${isPlaying ? 'bg-neutral-900/20' : 'hover:bg-neutral-900/40'}`}
              >
                {/* Status */}
                <div className="flex items-center gap-3 md:col-span-1 mb-4 md:mb-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    job.status === 'done' ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' :
                    job.status === 'error' ? 'bg-red-500' :
                    'bg-neutral-500 animate-pulse'
                  }`} />
                  
                  <span className="md:hidden text-xs font-mono text-neutral-500 uppercase">{job.status}</span>
                  
                  <div className="flex items-center">
                    <Visualizer 
                      status={job.status} 
                      progress={job.progress} 
                      active={isPlaying}
                      className={job.status === 'done' ? 'opacity-40' : 'opacity-100'} 
                    />
                  </div>
                </div>

                {/* Timestamp */}
                <div className="mb-2 md:mb-0 md:col-span-2 font-mono text-xs text-neutral-500">
                  {new Date(job.createdAt).toISOString().split('T')[1].substring(0,8)}
                </div>

                {/* Preset */}
                <div className="mb-2 md:mb-0 md:col-span-2">
                  <span className="inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider border border-neutral-700 text-neutral-300 rounded-sm">
                    {presetInfo?.name}
                  </span>
                </div>

                {/* Topic/Mood */}
                <div className="mb-4 md:mb-0 md:col-span-4 min-w-0">
                  <h3 className={`text-sm font-medium truncate transition-colors ${isPlaying ? 'text-white' : 'text-neutral-300'}`}>{job.topic}</h3>
                  <p className="text-xs text-neutral-600 truncate font-mono">{job.mood}</p>
                </div>

                {/* Actions */}
                <div className="md:col-span-3 flex items-center md:justify-end gap-3 border-t border-neutral-800 pt-4 md:border-0 md:pt-0">
                  {(job.status === 'processing' || job.status === 'queued') && (
                     <span className="text-[10px] font-mono text-neutral-500 uppercase flex items-center gap-2">
                        <RotateCw className="w-3 h-3 animate-spin" /> 
                        {job.status === 'queued' ? 'Queued' : 'Synthesizing'}
                        {job.progress !== undefined && ` [${job.progress}%]`}
                     </span>
                  )}
                  
                  {job.status === 'done' && job.url && (
                    <>
                      <audio 
                        ref={(el) => { audioRefs.current[job.jobId] = el; }}
                        src={job.url}
                        onEnded={() => setPlayingJobId(null)}
                        onError={() => setPlayingJobId(null)}
                        className="hidden"
                      />
                      
                      <button
                        onClick={() => togglePlay(job.jobId)}
                        className={`flex items-center justify-center w-8 h-8 border transition-all duration-200 ${
                          isPlaying 
                            ? 'bg-white border-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                            : 'bg-transparent border-neutral-700 text-white hover:border-white hover:bg-neutral-800'
                        }`}
                        title={isPlaying ? "Pause Preview" : "Play Preview"}
                      >
                        {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                      </button>
                      
                      <a 
                        href={job.url} 
                        download={`velocity-${job.jobId}.mp3`}
                        className="flex items-center justify-center w-8 h-8 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:bg-white hover:text-black hover:border-white transition-colors"
                        title="Download MP3"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </>
                  )}
                  
                  {job.status === 'error' && (
                    <span className="text-xs text-red-500 font-mono">{job.error}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JobList;