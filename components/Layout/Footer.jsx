'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Explore',
      links: [
        { href: '/stories', label: 'Stories' },
        { href: '/podcasts', label: 'Podcasts' },
        { href: '/books', label: 'Books' },
        { href: '/articles', label: 'Articles' },
        { href: '/authors', label: 'Authors' }
      ]
    },
    {
      title: 'Community',
      links: [
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact' },
        { href: '/blog', label: 'Blog' },
        { href: '/events', label: 'Events' }
      ]
    },
    {
      title: 'Support',
      links: [
        { href: '/help', label: 'Help Center' },
        { href: '/subscription', label: 'Subscription' },
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' }
      ]
    }
  ];

  const socialLinks = [
    { href: '#', icon: Facebook, label: 'Facebook' },
    { href: '#', icon: Twitter, label: 'Twitter' },
    { href: '#', icon: Instagram, label: 'Instagram' },
    { href: '#', icon: Youtube, label: 'YouTube' }
  ];

  return (
    <footer 
      className="text-white transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-backgroundTertiary)' }}
    >
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-2xl font-bold mb-4 transition-colors duration-300"
              style={{ color: 'var(--color-primary)' }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span>Hadithi</span>
            </Link>
            
            <p 
              className="mb-6 text-sm leading-relaxed transition-colors duration-300"
              style={{ color: 'var(--color-textSecondary)' }}
            >
              Preserving and sharing the rich tapestry of African stories, 
              knowledge, and cultural heritage for generations to come.
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href} 
                  className="p-2 rounded-lg transition-colors duration-300"
                  style={{ color: 'var(--color-textSecondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-primary)';
                    e.currentTarget.style.backgroundColor = 'var(--color-backgroundSecondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-textSecondary)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 
                className="text-lg font-semibold mb-4 transition-colors duration-300"
                style={{ color: 'var(--color-textPrimary)' }}
              >
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-300"
                      style={{ color: 'var(--color-textSecondary)' }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'var(--color-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'var(--color-textSecondary)';
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div 
          className="border-t mt-12 pt-8 transition-colors duration-300"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail style={{ color: 'var(--color-primary)' }} size={20} />
              <span 
                className="text-sm transition-colors duration-300"
                style={{ color: 'var(--color-textSecondary)' }}
              >
                contact@hadithi.com
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone style={{ color: 'var(--color-primary)' }} size={20} />
              <span 
                className="text-sm transition-colors duration-300"
                style={{ color: 'var(--color-textSecondary)' }}
              >
                +1 (555) 123-4567
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin style={{ color: 'var(--color-primary)' }} size={20} />
              <span 
                className="text-sm transition-colors duration-300"
                style={{ color: 'var(--color-textSecondary)' }}
              >
                Nairobi, Kenya
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div 
        className="border-t transition-colors duration-300"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div 
              className="text-sm transition-colors duration-300"
              style={{ color: 'var(--color-textSecondary)' }}
            >
              © {currentYear} Hadithi Platform. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <Link 
                href="/privacy" 
                className="text-sm transition-colors duration-300"
                style={{ color: 'var(--color-textSecondary)' }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--color-textSecondary)';
                }}
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-sm transition-colors duration-300"
                style={{ color: 'var(--color-textSecondary)' }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--color-textSecondary)';
                }}
              >
                Terms of Service
              </Link>
              <Link 
                href="/cookies" 
                className="text-sm transition-colors duration-300"
                style={{ color: 'var(--color-textSecondary)' }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--color-textSecondary)';
                }}
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}