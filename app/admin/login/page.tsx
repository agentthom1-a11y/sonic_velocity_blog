'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';



export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Login failed');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-mono">
      {/* Prevent the admin layout redirect loop — this page is outside the layout */}
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center">
          <p className="text-[9px] text-neutral-700 uppercase tracking-[0.5em] mb-3">Sonic Velocity</p>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            CMS<span className="text-cyan-500">_</span>ACCESS
          </h1>
          <p className="text-[9px] text-neutral-700 uppercase tracking-widest mt-2">Editorial System v1.0</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[9px] text-neutral-600 uppercase tracking-[0.3em] block mb-2">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="admin@velocity.ai"
            />
          </div>
          <div>
            <label className="text-[9px] text-neutral-600 uppercase tracking-[0.3em] block mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-[10px] text-red-500 uppercase tracking-widest py-2 border border-red-900 bg-red-950/30 px-4">
              ERROR: {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] py-3 hover:bg-cyan-400 transition-colors disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
          </button>
        </form>

        <p className="mt-8 text-center text-[8px] text-neutral-800 uppercase tracking-widest">
          Sonic Velocity Editorial — Restricted Access
        </p>
      </div>
    </div>
  );
}
