'use client';

import { useState } from 'react';
import {
  HiArrowDownTray,
  HiArrowUpTray,
  HiDocument,
  HiDocumentText,
  HiTableCells,
  HiChartBar,
  HiCheckBadge,
  HiEllipsisHorizontal,
} from 'react-icons/hi2';

export default function Documents() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [documents] = useState([
    {
      id: 1,
      name: 'Strategy Consulting Agreement',
      type: 'agreements',
      category: 'Agreements',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      fileType: 'pdf',
    },
    {
      id: 2,
      name: 'Project Scope & Deliverables',
      type: 'deliverables',
      category: 'Deliverables',
      size: '1.8 MB',
      uploadDate: '2024-03-10',
      fileType: 'pdf',
    },
    {
      id: 3,
      name: 'March 2024 Invoice',
      type: 'invoices',
      category: 'Invoices',
      size: '0.5 MB',
      uploadDate: '2024-03-15',
      fileType: 'pdf',
    },
    {
      id: 4,
      name: 'Q1 2024 Quarterly Report',
      type: 'reports',
      category: 'Reports',
      size: '3.2 MB',
      uploadDate: '2024-03-14',
      fileType: 'pdf',
    },
    {
      id: 5,
      name: 'Market Analysis Presentation',
      type: 'reports',
      category: 'Reports',
      size: '4.1 MB',
      uploadDate: '2024-03-12',
      fileType: 'pptx',
    },
    {
      id: 6,
      name: 'Digital Transformation Project Agreement',
      type: 'agreements',
      category: 'Agreements',
      size: '2.1 MB',
      uploadDate: '2024-03-01',
      fileType: 'pdf',
    },
    {
      id: 7,
      name: 'Implementation Roadmap',
      type: 'deliverables',
      category: 'Deliverables',
      size: '1.3 MB',
      uploadDate: '2024-03-11',
      fileType: 'xlsx',
    },
    {
      id: 8,
      name: 'February 2024 Invoice',
      type: 'invoices',
      category: 'Invoices',
      size: '0.5 MB',
      uploadDate: '2024-02-15',
      fileType: 'pdf',
    },
  ]);

  const categories = [
    { id: 'all', label: 'All Documents', icon: HiDocument },
    { id: 'agreements', label: 'Agreements', icon: HiDocumentText },
    { id: 'invoices', label: 'Invoices', icon: HiTableCells },
    { id: 'reports', label: 'Reports', icon: HiChartBar },
    { id: 'deliverables', label: 'Deliverables', icon: HiCheckBadge },
  ];

  const filteredDocuments =
    selectedCategory === 'all'
      ? documents
      : documents.filter((doc) => doc.type === selectedCategory);

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <HiDocument className="w-5 h-5 text-red-600" />;
      case 'xlsx':
        return <HiTableCells className="w-5 h-5 text-green-600" />;
      case 'pptx':
        return <HiChartBar className="w-5 h-5 text-orange-600" />;
      default:
        return <HiDocument className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-2">
            Access all your agreements, invoices, and deliverables
          </p>
        </div>
        <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          <HiArrowUpTray className="w-5 h-5" />
          Upload Document
        </button>
      </div>

      {/* Mobile Upload Button */}
      <button className="lg:hidden w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2">
        <HiArrowUpTray className="w-5 h-5" />
        Upload Document
      </button>

      {/* Category Filter */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Documents Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Document Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Size
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Upload Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.fileType)}
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {doc.fileType.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{doc.size}</td>
                  <td className="px-6 py-4 text-gray-700">{doc.uploadDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded transition"
                        title="Download document"
                      >
                        <HiArrowDownTray className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 text-gray-700 rounded transition"
                        title="More options"
                      >
                        <HiEllipsisHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No documents found in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Documents Cards - Mobile */}
      <div className="lg:hidden space-y-3">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-600"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="mt-1">{getFileIcon(doc.fileType)}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {doc.fileType.toUpperCase()} • {doc.size}
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                  {doc.category}
                </span>
              </div>

              <p className="text-xs text-gray-600 mb-3">
                Uploaded: {doc.uploadDate}
              </p>

              <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium text-sm flex items-center justify-center gap-2">
                <HiArrowDownTray className="w-4 h-4" />
                Download
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <HiDocument className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No documents found in this category.</p>
          </div>
        )}
      </div>

      {/* Storage Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Storage Usage</h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-700 font-medium">Documents Used</p>
              <p className="text-gray-600">2.5 GB / 5 GB</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            You have 2.5 GB of storage available. Contact support if you need more space.
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Secure Storage:</span> All documents are
          encrypted and securely stored. You can access them anytime from any device.
        </p>
      </div>
    </div>
  );
}
