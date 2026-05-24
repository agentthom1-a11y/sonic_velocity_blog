import { ArticleLayout } from '@/components/ArticleLayout';

export const metadata = {
  title: 'Indonesian Music Trends 2026 — AI, Viral Hooks & Creator-Led Discovery',
  description: 'Pillar SEO page for Indonesian music trends.',
};

export default async function IndonesianTrendsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <ArticleLayout
      locale={locale}
      title="Indonesian Music Trends 2026 — AI, Viral Hooks & Creator-Led Discovery"
      description="A deep dive into the accelerating Indonesian music ecosystem, tracking AI integration in local genres, TikTok virality, and the shift towards creator-led discovery models."
      breadcrumbs={[
        { label: 'Trends', href: `/music-trends/asia/2026` },
        { label: 'Indonesia 2026', href: `/music-trends/indonesia/2026` }
      ]}
      quickAnswer={
        <p>
          By 2026, the Indonesian music market will be dominated by hyper-localized, AI-assisted remix culture (especially Dangdut Koplo and Jedag Jedug). Discovery is moving entirely to short-form video algorithms, empowering independent bedroom producers over traditional major label structures.
        </p>
      }
      keySignals={[
        'Explosive growth of "Jedag Jedug" (JJ) and Koplo as global export genres.',
        'Widespread use of AI stem separation to create unauthorized but highly viral remixes.',
        'TikTok as the absolute primary A&R and discovery engine in the archipelago.',
        'Local artists leveraging AI vocal clones to cross language barriers.'
      ]}
      whyItMatters={
        <>
          <p>Indonesia is the 4th most populous country and one of the fastest-growing digital markets. What goes viral in Jakarta often ripples across Southeast Asia and eventually global platforms.</p>
          <p>For platforms and labels, ignoring the decentralized, remix-heavy nature of the Indonesian market means missing out on billions of potential streams and highly engaged fanbases.</p>
        </>
      }
      trendBreakdown={
        <>
          <h3>The Rise of "Jedag Jedug" (JJ)</h3>
          <p>Characterized by heavy, pumping bass and fast tempos, JJ originated in Indonesian TikTok and has become the default sound of youth culture. Producers are now using AI tools to quickly generate these beats and lay them over trending acapellas.</p>
          <h3>AI in the Kampung</h3>
          <p>Access to smartphones is ubiquitous, and web-based AI tools mean that kids in rural areas can now produce high-fidelity audio. The democratization of production is causing a flood of hyper-niche, hyper-local genres to emerge.</p>
        </>
      }
      dataSignalsTable={{
        header: ['Trend', 'Primary Platform', 'Growth Vector'],
        rows: [
          ['Koplo Remixes', 'TikTok / YouTube', 'User-generated dance challenges'],
          ['AI Voice Covers', 'YouTube', 'Nostalgia and cross-genre experiments'],
          ['Micro-Influencer Labels', 'Spotify', 'Direct-to-fan community building']
        ]
      }}
      sonicVelocityInsight={
        <p>The Indonesian market does not care about copyright purity; it cares about momentum and participation. The most successful tracks in 2026 will be those designed explicitly to be remixed, sped up, slowed down, and mutated by the creator economy.</p>
      }
      faqs={[
        {
          question: 'What is Dangdut Koplo?',
          answer: 'A subgenre of traditional Indonesian Dangdut music, characterized by a faster tempo, complex drum patterns, and highly energetic live performances.'
        },
        {
          question: 'How is AI changing Indonesian music?',
          answer: 'AI is primarily used for stem separation (making remixes easier) and rapid ideation, allowing producers to release dozens of tracks a week to test algorithm response.'
        }
      ]}
      relatedReading={[
        { title: 'Asian Music Trends 2026', href: `/music-trends/asia/2026`, description: 'Zoom out to see the regional context.' },
        { title: 'Song Trend Signals', href: `/song-trend-signals`, description: 'How these viral hooks actually work.' }
      ]}
    />
  );
}
