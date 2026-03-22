'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HiOutlineCurrencyDollar,
  HiOutlineUsers,
  HiOutlineDocument,
  HiOutlineChatBubbleLeftRight,
  HiOutlineArrowRight,
  HiOutlinePlus,
  HiOutlinePaperAirplane,
} from 'react-icons/hi2';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
        // Mock data for demo
        setStats({
          totalRevenue: '$47,500',
          activeClients: 12,
          pendingAgreements: 3,
          unreadMessages: 5,
          recentActivity: [
            { id: 1, type: 'agreement', message: 'Agreement signed with Acme Corp', timestamp: '2 hours ago' },
            { id: 2, type: 'payment', message: 'Payment received from Tech Solutions', amount: '$5,000', timestamp: '4 hours ago' },
            { id: 3, type: 'message', message: 'New message from John Smith', timestamp: '1 day ago' },
            { id: 4, type: 'client', message: 'New client added: StartupXYZ', timestamp: '2 days ago' },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getIcon = () => {
      switch (activity.type) {
        case 'agreement':
          return <HiOutlineDocument className="w-5 h-5" style={{ color: '#1e3a5f' }} />;
        case 'payment':
          return <HiOutlineCurrencyDollar className="w-5 h-5" style={{ color: '#2d8b7a' }} />;
        case 'message':
          return <HiOutlineChatBubbleLeftRight className="w-5 h-5" style={{ color: '#1e3a5f' }} />;
        case 'client':
          return <HiOutlineUsers className="w-5 h-5" style={{ color: '#2d8b7a' }} />;
        default:
          return null;
      }
    };

    return (
      <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
        <div className="mt-1">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 font-medium text-sm">{activity.message}</p>
          {activity.amount && (
            <p className="text-green-600 font-semibold text-sm mt-1">{activity.amount}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">{activity.timestamp}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to Good Samaritan Institute admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={HiOutlineCurrencyDollar}
          label="Total Revenue"
          value={stats?.totalRevenue || '$0'}
          color="#2d8b7a"
        />
        <StatCard
          icon={HiOutlineUsers}
          label="Active Clients"
          value={stats?.activeClients || 0}
          color="#1e3a5f"
        />
        <StatCard
          icon={HiOutlineDocument}
          label="Pending Agreements"
          value={stats?.pendingAgreements || 0}
          color="#1e3a5f"
        />
        <StatCard
          icon={HiOutlineChatBubbleLeftRight}
          label="Unread Messages"
          value={stats?.unreadMessages || 0}
          color="#2d8b7a"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
            <p className="text-gray-600 text-sm mt-1">Last 12 months</p>
          </div>
          <div
            className="w-full h-64 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
            style={{ backgroundColor: '#f9fafb' }}
          >
            <div className="text-center">
              <HiOutlineCurrencyDollar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Revenue chart will display here</p>
              <p className="text-gray-400 text-xs mt-1">Chart integration coming soon</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/admin/agreements/new"
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: '#1e3a5f',
                color: 'white',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#152d47')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1e3a5f')}
            >
              <span className="flex items-center gap-2">
                <HiOutlinePlus className="w-4 h-4" />
                New Agreement
              </span>
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/admin/clients"
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: '#2d8b7a',
                color: 'white',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#246d63')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2d8b7a')}
            >
              <span className="flex items-center gap-2">
                <HiOutlinePlus className="w-4 h-4" />
                Add Client
              </span>
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/admin/payments"
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-white transition-colors border-2"
              style={{
                borderColor: '#1e3a5f',
                color: '#1e3a5f',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e3a5f15')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span className="flex items-center gap-2">
                <HiOutlinePaperAirplane className="w-4 h-4" />
                Send Invoice
              </span>
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <Link href="/admin/messages" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All
          </Link>
        </div>
        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
          <div className="space-y-0">
            {stats.recentActivity.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
}
