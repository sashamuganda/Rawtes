export const GITHUB_API = 'https://api.github.com';
export const GIST_DESCRIPTION = 'Rawtes Data — Do Not Delete';
export const GIST_FILENAME = 'Rawtes.json';

export class GitHubAPIError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'GitHubAPIError';
  }
}

export class RateLimitError extends Error {
  resetTime: number;
  constructor(resetTime: number) {
    super(`Rate limit reached. Resets at ${new Date(resetTime).toLocaleTimeString()}`);
    this.resetTime = resetTime;
    this.name = 'RateLimitError';
  }
}

import { deobfuscateToken } from './crypto';

function getStoredToken(): string | null {
  const token = localStorage.getItem('nk_token');
  if (!token) return null;
  return deobfuscateToken(token);
}

export function clearToken() {
  localStorage.removeItem('nk_token');
}

export interface RateLimitInfo {
  remaining: number;
  reset: number;
}

let lastRateLimit: RateLimitInfo = { remaining: 5000, reset: 0 };

export function getLastRateLimit() {
  return lastRateLimit;
}

export async function githubFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/vnd.github+json');
  headers.set('X-GitHub-Api-Version', '2022-11-28');
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers,
  });

  // Track rate limits
  const remaining = res.headers.get('X-RateLimit-Remaining');
  const reset = res.headers.get('X-RateLimit-Reset');
  if (remaining && reset) {
    lastRateLimit = {
      remaining: parseInt(remaining, 10),
      reset: parseInt(reset, 10) * 1000,
    };
  }

  if (res.status === 401) {
    clearToken();
    throw new GitHubAPIError(401, 'Unauthorized');
  }

  if (res.status === 403 && lastRateLimit.remaining === 0) {
    throw new RateLimitError(lastRateLimit.reset);
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new GitHubAPIError(res.status, errorData.message || 'API error');
  }

  return res.json() as Promise<T>;
}
