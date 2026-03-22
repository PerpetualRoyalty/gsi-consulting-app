import prisma from '@/lib/prisma';

/**
 * Calculates health score for a specific client based on 5 weighted signals
 * @param {string} clientId - The client user ID
 * @returns {Promise<Object>} Health score object with detailed breakdown
 */
export async function calculateClientHealth(clientId) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  try {
    // Fetch client data
    const client = await prisma.user.findUnique({
      where: { id: clientId },
      include: {
        agreements: true,
        payments: true,
        sentMessages: true,
        receivedMessages: true,
        sharedDocuments: true,
      },
    });

    if (!client) {
      throw new Error(`Client ${clientId} not found`);
    }

    // ===== SIGNAL 1: Payment Timeliness (30% weight) =====
    const paymentSignal = calculatePaymentSignal(client.payments, now);

    // ===== SIGNAL 2: Communication Engagement (25% weight) =====
    const communicationSignal = calculateCommunicationSignal(
      client.sentMessages,
      client.receivedMessages,
      thirtyDaysAgo,
      now
    );

    // ===== SIGNAL 3: Document Engagement (15% weight) =====
    const documentSignal = calculateDocumentSignal(
      client.sharedDocuments,
      thirtyDaysAgo
    );

    // ===== SIGNAL 4: Agreement Status (20% weight) =====
    const agreementSignal = calculateAgreementSignal(client.agreements);

    // ===== SIGNAL 5: Relationship Tenure (10% weight) =====
    const tenureSignal = calculateTenureSignal(client.createdAt);

    // ===== Calculate weighted overall score =====
    const overallScore = Math.round(
      paymentSignal.score * 0.3 +
        communicationSignal.score * 0.25 +
        documentSignal.score * 0.15 +
        agreementSignal.score * 0.2 +
        tenureSignal.score * 0.1
    );

    // ===== Determine grade and trend =====
    const grade = getHealthGrade(overallScore);
    const trend = calculateTrend(
      paymentSignal,
      communicationSignal,
      documentSignal,
      agreementSignal
    );

    // ===== Generate alerts =====
    const alerts = generateAlerts(
      clientId,
      client.name,
      paymentSignal,
      communicationSignal,
      documentSignal,
      agreementSignal
    );

    return {
      clientId,
      clientName: client.name,
      score: overallScore,
      grade,
      trend,
      signals: {
        payments: {
          score: paymentSignal.score,
          weight: 0.3,
          details: paymentSignal.details,
        },
        communication: {
          score: communicationSignal.score,
          weight: 0.25,
          details: communicationSignal.details,
        },
        documents: {
          score: documentSignal.score,
          weight: 0.15,
          details: documentSignal.details,
        },
        agreements: {
          score: agreementSignal.score,
          weight: 0.2,
          details: agreementSignal.details,
        },
        tenure: {
          score: tenureSignal.score,
          weight: 0.1,
          details: tenureSignal.details,
        },
      },
      alerts,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error(`Error calculating health for client ${clientId}:`, error);
    // Return baseline score for new/problematic clients
    return {
      clientId,
      score: 70,
      grade: 'YELLOW',
      trend: 'stable',
      signals: {
        payments: { score: 70, weight: 0.3, details: 'Insufficient data' },
        communication: { score: 70, weight: 0.25, details: 'Insufficient data' },
        documents: { score: 70, weight: 0.15, details: 'Insufficient data' },
        agreements: { score: 70, weight: 0.2, details: 'Insufficient data' },
        tenure: { score: 70, weight: 0.1, details: 'New relationship' },
      },
      alerts: [],
      lastUpdated: new Date(),
    };
  }
}

/**
 * Calculates health scores for ALL clients
 * @returns {Promise<Array>} Sorted array of health scores (by score descending)
 */
export async function calculateAllClientHealth() {
  try {
    const clients = await prisma.user.findMany({
      where: {
        role: 'CLIENT', // Assuming there's a role field distinguishing clients
      },
      select: { id: true },
    });

    const healthScores = await Promise.all(
      clients.map((client) => calculateClientHealth(client.id))
    );

    // Sort by score descending (healthiest first)
    return healthScores.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Error calculating health for all clients:', error);
    return [];
  }
}

/**
 * Determines health grade based on score
 * @param {number} score - Health score (0-100)
 * @returns {string} Grade: "GREEN" | "YELLOW" | "RED"
 */
export function getHealthGrade(score) {
  if (score >= 70) return 'GREEN';
  if (score >= 40) return 'YELLOW';
  return 'RED';
}

/**
 * Returns color for health grade
 * @param {string} grade - Health grade
 * @returns {string} Hex color code
 */
export function getHealthColor(grade) {
  const colors = {
    GREEN: '#22c55e',
    YELLOW: '#eab308',
    RED: '#ef4444',
  };
  return colors[grade] || '#6b7280';
}

// ===== HELPER FUNCTIONS =====

function calculatePaymentSignal(payments, now) {
  if (!payments || payments.length === 0) {
    return {
      score: 85,
      details: 'No payment history',
    };
  }

  // Only consider completed/failed/refunded payments
  const completedPayments = payments.filter(
    (p) =>
      p.status === 'COMPLETED' ||
      p.status === 'FAILED' ||
      p.status === 'REFUNDED'
  );

  if (completedPayments.length === 0) {
    return {
      score: 50,
      details: 'No completed payments',
    };
  }

  let onTimeCount = 0;
  let totalDaysLate = 0;
  let hasOverdue = false;

  for (const payment of completedPayments) {
    if (payment.dueDate && payment.paidAt) {
      const daysLate = Math.floor(
        (payment.paidAt.getTime() - payment.dueDate.getTime()) / (24 * 60 * 60 * 1000)
      );

      if (daysLate <= 0) {
        onTimeCount++;
      } else {
        totalDaysLate += daysLate;
      }
    }
  }

  // Check for pending/overdue payments
  const pendingPayments = payments.filter(
    (p) =>
      (p.status === 'PENDING' || p.status === 'PROCESSING') &&
      p.dueDate &&
      p.dueDate < now
  );
  if (pendingPayments.length > 0) {
    hasOverdue = true;
  }

  const onTimeRatio = onTimeCount / completedPayments.length;
  let score = Math.round(onTimeRatio * 100);

  // Penalty for average days late
  if (totalDaysLate > 0) {
    const avgDaysLate = totalDaysLate / (completedPayments.length - onTimeCount);
    score = Math.max(0, score - Math.round(avgDaysLate));
  }

  // Major penalty for overdue
  if (hasOverdue) {
    score = Math.max(0, score - 30);
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    details: `${onTimeCount}/${completedPayments.length} on-time payments${
      hasOverdue ? ', overdue payment(s)' : ''
    }`,
  };
}

function calculateCommunicationSignal(
  sentMessages,
  receivedMessages,
  thirtyDaysAgo,
  now
) {
  const recentSentMessages = sentMessages.filter(
    (m) => m.createdAt >= thirtyDaysAgo
  );
  const recentReceivedMessages = receivedMessages.filter(
    (m) => m.createdAt >= thirtyDaysAgo
  );

  const totalRecentMessages = recentSentMessages.length + recentReceivedMessages.length;
  const weeks = 4.29; // 30 days / 7
  const messagesPerWeek = Math.round(totalRecentMessages / weeks);

  // Calculate response pattern
  let avgResponseTime = 0;
  if (recentReceivedMessages.length > 0 && recentSentMessages.length > 0) {
    // Simple: estimate response time based on message spacing
    avgResponseTime = Math.round(
      recentSentMessages.reduce((sum, m) => sum + (m.createdAt?.getTime() || 0), 0) /
        Math.max(1, recentSentMessages.length) -
        recentReceivedMessages.reduce((sum, m) => sum + (m.createdAt?.getTime() || 0), 0) /
          Math.max(1, recentReceivedMessages.length)
    ) / (24 * 60 * 60 * 1000); // Convert to days
  }

  // Count unread messages
  const unreadCount = recentReceivedMessages.filter((m) => !m.isRead).length;

  let score = 100;

  // Scoring based on message frequency
  if (messagesPerWeek === 0) {
    score = 20; // Very inactive
  } else if (messagesPerWeek < 1) {
    score = 50; // Infrequent
  } else if (messagesPerWeek < 2) {
    score = 75; // Moderate
  }
  // else score remains 100 (active)

  // Penalty for unread messages
  score = Math.max(0, score - unreadCount * 10);

  // Penalty for slow response
  if (avgResponseTime > 3) {
    score = Math.max(0, score - 15);
  } else if (avgResponseTime > 1) {
    score = Math.max(0, score - 10);
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    details: `${totalRecentMessages} messages (${messagesPerWeek}/week), ${unreadCount} unread`,
  };
}

function calculateDocumentSignal(sharedDocuments, thirtyDaysAgo) {
  if (!sharedDocuments || sharedDocuments.length === 0) {
    return {
      score: 50,
      details: 'No document sharing',
    };
  }

  // Count recent vs older documents
  const recentDocs = sharedDocuments.filter(
    (d) => d.createdAt >= thirtyDaysAgo
  ).length;
  const totalDocs = sharedDocuments.length;

  let score = 60;

  // Boost for active document engagement
  if (recentDocs > 0) {
    score = Math.min(100, 60 + recentDocs * 10);
  }

  // Simple engagement ratio (assume viewing is proportional to sharing)
  const engagementRatio = Math.min(1, recentDocs / Math.max(1, totalDocs));
  score = Math.round(score * engagementRatio);

  return {
    score: Math.min(100, Math.max(0, score)),
    details: `${totalDocs} documents, ${recentDocs} recent (30 days)`,
  };
}

function calculateAgreementSignal(agreements) {
  if (!agreements || agreements.length === 0) {
    return {
      score: 30,
      details: 'No active agreements',
    };
  }

  const activeAgreements = agreements.filter(
    (a) => a.status === 'ACTIVE' || a.status === 'SIGNED'
  ).length;
  const pendingAgreements = agreements.filter(
    (a) => a.status === 'PENDING' || a.status === 'DRAFT'
  ).length;
  const totalAgreements = agreements.length;

  let score = 50;

  if (activeAgreements > 0) {
    score = Math.round((activeAgreements / totalAgreements) * 100);
  }

  // Penalty for pending agreements
  if (pendingAgreements > 0) {
    score = Math.max(0, score - pendingAgreements * 20);
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    details: `${activeAgreements}/${totalAgreements} active agreements, ${pendingAgreements} pending`,
  };
}

function calculateTenureSignal(createdAt) {
  const now = new Date();
  const ageMs = now.getTime() - createdAt.getTime();
  const ageDays = ageMs / (24 * 60 * 60 * 1000);
  const ageMonths = ageDays / 30;

  let score = 70; // New clients start at baseline 70

  if (ageMonths < 1) {
    score = 70;
  } else if (ageMonths < 6) {
    score = 75;
  } else if (ageMonths < 12) {
    score = 80;
  } else if (ageMonths < 24) {
    score = 85;
  } else {
    score = 90;
  }

  return {
    score,
    details: `${Math.round(ageMonths)} months in relationship`,
  };
}

function calculateTrend(
  paymentSignal,
  communicationSignal,
  documentSignal,
  agreementSignal
) {
  // Simple trend calculation based on signal scores
  // In production, you'd compare against historical data
  const avgScore =
    (paymentSignal.score +
      communicationSignal.score +
      documentSignal.score +
      agreementSignal.score) /
    4;

  if (avgScore >= 75) {
    return 'improving';
  } else if (avgScore >= 50) {
    return 'stable';
  } else {
    return 'declining';
  }
}

function generateAlerts(
  clientId,
  clientName,
  paymentSignal,
  communicationSignal,
  documentSignal,
  agreementSignal
) {
  const alerts = [];

  // Payment alerts
  if (paymentSignal.score < 40) {
    alerts.push({
      type: 'CRITICAL',
      message: 'Multiple overdue or late payments',
      severity: 'RED',
    });
  } else if (paymentSignal.score < 70) {
    alerts.push({
      type: 'WARNING',
      message: 'Inconsistent payment history',
      severity: 'YELLOW',
    });
  }

  // Communication alerts
  if (communicationSignal.score < 40) {
    alerts.push({
      type: 'CRITICAL',
      message: 'No communication in 30+ days',
      severity: 'RED',
    });
  } else if (communicationSignal.score < 70) {
    alerts.push({
      type: 'WARNING',
      message: 'Infrequent communication',
      severity: 'YELLOW',
    });
  }

  // Document alerts
  if (documentSignal.score < 40) {
    alerts.push({
      type: 'INFO',
      message: 'Low document engagement',
      severity: 'YELLOW',
    });
  }

  // Agreement alerts
  if (agreementSignal.score < 40) {
    alerts.push({
      type: 'CRITICAL',
      message: 'No active agreements',
      severity: 'RED',
    });
  } else if (agreementSignal.score < 70) {
    alerts.push({
      type: 'WARNING',
      message: 'Pending agreements await signature',
      severity: 'YELLOW',
    });
  }

  return alerts;
}
