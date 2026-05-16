import React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint">
            {icon}
          </div>
        )}
        <input
          className={`
            h-11 w-full rounded-xl border bg-surface-raised px-4 text-sm text-ink
            transition-all duration-200 placeholder:text-ink-faint
            focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10
            ${icon ? 'pl-11' : ''}
            ${error ? 'border-error ring-4 ring-error/10' : 'border-border'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
