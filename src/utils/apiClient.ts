/**
 * API utility for handling requests to the backend
 * Uses VITE_API_URL environment variable if set, otherwise uses /api proxy
 */

const getApiUrl = (): string => {
  // In production (Cloudflare), use the environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // In development, use /api proxy
  return '/api';
};

export const apiClient = {
  async get(path: string, headers?: HeadersInit) {
    const url = `${getApiUrl()}${path}`;
    return fetch(url, { headers });
  },

  async post(path: string, body: any, headers?: HeadersInit) {
    const url = `${getApiUrl()}${path}`;
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });
  },

  async patch(path: string, body: any, headers?: HeadersInit) {
    const url = `${getApiUrl()}${path}`;
    return fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });
  },

  async delete(path: string, headers?: HeadersInit) {
    const url = `${getApiUrl()}${path}`;
    return fetch(url, { method: 'DELETE', headers });
  },
};
