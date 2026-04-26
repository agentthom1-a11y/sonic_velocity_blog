'use client';

import GeneratorForm from "@/components/GeneratorForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StudioPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 animate-[fadeIn_0.5s_ease-out]">
      <Link href="/" className="group flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] mb-12 text-neutral-500 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Base
      </Link>

      <div className="mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
          Atmospheric <span className="text-neutral-600">Studio</span>
        </h1>
        <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest leading-relaxed">
          Initialize synthesis parameters to generate neural audio artifacts.
        </p>
      </div>

      <GeneratorForm />
    </div>
  );
}
