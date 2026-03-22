'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { HiArrowLeft, HiDownload, HiPaperAirplane, HiPrinter } from 'react-icons/hi2';

export default function ReportViewerPage() {
  const router = useRouter();
  const params = useParams();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // Fetch the report from the API
        const res = await fetch(`/api/reports/${params.id}`);
        if (!res.ok) {
          throw new Error('Report not found');
        }
        const data = await res.json();
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchReport();
    }
  }, [params.id]);

  const handleDownloadPDF = () => {
    // In a real app, you would convert HTML to PDF using a library like html2pdf or pdfkit
    // For now, this is a placeholder
    alert('PDF download functionality would use html2pdf library');
  };

  const handleSendToClient = async () => {
    try {
      const res = await fetch(`/api/reports/${params.id}/send`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to send report');
      }

      alert('Report sent to client successfully!');
    } catch (err) {
      alert('Error sending report: ' + err.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <p>Loading report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>Error: {error}</p>
        <button onClick={() => router.back()} style={styles.backButton}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <button onClick={() => router.back()} style={styles.toolbarButton}>
            <HiArrowLeft size={18} />
            Back
          </button>
          <div style={styles.clientInfo}>
            {report?.metadata?.clientCompany && (
              <h1 style={styles.clientName}>{report.metadata.clientCompany}</h1>
            )}
            {report?.metadata?.periodLabel && (
              <p style={styles.clientMeta}>
                {report.metadata.reportType === 'monthly' ? 'Monthly' : 'Quarterly'} Report •
                {report.metadata.periodLabel}
              </p>
            )}
          </div>
        </div>
        <div style={styles.toolbarActions}>
          <button
            onClick={handleDownloadPDF}
            style={{ ...styles.toolbarButton, ...styles.primary }}
            title="Download PDF"
          >
            <HiDownload size={18} />
            Download PDF
          </button>
          <button
            onClick={handleSendToClient}
            style={{ ...styles.toolbarButton, ...styles.primary }}
            title="Send to Client"
          >
            <HiPaperAirplane size={18} />
            Send to Client
          </button>
          <button onClick={handlePrint} style={styles.toolbarButton} title="Print">
            <HiPrinter size={18} />
            Print
          </button>
        </div>
      </div>

      {/* Report Container */}
      <div style={styles.reportWrapper}>
        <div
          style={styles.reportContainer}
          dangerouslySetInnerHTML={{
            __html: report?.html || '',
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  toolbar: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flex: 1,
  },
  clientInfo: {
    paddingLeft: '20px',
    borderLeft: '2px solid #e5e7eb',
  },
  clientName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e3a5f',
    margin: 0,
  },
  clientMeta: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  toolbarActions: {
    display: 'flex',
    gap: '8px',
  },
  toolbarButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    color: '#374151',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  primary: {
    backgroundColor: '#1e3a5f',
    color: 'white',
    border: 'none',
  },
  reportWrapper: {
    flex: 1,
    padding: '32px 20px',
    overflowY: 'auto',
  },
  reportContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '900px',
    margin: '0 auto',
  },
  container: {
    padding: '32px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  error: {
    color: '#dc2626',
    marginBottom: '20px',
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#1e3a5f',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },

  '@media print': {
    toolbar: {
      display: 'none',
    },
    reportWrapper: {
      padding: 0,
      backgroundColor: 'white',
    },
  },
};
