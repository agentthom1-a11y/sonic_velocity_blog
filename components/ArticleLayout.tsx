import React from 'react';
import { Schema } from './Schema';
import { Link } from './Link';
import { ChevronRight } from 'lucide-react';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/lib/i18n-config';

interface FAQ {
  question: string;
  answer: string;
}

interface ArticleLayoutProps {
  title: string;
  description: string;
  date?: string;
  locale: string;
  breadcrumbs: { label: string; href: string }[];
  quickAnswer: React.ReactNode;
  keySignals: React.ReactNode[];
  whyItMatters: React.ReactNode;
  trendBreakdown: React.ReactNode;
  dataSignalsTable: { header: string[]; rows: string[][] };
  sonicVelocityInsight: React.ReactNode;
  faqs: FAQ[];
  relatedReading: { title: string; href: string; description: string }[];
}

export async function ArticleLayout({
  title,
  description,
  date,
  locale,
  breadcrumbs,
  quickAnswer,
  keySignals,
  whyItMatters,
  trendBreakdown,
  dataSignalsTable,
  sonicVelocityInsight,
  faqs,
  relatedReading,
}: ArticleLayoutProps) {
  const dict = await getDictionary(locale as Locale);

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.label,
      item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://transmissions.sonicvelocitymusic.com'}${b.href}`,
    })),
  };

  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const articleSchema = {
    '@type': 'Article',
    headline: title,
    description: description,
    datePublished: date || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Sonic Velocity',
    },
  };

  return (
    <article className="min-h-screen bg-black text-white pt-32 pb-24 px-6 relative selection:bg-white selection:text-black w-full">
      <Schema type="BreadcrumbList" data={breadcrumbSchema} />
      <Schema type="FAQPage" data={faqSchema} />
      <Schema type="BlogPosting" data={articleSchema} />

      <div className="max-w-4xl mx-auto">
        <nav className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-12 flex-wrap">
          <Link href={`/`} className="hover:text-white transition-colors">{dict.common.home}</Link>
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              <ChevronRight className="w-3 h-3" />
              <Link href={b.href} className="hover:text-white transition-colors">{b.label}</Link>
            </React.Fragment>
          ))}
        </nav>

        <header className="mb-16 border-b border-neutral-900 pb-12">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[1.1] mb-6">
            {title}
          </h1>
          <p className="text-xl text-neutral-400 font-mono leading-relaxed border-l-2 border-neutral-800 pl-6">
            {description}
          </p>
        </header>

        <div className="space-y-20">
          <section id="quick-answer" className="scroll-mt-32">
            <h2 className="text-[11px] font-black font-mono uppercase tracking-[0.4em] text-neutral-500 mb-6 border-b border-neutral-900 pb-2">{dict.common.quickAnswer}</h2>
            <div className="text-lg md:text-xl text-neutral-300 font-medium leading-relaxed bg-neutral-950 p-8 border border-neutral-900">
              {quickAnswer}
            </div>
          </section>

          <section id="key-signals" className="scroll-mt-32">
            <h2 className="text-[11px] font-black font-mono uppercase tracking-[0.4em] text-neutral-500 mb-6 border-b border-neutral-900 pb-2">{dict.common.keySignals}</h2>
            <ul className="space-y-4">
              {keySignals.map((signal, i) => (
                <li key={i} className="flex gap-4 items-start text-neutral-300 font-mono text-sm leading-relaxed">
                  <span className="text-neutral-600 font-black shrink-0">0{i+1} /</span>
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="why-it-matters" className="scroll-mt-32">
            <h2 className="text-[11px] font-black font-mono uppercase tracking-[0.4em] text-neutral-500 mb-6 border-b border-neutral-900 pb-2">{dict.common.whyItMatters}</h2>
            <div className="prose prose-invert prose-neutral max-w-none prose-p:font-mono prose-p:text-sm prose-p:leading-loose">
              {whyItMatters}
            </div>
          </section>

          <section id="trend-breakdown" className="scroll-mt-32">
            <h2 className="text-[11px] font-black font-mono uppercase tracking-[0.4em] text-neutral-500 mb-6 border-b border-neutral-900 pb-2">{dict.common.trendBreakdown}</h2>
            <div className="prose prose-invert prose-neutral max-w-none prose-p:font-mono prose-p:text-sm prose-p:leading-loose prose-h3:font-black prose-h3:uppercase prose-h3:tracking-tight prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4">
              {trendBreakdown}
            </div>
          </section>

          <section id="data-signals" className="scroll-mt-32">
            <h2 className="text-[11px] font-black font-mono uppercase tracking-[0.4em] text-neutral-500 mb-6 border-b border-neutral-900 pb-2">{dict.common.dataSignalsToWatch}</h2>
            <div className="overflow-x-auto border border-neutral-900 rounded-sm">
              <table className="w-full text-left font-mono text-xs md:text-sm whitespace-nowrap md:whitespace-normal">
                <thead className="bg-neutral-950 uppercase text-[10px] tracking-widest text-neutral-500">
                  <tr>
                    {dataSignalsTable.header.map((th, i) => (
                      <th key={i} className="px-6 py-4 border-b border-neutral-900 font-normal">{th}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {dataSignalsTable.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-neutral-950/50 transition-colors">
                      {row.map((td, j) => (
                        <td key={j} className="px-6 py-4 text-neutral-300">{td}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="sonic-velocity-insight" className="scroll-mt-32">
            <h2 className="text-[11px] font-black font-mono uppercase tracking-[0.4em] text-neutral-500 mb-6 border-b border-neutral-900 pb-2">{dict.common.sonicVelocityInsight}</h2>
            <div className="bg-neutral-900/50 p-8 md:p-10 border-l-4 border-white font-mono text-sm leading-loose">
              {sonicVelocityInsight}
            </div>
          </section>

          <section id="faq" className="scroll-mt-32">
            <h2 className="text-[11px] font-black font-mono uppercase tracking-[0.4em] text-neutral-500 mb-6 border-b border-neutral-900 pb-2">{dict.common.faq}</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-neutral-900 p-6 bg-neutral-950">
                  <h3 className="text-lg font-black uppercase tracking-tight mb-3">{faq.question}</h3>
                  <p className="font-mono text-sm text-neutral-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="related" className="scroll-mt-32 pt-12 border-t border-neutral-900">
            <h2 className="text-[11px] font-black font-mono uppercase tracking-[0.4em] text-neutral-500 mb-8">{dict.common.relatedReading}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedReading.map((link, i) => (
                <Link key={i} href={link.href} className="block group p-6 border border-neutral-900 hover:bg-neutral-950 transition-colors">
                  <h3 className="text-lg font-black uppercase tracking-tight mb-2 group-hover:text-white text-neutral-200">{link.title}</h3>
                  <p className="font-mono text-xs text-neutral-500 leading-relaxed">{link.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
