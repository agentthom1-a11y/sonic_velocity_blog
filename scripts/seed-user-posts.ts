import { createPost } from '../lib/cms/posts';
import { initDB } from '../lib/db';

const postsData = [
  {
    "id": "sv-transmission-indo-music-trends-2026",
    "locale": "en",
    "status": "published",
    "publishedAt": "2026-04-29",
    "updatedAt": "2026-04-29",
    "category": "Music Trends",
    "signal": "Signal Strong",
    "title": "Indonesian Music Trends 2026: Dangdut Koplo, Hipdut, Melancholic Pop, and the TikTok-to-Streaming Pipeline",
    "slug": "indonesian-music-trends-2026-dangdut-koplo-hipdut-tiktok-streaming",
    "excerpt": "Indonesia's music trend cycle is being shaped by TikTok discovery, streaming validation, dangdut koplo energy, hipdut experiments, and emotional pop built for short-form storytelling.",
    "readTime": "8 min read",
    "tags": [
      "Indonesian Music",
      "Dangdut Koplo",
      "Hipdut",
      "TikTok Music",
      "Asian Pop",
      "Music Trend Forecasting",
      "Sonic Velocity"
    ],
    "seo": {
      "metaTitle": "Indonesian Music Trends 2026: Dangdut Koplo, Hipdut & TikTok Hits",
      "metaDescription": "A detailed guide to Indonesian music trends in 2026, covering dangdut koplo, hipdut, TikTok virality, melancholic pop, streaming charts, and what creators should produce next.",
      "keywords": [
        "Indonesian music trends 2026",
        "dangdut koplo viral",
        "hipdut Indonesia",
        "TikTok songs Indonesia",
        "Asian music trends",
        "music trend prediction",
        "Sonic Velocity"
      ],
      "canonicalPath": "/en/blog/indonesian-music-trends-2026-dangdut-koplo-hipdut-tiktok-streaming"
    },
    "hero": {
      "type": "editorial-gradient",
      "alt": "Abstract neon waveform showing Indonesian music trends, dangdut koplo rhythm, TikTok virality, and streaming analytics",
      "imagePrompt": "High-quality editorial hero image for a music technology blog. Abstract neon waveform, Indonesian urban night energy, dangdut koplo rhythm pattern, TikTok short-form culture, streaming data dashboard, futuristic black and electric blue color palette, premium SaaS style, no text."
    },
    "aiAnswer": "The strongest Indonesian music trends for 2026 are dangdut koplo revival, hipdut fusion, melancholic Indonesian pop, regional-language hooks, and short-form-first song structures. The winning songs usually have one instantly recognizable hook, a 10 to 20 second repeatable moment, and enough emotional identity to move from TikTok into Spotify, YouTube, and official streaming charts.",
    "content": [
      {
        "heading": "Why Indonesia Is Becoming a High-Signal Music Market",
        "body": "Indonesia is no longer just a consumption market. It is becoming a trend ignition market. Songs that start inside local social media behavior can now move into regional listening habits across Southeast Asia. The key change is that music discovery is not only happening through playlists or radio. It is happening through short-form video, fan edits, meme culture, dance clips, lyric captions, and emotional storytelling formats."
      },
      {
        "heading": "Trend 1: Dangdut Koplo Is Becoming a Modern Internet Engine",
        "body": "Dangdut koplo works extremely well in short-form environments because it is rhythmic, immediate, and physically reactive. The beat invites movement before the listener even knows the full song. In 2026, the strongest koplo releases are likely to use cleaner production, heavier low-end, faster hooks, and remix-friendly arrangements that make them easy for DJs, creators, and fan accounts to reuse."
      },
      {
        "heading": "Trend 2: Hipdut Is the Bridge Between Street Pop and Dance Culture",
        "body": "Hipdut, the blend of hip-hop attitude and dangdut rhythmic identity, is one of Indonesia's most commercially interesting directions. It gives artists the language of modern youth culture while keeping the body movement and local familiarity of dangdut. Tracks in this lane can travel because they feel local, funny, emotional, and danceable at the same time."
      },
      {
        "heading": "Trend 3: Melancholic Pop Still Wins the Caption Economy",
        "body": "Indonesian listeners respond strongly to emotional pop because it matches the way short-form platforms are used: night drives, heartbreak captions, healing edits, friendship memories, and relationship storytelling. A song does not need to be fast to go viral. It needs a lyric that can become a caption and a melody that can survive being looped for 15 seconds."
      },
      {
        "heading": "Trend 4: Regional Language Is a Growth Advantage",
        "body": "Javanese, Sundanese, Minang, Ambonese, and other local-language textures can give a song instant identity. The next wave of Indonesian hits will not always sound like generic global pop. The advantage is cultural specificity. Regional phrasing, slang, humor, and vocal tone can make a track feel more authentic and more shareable."
      },
      {
        "heading": "Trend 5: TikTok Discovery Must Convert Into Streaming Proof",
        "body": "A song going viral is only the first checkpoint. The real signal is whether that moment converts into repeat listening, playlist adds, YouTube searches, lyric video engagement, and official chart movement. For Sonic Velocity, the best trend model should not only detect social spikes. It should also check whether the track is forming durable listening behavior."
      },
      {
        "heading": "Sonic Velocity Production Playbook",
        "body": "For producers and labels, the practical formula is simple: create one hook that is strong enough for short video, one chorus that is strong enough for streaming, and one identity layer that is local enough to be remembered. For Indonesian music, that identity layer can be a koplo drum pattern, a regional phrase, a street-pop chant, a comedic lyric, or a heartbreak line that sounds native to Indonesian internet culture."
      }
    ],
    "trendSignals": [
      "Short hook appears repeatedly in TikTok edits and Reels",
      "YouTube search volume grows after the TikTok spike",
      "Lyrics become captions or comment phrases",
      "Dance or meme format can be copied by non-musicians",
      "Song appears in Spotify playlists or official streaming charts",
      "Regional-language snippets are repeated by users outside the original region"
    ],
    "creatorChecklist": [
      "Build a 12-second hook before finishing the full arrangement",
      "Create one clean chorus, one sped-up version, and one koplo/remix-friendly edit",
      "Prepare lyric captions in Indonesian and English",
      "Release vertical performance clips before the official video",
      "Track TikTok usage, YouTube search, Spotify saves, and comments separately"
    ],
    "faq": [
      {
        "question": "What is the biggest Indonesian music trend in 2026?",
        "answer": "The strongest trend is the combination of short-form virality with local genre identity, especially dangdut koplo, hipdut, melancholic pop, and regional-language hooks."
      },
      {
        "question": "Why does dangdut koplo work well on TikTok?",
        "answer": "Dangdut koplo is rhythmic, physical, and instantly reactive. It gives creators an easy beat for dance, comedy, edits, and crowd-energy content."
      },
      {
        "question": "What should Indonesian artists optimize for?",
        "answer": "Artists should optimize for a memorable short hook, repeatable lyric, vertical video moment, and streaming-ready chorus."
      }
    ],
    "cta": {
      "title": "Detect the next Indonesian hit before it peaks.",
      "body": "Use Sonic Velocity to monitor viral hooks, genre shifts, and streaming momentum across Indonesia and Southeast Asia.",
      "buttonText": "Explore Sonic Velocity Trend Radar",
      "buttonHref": "/en"
    },
    "sources": [
      {
        "title": "Official Indonesia Chart and Official Southeast Asia Charts methodology",
        "url": "https://www.ifpi.org/stars-gather-to-celebrate-the-rebrand-of-the-asiri-chart-to-the-official-indonesia-chart-as-part-of-the-launch-of-the-regional-hub-for-south-east-asia/"
      },
      {
        "title": "Official Southeast Asia Charts homepage",
        "url": "https://www.officialseacharts.com/"
      },
      {
        "title": "Telkomsel list of viral TikTok songs in Indonesia 2025",
        "url": "https://www.telkomsel.com/jelajah/jelajah-lifestyle/10-lagu-viral-tiktok-paling-hits-2025-buruan-masukin-playlist"
      }
    ]
  },
  {
    "id": "sv-transmission-asian-music-trends-2026",
    "locale": "en",
    "status": "published",
    "publishedAt": "2026-04-29",
    "updatedAt": "2026-04-29",
    "category": "Asia Music Intelligence",
    "signal": "Signal Rising",
    "title": "Asian Music Trends 2026: Why K-Pop, J-Pop, C-Pop, and Southeast Asian Sounds Are Entering One Connected Growth Cycle",
    "slug": "asian-music-trends-2026-kpop-jpop-cpop-southeast-asia",
    "excerpt": "Asia's music market is moving into a connected growth cycle where K-pop systems, J-pop physical fandom, China's streaming scale, and Southeast Asia's social virality reinforce each other.",
    "readTime": "9 min read",
    "tags": [
      "Asian Music",
      "K-Pop",
      "J-Pop",
      "C-Pop",
      "Southeast Asia",
      "Streaming",
      "Fan Economy",
      "Music Intelligence"
    ],
    "seo": {
      "metaTitle": "Asian Music Trends 2026: K-Pop, J-Pop, C-Pop & SEA Growth",
      "metaDescription": "Explore the biggest Asian music trends in 2026: K-pop global systems, J-pop physical fandom, China streaming growth, Southeast Asian virality, and AI-powered music discovery.",
      "keywords": [
        "Asian music trends 2026",
        "K-pop trends",
        "J-pop trends",
        "C-pop growth",
        "Southeast Asian music",
        "Asia streaming music market",
        "music fan economy"
      ],
      "canonicalPath": "/en/blog/asian-music-trends-2026-kpop-jpop-cpop-southeast-asia"
    },
    "hero": {
      "type": "editorial-gradient",
      "alt": "Futuristic map of Asia made of waveforms, streaming signals, concert lights, and fan community data",
      "imagePrompt": "Premium editorial hero image for Asian music trends. Futuristic Asia map made of audio waveforms, K-pop concert lights, J-pop vinyl and CD culture, C-pop streaming data, Southeast Asian mobile-first creators, neon black blue purple palette, high quality SaaS publication style, no text."
    },
    "aiAnswer": "The biggest Asian music trend in 2026 is regional convergence. K-pop provides globalized artist systems, J-pop shows the power of physical fandom and anime-linked discovery, C-pop is scaling through China's streaming growth, and Southeast Asia is becoming a social-first trend engine. Together, these markets are creating a faster, more connected Asian music cycle.",
    "content": [
      {
        "heading": "Asia Is No Longer a Set of Separate Music Markets",
        "body": "Asian music used to be analyzed as separate scenes: K-pop in Korea, J-pop in Japan, Mandopop and C-pop in China, and local pop scenes across Southeast Asia. In 2026, that model is too slow. Fans now discover across platforms, languages, edits, subtitles, dance formats, anime fandoms, and creator communities. The result is one connected trend loop."
      },
      {
        "heading": "K-Pop: The Operating System for Global Fandom",
        "body": "K-pop remains the clearest example of music as a full-stack entertainment system. The song is only one layer. The complete product includes choreography, visual identity, fan community, short-form challenges, live performance, merch, documentaries, livestreams, and global social coordination. For Sonic Velocity, K-pop is useful because it shows how a track becomes an ecosystem."
      },
      {
        "heading": "J-Pop: Physical Fandom, Anime Discovery, and Long-Tail Loyalty",
        "body": "Japan remains one of the world's most important recorded music markets and continues to show the commercial power of physical formats. J-pop and anime-linked music also have strong long-tail behavior: a track can travel internationally through anime openings, gaming edits, vocal covers, and fan translations. This makes Japan different from purely playlist-driven markets."
      },
      {
        "heading": "C-Pop and China: Streaming Scale Meets Platform Control",
        "body": "China's music growth matters because scale changes the gravity of the entire region. When a large market accelerates, it affects licensing, artist collaborations, fan exports, and regional business strategy. For trend intelligence, China should be monitored not only by global platforms but also by local ecosystem behavior, creator edits, and fan community movements."
      },
      {
        "heading": "Southeast Asia: The Social-First Trend Laboratory",
        "body": "Southeast Asia is a mobile-first music laboratory. Songs can cross borders quickly when they are attached to dances, memes, emotional captions, local pride, food culture, football edits, Ramadan/Eid moments, or school-life content. Indonesia, Thailand, Vietnam, the Philippines, Malaysia, and Singapore each have their own taste signals, but the region increasingly behaves like a connected discovery network."
      },
      {
        "heading": "The New Asian Hit Formula",
        "body": "The Asian hit formula is no longer only about melody and production. It is about modularity. A modern Asian hit needs a short-form hook, a fan-editable visual moment, a platform-native chorus, subtitle-friendly lyrics, a remix path, and a cultural identity that can be understood even before full translation."
      },
      {
        "heading": "What Sonic Velocity Should Track",
        "body": "A strong Asian music intelligence system should track five layers: platform velocity, fan community language, remix behavior, cross-market chart movement, and identity signals. A song that appears in Korean edits, Indonesian TikTok videos, Japanese anime communities, and Thai dance covers is no longer a local track. It is a regional signal."
      }
    ],
    "trendSignals": [
      "Song moves from one Asian market into another within 7 to 21 days",
      "Fan edits appear in multiple languages",
      "Dance challenge is copied outside the artist's home country",
      "Anime, gaming, or drama edits reuse the same hook",
      "Physical fandom or merch demand appears alongside streaming growth",
      "Regional chart movement confirms social media momentum"
    ],
    "creatorChecklist": [
      "Prepare subtitle-ready lyric assets",
      "Create vertical edits for dance, emotional, and performance contexts",
      "Design one visual identity that fans can copy",
      "Release clean instrumental or remix stems for creator culture",
      "Monitor official charts and social signals together, not separately"
    ],
    "faq": [
      {
        "question": "What is the biggest Asian music trend in 2026?",
        "answer": "The biggest trend is convergence. K-pop, J-pop, C-pop, and Southeast Asian scenes are increasingly connected through streaming, short-form video, fandom, and cross-border discovery."
      },
      {
        "question": "Why is Southeast Asia important for music trends?",
        "answer": "Southeast Asia is mobile-first, social-first, and highly responsive to viral hooks, making it a powerful early signal region for music discovery."
      },
      {
        "question": "How should labels track Asian music momentum?",
        "answer": "Labels should combine chart data, TikTok usage, YouTube search, fan translations, remix activity, and cross-market playlist movement."
      }
    ],
    "cta": {
      "title": "Map Asia's next music wave before it becomes global.",
      "body": "Sonic Velocity helps creators and labels detect cross-market signals from Indonesia, Korea, Japan, China, and Southeast Asia.",
      "buttonText": "Start Mapping Trends",
      "buttonHref": "/en"
    },
    "sources": [
      {
        "title": "IFPI Global Music Report 2026",
        "url": "https://www.ifpi.org/global-music-report-2026-global-recorded-music-revenues-grow-6-4-as-record-companies-drive-innovation/"
      },
      {
        "title": "Official Southeast Asia Charts",
        "url": "https://www.officialseacharts.com/"
      },
      {
        "title": "Official Indonesia Chart launch by IFPI",
        "url": "https://www.ifpi.org/stars-gather-to-celebrate-the-rebrand-of-the-asiri-chart-to-the-official-indonesia-chart-as-part-of-the-launch-of-the-regional-hub-for-south-east-asia/"
      }
    ]
  },
  {
    "id": "sv-transmission-local-culture-global-music-signal",
    "locale": "en",
    "status": "published",
    "publishedAt": "2026-04-29",
    "updatedAt": "2026-04-29",
    "category": "Culture Signal",
    "signal": "Signal Volatile",
    "title": "From Local Culture to Global Sound: How Indonesian Internet Moments Can Become Asian Music Signals",
    "slug": "local-culture-global-sound-indonesian-internet-moments-asian-music-signals",
    "excerpt": "Indonesia's viral culture shows how local traditions, regional identity, dance, humor, and short-form video can become global music and entertainment signals.",
    "readTime": "7 min read",
    "tags": [
      "Indonesian Culture",
      "Viral Music",
      "Aura Farming",
      "Pacu Jalur",
      "Short-Form Video",
      "Asian Internet Culture",
      "Music Discovery"
    ],
    "seo": {
      "metaTitle": "How Indonesian Viral Culture Becomes Global Music Signals",
      "metaDescription": "A Sonic Velocity analysis of how Indonesian culture, dance, short-form video, regional identity, and meme behavior can create global music trend signals across Asia.",
      "keywords": [
        "Indonesian viral culture",
        "Asian music signals",
        "Aura Farming trend",
        "Pacu Jalur",
        "TikTok music trends",
        "local culture global music",
        "short form video music"
      ],
      "canonicalPath": "/en/blog/local-culture-global-sound-indonesian-internet-moments-asian-music-signals"
    },
    "hero": {
      "type": "editorial-gradient",
      "alt": "Indonesian cultural dance silhouette transformed into global music waveforms and social media signal maps",
      "imagePrompt": "High-quality editorial hero image. Indonesian cultural movement silhouette, boat festival energy, music waveform expanding into Asia map, social media signal nodes, cinematic neon black and gold, premium music technology publication style, no text."
    },
    "aiAnswer": "Indonesian internet moments become global music signals when local identity is easy to copy, visually distinctive, emotionally positive, and attached to a repeatable rhythm or gesture. The most powerful signals are not generic. They are culturally specific enough to feel fresh, but simple enough for global audiences to imitate.",
    "content": [
      {
        "heading": "The Next Hit May Start as Culture, Not a Song",
        "body": "Music trend forecasting often starts with charts. But in Asia, many signals now start before the song becomes the center. A gesture, dance, meme, local festival, street phrase, food trend, school joke, or regional pride moment can become the container that later pushes a sound. The culture moves first. The music follows."
      },
      {
        "heading": "Why Indonesian Culture Travels Well Online",
        "body": "Indonesian internet culture is expressive, humorous, community-driven, and visually adaptive. It can turn local moments into mass participation formats. When a trend is easy to imitate but still carries a strong cultural flavor, it has the perfect shape for cross-border travel."
      },
      {
        "heading": "The Aura Farming Lesson",
        "body": "The viral Aura Farming moment around Rayyan Arkan Dikha and the Pacu Jalur context shows how a local performance can become a global social format. The key was not only the dance. It was the attitude: calm presence, repeatable movement, strong visual framing, and a phrase that the internet could instantly understand."
      },
      {
        "heading": "How This Connects to Music",
        "body": "Every viral cultural format needs sound. Sometimes the sound is already attached to the original video. Sometimes creators add a new track later. Either way, the cultural format creates demand for music that matches the movement. This is where producers can win: by understanding the emotional tempo of the trend before everyone else uploads a generic remix."
      },
      {
        "heading": "The Sonic Velocity Signal Model",
        "body": "A music intelligence platform should watch cultural signals before they become music signals. That means tracking dance gestures, repeated phrases, meme captions, creator reuse, regional pride comments, and the speed at which a local format is copied by users in other countries. When those signals appear together, a music opportunity is forming."
      },
      {
        "heading": "What Producers Should Build",
        "body": "The best response is not to copy the culture superficially. Producers should build respectful, locally aware tracks that match the energy of the moment. If the trend is confident and minimal, the beat should leave space. If the trend is comic, the hook should be playful. If the trend is emotional, the melody should give creators a caption-ready moment."
      },
      {
        "heading": "The Bigger Opportunity for Indonesia",
        "body": "Indonesia has the population, platform behavior, regional diversity, and musical vocabulary to become one of Asia's strongest cultural signal engines. The opportunity is to convert local creativity into better music products, better artist discovery, and stronger global storytelling."
      }
    ],
    "trendSignals": [
      "A local gesture or phrase becomes repeated by creators",
      "The trend has a clear movement pattern that can be copied",
      "Foreign accounts recreate the format without fully knowing the original context",
      "Comment sections show curiosity about the culture behind the clip",
      "Producers begin uploading remixes or edits using the same visual language",
      "The trend creates demand for a matching beat, chant, or hook"
    ],
    "creatorChecklist": [
      "Identify the original cultural context before making derivative content",
      "Match the tempo and emotion of the trend instead of forcing a random beat",
      "Use captions that explain the cultural source respectfully",
      "Create a short version for TikTok and a full version for streaming",
      "Monitor whether the format spreads across countries, not only across views"
    ],
    "faq": [
      {
        "question": "Can local Indonesian culture become a global music trend?",
        "answer": "Yes. Local culture can become a global music trend when it is visually distinct, easy to imitate, emotionally clear, and connected to a repeatable sound or rhythm."
      },
      {
        "question": "What should music producers learn from viral cultural moments?",
        "answer": "Producers should learn the emotional tempo, movement pattern, and cultural context of the trend before creating remixes or original tracks."
      },
      {
        "question": "Why is this important for Sonic Velocity?",
        "answer": "Because the earliest music signals often appear as cultural behavior first. Detecting those behaviors early helps predict what sounds, genres, and hooks may rise next."
      }
    ],
    "cta": {
      "title": "Turn culture signals into music intelligence.",
      "body": "Sonic Velocity tracks the moments before they become hits: movements, memes, hooks, regional identity, and cross-border fan behavior.",
      "buttonText": "Analyze Culture Signals",
      "buttonHref": "/en"
    },
    "sources": [
      {
        "title": "Indiatimes report on the Aura Farming trend and Rayyan Arkan Dikha",
        "url": "https://www.indiatimes.com/trending/what-is-aura-farming-viral-indonesian-boat-kid-trend-has-everyone-hooked-from-travis-kelce-to-bts-jungkook-and-v/articleshow/122789567.html"
      },
      {
        "title": "Official Southeast Asia Charts",
        "url": "https://www.officialseacharts.com/"
      },
      {
        "title": "IFPI Global Music Report 2026",
        "url": "https://www.ifpi.org/global-music-report-2026-global-recorded-music-revenues-grow-6-4-as-record-companies-drive-innovation/"
      }
    ]
  }
];

function generateMarkdown(post: any): string {
  let md = '';

  if (post.aiAnswer) {
    md += `## Executive Summary\n${post.aiAnswer}\n\n`;
  }

  if (post.content && Array.isArray(post.content)) {
    post.content.forEach((section: any) => {
      md += `## ${section.heading}\n${section.body}\n\n`;
    });
  }

  if (post.trendSignals && Array.isArray(post.trendSignals)) {
    md += `## Key Trend Signals\n`;
    post.trendSignals.forEach((signal: string) => {
      md += `- ${signal}\n`;
    });
    md += `\n`;
  }

  if (post.creatorChecklist && Array.isArray(post.creatorChecklist)) {
    md += `## Creator Checklist\n`;
    post.creatorChecklist.forEach((item: string) => {
      md += `- [ ] ${item}\n`;
    });
    md += `\n`;
  }

  if (post.faq && Array.isArray(post.faq)) {
    md += `## Frequently Asked Questions\n`;
    post.faq.forEach((faq: any) => {
      md += `**${faq.question}**\n${faq.answer}\n\n`;
    });
  }

  if (post.sources && Array.isArray(post.sources)) {
    md += `## References & Sources\n`;
    post.sources.forEach((source: any) => {
      md += `- [${source.title}](${source.url})\n`;
    });
    md += `\n`;
  }

  return md.trim();
}

async function runSeed() {
  initDB();
  console.log('Seeding blog posts...');
  
  for (const post of postsData) {
    const mdContent = generateMarkdown(post);
    
    // Convert 'published' status from JSON to our PostStatus type, fallback to draft
    const status = (post.status === 'published' ? 'published' : 'draft') as 'published' | 'draft';

    const input = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      contentMarkdown: mdContent,
      categoryName: post.category,
      tags: post.tags,
      status: status,
      featured: false,
      authorName: 'Sonic Velocity',
      seoTitle: post.seo?.metaTitle || post.title,
      metaDescription: post.seo?.metaDescription || post.excerpt,
      canonicalUrl: post.seo?.canonicalPath,
      locale: post.locale || 'en',
      sourceType: 'ai_agent' as const,
      aiSummary: post.aiAnswer,
      publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString()
    };

    try {
      const created = createPost(input, 'system');
      console.log(`✅ Created: ${created.title}`);
    } catch (err: any) {
      console.error(`❌ Failed to create ${post.title}:`, err.message);
    }
  }

  console.log('Seeding complete.');
}

runSeed();
