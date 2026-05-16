'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        router.push('/dashboard');
      } else {
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg animate-pulse">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-slate-950">
          Plan Generator
        </h2>
        <p className="text-slate-600">Loading...</p>
      </div>
    </div>
  );
}

// Made with Bob
