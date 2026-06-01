import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import "../globals.css";
import { AppProvider } from "@/components/AppContext";
import Header from "@/components/Header";

import PreloaderWrapper from "@/components/PreloaderWrapper";
import { AIProducerBotWrapper } from "@/components/AIProducerBotWrapper";
import ClientBackgroundEffects from "@/components/ClientBackgroundEffects";
import { Footer } from "@/components/Footer";
import { OrganizationSchema, WebSiteSchema } from "@/components/Schema";

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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://transmissions.sonicvelocitymusic.com';
  
  const siteTitle = locale === 'jaksel' 
    ? "Sonic Velo – Literally the Best AI Audio & Jaksel Vibes"
    : `${dict.home.heroTitle1}${dict.home.heroTitle2}${dict.home.heroTitle3} – AI Audio Synthesis & Neural Culture`;

  const regionalKeywords = [
    "AI music Indonesia", "Jakarta Tech Scene", "Jaksel Slang", "South Jakarta AI", 
    "Southeast Asia Audio Synthesis", "Asian Remix Culture", "TikTok Viral Songs Asia",
    "Dangdut AI Remix", "Koplo Audio Engine", "Singapore AI Music", "Tokyo Neural Audio",
    "Beijing Sound Systems"
  ];

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: siteTitle,
      template: `%s | ${dict.common.brand}`,
    },
    description: dict.home.heroSubtitle,
    keywords: [
      "AI music", "TikTok Remix", "Dangdut Koplo", "Audio Synthesis", 
      "Music Generation", "DJ TikTok", "AI Producer", "Neural Engineering",
      ...regionalKeywords
    ],
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: Object.fromEntries(
        i18n.locales.map((l) => [l, `${baseUrl}/${l}`])
      ),
    },
    openGraph: {
      type: "website",
      url: `${baseUrl}/${locale}`,
      title: siteTitle,
      description: dict.home.heroSubtitle,
      siteName: dict.common.brand,
      images: [
        {
          url: "/og-banner.jpg",
          width: 1200,
          height: 630,
          alt: "Sonic Velocity – AI Music AI",
        }
      ],
      locale: locale === 'id' ? 'id_ID' : locale === 'ja' ? 'ja_JP' : locale === 'zh' ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: dict.home.heroSubtitle,
      site: "@sonicvelmusic",
      creator: "@sonicvelmusic",
      images: ["/og-banner.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: "/icon.svg",
      shortcut: "/icon.svg",
      apple: "/icon.svg",
    },
    verification: {
      google: "google-site-verification-placeholder", // User should replace this
    },
    other: {
      "geo.region": "ID-JK",
      "geo.placename": "Jakarta",
      "geo.position": "-6.2088;106.8456",
      "ICBM": "-6.2088, 106.8456",
    }
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://transmissions.sonicvelocitymusic.com';

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
        'https://x.com/sonicvelmusic',
        'https://www.instagram.com/sonicvelocitymusic/',
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
        <OrganizationSchema baseUrl={baseUrl} />
        <WebSiteSchema baseUrl={baseUrl} locale={locale} />
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

              <Footer dict={dict} locale={locale} />
              <AIProducerBotWrapper />
            </div>
          </PreloaderWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
