'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlineEye,
  HiOutlineEllipsisVertical,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [summary, setSummary] = useState({
    totalReceived: '$0',
    totalPending: '$0',
    totalOverdue: '$0',
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/payments');
        if (!response.ok) throw new Error('Failed to fetch payments');
        const data = await response.json();
        setPayments(data);
      } catch (err) {
        setError(err.message);
        // Mock data
        setPayments([
          {
            id: 1,
            client: 'Acme Corp',
            amount: '$5,000',
            status: 'paid',
            type: 'Retainer',
            date: '2024-03-15',
            dueDate: '2024-03-15',
          },
          {
            id: 2,
            client: 'Tech Solutions',
            amount: '$25,000',
            status: 'paid',
            type: 'Project',
            date: '2024-02-28',
            dueDate: '2024-02-28',
          },
          {
            id: 3,
            client: 'StartupXYZ',
            amount: '$3,000',
            status: 'pending',
            type: 'Retainer',
            date: '2024-03-10',
            dueDate: '2024-04-09',
          },
          {
            id: 4,
            client: 'Digital Agency Pro',
            amount: '$15,000',
            status: 'pending',
            type: 'Project',
            date: '2024-02-01',
            dueDate: '2024-03-02',
          },
          {
            id: 5,
            client: 'Finance Corp',
            amount: '$8,500',
            status: 'overdue',
            type: 'Custom',
            date: '2024-01-15',
            dueDate: '2024-02-14',
          },
          {
            id: 6,
            client: 'Tech Innovations',
            amount: '$12,000',
            status: 'paid',
            type: 'Project',
            date: '2024-03-05',
            dueDate: '2024-03-05',
          },
        ]);
        setSummary({
          totalReceived: '$47,500',
          totalPending: '$18,000',
          totalOverdue: '$8,500',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const StatusBadge = ({ status }) => {
    const statusStyles = {
      paid: { bg: '#10b981', text: 'white' },
      pending: { bg: '#f59e0b', text: 'white' },
      overdue: { bg: '#ef4444', text: 'white' },
      failed: { bg: '#8b5cf6', text: 'white' },
    };
    const style = statusStyles[status] || { bg: '#9ca3af', text: 'white' };
    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const SummaryCard = ({ label, value, color }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <p className="text-gray-600 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold mt-2" style={{ color }}>
        {value}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">Track invoices and payment status</p>
        </div>
        <Link
          href="/admin/payments/new"
          className="flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium transition-colors"
          style={{ backgroundColor: '#1e3a5f' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#152d47')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1e3a5f')}
        >
          <HiOutlinePlus className="w-5 h-5" />
          Create Invoice
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard label="Total Received" value={summary.totalReceived} color="#10b981" />
        <SummaryCard label="Pending" value={summary.totalPending} color="#f59e0b" />
        <SummaryCard label="Overdue" value={summary.totalOverdue} color="#ef4444" />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search payments..."
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
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payments...</p>
          </div>
        ) : filteredPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Due Date</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      payment.status === 'overdue' ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {payment.client}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.type}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {payment.amount}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.dueDate}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {payment.status === 'overdue' && (
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Send reminder">
                            <HiOutlineExclamationTriangle className="w-5 h-5" />
                          </button>
                        )}
                        {payment.status === 'pending' && (
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Mark as paid">
                            <HiOutlineCheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <Link
                          href={`/admin/payments/${payment.id}`}
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
            <p className="text-gray-500">No payments found</p>
          </div>
        )}
      </div>
    </div>
  );
}
