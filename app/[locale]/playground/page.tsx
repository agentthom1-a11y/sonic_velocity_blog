import type { Metadata } from 'next';
import { PlaygroundShell } from '@/components/playground/PlaygroundShell';

export const metadata: Metadata = {
  title: 'Playground – Sonic Velocity',
  description: 'Explore interactive music visualizers, neural color detection, sonic inspiration tools, and audio frequency analysis. A creative lab for audio-visual exploration.',
  keywords: ['music visualizer', 'audio visualization', 'sonic playground', 'frequency analyzer', 'beat detection', 'neural audio'],
};

export default function PlaygroundPage() {
  return <PlaygroundShell />;
}
