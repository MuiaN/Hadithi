'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Crown, Search, Filter, MoreHorizontal } from 'lucide-react';
import { users } from '@/lib/mockData/users';
import useStore from '@/lib/store/useStore';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  subscription: string | null;
  avatar: string | null;
  bio: string | null;
  createdAt: string | null;
  isVerified: boolean;
}

export default function UsersPage() {
  const [userList, setUserList] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useStore();

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setUserList(users);
      setFilteredUsers(users);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = userList;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [userList, searchTerm, roleFilter]);

  const handleRoleChange = (userId: string, newRole: string) => {
    setUserList(prev => prev.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 bg-red-100';
      case 'editor':
        return 'text-blue-600 bg-blue-100';
      case 'creator':
        return 'text-green-600 bg-green-100';
      case 'user':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSubscriptionColor = (subscription: string | null) => {
    switch (subscription) {
      case 'gold':
        return 'text-yellow-600 bg-yellow-100';
      case 'silver':
        return 'text-gray-600 bg-gray-100';
      case 'bronze':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
      </div>
    );
  }

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              User Management
            </h1>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              Manage user accounts, roles, and permissions
            </p>
          </div>
          <button
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            <UserPlus size={16} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Total Users
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {userList.length}
              </p>
            </div>
            <Users size={24} style={{ color: 'var(--color-primary)' }} />
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Admins
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {userList.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <Shield size={24} style={{ color: 'var(--color-error)' }} />
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Creators
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {userList.filter(u => u.role === 'creator').length}
              </p>
            </div>
            <UserPlus size={24} style={{ color: 'var(--color-success)' }} />
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Subscribers
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {userList.filter(u => u.subscription).length}
              </p>
            </div>
            <Crown size={24} style={{ color: 'var(--color-warning)' }} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: 'var(--color-textTertiary)' }} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border"
            style={{
              backgroundColor: 'var(--color-input)',
              borderColor: 'var(--color-inputBorder)',
              color: 'var(--color-textPrimary)'
            }}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter size={16} style={{ color: 'var(--color-textSecondary)' }} />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border"
            style={{
              backgroundColor: 'var(--color-input)',
              borderColor: 'var(--color-inputBorder)',
              color: 'var(--color-textPrimary)'
            }}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="creator">Creator</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-textSecondary)' }}>
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-textSecondary)' }}>
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-textSecondary)' }}>
                  Subscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-textSecondary)' }}>
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-textSecondary)' }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-textSecondary)' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ divideColor: 'var(--color-border)' }}>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-opacity-50" style={{ backgroundColor: 'transparent' }}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>
                          {user.name}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={user.id === currentUser?.id}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${getRoleColor(user.role)}`}
                    >
                      <option value="user">User</option>
                      <option value="creator">Creator</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSubscriptionColor(user.subscription)}`}>
                      {user.subscription ? user.subscription.charAt(0).toUpperCase() + user.subscription.slice(1) : 'Free'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      {formatDate(user.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      user.isVerified ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
                    }`}>
                      {user.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: 'var(--color-textSecondary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-backgroundSecondary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto mb-4" style={{ color: 'var(--color-textTertiary)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              No users found
            </h3>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              {searchTerm || roleFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No users have been registered yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}