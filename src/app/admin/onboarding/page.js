'use client';

import { useState, useEffect } from 'react';
import {
  HiMagnifyingGlass,
  HiCheckCircle,
  HiClock,
  HiXCircle,
  HiEye,
  HiArrowPath,
} from 'react-icons/hi2';
import OnboardingStatusBadge from '@/components/OnboardingStatusBadge';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';

export default function OnboardingPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/onboarding');
        if (res.ok) {
          const result = await res.json();
          setData(result);
        } else {
          // Fallback mock data
          setData(mockData);
        }
      } catch (error) {
        console.error('Failed to fetch onboarding data:', error);
        setData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data) return;

    let filtered = data.onboarding || [];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredData(filtered);
  }, [data, searchTerm, statusFilter]);

  const stats = data ? {
    completed: data.stats.completed,
    inProgress: data.stats.inProgress,
    failed: data.stats.failed,
    avgTime: data.stats.avgTime,
  } : {
    completed: 0,
    inProgress: 0,
    failed: 0,
    avgTime: '0d',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading onboarding data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900" style={{ color: '#1e3a5f' }}>
          Client Onboarding
        </h1>
        <p className="text-gray-600 mt-2">Manage and track client onboarding workflows</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Onboarded"
          value={stats.completed}
          icon={<HiCheckCircle className="h-8 w-8" />}
          color="#10b981"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon={<HiClock className="h-8 w-8" />}
          color="#f59e0b"
        />
        <StatCard
          label="Failed"
          value={stats.failed}
          icon={<HiXCircle className="h-8 w-8" />}
          color="#ef4444"
        />
        <StatCard
          label="Avg Time to Complete"
          value={stats.avgTime}
          icon={<HiClock className="h-8 w-8" />}
          color="#2d8b7a"
        />
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4 flex-col md:flex-row">
        <div className="flex-1 relative">
          <HiMagnifyingGlass className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by client name or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ '--tw-ring-color': '#1e3a5f' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ '--tw-ring-color': '#1e3a5f' }}
        >
          <option value="all">All Status</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Failed">Failed</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Onboarding Pipeline Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Client</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Agreement</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Triggered</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Steps Progress</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.agreementId} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{item.clientName}</p>
                      <p className="text-sm text-gray-500">{item.company}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.agreement}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.triggered}</td>
                  <td className="px-6 py-4">
                    <OnboardingProgressBar
                      steps={item.steps}
                      compact={true}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <OnboardingStatusBadge status={item.status} size="md" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <a
                        href={`/admin/onboarding/${item.agreementId}`}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition"
                        style={{
                          backgroundColor: '#1e3a5f',
                          color: 'white',
                        }}
                      >
                        <HiEye className="h-4 w-4" />
                        View Details
                      </a>
                      {item.status === 'Failed' && (
                        <button
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition"
                          style={{
                            backgroundColor: '#2d8b7a',
                            color: 'white',
                          }}
                        >
                          <HiArrowPath className="h-4 w-4" />
                          Retry
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No onboarding workflows found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pipeline Steps Legend */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Steps Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <LegendItem number="1" label="Account Setup" />
          <LegendItem number="2" label="Stripe Invoice" />
          <LegendItem number="3" label="Documents" />
          <LegendItem number="4" label="Welcome Email" />
          <LegendItem number="5" label="Welcome Message" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div style={{ color }}} className="opacity-20">
          {icon}
        </div>
      </div>
    </div>
  );
}

function LegendItem({ number, label }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center justify-center h-8 w-8 rounded-full text-white font-bold text-sm"
        style={{ backgroundColor: '#1e3a5f' }}
      >
        {number}
      </div>
      <span className="text-gray-700 font-medium">{label}</span>
    </div>
  );
}

const mockData = {
  stats: {
    completed: 28,
    inProgress: 12,
    failed: 2,
    avgTime: '8.5d',
  },
  onboarding: [
    {
      agreementId: '1',
      clientName: 'John Smith',
      company: 'Tech Innovations LLC',
      agreement: 'IT Consulting Services - 12 Month',
      triggered: '2026-03-15',
      status: 'Completed',
      steps: [
        { name: 'Account Setup', status: 'completed' },
        { name: 'Stripe Invoice', status: 'completed' },
        { name: 'Documents', status: 'completed' },
        { name: 'Welcome Email', status: 'completed' },
        { name: 'Welcome Message', status: 'completed' },
      ],
    },
    {
      agreementId: '2',
      clientName: 'Sarah Johnson',
      company: 'Global Solutions Inc',
      agreement: 'Cloud Infrastructure Setup - 6 Month',
      triggered: '2026-03-18',
      status: 'In Progress',
      steps: [
        { name: 'Account Setup', status: 'completed' },
        { name: 'Stripe Invoice', status: 'completed' },
        { name: 'Documents', status: 'in-progress' },
        { name: 'Welcome Email', status: 'pending' },
        { name: 'Welcome Message', status: 'pending' },
      ],
    },
    {
      agreementId: '3',
      clientName: 'Michael Chen',
      company: 'Digital Dynamics Corp',
      agreement: 'Cybersecurity Audit - 3 Month',
      triggered: '2026-03-10',
      status: 'Failed',
      steps: [
        { name: 'Account Setup', status: 'completed' },
        { name: 'Stripe Invoice', status: 'failed' },
        { name: 'Documents', status: 'pending' },
        { name: 'Welcome Email', status: 'pending' },
        { name: 'Welcome Message', status: 'pending' },
      ],
    },
    {
      agreementId: '4',
      clientName: 'Emma Davis',
      company: 'Enterprise Systems Ltd',
      agreement: 'IT Consulting Services - 12 Month',
      triggered: '2026-03-19',
      status: 'Pending',
      steps: [
        { name: 'Account Setup', status: 'pending' },
        { name: 'Stripe Invoice', status: 'pending' },
        { name: 'Documents', status: 'pending' },
        { name: 'Welcome Email', status: 'pending' },
        { name: 'Welcome Message', status: 'pending' },
      ],
    },
    {
      agreementId: '5',
      clientName: 'Robert Wilson',
      company: 'Network Technologies',
      agreement: 'Network Optimization - 6 Month',
      triggered: '2026-03-14',
      status: 'Completed',
      steps: [
        { name: 'Account Setup', status: 'completed' },
        { name: 'Stripe Invoice', status: 'completed' },
        { name: 'Documents', status: 'completed' },
        { name: 'Welcome Email', status: 'completed' },
        { name: 'Welcome Message', status: 'completed' },
      ],
    },
  ],
};
