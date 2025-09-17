'use client';

import { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Globe,
  Save
} from 'lucide-react';

export default function EditorSettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      emailSubmissions: true,
      emailComments: false,
      emailDeadlines: true,
      pushNotifications: false
    },
    workflow: {
      autoAssign: false,
      reviewDeadline: 7,
      requireSecondReview: false,
      notifyAuthors: true
    },
    preferences: {
      defaultView: 'list',
      itemsPerPage: 20,
      showPreview: true,
      autoSave: true
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
    { id: 'workflow', label: 'Workflow', icon: Globe },
    { id: 'preferences', label: 'Preferences', icon: Settings }
  ];

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              Editor Settings
            </h1>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              Manage your editorial preferences and workflow settings
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
                      <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Email on New Submissions</h3>
                      <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Get notified when new content is submitted for review</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailSubmissions}
                      onChange={(e) => updateSetting('notifications', 'emailSubmissions', e.target.checked)}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Email on Comments</h3>
                      <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Get notified when comments need moderation</p>
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
                      <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Review Deadlines</h3>
                      <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Get reminded about upcoming review deadlines</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailDeadlines}
                      onChange={(e) => updateSetting('notifications', 'emailDeadlines', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Workflow */}
            {activeTab === 'workflow' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                  Editorial Workflow
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                      Review Deadline (days)
                    </label>
                    <input
                      type="number"
                      value={settings.workflow.reviewDeadline}
                      onChange={(e) => updateSetting('workflow', 'reviewDeadline', parseInt(e.target.value))}
                      className="w-32 px-3 py-2 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--color-input)',
                        borderColor: 'var(--color-inputBorder)',
                        color: 'var(--color-textPrimary)'
                      }}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Auto-assign Reviews</h3>
                        <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Automatically assign new submissions to available editors</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.workflow.autoAssign}
                        onChange={(e) => updateSetting('workflow', 'autoAssign', e.target.checked)}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Require Second Review</h3>
                        <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Require a second editor to approve content before publishing</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.workflow.requireSecondReview}
                        onChange={(e) => updateSetting('workflow', 'requireSecondReview', e.target.checked)}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Notify Authors</h3>
                        <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Send email notifications to authors about review status</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.workflow.notifyAuthors}
                        onChange={(e) => updateSetting('workflow', 'notifyAuthors', e.target.checked)}
                        className="rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                  Editor Preferences
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                      Default View
                    </label>
                    <select
                      value={settings.preferences.defaultView}
                      onChange={(e) => updateSetting('preferences', 'defaultView', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--color-input)',
                        borderColor: 'var(--color-inputBorder)',
                        color: 'var(--color-textPrimary)'
                      }}
                    >
                      <option value="list">List View</option>
                      <option value="grid">Grid View</option>
                      <option value="table">Table View</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                      Items Per Page
                    </label>
                    <select
                      value={settings.preferences.itemsPerPage}
                      onChange={(e) => updateSetting('preferences', 'itemsPerPage', parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--color-input)',
                        borderColor: 'var(--color-inputBorder)',
                        color: 'var(--color-textPrimary)'
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Show Content Preview</h3>
                      <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Display content preview in the review interface</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.preferences.showPreview}
                      onChange={(e) => updateSetting('preferences', 'showPreview', e.target.checked)}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>Auto-save Reviews</h3>
                      <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Automatically save review progress</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.preferences.autoSave}
                      onChange={(e) => updateSetting('preferences', 'autoSave', e.target.checked)}
                      className="rounded"
                    />
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