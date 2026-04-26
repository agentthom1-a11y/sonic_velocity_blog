'use client';

import React, { useState } from 'react';
import { Lock, User, ArrowRight, Command, Hexagon, Fingerprint, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppContext } from './AppContext';


const Login: React.FC = () => {
  const { handleLoginSuccess } = useAppContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Login failed');

      handleLoginSuccess(data.tier);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] relative overflow-hidden p-6">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neutral-900/30 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] pointer-events-none"></div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10 animate-[fadeIn_0.5s_ease-out]">
        
        {/* Card Header */}
        <div className="text-center mb-10">
           <div className="inline-flex items-center justify-center w-16 h-16 bg-black border border-neutral-800 rounded-full mb-6 shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)]">
              <Fingerprint className="w-8 h-8 text-white animate-pulse" strokeWidth={1} />
           </div>
           <h1 className="text-2xl font-bold text-white uppercase tracking-widest mb-2">System Access</h1>
           <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em]">Identity Verification Protocol</p>
        </div>

        {/* Form Container */}
        <div className="bg-black/50 backdrop-blur-xl border border-neutral-800 p-8 md:p-10 relative group">
           {/* Corner Accents */}
           <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t border-l border-white/50"></div>
           <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t border-r border-white/50"></div>
           <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b border-l border-white/50"></div>
           <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b border-r border-white/50"></div>

           <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Email Input */}
              <div className="space-y-2 group/input">
                 <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex justify-between">
                    <span>Operator ID</span>
                    <span className="opacity-0 group-focus-within/input:opacity-100 transition-opacity text-green-500">READY</span>
                 </label>
                 <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-neutral-600 group-focus-within/input:text-white transition-colors" />
                    <input 
                       type="email" 
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className="w-full bg-neutral-900/50 border border-neutral-800 text-white px-12 py-3 text-sm font-mono focus:outline-none focus:border-white focus:bg-black transition-all placeholder-neutral-700"
                       placeholder="user@velocity.ai"
                       required
                    />
                 </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2 group/input">
                 <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex justify-between">
                    <span>Passcode</span>
                    <span className="opacity-0 group-focus-within/input:opacity-100 transition-opacity text-green-500">SECURE</span>
                 </label>
                 <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-4 h-4 text-neutral-600 group-focus-within/input:text-white transition-colors" />
                    <input 
                       type="password" 
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       className="w-full bg-neutral-900/50 border border-neutral-800 text-white px-12 py-3 text-sm font-mono focus:outline-none focus:border-white focus:bg-black transition-all placeholder-neutral-700"
                       placeholder="••••••••••••"
                       required
                       minLength={6}
                    />
                 </div>
              </div>

              {/* Error message */}
              {error && (
                <p className="text-red-400 text-[11px] font-mono text-center py-1">{error}</p>
              )}

              {/* Submit Button */}
              <button 
                 type="submit"
                 disabled={isLoading}
                 className="w-full relative group/btn overflow-hidden bg-white text-black py-4 mt-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-neutral-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                 <div className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                       <>
                          <span className="w-2 h-2 bg-black rounded-full animate-ping"></span>
                          <span>Handshaking...</span>
                       </>
                    ) : (
                       <>
                          <span>Initialize Session</span>
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                       </>
                    )}
                 </div>
              </button>
           </form>

           {/* Divider */}
           <div className="flex items-center gap-4 my-8">
              <div className="h-px bg-neutral-800 flex-1"></div>
              <span className="text-[9px] font-mono text-neutral-600 uppercase">Or Authenticate With</span>
              <div className="h-px bg-neutral-800 flex-1"></div>
           </div>

           {/* Social Auth */}
           <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 border border-neutral-800 hover:bg-neutral-900 hover:border-neutral-600 transition-all text-white">
                 <Command className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase tracking-wider">Apple</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border border-neutral-800 hover:bg-neutral-900 hover:border-neutral-600 transition-all text-white">
                 <Hexagon className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase tracking-wider">Google</span>
              </button>
           </div>
        </div>

        {/* Footer Links */}
        <div className="flex justify-between items-center mt-6 px-2">
           <button className="text-[10px] font-mono text-neutral-500 hover:text-white uppercase tracking-wider transition-colors">
              Reset Credentials
           </button>
           <button className="text-[10px] font-mono text-neutral-500 hover:text-white uppercase tracking-wider transition-colors flex items-center gap-1">
              Create Account <ChevronRight className="w-3 h-3" />
           </button>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
