'use client';

import {
  HiCheckCircle,
  HiClock,
  HiXCircle,
  HiEllipsisHorizontalCircle,
} from 'react-icons/hi2';

export default function OnboardingProgressBar({ steps, compact = true }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in-progress':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      case 'pending':
      default:
        return '#d1d5db';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <HiCheckCircle className="h-4 w-4" />;
      case 'in-progress':
        return <HiClock className="h-4 w-4" />;
      case 'failed':
        return <HiXCircle className="h-4 w-4" />;
      case 'pending':
      default:
        return <HiEllipsisHorizontalCircle className="h-4 w-4" />;
    }
  };

  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const totalCount = steps.length;

  if (compact) {
    return (
      <div>
        <div className="flex gap-1 items-center mb-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex-1 h-2 rounded-full transition"
              style={{ backgroundColor: getStatusColor(step.status) }}
              title={step.name}
            ></div>
          ))}
        </div>
        <p className="text-xs text-gray-600 font-medium">
          {completedCount}/{totalCount} complete
        </p>
      </div>
    );
  }

  // Non-compact variant: step dots with labels
  return (
    <div className="relative">
      <div className="flex items-start justify-between relative">
        {/* Connection lines */}
        {steps.length > 1 && (
          <div className="absolute top-5 left-0 right-0 h-0.5 flex z-0">
            {steps.slice(0, -1).map((_, index) => {
              const stepWidth = 100 / (steps.length - 1);
              const isCompleted =
                steps[index].status === 'completed' &&
                steps[index + 1].status === 'completed';

              return (
                <div
                  key={`line-${index}`}
                  className="flex-1 h-0.5"
                  style={{
                    backgroundColor: isCompleted ? '#10b981' : '#e5e7eb',
                    position: 'relative',
                  }}
                ></div>
              );
            })}
          </div>
        )}

        {/* Step indicators */}
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative z-10">
            <div
              className="flex items-center justify-center h-10 w-10 rounded-full border-4 border-white text-white font-bold transition"
              style={{ backgroundColor: getStatusColor(step.status) }}
              title={step.name}
            >
              {getStatusIcon(step.status)}
            </div>
            <p className="text-xs text-gray-700 font-medium mt-2 text-center max-w-20 break-words">
              {step.name}
            </p>
          </div>
        ))}
      </div>

      {/* Progress text */}
      <div className="mt-8 text-center">
        <p className="text-sm font-semibold text-gray-900">
          {completedCount} of {totalCount} steps complete
        </p>
      </div>
    </div>
  );
}
