'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import CreatorSidebar from '@/components/Layout/CreatorSidebar';

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="sidebar-layout" style={{ backgroundColor: 'var(--color-background)' }}>
      <CreatorSidebar />
      <main className="main-content-with-sidebar p-0">
        {children}
      </main>
    </div>
  );
}