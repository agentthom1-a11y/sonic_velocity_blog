
import React from 'react';
import { ShieldCheck, Check, Unlock } from 'lucide-react';

const Pricing: React.FC = () => {
  return (
    <div className="w-full animate-[fadeIn_0.5s_ease-out]">
      {/* PRICING SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                 <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-[0.3em] mb-4 flex items-center justify-center gap-2">
                   <ShieldCheck className="w-3 h-3" /> Access Protocols
                </h2>
                <h3 className="text-3xl font-bold text-white uppercase tracking-tighter">
                   Select Your Tier
                </h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {/* PREMIUM (Formerly Basic) */}
                <div className="border border-neutral-800 bg-black p-8 relative group hover:border-neutral-600 transition-colors">
                    <h4 className="text-xl font-bold text-white uppercase tracking-wider mb-2">Velocity Premium</h4>
                    <p className="text-xs font-mono text-neutral-500 uppercase mb-6">"Coba-coba & Explore Ide"</p>
                    <div className="mb-8">
                        <span className="text-3xl font-bold text-white">Rp 216.000</span>
                        <span className="text-xs text-neutral-500 block mt-1">/ bulan</span>
                        <div className="mt-2 inline-block bg-neutral-900 border border-neutral-800 px-2 py-1">
                            <span className="text-[10px] font-mono text-neutral-400">≈ Rp 5.400 / lagu (40 lagu)</span>
                        </div>
                    </div>
                    <ul className="space-y-4 mb-8">
                         {/* Highlighted Unlocked Feature for Premium */}
                         <li className="flex items-start gap-3 text-sm text-white font-bold border-b border-neutral-800 pb-3 mb-3">
                             <div className="p-0.5 bg-neutral-800 text-white rounded-sm">
                                <Unlock className="w-3 h-3" />
                             </div>
                             <span>UNLOCKED: Lyrics & Stems Modules</span>
                         </li>

                         {[
                            "40 lagu per bulan",
                            "15s / 30s / 60s",
                            "Semua preset (Koplo, EDM, Breakbeat)",
                            "1 versi per generate",
                            "Lisensi personal & konten organik"
                         ].map((item, i) => (
                             <li key={i} className="flex items-start gap-3 text-sm text-neutral-400">
                                <div className="w-1.5 h-1.5 bg-neutral-600 mt-1.5 rounded-sm shrink-0" />
                                {item}
                            </li>
                         ))}
                    </ul>
                    <button className="w-full py-3 border border-neutral-700 text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-900 transition-colors">
                        Mulai dari Premium
                    </button>
                </div>

                {/* PRO */}
                <div className="bg-white text-black p-8 relative transform md:-translate-y-4 shadow-2xl ring-1 ring-white/20">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white px-4 py-1 border border-neutral-700 shadow-lg">
                        <span className="text-[10px] font-bold uppercase tracking-widest">Most Popular</span>
                    </div>
                    <h4 className="text-xl font-black uppercase tracking-wider mb-2">Creator Pro</h4>
                    <p className="text-xs font-mono text-neutral-600 uppercase mb-6">"Untuk Creator Serius"</p>
                    <div className="mb-8">
                        <span className="text-3xl font-bold">Rp 290.000</span>
                        <span className="text-xs text-neutral-600 block mt-1">/ bulan</span>
                        <div className="mt-2 inline-block bg-neutral-100 border border-neutral-200 px-2 py-1">
                            <span className="text-[10px] font-mono text-neutral-800">≈ Rp 2.400 / lagu (120 lagu)</span>
                        </div>
                    </div>
                    <ul className="space-y-4 mb-8">
                         {/* Highlighted Unlocked Feature */}
                         <li className="flex items-start gap-3 text-sm font-bold border-b border-neutral-200 pb-3 mb-3">
                             <div className="p-0.5 bg-black text-white rounded-sm">
                                <Unlock className="w-3 h-3" />
                             </div>
                             <span>UNLOCK ALL ACCESS STUDIO PRODUCER</span>
                         </li>

                         {[
                             "120 lagu per bulan",
                             "3 variasi tiap generate",
                             "Assistant Producer",
                             "Pro Effect Engine (Reverb/Delay/Drive)",
                             "Full commercial license",
                             "Priority queue",
                             "Tanpa watermark",
                             "Preset & mood premium TikTok"
                         ].map((item, i) => (
                             <li key={i} className="flex items-start gap-3 text-sm font-bold">
                                <Check className="w-4 h-4 shrink-0" />
                                {item}
                            </li>
                         ))}
                    </ul>
                    <button className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-lg">
                        Pilihan Terbaik Saya
                    </button>
                </div>

                {/* AGENCY */}
                 <div className="border border-neutral-800 bg-black p-8 relative group hover:border-neutral-600 transition-colors">
                    <h4 className="text-xl font-bold text-white uppercase tracking-wider mb-2">Studio Agency</h4>
                    <p className="text-xs font-mono text-neutral-500 uppercase mb-6">"Untuk Studio & Agensi"</p>
                    <div className="mb-8">
                        <span className="text-3xl font-bold text-white">Rp 1.9jt</span>
                        <span className="text-xs text-neutral-500 block mt-1">/ bulan</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                         <li className="flex items-start gap-3 text-sm text-white font-bold">
                             <Check className="w-4 h-4 shrink-0 text-green-500" />
                             <span>Everything in Creator Pro</span>
                         </li>
                         {[
                            "Praktis unlimited generate",
                            "Hingga 5 user tim",
                            "Custom preset & brand sound",
                            "Konsultasi bulanan",
                            "API access & prioritas tertinggi"
                         ].map((item, i) => (
                             <li key={i} className="flex items-start gap-3 text-sm text-neutral-400">
                                <Check className="w-4 h-4 shrink-0 text-neutral-600" />
                                {item}
                            </li>
                         ))}
                    </ul>
                    <button className="w-full py-3 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                        Hubungi Kami
                    </button>
                </div>
             </div>

             {/* Quote */}
             <div className="mt-16 max-w-3xl mx-auto text-center space-y-6 bg-neutral-900/30 p-8 border border-neutral-800/50 rounded-sm">
                <p className="text-sm md:text-base text-neutral-300 font-mono leading-relaxed">
                “Satu lagu dari produser bisa jutaan. Dengan Velocity, bahkan di paket Pro, <span className="text-white font-bold bg-neutral-800 px-1 border border-neutral-700">1 lagu hanya sekitar Rp 2.400.</span>”
                </p>
                <p className="text-xs md:text-sm text-neutral-500 font-mono">
                “Mulai dari Rp 216.000 dulu. Kalau ternyata kamu butuh lebih banyak lagu, upgrade ke Creator Pro kapan saja hanya dengan beberapa klik.”
                </p>
             </div>
      </section>
    </div>
  );
};

export default Pricing;
