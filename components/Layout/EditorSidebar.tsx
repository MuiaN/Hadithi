'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  BarChart3,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import useStore from '@/lib/store/useStore';
import Image from 'next/image';

export default function EditorSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useStore();

  // Update CSS variable when collapsed state changes
  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', collapsed);
  }, [collapsed]);

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
      logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const sidebarItems = [
    {
      href: '/editor',
      icon: LayoutDashboard,
      label: 'Dashboard',
      exact: true
    },
    {
      href: '/editor/content',
      icon: FileText,
      label: 'All Content'
    },
    {
      href: '/editor/pending',
      icon: Clock,
      label: 'Pending Review'
    },
    {
      href: '/editor/published',
      icon: CheckCircle,
      label: 'Published'
    },
    {
      href: '/editor/rejected',
      icon: XCircle,
      label: 'Rejected'
    },
    {
      href: '/editor/comments',
      icon: MessageSquare,
      label: 'Comments'
    },
    {
      href: '/editor/analytics',
      icon: BarChart3,
      label: 'Analytics'
    },
    {
      href: '/editor/profile',
      icon: User,
      label: 'Profile'
    },
    {
      href: '/editor/settings',
      icon: Settings,
      label: 'Settings'
    }
  ];

  const isActiveLink = (href: string, isExact = false) => {
    if (isExact) {
      // Remove trailing slashes for consistent comparison
      const cleanPathname = pathname.replace(/\/$/, '');
      const cleanHref = href.replace(/\/$/, '');
      return cleanPathname === cleanHref;
    }
    // For other nested routes, we want to match if the path starts with the href, but not if it's the dashboard path itself.
    return pathname.startsWith(href) && href !== '/editor';
  };

  return (
    <div 
      className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}
      style={{ 
        backgroundColor: 'var(--color-card)',
        borderRight: '1px solid var(--color-border)',
        zIndex: 100
      }}
    >
      {/* User Info */}
      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
        {!collapsed ? (
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {user?.avatar ? (
              <Image 
                src={user.avatar} 
                alt={user.name || 'User avatar'}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.name?.charAt(0)?.toUpperCase() || 'E'}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--color-textPrimary)' }}>
                {user?.name}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--color-textSecondary)' }}>
                Editor
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            {user?.avatar ? (
              <Image 
                src={user.avatar} 
                alt={user.name || 'User avatar'}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : null}
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--color-textSecondary)' }}
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      {/* Collapse/Expand button */}
      {collapsed && (
        <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full h-10 px-3 py-2 rounded-lg transition-colors hover:shadow-sm"
            style={{ color: 'var(--color-textSecondary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-backgroundSecondary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            title="Expand Sidebar"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`nav-link flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActiveLink(item.href, item.exact)
                    ? 'active shadow-sm'
                    : 'hover:shadow-sm'
                }`}
                style={{
                  backgroundColor: isActiveLink(item.href, item.exact) 
                    ? 'var(--color-primary)' 
                    : 'transparent',
                  color: isActiveLink(item.href, item.exact) 
                    ? '#ffffff' 
                    : 'var(--color-textPrimary)'
                }}
                onMouseEnter={(e) => {
                  if (!isActiveLink(item.href, item.exact)) {
                    e.currentTarget.style.backgroundColor = 'var(--color-backgroundSecondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveLink(item.href, item.exact)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                title={collapsed ? item.label : ''}
              >
                <div className="relative">
                  <item.icon className={collapsed ? 'sidebar-icon-collapsed' : 'sidebar-icon-expanded'} />
                  {collapsed && (
                    <div className="sidebar-tooltip" style={{ zIndex: 200 }}>
                      {item.label}
                    </div>
                  )}
                </div>
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors"
          style={{ color: 'var(--color-error)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-error)10';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title={collapsed ? 'Logout' : ''}
        >
          <div className="relative">
            <LogOut className={collapsed ? 'sidebar-icon-collapsed' : 'sidebar-icon-expanded'} />
            {collapsed && (
              <div className="sidebar-tooltip" style={{ zIndex: 200 }}>
                Logout
              </div>
            )}
          </div>
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}