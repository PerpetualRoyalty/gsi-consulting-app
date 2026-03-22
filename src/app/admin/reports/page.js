'use client';

import { useState, useEffect } from 'react';
import { HiChevronDown, HiCheckCircle, HiExclamationCircle, HiEye, HiTrash, HiDownload, HiPaperAirplane } from 'react-icons/hi2';
import Link from 'next/link';

export default function AdminReportsPage() {
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [reportType, setReportType] = useState('monthly');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [clients, setClients] = useState([]);
  const [batchProgress, setBatchProgress] = useState(0);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch clients and reports on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch clients
        const clientsRes = await fetch('/api/clients');
        if (clientsRes.ok) {
          const clientsData = await clientsRes.json();
          setClients(clientsData.clients || []);
        }

        // Fetch existing reports
        await fetchReports();
      } catch (err) {
        console.error('Error fetching initial data:', err);
      }
    };

    fetchInitialData();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setGeneratedReport(null);

    if (!selectedClient || !periodStart || !periodEnd) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClient,
          reportType,
          periodStart,
          periodEnd,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to generate report');
      }

      const data = await res.json();
      setGeneratedReport(data.report);
      setSuccess('Report generated successfully!');
      setSelectedClient('');
      setPeriodStart('');
      setPeriodEnd('');
      await fetchReports();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchGenerate = async () => {
    if (clients.length === 0) {
      setError('No active clients found');
      return;
    }

    setIsBatchGenerating(true);
    setBatchProgress(0);
    setError('');
    setSuccess('');

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const total = clients.length;

    for (let i = 0; i < clients.length; i++) {
      try {
        await fetch('/api/reports/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientId: clients[i].id,
            reportType: 'monthly',
            periodStart: monthStart.toISOString(),
            periodEnd: monthEnd.toISOString(),
          }),
        });

        setBatchProgress(Math.round(((i + 1) / total) * 100));
      } catch (err) {
        console.error(`Error generating report for ${clients[i].name}:`, err);
      }
    }

    setSuccess(`Reports generated for ${total} clients!`);
    setIsBatchGenerating(false);
    await fetchReports();
  };

  const handleDeleteReport = async (reportId) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const res = await fetch(`/api/reports/${reportId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete report');

      setSuccess('Report deleted successfully');
      await fetchReports();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendToClient = async (reportId) => {
    try {
      const res = await fetch(`/api/reports/${reportId}/send`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Failed to send report');

      setSuccess('Report sent to client');
      await fetchReports();
    } catch (err) {
      setError(err.message);
    }
  };

  const clientName = selectedClient
    ? clients.find((c) => c.id === selectedClient)?.name
    : 'Select a client';

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Branded Client Reports</h1>
        <button
          onClick={() => setIsGeneratorOpen(!isGeneratorOpen)}
          style={{
            ...styles.button,
            ...styles.primaryButton,
          }}
        >
          {isGeneratorOpen ? 'Cancel' : '+ Generate Report'}
        </button>
      </div>

      {/* Alerts */}
      {error && <div style={{ ...styles.alert, ...styles.alertError }}>{error}</div>}
      {success && <div style={{ ...styles.alert, ...styles.alertSuccess }}>{success}</div>}

      {/* Report Generator Panel */}
      {isGeneratorOpen && (
        <div style={styles.generatorPanel}>
          <h2 style={styles.panelTitle}>Generate New Report</h2>
          <form onSubmit={handleGenerateReport} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Client</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                style={styles.select}
              >
                <option value="">Select a client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.company})
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Report Type</label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      value="monthly"
                      checked={reportType === 'monthly'}
                      onChange={(e) => setReportType(e.target.value)}
                    />
                    Monthly
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      value="quarterly"
                      checked={reportType === 'quarterly'}
                      onChange={(e) => setReportType(e.target.value)}
                    />
                    Quarterly
                  </label>
                </div>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Period Start</label>
                <input
                  type="date"
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Period End</label>
                <input
                  type="date"
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.button,
                ...styles.primaryButton,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Generating...' : 'Generate Report'}
            </button>
          </form>

          {/* Generated Report Preview */}
          {generatedReport && (
            <div style={styles.previewCard}>
              <h3 style={styles.previewTitle}>Report Generated</h3>
              <div style={styles.previewDetails}>
                <p>
                  <strong>{generatedReport.metadata.clientCompany}</strong>
                </p>
                <p style={styles.previewMeta}>
                  {generatedReport.metadata.reportType === 'monthly' ? 'Monthly' : 'Quarterly'} Report
                  • {generatedReport.metadata.periodLabel}
                </p>
                <div style={styles.previewMetrics}>
                  <div style={styles.previewMetric}>
                    <div style={styles.metricValue}>
                      ${generatedReport.metadata.totalBilled.toLocaleString()}
                    </div>
                    <div style={styles.metricLabel}>Total Billed</div>
                  </div>
                  <div style={styles.previewMetric}>
                    <div style={styles.metricValue}>
                      {generatedReport.metadata.documentsDelivered}
                    </div>
                    <div style={styles.metricLabel}>Deliverables</div>
                  </div>
                  <div style={styles.previewMetric}>
                    <div style={styles.metricValue}>
                      {generatedReport.metadata.messagesExchanged}
                    </div>
                    <div style={styles.metricLabel}>Communications</div>
                  </div>
                </div>
              </div>
              <div style={styles.previewActions}>
                <Link
                  href={`/admin/reports/${generatedReport.metadata.clientName}`}
                  style={{
                    ...styles.button,
                    ...styles.outlineButton,
                  }}
                >
                  View Report
                </Link>
                <button
                  onClick={() => handleSendToClient(selectedClient)}
                  style={{
                    ...styles.button,
                    ...styles.primaryButton,
                  }}
                >
                  Send to Client
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Batch Generation */}
      <div style={styles.batchSection}>
        <div style={styles.batchHeader}>
          <div>
            <h3 style={styles.batchTitle}>Batch Generation</h3>
            <p style={styles.batchSubtitle}>Generate reports for all active clients at once</p>
          </div>
          <button
            onClick={handleBatchGenerate}
            disabled={isBatchGenerating}
            style={{
              ...styles.button,
              ...styles.outlineButton,
              opacity: isBatchGenerating ? 0.7 : 1,
              cursor: isBatchGenerating ? 'not-allowed' : 'pointer',
            }}
          >
            {isBatchGenerating ? 'Generating...' : 'Generate for All Clients'}
          </button>
        </div>

        {isBatchGenerating && (
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${batchProgress}%` }} />
            </div>
            <p style={styles.progressText}>{batchProgress}% Complete</p>
          </div>
        )}
      </div>

      {/* Reports History Table */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Reports History</h2>

        {reports.length === 0 ? (
          <p style={styles.emptyState}>No reports generated yet. Create one to get started!</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableRow}>
                  <th style={styles.tableHeader}>Client</th>
                  <th style={styles.tableHeader}>Company</th>
                  <th style={styles.tableHeader}>Type</th>
                  <th style={styles.tableHeader}>Period</th>
                  <th style={styles.tableHeader}>Generated</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <strong>{report.clientName}</strong>
                    </td>
                    <td style={styles.tableCell}>{report.clientCompany}</td>
                    <td style={styles.tableCell}>
                      <span style={styles.badge}>{report.type}</span>
                    </td>
                    <td style={styles.tableCell}>{report.period}</td>
                    <td style={styles.tableCell}>
                      {new Date(report.generatedDate).toLocaleDateString()}
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.statusBadge}>
                        <HiCheckCircle style={styles.badgeIcon} />
                        {report.status}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.actionButtons}>
                        <Link
                          href={`/admin/reports/${report.id}`}
                          style={styles.actionButton}
                          title="View"
                        >
                          <HiEye size={16} />
                        </Link>
                        <button
                          onClick={() => handleSendToClient(report.id)}
                          style={styles.actionButton}
                          title="Send to Client"
                        >
                          <HiPaperAirplane size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          style={{ ...styles.actionButton, ...styles.actionButtonDanger }}
                          title="Delete"
                        >
                          <HiTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 20px',
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e3a5f',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  primaryButton: {
    backgroundColor: '#1e3a5f',
    color: 'white',
  },
  outlineButton: {
    backgroundColor: 'white',
    color: '#1e3a5f',
    border: '2px solid #1e3a5f',
  },
  alert: {
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  alertError: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  alertSuccess: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  generatorPanel: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '32px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  panelTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e3a5f',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    backgroundColor: 'white',
  },
  input: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
  },
  radioGroup: {
    display: 'flex',
    gap: '16px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  previewCard: {
    marginTop: '20px',
    padding: '16px',
    backgroundColor: '#f0f9ff',
    borderRadius: '6px',
    borderLeft: '4px solid #2d8b7a',
  },
  previewTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e3a5f',
    marginBottom: '12px',
  },
  previewDetails: {
    marginBottom: '16px',
  },
  previewMeta: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '4px',
  },
  previewMetrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginTop: '12px',
  },
  previewMetric: {
    backgroundColor: 'white',
    padding: '8px 12px',
    borderRadius: '4px',
  },
  metricValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e3a5f',
  },
  metricLabel: {
    fontSize: '11px',
    color: '#6b7280',
    marginTop: '2px',
  },
  previewActions: {
    display: 'flex',
    gap: '8px',
  },
  batchSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '32px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  batchHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  batchTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e3a5f',
  },
  batchSubtitle: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '4px',
  },
  progressContainer: {
    marginTop: '16px',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2d8b7a',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '8px',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e3a5f',
    marginBottom: '20px',
  },
  emptyState: {
    textAlign: 'center',
    color: '#6b7280',
    padding: '20px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  tableRow: {
    borderBottom: '1px solid #e5e7eb',
  },
  tableHeader: {
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#374151',
    backgroundColor: '#f9fafb',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableCell: {
    padding: '12px',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeIcon: {
    fontSize: '14px',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    padding: '4px 8px',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#6b7280',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
  },
  actionButtonDanger: {
    color: '#dc2626',
  },
};
