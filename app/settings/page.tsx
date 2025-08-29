'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import useStore from '@/lib/store/useStore';
import { getAllThemes } from '@/lib/themes';

// Define template type and array
interface Template {
  name: string;
  displayName: string;
  description: string;
}

const templates: Template[] = [
  { name: 'baobab', displayName: 'Baobab', description: 'Default layout with sidebar' },
  { name: 'acacia', displayName: 'Acacia', description: 'Minimalist layout' },
  { name: 'palm', displayName: 'Palm', description: 'Wide content layout' }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      newsletter: true,
      comments: true,
      newContent: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showActivity: true,
      allowMessages: true
    },
    preferences: {
      language: 'en',
      timezone: 'UTC',
      theme: 'light',
      template: 'baobab'
    }
  });
  const [saving, setSaving] = useState(false);

  const { user, isAuthenticated, currentTheme, setTheme, currentTemplate, setTemplate } = useStore();
  const router = useRouter();

  const themes = getAllThemes();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Initialize settings with current values
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: currentTheme,
        template: currentTemplate
      }
    }));
  }, [isAuthenticated, router, currentTheme, currentTemplate]);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));

    // Apply theme/template changes immediately
    if (category === 'preferences') {
      if (key === 'theme') {
        setTheme(value);
      } else if (key === 'template') {
        setTemplate(value);
      }
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'preferences', label: 'Preferences', icon: Settings }
  ];

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                Settings
              </h1>
              <p style={{ color: 'var(--color-textSecondary)' }}>
                Manage your account settings and preferences
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id ? 'shadow-sm' : ''
                    }`}
                    style={{
                      backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                      color: activeTab === tab.id ? 'white' : 'var(--color-textPrimary)'
                    }}
                  >
                    <tab.icon size={16} />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              {/* Account Settings */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                    Account Settings
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={user.name}
                        disabled
                        className="w-full px-3 py-2 rounded-lg border opacity-50"
                        style={{
                          backgroundColor: 'var(--color-input)',
                          borderColor: 'var(--color-inputBorder)',
                          color: 'var(--color-textPrimary)'
                        }}
                      />
                      <p className="text-xs mt-1" style={{ color: 'var(--color-textSecondary)' }}>
                        Change this in your profile settings
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-3 py-2 rounded-lg border opacity-50"
                        style={{
                          backgroundColor: 'var(--color-input)',
                          borderColor: 'var(--color-inputBorder)',
                          color: 'var(--color-textPrimary)'
                        }}
                      />
                      <p className="text-xs mt-1" style={{ color: 'var(--color-textSecondary)' }}>
                        Contact support to change your email
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                    Notification Settings
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Email Notifications</h3>
                        <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Receive notifications via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.email}
                        onChange={(e) => updateSetting('notifications', 'email', e.target.checked)}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Push Notifications</h3>
                        <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Receive browser notifications</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.push}
                        onChange={(e) => updateSetting('notifications', 'push', e.target.checked)}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Newsletter</h3>
                        <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Weekly newsletter with new content</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.newsletter}
                        onChange={(e) => updateSetting('notifications', 'newsletter', e.target.checked)}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Comment Replies</h3>
                        <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>When someone replies to your comments</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.comments}
                        onChange={(e) => updateSetting('notifications', 'comments', e.target.checked)}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>New Content</h3>
                        <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Notify about new stories and articles</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.newContent}
                        onChange={(e) => updateSetting('notifications', 'newContent', e.target.checked)}
                        className="rounded"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                    Privacy Settings
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                        Profile Visibility
                      </label>
                      <select
                        value={settings.privacy.profileVisibility}
                        onChange={(e) => updateSetting('privacy', 'profileVisibility', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border"
                        style={{
                          backgroundColor: 'var(--color-input)',
                          borderColor: 'var(--color-inputBorder)',
                          color: 'var(--color-textPrimary)'
                        }}
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="friends">Friends Only</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Show Email</h3>
                          <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Display email on your public profile</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.privacy.showEmail}
                          onChange={(e) => updateSetting('privacy', 'showEmail', e.target.checked)}
                          className="rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Show Activity</h3>
                          <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Show your reading activity to others</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.privacy.showActivity}
                          onChange={(e) => updateSetting('privacy', 'showActivity', e.target.checked)}
                          className="rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Allow Messages</h3>
                          <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Allow other users to send you messages</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.privacy.allowMessages}
                          onChange={(e) => updateSetting('privacy', 'allowMessages', e.target.checked)}
                          className="rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                    Appearance
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--color-textPrimary)' }}>
                        Color Theme
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {themes.map((theme) => (
                          <button
                            key={theme.name}
                            onClick={() => updateSetting('preferences', 'theme', theme.name)}
                            className={`p-4 rounded-lg border-2 transition-colors ${
                              settings.preferences.theme === theme.name ? 'shadow-lg' : ''
                            }`}
                            style={{
                              backgroundColor: 'var(--color-backgroundSecondary)',
                              borderColor: settings.preferences.theme === theme.name ? 'var(--color-primary)' : 'var(--color-border)',
                              ...(settings.preferences.theme === theme.name && {
                                boxShadow: `0 0 0 2px var(--color-primary)20`
                              })
                            }}
                          >
                            <div className="flex space-x-2 mb-2">
                              <div 
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: theme.colors.primary }}
                              ></div>
                              <div 
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: theme.colors.secondary }}
                              ></div>
                              <div 
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: theme.colors.success }}
                              ></div>
                            </div>
                            <h4 className="font-medium text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                              {theme.displayName}
                            </h4>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--color-textPrimary)' }}>
                        Layout Template
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {templates.map((template) => (
                          <button
                            key={template.name}
                            onClick={() => updateSetting('preferences', 'template', template.name)}
                            className={`p-4 rounded-lg border-2 transition-colors ${
                              settings.preferences.template === template.name ? 'shadow-lg' : ''
                            }`}
                            style={{
                              backgroundColor: 'var(--color-backgroundSecondary)',
                              borderColor: settings.preferences.template === template.name ? 'var(--color-primary)' : 'var(--color-border)'
                            }}
                          >
                            <h4 className="font-medium text-sm mb-1" style={{ color: 'var(--color-textPrimary)' }}>
                              {template.displayName}
                            </h4>
                            <p className="text-xs" style={{ color: 'var(--color-textSecondary)' }}>
                              {template.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* General Preferences */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                    General Preferences
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                        Language
                      </label>
                      <select
                        value={settings.preferences.language}
                        onChange={(e) => updateSetting('preferences', 'language', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border"
                        style={{
                          backgroundColor: 'var(--color-input)',
                          borderColor: 'var(--color-inputBorder)',
                          color: 'var(--color-textPrimary)'
                        }}
                      >
                        <option value="en">English</option>
                        <option value="sw">Swahili</option>
                        <option value="fr">French</option>
                        <option value="ar">Arabic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                        Timezone
                      </label>
                      <select
                        value={settings.preferences.timezone}
                        onChange={(e) => updateSetting('preferences', 'timezone', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border"
                        style={{
                          backgroundColor: 'var(--color-input)',
                          borderColor: 'var(--color-inputBorder)',
                          color: 'var(--color-textPrimary)'
                        }}
                      >
                        <option value="UTC">UTC</option>
                        <option value="Africa/Cairo">Cairo</option>
                        <option value="Africa/Lagos">Lagos</option>
                        <option value="Africa/Nairobi">Nairobi</option>
                        <option value="Africa/Johannesburg">Johannesburg</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}