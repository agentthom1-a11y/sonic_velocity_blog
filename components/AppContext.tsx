'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { JobData, UserTier, PresetType, MixingSettings, StemSettings, RemixSettings, Project } from '../types';
import { generateTrackAPI, generateTrackMock, checkJobStatusAPI, checkJobStatusMock } from '../services/api';

interface AppContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  userTier: UserTier;
  setUserTier: (tier: UserTier) => void;
  jobs: JobData[];
  setJobs: React.Dispatch<React.SetStateAction<JobData[]>>;
  isSubmitting: boolean;
  handleCreateJob: (
    preset: PresetType, 
    topic: string, 
    mood: string, 
    lyrics?: string, 
    voiceModel?: string,
    mixingSettings?: MixingSettings,
    stemSettings?: StemSettings,
    remixSettings?: RemixSettings
  ) => Promise<void>;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isMinimalist: boolean;
  toggleMinimalism: () => void;
  handleLoginSuccess: (tier: UserTier) => void;
  handleSignOut: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// TOGGLE THIS FOR DEMO MODE
const IS_DEMO_MODE = true;


export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userTier, setUserTier] = useState<UserTier>('free');
  const [jobs, setJobs] = useState<JobData[]>([
    {
       jobId: "JOB_HD_772",
       topic: "Bass Gendang Mantap",
       preset: "koplo",
       mood: "Vibrant",
       status: "done",
       createdAt: Date.now() - 3600000 * 2,
       url: "#"
    },
    {
       jobId: "JOB_HD_771",
       topic: "Jedag Jedug TikTok",
       preset: "edm",
       mood: "High Energy",
       status: "done",
       createdAt: Date.now() - 3600000 * 5,
       url: "#"
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMinimalist, setIsMinimalist] = useState(false);
  const simulationMode = IS_DEMO_MODE;

  // Ref to keep track of polling intervals
  const pollingRef = useRef<{[key: string]: number}>({});

  // Restore session on page refresh by calling /api/auth/me
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data?.user) {
          setUserTier(data.user.tier);
          setIsLoggedIn(true);
        }
      })
      .catch(() => { /* silent — unauthenticated is fine */ });
  }, []);

  // Theme Effect
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleMinimalism = () => {
    setIsMinimalist(prev => !prev);
  };

  const handleCreateJob = async (
    preset: PresetType, 
    topic: string, 
    mood: string, 
    lyrics?: string, 
    voiceModel?: string,
    mixingSettings?: MixingSettings,
    stemSettings?: StemSettings,
    remixSettings?: RemixSettings
  ) => {
    setIsSubmitting(true);
    try {
      const apiCall = simulationMode ? generateTrackMock : generateTrackAPI;
      const response = await apiCall(preset, topic, mood, 60, lyrics, voiceModel, mixingSettings, stemSettings, remixSettings);

      const newJob: JobData = {
        jobId: response.jobId,
        preset,
        topic,
        mood,
        lyrics,
        voiceModel,
        mixingSettings,
        stemSettings,
        remixSettings,
        status: 'queued',
        createdAt: Date.now(),
      };

      setJobs(prev => [newJob, ...prev]);
      startPolling(newJob.jobId);

    } catch (error: unknown) {
      console.error('[handleCreateJob]', error);
      // Return the message so callers can display it in UI
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const startPolling = (jobId: string) => {
    const startTime = Date.now();

    const poll = async () => {
      try {
        const checkCall = simulationMode ? checkJobStatusMock : checkJobStatusAPI;
        const elapsed = (Date.now() - startTime) / 1000;
        const statusData = await checkCall(jobId, elapsed);

        setJobs(currentJobs => 
          currentJobs.map(job => {
            if (job.jobId !== jobId) return job;
            return { ...job, ...statusData };
          })
        );

        if (statusData.status === 'done' || statusData.status === 'error') {
          clearInterval(pollingRef.current[jobId]);
          delete pollingRef.current[jobId];
        }

      } catch (err) {
        console.error("Polling error", err);
      }
    };

    pollingRef.current[jobId] = window.setInterval(poll, 2000);
  };

  const handleLoginSuccess = (tier: UserTier) => {
    setUserTier(tier);
    setIsLoggedIn(true);
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Best-effort logout — clear state regardless
    }
    setIsLoggedIn(false);
    setUserTier('free');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(pollingRef.current).forEach(clearInterval);
    };
  }, []);

  return (
    <AppContext.Provider value={{
      isLoggedIn, setIsLoggedIn,
      userTier, setUserTier,
      jobs, setJobs,
      isSubmitting,
      handleCreateJob,
      theme, toggleTheme,
      isMinimalist, toggleMinimalism,
      handleLoginSuccess,
      handleSignOut
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
