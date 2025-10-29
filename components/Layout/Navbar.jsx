'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import useStore from '@/lib/store/useStore';
import { authApi } from '@/lib/api/authApi';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const { user, isAuthenticated, logout } = useStore();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      logout();
      setIsUserMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getDashboardLink = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'admin':
        return { href: '/admin', label: 'Admin Dashboard' };
      case 'editor':
        return { href: '/editor', label: 'Editor Dashboard' };
      case 'creator':
        return { href: '/creator', label: 'Creator Dashboard' };
      default:
        return { href: '/dashboard', label: 'Dashboard' };
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/stories', label: 'Stories' },
    { href: '/podcasts', label: 'Podcasts' },
    { href: '/books', label: 'Books' },
    { href: '/articles', label: 'Articles' },
    { href: '/galleries', label: 'Galleries' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }    
  ];

  const isActiveLink = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const dashboardLink = getDashboardLink();

  return (
    <nav 
      className="shadow-lg border-b transition-colors duration-300" 
      style={{ 
        backgroundColor: 'var(--color-navBackground)', 
        borderColor: 'var(--color-navBorder)' 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-2xl font-bold transition-colors duration-300"
              style={{ color: 'var(--color-primary)' }}
            >
              <Image
                src="/Hadithi Logo No BG original.png"
                alt="Hadithi Logo"
                width={32}
                height={32}
                className="h-12 w-auto"
              />
              {/* <span>Hadithi</span> */}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActiveLink(link.href)
                   ? 'active'
                    : 'hover:bg-opacity-10'
                }`}
                style={{
                 color: isActiveLink(link.href) ? '#ffffff' : 'var(--color-navText)',
                 backgroundColor: isActiveLink(link.href) ? 'var(--color-primary)' : 'transparent',
                 fontWeight: isActiveLink(link.href) ? '600' : '500'
                }}
                onMouseEnter={(e) => {
                  if (!isActiveLink(link.href)) {
                    e.target.style.color = 'var(--color-navTextHover)';
                    e.target.style.backgroundColor = 'var(--color-primary)10';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveLink(link.href)) {
                    e.target.style.color = 'var(--color-navText)';
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200"
                  style={{ color: 'var(--color-navText)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary)10';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {user?.avatar ? (
                    <Image 
                      src={user.avatar} 
                      alt={user.name} 
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium">{user?.name}</span>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-50 transition-colors duration-200"
                    style={{ 
                      backgroundColor: 'var(--color-card)', 
                      border: '1px solid var(--color-border)' 
                    }}
                  >
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm transition-colors duration-200"
                      style={{ color: 'var(--color-textPrimary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-backgroundSecondary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                    
                    {dashboardLink && (
                      <Link
                        href={dashboardLink.href}
                        className="flex items-center space-x-2 px-4 py-2 text-sm transition-colors duration-200"
                        style={{ color: 'var(--color-textPrimary)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-backgroundSecondary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        <span>{dashboardLink.label}</span>
                      </Link>
                    )}
                    
                    <Link
                      href="/subscription"
                      className="flex items-center space-x-2 px-4 py-2 text-sm transition-colors duration-200"
                      style={{ color: 'var(--color-textPrimary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-backgroundSecondary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings size={16} />
                      <span>Subscription</span>
                    </Link>

                    <Link
                      href="/dashboard/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-sm transition-colors duration-200"
                      style={{ color: 'var(--color-textPrimary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-backgroundSecondary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                    <hr className="my-1" style={{ borderColor: 'var(--color-border)' }} />
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors duration-200"
                      style={{ color: 'var(--color-error)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-error)10';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium transition-colors duration-200"
                  style={{ color: 'var(--color-navText)' }}
                  onMouseEnter={(e) => {
                    e.target.style.color = 'var(--color-navTextHover)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'var(--color-navText)';
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-700 transition-colors shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg transition-colors duration-200"
              style={{ color: 'var(--color-navText)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-navTextHover)';
                e.currentTarget.style.backgroundColor = 'var(--color-primary)10';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-navText)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div 
            className="md:hidden border-t py-4 transition-colors duration-200"
            style={{ borderColor: 'var(--color-navBorder)' }}
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActiveLink(link.href)
                     ? 'active'
                      : 'hover:bg-opacity-10'
                  }`}
                  style={{
                   color: isActiveLink(link.href) ? '#ffffff' : 'var(--color-navText)',
                   backgroundColor: isActiveLink(link.href) ? 'var(--color-primary)' : 'transparent',
                   fontWeight: isActiveLink(link.href) ? '600' : '500'
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Dashboard link for authenticated users in mobile */}
              {isAuthenticated && dashboardLink && (
                <Link
                  href={dashboardLink.href}
                  className="nav-link px-3 py-2 rounded-md text-base font-medium transition-colors"
                  style={{
                    color: 'var(--color-navText)',
                    backgroundColor: 'transparent'
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  {dashboardLink.label}
                </Link>
              )}
              
              {!isAuthenticated && (
                <div 
                  className="flex flex-col space-y-2 pt-4 border-t"
                  style={{ borderColor: 'var(--color-navBorder)' }}
                >
                  <Link
                    href={
                      user?.role === 'admin' ? '/admin/profile' :
                      user?.role === 'editor' ? '/editor/profile' :
                      user?.role === 'creator' ? '/creator/profile' :
                      '/dashboard/profile'
                    }
                    className="px-3 py-2 text-base font-medium transition-colors duration-200"
                    style={{ color: 'var(--color-navText)' }}
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="mx-3 py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-base font-medium rounded-lg text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}