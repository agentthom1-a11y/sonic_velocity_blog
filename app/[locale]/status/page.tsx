'use client';

import { Shield, Lock, Activity, Server, Wifi, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SystemStatusPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-20 animate-[fadeIn_0.5s_ease-out]">
      <Link href="/" className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-12 text-neutral-500 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Return to Base
      </Link>

      <div className="flex items-end justify-between border-b border-neutral-800 pb-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white uppercase tracking-tighter mb-2">System Diagnostics</h1>
          <p className="font-mono text-xs text-green-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            All Systems Operational
          </p>
        </div>
        <div className="text-right hidden md:block">
           <p className="font-mono text-xs text-neutral-600">Last Update: {new Date().toUTCString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: "API Gateway", status: "Online", latency: "24ms", icon: Server },
          { label: "Neural Engine", status: "Processing", latency: "120ms", icon: Activity },
          { label: "CDN Nodes", status: "Active (SG_1)", latency: "12ms", icon: Wifi },
        ].map((item, i) => (
          <div key={i} className="bg-black border border-neutral-800 p-6 group hover:border-neutral-600 transition-colors">
             <div className="flex justify-between items-start mb-6">
                <item.icon className="w-5 h-5 text-neutral-400" />
                <span className="flex items-center gap-2 text-[10px] font-mono text-green-500 uppercase border border-green-900 bg-green-950/30 px-2 py-1 rounded-sm">
                   <CheckCircle className="w-3 h-3" /> {item.status}
                </span>
             </div>
             <h3 className="text-lg font-bold text-white uppercase mb-1">{item.label}</h3>
             <p className="font-mono text-xs text-neutral-500">Latency: {item.latency}</p>
          </div>
        ))}
      </div>

      <div className="border border-neutral-800 bg-neutral-900/20 p-8">
         <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Incident Log</h3>
         <div className="space-y-4">
            {[
               { date: "2024-03-15", event: "Maintenance: Database migration completed.", status: "Resolved" },
               { date: "2024-02-28", event: "Minor latency detected in Jakarta region.", status: "Resolved" },
               { date: "2024-01-10", event: "System Upgrade: v1.0 Launch.", status: "Completed" }
            ].map((log, i) => (
               <div key={i} className="flex flex-col md:flex-row md:items-center justify-between font-mono text-xs py-3 border-b border-neutral-800/50 last:border-0">
                  <div className="flex items-center gap-4">
                     <span className="text-neutral-500 w-24">{log.date}</span>
                     <span className="text-neutral-300">{log.event}</span>
                  </div>
                  <span className="text-green-500 uppercase mt-2 md:mt-0">{log.status}</span>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
