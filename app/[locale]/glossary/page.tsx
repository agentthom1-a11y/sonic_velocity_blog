import React from 'react';
import { Metadata } from 'next';
import { Link } from '@/components/Link';
import { BookOpen, Cpu, ArrowRight } from 'lucide-react';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/lib/i18n-config';
import { SITE_CONFIG } from '@/blogData';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Glossary | ${SITE_CONFIG.brand}`,
    description: 'Learn the core terms, definitions, and concepts behind AI audio synthesis and algorithmic music trends.',
  };
}

export default async function GlossaryIndexPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const getLocalizedTexts = () => {
    switch (dict.common.terms) {
      case "条款":
        return {
          title: "词汇表",
          subtitle: "概念解析与定义",
          desc: "了解 AI 音频合成与算法音乐趋势背后的核心术语和概念。",
          activeLabel: "可用术语",
          expansionTitle: "更多定义正在合成中",
          expansionDesc: "我们的系统架构师和音乐学家正在不断扩展此词汇表。新的神经网络定义和算法术语即将推出。"
        };
      case "規約":
        return {
          title: "用語集",
          subtitle: "概念の分析と定義",
          desc: "AIオーディオ合成とアルゴリズム音楽トレンドの背景にある主要な用語と概念を学びます。",
          activeLabel: "有効な用語",
          expansionTitle: "追加の定義を収集中...",
          expansionDesc: "システムアーキテクトと用語集がこの用語集を拡張しています。新しいニューラル定義とアルゴリズム用語がまもなくリリースされます。"
        };
      case "Conditions":
        return {
          title: "Glossaire",
          subtitle: "Analyse des Concepts et Définitions",
          desc: "Découvrez les termes clés et les concepts de la synthèse audio par IA et des tendances musicales algorithmiques.",
          activeLabel: "Termes Actifs",
          expansionTitle: "Plus de Définitions en Cours de Synthèse",
          expansionDesc: "Nos architectes système et musicologues élargissent continuellement ce lexique. De nouvelles définitions neuronales et termes algorithmiques seront bientôt disponibles."
        };
      case "Terms":
        return {
          title: "Glossary",
          subtitle: "Concept Analysis & Definitions",
          desc: "Learn the core terms, definitions, and concepts behind AI audio synthesis and algorithmic music trends.",
          activeLabel: "Active Terms",
          expansionTitle: "More Definitions Under Synthesis",
          expansionDesc: "Our system architects and musicologists are continually expanding this lexicon. New neural definitions and algorithmic terms are coming soon."
        };
      default:
        return {
          title: "Glosarium",
          subtitle: "Analisis Konsep & Definisi",
          desc: "Pelajari istilah inti, definisi, dan konsep di balik sintesis audio AI dan tren musik algoritmik.",
          activeLabel: "Istilah Aktif",
          expansionTitle: "Definisi Tambahan Sedang Disintesis",
          expansionDesc: "Arsitek sistem dan musikolog kami terus memperluas leksikon ini. Definisi saraf baru dan istilah algoritmik akan segera hadir."
        };
    }
  };

  const texts = getLocalizedTexts();

  const GLOSSARY_ITEMS = [
    {
      title: dict.common.terms === "条款" ? "AI 音频合成" : dict.common.terms === "規約" ? "AIオーディオ合成" : dict.common.terms === "Conditions" ? "Synthèse Audio IA" : dict.common.terms === "Terms" ? "AI Audio Synthesis" : "Sintesis Audio AI",
      slug: "ai-audio-synthesis",
      desc: dict.common.terms === "条款" ? "使用生成式 AI 模型进行高级音频生成与声音特征处理。" : dict.common.terms === "規約" ? "生成AIモデルを使用した高度なオーディオ生成と音響特性の処理。" : dict.common.terms === "Conditions" ? "Génération audio avancée et traitement des caractéristiques sonores à l'aide de modèles d'IA générative." : dict.common.terms === "Terms" ? "Advanced audio generation and sound characteristic processing using generative AI models." : "Pembuatan audio tingkat lanjut dan pemrosesan karakteristik suara menggunakan model AI generatif."
    },
    {
      title: dict.common.terms === "条款" ? "动力歌曲" : dict.common.terms === "規約" ? "モメンタムソング" : dict.common.terms === "Conditions" ? "Chanson de Momentum" : dict.common.terms === "Terms" ? "Momentum Song" : "Lagu Momentum",
      slug: "momentum-song",
      desc: dict.common.terms === "条款" ? "通过用户生成内容和跨平台传播产生持续算法引力的曲目。" : dict.common.terms === "規約" ? "ユーザー生成コンテンツとクロスプラットフォーム配信によって持続的なアルゴリズム引力を生み出す楽曲。" : dict.common.terms === "Conditions" ? "Un morceau qui génère sa propre gravité algorithmique soutenue par le contenu généré par les utilisateurs et la diffusion multiplateforme." : dict.common.terms === "Terms" ? "A track that generates its own sustained algorithmic gravity through user-generated content and cross-platform spread." : "Lagu yang menghasilkan gravitasi algoritmik berkelanjutan melalui konten buatan pengguna dan penyebaran lintas platform."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 text-neutral-300 animate-[fadeIn_0.5s_ease-out]">
      <Link href="/" className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-12 hover:text-white transition-colors">
        ← {dict.common.returnToBase}
      </Link>

      <div className="border-b border-neutral-800 pb-8 mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 italic flex items-center gap-3">
          <BookOpen className="w-10 h-10 text-neutral-400" />
          {texts.title}
        </h1>
        <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">{texts.subtitle}</p>
        <p className="text-neutral-400 font-mono text-xs mt-4 leading-relaxed max-w-2xl">{texts.desc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {GLOSSARY_ITEMS.map((item, index) => (
          <div key={index} className="border border-neutral-800 bg-neutral-950/20 p-8 hover:border-white transition-all flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-600 uppercase mb-4 block">0{index + 1} // {texts.activeLabel}</span>
              <h3 className="text-2xl font-bold text-white uppercase mb-4">{item.title}</h3>
              <p className="text-neutral-400 font-mono text-xs leading-relaxed mb-8">{item.desc}</p>
            </div>
            <Link 
              href={`/glossary/${item.slug}`}
              className="flex items-center justify-between pt-4 border-t border-neutral-900 text-xs font-mono text-neutral-500 hover:text-white transition-colors"
            >
              <span>READ DEFINITION</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>

      {/* Under Development section */}
      <div className="border border-neutral-900 bg-neutral-900/10 p-8 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/50"></div>
        <Cpu className="w-12 h-12 text-neutral-600 shrink-0" strokeWidth={1} />
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
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
