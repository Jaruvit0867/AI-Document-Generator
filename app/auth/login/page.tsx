'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthInput, AuthButton, AuthError, AuthLink } from '@/components/auth';
import api from '@/lib/api';
import { setToken } from '@/lib/auth';

const getErrorMessage = (err: unknown, fallback: string) => (
  err instanceof Error ? err.message : fallback
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.auth.login({ email, password });
      
      // Save token
      setToken(response.access_token);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError(getErrorMessage(err, 'Failed to login. Please check your credentials and try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back
        </h2>
        <p className="text-gray-600">
          Sign in to your account to continue
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <AuthError message={error} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          error={fieldErrors.email}
          autoComplete="email"
          required
          icon={
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          }
        />

        <AuthInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          error={fieldErrors.password}
          autoComplete="current-password"
          required
          icon={
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          }
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Remember me</span>
          </label>

          <AuthLink href="/auth/forgot-password" className="text-sm">
            Forgot password?
          </AuthLink>
        </div>

        <AuthButton type="submit" loading={loading}>
          Sign in
        </AuthButton>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <AuthLink href="/auth/register">Create one now</AuthLink>
        </p>
      </div>
    </div>
  );
}

// Made with Bob
