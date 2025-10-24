'use client';

import { useGalleriesStore } from '@/lib/store/galleriesStore';
import { useState, useEffect } from 'react';

export function usePublishedGalleries() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const getPublishedGalleries = useGalleriesStore((state) => state.getPublishedGalleries);
  const publishedGalleries = isClient ? getPublishedGalleries() : [];

  return publishedGalleries;
}