import React from 'react';
import { Shield, Lock, Activity, Server, Wifi, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

interface InfoPageProps {
  onBack: () => void;
}

export const Terms: React.FC<InfoPageProps> = ({ onBack }) => (
  <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 text-neutral-300 animate-[fadeIn_0.5s_ease-out]">
    <button onClick={onBack} className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-12 hover:text-white transition-colors">
      <ArrowLeft className="w-4 h-4" /> Return to Base
    </button>
    
    <div className="border-b border-neutral-800 pb-8 mb-12">
      <h1 className="text-4xl font-bold text-white uppercase tracking-tighter mb-4">Terms of Service</h1>
      <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">Protocol: User Agreement v1.0</p>
    </div>

    <div className="space-y-12 font-mono text-sm leading-relaxed">
      <section>
        <h3 className="text-white font-bold uppercase tracking-wider mb-4">01 // Usage License</h3>
        <p className="text-neutral-400">
          By initializing the Velocity Audio Engine, you are granted a non-exclusive, perpetual license to use the generated audio artifacts for both personal and commercial purposes on digital platforms including but not limited to TikTok, Instagram, and YouTube.
        </p>
      </section>

      <section>
        <h3 className="text-white font-bold uppercase tracking-wider mb-4">02 // Liability Limits</h3>
        <p className="text-neutral-400">
          Velocity Systems is not liable for any content generated that mimics protected intellectual property inadvertently. The Neural Engine operates on stochastic processes. Users maintain full responsibility for the final deployment of audio assets.
        </p>
      </section>

      <section>
        <h3 className="text-white font-bold uppercase tracking-wider mb-4">03 // Service Availability</h3>
        <p className="text-neutral-400">
          We do not guarantee 100% uptime. The system may undergo maintenance cycles during which the Synthesis API will be unreachable. Refunds are not issued for downtime less than 24 hours.
        </p>
      </section>
    </div>
  </div>
);

export const Privacy: React.FC<InfoPageProps> = ({ onBack }) => (
  <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 text-neutral-300 animate-[fadeIn_0.5s_ease-out]">
    <button onClick={onBack} className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-12 hover:text-white transition-colors">
      <ArrowLeft className="w-4 h-4" /> Return to Base
    </button>

    <div className="border-b border-neutral-800 pb-8 mb-12">
      <h1 className="text-4xl font-bold text-white uppercase tracking-tighter mb-4">Privacy Protocols</h1>
      <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">Protocol: Data Encryption</p>
    </div>

    <div className="space-y-12 font-mono text-sm leading-relaxed">
      <section className="border border-neutral-800 bg-neutral-900/30 p-8">
        <div className="flex items-center gap-4 mb-6">
          <Lock className="w-6 h-6 text-green-500" />
          <h3 className="text-white font-bold uppercase tracking-wider">Data Retention Policy</h3>
        </div>
        <p className="text-neutral-400">
          All inputs (Prompts, Mood Vectors) are processed ephemerally. We do not store user generation history longer than 30 days unless the user holds a "Studio Agency" tier account. Audio files are purged from cache after 24 hours.
        </p>
      </section>

      <section>
        <h3 className="text-white font-bold uppercase tracking-wider mb-4">01 // Anonymity</h3>
        <p className="text-neutral-400">
          Velocity operates with a strict "No-Log" policy regarding IP addresses. Your creation patterns are not analyzed for advertising purposes.
        </p>
      </section>

      <section>
        <h3 className="text-white font-bold uppercase tracking-wider mb-4">02 // Third Party Processors</h3>
        <p className="text-neutral-400">
          Payments are processed via encrypted gateways (Stripe/Midtrans). Velocity Systems does not have access to your raw financial instruments.
        </p>
      </section>
    </div>
  </div>
);

export const SystemStatus: React.FC<InfoPageProps> = ({ onBack }) => (
  <div className="max-w-5xl mx-auto px-6 pt-32 pb-20 animate-[fadeIn_0.5s_ease-out]">
    <button onClick={onBack} className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-12 text-neutral-500 hover:text-white transition-colors">
      <ArrowLeft className="w-4 h-4" /> Return to Base
    </button>

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
