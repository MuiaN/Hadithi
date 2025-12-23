'use client';

import EditorSidebar from '@/components/Layout/EditorSidebar';

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sidebar-layout" style={{ backgroundColor: 'var(--color-background)' }}>
      <EditorSidebar />
      <main className="main-content-with-sidebar p-0">
        {children}
      </main>
    </div>
  );
}