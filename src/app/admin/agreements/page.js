'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlineEye,
  HiOutlineEllipsisVertical,
  HiOutlineCheckCircle,
  HiOutlineXMark,
} from 'react-icons/hi2';

export default function AgreementsPage() {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/agreements');
        if (!response.ok) throw new Error('Failed to fetch agreements');
        const data = await response.json();
        setAgreements(data);
      } catch (err) {
        setError(err.message);
        // Mock data
        setAgreements([
          {
            id: 1,
            client: 'Acme Corp',
            type: 'Retainer',
            amount: '$5,000/month',
            status: 'active',
            startDate: '2024-01-15',
          },
          {
            id: 2,
            client: 'Tech Solutions',
            type: 'Project',
            amount: '$25,000',
            status: 'signed',
            startDate: '2024-02-01',
          },
          {
            id: 3,
            client: 'StartupXYZ',
            type: 'Retainer',
            amount: '$3,000/month',
            status: 'draft',
            startDate: null,
          },
          {
            id: 4,
            client: 'Digital Agency Pro',
            type: 'Project',
            amount: '$15,000',
            status: 'sent',
            startDate: null,
          },
          {
            id: 5,
            client: 'Finance Corp',
            type: 'Custom',
            amount: '$8,500',
            status: 'active',
            startDate: '2023-12-01',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgreements();
  }, []);

  const filteredAgreements = agreements.filter((agreement) => {
    const matchesSearch =
      agreement.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agreement.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const response = await fetch(`/api/admin/agreements/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update agreement');
      const updated = await response.json();
      setAgreements(agreements.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      console.error('Error updating agreement:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const StatusBadge = ({ status }) => {
    const statusColors = {
      draft: '#9ca3af',
      sent: '#f97316',
      signed: '#3b82f6',
      active: '#2d8b7a',
      completed: '#10b981',
      cancelled: '#ef4444',
    };
    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-medium text-white"
        style={{ backgroundColor: statusColors[status] || '#9ca3af' }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agreements</h1>
          <p className="text-gray-600 mt-1">Manage service agreements and contracts</p>
        </div>
        <Link
          href="/admin/agreements/new"
          className="flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium transition-colors"
          style={{ backgroundColor: '#1e3a5f' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#152d47')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1e3a5f')}
        >
          <HiOutlinePlus className="w-5 h-5" />
          Create Agreement
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search agreements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="signed">Signed</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading agreements...</p>
          </div>
        ) : filteredAgreements.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Start Date</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAgreements.map((agreement) => (
                  <tr key={agreement.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{agreement.client}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{agreement.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{agreement.amount}</td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge status={agreement.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {agreement.startDate || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {agreement.status === 'sent' && (
                          <button
                            onClick={() => updateStatus(agreement.id, 'signed')}
                            disabled={updatingId === agreement.id}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Mark as Signed"
                          >
                            <HiOutlineCheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <Link
                          href={`/admin/agreements/${agreement.id}`}
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </Link>
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                          <HiOutlineEllipsisVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">No agreements found</p>
          </div>
        )}
      </div>
    </div>
  );
}
