'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  HiOutlineChevronLeft,
  HiOutlinePaperAirplane,
  HiOutlineArrowPath,
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';

const AGREEMENT_TEMPLATE = `STATEMENT OF WORK
Service Agreement

This Statement of Work ("SOW") sets forth the terms and conditions of the consulting services to be provided.

1. SCOPE OF SERVICES
The Service Provider agrees to provide the following consulting services (the "Services"):
- [Service 1]
- [Service 2]
- [Service 3]

The Services will be performed in a professional manner consistent with industry standards.

2. TERM
- Start Date: [START_DATE]
- End Date: [END_DATE]
- Term: [TERM_DURATION]

This agreement will commence on the Start Date and continue until the End Date, unless terminated earlier in accordance with the provisions herein.

3. COMPENSATION
Service Provider shall be compensated as follows:
- Rate/Fee: [AMOUNT]
- Billing Cycle: [BILLING_CYCLE]
- Payment Due: Net 30 days from invoice date

4. PAYMENT TERMS
- Invoices will be issued upon completion of milestones or monthly, as applicable
- Payment is due within thirty (30) days of invoice date
- Late payments subject to 1.5% monthly interest
- A retainer may be required before commencement of Services

5. CONFIDENTIALITY
Both parties agree to:
- Maintain confidentiality of all proprietary information
- Not disclose any information without prior written consent
- Return all confidential materials upon termination
- Protect information for a period of two (2) years after termination

6. INTELLECTUAL PROPERTY RIGHTS
- Client retains ownership of all work product created under this SOW
- Service Provider retains ownership of pre-existing tools and methodologies
- Service Provider grants Client a non-exclusive license to use methodologies

7. TERMINATION
Either party may terminate this agreement:
- With thirty (30) days written notice
- Immediately for material breach if not cured within ten (10) days
- Upon termination, Client will pay for Services rendered through the termination date

8. INDEPENDENT CONTRACTOR
Service Provider is an independent contractor and not an employee. Service Provider is responsible for:
- All payroll taxes and withholdings
- Professional liability insurance
- Compliance with applicable laws

9. LIMITATION OF LIABILITY
In no event shall either party be liable for indirect, incidental, or consequential damages, even if advised of the possibility of such damages.

10. GOVERNING LAW
This agreement shall be governed by and construed in accordance with the laws of [JURISDICTION], without regard to conflicts of law.

11. ENTIRE AGREEMENT
This SOW constitutes the entire agreement between the parties and supersedes all prior understandings, whether written or oral.

SIGNATURES:

Good Samaritan Institute

By: _________________________
Name: _________________________
Title: _________________________
Date: _________________________


Client

By: _________________________
Name: _________________________
Title: _________________________
Date: _________________________`;

const EXAMPLE_PROMPTS = [
  '6-month cloud migration for a 50-person healthcare company, $8K/month retainer',
  'Annual cybersecurity retainer for a mid-size bank, $15,000/quarter, SOC2 and PCI compliance required',
  '3-month digital transformation assessment for a school district, fixed price $25,000',
  'Ongoing managed IT services for a nonprofit, $3,500 per month',
];

const GENERATION_STEPS = [
  'Analyzing requirements...',
  'Extracting project parameters...',
  'Selecting compliance frameworks...',
  'Building payment schedule...',
  'Generating service scope...',
  'Finalizing agreement...',
];

export default function NewAgreementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('ai');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // AI Generator state
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedAgreement, setGeneratedAgreement] = useState(null);
  const [generationError, setGenerationError] = useState(null);

  // Manual form state
  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    type: 'retainer',
    amount: '',
    billingCycle: 'monthly',
    startDate: '',
    endDate: '',
    content: AGREEMENT_TEMPLATE,
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/clients');
        if (response.ok) {
          const data = await response.json();
          setClients(data);
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
        setClients([
          { id: 1, name: 'Acme Corp', company: 'Acme Corp' },
          { id: 2, name: 'Tech Solutions', company: 'Tech Solutions' },
          { id: 3, name: 'StartupXYZ', company: 'StartupXYZ' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Simulate generation steps
  useEffect(() => {
    if (!generating) return;

    const interval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev < GENERATION_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [generating]);

  const handleGenerateAgreement = async () => {
    if (!prompt.trim()) {
      setGenerationError('Please enter a description of the engagement');
      return;
    }

    setGenerating(true);
    setGenerationStep(0);
    setGenerationError(null);
    setGeneratedAgreement(null);

    try {
      const response = await fetch('/api/agreements/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate agreement');
      }

      const data = await response.json();
      setGeneratedAgreement(data.agreement);
      setGenerationStep(GENERATION_STEPS.length - 1);
    } catch (err) {
      console.error('Generation error:', err);
      setGenerationError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleUseGeneratedAgreement = () => {
    if (!generatedAgreement) return;

    setFormData({
      clientId: '',
      title: generatedAgreement.title,
      type: generatedAgreement.type.toLowerCase(),
      amount: generatedAgreement.amount?.toString() || '',
      billingCycle: generatedAgreement.billingCycle?.toLowerCase() || 'monthly',
      startDate: '',
      endDate: '',
      content: generatedAgreement.content,
    });

    setActiveTab('manual');
  };

  const handleExamplePrompt = (examplePrompt) => {
    setPrompt(examplePrompt);
  };

  const handleSubmit = async (e, asDraft = true) => {
    e.preventDefault();

    if (!formData.clientId || !formData.title) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        status: asDraft ? 'draft' : 'sent',
      };

      const response = await fetch('/api/admin/agreements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to create agreement');

      const newAgreement = await response.json();
      router.push(`/admin/agreements/${newAgreement.id}`);
    } catch (err) {
      console.error('Error creating agreement:', err);
      alert('Failed to create agreement');
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  const handleResetTemplate = () => {
    if (confirm('Reset content to default template?')) {
      setFormData({ ...formData, content: AGREEMENT_TEMPLATE });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <HiOutlineChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Agreement</h1>
          <p className="text-gray-600 mt-1">Use AI to generate or manually create a professional service agreement</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 rounded-t-lg">
        <div className="flex gap-8 px-6">
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-4 px-2 font-medium border-b-2 transition-colors ${
              activeTab === 'ai'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <HiOutlineSparkles className="w-5 h-5" />
              AI Generator
            </div>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`py-4 px-2 font-medium border-b-2 transition-colors ${
              activeTab === 'manual'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Manual Template
          </button>
        </div>
      </div>

      {/* AI Generator Tab */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          {!generatedAgreement ? (
            <>
              {/* Input Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Describe Your Engagement</h2>
                <textarea
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    setGenerationError(null);
                  }}
                  placeholder="Describe the engagement in plain language… e.g., 6-month cloud migration for a 50-person healthcare company, $8K/month retainer"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-base"
                />
                <p className="text-sm text-gray-500 mt-3">
                  Include details like duration, project type, company size, industry, amount, billing cycle, and any compliance requirements (HIPAA, PCI, SOC2, etc.).
                </p>
              </div>

              {/* Example Prompts */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Example Prompts</h3>
                <div className="space-y-2">
                  {EXAMPLE_PROMPTS.map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleExamplePrompt(example)}
                      className="block w-full text-left px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors text-sm text-gray-700"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {generationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <HiOutlineExclamationTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">{generationError}</p>
                    <button
                      onClick={handleGenerateAgreement}
                      className="text-sm text-red-600 hover:text-red-700 font-medium mt-2"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <button
                  onClick={handleGenerateAgreement}
                  disabled={generating || !prompt.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: generating || !prompt.trim() ? '#9ca3af' : '#2d8b7a',
                  }}
                  onMouseEnter={(e) =>
                    !generating && prompt.trim() && (e.currentTarget.style.backgroundColor = '#246d63')
                  }
                  onMouseLeave={(e) =>
                    !generating && prompt.trim() && (e.currentTarget.style.backgroundColor = '#2d8b7a')
                  }
                >
                  {generating ? (
                    <>
                      <HiOutlineArrowPath className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <HiOutlineSparkles className="w-5 h-5" />
                      Generate Agreement
                    </>
                  )}
                </button>
              </div>

              {/* Generation Progress */}
              {generating && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="space-y-3">
                    {GENERATION_STEPS.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        {idx < generationStep ? (
                          <HiOutlineCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : idx === generationStep ? (
                          <HiOutlineArrowPath className="w-5 h-5 text-teal-600 flex-shrink-0 animate-spin" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                        )}
                        <span
                          className={`text-sm ${
                            idx <= generationStep ? 'text-gray-900 font-medium' : 'text-gray-500'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Preview Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Generated Agreement Preview</h2>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-600 font-medium mb-1">Type</p>
                    <p className="text-sm font-bold text-gray-900">{generatedAgreement.type}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-600 font-medium mb-1">Amount</p>
                    <p className="text-sm font-bold text-gray-900">${generatedAgreement.amount?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-600 font-medium mb-1">Billing</p>
                    <p className="text-sm font-bold text-gray-900">{generatedAgreement.billingCycle}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-600 font-medium mb-1">Duration</p>
                    <p className="text-sm font-bold text-gray-900">{generatedAgreement.duration} months</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-600 font-medium mb-1">Industry</p>
                    <p className="text-sm font-bold text-gray-900 capitalize">{generatedAgreement.industry}</p>
                  </div>
                  {generatedAgreement.compliance.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-xs text-gray-600 font-medium mb-1">Compliance</p>
                      <div className="flex flex-wrap gap-1">
                        {generatedAgreement.compliance.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-teal-900">{generatedAgreement.summary}</p>
                </div>

                {/* Agreement Content Preview */}
                <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 max-h-96 overflow-y-auto mb-6">
                  <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap font-mono text-xs leading-relaxed">
                    {generatedAgreement.content.substring(0, 2000)}...
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setGeneratedAgreement(null);
                      setPrompt('');
                      setGenerationError(null);
                    }}
                    className="flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Generate Another
                  </button>
                  <button
                    onClick={handleUseGeneratedAgreement}
                    className="flex-1 px-6 py-2 rounded-lg text-white font-medium transition-colors"
                    style={{ backgroundColor: '#1e3a5f' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#152d47')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1e3a5f')}
                  >
                    Use This Agreement
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Manual Template Tab */}
      {activeTab === 'manual' && (
        <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Client <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.company || client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Agreement Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Website Redesign Project"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Agreement Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="retainer">Retainer</option>
                    <option value="project">Project-Based</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 5000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {formData.type === 'retainer' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Billing Cycle
                    </label>
                    <select
                      value={formData.billingCycle}
                      onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annual">Annual</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {formData.type === 'retainer' ? 'Renewal Date' : 'End Date'}
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Agreement Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Agreement Content</h2>
              <button
                type="button"
                onClick={handleResetTemplate}
                className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <HiOutlineArrowPath className="w-4 h-4" />
                Reset to Template
              </button>
            </div>
            <textarea
              value={formData.content}
              onChange={(e) => handleContentChange(e.target.value)}
              rows={20}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              Edit the agreement text. Use [START_DATE], [END_DATE], [AMOUNT], and [TERM_DURATION] as placeholders.
            </p>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                onClick={(e) => handleSubmit(e, true)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#1e3a5f' }}
                onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = '#152d47')}
                onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = '#1e3a5f')}
              >
                <HiOutlineArrowPath className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
                {saving ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                type="submit"
                disabled={saving}
                onClick={(e) => handleSubmit(e, false)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#2d8b7a' }}
                onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = '#246d63')}
                onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = '#2d8b7a')}
              >
                <HiOutlinePaperAirplane className="w-4 h-4" />
                {saving ? 'Sending...' : 'Send to Client'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
