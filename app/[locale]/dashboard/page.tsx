import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/lib/i18n-config';
import DashboardClient from './DashboardClient';

export default async function DashboardPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return <DashboardClient dict={dict} />;
}
