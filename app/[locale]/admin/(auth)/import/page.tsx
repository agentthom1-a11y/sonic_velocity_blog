'use client';
import { useState } from 'react';

interface ImportResult {
  total: number; success: number; failed: number;
  created_ids: number[];
  results: { index: number; title: string; id?: number; slug?: string; error?: string }[];
}

export default function AdminImportPage() {
  const [jsonText, setJsonText] = useState('');
  const [apiKey,   setApiKey]   = useState('');
  const [result,   setResult]   = useState<ImportResult | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    let body: unknown;
    try { body = JSON.parse(jsonText); }
    catch { setError('Invalid JSON. Please check your input.'); setLoading(false); return; }

    const res = await fetch('/api/internal/ai/transmissions/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const d = await res.json();
    if (!res.ok && res.status !== 207) setError(d.error || 'Import failed');
    else setResult(d);
    setLoading(false);
  };

  const exampleJson = JSON.stringify({
    collection: "hipdut-trend-pack-02",
    posts: [{
      title: "Example Post Title",
      excerpt: "A brief description of the post content here.",
      content_markdown: "## Introduction\n\nYour content goes here...",
      category: "Culture",
      tags: ["hipdut", "indonesia"],
      cover_image_url: "https://images.unsplash.com/photo-1...",
      seo_title: "Example Post | Sonic Velocity",
      meta_description: "A brief description for search engines.",
      status: "draft",
      source_type: "ai_agent"
    }]
  }, null, 2);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 font-mono">
      <div className="mb-10 border-b border-neutral-900 pb-6">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Bulk JSON Import</h1>
        <p className="text-[9px] text-neutral-600 mt-2 uppercase tracking-widest">
          Import seed packs — validated per-record, auto-publishes with trusted API key
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleImport} className="space-y-5">
          <div>
            <label className="text-[8px] uppercase tracking-widest text-neutral-700 block mb-2">API Key (with write or auto_publish scope)</label>
            <input
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              required
              type="password"
              className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors font-mono"
              placeholder="svk_..."
            />
          </div>

          <div>
            <label className="text-[8px] uppercase tracking-widest text-neutral-700 block mb-2">
              JSON Payload
            </label>
            <textarea
              value={jsonText}
              onChange={e => setJsonText(e.target.value)}
              required
              rows={18}
              className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-white transition-colors resize-y"
              placeholder='{ "collection": "pack-name", "posts": [...] }'
            />
          </div>

          {error && <p className="text-[10px] text-red-400 uppercase tracking-widest border border-red-900 px-4 py-3 bg-red-950/20">{error}</p>}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-cyan-400 transition-colors disabled:opacity-50"
            >
              {loading ? 'Importing...' : 'Run Import'}
            </button>
            <button type="button" onClick={() => setJsonText(exampleJson)} className="px-6 py-3 border border-neutral-800 text-[9px] uppercase tracking-widest text-neutral-500 hover:text-white hover:border-neutral-600 transition-all">
              Load Example
            </button>
          </div>
        </form>

        {/* Results Panel */}
        <div>
          {result && (
            <div className="border border-neutral-900 p-6 space-y-4">
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-4">Import Results</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center border border-neutral-900 p-4">
                  <p className="text-3xl font-black text-white">{result.total}</p>
                  <p className="text-[7px] uppercase tracking-widest text-neutral-700 mt-1">Total</p>
                </div>
                <div className="text-center border border-green-900 p-4">
                  <p className="text-3xl font-black text-green-400">{result.success}</p>
                  <p className="text-[7px] uppercase tracking-widest text-neutral-700 mt-1">Success</p>
                </div>
                <div className="text-center border border-red-900 p-4">
                  <p className="text-3xl font-black text-red-400">{result.failed}</p>
                  <p className="text-[7px] uppercase tracking-widest text-neutral-700 mt-1">Failed</p>
                </div>
              </div>

              {result.results.map((r, i) => (
                <div key={i} className={`flex items-start gap-3 py-3 border-b border-neutral-900 ${r.error ? 'text-red-400' : 'text-neutral-400'}`}>
                  <span className="text-[8px] w-6 shrink-0 text-neutral-700">{r.index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-white truncate">{r.title}</p>
                    {r.error ? (
                      <p className="text-[8px] text-red-400 mt-1">✗ {r.error}</p>
                    ) : (
                      <p className="text-[8px] text-green-400 mt-1">✓ Created #{r.id} — /transmissions/{r.slug}</p>
                    )}
                  </div>
                </div>
              ))}

              {result.success > 0 && (
                <a href="/admin/transmissions" className="mt-4 inline-block text-[9px] uppercase tracking-widest text-cyan-400 hover:text-white transition-colors">
                  View All Transmissions →
                </a>
              )}
            </div>
          )}

          {!result && (
            <div className="border border-dashed border-neutral-900 p-6">
              <h3 className="text-[9px] uppercase tracking-widest text-neutral-700 mb-4">Expected Format</h3>
              <pre className="text-[9px] text-neutral-600 overflow-x-auto leading-relaxed">{`{
  "collection": "pack-name",
  "posts": [
    {
      "title": "...",       // required
      "excerpt": "...",     // required
      "content_markdown": "...", // required
      "category": "Culture",
      "tags": ["tag1"],
      "status": "draft",
      "source_type": "ai_agent",
      "cover_image_url": "...",
      "seo_title": "...",
      "meta_description": "..."
    }
  ]
}`}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
