'use client';
import { useState } from 'react';

export default function AdminCategoriesPage() {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [msg,  setMsg]  = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description: desc }),
    });
    const d = await res.json();
    if (res.ok) { setMsg(`Created: ${d.category.name}`); setName(''); setDesc(''); }
    else setMsg(`Error: ${d.error}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 font-mono">
      <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-10 border-b border-neutral-900 pb-6">Categories</h1>
      <form onSubmit={handleCreate} className="space-y-4 max-w-md">
        <div>
          <label className="text-[8px] uppercase tracking-widest text-neutral-600 block mb-2">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors" />
        </div>
        <div>
          <label className="text-[8px] uppercase tracking-widest text-neutral-600 block mb-2">Description</label>
          <input value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors" />
        </div>
        <button type="submit" className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-colors">Create Category</button>
        {msg && <p className="text-[10px] text-cyan-400 uppercase tracking-widest">{msg}</p>}
      </form>
      <p className="mt-12 text-[9px] text-neutral-700 uppercase tracking-widest">Default categories (Engineering, Product, Culture, Scene Radar, Archive) are auto-seeded on first dashboard visit.</p>
    </div>
  );
}
