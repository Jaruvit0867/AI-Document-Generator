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
        text-blue-600 hover:text-blue-700
        font-medium transition-colors duration-200
        focus:outline-none focus:underline
        ${className}
      `}
    >
      {children}
    </Link>
  );
};

// Made with Bob
