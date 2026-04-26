
import { CreateJobResponse, JobStatusResponse, PresetType, MixingSettings, StemSettings, RemixSettings } from '../types';

/**
 * In production, proxy calls through a Next.js API route (e.g. /api/proxy/generate)
 * so the backend AUTH_TOKEN stays on the server and never reaches the browser.
 *
 * For local dev with the Express backend running:
 *   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
 *
 * The auth token is added by the Next.js proxy route using a server-side env var.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/proxy';

// Helper for headers — no auth token here; auth handled server-side via httpOnly cookie
const getHeaders = () => ({
  'Content-Type': 'application/json',
});

// --- REAL API CALLS ---

export const generateTrackAPI = async (
  preset: PresetType,
  topic: string,
  mood: string,
  duration: number,
  lyrics?: string,
  voiceModel?: string,
  mixingSettings?: MixingSettings,
  stemSettings?: StemSettings,
  remixSettings?: RemixSettings
): Promise<CreateJobResponse> => {
  const res = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ 
      preset, 
      topic, 
      mood, 
      duration, 
      lyrics, 
      voiceModel,
      mixingSettings,
      stemSettings,
      remixSettings,
      keywords: [preset, 'tiktok', 'viral'] 
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Gagal request generate');
  }
  return res.json();
};

export const checkJobStatusAPI = async (jobId: string): Promise<JobStatusResponse> => {
  const res = await fetch(`${API_BASE_URL}/status/${jobId}`, {
    headers: getHeaders(),
  });
  
  if (!res.ok) {
    throw new Error('Gagal cek status');
  }
  return res.json();
};

// --- SIMULATION MODE (For Frontend Preview without Backend) ---

export const generateTrackMock = async (
  preset: PresetType,
  topic: string,
  mood: string,
  duration: number,
  lyrics?: string,
  voiceModel?: string,
  mixingSettings?: MixingSettings,
  stemSettings?: StemSettings,
  remixSettings?: RemixSettings
): Promise<CreateJobResponse> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Network delay
  return {
    jobId: `mock-${Date.now()}`,
    status: 'queued'
  };
};

export const checkJobStatusMock = async (jobId: string, secondsElapsed: number): Promise<JobStatusResponse> => {
  // Simulate processing time
  if (secondsElapsed < 5) {
    return { 
      status: 'queued',
      progress: Math.floor((secondsElapsed / 5) * 20)
    };
  } else if (secondsElapsed < 15) {
    const p = 20 + Math.floor(((secondsElapsed - 5) / 10) * 75);
    return { 
      status: 'processing',
      progress: p
    };
  } else {
    return { 
      status: 'done', 
      progress: 100,
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Free sample mp3
      trackId: `track-${jobId}`
    };
  }
};
