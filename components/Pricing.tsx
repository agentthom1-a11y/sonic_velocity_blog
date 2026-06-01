
import React from 'react';
import { ShieldCheck, Check, Unlock } from 'lucide-react';

interface PricingProps {
  dict: any;
}

const Pricing: React.FC<PricingProps> = ({ dict }) => {
  const getPremiumFeatures = () => {
    switch (dict.common.terms) {
      case "条款":
        return ["每月 40 首歌曲", "15秒 / 30秒 / 60秒", "所有预设 (Koplo, EDM, Breakbeat)", "每次生成 1 个版本", "个人许可与有机内容"];
      case "規約":
        return ["月40曲まで", "15秒 / 30秒 / 60秒", "すべてのプリセット (Koplo, EDM, Breakbeat)", "1世代につき1バージョン", "個人ライセンス＆オーガニックコンテンツ"];
      case "Conditions":
        return ["40 chansons par mois", "15s / 30s / 60s", "Tous les presets (Koplo, EDM, Breakbeat)", "1 version par génération", "Licence personnelle & contenu organique"];
      case "Terms":
        return ["40 songs per month", "15s / 30s / 60s", "All presets (Koplo, EDM, Breakbeat)", "1 version per generation", "Personal license & organic content"];
      default:
        return ["40 lagu per bulan", "15s / 30s / 60s", "Semua preset (Koplo, EDM, Breakbeat)", "1 versi per generate", "Lisensi personal & konten organik"];
    }
  };

  const getProFeatures = () => {
    switch (dict.common.terms) {
      case "条款":
        return ["每月 120 首歌曲", "每次生成 3 个版本", "助理制作人", "专业效果引擎 (混响/延迟/驱动)", "完全商业许可", "优先队列", "无水印", "TikTok 尊享预设与氛围"];
      case "規約":
        return ["月120曲まで", "1回の生成につき3つのバリエーション", "アシスタントプロデューサー", "プロエフェクトエンジン (リバーブ/ディレイ/ドライブ)", "商用ライセンス", "優先キュー", "ウォーターマークなし", "TikTokプレミアムプリセット＆ムード"];
      case "Conditions":
        return ["120 chansons par mois", "3 variations par génération", "Assistant de Production", "Moteur d'Effets Pro (Reverb/Delay/Drive)", "Licence commerciale complète", "File d'attente prioritaire", "Sans filigrane", "Presets & moods premium TikTok"];
      case "Terms":
        return ["120 songs per month", "3 variations per generation", "Assistant Producer", "Pro Effect Engine (Reverb/Delay/Drive)", "Full commercial license", "Priority queue", "No watermark", "TikTok premium preset & mood"];
      default:
        return ["120 lagu per bulan", "3 variasi tiap generate", "Assistant Producer", "Pro Effect Engine (Reverb/Delay/Drive)", "Full commercial license", "Priority queue", "Tanpa watermark", "Preset & mood premium TikTok"];
    }
  };

  const getAgencyFeatures = () => {
    switch (dict.common.terms) {
      case "条款":
        return ["几乎无限生成", "最多 5 名团队成员", "自定义预设和品牌声音", "每月咨询", "最高优先级 API 访问"];
      case "規約":
        return ["実質無制限の生成", "最大5名のチームユーザー", "カスタムプリセット＆ブランドサウンド", "月次コンサルティング", "APIアクセス＆最優先サポート"];
      case "Conditions":
        return ["Générations pratiquement illimitées", "Jusqu'à 5 membres d'équipe", "Presets personnalisés & signature sonore", "Consultation mensuelle", "Accès API & priorité maximale"];
      case "Terms":
        return ["Virtually unlimited generation", "Up-to 5 team users", "Custom preset & brand sound", "Monthly consultation", "API access & highest priority"];
      default:
        return ["Praktis unlimited generate", "Hingga 5 user tim", "Custom preset & brand sound", "Konsultasi bulanan", "API access & prioritas tertinggi"];
    }
  };

  return (
    <div className="w-full animate-[fadeIn_0.5s_ease-out]">
      {/* PRICING SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                 <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-[0.3em] mb-4 flex items-center justify-center gap-2">
                   <ShieldCheck className="w-3 h-3" /> {dict.common.accessProtocols}
                </h2>
                <h3 className="text-3xl font-bold text-white uppercase tracking-tighter">
                   {dict.common.selectYourTier}
                </h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {/* PREMIUM */}
                <div className="border border-neutral-800 bg-black p-8 relative group hover:border-neutral-600 transition-colors">
                    <h4 className="text-xl font-bold text-white uppercase tracking-wider mb-2">{dict.common.premiumTier}</h4>
                    <p className="text-xs font-mono text-neutral-500 uppercase mb-6">{dict.common.premiumSub}</p>
                    <div className="mb-8">
                        <span className="text-3xl font-bold text-white">{dict.common.premiumPrice}</span>
                        <span className="text-xs text-neutral-500 block mt-1">{dict.common.premiumPeriod}</span>
                        <div className="mt-2 inline-block bg-neutral-900 border border-neutral-800 px-2 py-1">
                            <span className="text-[10px] font-mono text-neutral-400">{dict.common.premiumPricePerSong}</span>
                        </div>
                    </div>
                    <ul className="space-y-4 mb-8">
                         {/* Highlighted Unlocked Feature for Premium */}
                         <li className="flex items-start gap-3 text-sm text-white font-bold border-b border-neutral-800 pb-3 mb-3">
                             <div className="p-0.5 bg-neutral-800 text-white rounded-sm">
                                <Unlock className="w-3 h-3" />
                             </div>
                             <span>{dict.common.premiumUnlocked}</span>
                         </li>

                         {getPremiumFeatures().map((item, i) => (
                             <li key={i} className="flex items-start gap-3 text-sm text-neutral-400">
                                <div className="w-1.5 h-1.5 bg-neutral-600 mt-1.5 rounded-sm shrink-0" />
                                {item}
                            </li>
                         ))}
                    </ul>
                    <button className="w-full py-3 border border-neutral-700 text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-900 transition-colors">
                        {dict.common.premiumBtn}
                    </button>
                </div>

                {/* PRO */}
                <div className="bg-white text-black p-8 relative transform md:-translate-y-4 shadow-2xl ring-1 ring-white/20">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white px-4 py-1 border border-neutral-700 shadow-lg">
                        <span className="text-[10px] font-bold uppercase tracking-widest">{dict.common.mostPopular}</span>
                    </div>
                    <h4 className="text-xl font-black uppercase tracking-wider mb-2">{dict.common.proTier}</h4>
                    <p className="text-xs font-mono text-neutral-600 uppercase mb-6">{dict.common.proSub}</p>
                    <div className="mb-8">
                        <span className="text-3xl font-bold">{dict.common.proPrice}</span>
                        <span className="text-xs text-neutral-600 block mt-1">{dict.common.proPeriod}</span>
                        <div className="mt-2 inline-block bg-neutral-100 border border-neutral-200 px-2 py-1">
                            <span className="text-[10px] font-mono text-neutral-800">{dict.common.proPricePerSong}</span>
                        </div>
                    </div>
                    <ul className="space-y-4 mb-8">
                         {/* Highlighted Unlocked Feature */}
                         <li className="flex items-start gap-3 text-sm font-bold border-b border-neutral-200 pb-3 mb-3">
                             <div className="p-0.5 bg-black text-white rounded-sm">
                                <Unlock className="w-3 h-3" />
                             </div>
                             <span>{dict.common.proUnlocked}</span>
                         </li>

                         {getProFeatures().map((item, i) => (
                             <li key={i} className="flex items-start gap-3 text-sm font-bold">
                                <Check className="w-4 h-4 shrink-0" />
                                {item}
                            </li>
                         ))}
                    </ul>
                    <button className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-lg">
                        {dict.common.proBtn}
                    </button>
                </div>

                {/* AGENCY */}
                 <div className="border border-neutral-800 bg-black p-8 relative group hover:border-neutral-600 transition-colors">
                    <h4 className="text-xl font-bold text-white uppercase tracking-wider mb-2">{dict.common.agencyTier}</h4>
                    <p className="text-xs font-mono text-neutral-500 uppercase mb-6">{dict.common.agencySub}</p>
                    <div className="mb-8">
                        <span className="text-3xl font-bold text-white">{dict.common.agencyPrice}</span>
                        <span className="text-xs text-neutral-500 block mt-1">{dict.common.agencyPeriod}</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                         <li className="flex items-start gap-3 text-sm text-white font-bold">
                             <Check className="w-4 h-4 shrink-0 text-green-500" />
                             <span>Everything in Creator Pro</span>
                         </li>
                         {getAgencyFeatures().map((item, i) => (
                             <li key={i} className="flex items-start gap-3 text-sm text-neutral-400">
                                <Check className="w-4 h-4 shrink-0 text-neutral-600" />
                                {item}
                            </li>
                         ))}
                    </ul>
                    <button className="w-full py-3 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                        {dict.common.agencyBtn}
                    </button>
                </div>
             </div>

             {/* Quote */}
             <div className="mt-16 max-w-3xl mx-auto text-center space-y-6 bg-neutral-900/30 p-8 border border-neutral-800/50 rounded-sm">
                <p className="text-sm md:text-base text-neutral-300 font-mono leading-relaxed">
                  {dict.common.quoteText}
                </p>
                <p className="text-xs md:text-sm text-neutral-500 font-mono">
                  {dict.common.quoteSub}
                </p>
             </div>
      </section>
    </div>
  );
};

export default Pricing;
