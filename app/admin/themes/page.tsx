'use client';

import { useState } from 'react';
import { Check, Palette, Layout, Paintbrush, Grid } from 'lucide-react';
import useStore from '@/lib/store/useStore';
import { getAllThemes } from '@/lib/themes';
import { getAllTemplates } from '@/lib/templates';

export default function ThemesPage() {
  const { currentTheme, setTheme, currentTemplate, setTemplate } = useStore();

  const themes = getAllThemes();
  const templates = getAllTemplates();

  const handleThemeChange = (themeName: string) => {
    setTheme(themeName);
  };

  const handleTemplateChange = (templateName: string) => {
    setTemplate(templateName);
  };

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
          Appearance Management
        </h1>
        <p style={{ color: 'var(--color-textSecondary)' }}>
          Customize the colors and layout of your platform
        </p>
      </div>

      {/* Current Settings Display */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center space-x-4">
            <Palette size={24} style={{ color: 'var(--color-primary)' }} />
            <div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                Current Theme: {themes.find(t => t.name === currentTheme)?.displayName}
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                Color scheme and visual styling
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center space-x-4">
            <Layout size={24} style={{ color: 'var(--color-secondary)' }} />
            <div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                Current Layout: {templates.find(t => t.name === currentTemplate)?.displayName}
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                Layout structure and African patterns
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* Color Theme Selection */}
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <Paintbrush size={24} style={{ color: 'var(--color-primary)' }} />
            <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
              Color Themes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {themes.map((theme) => (
              <div
                key={theme.name}
                onClick={() => handleThemeChange(theme.name)}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  currentTheme === theme.name ? 'shadow-lg' : ''
                }`}
                style={{
                  backgroundColor: 'var(--color-card)',
                  borderColor: currentTheme === theme.name ? 'var(--color-primary)' : 'var(--color-border)'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                    {theme.displayName}
                  </h3>
                  {currentTheme === theme.name && (
                    <Check size={20} style={{ color: 'var(--color-primary)' }} />
                  )}
                </div>

                {/* Theme Preview */}
                <div className="space-y-3 mb-4">
                  <div className="flex space-x-2">
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: theme.colors.primary }}
                    ></div>
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: theme.colors.secondary }}
                    ></div>
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: theme.colors.success }}
                    ></div>
                  </div>
                  <div 
                    className="h-8 rounded"
                    style={{ backgroundColor: theme.colors.background }}
                  ></div>
                  <div 
                    className="h-4 rounded"
                    style={{ backgroundColor: theme.colors.backgroundSecondary }}
                  ></div>
                </div>

                <p className="text-xs text-center" style={{ color: 'var(--color-textSecondary)' }}>
                  {currentTheme === theme.name ? 'Currently Active' : 'Click to Apply'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Layout Template Selection */}
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <Grid size={24} style={{ color: 'var(--color-secondary)' }} />
            <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
              Layout Templates
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.name}
                onClick={() => handleTemplateChange(template.name)}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  currentTemplate === template.name ? 'shadow-lg' : ''
                }`}
                style={{
                  backgroundColor: 'var(--color-card)',
                  borderColor: currentTemplate === template.name ? 'var(--color-secondary)' : 'var(--color-border)'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                    {template.displayName}
                  </h3>
                  {currentTemplate === template.name && (
                    <Check size={20} style={{ color: 'var(--color-secondary)' }} />
                  )}
                </div>

                {/* Template Preview */}
                <div className="space-y-3 mb-4">
                  {template.name === 'baobab' && (
                    <div className="space-y-2">
                      <div className="h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full african-pattern-overlay"></div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-6 bg-gray-200 rounded-lg shadow-md"></div>
                        <div className="h-6 bg-gray-200 rounded-lg shadow-md"></div>
                        <div className="h-6 bg-gray-200 rounded-lg shadow-md"></div>
                      </div>
                    </div>
                  )}
                  {template.name === 'savanna' && (
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-300 rounded-none"></div>
                      <div className="grid grid-cols-4 gap-1">
                        <div className="h-6 bg-gray-200 rounded-sm border-2 border-gray-300"></div>
                        <div className="h-6 bg-gray-200 rounded-sm border-2 border-gray-300"></div>
                        <div className="h-6 bg-gray-200 rounded-sm border-2 border-gray-300"></div>
                        <div className="h-6 bg-gray-200 rounded-sm border-2 border-gray-300"></div>
                      </div>
                    </div>
                  )}
                  {template.name === 'ubuntu' && (
                    <div className="space-y-2">
                      <div className="h-3 bg-gradient-to-r from-orange-300 to-red-400 rounded-full opacity-70"></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-8 bg-gray-200 rounded-2xl border-2 border-orange-200"></div>
                        <div className="h-8 bg-gray-200 rounded-2xl border-2 border-orange-200"></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-xs mb-3" style={{ color: 'var(--color-textSecondary)' }}>
                  {template.description}
                </div>

                <p className="text-xs text-center" style={{ color: 'var(--color-textSecondary)' }}>
                  {currentTemplate === template.name ? 'Currently Active' : 'Click to Apply'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            Adding New Themes
          </h3>
          <div className="space-y-2 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
            <p>To add a new color theme:</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Create a new theme file in <code className="bg-gray-200 px-1 rounded">lib/themes/</code></li>
              <li>Follow the same structure as existing themes (colors, shadows, gradients)</li>
              <li>Import and add it to the themes object in <code className="bg-gray-200 px-1 rounded">lib/themes/index.js</code></li>
              <li>The new theme will automatically appear in this selector</li>
            </ol>
          </div>
        </div>
        
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            Adding New Templates
          </h3>
          <div className="space-y-2 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
            <p>To add a new layout template:</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Create a new template file in <code className="bg-gray-200 px-1 rounded">lib/templates/</code></li>
              <li>Define layout properties and African pattern styles</li>
              <li>Import and add it to the templates object in <code className="bg-gray-200 px-1 rounded">lib/templates/index.js</code></li>
              <li>Add corresponding CSS classes in <code className="bg-gray-200 px-1 rounded">globals.css</code></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}