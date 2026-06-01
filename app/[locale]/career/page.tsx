import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from '@/components/Link';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/lib/i18n-config';

export default async function CareerPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-20 animate-[fadeIn_0.5s_ease-out] text-neutral-300">
      <Link href="/" className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-12 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> {dict.common.returnToBase}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-green-900/30 bg-green-950/10 rounded-full mb-6">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-green-400">{dict.common.hiringActive}</span>
              </div>
              <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                  {dict.common.joinNeuralNetwork}
              </h1>
              <p className="font-mono text-sm text-neutral-400 leading-relaxed mb-8">
                  {dict.common.careerPitch}
              </p>
              <a href="mailto:careers@velocity.ai" className="inline-flex items-center gap-3 px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-neutral-200 transition-colors">
                  {dict.common.sendResume} <ArrowRight className="w-4 h-4" />
              </a>
          </div>
          
          <div className="border border-neutral-800 bg-neutral-900/20 p-8 relative">
              <div className="absolute -top-3 -right-3 w-24 h-24 bg-neutral-800/50 blur-2xl rounded-full"></div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 relative z-10">{dict.common.whyJoin}</h3>
              <ul className="space-y-4 relative z-10">
                  {[
                      dict.common.benefit1,
                      dict.common.benefit2,
                      dict.common.benefit3,
                      dict.common.benefit4
                  ].map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3 font-mono text-xs text-neutral-400">
                          <CheckCircle className="w-4 h-4 text-neutral-600" />
                          {benefit}
                      </li>
                  ))}
              </ul>
          </div>
      </div>

      <div className="border-t border-neutral-800 pt-12">
          <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-[0.3em] mb-8">{dict.common.openPositions}</h2>
          <div className="grid grid-cols-1 gap-4">
              {[
                  { role: dict.common.role1 || "Senior Audio Synthesis Engineer", type: "Engineering", loc: "Remote / Jakarta" },
                  { role: dict.common.role2 || "Fullstack Developer (Next.js + WebGL)", type: "Product", loc: "Remote" },
                  { role: dict.common.role3 || "Growth Hacker (Dangdut Specialist)", type: "Marketing", loc: "Surabaya / Hybrid" },
                  { role: dict.common.role4 || "AI Model Trainer (Rhythm Focus)", type: "R&D", loc: "Remote" }
              ].map((job, i) => (
                  <div key={i} className="group flex items-center justify-between p-6 border border-neutral-800 bg-black hover:bg-neutral-900 transition-colors cursor-pointer">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                          <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">{job.role}</h3>
                          <div className="flex gap-2">
                               <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-[9px] font-mono uppercase text-neutral-500">{job.type}</span>
                               <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-[9px] font-mono uppercase text-neutral-500">{job.loc}</span>
                          </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors" />
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    );
}
