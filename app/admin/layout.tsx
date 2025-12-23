'use client';

import AdminSidebar from '@/components/Layout/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sidebar-layout" style={{ backgroundColor: 'var(--color-background)' }}>
      <AdminSidebar />
      <main className="main-content-with-sidebar p-0">
        {children}
      </main>
    </div>
  );
}