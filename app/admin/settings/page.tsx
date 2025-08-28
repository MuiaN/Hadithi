'use client';

import { useState } from 'react';
import { 
  Settings, 
  Globe, 
  Shield, 
  Bell, 
  Mail, 
  Database,
  Save,
  RefreshCw
} from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Hadithi Platform',
      siteDescription: 'African Stories & Cultural Heritage',
      defaultLanguage: 'en',
      timezone: 'UTC',
      maintenanceMode: false
    },
    content: {
      autoPublish: false,
      requireApproval: true,
      allowComments: true,
      moderateComments: true,
      maxFileSize: 10
    },
    notifications: {
      emailNotifications: true,
      newUserRegistration: true,
      newContentSubmission: true,
      commentModeration: true,
      systemAlerts: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5
    }
  });

  const [activeTab, setActiveTab] = useState('general');
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
    { id: 'general', label: 'General', icon: Settings },
    { id: 'content', label: 'Content', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              Platform Settings
            </h1>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              Configure platform-wide settings and preferences
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
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
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                  General Settings
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--color-input)',
                        borderColor: 'var(--color-inputBorder)',
                        color: 'var(--color-textPrimary)'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                      Default Language
                    </label>
                    <select
                      value={settings.general.defaultLanguage}
                      onChange={(e) => updateSetting('general', 'defaultLanguage', e.target.value)}
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
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                    Site Description
                  </label>
                  <textarea
                    value={settings.general.siteDescription}
                    onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--color-input)',
                      borderColor: 'var(--color-inputBorder)',
                      color: 'var(--color-textPrimary)'
                    }}
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    checked={settings.general.maintenanceMode}
                    onChange={(e) => updateSetting('general', 'maintenanceMode', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="maintenanceMode" className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                    Enable Maintenance Mode
                  </label>
                </div>
              </div>
            )}

            {/* Content Settings */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                  Content Settings
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="autoPublish"
                      checked={settings.content.autoPublish}
                      onChange={(e) => updateSetting('content', 'autoPublish', e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="autoPublish" className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                      Auto-publish approved content
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="requireApproval"
                      checked={settings.content.requireApproval}
                      onChange={(e) => updateSetting('content', 'requireApproval', e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="requireApproval" className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                      Require editorial approval for new content
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="allowComments"
                      checked={settings.content.allowComments}
                      onChange={(e) => updateSetting('content', 'allowComments', e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="allowComments" className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                      Allow comments on content
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="moderateComments"
                      checked={settings.content.moderateComments}
                      onChange={(e) => updateSetting('content', 'moderateComments', e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="moderateComments" className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                      Moderate comments before publishing
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                    Maximum File Size (MB)
                  </label>
                  <input
                    type="number"
                    value={settings.content.maxFileSize}
                    onChange={(e) => updateSetting('content', 'maxFileSize', parseInt(e.target.value))}
                    className="w-32 px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--color-input)',
                      borderColor: 'var(--color-inputBorder)',
                      color: 'var(--color-textPrimary)'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                  Notification Settings
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="emailNotifications" className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                      Enable email notifications
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="newUserRegistration"
                      checked={settings.notifications.newUserRegistration}
                      onChange={(e) => updateSetting('notifications', 'newUserRegistration', e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="newUserRegistration" className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                      Notify on new user registrations
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="newContentSubmission"
                      checked={settings.notifications.newContentSubmission}
                      onChange={(e) => updateSetting('notifications', 'newContentSubmission', e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="newContentSubmission" className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                      Notify on new content submissions
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="commentModeration"
                      checked={settings.notifications.commentModeration}
                      onChange={(e) => updateSetting('notifications', 'commentModeration', e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="commentModeration" className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                      Notify when comments need moderation
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="systemAlerts"
                      checked={settings.notifications.systemAlerts}
                      onChange={(e) => updateSetting('notifications', 'systemAlerts', e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="systemAlerts" className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                      Receive system alerts and warnings
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                  Security Settings
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--color-input)',
                        borderColor: 'var(--color-inputBorder)',
                        color: 'var(--color-textPrimary)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      value={settings.security.loginAttempts}
                      onChange={(e) => updateSetting('security', 'loginAttempts', parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--color-input)',
                        borderColor: 'var(--color-inputBorder)',
                        color: 'var(--color-textPrimary)'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                    Password Expiry (days)
                  </label>
                  <input
                    type="number"
                    value={settings.security.passwordExpiry}
                    onChange={(e) => updateSetting('security', 'passwordExpiry', parseInt(e.target.value))}
                    className="w-32 px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--color-input)',
                      borderColor: 'var(--color-inputBorder)',
                      color: 'var(--color-textPrimary)'
                    }}
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="twoFactorAuth"
                    checked={settings.security.twoFactorAuth}
                    onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="twoFactorAuth" className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                    Require two-factor authentication for admin accounts
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}