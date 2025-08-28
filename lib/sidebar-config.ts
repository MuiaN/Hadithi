import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Palette,
  BarChart3,
  MessageSquare,
  Shield,
  User,
  Heart,
  Crown,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Eye
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  roles: string[];
  badge?: string | number;
  prefetch?: boolean;
  exact?: boolean;
}

export const adminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    roles: ['admin'],
    prefetch: true,
    exact: true
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
    roles: ['admin'],
    prefetch: true
  },
  {
    title: 'Content',
    href: '/admin/content',
    icon: FileText,
    roles: ['admin'],
    prefetch: true
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    roles: ['admin'],
    prefetch: true
  },
  {
    title: 'Comments',
    href: '/admin/comments',
    icon: MessageSquare,
    roles: ['admin'],
    prefetch: true
  },
  {
    title: 'Themes',
    href: '/admin/themes',
    icon: Palette,
    roles: ['admin'],
    prefetch: true
  },
  {
    title: 'Profile',
    href: '/admin/profile',
    icon: User,
    roles: ['admin'],
    prefetch: true
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    roles: ['admin'],
    prefetch: true
  }
];

export const editorNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/editor',
    icon: LayoutDashboard,
    roles: ['editor'],
    prefetch: true,
    exact: true
  },
  {
    title: 'All Content',
    href: '/editor/content',
    icon: FileText,
    roles: ['editor'],
    prefetch: true
  },
  {
    title: 'Pending Review',
    href: '/editor/pending',
    icon: Clock,
    roles: ['editor'],
    prefetch: true
  },
  {
    title: 'Published',
    href: '/editor/published',
    icon: CheckCircle,
    roles: ['editor'],
    prefetch: true
  },
  {
    title: 'Rejected',
    href: '/editor/rejected',
    icon: XCircle,
    roles: ['editor'],
    prefetch: true
  },
  {
    title: 'Comments',
    href: '/editor/comments',
    icon: MessageSquare,
    roles: ['editor'],
    prefetch: true
  },
  {
    title: 'Analytics',
    href: '/editor/analytics',
    icon: BarChart3,
    roles: ['editor'],
    prefetch: true
  },
  {
    title: 'Profile',
    href: '/editor/profile',
    icon: User,
    roles: ['editor'],
    prefetch: true
  },
  {
    title: 'Settings',
    href: '/editor/settings',
    icon: Settings,
    roles: ['editor'],
    prefetch: true
  }
];

export const creatorNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/creator',
    icon: LayoutDashboard,
    roles: ['creator'],
    prefetch: true,
    exact: true
  },
  {
    title: 'Create Content',
    href: '/creator/new',
    icon: Plus,
    roles: ['creator'],
    prefetch: true
  },
  {
    title: 'My Content',
    href: '/creator/content',
    icon: FileText,
    roles: ['creator'],
    prefetch: true
  },
  {
    title: 'Drafts',
    href: '/creator/drafts',
    icon: Clock,
    roles: ['creator'],
    prefetch: true
  },
  {
    title: 'Published',
    href: '/creator/published',
    icon: CheckCircle,
    roles: ['creator'],
    prefetch: true
  },
  {
    title: 'Analytics',
    href: '/creator/analytics',
    icon: BarChart3,
    roles: ['creator'],
    prefetch: true
  },
  {
    title: 'Comments',
    href: '/creator/comments',
    icon: MessageSquare,
    roles: ['creator'],
    prefetch: true
  },
  {
    title: 'Profile',
    href: '/creator/profile',
    icon: User,
    roles: ['creator'],
    prefetch: true
  },
  {
    title: 'Settings',
    href: '/creator/settings',
    icon: Settings,
    roles: ['creator'],
    prefetch: true
  }
];

export const userNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['user'],
    prefetch: true,
    exact: true
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: User,
    roles: ['user'],
    prefetch: true
  },
  {
    title: 'Favorites',
    href: '/favorites',
    icon: Heart,
    roles: ['user'],
    prefetch: true
  },
  {
    title: 'Reading History',
    href: '/reading-history',
    icon: BookOpen,
    roles: ['user'],
    prefetch: true
  },
  {
    title: 'Subscription',
    href: '/subscription',
    icon: Crown,
    roles: ['user'],
    prefetch: true
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['user'],
    prefetch: true
  }
];

// Helper function to get navigation items by role
export const getNavItemsByRole = (role: string): NavItem[] => {
  switch (role) {
    case 'admin':
      return adminNavItems;
    case 'editor':
      return editorNavItems;
    case 'creator':
      return creatorNavItems;
    case 'user':
      return userNavItems;
    default:
      return userNavItems;
  }
};