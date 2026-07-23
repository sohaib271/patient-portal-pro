const API=import.meta.env.VITE_API_URL;
import axios from 'axios';

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

const UNSAFE_METHODS = new Set(['post', 'put', 'patch', 'delete']);
let csrfToken: string | null = null;
let csrfRequest: Promise<string> | null = null;

async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;

  if (!csrfRequest) {
    csrfRequest = api
      .get<{ csrfToken: string }>('/auth/csrf')
      .then(({ data }) => {
        csrfToken = data.csrfToken;
        return data.csrfToken;
      })
      .finally(() => {
        csrfRequest = null;
      });
  }

  return csrfRequest;
}

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase() ?? 'get';
  if (UNSAFE_METHODS.has(method) && config.url !== '/auth/csrf') {
    config.headers.set('X-CSRF-Token', await getCsrfToken());
  }
  return config;
});

export function clearCsrfToken(): void {
  csrfToken = null;
}
