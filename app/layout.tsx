import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/AppContext";
import Header from "@/components/Header";

import PreloaderWrapper from "@/components/PreloaderWrapper";
import { AIProducerBotWrapper } from "@/components/AIProducerBotWrapper";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Velocity Blog – AI Audio, TikTok Remix & Music Synthesis Insights",
  description: "Explore the future of AI music synthesis. Velocity Blog provides deep dives into DJ TikTok, Dangdut Koplo remixing, and AI-powered audio production.",
  keywords: ["AI music", "TikTok Remix", "Dangdut Koplo", "Audio Synthesis", "Music Generation", "DJ TikTok", "AI Producer"],
  openGraph: {
    type: "website",
    url: "https://velocity-audio.ai/blog",
    title: "Velocity Blog – AI Audio Synthesis & Remix Culture",
    description: "The leading source for AI-generated music insights, TikTok trends, and production tutorials.",
    images: ["/og-banner.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Velocity Blog – AI Music Insights",
    description: "Tutorials and insights on AI-powered music production for the TikTok era.",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${manrope.variable} ${jetbrainsMono.variable} antialiased min-h-screen relative flex flex-col`}>
        <AppProvider>
          <PreloaderWrapper>
            <div className="flex-1 flex flex-col">
              {/* Background Effects */}
              <div className="fixed inset-0 z-[-1] bg-grid opacity-[0.15] pointer-events-none"></div>
              <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-neutral-900/0 to-black pointer-events-none"></div>
              
              <Header />

              
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
