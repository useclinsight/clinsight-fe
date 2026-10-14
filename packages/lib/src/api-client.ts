const DEFAULT_BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  'https://api.staging.useclinsight.com';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function resolveUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const baseUrl = DEFAULT_BACKEND_URL.replace(/\/$/, '');

  if (cleanPath.startsWith('/api/v1')) {
    return `${baseUrl}${cleanPath}`;
  }

  if (typeof window !== 'undefined') {
    return cleanPath;
  }

  const appBaseUrl = (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  ).replace(/\/$/, '');

  return `${appBaseUrl}${cleanPath}`;
}

async function getHeaders(customHeaders?: HeadersInit): Promise<Record<string, string>> {
  const mergedHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window === 'undefined') {
    try {
      // @ts-expect-error next/headers is provided at runtime in Next.js environment
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;
      const allCookies = cookieStore.toString();

      if (token) {
        mergedHeaders['Authorization'] = `Bearer ${token}`;
      }
      if (allCookies) {
        mergedHeaders['Cookie'] = allCookies;
      }
    } catch {
      // Outside Next request context
    }
  }

  if (customHeaders) {
    if (customHeaders instanceof Headers) {
      customHeaders.forEach((value, key) => {
        mergedHeaders[key] = value;
      });
    } else if (Array.isArray(customHeaders)) {
      customHeaders.forEach(([key, value]) => {
        mergedHeaders[key] = value;
      });
    } else {
      Object.assign(mergedHeaders, customHeaders);
    }
  }

  return mergedHeaders;
}

export const apiClient = {
  async request<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = resolveUrl(endpoint);
    const headers = await getHeaders(options.headers);
    const { body, ...restOptions } = options;

    const config: RequestInit = {
      ...restOptions,
      headers,
      cache: options.cache ?? 'no-store',
    };

    if (body !== undefined && body !== null) {
      config.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const response = await fetch(url, config);

    let data: unknown;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await response.json().catch(() => null);
    } else {
      data = await response.text().catch(() => null);
    }

    if (!response.ok) {
      const errorMsg =
        (data && typeof data === 'object' && ('message' in data || 'detail' in data)
          ? (data as Record<string, unknown>).detail || (data as Record<string, unknown>).message
          : null) || `HTTP error ${response.status}`;
      throw new ApiError(response.status, String(errorMsg), data);
    }

    return data as T;
  },

  async get<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  },

  async patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  },

  async put<T = unknown>(
    endpoint: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  },

  async delete<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
