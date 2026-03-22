'use client';

import {
  HiCheckCircle,
  HiClock,
  HiExclamationTriangle,
  HiQuestionMarkCircle,
} from 'react-icons/hi2';

export default function OnboardingStatusBadge({ status, size = 'md' }) {
  const statusConfig = {
    Completed: {
      bgColor: '#d1fae5',
      textColor: '#065f46',
      icon: HiCheckCircle,
      label: 'Completed',
    },
    'In Progress': {
      bgColor: '#fef3c7',
      textColor: '#92400e',
      icon: HiClock,
      label: 'In Progress',
    },
    Failed: {
      bgColor: '#fee2e2',
      textColor: '#991b1b',
      icon: HiExclamationTriangle,
      label: 'Failed',
    },
    Pending: {
      bgColor: '#f3f4f6',
      textColor: '#374151',
      icon: HiQuestionMarkCircle,
      label: 'Pending',
    },
  };

  const config = statusConfig[status] || statusConfig.Pending;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses[size]}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
      }}
    >
      <Icon className={iconSize} />
      <span>{config.label}</span>
    </div>
  );
}
