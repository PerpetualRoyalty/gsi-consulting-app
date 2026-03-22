'use client';

import { useState, useEffect } from 'react';
import {
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlineArrowDown,
  HiOutlineFolderOpen,
} from 'react-icons/hi2';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/documents');
        if (!response.ok) throw new Error('Failed to fetch documents');
        const data = await response.json();
        setDocuments(data);
      } catch (err) {
        // Mock data
        setDocuments([
          {
            id: 1,
            name: 'Service Agreement Template.docx',
            category: 'Template',
            size: '245 KB',
            uploadDate: '2024-03-10',
            downloads: 5,
          },
          {
            id: 2,
            name: 'Acme Corp - SOW.pdf',
            category: 'Agreement',
            size: '325 KB',
            uploadDate: '2024-03-15',
            downloads: 2,
          },
          {
            id: 3,
            name: 'NDA Template.docx',
            category: 'Template',
            size: '180 KB',
            uploadDate: '2024-02-20',
            downloads: 8,
          },
          {
            id: 4,
            name: 'Invoice Template.xlsx',
            category: 'Template',
            size: '95 KB',
            uploadDate: '2024-03-01',
            downloads: 12,
          },
          {
            id: 5,
            name: 'Tech Solutions - Project Proposal.pdf',
            category: 'Proposal',
            size: '450 KB',
            uploadDate: '2024-03-12',
            downloads: 3,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(documents.map((d) => d.category))];

  const CategoryBadge = ({ category }) => {
    const colors = {
      Template: '#3b82f6',
      Agreement: '#2d8b7a',
      Proposal: '#f59e0b',
      Other: '#9ca3af',
    };
    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-medium text-white"
        style={{ backgroundColor: colors[category] || colors.Other }}
      >
        {category}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">Manage templates, agreements, and proposals</p>
        </div>
        <button
          className="flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium transition-colors"
          style={{ backgroundColor: '#1e3a5f' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#152d47')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1e3a5f')}
        >
          <HiOutlinePlus className="w-5 h-5" />
          Upload Document
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading documents...</p>
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Name
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
                    Downloads
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <HiOutlineFolderOpen className="w-4 h-4 text-gray-400" />
                        {doc.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <CategoryBadge category={doc.category} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{doc.size}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{doc.uploadDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{doc.downloads}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                          <HiOutlineArrowDown className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <HiOutlineTrash className="w-5 h-5" />
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
            <p className="text-gray-500">No documents found</p>
          </div>
        )}
      </div>
    </div>
  );
}
