'use client';

import { useState, useEffect } from 'react';
import {
  HiCheckCircle,
  HiClipboardDocumentList,
  HiCube,
  HiDocument,
  HiCreditCard,
  HiCalendarDays,
  HiArrowRight,
  HiUser,
  HiEnvelope,
  HiPhone,
  HiPaperAirplane,
} from 'react-icons/hi2';

export default function ClientOnboardingPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, get agreementId from session/auth
        const agreementId = 'client-agreement-1';
        const res = await fetch(`/api/onboarding/${agreementId}`);
        if (res.ok) {
          const result = await res.json();
          setData(result);
        } else {
          setData(mockClientData);
        }
      } catch (error) {
        console.error('Failed to fetch onboarding data:', error);
        setData(mockClientData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading your onboarding checklist...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">Unable to load onboarding data</p>
        </div>
      </div>
    );
  }

  const { client, agreement, onboarding } = data;
  const completedItems = onboarding.filter((item) => item.completed).length;
  const totalItems = onboarding.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="text-white py-12 px-8"
        style={{ backgroundColor: '#1e3a5f' }}
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Welcome to Good Samaritan Institute!</h1>
          <p className="text-lg opacity-90">
            Hi <strong>{client.firstName}</strong>, we're excited to begin working with{' '}
            <strong>{client.company}</strong>.
          </p>
          <p className="text-base opacity-80 mt-4 max-w-2xl">
            Below is your personalized onboarding checklist. Complete each step to ensure a smooth
            transition into our partnership. We'll be here to support you every step of the way.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checklist */}
          <div className="lg:col-span-2">
            {/* Progress Overview */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Your Onboarding Checklist</h2>
                <span
                  className="text-sm font-bold text-white px-4 py-2 rounded-full"
                  style={{ backgroundColor: '#2d8b7a' }}
                >
                  {completedItems}/{totalItems} Complete
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 font-medium">Progress</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {Math.round((completedItems / totalItems) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${(completedItems / totalItems) * 100}%`,
                      backgroundColor: '#2d8b7a',
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-4">
              {onboarding.map((item, index) => (
                <ChecklistItem
                  key={index}
                  number={index + 1}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  completed={item.completed}
                  actionLabel={item.actionLabel}
                  actionLink={item.actionLink}
                  details={item.details}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Your Consultant Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div
                className="h-32 w-full flex items-center justify-center text-white text-4xl font-bold"
                style={{ backgroundColor: '#1e3a5f' }}
              >
                DL
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900">Douglas Liles</h3>
                <p className="text-sm text-gray-600 mb-4">Your Consultant</p>

                <div className="space-y-3 mb-6">
                  <a
                    href="mailto:douglas@goodsamaritan.com"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                  >
                    <HiEnvelope className="h-5 w-5" style={{ color: '#1e3a5f' }} />
                    <span className="text-sm">douglas@goodsamaritan.com</span>
                  </a>
                  <a
                    href="tel:+15551234567"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                  >
                    <HiPhone className="h-5 w-5" style={{ color: '#1e3a5f' }} />
                    <span className="text-sm">+1 (555) 123-4567</span>
                  </a>
                </div>

                <a
                  href="/dashboard/messages"
                  className="block w-full px-4 py-2 rounded-lg font-medium text-white text-center transition hover:opacity-90"
                  style={{ backgroundColor: '#2d8b7a' }}
                >
                  <HiPaperAirplane className="h-4 w-4 inline mr-2" />
                  Send Message
                </a>
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Documents</h3>
              <div className="space-y-3">
                <DocumentLink title="NDA" />
                <DocumentLink title="Intake Form" />
                <DocumentLink title="Infrastructure Questionnaire" />
              </div>
            </div>

            {/* Helpful Tips */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-bold text-gray-900 mb-3">💡 Helpful Tips</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Complete all items in order for best results</li>
                <li>• Keep your login credentials secure</li>
                <li>• Don't hesitate to reach out with questions</li>
                <li>• Documents can be downloaded and printed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistItem({
  number,
  icon,
  title,
  description,
  completed,
  actionLabel,
  actionLink,
  details,
}) {
  const Icon = icon;

  return (
    <div
      className="bg-white rounded-lg shadow p-6 border-l-4 transition hover:shadow-lg"
      style={{
        borderColor: completed ? '#10b981' : '#2d8b7a',
        opacity: completed ? 0.85 : 1,
      }}
    >
      <div className="flex gap-4">
        {/* Icon and Number */}
        <div className="flex-shrink-0">
          <div
            className="flex items-center justify-center h-12 w-12 rounded-lg text-white text-xl"
            style={{
              backgroundColor: completed ? '#10b981' : '#2d8b7a',
            }}
          >
            {completed ? <HiCheckCircle className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              {details && <p className="text-sm text-gray-500 mt-1">{details}</p>}
            </div>
            {completed && (
              <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                ✓ Completed
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-4">{description}</p>

          {!completed && actionLabel && (
            <a
              href={actionLink}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition hover:opacity-90"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              {actionLabel}
              <HiArrowRight className="h-4 w-4" />
            </a>
          )}

          {completed && (
            <p className="text-sm text-gray-500">
              ✓ You've completed this step. Great job!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function DocumentLink({ title }) {
  return (
    <a
      href="#"
      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition"
    >
      <div className="flex items-center gap-3">
        <HiDocument className="h-5 w-5" style={{ color: '#1e3a5f' }} />
        <span className="text-sm font-medium text-gray-900">{title}</span>
      </div>
      <HiArrowRight className="h-4 w-4 text-gray-400" />
    </a>
  );
}

const mockClientData = {
  client: {
    firstName: 'John',
    lastName: 'Smith',
    company: 'Tech Innovations LLC',
    email: 'john@techinnovations.com',
  },
  agreement: {
    title: 'IT Consulting Services - 12 Month Retainer',
    type: 'Retainer',
    amount: '$5,000',
  },
  onboarding: [
    {
      icon: HiCheckCircle,
      title: 'Agreement Signed',
      description: 'Your agreement has been signed and is now active.',
      completed: true,
      details: 'Agreement activated on March 10, 2026',
    },
    {
      icon: HiClipboardDocumentList,
      title: 'Complete Project Intake Form',
      description: 'Tell us about your project goals and requirements.',
      completed: false,
      actionLabel: 'Fill Out Form',
      actionLink:
        'https://example.com/intake-form',
      details: 'Estimated time: 15 minutes',
    },
    {
      icon: HiCube,
      title: 'Complete Infrastructure Questionnaire',
      description: 'Help us understand your current IT setup.',
      completed: false,
      actionLabel: 'Start Questionnaire',
      actionLink: 'https://example.com/infra-questionnaire',
      details: 'Estimated time: 10 minutes',
    },
    {
      icon: HiDocument,
      title: 'Review & Sign NDA',
      description: 'Review the mutual non-disclosure agreement.',
      completed: false,
      actionLabel: 'View NDA',
      actionLink: 'https://example.com/nda',
      details: 'Estimated time: 5 minutes',
    },
    {
      icon: HiCreditCard,
      title: 'First Payment',
      description: 'Pay the first month of your retainer ($5,000).',
      completed: false,
      actionLabel: 'Make Payment',
      actionLink: 'https://stripe.com/pay',
      details: 'Invoice #INV-2026-001',
    },
    {
      icon: HiCalendarDays,
      title: 'Schedule Kickoff Call',
      description: 'Book your initial consultation call with our team.',
      completed: false,
      actionLabel: 'Schedule Call',
      actionLink: 'mailto:douglas@goodsamaritan.com?subject=Schedule Kickoff Call',
      details: 'Duration: 60 minutes',
    },
  ],
};
