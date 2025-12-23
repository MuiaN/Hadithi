'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Edit, 
  Save, 
  Camera,
  Shield,
  X
} from 'lucide-react';
import useStore from '@/lib/store/useStore';
import Image from 'next/image';

export default function EditorProfilePage() {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    avatar: ''
  });

  const { user, isAuthenticated, setUser } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: '',
        website: '',
        avatar: user.avatar || ''
      });
      setNewEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/v1/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const updatedUser = await res.json();
      setUser(updatedUser);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEmailUpdate = async () => {
    if (!user || newEmail === user.email) {
      setEditingEmail(false);
      return;
    }
    
    setSaving(true);
    try {
      // Note: Email change should ideally have a verification step.
      // This is a simplified implementation.
      const res = await fetch('/api/v1/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail }),
      });
      if (!res.ok) throw new Error('Failed to update email');
      const updatedUser = await res.json();
      setUser(updatedUser);
      setProfileData(prev => ({ ...prev, email: newEmail }));
      setEditingEmail(false);
    } catch (error) {
      console.error('Error updating email:', error);
      setNewEmail(user.email || '');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploadingAvatar(true);
    try {
      // Create a data URL for the image
      const reader = new FileReader();
      reader.onload = async (e) => {
        const avatarUrl = e.target?.result as string;
        
        // Update profile data and user
        const updatedProfileData = { ...profileData, avatar: avatarUrl };
        setProfileData(updatedProfileData);
        
        const res = await fetch('/api/v1/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatar: avatarUrl }),
        });
        if (!res.ok) throw new Error('Failed to upload avatar');
        const updatedUser = await res.json();
        setUser(updatedUser);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const removeAvatar = async () => {
    if (!user) return;
    
    setUploadingAvatar(true);
    try {
      const updatedProfileData = { ...profileData, avatar: '' };
      setProfileData(updatedProfileData);
      
      const res = await fetch('/api/v1/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: '' }),
      });
      if (!res.ok) throw new Error('Failed to remove avatar');
      const updatedUser = await res.json();
      setUser(updatedUser);
    } catch (error) {
      console.error('Error removing avatar:', error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: '',
        website: '',
        avatar: user.avatar || ''
      });
      setNewEmail(user.email || '');
    }
    setEditing(false);
    setEditingEmail(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
      </div>
    );
  }

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
            Editor Profile
          </h1>
          <p style={{ color: 'var(--color-textSecondary)' }}>
            Manage your editor account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  {profileData.avatar ? (
                    <div className="relative">
                      <Image
                        src={profileData.avatar}
                        alt={profileData.name}
                        className="w-24 h-24 rounded-full object-cover"
                        width={96}
                        height={96}
                      />
                      {editing && (
                        <button
                          onClick={removeAvatar}
                          disabled={uploadingAvatar}
                          className="absolute -top-2 -right-2 p-1 rounded-full shadow-lg"
                          style={{ backgroundColor: 'var(--color-error)', color: 'white' }}
                          title="Remove avatar"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">
                        {profileData.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute bottom-0 right-0 p-2 rounded-full shadow-lg"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                    title="Change avatar"
                  >
                    {uploadingAvatar ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Camera size={16} />
                    )}
                  </button>
                </div>

                <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--color-textPrimary)' }}>
                  {profileData.name}
                </h2>
                <p className="text-sm mb-4" style={{ color: 'var(--color-textSecondary)' }}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </p>

                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Shield size={16} style={{ color: user.isVerified ? 'var(--color-success)' : 'var(--color-warning)' }} />
                  <span className="text-sm" style={{ color: user.isVerified ? 'var(--color-success)' : 'var(--color-warning)' }}>
                    {user.isVerified ? 'Verified Account' : 'Unverified Account'}
                  </span>
                </div>

                {user.subscription && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4" 
                       style={{ 
                         backgroundColor: 'var(--color-primary)20',
                         color: 'var(--color-primary)'
                       }}>
                    {user.subscription.charAt(0).toUpperCase() + user.subscription.slice(1)} Member
                  </div>
                )}

                <div className="flex items-center justify-center text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                  <Calendar size={16} className="mr-2" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                  Personal Information
                </h3>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                  >
                    <Edit size={16} />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textPrimary)' }}
                    >
                      Cancel
                    </button>
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
                )}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border"
                        style={{
                          backgroundColor: 'var(--color-input)',
                          borderColor: 'var(--color-inputBorder)',
                          color: 'var(--color-textPrimary)'
                        }}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 py-2">
                        <User size={16} style={{ color: 'var(--color-textSecondary)' }} />
                        <span style={{ color: 'var(--color-textPrimary)' }}>{profileData.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                      Email Address
                    </label>
                    {editingEmail ? (
                      <div className="space-y-2">
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border"
                          style={{
                            backgroundColor: 'var(--color-input)',
                            borderColor: 'var(--color-inputBorder)',
                            color: 'var(--color-textPrimary)'
                          }}
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleEmailUpdate}
                            disabled={saving}
                            className="px-3 py-1 text-xs rounded-lg"
                            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                          >
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => {
                              setEditingEmail(false);
                              setNewEmail(user?.email || '');
                            }}
                            className="px-3 py-1 text-xs rounded-lg"
                            style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textPrimary)' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-2">
                            <Mail size={16} style={{ color: 'var(--color-textSecondary)' }} />
                            <span style={{ color: 'var(--color-textPrimary)' }}>{profileData.email}</span>
                          </div>
                          <button
                            onClick={() => setEditingEmail(true)}
                            className="text-xs px-2 py-1 rounded"
                            style={{ color: 'var(--color-primary)' }}
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                    Bio
                  </label>
                  {editing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full px-3 py-2 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--color-input)',
                        borderColor: 'var(--color-inputBorder)',
                        color: 'var(--color-textPrimary)'
                      }}
                    />
                  ) : (
                    <p style={{ color: 'var(--color-textPrimary)' }}>
                      {profileData.bio || 'No bio provided yet.'}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                      Location
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        placeholder="City, Country"
                        className="w-full px-3 py-2 rounded-lg border"
                        style={{
                          backgroundColor: 'var(--color-input)',
                          borderColor: 'var(--color-inputBorder)',
                          color: 'var(--color-textPrimary)'
                        }}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 py-2">
                        <MapPin size={16} style={{ color: 'var(--color-textSecondary)' }} />
                        <span style={{ color: 'var(--color-textPrimary)' }}>
                          {profileData.location || 'Not specified'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                      Website
                    </label>
                    {editing ? (
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-3 py-2 rounded-lg border"
                        style={{
                          backgroundColor: 'var(--color-input)',
                          borderColor: 'var(--color-inputBorder)',
                          color: 'var(--color-textPrimary)'
                        }}
                      />
                    ) : (
                      <div className="py-2">
                        {profileData.website ? (
                          <a
                            href={profileData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                            style={{ color: 'var(--color-primary)' }}
                          >
                            {profileData.website}
                          </a>
                        ) : (
                          <span style={{ color: 'var(--color-textPrimary)' }}>Not specified</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}