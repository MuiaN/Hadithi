'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditorSidebar from '@/components/Layout/EditorSidebar';
import useStore from '@/lib/store/useStore';

export default function EditorLayout({
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

    if (user?.role !== 'editor') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'editor') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
      </div>
    );
  }

  return (
    <div className="sidebar-layout" style={{ backgroundColor: 'var(--color-background)' }}>
      <EditorSidebar />
      <main className="main-content-with-sidebar p-0">
        {children}
      </main>
    </div>
  );
}