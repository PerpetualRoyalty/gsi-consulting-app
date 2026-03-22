'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlineEye,
  HiOutlineEllipsisVertical,
  HiOutlineTrash,
} from 'react-icons/hi2';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/clients');
        if (!response.ok) throw new Error('Failed to fetch clients');
        const data = await response.json();
        setClients(data);
      } catch (err) {
        setError(err.message);
        // Mock data
        setClients([
          {
            id: 1,
            name: 'John Smith',
            company: 'Acme Corp',
            email: 'john@acme.com',
            status: 'active',
            agreementsCount: 3,
          },
          {
            id: 2,
            name: 'Sarah Johnson',
            company: 'Tech Solutions',
            email: 'sarah@techsol.com',
            status: 'active',
            agreementsCount: 2,
          },
          {
            id: 3,
            name: 'Mike Davis',
            company: 'StartupXYZ',
            email: 'mike@startupxyz.com',
            status: 'inactive',
            agreementsCount: 1,
          },
          {
            id: 4,
            name: 'Emily Chen',
            company: 'Digital Agency Pro',
            email: 'emily@dagencypro.com',
            status: 'active',
            agreementsCount: 4,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to add client');
      const newClient = await response.json();
      setClients([...clients, newClient]);
      setShowAddModal(false);
      setFormData({ name: '', company: '', email: '' });
    } catch (err) {
      console.error('Error adding client:', err);
    }
  };

  const StatusBadge = ({ status }) => {
    const bgColor = status === 'active' ? '#2d8b7a' : '#9ca3af';
    const textColor = 'white';
    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: bgColor, color: textColor }}
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
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">Manage your consulting clients</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium transition-colors"
          style={{ backgroundColor: '#1e3a5f' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#152d47')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1e3a5f')}
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add Client
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ focusRingColor: '#1e3a5f' }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading clients...</p>
          </div>
        ) : filteredClients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Agreements</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{client.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{client.company}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{client.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge status={client.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{client.agreementsCount}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/clients/${client.id}`}
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
            <p className="text-gray-500">No clients found</p>
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Client</h2>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ focusRingColor: '#1e3a5f' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ focusRingColor: '#1e3a5f' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ focusRingColor: '#1e3a5f' }}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                  style={{ backgroundColor: '#1e3a5f' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#152d47')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1e3a5f')}
                >
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
