'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };
  return (
    <button
      onClick={handleLogout}
      className="ml-4 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-neutral-700 hover:text-red-400 transition-all"
    >
      Logout
    </button>
  );
}
