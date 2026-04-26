'use client';

import Dashboard from "@/components/Dashboard";
import { useAppContext } from "@/components/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { isLoggedIn } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  return <Dashboard />;
}
