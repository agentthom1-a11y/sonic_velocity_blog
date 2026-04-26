
import { BlogPost, Category, SiteConfig } from './types';

export const SITE_CONFIG: SiteConfig = {
  brand: "Sonic Velocity",
  publicationTitle: "Transmissions",
  subtitle: "Hipdut Artists, Breakout Tracks, and Momentum Songs",
  defaultAuthor: "Sonic Velocity",
  defaultLanguage: "en",
  defaultOgImage: "/images/og/sonic-velocity-default.jpg"
};

export const CATEGORIES: Category[] = [
  {
    slug: "engineering",
    name: "Engineering",
    description: "Inference, audio systems, model tuning, and production pipelines."
  },
  {
    slug: "product",
    name: "Product",
    description: "Features, workflows, creative tools, and new releases."
  },
  {
    slug: "culture",
    name: "Culture",
    description: "Music identity, internet-native genres, and evolving scenes."
  },
  {
    slug: "scene-radar",
    name: "Scene Radar",
    description: "Fast reads on hype, virality, creator behavior, and trend motion."
  },
  {
    slug: "archive",
    name: "Archive",
    description: "Origins, genre memory, and the sounds behind today’s signals."
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "hipdut-artist-001",
    slug: "tenxi-naykilla-jemsii-the-trio-that-opened-the-door",
    category: "Culture",
    featured: true,
    publishedAt: "2026-04-25",
    date: "2026.04.25",
    title: "Tenxi, Naykilla, Jemsii: The Trio That Opened the Door",
    excerpt: "Every fast-moving sound needs a public face. For hipdut, this trio became one of the clearest entry points.",
    readingTime: "5 min read",
    tags: ["tenxi", "naykilla", "jemsii", "hipdut", "breakout artists"],
    seoTitle: "Tenxi, Naykilla, Jemsii: The Trio That Opened the Door | Sonic Velocity",
    metaDescription: "How Tenxi, Naykilla, and Jemsii became one of the defining faces of hipdut’s rise.",
    image: "https://images.unsplash.com/photo-1514525253344-f85653b743fb?auto=format&fit=crop&q=80&w=1200",
    coverAlt: "Three silhouettes standing in front of a glowing waveform gate",
    author: "Sonic Velocity",
    views: 18400,
    content: "Every genre wave needs a recognizable shape. Not just a sound, but a set of names that helps the public understand where the energy is coming from. For hipdut, Tenxi, Naykilla, and Jemsii became exactly that kind of signal.\n\n## The Power of Presence\n\nWhat made the trio stand out was not only chemistry. It was positioning. The sound felt young without sounding disposable, local without sounding stuck, and catchy without losing edge. That balance matters more than people realize.\n\nOnce a trio or collective becomes shorthand for a movement, discovery speeds up. Audiences stop asking whether the sound is real and start asking what else belongs in the same lane.\n\nThat is the moment a trend begins to behave like a scene. The names stop being isolated artists and start becoming reference points."
  },
  {
    id: "hipdut-track-002",
    slug: "garam-and-madu-was-more-than-a-hit",
    category: "Scene Radar",
    featured: true,
    publishedAt: "2026-04-24",
    date: "2026.04.24",
    title: "Garam & Madu Was More Than a Hit",
    excerpt: "Some breakout songs get replayed. The bigger ones also teach the public how to hear a whole genre.",
    readingTime: "5 min read",
    tags: ["garam dan madu", "breakout song", "hipdut", "viral music", "indonesia"],
    seoTitle: "Garam & Madu Was More Than a Hit | Sonic Velocity",
    metaDescription: "Why Garam & Madu functioned as a breakout record and a genre-defining signal for hipdut.",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200",
    coverAlt: "Glowing sugar and salt textures forming an audio waveform",
    author: "Sonic Velocity",
    views: 24500,
    content: "A breakout record does not just perform well. It gives people a quick way to understand the wider sound around it. That is what makes certain songs bigger than their stream count.\n\n### Condensing the Logic\n\nGaram & Madu mattered because it condensed the emotional, rhythmic, and social logic of hipdut into a form that people could recognize immediately. It carried feeling, movement, and repeat value in one package.\n\nAfter a song like this lands, the audience starts hearing the genre more fluently. The next artist does not have to explain the sound from zero. The track has already done some of that work.\n\nThat is how songs stop being hits and start acting like doors."
  },
  {
    id: "hipdut-artist-003",
    slug: "naykilla-and-the-soft-power-of-recognition",
    category: "Culture",
    featured: false,
    publishedAt: "2026-04-23",
    date: "2026.04.23",
    title: "Naykilla and the Soft Power of Recognition",
    excerpt: "Not every breakout presence needs to be loud. Sometimes memorability comes from tone, timing, and emotional legibility.",
    readingTime: "4 min read",
    tags: ["naykilla", "artist profile", "hipdut", "vocal identity", "music culture"],
    seoTitle: "Naykilla and the Soft Power of Recognition | Sonic Velocity",
    metaDescription: "How recognizability, tone, and emotional clarity shape artist momentum in fast-moving music culture.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200",
    coverAlt: "Minimal portrait silhouette with soft audio glow around the voice line",
    author: "Sonic Velocity",
    views: 12100,
    content: "In fast-discovery environments, recognizability matters as much as range. The audience often does not spend enough time with a track to admire technical complexity on the first pass. They respond to what feels immediate and memorable.\n\n### The Legibility Factor\n\nThat is why certain artists break through by becoming emotionally legible very quickly. A voice, a phrase, a tone, or a certain kind of restraint can become more powerful than overstatement.\n\nWhat looks subtle in a traditional music context can become highly effective in social circulation. People remember what they can place inside a mood.\n\nThis is one reason why breakout movements often need artists who can carry not just energy, but emotional recall."
  },
  {
    id: "hipdut-artist-004",
    slug: "why-tenxi-feels-like-a-scene-shaper",
    category: "Archive",
    featured: false,
    publishedAt: "2026-04-22",
    date: "2026.04.22",
    title: "Why Tenxi Feels Like a Scene Shaper",
    excerpt: "Some figures do more than appear on a trend. They help define how the trend sounds in public.",
    readingTime: "5 min read",
    tags: ["tenxi", "scene shaper", "hipdut", "music production", "artist momentum"],
    seoTitle: "Why Tenxi Feels Like a Scene Shaper | Sonic Velocity",
    metaDescription: "What makes certain artists feel central to a movement instead of merely present inside it.",
    image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&q=80&w=1200",
    coverAlt: "Producer figure surrounded by pulsing beat grids and waveform maps",
    author: "Sonic Velocity",
    views: 9400,
    content: "In every genre wave, there are names that feel bigger than their individual credits. They begin to represent a kind of sonic direction. Once that happens, the public starts reading them less as participants and more as scene shapers.\n\n### Defining the Direction\n\nThat role usually comes from a mix of timing, taste, and repeatable identity. The artist appears in the right records, but also helps stabilize what the movement sounds like in people’s heads.\n\nThis kind of influence is easy to underestimate because it often happens before the wider industry finds a formal label for it.\n\nBy the time the public starts naming the wave, the scene shaper has already done part of the design work."
  },
  {
    id: "hipdut-track-005",
    slug: "malu-malu-and-the-second-wave-effect",
    category: "Scene Radar",
    featured: false,
    publishedAt: "2026-04-21",
    date: "2026.04.21",
    title: "Malu Malu and the Second-Wave Effect",
    excerpt: "A trend becomes more serious when follow-up tracks start carrying momentum of their own.",
    readingTime: "4 min read",
    tags: ["malu malu", "dia", "indahkus", "hipdut", "second wave"],
    seoTitle: "Malu Malu and the Second-Wave Effect | Sonic Velocity",
    metaDescription: "Why second-wave tracks matter and what they reveal about genre durability beyond one breakout song.",
    image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=1200",
    coverAlt: "Second pulse wave following a larger first signal across a dark screen",
    author: "Sonic Velocity",
    views: 7800,
    content: "The first breakout track creates recognition. The second wave decides whether the genre can hold attention beyond one viral peak.\n\n### Beyond the Spark\n\nThat is why follow-up songs matter so much. They prove whether audiences are interested in the wider format or only in one unusually successful moment.\n\nSecond-wave tracks do not need to copy the original spark exactly. In fact, they work best when they preserve the emotional and rhythmic logic while shifting the mood just enough to keep the lane alive.\n\nA scene becomes durable when the public stops asking for the same song again and starts asking for the next song in the same world."
  },
  {
    id: "hipdut-track-006",
    slug: "the-breakout-song-blueprint",
    category: "Culture",
    featured: false,
    publishedAt: "2026-04-20",
    date: "2026.04.20",
    title: "The Breakout Song Blueprint",
    excerpt: "Why some tracks cross from playlist material into public shorthand for a whole sound.",
    readingTime: "5 min read",
    tags: ["breakout songs", "music trend", "hipdut", "viral tracks", "genre signal"],
    seoTitle: "The Breakout Song Blueprint | Sonic Velocity",
    metaDescription: "What separates a good song from a breakout song that teaches the public how to hear a genre.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
    coverAlt: "Blueprint lines over a soundwave showing hook, beat, and release points",
    author: "Sonic Velocity",
    views: 11200,
    content: "Not every catchy song becomes a breakout record. The ones that do usually combine several forms of usefulness at once: emotional clarity, rhythm strength, quotable lines, social repeatability, and enough identity to feel different from generic playlist filler.\n\n### The Converter\n\nA breakout song works like a converter. It turns a niche or rising sound into something the wider public can process quickly.\n\nOnce that happens, the audience begins using the track as a reference object. They compare new releases against it, build jokes around it, dance to it, and attach moods to it.\n\nThat is the point where a song starts behaving like infrastructure for a trend."
  },
  {
    id: "hipdut-artist-007",
    slug: "artists-dont-just-drop-songs-they-drop-entry-points",
    category: "Product",
    featured: false,
    publishedAt: "2026-04-19",
    date: "2026.04.19",
    title: "Artists Don’t Just Drop Songs. They Drop Entry Points.",
    excerpt: "In feed-native music culture, a good release creates a whole lane of curiosity around the artist and the sound.",
    readingTime: "5 min read",
    tags: ["artist strategy", "music releases", "hipdut", "audience growth", "discovery"],
    seoTitle: "Artists Don’t Just Drop Songs. They Drop Entry Points. | Sonic Velocity",
    metaDescription: "A strong release creates curiosity not only about the song, but about the wider world around the artist and genre.",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=1200",
    coverAlt: "Multiple glowing path lines branching from a single audio node",
    author: "Sonic Velocity",
    views: 6300,
    content: "Release strategy is changing because the audience is changing. People rarely discover artists through one stable path anymore. They arrive through clips, moods, jokes, edits, reposts, crowd videos, and fragments.\n\n### Lanes of Curiosity\n\nThat means a track must do more than sound good. It must create a lane of curiosity. It needs to make people wonder who else sounds like this, what other songs belong here, and whether the artist has a wider world behind the moment.\n\nIn this environment, songs function as entry points into a system of taste.\n\nThe artists who benefit most are the ones whose releases suggest a larger world instead of ending at the hook."
  },
  {
    id: "hipdut-track-008",
    slug: "momentum-songs-are-different-from-hit-songs",
    category: "Scene Radar",
    featured: false,
    publishedAt: "2026-04-18",
    date: "2026.04.18",
    title: "Momentum Songs Are Different From Hit Songs",
    excerpt: "A hit can dominate attention. A momentum song changes what people look for next.",
    readingTime: "4 min read",
    tags: ["momentum songs", "hit songs", "hipdut", "trend dynamics", "music culture"],
    seoTitle: "Momentum Songs Are Different From Hit Songs | Sonic Velocity",
    metaDescription: "Some songs get huge. Others do something more strategic: they reshape audience expectation and move a whole trend forward.",
    image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?auto=format&fit=crop&q=80&w=1200",
    coverAlt: "Two diverging sound graphs labeled hit and momentum",
    author: "Sonic Velocity",
    views: 8900,
    content: "A hit song wins attention in the present. A momentum song does something subtler and often more powerful. It changes what audiences expect next.\n\n### Reshaping Expectations\n\nWhen a momentum song lands, listeners start scanning for adjacent sounds. They become more open to a lane they may have ignored before. The release expands appetite.\n\nThat effect is especially important for rising genres. One strong track can make editors, creators, playlist curators, and casual listeners more willing to engage the next artist in line.\n\nThe smartest scenes know how to turn hits into momentum before the public moves on."
  },
  {
    id: "ai-music-marketing-2026",
    slug: "ai-music-marketing-viral-trend-forecasting-guide",
    category: "Product",
    featured: true,
    publishedAt: "2026-04-26",
    date: "2026.04.26",
    title: "AI Music Marketing: The 2026 Guide to Viral Trend Forecasting",
    excerpt: "Stop reacting to trends and start predicting them. Learn how AI-powered sentiment analysis and neural-gen hooks are changing the game for independent artists.",
    readingTime: "7 min read",
    tags: ["music marketing", "ai trends", "viral growth", "tiktok strategy", "artist growth"],
    seoTitle: "AI Music Marketing 2026: Forecast Trends & Go Viral | Sonic Velocity",
    metaDescription: "Master AI music marketing in 2026. Learn how to use predictive analytics, neural-gen hooks, and hyper-local targeting to trigger viral growth on TikTok and Spotify.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200",
    coverAlt: "Futuristic digital interface showing music trend heatmaps and viral probability curves",
    author: "Sonic Velocity Strategy Team",
    views: 0,
    content: "The era of 'posting and praying' is officially over. In 2026, the distance between a bedroom demo and a global hit isn't just talent—it's data. Predictive AI has shifted the music industry from a reactive model to a proactive one.\n\n### The Shift: From Hindsight to Foresight\n\nTraditional music marketing relied on looking at yesterday's charts. Today, tools like Sonic Velocity analyze micro-rhythms, visual sentiment, and hyper-local comment data to identify 'Trend Fragments' before they hit the mainstream. If you wait for a song to trend on the TikTok Top 50, you've already missed the wave.\n\nNeural generation (Neural-Gen) isn't just about making music; it's about making *context*. By generating hooks that align with emerging visual aesthetic trends (like 'Java Bass' or 'Sync Wave'), artists can ensure their music feels like the natural soundtrack to the next viral moment.\n\n## Why Predictive Analytics is Non-Negotiable\n\n1. **Early Signal Detection:** Spotting a 4% rise in specific bpm preferences in specific regions allows for targeted ad spend.\n2. **Hook Optimization:** AI doesn't write the song for you; it identifies which 15 seconds of your track has the highest 'Stuck-in-Head' probability.\n3. **Visual Alignment:** Matching the sonic profile of your track to the visual filters currently being tested by platform algorithms.\n\n### Case Study: The 24-Hour Launch\n\nImagine an artist in Jakarta releasing a track. Sonic Velocity's engine identifies a rising interest in 'Madu-Madu' style vocal layers. The system generates 5 high-impact visual hooks for TikTok and Reels. Within 12 hours, the first 'Trend Fragment' is captured. By hour 24, the algorithm has enough high-quality signals to push the track into the regional discovery feed.\n\n## The Psychology of the Fragment\n\nAudiences no longer consume songs; they consume segments. The modern hit is built from 15-second 'Signal Loops' that are designed to be remixed, speeded up, or layered. Sonic Velocity helps you identify which fragment of your audio carries the most 'Circulation Potential'—the mathematical likelihood that a user will feel compelled to use the sound in their own content.\n\n### Engineering the Viral Hook\n\nUsing neural analysis, we can now map your audio against 10,000+ top-performing tracks in your specific sub-genre. We don't change your art; we identify the most effective gateway into it. This is about removing the friction between your creativity and the audience's attention span.\n\n## Frequently Asked Questions\n\n### Is AI replacing music marketing teams?\nNo. AI is replacing the *guesswork*. Marketing teams use Sonic Velocity to validate their intuition with hard data, allowing them to scale campaigns that already show signs of organic life.\n\n### How does predictive forecasting work?\nWe monitor metadata signals across social platforms and streaming APIs. When a specific sonic texture (like a certain synth type or drum pattern) starts appearing in high-engagement 'micro-communities', we flag it as a Trend Fragment.\n\n### Can I use this for any genre?\nWhile Sonic Velocity is optimized for fast-moving genres like Hipdut, Koplo, and Phonk, the logic of Trend Fragments applies to any artist looking to break through in a feed-native music culture.\n\nThis isn't magic. It's the engineering of momentum."
  }
];
