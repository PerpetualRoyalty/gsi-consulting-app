'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HiEllipsisHorizontal,
  HiBell,
  HiHome,
  HiDocument,
  HiCreditCard,
  HiEnvelope,
  HiFolder,
  HiUser,
  HiBars3,
  HiXMark,
  HiRocketLaunch,
  HiDocumentChartBar,
} from 'react-icons/hi2';

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to access your dashboard</p>
          <Link
            href="/login"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const navigationItems = [
    { href: '/dashboard/onboarding', label: 'Onboarding', icon: HiRocketLaunch },
    { href: '/dashboard', label: 'Dashboard', icon: HiHome },
    { href: '/dashboard/agreements', label: 'My Agreements', icon: HiDocument },
    { href: '/dashboard/payments', label: 'Payments', icon: HiCreditCard },
    { href: '/dashboard/messages', label: 'Messages', icon: HiEnvelope },
    { href: '/dashboard/documents', label: 'Documents', icon: HiFolder },
    { href: '/dashboard/reports', label: 'Reports', icon: HiDocumentChartBar },
    { href: '/dashboard/profile', label: 'Profile', icon: HiUser },
  ];

  const isActive = (href) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 hover:text-gray-900"
        >
          {sidebarOpen ? <HiXMark size={24} /> : <HiBars3 size={24} />}
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Consulting Portal</h1>
        <button className="text-gray-700 hover:text-gray-900">
          <HiBell size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static left-0 top-0 h-screen lg:h-auto w-64 bg-white border-r border-gray-200 transform lg:transform-none transition-transform z-40 pt-16 lg:pt-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo/Brand */}
        <div className="hidden lg:flex items-center justify-center h-16 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
              CP
            </div>
            <span className="text-xl font-semibold text-gray-900">Consulting</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  active
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        {/* Top Bar */}
        <header className="hidden lg:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-8">
          <div>
            <h2 className="text-gray-900 font-semibold">
              Welcome back, {session?.user?.name || 'Client'}
            </h2>
            <p className="text-sm text-gray-600">{session?.user?.email}</p>
          </div>
          <button className="text-gray-700 hover:text-gray-900 relative">
            <HiBell size={24} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
