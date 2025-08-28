'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TemplatePreviewProps {
  template: {
    name: string;
    displayName: string;
    description: string;
    layout: {
      headerStyle: string;
      navigationStyle: string;
      contentLayout: string;
      cardStyle: string;
      spacing: string;
      typography: string;
    };
  };
  isActive: boolean;
  onClick: () => void;
}

export function TemplatePreview({ template, isActive, onClick }: TemplatePreviewProps) {
  const getPreviewElements = () => {
    switch (template.name) {
      case 'baobab':
        return (
          <div className="space-y-2">
            <div className="h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-8 bg-gray-200 rounded-lg shadow-md"></div>
              <div className="h-8 bg-gray-200 rounded-lg shadow-md"></div>
              <div className="h-8 bg-gray-200 rounded-lg shadow-md"></div>
            </div>
            <div className="h-2 bg-gray-100 rounded"></div>
            <div className="h-2 bg-gray-100 rounded w-3/4"></div>
          </div>
        );
      case 'savanna':
        return (
          <div className="space-y-2">
            <div className="h-2 bg-gray-300 rounded-none"></div>
            <div className="grid grid-cols-4 gap-1">
              <div className="h-6 bg-gray-200 rounded-sm border"></div>
              <div className="h-6 bg-gray-200 rounded-sm border"></div>
              <div className="h-6 bg-gray-200 rounded-sm border"></div>
              <div className="h-6 bg-gray-200 rounded-sm border"></div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full"></div>
            <div className="h-2 bg-gray-100 rounded-full w-2/3"></div>
          </div>
        );
      case 'ubuntu':
        return (
          <div className="space-y-2">
            <div className="h-3 bg-gradient-to-r from-orange-300 to-red-400 rounded-full opacity-50"></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-10 bg-gray-200 rounded-2xl border-2 border-orange-200"></div>
              <div className="h-10 bg-gray-200 rounded-2xl border-2 border-orange-200"></div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full"></div>
            <div className="h-2 bg-gray-100 rounded-full w-4/5"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isActive ? 'ring-2 ring-amber-500 shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{template.displayName}</CardTitle>
        <CardDescription className="text-sm">{template.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-lg mb-3">
          {getPreviewElements()}
        </div>
        <div className="text-xs text-gray-500 space-y-1">
          <div><strong>Layout:</strong> {template.layout.contentLayout}</div>
          <div><strong>Cards:</strong> {template.layout.cardStyle}</div>
          <div><strong>Spacing:</strong> {template.layout.spacing}</div>
        </div>
      </CardContent>
    </Card>
  );
}