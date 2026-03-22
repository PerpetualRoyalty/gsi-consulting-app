'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  HiArrowRight,
  HiCheckCircle,
  HiClock,
  HiEnvelope,
  HiExclamationCircle,
  HiArrowTrendingUp,
} from 'react-icons/hi2';

export default function Dashboard() {
  // Sample data - in real app, would come from API
  const [activeAgreements] = useState([
    {
      id: 1,
      name: 'Strategy Consulting Agreement',
      status: 'active',
      amount: '$15,000',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
    },
    {
      id: 2,
      name: 'Digital Transformation Project',
      status: 'active',
      amount: '$25,000',
      startDate: '2024-03-01',
      endDate: '2024-09-30',
    },
  ]);

  const [recentPayments] = useState([
    {
      id: 1,
      date: '2024-03-15',
      amount: '$7,500',
      status: 'completed',
      agreement: 'Strategy Consulting',
    },
    {
      id: 2,
      date: '2024-02-15',
      amount: '$7,500',
      status: 'completed',
      agreement: 'Digital Transformation',
    },
    {
      id: 3,
      date: '2024-04-15',
      amount: '$7,500',
      status: 'pending',
      agreement: 'Strategy Consulting',
    },
  ]);

  const [unreadMessages] = useState(3);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-l-4 border-green-600';
      case 'completed':
        return 'bg-blue-50 text-blue-700';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full';
      case 'completed':
        return 'inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full';
      case 'pending':
        return 'inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full';
      default:
        return 'inline-block px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Client Portal</h1>
        <p className="text-blue-50">
          Manage your agreements, track payments, and communicate with your consulting team all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Agreements */}
        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-600">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Agreements</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {activeAgreements.length}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <HiCheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <Link
            href="/dashboard/agreements"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
          >
            View All <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Unread Messages */}
        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-teal-500">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm font-medium">Unread Messages</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{unreadMessages}</p>
            </div>
            <div className="p-3 bg-teal-50 rounded-lg">
              <HiEnvelope className="w-6 h-6 text-teal-600" />
            </div>
          </div>
          <Link
            href="/dashboard/messages"
            className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center gap-1"
          >
            Check Messages <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Next Payment Due */}
        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-orange-500">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm font-medium">Next Payment Due</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">April 15</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <HiClock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <Link
            href="/dashboard/payments"
            className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1"
          >
            Make Payment <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Agreements Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Active Agreements</h2>
            <Link
              href="/dashboard/agreements"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {activeAgreements.map((agreement) => (
              <div
                key={agreement.id}
                className={`p-4 rounded-lg border ${getStatusColor(agreement.status)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {agreement.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {agreement.startDate} to {agreement.endDate}
                    </p>
                  </div>
                  <span className={getStatusBadgeColor(agreement.status)}>
                    {agreement.status.charAt(0).toUpperCase() +
                      agreement.status.slice(1)}
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {agreement.amount}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Payments</h2>
            <Link
              href="/dashboard/payments"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
              >
                <div>
                  <p className="font-medium text-gray-900">{payment.agreement}</p>
                  <p className="text-sm text-gray-600">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{payment.amount}</p>
                  <span
                    className={`text-sm font-medium ${
                      payment.status === 'completed'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {payment.status === 'completed' ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/agreements"
            className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:shadow-md transition text-center"
          >
            <HiCheckCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">View Agreements</h3>
            <p className="text-sm text-gray-600 mt-1">Review and sign agreements</p>
          </Link>

          <Link
            href="/dashboard/payments"
            className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 rounded-lg hover:shadow-md transition text-center"
          >
            <HiArrowTrendingUp className="w-6 h-6 text-teal-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Make Payment</h3>
            <p className="text-sm text-gray-600 mt-1">Pay invoices securely</p>
          </Link>

          <Link
            href="/dashboard/messages"
            className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg hover:shadow-md transition text-center"
          >
            <HiEnvelope className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Send Message</h3>
            <p className="text-sm text-gray-600 mt-1">Contact your team</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
