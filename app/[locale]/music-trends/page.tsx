import React from 'react';
import { Metadata } from 'next';
import { Link } from '@/components/Link';
import { BarChart3, Cpu, ArrowRight } from 'lucide-react';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/lib/i18n-config';
import { SITE_CONFIG } from '@/blogData';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Music Trends | ${SITE_CONFIG.brand}`,
    description: 'Track real-time regional and international music trend signals, forecasts, and reports.',
  };
}

export default async function MusicTrendsIndexPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const getLocalizedTexts = () => {
    switch (dict.common.terms) {
      case "条款":
        return {
          title: "音乐趋势",
          subtitle: "算法监测与预测",
          desc: "跟踪实时区域和国际音乐趋势信号、预测与报告。",
          activeLabel: "可用报告",
          expansionTitle: "更多市场正在扫描中",
          expansionDesc: "我们的数据引擎正在不断跟踪新的地区数据。新的算法分析和国家报告即将发布。"
        };
      case "規約":
        return {
          title: "音楽トレンド",
          subtitle: "アルゴリズムの監視と予測",
          desc: "リアルタイムの地域および国際的な音楽トレンドシグナル、予測、およびレポートを追跡します。",
          activeLabel: "有効なレポート",
          expansionTitle: "その他の市場をスキャン中...",
          expansionDesc: "当社のデータエンジンは新しい地域データを追跡しています。新しいアルゴリズム分析と国のレポートがまもなくリリースされます。"
        };
      case "Conditions":
        return {
          title: "Tendances Musicales",
          subtitle: "Surveillance et Prévision Algorithmique",
          desc: "Suivez les signaux, prévisions et rapports sur les tendances musicales régionales et internationales en temps réel.",
          activeLabel: "Rapports Actifs",
          expansionTitle: "Autres Marchés en Cours d'Analyse",
          expansionDesc: "Notre moteur de données suit continuellement les nouvelles données régionales. De nouvelles analyses algorithmiques et des rapports par pays seront bientôt publiés."
        };
      case "Terms":
        return {
          title: "Music Trends",
          subtitle: "Algorithmic Monitoring & Forecasting",
          desc: "Track real-time regional and international music trend signals, forecasts, and reports.",
          activeLabel: "Active Reports",
          expansionTitle: "More Markets Under Scan",
          expansionDesc: "Our data engine is continually tracking new regional datasets. New algorithmic analyses and country reports are coming soon."
        };
      default:
        return {
          title: "Tren Musik",
          subtitle: "Pemantauan & Peramalan Algoritma",
          desc: "Lacak sinyal tren musik regional dan internasional, prakiraan, dan laporan waktu nyata.",
          activeLabel: "Laporan Aktif",
          expansionTitle: "Lebih Banyak Pasar Sedang Dipindai",
          expansionDesc: "Mesin data kami terus melacak kumpulan data regional baru. Analisis algoritmik baru dan laporan negara akan segera hadir."
        };
    }
  };

  const texts = getLocalizedTexts();

  const TREND_ITEMS = [
    {
      title: dict.common.terms === "条款" ? "亚洲音乐趋势 2026" : dict.common.terms === "規約" ? "アジア音楽トレンド 2026" : dict.common.terms === "Conditions" ? "Tendances Musicales en Asie 2026" : dict.common.terms === "Terms" ? "Asia Music Trends 2026" : "Tren Musik Asia 2026",
      slug: "asia/2026",
      desc: dict.common.terms === "条款" ? "深入探讨整个亚洲泛区域数字平台和短视频渠道的音乐演变。" : dict.common.terms === "規約" ? "アジア全域のデジタルプラットフォームや短尺動画チャンネルにおける音楽の進化を深く掘り下げます。" : dict.common.terms === "Conditions" ? "Une plongée profonde dans l'évolution de la musique sur les plateformes numériques et les canaux vidéo courts à travers l'Asie." : dict.common.terms === "Terms" ? "A deep dive into the evolution of music across digital platforms and short-video channels throughout Asia." : "Analisis mendalam tentang evolusi musik di platform digital dan saluran video pendek di seluruh Asia."
    },
    {
      title: dict.common.terms === "条款" ? "印度尼西亚音乐趋势 2026" : dict.common.terms === "規約" ? "インドネシア音楽トレンド 2026" : dict.common.terms === "Conditions" ? "Tendances Musicales en Indonésie 2026" : dict.common.terms === "Terms" ? "Indonesia Music Trends 2026" : "Tren Musik Indonesia 2026",
      slug: "indonesia/2026",
      desc: dict.common.terms === "条款" ? "分析本地互联网时刻、抖音病毒式传播以及东南亚最大音乐市场的节奏组合。" : dict.common.terms === "規約" ? "東南アジア最大の音楽市場におけるローカルなインターネットの瞬間、TikTokバイラル、およびリズム融合の分析。" : dict.common.terms === "Conditions" ? "Analyse des moments Internet locaux, de la viralité TikTok et des fusions rythmiques dans le plus grand marché musical d'Asie du Sud-Est." : dict.common.terms === "Terms" ? "Analysis of local internet moments, TikTok virality, and rhythmic fusions in Southeast Asia's largest music market." : "Analisis momen internet lokal, viralitas TikTok, dan fusi ritmik di pasar musik terbesar di Asia Tenggara."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 text-neutral-300 animate-[fadeIn_0.5s_ease-out]">
      <Link href="/" className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-12 hover:text-white transition-colors">
        ← {dict.common.returnToBase}
      </Link>

      <div className="border-b border-neutral-800 pb-8 mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 italic flex items-center gap-3">
          <BarChart3 className="w-10 h-10 text-neutral-400" />
          {texts.title}
        </h1>
        <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">{texts.subtitle}</p>
        <p className="text-neutral-400 font-mono text-xs mt-4 leading-relaxed max-w-2xl">{texts.desc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {TREND_ITEMS.map((item, index) => (
          <div key={index} className="border border-neutral-800 bg-neutral-950/20 p-8 hover:border-white transition-all flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-600 uppercase mb-4 block">0{index + 1} // {texts.activeLabel}</span>
              <h3 className="text-2xl font-bold text-white uppercase mb-4">{item.title}</h3>
              <p className="text-neutral-400 font-mono text-xs leading-relaxed mb-8">{item.desc}</p>
            </div>
            <Link 
              href={`/music-trends/${item.slug}`}
              className="flex items-center justify-between pt-4 border-t border-neutral-900 text-xs font-mono text-neutral-500 hover:text-white transition-colors"
            >
              <span>ACCESS REPORT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>

      {/* Under Development section */}
      <div className="border border-neutral-900 bg-neutral-900/10 p-8 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50"></div>
        <Cpu className="w-12 h-12 text-neutral-600 shrink-0" strokeWidth={1} />
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
            {texts.expansionTitle}
          </h4>
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest leading-relaxed">
            {texts.expansionDesc}
          </p>
        </div>
      </div>
    </div>
  );
}
