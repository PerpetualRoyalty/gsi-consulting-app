'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineDocument,
  HiOutlineCurrencyDollar,
  HiOutlineChatBubbleLeftRight,
  HiOutlineFolderOpen,
  HiOutlineCog6Tooth,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineBell,
  HiOutlineArrowLeftOnRectangle,
  HiRocketLaunch,
  HiOutlineHeart,
  HiOutlineDocumentChartBar,
} from 'react-icons/hi2';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session?.user?.role || session.user.role !== 'ADMIN') {
    router.push('/login');
    return null;
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: HiOutlineChartBar },
    { href: '/admin/clients', label: 'Clients', icon: HiOutlineUsers },
    { href: '/admin/onboarding', label: 'Onboarding', icon: HiRocketLaunch },
    { href: '/admin/agreements', label: 'Agreements', icon: HiOutlineDocument },
    { href: '/admin/payments', label: 'Payments', icon: HiOutlineCurrencyDollar },
    { href: '/admin/messages', label: 'Messages', icon: HiOutlineChatBubbleLeftRight },
    { href: '/admin/health', label: 'Client Health', icon: HiOutlineHeart },
    { href: '/admin/reports', label: 'Reports', icon: HiOutlineDocumentChartBar },
    { href: '/admin/documents', label: 'Documents', icon: HiOutlineFolderOpen },
    { href: '/admin/settings', label: 'Settings', icon: HiOutlineCog6Tooth },
  ];

  const handleLogout = () => {
    router.push('/api/auth/signout');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:static lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-600" style={{ backgroundColor: '#1e3a5f' }}></div>
            <span className="font-bold text-gray-900 hidden sm:inline">Good Samaritan</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <HiOutlineXMark className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = typeof window !== 'undefined' && window.location.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                style={isActive ? { backgroundColor: '#1e3a5f20', color: '#1e3a5f' } : {}}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
              {session?.user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{session?.user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <HiOutlineArrowLeftOnRectangle className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <HiOutlineBars3 className="w-6 h-6" />
          </button>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
              <HiOutlineBell className="w-6 h-6" />
              <span
                className="absolute top-0 right-0 w-2 h-2 rounded-full"
                style={{ backgroundColor: '#2d8b7a' }}
              ></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
              {session?.user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
