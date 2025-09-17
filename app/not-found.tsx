'use client';

import Link from 'next/link';
import { Home, Search, BookOpen, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-md w-full text-center px-4">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
            <span className="text-white font-bold text-6xl">404</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            Page Not Found
          </h1>
          
          <p className="text-lg mb-8" style={{ color: 'var(--color-textSecondary)' }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved. 
            Let&apos;s get you back to exploring African stories.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-colors"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            <Home size={16} />
            <span>Go Home</span>
          </Link>
          
          <Link
            href="/stories"
            className="w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-colors"
            style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textPrimary)' }}
          >
            <BookOpen size={16} />
            <span>Explore Stories</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-colors"
            style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textPrimary)' }}
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-sm mb-4" style={{ color: 'var(--color-textSecondary)' }}>
            Popular sections:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/stories" className="hover:underline" style={{ color: 'var(--color-primary)' }}>
              Stories
            </Link>
            <Link href="/podcasts" className="hover:underline" style={{ color: 'var(--color-primary)' }}>
              Podcasts
            </Link>
            <Link href="/articles" className="hover:underline" style={{ color: 'var(--color-primary)' }}>
              Articles
            </Link>
            <Link href="/authors" className="hover:underline" style={{ color: 'var(--color-primary)' }}>
              Authors
            </Link>
            <Link href="/about" className="hover:underline" style={{ color: 'var(--color-primary)' }}>
              About
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}