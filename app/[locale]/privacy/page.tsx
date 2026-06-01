import { Lock, ArrowLeft } from 'lucide-react';
import { Link } from '@/components/Link';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/lib/i18n-config';

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const getPrivacyData = () => {
    switch (dict.common.terms) {
      case "条款":
        return {
          title: "隐私协议",
          protocol: "协议：数据加密",
          retentionTitle: "数据保留政策",
          retentionText: "所有输入（提示词、氛围向量）均以临时方式处理。除非用户持有“Studio Agency”级别帐户，否则我们保留用户生成历史的时间不会超过 30 天。音频文件在 24 小时后从缓存中清除。",
          anonTitle: "01 // 匿名性",
          anonText: "Velocity 对 IP 地址实行严格的“不记录”政策。您的创作模式不会用于广告目的分析。",
          thirdPartyTitle: "02 // 第三方处理程序",
          thirdPartyText: "付款通过加密网关（Stripe/Midtrans）进行处理。Velocity Systems 无法访问您的原始金融工具。"
        };
      case "規約":
        return {
          title: "プライバシープロトコル",
          protocol: "プロトコル: データ暗号化",
          retentionTitle: "データ保持ポリシー",
          retentionText: "すべての入力（プロンプト、ムードベクトル）は一時的に処理されます。「Studio Agency」プランのアカウントをお持ちでない限り、ユーザーの生成履歴を30日以上保存することはありません。オーディオファイルは24時間後にキャッシュから削除されます。",
          anonTitle: "01 // 匿名性",
          anonText: "VelocityはIPアドレスに関して厳格な「ログなし」ポリシーを採用しています。作成パターンが広告目的で分析されることはありません。",
          thirdPartyTitle: "02 // サードパーティプロセッサー",
          thirdPartyText: "支払いは暗号化されたゲートウェイ（Stripe/Midtrans）を介して処理されます。Velocity Systemsがお客様の未加工の金融情報にアクセスすることはありません。"
        };
      case "Conditions":
        return {
          title: "Protocoles de Confidentialité",
          protocol: "Protocole : Chiffrement des Données",
          retentionTitle: "Politique de Rétention des Données",
          retentionText: "Toutes les entrées (Prompts, Mood Vectors) sont traitées de manière éphémère. Nous ne stockons pas l'historique des générations plus de 30 jours, sauf pour les comptes de niveau « Studio Agency ». Les fichiers audio sont purgés du cache après 24 heures.",
          anonTitle: "01 // Anonymat",
          anonText: "Velocity applique une politique stricte de « non-journalisation » des adresses IP. Vos habitudes de création ne sont pas analysées à des fins publicitaires.",
          thirdPartyTitle: "02 // Prestataires Tiers",
          thirdPartyText: "Les paiements sont traités via des passerelles sécurisées (Stripe/Midtrans). Velocity Systems n'a pas accès à vos instruments financiers bruts."
        };
      case "Terms":
        return {
          title: "Privacy Protocols",
          protocol: "Protocol: Data Encryption",
          retentionTitle: "Data Retention Policy",
          retentionText: "All inputs (Prompts, Mood Vectors) are processed ephemerally. We do not store user generation history longer than 30 days unless the user holds a \"Studio Agency\" tier account. Audio files are purged from cache after 24 hours.",
          anonTitle: "01 // Anonymity",
          anonText: "Velocity operates with a strict \"No-Log\" policy regarding IP addresses. Your creation patterns are not analyzed for advertising purposes.",
          thirdPartyTitle: "02 // Third Party Processors",
          thirdPartyText: "Payments are processed via encrypted gateways (Stripe/Midtrans). Velocity Systems does not have access to your raw financial instruments."
        };
      default:
        return {
          title: "Protokol Privasi",
          protocol: "Protokol: Enkripsi Data",
          retentionTitle: "Kebijakan Retensi Data",
          retentionText: "Semua input (Prompt, Vektor Mood) diproses secara fana. Kami tidak menyimpan riwayat pembuatan pengguna lebih dari 30 hari kecuali pengguna memegang akun tingkat \"Studio Agency\". File audio dibersihkan dari cache setelah 24 jam.",
          anonTitle: "01 // Anonimitas",
          anonText: "Velocity beroperasi dengan kebijakan ketat \"Tanpa Log\" terkait alamat IP. Pola pembuatan Anda tidak dianalisis untuk tujuan periklanan.",
          thirdPartyTitle: "02 // Prosesor Pihak Ketiga",
          thirdPartyText: "Pembayaran diproses melalui gerbang terenkripsi (Stripe/Midtrans). Velocity Systems tidak memiliki akses ke instrumen keuangan mentah Anda."
        };
    }
  };

  const pData = getPrivacyData();

  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 text-neutral-300 animate-[fadeIn_0.5s_ease-out]">
      <Link href="/" className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-12 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> {dict.common.returnToBase}
      </Link>

      <div className="border-b border-neutral-800 pb-8 mb-12">
        <h1 className="text-4xl font-bold text-white uppercase tracking-tighter mb-4">{pData.title}</h1>
        <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">{pData.protocol}</p>
      </div>

      <div className="space-y-12 font-mono text-sm leading-relaxed">
        <section className="border border-neutral-800 bg-neutral-900/30 p-8">
          <div className="flex items-center gap-4 mb-6">
            <Lock className="w-6 h-6 text-green-500" />
            <h3 className="text-white font-bold uppercase tracking-wider">{pData.retentionTitle}</h3>
          </div>
          <p className="text-neutral-400">
            {pData.retentionText}
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold uppercase tracking-wider mb-4">{pData.anonTitle}</h3>
          <p className="text-neutral-400">
            {pData.anonText}
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold uppercase tracking-wider mb-4">{pData.thirdPartyTitle}</h3>
          <p className="text-neutral-400">
            {pData.thirdPartyText}
          </p>
        </section>
      </div>
    </div>
  );
}
