'use client';

import { useState } from 'react';
import {
  HiArrowDownTray,
  HiCheckCircle,
  HiClock,
  HiExclamationCircle,
  HiCreditCard,
} from 'react-icons/hi2';

export default function Payments() {
  const [payments] = useState([
    {
      id: 1,
      date: '2024-03-15',
      dueDate: '2024-03-15',
      amount: '$7,500',
      status: 'completed',
      agreement: 'Strategy Consulting Agreement',
      invoiceNo: 'INV-2024-001',
      description: 'Monthly payment - March 2024',
    },
    {
      id: 2,
      date: '2024-02-15',
      dueDate: '2024-02-15',
      amount: '$7,500',
      status: 'completed',
      agreement: 'Strategy Consulting Agreement',
      invoiceNo: 'INV-2024-002',
      description: 'Monthly payment - February 2024',
    },
    {
      id: 3,
      date: '2024-04-15',
      dueDate: '2024-04-15',
      amount: '$7,500',
      status: 'pending',
      agreement: 'Strategy Consulting Agreement',
      invoiceNo: 'INV-2024-003',
      description: 'Monthly payment - April 2024',
    },
    {
      id: 4,
      date: '2024-03-01',
      dueDate: '2024-03-01',
      amount: '$12,500',
      status: 'completed',
      agreement: 'Digital Transformation Project',
      invoiceNo: 'INV-2024-004',
      description: 'Phase 1 - Project Kickoff',
    },
    {
      id: 5,
      date: '2024-04-01',
      dueDate: '2024-04-01',
      amount: '$12,500',
      status: 'pending',
      agreement: 'Digital Transformation Project',
      invoiceNo: 'INV-2024-005',
      description: 'Phase 2 - Implementation',
    },
  ]);

  const completedPayments = payments.filter((p) => p.status === 'completed');
  const pendingPayments = payments.filter((p) => p.status === 'pending');

  const totalPaid = completedPayments.reduce(
    (sum, p) => sum + parseFloat(p.amount.replace('$', '').replace(',', '')),
    0
  );

  const totalOutstanding = pendingPayments.reduce(
    (sum, p) => sum + parseFloat(p.amount.replace('$', '').replace(',', '')),
    0
  );

  const nextDue = pendingPayments.length > 0 ? pendingPayments[0].dueDate : 'No upcoming payments';

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <HiCheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <HiClock className="w-5 h-5 text-yellow-600" />;
      case 'overdue':
        return <HiExclamationCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            {getStatusIcon(status)}
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
            {getStatusIcon(status)}
            Pending
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
            {getStatusIcon(status)}
            Overdue
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Payments</h1>
        <p className="text-gray-600 mt-2">
          Track payment history and manage upcoming invoices
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-600">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Paid</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${totalPaid.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {completedPayments.length} payments completed
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <HiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-yellow-600">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Outstanding</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${totalOutstanding.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {pendingPayments.length} pending payments
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <HiClock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-600">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Next Due</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{nextDue}</p>
              {pendingPayments.length > 0 && (
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                  Pay Now
                </button>
              )}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <HiCreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Payments Section */}
      {pendingPayments.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Pending Payments</h2>
            <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
              {pendingPayments.length}
            </span>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {payment.invoiceNo}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {payment.description}
                        </p>
                        <p className="text-sm text-gray-600">
                          {payment.agreement}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{payment.dueDate}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {payment.amount}
                    </td>
                    <td className="px-6 py-4">
                      <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                        Pay Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {pendingPayments.map((payment) => (
              <div
                key={payment.id}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {payment.invoiceNo}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {payment.description}
                    </p>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>
                <div className="space-y-2 mb-3 text-sm">
                  <p className="text-gray-700">
                    <span className="font-medium">Agreement:</span>{' '}
                    {payment.agreement}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Due:</span> {payment.dueDate}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-yellow-300">
                  <p className="text-lg font-semibold text-gray-900">
                    {payment.amount}
                  </p>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                    Pay Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
          <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
            {completedPayments.length}
          </span>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {completedPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {payment.invoiceNo}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {payment.description}
                      </p>
                      <p className="text-sm text-gray-600">
                        {payment.agreement}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{payment.date}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {payment.amount}
                  </td>
                  <td className="px-6 py-4">
                    <button className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm">
                      <HiArrowDownTray className="w-4 h-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {completedPayments.map((payment) => (
            <div
              key={payment.id}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    {payment.invoiceNo}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {payment.description}
                  </p>
                </div>
                {getStatusBadge(payment.status)}
              </div>
              <div className="space-y-2 mb-3 text-sm">
                <p className="text-gray-700">
                  <span className="font-medium">Agreement:</span>{' '}
                  {payment.agreement}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Date:</span> {payment.date}
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-green-300">
                <p className="text-lg font-semibold text-gray-900">
                  {payment.amount}
                </p>
                <button className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm">
                  <HiArrowDownTray className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Payment Methods:</span> We accept credit cards, wire transfers, and ACH payments. Click "Pay Now" to securely process your payment.
        </p>
      </div>
    </div>
  );
}
