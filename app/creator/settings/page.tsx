'use client';

import { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Globe,
  Save
} from 'lucide-react';

export default function CreatorSettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      emailComments: true,
      emailLikes: false,
      emailFollows: true,
      pushNotifications: false
    },
    privacy: {
      showEmail: false,
      allowMessages: true,
      showStats: true
    },
    content: {
      defaultVisibility: 'public',
      allowComments: true,
      moderateComments: false,
      autoPublish: false
    }
  });

  const [activeTab, setActiveTab] = useState('notifications');
  const [saving, setSaving] = useState(false);

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
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'content', label: 'Content', icon: Globe }
  ];

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              Creator Settings
            </h1>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              Manage your creator preferences and privacy settings
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
            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                  Notification Preferences
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Email on Comments</h3>
                      <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Get notified when someone comments on your content</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailComments}
                      onChange={(e) => updateSetting('notifications', 'emailComments', e.target.checked)}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Email on Likes</h3>
                      <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Get notified when someone likes your content</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailLikes}
                      onChange={(e) => updateSetting('notifications', 'emailLikes', e.target.checked)}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Email on Follows</h3>
                      <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Get notified when someone follows you</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailFollows}
                      onChange={(e) => updateSetting('notifications', 'emailFollows', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Privacy */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                  Privacy Settings
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Show Email</h3>
                      <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Display your email on your public profile</p>
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
                      <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Allow Messages</h3>
                      <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Allow other users to send you direct messages</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.allowMessages}
                      onChange={(e) => updateSetting('privacy', 'allowMessages', e.target.checked)}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Show Statistics</h3>
                      <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Display view counts and engagement stats publicly</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.showStats}
                      onChange={(e) => updateSetting('privacy', 'showStats', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Content */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                  Content Settings
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                      Default Visibility
                    </label>
                    <select
                      value={settings.content.defaultVisibility}
                      onChange={(e) => updateSetting('content', 'defaultVisibility', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--color-input)',
                        borderColor: 'var(--color-inputBorder)',
                        color: 'var(--color-textPrimary)'
                      }}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="subscribers">Subscribers Only</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Allow Comments</h3>
                        <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Enable comments on your content by default</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.content.allowComments}
                        onChange={(e) => updateSetting('content', 'allowComments', e.target.checked)}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Moderate Comments</h3>
                        <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Review comments before they appear publicly</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.content.moderateComments}
                        onChange={(e) => updateSetting('content', 'moderateComments', e.target.checked)}
                        className="rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}