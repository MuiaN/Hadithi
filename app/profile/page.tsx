'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/lib/store/useStore';

export default function ProfilePage() {
  const { user, isAuthenticated } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Redirect to appropriate dashboard profile page based on user role
    if (user?.role === 'admin') {
      router.push('/admin/profile');
    } else if (user?.role === 'editor') {
      router.push('/editor/profile');
    } else if (user?.role === 'creator') {
      router.push('/creator/profile');
    } else {
      router.push('/dashboard/profile');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
    </div>
  );
}