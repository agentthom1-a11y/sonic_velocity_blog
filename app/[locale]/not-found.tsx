'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Link } from '@/components/Link';
import { Terminal, Activity, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const pathname = usePathname();
  // Safe extraction of locale from path
  const locale = pathname?.split('/')[1] || 'en';

  const getDevData = (lang: string) => {
    switch (lang) {
      case 'zh':
        return {
          title: "系统节点：开发中",
          subtitle: "协议：模块扩展",
          badge: "节点扩张中",
          description: "您请求的系统节点当前正在进行神经网络重构或处于开发阶段。我们的工程师正在加快合成通道的建设。",
          returnButton: "返回主控制台",
          statusCode: "错误代码：404_UNDER_DEV"
        };
      case 'ja':
        return {
          title: "システムノード: 開発中",
          subtitle: "プロトコル: モジュール拡張",
          badge: "ノード拡張中",
          description: "リクエストされたシステムノードは現在、ニューラルネットワークの再構築中またはアクティブな開発フェーズにあります。合成チャンネルを拡張しています。",
          returnButton: "メインコンソールに戻る",
          statusCode: "エラーコード: 404_UNDER_DEV"
        };
      case 'fr':
        return {
          title: "Nœud Système : En Développement",
          subtitle: "Protocole : Expansion de Module",
          badge: "Expansion en cours",
          description: "Le nœud système demandé est actuellement en cours de reconstruction neuronale ou en phase de développement actif. Nos ingénieurs étendent les canaux de synthèse.",
          returnButton: "Retour à la Console",
          statusCode: "CODE : 404_UNDER_DEV"
        };
      case 'id':
        return {
          title: "Node Sistem: Dalam Pengembangan",
          subtitle: "Protokol: Ekspansi Modul",
          badge: "Ekspansi Node",
          description: "Node sistem yang Anda minta saat ini sedang menjalani rekonstruksi saraf atau dalam tahap pengembangan aktif. Teknisi kami sedang memperluas saluran sintesis.",
          returnButton: "Kembali ke Konsol Utama",
          statusCode: "KODE ERROR: 404_UNDER_DEV"
        };
      case 'jaksel':
        return {
          title: "System Node: Under Development Kak",
          subtitle: "Protocol: Module Expansion",
          badge: "Node Expansion",
          description: "System node yang lo request saat ini lagi under reconstruction atau fase development aktif. Engineer kita lagi nge-push channel sintesis biar cepet kelar.",
          returnButton: "Balik ke Base Console",
          statusCode: "ERROR CODE: 404_UNDER_DEV"
        };
      default: // 'en'
        return {
          title: "System Node: Under Development",
          subtitle: "Protocol: Module Expansion",
          badge: "Node Expansion",
          description: "The requested system node is currently undergoing neural reconstruction or is under active development. Our engineers are expanding the synthesis channels.",
          returnButton: "Return to Base Console",
          statusCode: "ERROR CODE: 404_UNDER_DEV"
        };
    }
  };

  const data = getDevData(locale);

  return (
    <div className="min-h-screen bg-black text-neutral-300 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
      
      {/* Neon Radial Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-cyan-950/20 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-xl w-full border border-neutral-900 bg-neutral-950/80 backdrop-blur-xl p-8 md:p-12 relative z-10 rounded-xl shadow-2xl">
        {/* Top Status Bar */}
        <div className="flex justify-between items-center mb-10 border-b border-neutral-900 pb-6">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
              {data.subtitle}
            </span>
          </div>
          <span className="text-[9px] font-mono text-cyan-500/80 px-2 py-0.5 border border-cyan-900/50 bg-cyan-950/30 uppercase tracking-widest rounded-sm">
            {data.badge}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-6 italic leading-none flex items-center gap-3">
          <Activity className="w-8 h-8 text-cyan-500 animate-pulse" />
          {data.title}
        </h1>

        {/* Description */}
        <p className="text-xs font-mono text-neutral-400 leading-relaxed mb-8 border-l-2 border-neutral-800 pl-4">
          {data.description}
        </p>

        {/* Diagnostics Box */}
        <div className="bg-neutral-900/30 border border-neutral-900 p-4 mb-10 rounded-md">
          <div className="flex items-center gap-2 text-[10px] font-mono text-red-500 uppercase mb-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
            {data.statusCode}
          </div>
          <div className="text-[9px] font-mono text-neutral-600 uppercase tracking-wider">
            PATH: {pathname} <br />
            STATUS: OFFLINE // READY_FOR_DEPLOYMENT
          </div>
        </div>

        {/* Action Button */}
        <Link 
          href="/"
          className="flex items-center justify-center gap-2 w-full py-4 bg-white hover:bg-neutral-200 text-black font-bold uppercase tracking-wider text-xs transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          <ArrowLeft className="w-4 h-4" />
          {data.returnButton}
        </Link>
      </div>
    </div>
  );
}
