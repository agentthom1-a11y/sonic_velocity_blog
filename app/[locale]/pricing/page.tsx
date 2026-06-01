import Pricing from "@/components/Pricing";
import { ArrowLeft } from "lucide-react";
import { Link } from '@/components/Link';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/lib/i18n-config';

export default async function PricingPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 animate-[fadeIn_0.5s_ease-out]">
      <Link href="/" className="group flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] mb-12 text-neutral-500 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {dict.common.returnToBase}
      </Link>
      
      <Pricing dict={dict} />
    </div>
  );
}
