import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white shadow-sm shadow-accent/25 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_0_20px_-5px_rgba(124,58,237,0.4)] active:translate-y-0 active:bg-accent-hover focus:ring-accent/30',
  secondary: 'bg-border/50 text-ink hover:bg-border active:bg-border-strong focus:ring-border-strong',
  danger: 'bg-error text-white shadow-sm shadow-error/25 hover:bg-red-700 active:bg-red-800 focus:ring-error/30',
  ghost: 'bg-transparent text-ink-muted hover:bg-border/40 hover:text-ink active:bg-border focus:ring-border-strong',
  outline: 'bg-surface-raised border border-border text-ink shadow-sm shadow-black/[0.02] hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_0_15px_-5px_rgba(124,58,237,0.15)] active:translate-y-0 focus:ring-accent/30',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
