import type { RESTClient, RESTConfig, RequestConfig, IntegrationResponse } from './types';

export function createRESTClient(config: RESTConfig): RESTClient {
  const { baseUrl, defaultHeaders = {}, interceptors = {}, timeout = 30000 } = config;

  async function request<T>(requestConfig: RequestConfig): Promise<IntegrationResponse<T>> {
    let finalConfig = { ...requestConfig };

    // Apply request interceptors
    if (interceptors.request) {
      for (const interceptor of interceptors.request) {
        finalConfig = await interceptor(finalConfig);
      }
    }

    const url = buildUrl(baseUrl, finalConfig.url, finalConfig.params);
    const headers = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
      ...finalConfig.headers,
    };

    const fetchOptions: RequestInit = {
      method: finalConfig.method,
      headers,
      signal: AbortSignal.timeout(finalConfig.timeout || timeout),
    };

    if (finalConfig.data && finalConfig.method !== 'GET' && finalConfig.method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(finalConfig.data);
    }

    const response = await fetch(url, fetchOptions);

    let data: T;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = (await response.text()) as T;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    let result: IntegrationResponse<T> = {
      data,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      timestamp: Date.now(),
    };

    // Apply response interceptors
    if (interceptors.response) {
      for (const interceptor of interceptors.response) {
        result = await interceptor(result);
      }
    }

    return result;
  }

  function buildUrl(
    base: string,
    path: string,
    params?: Record<string, string | number | boolean>
  ): string {
    const url = new URL(path, base);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  return {
    async get<T>(url: string, config?: Partial<RequestConfig>): Promise<IntegrationResponse<T>> {
      return request<T>({
        method: 'GET',
        url,
        ...config,
      });
    },

    async post<T>(
      url: string,
      data?: unknown,
      config?: Partial<RequestConfig>
    ): Promise<IntegrationResponse<T>> {
      return request<T>({
        method: 'POST',
        url,
        data,
        ...config,
      });
    },

    async put<T>(
      url: string,
      data?: unknown,
      config?: Partial<RequestConfig>
    ): Promise<IntegrationResponse<T>> {
      return request<T>({
        method: 'PUT',
        url,
        data,
        ...config,
      });
    },

    async patch<T>(
      url: string,
      data?: unknown,
      config?: Partial<RequestConfig>
    ): Promise<IntegrationResponse<T>> {
      return request<T>({
        method: 'PATCH',
        url,
        data,
        ...config,
      });
    },

    async delete<T>(url: string, config?: Partial<RequestConfig>): Promise<IntegrationResponse<T>> {
      return request<T>({
        method: 'DELETE',
        url,
        ...config,
      });
    },

    request,
  };
}
