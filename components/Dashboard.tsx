'use client';

import React from 'react';
import { Activity, ArrowRight, Clock, CreditCard, HardDrive, LayoutGrid, MessageSquare, Music, Play, Plus, Settings, User, Zap, LogOut, Moon, Sun, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Link } from '@/components/Link';
import { useAppContext } from './AppContext';

interface DashboardProps {
  dict?: any;
}

const Dashboard: React.FC<DashboardProps> = ({ dict }) => {
  const t = (key: string, fallback: string) => {
    if (!dict) return fallback;
    const parts = key.split('.');
    let cur = dict;
    for (const part of parts) {
      if (cur && cur[part] !== undefined) {
        cur = cur[part];
      } else {
        return fallback;
      }
    }
    return cur || fallback;
  };

  const { theme, toggleTheme, userTier, handleSignOut, jobs } = useAppContext();
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const currentJobs = jobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const getTierName = () => {
    switch(userTier) {
      case 'premium': return 'Velocity Premium';
      case 'pro': return 'Creator Pro';
      case 'agency': return 'Studio Agency';
      default: return 'Velocity Basic (Free)';
    }
  };

  const getTierColor = () => {
     if (userTier === 'pro' || userTier === 'agency') return 'text-green-500';
     if (userTier === 'premium') return 'text-blue-400';
     return 'text-neutral-400';
  };

  const onSignOut = () => {
    handleSignOut();
    router.push('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-[fadeIn_0.5s_ease-out] w-full relative pt-32">
      
      {/* TOP BAR: Welcome & Quick Stats */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
         <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-green-900/30 bg-green-950/10 rounded-full mb-4">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-green-400">{t('common.sessionActive', 'Session Active')}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
               Operator <span className="text-neutral-600">{t('common.dashboard', 'Dashboard')}</span>
            </h1>
            <p className="font-mono text-xs text-neutral-500 mt-2 uppercase tracking-wider">
               {t('common.welcomeBack', 'Welcome back, User_01. Systems nominal.')}
            </p>
         </div>
         
         <div className="flex gap-4">
            <Link 
               href="/pricing"
               className="px-6 py-3 border border-neutral-800 text-white font-bold uppercase tracking-wider text-xs hover:bg-neutral-900 transition-colors flex items-center gap-2"
            >
               <CreditCard className="w-4 h-4" /> {t('common.upgradePlan', 'Upgrade Plan')}
            </Link>
            <Link 
               href="/studio"
               className="px-6 py-3 bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
               <Plus className="w-4 h-4" /> {t('common.newProject', 'New Project')}
            </Link>
         </div>
      </div>

      {/* RESOURCE MONITOR GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         {/* Card 1: Credits */}
         <div className="border border-neutral-800 bg-black p-6 relative group hover:border-neutral-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 bg-neutral-900 flex items-center justify-center border border-neutral-800">
                  <Zap className="w-5 h-5 text-yellow-500" />
               </div>
               <span className="text-[10px] font-mono text-neutral-500 uppercase">{t('common.resetsIn12Days', 'Resets in 12 Days')}</span>
            </div>
            <h3 className="text-sm font-mono text-neutral-400 uppercase tracking-widest mb-1">{t('common.computeCredits', 'Compute Credits')}</h3>
            <div className="flex items-baseline gap-2 mb-4">
               <span className="text-3xl font-bold text-white">
                  {userTier === 'free' ? '50' : userTier === 'premium' ? '840' : 'UNLMTD'}
               </span>
               <span className="text-sm text-neutral-600 font-mono">
                  {userTier === 'free' ? '/ 100' : userTier === 'premium' ? '/ 1000' : '/ ∞'}
               </span>
            </div>
            <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
               <div className={`h-full ${userTier === 'pro' || userTier === 'agency' ? 'w-full bg-green-500' : 'w-[50%] bg-yellow-500'}`}></div>
            </div>
         </div>

         {/* Card 2: Storage */}
         <div className="border border-neutral-800 bg-black p-6 relative group hover:border-neutral-600 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-neutral-900 flex items-center justify-center border border-neutral-800">
                   <HardDrive className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase">Cloud Node SG_1</span>
             </div>
             <h3 className="text-sm font-mono text-neutral-400 uppercase tracking-widest mb-1">{t('common.storageAllocated', 'Storage Allocated')}</h3>
             <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-white">2.4</span>
                <span className="text-sm text-neutral-600 font-mono">GB / {userTier === 'free' ? '5.0' : '100'} GB</span>
             </div>
             <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full w-[20%] bg-blue-500"></div>
             </div>
         </div>

         {/* Card 3: Tier Status */}
         <div className="border border-neutral-800 bg-black p-6 relative group hover:border-neutral-600 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-neutral-900 flex items-center justify-center border border-neutral-800">
                   <Activity className={`w-5 h-5 ${getTierColor()}`} />
                </div>
                <span className={`px-2 py-1 border text-[9px] font-bold uppercase ${
                    userTier === 'free' ? 'bg-neutral-900 border-neutral-800 text-neutral-500' : 'bg-green-900/20 border-green-900 text-green-500'
                }`}>
                   {userTier === 'free' ? t('common.standard', 'Standard') : t('common.active', 'Active')}
                </span>
             </div>
             <h3 className="text-sm font-mono text-neutral-400 uppercase tracking-widest mb-1">{t('common.currentLicense', 'Current License')}</h3>
             <div className="flex items-baseline gap-2 mb-4">
                <span className={`text-xl font-bold uppercase ${getTierColor()}`}>
                   {getTierName()}
                </span>
             </div>
             <Link href="/pricing" className="text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-1 hover:text-green-400 transition-colors">
                {t('common.upgradeLicense', 'Upgrade License')} <ArrowRight className="w-3 h-3" />
             </Link>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* JOB HISTORY PAGINATED LIST */}
         <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6 border-b border-neutral-800 pb-4">
               <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-5 h-5 text-neutral-500" /> {t('common.generationHistory', 'Generation History')}
               </h2>
               <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">
                     {t('common.total', 'Total')}: {jobs.length} {t('common.units', 'Units')}
                  </span>
               </div>
            </div>

            {jobs.length > 0 ? (
               <>
                  <div className="space-y-3 mb-8">
                     {currentJobs.map((job) => (
                        <div key={job.jobId} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-neutral-800 bg-neutral-900/20 hover:bg-neutral-900/40 transition-all group relative overflow-hidden">
                           {/* Status Accent Bar */}
                           <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                              job.status === 'done' ? 'bg-green-500' : 
                              job.status === 'processing' ? 'bg-blue-500' : 
                              job.status === 'queued' ? 'bg-yellow-500' : 'bg-red-500'
                           }`} />

                           <div className="flex items-center gap-4 mb-3 md:mb-0">
                              <div className="w-10 h-10 bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0">
                                 {job.status === 'done' ? (
                                    <Music className="w-4 h-4 text-green-500" />
                                 ) : job.status === 'processing' ? (
                                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                                 ) : (
                                    <Clock className="w-4 h-4 text-neutral-500" />
                                 )}
                              </div>
                              <div>
                                 <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-bold text-white uppercase tracking-wide truncate max-w-[200px]">
                                       {job.topic}
                                    </h4>
                                    <span className="px-1.5 py-0.5 bg-neutral-800 text-[8px] font-mono font-bold text-neutral-400 uppercase tracking-widest rounded-sm">
                                       {job.preset}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-3 text-[9px] font-mono text-neutral-500 uppercase">
                                    <span className="flex items-center gap-1">
                                       ID: <span className="text-neutral-300">{job.jobId.substring(0, 8)}...</span>
                                    </span>
                                    <span className="w-1 h-1 bg-neutral-700 rounded-full"></span>
                                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-neutral-800 pt-3 md:pt-0">
                              <div className="flex items-center gap-3">
                                 <div className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest ${
                                    job.status === 'done' ? 'border-green-900/50 bg-green-950/20 text-green-500' :
                                    job.status === 'processing' ? 'border-blue-900/50 bg-blue-950/20 text-blue-500' :
                                    job.status === 'queued' ? 'border-yellow-900/50 bg-yellow-950/20 text-yellow-500' :
                                    'border-red-900/50 bg-red-950/20 text-red-500'
                                 }`}>
                                    {job.status}
                                 </div>
                                 {job.status === 'done' && (
                                    <button className="w-8 h-8 flex items-center justify-center border border-neutral-800 rounded-full hover:bg-white hover:text-black transition-colors focus:outline-none">
                                       <Play className="w-3 h-3 fill-current ml-0.5" />
                                    </button>
                                 )}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                     <div className="flex items-center justify-center gap-4 pt-4 border-t border-neutral-800/50">
                        <button 
                           onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                           disabled={currentPage === 1}
                           className="p-2 border border-neutral-800 hover:bg-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                           <ChevronLeft className="w-4 h-4 text-white" />
                        </button>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Page</span>
                           <span className="text-sm font-bold text-white font-mono">{currentPage}</span>
                           <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">of {totalPages}</span>
                        </div>
                        <button 
                           onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                           disabled={currentPage === totalPages}
                           className="p-2 border border-neutral-800 hover:bg-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                           <ChevronRight className="w-4 h-4 text-white" />
                        </button>
                     </div>
                  )}
               </>
            ) : (
               <div className="py-16 text-center border border-dashed border-neutral-800 rounded-sm">
                  <div className="w-12 h-12 bg-neutral-900/50 border border-neutral-800 flex items-center justify-center mx-auto mb-4 opacity-50 relative">
                     <Clock className="w-6 h-6 text-neutral-500" />
                     <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500/20 border border-red-500/50 rounded-full flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                     </div>
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">{t('common.noActiveLogs', 'No Active Logs')}</h3>
                  <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                     {t('common.historyEmpty', 'Your atmospheric synthesis history is currently empty.')}
                  </p>
                  <Link 
                     href="/studio"
                     className="mt-6 inline-block px-4 py-2 bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-white uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                  >
                     {t('common.initiateSequence', 'Initiate Sequence')}
                  </Link>
               </div>
            )}
         </div>

         {/* SYSTEM NOTIFICATIONS & FEED */}
         <div>
            <div className="flex items-center justify-between mb-6 border-b border-neutral-800 pb-4">
               <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-neutral-500" /> {t('common.systemFeed', 'System Feed')}
               </h2>
            </div>

            <div className="space-y-6 border-l border-neutral-800 pl-6 relative">
               {[
                  { title: "Model Update: Music-01b", date: "Today", desc: "Improved bass response for Dangdut Koplo preset.", priority: "High" },
                  { title: "Maintenance Scheduled", date: "Mar 20", desc: "System will be offline for 30 mins for GPU upgrades.", priority: "Med" },
                  { title: "New Tutorial Available", date: "Mar 18", desc: "Learn how to use the new Stem Separation module.", priority: "Low" }
               ].map((note, i) => (
                  <div key={i} className="relative">
                     {/* Timeline Dot */}
                     <div className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-black ${
                        note.priority === 'High' ? 'bg-green-500' : note.priority === 'Med' ? 'bg-yellow-500' : 'bg-neutral-600'
                     }`}></div>
                     
                     <span className="text-[10px] font-mono text-neutral-500 uppercase mb-1 block">{note.date}</span>
                     <h4 className="text-sm font-bold text-white uppercase tracking-wide mb-2">{note.title}</h4>
                     <p className="text-xs font-mono text-neutral-400 leading-relaxed">
                        {note.desc}
                     </p>
                  </div>
               ))}
            </div>

            {/* User Preferences */}
            <div className="mt-12 p-6 border border-dashed border-neutral-800 bg-neutral-900/10 rounded-sm">
               <div className="text-center mb-6">
                   <Settings className="w-8 h-8 text-neutral-700 mx-auto mb-2" />
                   <h4 className="text-sm font-bold text-white uppercase tracking-wide">{t('common.userPreferences', 'User Preferences')}</h4>
               </div>
               
               <div className="space-y-3">
                   <button 
                       onClick={toggleTheme}
                       className="w-full flex items-center justify-between px-4 py-3 border border-neutral-800 bg-black hover:bg-neutral-900 transition-colors group"
                   >
                       <span className="text-xs font-mono text-neutral-400 uppercase group-hover:text-white">{t('common.interfaceTheme', 'Interface Theme')}</span>
                       <div className="flex items-center gap-2">
                           <Sun className={`w-3 h-3 ${theme === 'light' ? 'text-yellow-500' : 'text-neutral-600'}`} />
                           
                           <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-800'}`}>
                               <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${theme === 'light' ? 'left-0.5' : 'right-0.5'}`}></div>
                           </div>
                           
                           <Moon className={`w-3 h-3 ${theme === 'dark' ? 'text-white' : 'text-neutral-600'}`} />
                       </div>
                   </button>

                   <button 
                       onClick={onSignOut}
                       className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-900/30 bg-red-950/10 hover:bg-red-950/30 transition-colors text-red-500"
                   >
                       <LogOut className="w-3 h-3" />
                       <span className="text-xs font-bold uppercase tracking-widest">{t('common.signOut', 'Sign Out')}</span>
                   </button>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Dashboard;
