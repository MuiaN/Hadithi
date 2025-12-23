'use client';

import CreatorSidebar from '@/components/Layout/CreatorSidebar';

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sidebar-layout" style={{ backgroundColor: 'var(--color-background)' }}>
      <CreatorSidebar />
      <main className="main-content-with-sidebar p-0">
        {children}
      </main>
    </div>
  );
}