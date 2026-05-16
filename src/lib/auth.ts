// ============================================================================
// Authentication Helper Functions
// ============================================================================
// Manages JWT token storage and authentication state in localStorage

const TOKEN_KEY = 'auth_token';

interface JWTPayload {
  sub?: string;
  exp?: number;
  [key: string]: unknown;
}

/**
 * Get the JWT token from localStorage
 * @returns The JWT token string or null if not found
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Save the JWT token to localStorage
 * @param token - The JWT token string to save
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove the JWT token from localStorage
 */
export function clearToken(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Check if user is authenticated (has a valid token)
 * Note: This only checks if a token exists, not if it's valid or expired
 * @returns true if token exists, false otherwise
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * Parse JWT token to extract payload (without verification)
 * WARNING: This does not verify the token signature
 * @param token - The JWT token to parse
 * @returns The decoded payload or null if invalid
 */
export function parseJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 * @param token - The JWT token to check
 * @returns true if token is expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  const payload = parseJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }
  
  // JWT exp is in seconds, Date.now() is in milliseconds
  const expirationTime = payload.exp * 1000;
  return Date.now() >= expirationTime;
}

/**
 * Get user information from the stored token
 * @returns User info from token payload or null
 */
export function getUserFromToken(): { sub: string; exp: number } | null {
  const token = getToken();
  if (!token) {
    return null;
  }
  
  const payload = parseJWT(token);
  if (!payload || typeof payload.sub !== 'string' || typeof payload.exp !== 'number') {
    return null;
  }

  return { sub: payload.sub, exp: payload.exp };
}

// Made with Bob
