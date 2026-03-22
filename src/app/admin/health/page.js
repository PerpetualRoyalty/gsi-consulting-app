'use client';

import React, { useState, useEffect } from 'react';
import {
  HiEllipsisVertical,
  HiArrowTrendingUp,
  HiArrowTrendingDown,
  HiMinus,
  HiBell,
  HiXMark,
  HiChevronDown,
  HiChevronUp,
  HiPaperAirplane,
} from 'react-icons/hi2';
import HealthBadge from '@/components/HealthBadge';

const BRAND_PRIMARY = '#1e3a5f';
const BRAND_ACCENT = '#2d8b7a';

// Mock data - replace with real API calls
const mockHealthData = [
  {
    clientId: '1',
    clientName: 'Acme Corporation',
    company: 'Acme Corp',
    score: 92,
    grade: 'GREEN',
    trend: 'improving',
    signals: {
      payments: { score: 95, weight: 0.3 },
      communication: { score: 90, weight: 0.25 },
      documents: { score: 88, weight: 0.15 },
      agreements: { score: 92, weight: 0.2 },
      tenure: { score: 85, weight: 0.1 },
    },
    alerts: [],
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    clientId: '2',
    clientName: 'TechStart Inc',
    company: 'TechStart',
    score: 58,
    grade: 'YELLOW',
    trend: 'stable',
    signals: {
      payments: { score: 65, weight: 0.3 },
      communication: { score: 50, weight: 0.25 },
      documents: { score: 55, weight: 0.15 },
      agreements: { score: 60, weight: 0.2 },
      tenure: { score: 70, weight: 0.1 },
    },
    alerts: [
      { severity: 'YELLOW', message: 'Infrequent communication' },
      { severity: 'YELLOW', message: 'Inconsistent payment history' },
    ],
    lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    clientId: '3',
    clientName: 'Global Industries',
    company: 'Global Industries',
    score: 35,
    grade: 'RED',
    trend: 'declining',
    signals: {
      payments: { score: 25, weight: 0.3 },
      communication: { score: 30, weight: 0.25 },
      documents: { score: 40, weight: 0.15 },
      agreements: { score: 45, weight: 0.2 },
      tenure: { score: 60, weight: 0.1 },
    },
    alerts: [
      { severity: 'RED', message: 'Multiple overdue or late payments' },
      { severity: 'RED', message: 'No communication in 30+ days' },
      { severity: 'YELLOW', message: 'No active agreements' },
    ],
    lastActivity: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
  },
  {
    clientId: '4',
    clientName: 'Future Ventures',
    company: 'Future Ventures',
    score: 78,
    grade: 'GREEN',
    trend: 'improving',
    signals: {
      payments: { score: 80, weight: 0.3 },
      communication: { score: 75, weight: 0.25 },
      documents: { score: 78, weight: 0.15 },
      agreements: { score: 80, weight: 0.2 },
      tenure: { score: 75, weight: 0.1 },
    },
    alerts: [],
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

export default function ClientHealthDashboard() {
  const [healthData, setHealthData] = useState(mockHealthData);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('score'); // 'score', 'name', 'activity'
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedClientId, setExpandedClientId] = useState(null);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  // In production, replace with real API call
  useEffect(() => {
    // const fetchHealthData = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await fetch('/api/health');
    //     const data = await response.json();
    //     setHealthData(data.clients || []);
    //   } catch (error) {
    //     console.error('Failed to fetch health data:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchHealthData();
  }, []);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedData = [...healthData].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === 'score') {
      aVal = a.score;
      bVal = b.score;
    } else if (sortBy === 'activity') {
      aVal = a.lastActivity.getTime();
      bVal = b.lastActivity.getTime();
    }

    return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
  });

  const summary = {
    green: healthData.filter((h) => h.grade === 'GREEN').length,
    yellow: healthData.filter((h) => h.grade === 'YELLOW').length,
    red: healthData.filter((h) => h.grade === 'RED').length,
  };

  const allAlerts = [];
  healthData.forEach((client) => {
    if (client.alerts && client.alerts.length > 0) {
      client.alerts.forEach((alert) => {
        const alertKey = `${client.clientId}-${alert.message}`;
        if (!dismissedAlerts.has(alertKey)) {
          allAlerts.push({
            clientId: client.clientId,
            clientName: client.clientName,
            ...alert,
            key: alertKey,
          });
        }
      });
    }
  });

  const criticalAlerts = allAlerts.filter((a) => a.severity === 'RED');
  const warningAlerts = allAlerts.filter((a) => a.severity === 'YELLOW');

  const handleDismissAlert = (alertKey) => {
    setDismissedAlerts((prev) => new Set([...prev, alertKey]));
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const TrendIcon = ({ trend }) => {
    if (trend === 'improving')
      return <HiArrowTrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'declining')
      return <HiArrowTrendingDown className="w-4 h-4 text-red-600" />;
    return <HiMinus className="w-4 h-4 text-gray-400" />;
  };

  const getSignalColor = (score) => {
    if (score >= 70) return '#22c55e';
    if (score >= 40) return '#eab308';
    return '#ef4444';
  };

  const SignalBar = ({ score, label }) => (
    <div className="flex items-center gap-2">
      <div className="text-xs font-medium text-gray-600 w-20">{label}</div>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${score}%`, backgroundColor: getSignalColor(score) }}
        />
      </div>
      <div className="text-xs font-semibold text-gray-700 w-8 text-right">
        {Math.round(score)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Client Health Dashboard
        </h1>
        <p className="text-gray-600">
          Monitor client engagement, payment patterns, and relationship health
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className="p-6 rounded-lg border-l-4 shadow-sm"
          style={{ borderLeftColor: '#22c55e', backgroundColor: '#f0fdf4' }}
        >
          <p className="text-sm font-medium text-gray-600 mb-1">Healthy</p>
          <p className="text-3xl font-bold text-green-700">{summary.green}</p>
          <p className="text-xs text-gray-500 mt-1">Clients (score ≥ 70)</p>
        </div>

        <div
          className="p-6 rounded-lg border-l-4 shadow-sm"
          style={{ borderLeftColor: '#eab308', backgroundColor: '#fefce8' }}
        >
          <p className="text-sm font-medium text-gray-600 mb-1">At Risk</p>
          <p className="text-3xl font-bold text-yellow-700">{summary.yellow}</p>
          <p className="text-xs text-gray-500 mt-1">Clients (40 - 69)</p>
        </div>

        <div
          className="p-6 rounded-lg border-l-4 shadow-sm"
          style={{ borderLeftColor: '#ef4444', backgroundColor: '#fef2f2' }}
        >
          <p className="text-sm font-medium text-gray-600 mb-1">Critical</p>
          <p className="text-3xl font-bold text-red-700">{summary.red}</p>
          <p className="text-xs text-gray-500 mt-1">Clients (score &lt; 40)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            {/* Table Header */}
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <HiBell className="w-5 h-5" style={{ color: BRAND_PRIMARY }} />
                Client Health Scores
              </h2>
            </div>

            {/* Table */}
            {sortedData.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500">No client data available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('clientName')}>
                        Client
                      </th>
                      <th
                        className="px-6 py-3 text-center text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('score')}
                      >
                        Score
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                        Trend
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                        Signals
                      </th>
                      <th
                        className="px-6 py-3 text-right text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('activity')}
                      >
                        Last Activity
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((client) => (
                      <React.Fragment key={client.clientId}>
                        <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                setExpandedClientId(
                                  expandedClientId === client.clientId
                                    ? null
                                    : client.clientId
                                )
                              }
                              className="flex items-center gap-2 hover:text-gray-700"
                            >
                              {expandedClientId === client.clientId ? (
                                <HiChevronUp className="w-4 h-4" />
                              ) : (
                                <HiChevronDown className="w-4 h-4" />
                              )}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {client.clientName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {client.company}
                                </p>
                              </div>
                            </button>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <HealthBadge
                              score={client.score}
                              size="sm"
                              showLabel={false}
                            />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold"
                              style={{
                                backgroundColor:
                                  client.grade === 'GREEN'
                                    ? '#dcfce7'
                                    : client.grade === 'YELLOW'
                                      ? '#fef08a'
                                      : '#fee2e2',
                                color:
                                  client.grade === 'GREEN'
                                    ? '#166534'
                                    : client.grade === 'YELLOW'
                                      ? '#713f12'
                                      : '#991b1b',
                              }}
                            >
                              {client.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <TrendIcon trend={client.trend} />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex gap-1 justify-center">
                              {[
                                {
                                  label: 'P',
                                  score: client.signals.payments.score,
                                },
                                {
                                  label: 'C',
                                  score: client.signals.communication.score,
                                },
                                {
                                  label: 'D',
                                  score: client.signals.documents.score,
                                },
                                {
                                  label: 'A',
                                  score: client.signals.agreements.score,
                                },
                              ].map((signal) => (
                                <div
                                  key={signal.label}
                                  className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white"
                                  style={{
                                    backgroundColor: getSignalColor(
                                      signal.score
                                    ),
                                  }}
                                  title={`${signal.label}: ${signal.score}`}
                                >
                                  {signal.label}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600">
                            {formatDate(client.lastActivity)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {['YELLOW', 'RED'].includes(client.grade) && (
                              <button
                                className="inline-flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition"
                                style={{
                                  backgroundColor: BRAND_ACCENT + '20',
                                  color: BRAND_ACCENT,
                                }}
                                title="Send outreach message"
                              >
                                <HiPaperAirplane className="w-3 h-3" />
                              </button>
                            )}
                          </td>
                        </tr>

                        {/* Expanded Row - Detailed Breakdown */}
                        {expandedClientId === client.clientId && (
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <td colSpan="7" className="px-6 py-6">
                              <div className="space-y-6">
                                {/* Signal Breakdown */}
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900 mb-4">
                                    Signal Breakdown
                                  </h4>
                                  <div className="space-y-2">
                                    <SignalBar
                                      score={client.signals.payments.score}
                                      label="Payments"
                                    />
                                    <SignalBar
                                      score={
                                        client.signals.communication.score
                                      }
                                      label="Communication"
                                    />
                                    <SignalBar
                                      score={client.signals.documents.score}
                                      label="Documents"
                                    />
                                    <SignalBar
                                      score={client.signals.agreements.score}
                                      label="Agreements"
                                    />
                                  </div>
                                </div>

                                {/* Alerts */}
                                {client.alerts.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                      Active Alerts
                                    </h4>
                                    <div className="space-y-2">
                                      {client.alerts.map((alert, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-center gap-3 p-3 rounded"
                                          style={{
                                            backgroundColor:
                                              alert.severity === 'RED'
                                                ? '#fee2e2'
                                                : '#fef08a',
                                          }}
                                        >
                                          <div
                                            className="w-3 h-3 rounded-full"
                                            style={{
                                              backgroundColor:
                                                alert.severity === 'RED'
                                                  ? '#ef4444'
                                                  : '#eab308',
                                            }}
                                          />
                                          <p
                                            className="text-sm font-medium"
                                            style={{
                                              color:
                                                alert.severity === 'RED'
                                                  ? '#991b1b'
                                                  : '#713f12',
                                            }}
                                          >
                                            {alert.message}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Suggested Actions */}
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                    Suggested Actions
                                  </h4>
                                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                                    {client.signals.payments.score < 70 && (
                                      <li>Review and follow up on payment history</li>
                                    )}
                                    {client.signals.communication.score < 70 && (
                                      <li>Initiate contact to re-engage client</li>
                                    )}
                                    {client.signals.documents.score < 70 && (
                                      <li>Share relevant documents or resources</li>
                                    )}
                                    {client.signals.agreements.score < 70 && (
                                      <li>Review pending agreements and follow up</li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow sticky top-8">
            {/* Panel Header */}
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <HiBell className="w-5 h-5" style={{ color: BRAND_PRIMARY }} />
                Active Alerts
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {allAlerts.length} alert{allAlerts.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Panel Content */}
            <div className="divide-y divide-gray-200">
              {allAlerts.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500 text-sm">All clients healthy</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {[...criticalAlerts, ...warningAlerts].map((alert) => (
                    <div
                      key={alert.key}
                      className="p-4 hover:bg-gray-50 transition"
                      style={{
                        backgroundColor:
                          alert.severity === 'RED'
                            ? '#fef2f2'
                            : '#fefce8',
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {alert.clientName}
                          </p>
                          <p
                            className="text-xs font-medium mt-1"
                            style={{
                              color:
                                alert.severity === 'RED'
                                  ? '#991b1b'
                                  : '#713f12',
                            }}
                          >
                            {alert.message}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDismissAlert(alert.key)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Dismiss alert"
                        >
                          <HiXMark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
