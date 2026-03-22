'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  HiCheckCircle,
  HiExclamationTriangle,
  HiClock,
  HiArrowDownTray,
  HiEye,
  HiArrowPath,
  HiChevronLeft,
  HiDocument,
  HiEnvelope,
  HiUser,
} from 'react-icons/hi2';

export default function OnboardingDetailPage() {
  const params = useParams();
  const agreementId = params.agreementId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/onboarding/${agreementId}`);
        if (res.ok) {
          const result = await res.json();
          setData(result);
        } else {
          setData(mockDetailData[agreementId] || mockDetailData['1']);
        }
      } catch (err) {
        console.error('Failed to fetch onboarding details:', err);
        setData(mockDetailData[agreementId] || mockDetailData['1']);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [agreementId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading onboarding details...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">Unable to load onboarding details</p>
        </div>
      </div>
    );
  }

  const { client, agreement, timeline, documents } = data;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <a
          href="/admin/onboarding"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 font-medium"
          style={{ color: '#1e3a5f' }}
        >
          <HiChevronLeft className="h-5 w-5" />
          Back to Onboarding
        </a>
        <h1 className="text-4xl font-bold text-gray-900" style={{ color: '#1e3a5f' }}>
          Onboarding Details
        </h1>
        <p className="text-gray-600 mt-2">{agreement.title}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Client Info Card */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Client Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 font-medium">Client Name</p>
                <p className="text-gray-900 font-semibold mt-1">{client.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Company</p>
                <p className="text-gray-900 font-semibold mt-1">{client.company}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Email</p>
                <p className="text-gray-900 mt-1">{client.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Phone</p>
                <p className="text-gray-900 mt-1">{client.phone}</p>
              </div>
            </div>

            <hr className="my-6" />

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agreement Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 font-medium">Agreement Title</p>
                <p className="text-gray-900 font-semibold mt-1">{agreement.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Type</p>
                <p className="text-gray-900 font-semibold mt-1">{agreement.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Retainer Amount</p>
                <p className="text-gray-900 font-semibold mt-1">{agreement.retainerAmount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Signed Date</p>
                <p className="text-gray-900 font-semibold mt-1">{agreement.signedDate}</p>
              </div>
            </div>
          </div>

          {/* Onboarding Timeline */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Onboarding Timeline</h2>
            <div className="relative">
              {timeline.map((step, index) => (
                <div key={index} className="mb-8 last:mb-0">
                  <div className="flex gap-4">
                    {/* Timeline Marker */}
                    <div className="flex flex-col items-center">
                      <div
                        className="flex items-center justify-center h-10 w-10 rounded-full text-white font-bold"
                        style={{
                          backgroundColor:
                            step.status === 'completed'
                              ? '#10b981'
                              : step.status === 'in-progress'
                              ? '#f59e0b'
                              : step.status === 'failed'
                              ? '#ef4444'
                              : '#d1d5db',
                        }}
                      >
                        {step.status === 'completed' ? (
                          <HiCheckCircle className="h-6 w-6" />
                        ) : step.status === 'in-progress' ? (
                          <HiClock className="h-6 w-6" />
                        ) : step.status === 'failed' ? (
                          <HiExclamationTriangle className="h-6 w-6" />
                        ) : (
                          <div className="h-2 w-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      {index < timeline.length - 1 && (
                        <div
                          className="w-1 flex-1 min-h-12"
                          style={{
                            backgroundColor:
                              step.status === 'completed' ? '#10b981' : '#e5e7eb',
                          }}
                        ></div>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="pb-8">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{step.name}</h3>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                          style={{
                            backgroundColor:
                              step.status === 'completed'
                                ? '#10b981'
                                : step.status === 'in-progress'
                                ? '#f59e0b'
                                : step.status === 'failed'
                                ? '#ef4444'
                                : '#d1d5db',
                          }}
                        >
                          {step.status === 'completed'
                            ? 'Completed'
                            : step.status === 'in-progress'
                            ? 'In Progress'
                            : step.status === 'failed'
                            ? 'Failed'
                            : 'Pending'}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-3">{step.detail}</p>

                      {step.timestamp && (
                        <p className="text-gray-500 text-xs mb-3">
                          {step.status === 'completed'
                            ? `Completed on ${step.timestamp}`
                            : `Triggered on ${step.timestamp}`}
                        </p>
                      )}

                      {step.status === 'failed' && step.error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                          <p className="text-red-700 text-sm">
                            <strong>Error:</strong> {step.error}
                          </p>
                        </div>
                      )}

                      {step.status === 'failed' && (
                        <button
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white text-sm transition hover:opacity-90"
                          style={{ backgroundColor: '#2d8b7a' }}
                        >
                          <HiArrowPath className="h-4 w-4" />
                          Retry Step
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Documents */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Generated Documents</h2>
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <HiDocument className="h-8 w-8 text-blue-600" style={{ color: '#1e3a5f' }} />
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">Created {doc.createdDate}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-2 hover:bg-gray-200 rounded-lg transition"
                      title="View Document"
                    >
                      <HiEye className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                      className="p-2 hover:bg-gray-200 rounded-lg transition"
                      title="Download Document"
                    >
                      <HiArrowDownTray className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Quick Actions */}
        <div className="lg:col-span-1">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                className="w-full px-4 py-2 rounded-lg font-medium text-white transition hover:opacity-90"
                style={{ backgroundColor: '#2d8b7a' }}
              >
                <HiArrowPath className="h-4 w-4 inline mr-2" />
                Retry All Failed
              </button>
              <button
                className="w-full px-4 py-2 rounded-lg font-medium text-white transition hover:opacity-90"
                style={{ backgroundColor: '#1e3a5f' }}
              >
                <HiEnvelope className="h-4 w-4 inline mr-2" />
                Send Welcome Email
              </button>
              <a
                href="#"
                className="block w-full px-4 py-2 rounded-lg font-medium text-white text-center transition hover:opacity-90"
                style={{ backgroundColor: '#1e3a5f' }}
              >
                <HiDocument className="h-4 w-4 inline mr-2" />
                View Agreement
              </a>
              <a
                href="#"
                className="block w-full px-4 py-2 rounded-lg font-medium text-white text-center transition hover:opacity-90"
                style={{ backgroundColor: '#1e3a5f' }}
              >
                <HiUser className="h-4 w-4 inline mr-2" />
                View Client Profile
              </a>
            </div>
          </div>

          {/* Status Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed Steps</span>
                <span className="font-semibold text-gray-900">
                  {timeline.filter((s) => s.status === 'completed').length}/{timeline.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">In Progress</span>
                <span className="font-semibold text-gray-900">
                  {timeline.filter((s) => s.status === 'in-progress').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Failed</span>
                <span className="font-semibold text-red-600">
                  {timeline.filter((s) => s.status === 'failed').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-gray-900">
                  {timeline.filter((s) => s.status === 'pending').length}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm font-semibold text-gray-900">
                  {Math.round(
                    (timeline.filter((s) => s.status === 'completed').length /
                      timeline.length) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition"
                  style={{
                    width: `${(timeline.filter((s) => s.status === 'completed').length / timeline.length) * 100}%`,
                    backgroundColor: '#10b981',
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mockDetailData = {
  '1': {
    client: {
      name: 'John Smith',
      company: 'Tech Innovations LLC',
      email: 'john@techinnovations.com',
      phone: '+1 (555) 123-4567',
    },
    agreement: {
      title: 'IT Consulting Services - 12 Month Retainer',
      type: 'Retainer',
      retainerAmount: '$5,000/month',
      signedDate: 'March 10, 2026',
    },
    timeline: [
      {
        name: 'Agreement Signed',
        status: 'completed',
        detail: 'The agreement has been signed and is now active.',
        timestamp: 'March 10, 2026',
      },
      {
        name: 'Stripe Customer & Invoice Created',
        status: 'completed',
        detail: 'Customer account created in Stripe and initial invoice generated.',
        timestamp: 'March 10, 2026',
      },
      {
        name: 'Onboarding Documents Generated',
        status: 'completed',
        detail: 'NDA, Project Intake Form, and Infrastructure Questionnaire generated.',
        timestamp: 'March 11, 2026',
      },
      {
        name: 'Welcome Email Sent',
        status: 'completed',
        detail: 'Personalized welcome email sent to the client.',
        timestamp: 'March 11, 2026',
      },
      {
        name: 'Welcome Message Sent',
        status: 'completed',
        detail: 'Welcome message sent through the client portal.',
        timestamp: 'March 11, 2026',
      },
      {
        name: 'Agreement Activated',
        status: 'completed',
        detail: 'Agreement is now fully active and work can begin.',
        timestamp: 'March 12, 2026',
      },
    ],
    documents: [
      {
        name: 'Mutual Non-Disclosure Agreement (NDA)',
        createdDate: 'March 11, 2026',
      },
      {
        name: 'Project Intake Form',
        createdDate: 'March 11, 2026',
      },
      {
        name: 'Infrastructure Questionnaire',
        createdDate: 'March 11, 2026',
      },
    ],
  },
  '2': {
    client: {
      name: 'Sarah Johnson',
      company: 'Global Solutions Inc',
      email: 'sarah@globalsolutions.com',
      phone: '+1 (555) 234-5678',
    },
    agreement: {
      title: 'Cloud Infrastructure Setup - 6 Month',
      type: 'Project',
      retainerAmount: '$8,500 (one-time)',
      signedDate: 'March 18, 2026',
    },
    timeline: [
      {
        name: 'Agreement Signed',
        status: 'completed',
        detail: 'The agreement has been signed and is now active.',
        timestamp: 'March 18, 2026',
      },
      {
        name: 'Stripe Customer & Invoice Created',
        status: 'completed',
        detail: 'Customer account created in Stripe and invoice generated.',
        timestamp: 'March 18, 2026',
      },
      {
        name: 'Onboarding Documents Generated',
        status: 'in-progress',
        detail: 'Generating NDA, Project Intake Form, and Infrastructure Questionnaire...',
        timestamp: 'March 19, 2026',
      },
      {
        name: 'Welcome Email Sent',
        status: 'pending',
        detail: 'Pending document generation completion.',
      },
      {
        name: 'Welcome Message Sent',
        status: 'pending',
        detail: 'Waiting for previous steps to complete.',
      },
      {
        name: 'Agreement Activated',
        status: 'pending',
        detail: 'Will be activated once all steps are complete.',
      },
    ],
    documents: [
      {
        name: 'Mutual Non-Disclosure Agreement (NDA)',
        createdDate: 'March 19, 2026',
      },
      {
        name: 'Project Intake Form',
        createdDate: 'March 19, 2026',
      },
      {
        name: 'Infrastructure Questionnaire',
        createdDate: 'March 19, 2026',
      },
    ],
  },
  '3': {
    client: {
      name: 'Michael Chen',
      company: 'Digital Dynamics Corp',
      email: 'michael@digitaldynamics.com',
      phone: '+1 (555) 345-6789',
    },
    agreement: {
      title: 'Cybersecurity Audit - 3 Month',
      type: 'Project',
      retainerAmount: '$12,000 (one-time)',
      signedDate: 'March 10, 2026',
    },
    timeline: [
      {
        name: 'Agreement Signed',
        status: 'completed',
        detail: 'The agreement has been signed and is now active.',
        timestamp: 'March 10, 2026',
      },
      {
        name: 'Stripe Customer & Invoice Created',
        status: 'failed',
        detail: 'Failed to create invoice in Stripe.',
        error: 'Stripe API returned error: Invalid billing details provided',
        timestamp: 'March 10, 2026',
      },
      {
        name: 'Onboarding Documents Generated',
        status: 'pending',
        detail: 'Waiting for previous step to be retried.',
      },
      {
        name: 'Welcome Email Sent',
        status: 'pending',
        detail: 'Waiting for document generation.',
      },
      {
        name: 'Welcome Message Sent',
        status: 'pending',
        detail: 'Waiting for previous steps to complete.',
      },
      {
        name: 'Agreement Activated',
        status: 'pending',
        detail: 'Will be activated once all steps are complete.',
      },
    ],
    documents: [
      {
        name: 'Mutual Non-Disclosure Agreement (NDA)',
        createdDate: 'N/A',
      },
      {
        name: 'Project Intake Form',
        createdDate: 'N/A',
      },
      {
        name: 'Infrastructure Questionnaire',
        createdDate: 'N/A',
      },
    ],
  },
};
