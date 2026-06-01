import { ArrowLeft } from 'lucide-react';
import { Link } from '@/components/Link';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/lib/i18n-config';

export default async function TermsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const getTermsData = () => {
    switch (dict.common.terms) {
      case "条款":
        return {
          title: "服务条款",
          protocol: "协议：用户协议 v1.0",
          usageTitle: "01 // 使用许可",
          usageText: "通过初始化 Velocity 音频引擎，您被授予非排他性、永久性的许可，可在包括但不限于 TikTok、Instagram 和 YouTube 在内的数字平台上，将生成的音频伪影用于个人和商业目的。",
          liabilityTitle: "02 // 责任限制",
          liabilityText: "对于在无意中模仿受保护知识产权的任何生成内容，Velocity Systems 不承担任何责任。神经引擎基于随机过程运行。用户对音频资产的最终部署承担全部责任。",
          serviceTitle: "03 // 服务可用性",
          serviceText: "我们不保证 100% 的正常运行时间。系统可能会进行维护周期，期间合成 API 将无法访问。对于少于 24 小时的停机时间，不予退款。"
        };
      case "規約":
        return {
          title: "利用規約",
          protocol: "プロトコル: ユーザー同意書 v1.0",
          usageTitle: "01 // 使用ライセンス",
          usageText: "Velocityオーディオエンジンを起動することにより、TikTok、Instagram、YouTubeを含む（ただしこれらに限定されない）デジタルプラットフォーム上で、生成されたオーディオ成果物を個人および商用の両方の目的で使用するための、非独占的かつ永続的なライセンスがお客様に付与されます。",
          liabilityTitle: "02 // 免責事項",
          liabilityText: "Velocity Systemsは、保護された知的財産を意図せず模倣した生成コンテンツについて一切の責任を負いません。ニューラルエンジンは確率的プロセスに基づいて動作します。オーディオ資産の最終的な展開については、ユーザーがすべての責任を負うものとします。",
          serviceTitle: "03 // サービスの可用性",
          serviceText: "私たちは100％の稼働率を保証しません。システムはメンテナンスサイクルを実行する場合があり、その間、合成APIにアクセスできなくなります。24時間未満のダウンタイムに対する返金は行われません。"
        };
      case "Conditions":
        return {
          title: "Conditions d'Utilisation",
          protocol: "Protocole : Accord Utilisateur v1.0",
          usageTitle: "01 // Licence d'Utilisation",
          usageText: "En initialisant le moteur audio Velocity, vous bénéficiez d'une licence non exclusive et perpétuelle d'utilisation des créations audio générées à des fins personnelles et commerciales sur les plateformes numériques, y compris mais sans s'y limiter TikTok, Instagram et YouTube.",
          liabilityTitle: "02 // Limites de Responsabilité",
          liabilityText: "Velocity Systems n'est pas responsable des contenus générés qui imiteraient par inadvertance une propriété intellectuelle protégée. Le moteur neuronal fonctionne sur des processus stochastiques. Les utilisateurs conservent l'entière responsabilité du déploiement final des actifs audio.",
          serviceTitle: "03 // Disponibilité du Service",
          serviceText: "Nous ne garantissons pas une disponibilité à 100 %. Le système peut subir des cycles de maintenance pendant lesquels l'API de synthèse sera inaccessible. Aucun remboursement n'est accordé pour les interruptions de moins de 24 heures."
        };
      case "Terms":
        return {
          title: "Terms of Service",
          protocol: "Protocol: User Agreement v1.0",
          usageTitle: "01 // Usage License",
          usageText: "By initializing the Velocity Audio Engine, you are granted a non-exclusive, perpetual license to use the generated audio artifacts for both personal and commercial purposes on digital platforms including but not limited to TikTok, Instagram, and YouTube.",
          liabilityTitle: "02 // Liability Limits",
          liabilityText: "Velocity Systems is not liable for any content generated that mimics protected intellectual property inadvertently. The Neural Engine operates on stochastic processes. Users maintain full responsibility for the final deployment of audio assets.",
          serviceTitle: "03 // Service Availability",
          serviceText: "We do not guarantee 100% uptime. The system may undergo maintenance cycles during which the Synthesis API will be unreachable. Refunds are not issued for downtime less than 24 hours."
        };
      default:
        return {
          title: "Ketentuan Layanan",
          protocol: "Protokol: Perjanjian Pengguna v1.0",
          usageTitle: "01 // Lisensi Penggunaan",
          usageText: "Dengan menginisialisasi Velocity Audio Engine, Anda diberikan lisensi non-eksklusif dan abadi untuk menggunakan artefak audio yang dihasilkan baik untuk tujuan pribadi maupun komersial di platform digital termasuk namun tidak terbatas pada TikTok, Instagram, dan YouTube.",
          liabilityTitle: "02 // Batasan Tanggung Jawab",
          liabilityText: "Velocity Systems tidak bertanggung jawab atas konten yang dihasilkan yang meniru kekayaan intelektual yang dilindungi secara tidak sengaja. Mesin Saraf beroperasi pada proses stokastik. Pengguna bertanggung jawab penuh atas penyebaran akhir aset audio.",
          serviceTitle: "03 // Ketersediaan Layanan",
          serviceText: "Kami tidak menjamin waktu aktif 100%. Sistem dapat menjalani siklus pemeliharaan yang menyebabkan API Sintesis tidak dapat dihubungi. Pengembalian dana tidak diberikan untuk waktu henti kurang dari 24 jam."
        };
    }
  };

  const tData = getTermsData();

  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 text-neutral-300 animate-[fadeIn_0.5s_ease-out]">
      <Link href="/" className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-12 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> {dict.common.returnToBase}
      </Link>
      
      <div className="border-b border-neutral-800 pb-8 mb-12">
        <h1 className="text-4xl font-bold text-white uppercase tracking-tighter mb-4">{tData.title}</h1>
        <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">{tData.protocol}</p>
      </div>

      <div className="space-y-12 font-mono text-sm leading-relaxed">
        <section>
          <h3 className="text-white font-bold uppercase tracking-wider mb-4">{tData.usageTitle}</h3>
          <p className="text-neutral-400">
            {tData.usageText}
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold uppercase tracking-wider mb-4">{tData.liabilityTitle}</h3>
          <p className="text-neutral-400">
            {tData.liabilityText}
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold uppercase tracking-wider mb-4">{tData.serviceTitle}</h3>
          <p className="text-neutral-400">
            {tData.serviceText}
          </p>
        </section>
      </div>
    </div>
  );
}
