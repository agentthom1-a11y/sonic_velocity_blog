import { Activity, Server, Wifi, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from '@/components/Link';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/lib/i18n-config';

export default async function SystemStatusPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const getStatusData = () => {
    switch (dict.common.terms) {
      case "条款":
        return {
          title: "系统诊断",
          operational: "所有系统正常运行",
          lastUpdate: "最后更新",
          latency: "延迟",
          incidents: "事件日志",
          maint: "维护：数据库迁移已完成。",
          resolved: "已解决",
          minor: "雅加达地区检测到轻微延迟。",
          upgrade: "系统升级：v1.0 发布。",
          completed: "已完成"
        };
      case "規約":
        return {
          title: "システム診断",
          operational: "すべてのシステムが正常に動作しています",
          lastUpdate: "最終更新",
          latency: "レイテンシ",
          incidents: "インシデントログ",
          maint: "メンテナンス: データベース移行が完了しました。",
          resolved: "解決済み",
          minor: "ジャカルタ地域で軽微な遅延が検出されました。",
          upgrade: "システムアップグレード: v1.0ローンチ。",
          completed: "完了"
        };
      case "Conditions":
        return {
          title: "Diagnostics Système",
          operational: "Tous les Systèmes sont Opérationnels",
          lastUpdate: "Dernière Mise à Jour",
          latency: "Latence",
          incidents: "Journal des Incidents",
          maint: "Maintenance : Migration de la base de données terminée.",
          resolved: "Résolu",
          minor: "Légère latence détectée dans la région de Jakarta.",
          upgrade: "Mise à Niveau Système : Lancement de la v1.0.",
          completed: "Terminé"
        };
      case "Terms":
        return {
          title: "System Diagnostics",
          operational: "All Systems Operational",
          lastUpdate: "Last Update",
          latency: "Latency",
          incidents: "Incident Log",
          maint: "Maintenance: Database migration completed.",
          resolved: "Resolved",
          minor: "Minor latency detected in Jakarta region.",
          upgrade: "System Upgrade: v1.0 Launch.",
          completed: "Completed"
        };
      default:
        return {
          title: "Diagnostik Sistem",
          operational: "Semua Sistem Beroperasi Normal",
          lastUpdate: "Pembaruan Terakhir",
          latency: "Latensi",
          incidents: "Log Insiden",
          maint: "Pemeliharaan: Migrasi database selesai.",
          resolved: "Selesai",
          minor: "Latensi minor terdeteksi di wilayah Jakarta.",
          upgrade: "Peningkatan Sistem: Peluncuran v1.0.",
          completed: "Selesai"
        };
    }
  };

  const sData = getStatusData();

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-20 animate-[fadeIn_0.5s_ease-out]">
      <Link href="/" className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-12 text-neutral-500 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> {dict.common.returnToBase}
      </Link>

      <div className="flex items-end justify-between border-b border-neutral-800 pb-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white uppercase tracking-tighter mb-2">{sData.title}</h1>
          <p className="font-mono text-xs text-green-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {sData.operational}
          </p>
        </div>
        <div className="text-right hidden md:block">
           <p className="font-mono text-xs text-neutral-600">{sData.lastUpdate}: Mon, 01 Jun 2026 00:00:00 GMT</p>
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
             <p className="font-mono text-xs text-neutral-500">{sData.latency}: {item.latency}</p>
          </div>
        ))}
      </div>

      <div className="border border-neutral-800 bg-neutral-900/20 p-8">
         <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">{sData.incidents}</h3>
         <div className="space-y-4">
            {[
               { date: "2026-03-15", event: sData.maint, status: sData.resolved },
               { date: "2026-02-28", event: sData.minor, status: sData.resolved },
               { date: "2026-01-10", event: sData.upgrade, status: sData.completed }
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
