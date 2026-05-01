import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import "../globals.css";
import { AppProvider } from "@/components/AppContext";
import Header from "@/components/Header";

import PreloaderWrapper from "@/components/PreloaderWrapper";
import { AIProducerBotWrapper } from "@/components/AIProducerBotWrapper";
import ClientBackgroundEffects from "@/components/ClientBackgroundEffects";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

import { i18n, type Locale } from "@/lib/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sonicvelocitymusic.com';
  
  return {
    metadataBase: new URL(baseUrl),
    title: dict.home.heroTitle1 + " " + dict.home.heroTitle2 + " " + dict.home.heroTitle3 + " – AI Audio Synthesis",
    description: dict.home.heroSubtitle,
    keywords: ["AI music", "TikTok Remix", "Dangdut Koplo", "Audio Synthesis", "Music Generation", "DJ TikTok", "AI Producer"],
    alternates: {
      canonical: `${i18n.defaultLocale === locale ? '/' : `/${locale}`}`,
      languages: Object.fromEntries(
        i18n.locales.map((l) => [l, `/${l}`])
      ),
    },
    openGraph: {
      type: "website",
      url: `${baseUrl}/${locale}`,
      title: "Velocity Blog – AI Audio Synthesis & Remix Culture",
      description: dict.home.heroSubtitle,
      images: ["/og-banner.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: "Velocity Blog – AI Music Insights",
      description: dict.home.heroSubtitle,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    icons: {
      icon: "/icon.svg",
      shortcut: "/icon.svg",
      apple: "/icon.svg",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const direction = i18n.directions[locale] || 'ltr';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sonicvelocitymusic.com';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: baseUrl,
      name: 'Sonic Velocity',
      description: dict.home.heroSubtitle,
      potentialAction: {
        '@type': 'SearchAction',
        'target': `${baseUrl}/${locale}/transmissions?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Sonic Velocity',
      url: baseUrl,
      logo: `${baseUrl}/icon.svg`,
      sameAs: [
        'https://twitter.com/sonicvelocity',
        'https://linkedin.com/company/sonicvelocity'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        url: `${baseUrl}/${locale}/contact`
      }
    }
  ];

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${manrope.variable} ${jetbrainsMono.variable} antialiased min-h-screen relative flex flex-col`} suppressHydrationWarning>
        <AppProvider>
          <PreloaderWrapper>
            <div className="flex-1 flex flex-col">
              <ClientBackgroundEffects />
              
              <Header dict={dict} />

              <main className="flex-1 flex flex-col">
                {children}
              </main>

              <AIProducerBotWrapper />
            </div>
          </PreloaderWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
