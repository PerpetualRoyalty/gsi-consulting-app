'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { HiEye, HiArrowRight } from 'react-icons/hi2';

export default function ClientReportsPage() {
  const { data: session } = useSession();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      if (!session?.user) return;

      try {
        const res = await fetch('/api/reports');
        if (!res.ok) {
          throw new Error('Failed to fetch reports');
        }
        const data = await res.json();
        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [session?.user]);

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Client Reports</h1>
          <p style={styles.subtitle}>
            Review your monthly and quarterly reports from Good Samaritan Institute
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && <div style={{ ...styles.alert, ...styles.alertError }}>{error}</div>}

      {/* Reports Grid */}
      {reports.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📄</div>
          <h2 style={styles.emptyTitle}>No Reports Yet</h2>
          <p style={styles.emptyDescription}>
            Your reports will appear here once they are generated and shared with you.
          </p>
        </div>
      ) : (
        <div style={styles.reportsGrid}>
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReportCard({ report }) {
  return (
    <Link href={`/dashboard/reports/${report.id}`} style={{ textDecoration: 'none' }}>
      <div style={styles.reportCard}>
        <div style={styles.reportCardHeader}>
          <div style={styles.reportIcon}>📊</div>
          <div style={styles.reportCardTitle}>
            <h3 style={styles.cardTitle}>
              {report.type === 'monthly' ? 'Monthly' : 'Quarterly'} Report
            </h3>
            <p style={styles.cardPeriod}>{report.period}</p>
          </div>
        </div>

        <div style={styles.reportCardContent}>
          <div style={styles.reportMeta}>
            <p style={styles.metaLabel}>Generated</p>
            <p style={styles.metaValue}>
              {new Date(report.generatedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div style={styles.reportCardFooter}>
          <div style={styles.viewButton}>
            <HiEye size={16} />
            <span>View Report</span>
            <HiArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
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
    marginBottom: '40px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e3a5f',
    margin: 0,
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
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
  reportsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  reportCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  reportCardHover: {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    borderColor: '#2d8b7a',
  },
  reportCardHeader: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  reportIcon: {
    fontSize: '28px',
    lineHeight: '1',
  },
  reportCardTitle: {
    flex: 1,
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e3a5f',
    margin: 0,
    marginBottom: '4px',
  },
  cardPeriod: {
    fontSize: '13px',
    color: '#6b7280',
    margin: 0,
  },
  reportCardContent: {
    flex: 1,
    marginBottom: '16px',
  },
  reportMeta: {
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '4px',
  },
  metaLabel: {
    fontSize: '11px',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: 0,
    marginBottom: '4px',
  },
  metaValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    margin: 0,
  },
  reportCardFooter: {
    paddingTop: '12px',
    borderTop: '1px solid #e5e7eb',
  },
  viewButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#2d8b7a',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e3a5f',
    margin: 0,
    marginBottom: '8px',
  },
  emptyDescription: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  loadingState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#6b7280',
  },
};
