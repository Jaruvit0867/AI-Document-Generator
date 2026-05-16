import React from 'react';
import Link from 'next/link';

interface AuthLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const AuthLink: React.FC<AuthLinkProps> = ({
  href,
  children,
  className = '',
}) => {
  return (
    <Link
      href={href}
      className={`
        text-accent hover:text-accent-hover
        font-medium transition-colors duration-200
        focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-accent/30
        ${className}
      `}
    >
      {children}
    </Link>
  );
};
