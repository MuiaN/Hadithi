'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/Layout/AdminSidebar';
import useStore from '@/lib/store/useStore';

export default function AdminLayout({
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

    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
      </div>
    );
  }

  return (
    <div className="sidebar-layout" style={{ backgroundColor: 'var(--color-background)' }}>
      <AdminSidebar />
      <main className="main-content-with-sidebar p-0">
        {children}
      </main>
    </div>
  );
}