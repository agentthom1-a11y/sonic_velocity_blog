'use client';
import { useState, useEffect } from 'react';

export default function AdminTagsPage() {
  const [tags,  setTags]  = useState<{id: number; name: string; slug: string}[]>([]);
  const [name,  setName]  = useState('');
  const [msg,   setMsg]   = useState('');

  useEffect(() => { fetchTags(); }, []);

  const fetchTags = async () => {
    const res = await fetch('/api/admin/tags');
    const d = await res.json();
    if (res.ok) setTags(d.tags);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const d = await res.json();
    if (res.ok) { setMsg(`Created: ${d.tag.name}`); setName(''); fetchTags(); }
    else setMsg(`Error: ${d.error}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 font-mono">
      <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-10 border-b border-neutral-900 pb-6">Tags</h1>
      <form onSubmit={handleCreate} className="flex gap-4 max-w-md mb-10">
        <input value={name} onChange={e => setName(e.target.value)} required className="flex-1 bg-neutral-950 border border-neutral-800 px-4 py-2 text-sm text-white focus:outline-none focus:border-white" placeholder="New tag name..." />
        <button type="submit" className="px-6 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-colors">Add</button>
      </form>
      {msg && <p className="text-[9px] text-cyan-400 uppercase tracking-widest mb-6">{msg}</p>}
      <div className="flex flex-wrap gap-3">
        {tags.map(t => (
          <span key={t.id} className="px-4 py-2 border border-neutral-800 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
            {t.name} <span className="text-neutral-700">({t.slug})</span>
          </span>
        ))}
      </div>
    </div>
  );
}
