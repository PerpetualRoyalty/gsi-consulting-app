'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  HiEye,
  HiArrowDownTray,
  HiPencilSquare,
  HiCheckCircle,
  HiExclamationCircle,
  HiClock,
} from 'react-icons/hi2';

export default function Agreements() {
  const [agreements] = useState([
    {
      id: 1,
      name: 'Strategy Consulting Agreement',
      type: 'Consulting Services',
      amount: '$15,000',
      status: 'active',
      signedDate: '2024-01-15',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
    },
    {
      id: 2,
      name: 'Digital Transformation Project',
      type: 'Project Based',
      amount: '$25,000',
      status: 'active',
      signedDate: '2024-03-01',
      startDate: '2024-03-01',
      endDate: '2024-09-30',
    },
    {
      id: 3,
      name: 'Retainer Agreement 2024',
      type: 'Retainer Services',
      amount: '$5,000/month',
      status: 'sent',
      signedDate: null,
      startDate: '2024-04-01',
      endDate: '2024-12-31',
    },
    {
      id: 4,
      name: 'Marketing Strategy Consultation',
      type: 'One-Time Consultation',
      amount: '$8,000',
      status: 'completed',
      signedDate: '2023-11-20',
      startDate: '2023-11-20',
      endDate: '2023-12-15',
    },
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            <HiCheckCircle className="w-4 h-4" />
            Active
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            <HiExclamationCircle className="w-4 h-4" />
            Awaiting Signature
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
            <HiCheckCircle className="w-4 h-4" />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Agreements</h1>
        <p className="text-gray-600 mt-2">
          View, download, and sign your consulting agreements
        </p>
      </div>

      {/* Agreements Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Agreement Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {agreements.map((agreement) => (
              <tr key={agreement.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {agreement.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {agreement.startDate} to {agreement.endDate}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-700">{agreement.type}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900">
                    {agreement.amount}
                  </p>
                </td>
                <td className="px-6 py-4">{getStatusBadge(agreement.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/agreements/${agreement.id}`}
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded transition"
                      title="View details"
                    >
                      <HiEye className="w-5 h-5" />
                    </Link>
                    <button
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded transition"
                      title="Download PDF"
                    >
                      <HiArrowDownTray className="w-5 h-5" />
                    </button>
                    {agreement.status === 'sent' && (
                      <Link
                        href={`/dashboard/agreements/${agreement.id}`}
                        className="p-2 hover:bg-green-50 text-green-600 rounded transition"
                        title="Sign agreement"
                      >
                        <HiPencilSquare className="w-5 h-5" />
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Agreements Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {agreements.map((agreement) => (
          <div
            key={agreement.id}
            className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-600"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {agreement.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{agreement.type}</p>
              </div>
              {getStatusBadge(agreement.status)}
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">Amount:</span>{' '}
                {agreement.amount}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">Period:</span>{' '}
                {agreement.startDate} to {agreement.endDate}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
              <Link
                href={`/dashboard/agreements/${agreement.id}`}
                className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded text-center text-sm font-medium hover:bg-blue-100 transition"
              >
                View Details
              </Link>
              {agreement.status === 'sent' && (
                <Link
                  href={`/dashboard/agreements/${agreement.id}`}
                  className="flex-1 py-2 px-3 bg-green-50 text-green-600 rounded text-center text-sm font-medium hover:bg-green-100 transition"
                >
                  Sign
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Need help?</span> Contact your consulting team
          if you have questions about any agreement.
        </p>
      </div>
    </div>
  );
}
