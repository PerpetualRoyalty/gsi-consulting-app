'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  HiOutlineBell,
  HiOutlineShieldCheck,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineCheck,
} from 'react-icons/hi2';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [settings, setSettings] = useState({
    companyName: 'Good Samaritan Institute',
    companyEmail: 'admin@goodsamaritan.com',
    companyPhone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    currency: 'USD',
  });

  const [profileSettings, setProfileSettings] = useState({
    fullName: session?.user?.name || '',
    email: session?.user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailOnNewMessage: true,
    emailOnPaymentReceived: true,
    emailOnAgreementSigned: true,
    emailOnDuePayment: true,
    emailDigest: 'daily',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.company) setSettings(data.company);
          if (data.notifications) setNotificationSettings(data.notifications);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: settings }),
      });

      if (!response.ok) throw new Error('Failed to save settings');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (profileSettings.newPassword !== profileSettings.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileSettings),
      });

      if (!response.ok) throw new Error('Failed to save profile');
      setSaveSuccess(true);
      setProfileSettings({
        ...profileSettings,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications: notificationSettings }),
      });

      if (!response.ok) throw new Error('Failed to save notification settings');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving notifications:', err);
    } finally {
      setSaving(false);
    }
  };

  const Tab = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 font-medium border-b-2 transition-colors ${
        activeTab === id
          ? 'border-blue-600 text-blue-600'
          : 'border-gray-200 text-gray-600 hover:text-gray-900'
      }`}
      style={
        activeTab === id
          ? { borderColor: '#1e3a5f', color: '#1e3a5f' }
          : {}
      }
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <HiOutlineCheck className="w-5 h-5 text-green-600" />
          <p className="text-green-800 text-sm font-medium">Settings saved successfully</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <Tab id="general" label="General Settings" />
          <Tab id="profile" label="Profile" />
          <Tab id="notifications" label="Notifications" />
          <Tab id="security" label="Security" />
        </div>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">General Settings</h2>
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Company Email
                </label>
                <input
                  type="email"
                  value={settings.companyEmail}
                  onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Company Phone
                </label>
                <input
                  type="tel"
                  value={settings.companyPhone}
                  onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#1e3a5f' }}
                onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = '#152d47')}
                onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = '#1e3a5f')}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Settings</h2>
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileSettings.fullName}
                  onChange={(e) =>
                    setProfileSettings({ ...profileSettings, fullName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileSettings.email}
                  onChange={(e) =>
                    setProfileSettings({ ...profileSettings, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={profileSettings.currentPassword}
                    onChange={(e) =>
                      setProfileSettings({
                        ...profileSettings,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={profileSettings.newPassword}
                      onChange={(e) =>
                        setProfileSettings({ ...profileSettings, newPassword: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <HiOutlineEyeSlash className="w-5 h-5" />
                      ) : (
                        <HiOutlineEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={profileSettings.confirmPassword}
                    onChange={(e) =>
                      setProfileSettings({
                        ...profileSettings,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#1e3a5f' }}
                onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = '#152d47')}
                onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = '#1e3a5f')}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <HiOutlineBell className="w-5 h-5" />
            Notification Settings
          </h2>
          <form onSubmit={handleSaveNotifications} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">New Messages</p>
                  <p className="text-sm text-gray-600">Receive email when you get a new message</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.emailOnNewMessage}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailOnNewMessage: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                  style={{ accentColor: '#1e3a5f' }}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">Payment Received</p>
                  <p className="text-sm text-gray-600">Receive email when a payment is received</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.emailOnPaymentReceived}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailOnPaymentReceived: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                  style={{ accentColor: '#1e3a5f' }}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">Agreement Signed</p>
                  <p className="text-sm text-gray-600">Receive email when an agreement is signed</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.emailOnAgreementSigned}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailOnAgreementSigned: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                  style={{ accentColor: '#1e3a5f' }}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">Payment Due</p>
                  <p className="text-sm text-gray-600">Receive email when a payment is due</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.emailOnDuePayment}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailOnDuePayment: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                  style={{ accentColor: '#1e3a5f' }}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Email Digest
              </label>
              <select
                value={notificationSettings.emailDigest}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    emailDigest: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              >
                <option value="immediate">Immediate</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="never">Never</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#1e3a5f' }}
                onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = '#152d47')}
                onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = '#1e3a5f')}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <HiOutlineShieldCheck className="w-5 h-5" />
            Security Settings
          </h2>

          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Two-Factor Authentication</h3>
              <p className="text-sm text-blue-800 mb-4">
                Add an extra layer of security to your account
              </p>
              <button
                className="px-4 py-2 rounded-lg text-white font-medium transition-colors"
                style={{ backgroundColor: '#2d8b7a' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#246d63')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2d8b7a')}
              >
                Enable 2FA
              </button>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Active Sessions</h3>
              <p className="text-sm text-gray-600 mb-4">Manage your active login sessions</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Current Session</p>
                    <p className="text-xs text-gray-500">Chrome on macOS</p>
                  </div>
                  <span className="text-xs font-medium text-green-600">Active</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-medium text-red-900 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-800 mb-4">Irreversible actions</p>
              <button className="px-4 py-2 border-2 border-red-500 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
