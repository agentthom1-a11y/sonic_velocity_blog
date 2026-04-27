export type CategorySlug =
  | "engineering"
  | "product"
  | "culture"
  | "scene-radar"
  | "archive";

export interface SiteConfig {
  brand: string;
  publicationTitle: string;
  subtitle: string;
  defaultAuthor: string;
  defaultLanguage: string;
  defaultOgImage: string;
  description: string;
  baseUrl: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
}

export interface SourceLink {
  label: string;
  url: string;
}

export interface TrendSignal {
  type: string;
  region?: string;
  platform?: string;
  strength?: number;
  confidence?: number;
  notes?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  category: CategorySlug;
  featured: boolean;
  publishedAt: string;
  date: string;
  title: string;
  excerpt: string;
  readingTime: string;
  tags: string[];
  seoTitle: string;
  metaDescription: string;
  image: string;
  imageRaw: string;
  imageFallbacks: string[];
  coverAlt: string;
  imageSource: string;
  imageSourceUrl: string;
  imageConfidence: "high" | "medium" | "fallback";
  author: string;
  views: number;
  aiSummary: string;
  entities: string[];
  searchIntent: string;
  trendSignal?: TrendSignal;
  sources: SourceLink[];
  content: string;
}

const stripProtocol = (url: string) => url.replace(/^https?:\/\//, "");

export const proxy = (url: string) =>
  `https://images.weserv.nl/?url=${encodeURIComponent(
    stripProtocol(url)
  )}&w=1200&h=675&fit=cover&output=webp`;

export const youtubeRawImage = (
  videoId: string,
  quality:
    | "maxresdefault"
    | "sddefault"
    | "hqdefault"
    | "mqdefault"
    | "default"
    | "0"
    | "1"
    | "2"
    | "3" = "hqdefault"
) => `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;

export const youtubeImage = (
  videoId: string,
  quality:
    | "maxresdefault"
    | "sddefault"
    | "hqdefault"
    | "mqdefault"
    | "default"
    | "0"
    | "1"
    | "2"
    | "3" = "hqdefault"
) => proxy(youtubeRawImage(videoId, quality));

export const pexelsImage = (idPath: string) =>
  proxy(`https://images.pexels.com/photos/${idPath}`);

const GARAm_MADU_VIDEO_ID = "ThayDqon-ys";
const MALU_MALU_VIDEO_ID = "LMIS2PMqCL0";

const musicFallback = pexelsImage("164938/pexels-photo-164938.jpeg");
const aiFallback = pexelsImage("8386440/pexels-photo-8386440.jpeg");
const stageFallback = pexelsImage("1763075/pexels-photo-1763075.jpeg");

export const SITE_CONFIG: SiteConfig = {
  brand: "Sonic Velocity",
  publicationTitle: "Transmissions",
  subtitle: "Hipdut Artists, Breakout Tracks, and Momentum Songs",
  defaultAuthor: "Sonic Velocity",
  defaultLanguage: "en",
  defaultOgImage: youtubeImage(GARAm_MADU_VIDEO_ID, "hqdefault"),
  description:
    "Sonic Velocity tracks music signals, viral genre movements, AI music marketing, and internet-native artist momentum.",
  baseUrl: "https://sonicvelocitymusic.com",
};

export const CATEGORIES: Category[] = [
  {
    slug: "engineering",
    name: "Engineering",
    description:
      "Inference, audio systems, model tuning, and production pipelines.",
  },
  {
    slug: "product",
    name: "Product",
    description:
      "Features, workflows, creative tools, AI music marketing, and new releases.",
  },
  {
    slug: "culture",
    name: "Culture",
    description:
      "Music identity, internet-native genres, creator behavior, and evolving scenes.",
  },
  {
    slug: "scene-radar",
    name: "Scene Radar",
    description:
      "Fast reads on hype, virality, creator behavior, and trend motion.",
  },
  {
    slug: "archive",
    name: "Archive",
    description:
      "Origins, genre memory, and the sounds behind today’s signals.",
  },
];

const garamMaduFallbacks = [
  youtubeImage(GARAm_MADU_VIDEO_ID, "sddefault"),
  youtubeImage(GARAm_MADU_VIDEO_ID, "maxresdefault"),
  youtubeImage(GARAm_MADU_VIDEO_ID, "mqdefault"),
  musicFallback,
];

const maluMaluFallbacks = [
  youtubeImage(MALU_MALU_VIDEO_ID, "sddefault"),
  youtubeImage(MALU_MALU_VIDEO_ID, "maxresdefault"),
  youtubeImage(MALU_MALU_VIDEO_ID, "mqdefault"),
  stageFallback,
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
    excerpt:
      "Every fast-moving sound needs a public face. For hipdut, this trio became one of the clearest entry points.",
    readingTime: "5 min read",
    tags: ["tenxi", "naykilla", "jemsii", "hipdut", "breakout artists"],
    seoTitle:
      "Tenxi, Naykilla, Jemsii: The Trio That Opened the Door | Sonic Velocity",
    metaDescription:
      "How Tenxi, Naykilla, and Jemsii became one of the defining faces of hipdut’s rise.",
    image: "/1/garam-dan-madu_169-1024x578.jpeg",
    imageRaw: "/1/garam-dan-madu_169-1024x578.jpeg",
    imageFallbacks: ["/1/Garam & Madu Was More Than a Hit.png", ...garamMaduFallbacks],
    coverAlt:
      "Tenxi Naykilla Jemsii Garam Madu hipdut viral Indonesia official music video",
    imageSource: "Local high-quality asset",
    imageSourceUrl: "/1/garam-dan-madu_169-1024x578.jpeg",
    imageConfidence: "high",
    author: "Sonic Velocity",
    views: 18400,
    aiSummary:
      "Tenxi, Naykilla, and Jemsii became a clear entry point for hipdut by giving a fast-moving genre a recognizable public face.",
    entities: ["Tenxi", "Naykilla", "Jemsii", "Hipdut", "Garam & Madu"],
    searchIntent:
      "Who are Tenxi Naykilla and Jemsii and why are they important to hipdut?",
    trendSignal: {
      type: "Artist cluster",
      region: "Indonesia",
      platform: "TikTok / YouTube",
      strength: 8.9,
      notes: "A creator cluster that helped make hipdut easier to recognize.",
    },
    sources: [
      {
        label: "Garam & Madu official music video",
        url: `https://www.youtube.com/watch?v=${GARAm_MADU_VIDEO_ID}`,
      },
      {
        label: "Garam & Madu overview",
        url: "https://en.wikipedia.org/wiki/Garam_%26_Madu_%28Sakit_Dadaku%29",
      },
    ],
    content: `
# Tenxi, Naykilla, Jemsii: The Trio That Opened the Door

Tenxi, Naykilla, and Jemsii matter because they gave hipdut a clear public entry point. In fast-moving music culture, a genre does not become visible only because the sound is interesting. It becomes visible when audiences can attach the sound to names, faces, hooks, and repeatable moments.

## What is this trio known for?

The trio is strongly associated with "Garam & Madu (Sakit Dadaku)", a breakout Indonesian track that blends hip-hop, dangdut, trap, pop, and emotional melodic delivery. The song works because it is easy to recognize in seconds. It does not ask the audience to study the genre first. It introduces the genre through feeling, repetition, rhythm, and contrast.

## Why it matters

Most genre waves fail because they stay too abstract. People hear a sound, like it, then forget what to call it. Hipdut became easier to talk about because listeners could point to a specific record and a specific artist cluster.

That is what makes Tenxi, Naykilla, and Jemsii important. They did not only release a song. They created a reference point.

## Why they became a signal

A strong trend signal has three parts: a memorable sound, a social platform use case, and a clear identity. This trio carried all three. The sound was hybrid enough to feel new, but familiar enough to spread. The hook was direct enough for short-form video. The artist names became searchable entities around the trend.

## Sonic Velocity Signal

Signal type: artist-cluster ignition.

When multiple artists become attached to one breakout sound, the audience does not only follow the song. They start following the lane. That is the difference between a viral moment and a scene beginning to form.

## Final take

Tenxi, Naykilla, and Jemsii opened the door because they made hipdut legible. They turned a hybrid sound into something audiences could identify, replay, search, and share.
`.trim(),
  },
  {
    id: "hipdut-track-002",
    slug: "garam-and-madu-was-more-than-a-hit",
    category: "Scene Radar",
    featured: true,
    publishedAt: "2026-04-24",
    date: "2026.04.24",
    title: "Garam & Madu Was More Than a Hit",
    excerpt:
      "Some breakout songs get replayed. The bigger ones also teach the public how to hear a whole genre.",
    readingTime: "6 min read",
    tags: [
      "garam dan madu",
      "breakout song",
      "hipdut",
      "viral music",
      "indonesia",
    ],
    seoTitle: "Garam & Madu Was More Than a Hit | Sonic Velocity",
    metaDescription:
      "Why Garam & Madu functioned as a breakout record and a genre-defining signal for hipdut.",
    image: "/1/Garam & Madu Was More Than a Hit.png",
    imageRaw: "/1/Garam & Madu Was More Than a Hit.png",
    imageFallbacks: ["/1/garam-dan-madu_169-1024x578.jpeg", ...garamMaduFallbacks],
    coverAlt:
      "Garam Madu Tenxi Naykilla Jemsii hipdut viral Indonesia official video",
    imageSource: "Local high-quality asset",
    imageSourceUrl: "/1/Garam & Madu Was More Than a Hit.png",
    imageConfidence: "high",
    author: "Sonic Velocity",
    views: 24500,
    aiSummary:
      "Garam & Madu was more than a viral record. It became a genre reference point for hipdut by combining emotional clarity, local rhythm, and short-form replay value.",
    entities: [
      "Garam & Madu",
      "Tenxi",
      "Naykilla",
      "Jemsii",
      "Hipdut",
      "Indonesian music",
    ],
    searchIntent:
      "Why did Garam & Madu go viral and why is it important to hipdut?",
    trendSignal: {
      type: "Genre-defining breakout",
      region: "Indonesia → Southeast Asia",
      platform: "TikTok / YouTube",
      strength: 9.2,
      notes:
        "A breakout track that helped audiences understand a genre in one listen.",
    },
    sources: [
      {
        label: "Garam & Madu official music video",
        url: `https://www.youtube.com/watch?v=${GARAm_MADU_VIDEO_ID}`,
      },
      {
        label: "Garam & Madu song overview",
        url: "https://en.wikipedia.org/wiki/Garam_%26_Madu_%28Sakit_Dadaku%29",
      },
    ],
    content: `
# Garam & Madu Was More Than a Hit

"Garam & Madu (Sakit Dadaku)" was more than a viral Indonesian song. It became a public shortcut for understanding hipdut: a hybrid sound where hip-hop structure, dangdut rhythm, electronic bounce, and emotional pop delivery can live inside one highly shareable track.

## What is Garam & Madu?

Garam & Madu is a breakout track by Tenxi, Naykilla, and Jemsii. Its power comes from contrast. The title itself creates emotional tension: salt and honey, pain and sweetness, doubt and desire. That contrast makes the song immediately understandable even before the listener thinks about genre.

## Why it matters

A normal hit gets streams. A genre-defining hit changes what listeners search for next.

Garam & Madu did not only drive attention toward itself. It made the hipdut lane easier to recognize. After a song like this breaks through, audiences begin to understand the formula: local rhythm, internet-ready bounce, emotional hook, and repeatable phrases that work inside short video.

## Why it became a signal

The song had four breakout ingredients.

First, it had hook density. The memorable parts arrive quickly and repeat cleanly.

Second, it had emotional clarity. The listener does not need a long backstory to understand the feeling.

Third, it had platform fitness. The structure works in short clips, reactions, edits, and repeated social use.

Fourth, it had cultural fit. It sounded local without feeling locked inside an older format.

## Sonic Velocity Signal

Signal type: genre ignition.

When one song teaches people how to hear a whole sound, it becomes more valuable than a normal hit. Garam & Madu acted like a gateway. It created a clear path for listeners to move from one viral record into a wider hipdut ecosystem.

## Final take

Garam & Madu was not only a song that people replayed. It was a track that organized attention. It gave hipdut a sharper public identity and showed how modern Indonesian music can move through TikTok, YouTube, and streaming culture at the same time.
`.trim(),
  },
  {
    id: "hipdut-artist-003",
    slug: "naykilla-and-the-soft-power-of-recognition",
    category: "Culture",
    featured: false,
    publishedAt: "2026-04-23",
    date: "2026.04.23",
    title: "Naykilla and the Soft Power of Recognition",
    excerpt:
      "Not every breakout presence needs to be loud. Sometimes memorability comes from tone, timing, and emotional legibility.",
    readingTime: "4 min read",
    tags: [
      "naykilla",
      "artist profile",
      "hipdut",
      "vocal identity",
      "music culture",
    ],
    seoTitle: "Naykilla and the Soft Power of Recognition | Sonic Velocity",
    metaDescription:
      "How recognizability, tone, and emotional clarity shape artist momentum in fast-moving music culture.",
    image: "/1/naykila.webp",
    imageRaw: "/1/naykila.webp",
    imageFallbacks: ["/1/garam-dan-madu_169-1024x578.jpeg", ...garamMaduFallbacks],
    coverAlt:
      "Naykilla Garam Madu hipdut Indonesia artist recognition",
    imageSource: "Local high-quality asset",
    imageSourceUrl: "/1/naykila.webp",
    imageConfidence: "high",
    author: "Sonic Velocity",
    views: 12100,
    aiSummary:
      "Naykilla shows how recognizability, emotional tone, and vocal identity can become major advantages in short-form music discovery.",
    entities: ["Naykilla", "Hipdut", "Garam & Madu", "Indonesian music"],
    searchIntent:
      "Why is Naykilla important to hipdut and viral Indonesian music?",
    trendSignal: {
      type: "Vocal recognition signal",
      region: "Indonesia",
      platform: "TikTok / YouTube",
      strength: 8.4,
      notes:
        "Recognition comes from tone and emotional legibility, not only volume or technical display.",
    },
    sources: [
      {
        label: "Garam & Madu official music video",
        url: `https://www.youtube.com/watch?v=${GARAm_MADU_VIDEO_ID}`,
      },
    ],
    content: `
# Naykilla and the Soft Power of Recognition

Naykilla represents one of the most important forces in modern music discovery: recognizability. In a feed-native environment, listeners often decide in seconds whether a voice feels familiar, emotional, and worth replaying.

## What is recognizability in music?

Recognizability is the ability of a voice, tone, phrase, or delivery style to be identified quickly. It is not the same as technical complexity. It is about memory. The audience hears the sound and immediately knows where they are emotionally.

## Why it matters

Short-form platforms reward instant clarity. A listener may not know the full artist biography. They may not even know the song title at first. But they can remember a voice, a melodic phrase, or a feeling.

That is where Naykilla’s value becomes clear. Her presence helps make a hybrid track more emotionally readable. In a genre fusion context, this matters because the audience needs an anchor.

## Why she became a signal

Hipdut combines familiar and unfamiliar elements. The beat may pull from hip-hop and trap. The rhythm may connect to dangdut. The delivery may lean pop or R&B. A recognizable voice can hold those pieces together.

Naykilla’s role is not only performance. It is orientation. She helps the listener understand what the song wants them to feel.

## Sonic Velocity Signal

Signal type: recognition anchor.

When a genre is moving fast, the artists who create emotional clarity become disproportionately important. They reduce friction. They make a new sound easier to accept.

## Final take

Naykilla’s strength is not just being present inside a viral record. Her strength is making the record easier to remember. In modern music culture, that is one of the strongest forms of soft power.
`.trim(),
  },
  {
    id: "hipdut-artist-004",
    slug: "why-tenxi-feels-like-a-scene-shaper",
    category: "Archive",
    featured: false,
    publishedAt: "2026-04-22",
    date: "2026.04.22",
    title: "Why Tenxi Feels Like a Scene Shaper",
    excerpt:
      "Some figures do more than appear on a trend. They help define how the trend sounds in public.",
    readingTime: "5 min read",
    tags: [
      "tenxi",
      "scene shaper",
      "hipdut",
      "music production",
      "artist momentum",
    ],
    seoTitle: "Why Tenxi Feels Like a Scene Shaper | Sonic Velocity",
    metaDescription:
      "What makes certain artists feel central to a movement instead of merely present inside it.",
    image: "/1/tenxi.jpg",
    imageRaw: "/1/tenxi.jpg",
    imageFallbacks: ["/1/garam-dan-madu_169-1024x578.jpeg", ...garamMaduFallbacks],
    coverAlt: "Tenxi hipdut scene shaper Garam Madu Indonesia",
    imageSource: "Local high-quality asset",
    imageSourceUrl: "/1/tenxi.jpg",
    imageConfidence: "high",
    author: "Sonic Velocity",
    views: 9400,
    aiSummary:
      "Tenxi feels like a scene shaper because his work is attached to the public sound identity of hipdut, not only to one track.",
    entities: ["Tenxi", "Hipdut", "Garam & Madu", "Indonesian music"],
    searchIntent: "Why is Tenxi considered important in the hipdut movement?",
    trendSignal: {
      type: "Scene-shaper signal",
      region: "Indonesia",
      platform: "YouTube / TikTok",
      strength: 8.6,
      notes:
        "A scene shaper standardizes how a sound is recognized by the public.",
    },
    sources: [
      {
        label: "Garam & Madu official music video",
        url: `https://www.youtube.com/watch?v=${GARAm_MADU_VIDEO_ID}`,
      },
    ],
    content: `
# Why Tenxi Feels Like a Scene Shaper

Tenxi feels like a scene shaper because his name is attached to how hipdut is publicly recognized. In music movements, some artists participate in a trend. Others help define the trend’s surface area: the sound, the pacing, the visual identity, and the way audiences describe it.

## What is a scene shaper?

A scene shaper is an artist or creator whose work becomes a reference point. They do not simply benefit from momentum. They organize it. Their songs, collaborations, and production choices help listeners understand what a movement sounds like.

## Why it matters

Genres are not born fully explained. They become legible through examples. A scene shaper creates those examples repeatedly enough that the audience begins to recognize a pattern.

For hipdut, the public did not need a lecture. It needed a song that made the fusion feel obvious. Tenxi’s association with that kind of record makes his role larger than a single credit line.

## Why Tenxi became a signal

The signal is consistency. When a creator’s name appears near the sound that audiences are trying to understand, that name starts functioning like a map. Listeners use it to find more. Platforms use it to connect similar content. Writers and fans use it to describe the lane.

## Sonic Velocity Signal

Signal type: sound-standardization.

A movement becomes stronger when people can hear a track and quickly say, "This is that sound." Scene shapers help create that recognition layer.

## Final take

Tenxi is not important only because of visibility. He is important because visibility and sound identity meet around his work. That is what turns an artist from a participant into a scene shaper.
`.trim(),
  },
  {
    id: "hipdut-track-005",
    slug: "malu-malu-and-the-second-wave-effect",
    category: "Scene Radar",
    featured: false,
    publishedAt: "2026-04-21",
    date: "2026.04.21",
    title: "Malu Malu and the Second-Wave Effect",
    excerpt:
      "A trend becomes more serious when follow-up tracks start carrying momentum of their own.",
    readingTime: "4 min read",
    tags: ["malu malu", "dia", "indahkus", "hipdut", "second wave"],
    seoTitle: "Malu Malu and the Second-Wave Effect | Sonic Velocity",
    metaDescription:
      "Why second-wave tracks matter and what they reveal about genre durability beyond one breakout song.",
    image: youtubeImage(MALU_MALU_VIDEO_ID, "hqdefault"),
    imageRaw: youtubeRawImage(MALU_MALU_VIDEO_ID, "hqdefault"),
    imageFallbacks: maluMaluFallbacks,
    coverAlt: "dia Indahkus Malu Malu official music video thumbnail Indonesia",
    imageSource: "YouTube official music video thumbnail",
    imageSourceUrl: `https://www.youtube.com/watch?v=${MALU_MALU_VIDEO_ID}`,
    imageConfidence: "high",
    author: "Sonic Velocity",
    views: 7800,
    aiSummary:
      "Malu Malu shows the second-wave effect: the moment a trend becomes more durable because follow-up songs begin carrying momentum independently.",
    entities: ["Malu Malu", "dia", "INDAHKUS", "Hipdut", "Indonesian music"],
    searchIntent:
      "What is the second-wave effect in viral Indonesian music trends?",
    trendSignal: {
      type: "Second-wave validation",
      region: "Indonesia",
      platform: "YouTube / TikTok",
      strength: 8.1,
      notes:
        "Second-wave tracks test whether a movement can survive beyond the first breakout song.",
    },
    sources: [
      {
        label: "Malu Malu official music video",
        url: `https://www.youtube.com/watch?v=${MALU_MALU_VIDEO_ID}`,
      },
    ],
    content: `
# Malu Malu and the Second-Wave Effect

Malu Malu matters because second-wave songs reveal whether a trend is becoming durable. The first breakout track creates recognition. The second wave tests whether the audience wants more of the world around that sound.

## What is the second-wave effect?

The second-wave effect happens when follow-up songs begin to move with their own momentum after an initial breakout. It is the difference between one viral record and a repeatable scene.

## Why it matters

A single hit can be random. A second wave suggests pattern. For labels, artists, playlist editors, and trend analysts, that distinction is crucial. It tells them whether the market is reacting to one song or adopting a wider listening habit.

## Why Malu Malu became a signal

Malu Malu fits the second-wave conversation because it operates in the same attention economy: short-form friendly structure, clear hook energy, and a local pop identity that can travel through clips and social repetition.

The track does not need to copy the first breakout exactly. In fact, second-wave records are stronger when they prove the lane can stretch.

## Sonic Velocity Signal

Signal type: durability test.

A trend becomes investable when more than one song can carry attention. Second-wave songs reduce the risk that a genre wave is only a one-hit anomaly.

## Final take

Malu Malu shows why second-wave records matter. They are not just follow-ups. They are proof-of-market moments for a sound that is trying to become a scene.
`.trim(),
  },
  {
    id: "hipdut-track-006",
    slug: "the-breakout-song-blueprint",
    category: "Culture",
    featured: false,
    publishedAt: "2026-04-20",
    date: "2026.04.20",
    title: "The Breakout Song Blueprint",
    excerpt:
      "Why some tracks cross from playlist material into public shorthand for a whole sound.",
    readingTime: "5 min read",
    tags: [
      "breakout songs",
      "music trend",
      "hipdut",
      "viral tracks",
      "genre signal",
    ],
    seoTitle: "The Breakout Song Blueprint | Sonic Velocity",
    metaDescription:
      "What separates a good song from a breakout song that teaches the public how to hear a genre.",
    image: musicFallback,
    imageRaw: "https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg",
    imageFallbacks: [
      youtubeImage(GARAm_MADU_VIDEO_ID, "hqdefault"),
      youtubeImage(MALU_MALU_VIDEO_ID, "hqdefault"),
      stageFallback,
    ],
    coverAlt: "Music studio mixing desk breakout song blueprint concept",
    imageSource: "Pexels fallback music studio image",
    imageSourceUrl: "https://www.pexels.com/photo/black-and-silver-mixing-console-164938/",
    imageConfidence: "fallback",
    author: "Sonic Velocity",
    views: 11200,
    aiSummary:
      "A breakout song combines hook density, emotional clarity, replay value, and cultural fit to turn a niche sound into mainstream understanding.",
    entities: [
      "Breakout Song",
      "Hipdut",
      "TikTok music trends",
      "Viral music",
    ],
    searchIntent: "What makes a song become a breakout hit?",
    trendSignal: {
      type: "Framework",
      platform: "TikTok / YouTube / Spotify",
      strength: 8.7,
      notes:
        "Breakout songs teach audiences how to hear a sound and what to search for next.",
    },
    sources: [
      {
        label: "Garam & Madu reference video",
        url: `https://www.youtube.com/watch?v=${GARAm_MADU_VIDEO_ID}`,
      },
    ],
    content: `
# The Breakout Song Blueprint

A breakout song is not just a popular track. It is a track that changes listener behavior. After a true breakout, people do not only replay the song. They search the artist, imitate the sound, follow related songs, and begin using the track as shorthand for a wider movement.

## What makes a breakout song?

The strongest breakout songs usually combine four forces: hook density, emotional clarity, replay value, and cultural fit.

Hook density means memorable moments arrive quickly. Emotional clarity means the listener understands the feeling without explanation. Replay value means the track works across full listening and short clips. Cultural fit means the song sounds like it belongs to a specific audience moment.

## Why it matters

Most songs compete for attention. Breakout songs organize attention. They help the public understand a sound category.

This is why breakout songs are strategically important. They are not only music assets. They are market education tools.

## Why breakout songs become signals

When one record starts generating related searches, reactions, covers, edits, remixes, and genre conversation, it becomes a signal. The song stops being isolated. It becomes infrastructure for discovery.

## Sonic Velocity Signal

Signal type: breakout blueprint.

A song becomes a breakout when it creates more demand than it captures. The clearest sign is when people begin looking for the next song in the same lane.

## Final take

A good song earns attention. A breakout song creates a map. It tells listeners where a sound is going and gives platforms enough behavioral data to push the lane further.
`.trim(),
  },
  {
    id: "hipdut-artist-007",
    slug: "artists-dont-just-drop-songs-they-drop-entry-points",
    category: "Product",
    featured: false,
    publishedAt: "2026-04-19",
    date: "2026.04.19",
    title: "Artists Don’t Just Drop Songs. They Drop Entry Points.",
    excerpt:
      "In feed-native music culture, a good release creates a whole lane of curiosity around the artist and the sound.",
    readingTime: "5 min read",
    tags: [
      "artist strategy",
      "music releases",
      "hipdut",
      "audience growth",
      "discovery",
    ],
    seoTitle:
      "Artists Don’t Just Drop Songs. They Drop Entry Points. | Sonic Velocity",
    metaDescription:
      "A strong release creates curiosity not only about the song, but about the wider world around the artist and genre.",
    image: youtubeImage(MALU_MALU_VIDEO_ID, "sddefault"),
    imageRaw: youtubeRawImage(MALU_MALU_VIDEO_ID, "sddefault"),
    imageFallbacks: maluMaluFallbacks,
    coverAlt:
      "Indonesian music video release strategy entry point visual thumbnail",
    imageSource: "YouTube official music video thumbnail",
    imageSourceUrl: `https://www.youtube.com/watch?v=${MALU_MALU_VIDEO_ID}`,
    imageConfidence: "medium",
    author: "Sonic Velocity",
    views: 6300,
    aiSummary:
      "Modern artists do not only release songs. They release entry points that help audiences enter a larger sound, identity, and content loop.",
    entities: [
      "Artist strategy",
      "Music releases",
      "Hipdut",
      "Audience growth",
      "Music discovery",
    ],
    searchIntent:
      "How should artists release songs in the TikTok and AI search era?",
    trendSignal: {
      type: "Release strategy",
      platform: "TikTok / YouTube / Search",
      strength: 8.3,
      notes:
        "A strong release should create curiosity around the artist, genre, and next action.",
    },
    sources: [
      {
        label: "Malu Malu official music video",
        url: `https://www.youtube.com/watch?v=${MALU_MALU_VIDEO_ID}`,
      },
    ],
    content: `
# Artists Don’t Just Drop Songs. They Drop Entry Points.

In modern music culture, a release is not only a song. It is an entry point. The best releases create a path for listeners to move from one track into an artist identity, a genre lane, a content loop, and eventually a fan relationship.

## What is an entry point?

An entry point is the first clear doorway into an artist’s world. It can be a hook, a video moment, a lyric, a danceable section, a visual identity, or a collaboration that makes the audience curious enough to continue.

## Why it matters

Discovery is no longer linear. Listeners do not always start from albums, radio, or editorial playlists. They may discover a song through a 12-second clip, a remix, a meme, a search result, or an AI answer.

That means every release needs to answer one strategic question: after someone hears this, what should they explore next?

## Why entry points become signals

When a song creates curiosity beyond itself, it becomes more valuable. The strongest releases send listeners toward artist pages, related songs, genre keywords, live performances, behind-the-scenes content, and social clips.

## Sonic Velocity Signal

Signal type: discovery architecture.

A release wins when it creates a repeatable path from attention to identity. The song gets the first click. The artist world earns the second.

## Final take

Artists should stop thinking only in terms of dropping songs. The better move is to design entry points. A strong entry point turns casual attention into directed discovery.
`.trim(),
  },
  {
    id: "hipdut-track-008",
    slug: "momentum-songs-are-different-from-hit-songs",
    category: "Scene Radar",
    featured: false,
    publishedAt: "2026-04-18",
    date: "2026.04.18",
    title: "Momentum Songs Are Different From Hit Songs",
    excerpt:
      "A hit can dominate attention. A momentum song changes what people look for next.",
    readingTime: "4 min read",
    tags: [
      "momentum songs",
      "hit songs",
      "hipdut",
      "trend dynamics",
      "music culture",
    ],
    seoTitle: "Momentum Songs Are Different From Hit Songs | Sonic Velocity",
    metaDescription:
      "Some songs get huge. Others do something more strategic: they reshape audience expectation and move a whole trend forward.",
    image: stageFallback,
    imageRaw: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
    imageFallbacks: [
      youtubeImage(GARAm_MADU_VIDEO_ID, "hqdefault"),
      youtubeImage(MALU_MALU_VIDEO_ID, "hqdefault"),
      musicFallback,
    ],
    coverAlt:
      "Live music crowd momentum songs versus hit songs trend analysis concept",
    imageSource: "Pexels fallback live music image",
    imageSourceUrl: "https://www.pexels.com/photo/people-at-concert-1763075/",
    imageConfidence: "fallback",
    author: "Sonic Velocity",
    views: 8900,
    aiSummary:
      "Hit songs dominate attention in the present. Momentum songs reshape what listeners expect and search for next.",
    entities: ["Momentum songs", "Hit songs", "Hipdut", "Trend dynamics"],
    searchIntent: "What is the difference between a hit song and a momentum song?",
    trendSignal: {
      type: "Market expansion signal",
      platform: "Streaming / TikTok / YouTube",
      strength: 8.5,
      notes:
        "Momentum songs expand demand instead of only consuming existing attention.",
    },
    sources: [
      {
        label: "Garam & Madu reference video",
        url: `https://www.youtube.com/watch?v=${GARAm_MADU_VIDEO_ID}`,
      },
    ],
    content: `
# Momentum Songs Are Different From Hit Songs

A hit song wins the present. A momentum song changes what people look for next. That difference matters because not every popular record expands the market around it.

## What is a hit song?

A hit song captures a large amount of attention. It may generate streams, views, playlist placement, social use, and cultural visibility. But a hit can still remain isolated if it does not create curiosity beyond itself.

## What is a momentum song?

A momentum song changes listener direction. After hearing it, people search related artists, similar tracks, genre names, remixes, performances, and follow-up releases. It creates movement.

## Why it matters

For artists and labels, hits are valuable. Momentum is more strategic. A momentum song can make the next release easier, increase demand for collaborations, and help define a genre lane.

For platforms, momentum songs are powerful because they create recommendation paths. The algorithm has more to connect.

## Sonic Velocity Signal

Signal type: expectation shift.

The clearest sign of a momentum song is not only views. It is follow-on behavior. Search behavior, remix behavior, cover behavior, and related listening all show that the audience wants more than one track.

## Final take

A hit song is a result. A momentum song is a force. The best records do both: they dominate the moment and expand the future market around the sound.
`.trim(),
  },
  {
    id: "ai-music-marketing-2026",
    slug: "ai-music-marketing-viral-trend-forecasting-guide",
    category: "Product",
    featured: true,
    publishedAt: "2026-04-26",
    date: "2026.04.26",
    title: "AI Music Marketing: The 2026 Guide to Viral Trend Forecasting",
    excerpt:
      "Stop reacting to trends and start predicting them. AI-powered signal detection is changing how independent artists grow.",
    readingTime: "7 min read",
    tags: [
      "music marketing",
      "ai trends",
      "viral growth",
      "tiktok strategy",
      "artist growth",
    ],
    seoTitle: "AI Music Marketing 2026: Forecast Trends & Go Viral | Sonic Velocity",
    metaDescription:
      "Master AI music marketing in 2026. Learn how to use predictive analytics, hook detection, and trend signals to trigger viral growth.",
    image: aiFallback,
    imageRaw: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
    imageFallbacks: [
      musicFallback,
      stageFallback,
      youtubeImage(GARAm_MADU_VIDEO_ID, "hqdefault"),
    ],
    coverAlt:
      "AI music marketing dashboard viral trend forecasting interface concept",
    imageSource: "Pexels fallback AI technology image",
    imageSourceUrl: "https://www.pexels.com/photo/artificial-intelligence-illustration-8386440/",
    imageConfidence: "fallback",
    author: "Sonic Velocity Strategy Team",
    views: 10420,
    aiSummary:
      "AI music marketing uses trend signals, engagement patterns, content structure, and audience behavior to predict which songs and scenes may grow before they peak.",
    entities: [
      "AI Music Marketing",
      "Viral trend forecasting",
      "TikTok music trends",
      "Artist growth",
      "Sonic Velocity",
    ],
    searchIntent:
      "How can artists use AI music marketing to forecast viral trends?",
    trendSignal: {
      type: "Predictive system",
      platform: "TikTok / Spotify / YouTube / Search",
      confidence: 0.91,
      notes:
        "AI music marketing shifts growth strategy from reactive posting to signal-led forecasting.",
    },
    sources: [
      {
        label: "YouTube thumbnail reference",
        url: `https://www.youtube.com/watch?v=${GARAm_MADU_VIDEO_ID}`,
      },
    ],
    content: `
# AI Music Marketing: The 2026 Guide to Viral Trend Forecasting

AI music marketing is the use of data, pattern recognition, creative testing, and trend signals to grow music before a trend fully peaks. The old model was simple: release, post, wait, and hope. The new model is more strategic: detect fragments early, test hooks quickly, and scale the version of the song that the audience already proves they want.

## What is AI music marketing?

AI music marketing combines creative strategy with signal analysis. It looks at short-form engagement, replay behavior, comment language, hook retention, creator adoption, search growth, regional spread, and content remixability.

The goal is not to replace taste. The goal is to detect momentum faster.

## Why it matters

Music discovery is fragmented. A song can begin on TikTok, gain meaning on YouTube, become searchable on Google, and then convert into streaming demand. Artists who only watch one platform often react too late.

AI helps connect the fragments. It can identify which clips are pulling attention, which phrases are becoming searchable, which audiences are responding, and which visual formats increase conversion.

## Why AI trend forecasting became a signal

Trend forecasting matters because the biggest advantage is timing. Once a sound is obviously viral, the market is already crowded. Early detection allows artists, managers, labels, and creators to build content while attention is still cheap.

## Sonic Velocity Signal

Signal type: predictive growth layer.

The strongest AI music marketing systems should track four layers: sound, audience, platform, and search. Sound tells you what is working. Audience tells you who is responding. Platform tells you where the behavior is spreading. Search tells you whether curiosity is forming.

## Final take

AI music marketing is not about automation for its own sake. It is about sharper timing. Artists who understand signals early can build momentum before the market becomes noisy.
`.trim(),
  },
];

export const FEATURED_POSTS = BLOG_POSTS.filter((post) => post.featured);

export const getPostBySlug = (slug: string) =>
  BLOG_POSTS.find((post) => post.slug === slug);

export const getPostsByCategory = (category: CategorySlug) =>
  BLOG_POSTS.filter((post) => post.category === category);

export const getAllTags = () =>
  Array.from(new Set(BLOG_POSTS.flatMap((post) => post.tags))).sort();

export const getImageFallbacksForPost = (post: BlogPost) => [
  post.image,
  ...post.imageFallbacks,
  SITE_CONFIG.defaultOgImage,
  musicFallback,
];
