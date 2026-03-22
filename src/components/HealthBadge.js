'use client';

import { useMemo } from 'react';

/**
 * HealthBadge - Displays a health score as a colored badge
 *
 * Props:
 *   - score: number (0-100) - The health score
 *   - size: "sm" | "md" | "lg" - Badge size (default: "md")
 *   - showLabel: boolean - Show "Healthy" / "At Risk" / "Critical" label (default: false)
 *   - className: string - Additional CSS classes
 */
export default function HealthBadge({
  score = 70,
  size = 'md',
  showLabel = false,
  className = '',
}) {
  const { color, label, bgColor } = useMemo(() => {
    let color, label, bgColor;

    if (score >= 70) {
      color = '#22c55e'; // Green
      label = 'Healthy';
      bgColor = '#dcfce7';
    } else if (score >= 40) {
      color = '#eab308'; // Yellow
      label = 'At Risk';
      bgColor = '#fef08a';
    } else {
      color = '#ef4444'; // Red
      label = 'Critical';
      bgColor = '#fee2e2';
    }

    return { color, label, bgColor };
  }, [score]);

  const sizeConfig = useMemo(() => {
    const configs = {
      sm: {
        radius: 24,
        fontSize: 12,
        width: 48,
        borderWidth: 2,
        labelSize: 10,
      },
      md: {
        radius: 40,
        fontSize: 18,
        width: 80,
        borderWidth: 3,
        labelSize: 12,
      },
      lg: {
        radius: 56,
        fontSize: 24,
        width: 112,
        borderWidth: 4,
        labelSize: 14,
      },
    };
    return configs[size] || configs.md;
  }, [size]);

  const circleStyle = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: sizeConfig.width,
    height: sizeConfig.width,
    borderRadius: '50%',
    background: bgColor,
    border: `${sizeConfig.borderWidth}px solid ${color}`,
    fontWeight: 'bold',
    fontSize: sizeConfig.fontSize,
    color: color,
    transition: 'all 0.3s ease',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  };

  const labelStyle = {
    fontSize: sizeConfig.labelSize,
    fontWeight: '500',
    color: color,
    whiteSpace: 'nowrap',
  };

  return (
    <div style={containerStyle} className={className}>
      <div style={circleStyle}>
        {Math.round(score)}
      </div>
      {showLabel && <div style={labelStyle}>{label}</div>}
    </div>
  );
}
