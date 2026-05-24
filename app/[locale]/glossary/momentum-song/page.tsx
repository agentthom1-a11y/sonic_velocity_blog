import { ArticleLayout } from '@/components/ArticleLayout';

export const metadata = {
  title: 'What Is a Momentum Song? Definition, Signals & Examples',
  description: 'Define Sonic Velocity’s concept of momentum songs.',
};

export default async function MomentumSongPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <ArticleLayout
      locale={locale}
      title="What Is a Momentum Song? Definition, Signals & Examples"
      description="Understanding the anatomy of a momentum song, how it drives algorithmic discovery, and why it's replacing the traditional radio hit."
      breadcrumbs={[
        { label: 'Glossary', href: `/glossary` },
        { label: 'Momentum Song', href: `/glossary/momentum-song` }
      ]}
      quickAnswer={
        <p>
          A Momentum Song is a track that generates its own sustained algorithmic gravity. Instead of relying on a traditional, front-loaded marketing push, a Momentum Song grows organically through user-generated content (UGC), remixes, and cross-platform spillover, essentially forcing algorithms to amplify it.
        </p>
      }
      keySignals={[
        'High UGC Participation: Users don\'t just listen; they use the sound to create their own videos.',
        'Algorithmic Forcing: The track performs so well in retention metrics that platforms (TikTok/Reels) push it to new audiences.',
        'Spontaneous Mutation: The song is naturally sped up, slowed down, or mashed up by the community.',
        'Long Tail Velocity: It stays relevant for months through different trend cycles, rather than peaking and dropping in a week.'
      ]}
      whyItMatters={
        <>
          <p>The traditional music industry relies on the "hit" model, which requires massive capital expenditure on playlist pitching and radio play. The Momentum Song model relies on cultural resonance and algorithmic hacking.</p>
          <p>For independent artists and nimble labels, creating or identifying a momentum song early allows them to capture massive market share with significantly less upfront investment.</p>
        </>
      }
      trendBreakdown={
        <>
          <h3>The Anatomy of the Hook</h3>
          <p>Momentum Songs usually have a highly distinct, easily loopable section. This could be a unique vocal inflection, a heavy bass drop, or a lyrical phrase that perfectly soundtracks a specific emotion or action.</p>
          <h3>The Feedback Loop</h3>
          <p>The cycle works like this: Niche community adopts the sound &rarr; TikTok algorithm recognizes high engagement &rarr; Sound is pushed to the FYP &rarr; Mainstream creators use it &rarr; Viewers search for the song on Spotify &rarr; Spotify algorithm triggers Discover Weekly inclusion.</p>
        </>
      }
      dataSignalsTable={{
        header: ['Characteristic', 'Traditional Hit', 'Momentum Song'],
        rows: [
          ['Marketing Spend', 'Front-loaded, massive', 'Incremental, reactive'],
          ['Primary Metric', 'Radio spins, playlist placement', 'UGC creations, TikTok velocity'],
          ['Lifespan', 'Short peak, rapid decay', 'Slow build, sustained long tail']
        ]
      }}
      sonicVelocityInsight={
        <p>You cannot buy a Momentum Song. You can only set the conditions for one to occur by optimizing your audio for short-form video and releasing friction (like providing stems or officially releasing the sped-up version).</p>
      }
      faqs={[
        {
          question: 'How do you measure momentum?',
          answer: 'By tracking the rate of change in UGC creations over a 24-48 hour period, and analyzing the conversion rate of those views into DSP streams (the spillover effect).'
        },
        {
          question: 'Can any genre produce a momentum song?',
          answer: 'Yes, but genres that are inherently danceable, culturally specific, or emotionally evocative tend to perform best in algorithmic environments.'
        }
      ]}
      relatedReading={[
        { title: 'Song Trend Signals', href: `/song-trend-signals`, description: 'Learn how to track these signals.' },
        { title: 'Indonesian Music Trends 2026', href: `/music-trends/indonesia/2026`, description: 'See momentum songs in action in SEA.' }
      ]}
    />
  );
}
