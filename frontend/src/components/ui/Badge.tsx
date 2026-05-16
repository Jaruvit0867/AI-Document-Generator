import React from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-border/50 text-ink-muted ring-border-strong',
  success: 'bg-success-soft text-success ring-success/30',
  warning: 'bg-warning-soft text-warning ring-warning/30',
  error: 'bg-error-soft text-error ring-error/30',
  info: 'bg-accent-soft text-accent ring-accent/30',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
