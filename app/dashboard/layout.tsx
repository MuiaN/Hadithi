'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserSidebar from '@/components/Layout/UserSidebar';
import useStore from '@/lib/store/useStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Redirect admin/editor users to their respective dashboards
    if (user?.role === 'admin') {
      router.push('/admin');
      return;
    }

    // Redirect editor users to their dashboard
    if (user?.role === 'editor') {
      router.push('/editor');
      return;
    }

    // Redirect creators to their dashboard
    if (user?.role === 'creator') {
      router.push('/creator');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role === 'admin' || user?.role === 'editor' || user?.role === 'creator') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
      </div>
    );
  }

  return (
    <div className="sidebar-layout" style={{ backgroundColor: 'var(--color-background)' }}>
      <UserSidebar />
      <main className="main-content-with-sidebar p-0">
        {children}
      </main>
    </div>
  );
}