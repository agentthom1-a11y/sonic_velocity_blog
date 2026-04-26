
export type PresetType = 'koplo' | 'edm' | 'breakbeat' | 'funkot';

export type ViewType = 'landing' | 'studio' | 'pricing' | 'showcase' | 'terms' | 'privacy' | 'status' | 'merch' | 'about' | 'blog' | 'career' | 'login' | 'dashboard';

export type UserTier = 'free' | 'premium' | 'pro' | 'agency';

export interface MixingSettings {
  bass: number;   // -12 to +12 dB
  mid: number;    // -12 to +12 dB
  treble: number; // -12 to +12 dB
  compression: boolean;
  stereoWidth: number; // 0 to 100%
  reverb: number; // 0-100 (Effect Engine)
  delay: number; // 0-100 (Effect Engine)
  distortion: number; // 0-100 (Effect Engine)
}

export interface StemSettings {
  model: 'spleeter-2stems' | 'demucs-4stems';
  artifacts: {
    vocals: boolean;
    drums: boolean;
    bass: boolean;
    other: boolean;
  };
}

export interface RemixSettings {
  targetBpm: number;
  mixStyle: 'seamless' | 'drop-swap' | 'mashup';
  autoKeyDetect: boolean;
  referenceTrack?: string;
}

export interface JobData {
  jobId: string;
  preset: PresetType;
  topic: string;
  mood: string;
  lyrics?: string;
  voiceModel?: string;
  mixingSettings?: MixingSettings;
  stemSettings?: StemSettings;
  remixSettings?: RemixSettings;
  status: 'queued' | 'processing' | 'done' | 'error';
  progress?: number; // 0-100 for simulation visual
  url?: string;
  error?: string;
  createdAt: number;
}

export interface Project {
  id: string;
  name: string;
  lastModified: string;
  data: {
    preset: PresetType;
    topic: string;
    mood: string;
    lyrics?: string;
    voiceModel?: string;
    mixingSettings?: MixingSettings;
    stemSettings?: StemSettings;
    remixSettings?: RemixSettings;
    activeModules: {[key: string]: boolean};
  }
}

export interface CreateJobResponse {
  jobId: string;
  status: string;
}

export interface JobStatusResponse {
  status: 'queued' | 'processing' | 'done' | 'error';
  progress?: number;
  trackId?: string;
  url?: string;
  error?: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
}

export interface SiteConfig {
  brand: string;
  publicationTitle: string;
  subtitle: string;
  defaultAuthor: string;
  defaultLanguage: string;
  defaultOgImage: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  category: string;
  featured?: boolean;
  publishedAt?: string; // Seeded date
  date: string; // Display date
  title: string;
  excerpt: string;
  readingTime?: string;
  tags: string[];
  seoTitle?: string;
  metaDescription?: string;
  image: string; // coverImage
  coverAlt?: string;
  content: string; // transformed from array to markdown string
  author: string;
  views?: number;
}

export const PRESETS: { id: PresetType; name: string; emoji: string; desc: string }[] = [
  { id: 'koplo', name: 'Dangdut Koplo', emoji: '🥁', desc: 'Bass gendang mantap, cocok buat joget.' },
  { id: 'breakbeat', name: 'Indo Breakbeat', emoji: '💊', desc: 'Bass beton, style kota, high BPM.' },
  { id: 'edm', name: 'Jedag Jedug', emoji: '🎧', desc: 'Remix viral TikTok style, full bass.' },
  { id: 'funkot', name: 'Funky Kota', emoji: '🕺', desc: 'Klasik angkot style, kenceng abis.' },
];
