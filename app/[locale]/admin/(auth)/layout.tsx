import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Link } from '@/components/Link';
import { Locale } from '@/lib/i18n-config';
import { verifyAdminToken } from '@/app/api/admin/auth/route';
import LogoutButton from '@/app/admin/LogoutButton';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { default: 'Admin — Sonic Velocity', template: '%s | Admin SV' },
};

export default async function AdminAuthLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const jar = await cookies();
  const token = jar.get('sv_admin')?.value;
  const admin = token ? verifyAdminToken(token) : null;

  if (!admin) redirect(`/${locale}/admin/login`);

  return (
    <div className="min-h-screen bg-black text-neutral-300 font-mono">
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-neutral-950 border-b border-neutral-900 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <a href="/admin" className="text-[10px] font-black text-white uppercase tracking-[0.4em] hover:text-cyan-400 transition-colors">
            SV<span className="text-cyan-500">_</span>ADMIN
          </a>
          <span className="text-[9px] text-neutral-700 uppercase tracking-widest hidden md:block">CMS v1.0</span>
        </div>
        <nav className="flex items-center gap-1">
          {[
            { href: '/admin',                       label: 'Dashboard' },
            { href: '/admin/transmissions',         label: 'Posts' },
            { href: '/admin/categories',            label: 'Categories' },
            { href: '/admin/tags',                  label: 'Tags' },
            { href: '/admin/media',                 label: 'Media' },
            { href: '/admin/import',                label: 'Import' },
            { href: '/admin/settings/api-keys',     label: 'API Keys' },
          ].map(link => (
            <Link key={link.href} href={link.href} className="px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-neutral-500 hover:text-white hover:bg-neutral-900 transition-all rounded-sm">
              {link.label}
            </Link>
          ))}
          <LogoutButton />
        </nav>
      </header>
      <main className="pt-14 min-h-screen">{children}</main>
    </div>
  );
}
