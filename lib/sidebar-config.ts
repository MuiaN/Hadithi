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
  icon: React.ComponentType<{ className?: string; size?: string | number }>;
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
    roles: ['ADMIN'],
    prefetch: true,
    exact: true
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
    roles: ['ADMIN'],
    prefetch: true
  },
  {
    title: 'Content',
    href: '/admin/content',
    icon: FileText,
    roles: ['ADMIN'],
    prefetch: true
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    roles: ['ADMIN'],
    prefetch: true
  },
  {
    title: 'Comments',
    href: '/admin/comments',
    icon: MessageSquare,
    roles: ['ADMIN'],
    prefetch: true
  },
  {
    title: 'Themes',
    href: '/admin/themes',
    icon: Palette,
    roles: ['ADMIN'],
    prefetch: true
  },
  {
    title: 'Profile',
    href: '/admin/profile',
    icon: User,
    roles: ['ADMIN'],
    prefetch: true
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    roles: ['ADMIN'],
    prefetch: true
  }
];

export const editorNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/editor',
    icon: LayoutDashboard,
    roles: ['EDITOR'],
    prefetch: true,
    exact: true
  },
  {
    title: 'All Content',
    href: '/editor/content',
    icon: FileText,
    roles: ['EDITOR'],
    prefetch: true
  },
  {
    title: 'Pending Review',
    href: '/editor/pending',
    icon: Clock,
    roles: ['EDITOR'],
    prefetch: true
  },
  {
    title: 'Published',
    href: '/editor/published',
    icon: CheckCircle,
    roles: ['EDITOR'],
    prefetch: true
  },
  {
    title: 'Rejected',
    href: '/editor/rejected',
    icon: XCircle,
    roles: ['EDITOR'],
    prefetch: true
  },
  {
    title: 'Comments',
    href: '/editor/comments',
    icon: MessageSquare,
    roles: ['EDITOR'],
    prefetch: true
  },
  {
    title: 'Analytics',
    href: '/editor/analytics',
    icon: BarChart3,
    roles: ['EDITOR'],
    prefetch: true
  },
  {
    title: 'Profile',
    href: '/editor/profile',
    icon: User,
    roles: ['EDITOR'],
    prefetch: true
  },
  {
    title: 'Settings',
    href: '/editor/settings',
    icon: Settings,
    roles: ['EDITOR'],
    prefetch: true
  }
];

export const creatorNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/creator',
    icon: LayoutDashboard,
    roles: ['CREATOR'],
    prefetch: true,
    exact: true
  },
  {
    title: 'Create Content',
    href: '/creator/new',
    icon: Plus,
    roles: ['CREATOR'],
    prefetch: true
  },
  {
    title: 'My Content',
    href: '/creator/content',
    icon: FileText,
    roles: ['CREATOR'],
    prefetch: true
  },
  {
    title: 'Drafts',
    href: '/creator/drafts',
    icon: Clock,
    roles: ['CREATOR'],
    prefetch: true
  },
  {
    title: 'Published',
    href: '/creator/published',
    icon: CheckCircle,
    roles: ['CREATOR'],
    prefetch: true
  },
  {
    title: 'Analytics',
    href: '/creator/analytics',
    icon: BarChart3,
    roles: ['CREATOR'],
    prefetch: true
  },
  {
    title: 'Comments',
    href: '/creator/comments',
    icon: MessageSquare,
    roles: ['CREATOR'],
    prefetch: true
  },
  {
    title: 'Profile',
    href: '/creator/profile',
    icon: User,
    roles: ['CREATOR'],
    prefetch: true
  },
  {
    title: 'Settings',
    href: '/creator/settings',
    icon: Settings,
    roles: ['CREATOR'],
    prefetch: true
  }
];

export const userNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['USER'],
    prefetch: true,
    exact: true
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: User,
    roles: ['USER'],
    prefetch: true
  },
  {
    title: 'Favorites',
    href: '/favorites',
    icon: Heart,
    roles: ['USER'],
    prefetch: true
  },
  {
    title: 'Reading History',
    href: '/reading-history',
    icon: BookOpen,
    roles: ['USER'],
    prefetch: true
  },
  {
    title: 'Subscription',
    href: '/subscription',
    icon: Crown,
    roles: ['USER'],
    prefetch: true
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['USER'],
    prefetch: true
  }
];

// Helper function to get navigation items by role
export const getNavItemsByRole = (role: string): NavItem[] => {
  switch (role) {
    case 'ADMIN':
      return adminNavItems;
    case 'EDITOR':
      return editorNavItems;
    case 'CREATOR':
      return creatorNavItems;
    case 'USER':
      return userNavItems;
    default:
      return userNavItems;
  }
};