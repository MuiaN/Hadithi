'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import useStore from '@/lib/store/useStore';
import { getTheme, applyTheme, initializeTheme } from '@/lib/themes';
import { getTemplate, applyTemplate, initializeTemplate } from '@/lib/templates';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentTheme, setTheme, currentTemplate, setTemplate } = useStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname(); // Get the current pathname

  useEffect(() => {
    // Initialize theme and template on first load
    const savedTheme = initializeTheme();
    const savedTemplate = initializeTemplate();
    
    if (savedTheme !== currentTheme) {
      setTheme(savedTheme);
    }
    
    if (savedTemplate !== currentTemplate) {
      setTemplate(savedTemplate);
    }
    
    setMounted(true);
  }, [currentTheme, currentTemplate, setTheme, setTemplate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    // Apply theme and template when they change (only after mount)
    if (mounted && currentTheme) {
      const theme = getTheme(currentTheme);
      applyTheme(theme);
    }
    
    if (mounted && currentTemplate) {
      const template = getTemplate(currentTemplate);
      applyTemplate(template);
    }
  }, [currentTheme, currentTemplate, mounted]);

  // Check if current path is a dashboard page
  const isDashboardPage = pathname?.startsWith('/admin') || 
                         pathname?.startsWith('/editor') || 
                         pathname?.startsWith('/creator') || 
                         pathname?.startsWith('/dashboard');

  return (
    <html lang="en" className={`${currentTheme} template-${currentTemplate}`}>
      <head>
        <title>Hadithi Platform - African Stories & Cultural Heritage</title>
        <meta name="description" content="Discover and preserve African stories, knowledge, and cultural heritage through our comprehensive digital platform." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/Hadithi Logo No BG.png" />
      </head>
      <body 
        className={`${inter.className} min-h-screen theme-${currentTheme} template-${currentTemplate}`} 
        style={{
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-textPrimary)',
          transition: 'background-color 0.3s ease, color 0.3s ease'
        }}
      >
        <div className="sticky top-0 z-50 w-full">
          <Navbar />
        </div>
        <div className="relative">
          {children}
        </div>
        {/* Only show footer on public pages, not dashboards */}
        {!isDashboardPage && <Footer />}
      </body>
    </html>
  );
}