'use client';
import { useState, useEffect } from 'react';

interface ApiKey {
  id: number; name: string; status: string;
  scopes: string; lastUsedAt: string | null;
  createdAt: string; expiresAt: string | null;
}

export default function ApiKeysPage() {
  const [keys,       setKeys]       = useState<ApiKey[]>([]);
  const [name,       setName]       = useState('');
  const [scopes,     setScopes]     = useState<string[]>(['write']);
  const [newKey,     setNewKey]     = useState('');
  const [loading,    setLoading]    = useState(false);
  const [msg,        setMsg]        = useState('');

  useEffect(() => { fetchKeys(); }, []);

  const fetchKeys = async () => {
    const res = await fetch('/api/admin/api-keys');
    const d = await res.json();
    if (res.ok) setKeys(d.keys);
  };

  const toggleScope = (scope: string) => {
    setScopes(prev => prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNewKey('');
    const res = await fetch('/api/admin/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, scopes }),
    });
    const d = await res.json();
    if (res.ok) {
      setNewKey(d.raw_key);
      setMsg('Key created — copy it now, it will not be shown again.');
      setName('');
      fetchKeys();
    } else setMsg(`Error: ${d.error}`);
    setLoading(false);
  };

  const handleRevoke = async (id: number) => {
    if (!confirm('Revoke this API key?')) return;
    await fetch(`/api/admin/api-keys/${id}`, { method: 'DELETE' });
    fetchKeys();
  };

  const SCOPE_OPTIONS = [
    { value: 'write',        label: 'Write',        desc: 'Create/edit posts as draft' },
    { value: 'publish',      label: 'Publish',      desc: 'Can publish posts directly' },
    { value: 'auto_publish', label: 'Auto Publish ★', desc: 'Trusted source — bypass review, auto-publish on ingest' },
    { value: 'schedule',     label: 'Schedule',     desc: 'Can schedule future publish' },
    { value: 'delete',       label: 'Delete',       desc: 'Can archive/delete posts' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 font-mono">
      <div className="mb-10 border-b border-neutral-900 pb-6">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">API Keys</h1>
        <p className="text-[9px] text-neutral-600 mt-2 uppercase tracking-widest">Manage AI agent credentials. Keys are stored hashed — raw value shown once.</p>
      </div>

      {/* Create Form */}
      <div className="border border-neutral-900 p-6 mb-10">
        <h2 className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-6">Create New API Key</h2>
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="text-[8px] uppercase tracking-widest text-neutral-700 block mb-2">Key Name / Description</label>
            <input value={name} onChange={e => setName(e.target.value)} required className="w-full max-w-sm bg-neutral-950 border border-neutral-800 px-4 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors" placeholder="e.g. AI Agent v1 / Prod" />
          </div>

          <div>
            <label className="text-[8px] uppercase tracking-widest text-neutral-700 block mb-3">Scopes</label>
            <div className="space-y-2">
              {SCOPE_OPTIONS.map(s => (
                <label key={s.value} className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={scopes.includes(s.value)} onChange={() => toggleScope(s.value)} className="mt-1 w-3 h-3 accent-cyan-500" />
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${s.value === 'auto_publish' ? 'text-cyan-400' : 'text-neutral-400'} group-hover:text-white transition-colors`}>{s.label}</span>
                    <p className="text-[8px] text-neutral-700 mt-0.5">{s.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="px-6 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-colors disabled:opacity-50">
            {loading ? 'Generating...' : 'Generate Key'}
          </button>
        </form>

        {newKey && (
          <div className="mt-6 p-4 border border-cyan-900 bg-cyan-950/20">
            <p className="text-[8px] uppercase tracking-widest text-cyan-500 mb-2">⚠ Copy this key now — it will not be shown again:</p>
            <code className="text-sm text-white break-all select-all">{newKey}</code>
          </div>
        )}
        {msg && !newKey && <p className="mt-4 text-[9px] text-neutral-500 uppercase tracking-widest">{msg}</p>}
      </div>

      {/* Keys List */}
      <div>
        <h2 className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-4">Active Keys ({keys.filter(k => k.status === 'active').length})</h2>
        <div className="border border-neutral-900 divide-y divide-neutral-900">
          {keys.length === 0 && <p className="text-[9px] text-neutral-700 text-center py-10 uppercase tracking-widest">No keys yet.</p>}
          {keys.map(key => {
            const parsedScopes: string[] = JSON.parse(key.scopes || '[]');
            return (
              <div key={key.id} className="px-4 py-4 flex items-center gap-6">
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{key.name}</p>
                  <div className="flex gap-2 mt-1">
                    {parsedScopes.map(s => (
                      <span key={s} className={`text-[7px] uppercase tracking-widest px-2 py-0.5 border ${s === 'auto_publish' ? 'border-cyan-800 text-cyan-400' : 'border-neutral-800 text-neutral-600'}`}>{s}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right space-y-1 shrink-0">
                  <span className={`text-[8px] uppercase tracking-widest ${key.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>{key.status}</span>
                  <p className="text-[7px] text-neutral-700">Last used: {key.lastUsedAt?.slice(0, 10) || 'never'}</p>
                  <p className="text-[7px] text-neutral-700">Created: {key.createdAt?.slice(0, 10)}</p>
                </div>
                {key.status === 'active' && (
                  <button onClick={() => handleRevoke(key.id)} className="text-[8px] uppercase text-neutral-600 hover:text-red-400 transition-colors ml-4">Revoke</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
