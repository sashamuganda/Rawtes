import { githubFetch } from './github';

const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

export interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

export interface TokenResponse {
  access_token?: string;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
}

export async function startDeviceFlow(): Promise<DeviceCodeResponse> {
  const res = await fetch('https://github.com/login/device/code', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      scope: 'gist read:user',
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to start device flow');
  }

  return res.json();
}

export async function pollForToken(deviceCode: string): Promise<TokenResponse> {
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      device_code: deviceCode,
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    }),
  });

  if (!res.ok) {
    throw new Error('Polling failed');
  }

  return res.json();
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
}

export async function fetchUserProfile(): Promise<GitHubUser> {
  return githubFetch<GitHubUser>('/user');
}
