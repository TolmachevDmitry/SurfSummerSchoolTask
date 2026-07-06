import { env } from '../../app/env';
import { ApiError, ERROR_KINDS, fromResponse, networkError, serverError } from '../errors';

let tokenGetter = async () => null;
let onUnauthorizedCallback = () => {};

export function configureHttp({ getToken, handleUnauthorized } = {}) {
  if (typeof getToken === 'function') {
    tokenGetter = getToken;
  }
  if (typeof handleUnauthorized === 'function') {
    onUnauthorizedCallback = handleUnauthorized;
  }
}

export async function getToken() {
  try {
    return await tokenGetter();
  } catch {
    return null;
  }
}

function buildUrl(path, query) {
  const base = env.API_BASE_URL.replace(/\/+$/, '');
  const search =
    query && Object.keys(query).length > 0
      ? `?${new URLSearchParams(
          Object.fromEntries(
            Object.entries(query)
              .filter(([, v]) => v !== undefined && v !== null && v !== '')
              .map(([k, v]) => [k, String(v)]),
          ),
        ).toString()}`
      : '';
  return `${base}${path}${search}`;
}

async function parseBody(response) {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function request({
  method = 'GET',
  path,
  query,
  body,
  auth = true,
  validate,
  timeoutMs,
  signal,
}) {
  const headers = { Accept: 'application/json' };

  if (body !== undefined && body !== null) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = await getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  if (env.USE_MOCK) {
    const { mockHandle } = require('../../api/mock');
    try {
      return await mockHandle({ method, path, query, body, headers, validate });
    } catch (e) {
      if (e && e.status === 401) {
        onUnauthorizedCallback();
      }
      throw e;
    }
  }

  const url = buildUrl(path, query);

  const controller = new AbortController();
  const timeout = timeoutMs ?? env.REQUEST_TIMEOUT_MS;
  const timer = setTimeout(() => controller.abort(), timeout);
  const onParentAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', onParentAbort, { once: true });
    }
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined && body !== null ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    if (err && err.name === 'AbortError') {
      throw networkError();
    }
    throw networkError();
  } finally {
    clearTimeout(timer);
    if (signal) {
      signal.removeEventListener('abort', onParentAbort);
    }
  }

  const parsed = await parseBody(response);

  if (response.status === 401) {
    onUnauthorizedCallback();
  }

  if (!response.ok) {
    throw fromResponse(response.status, parsed);
  }

  if (validate) {
    const result = validate(parsed);
    if (result !== true && result && result.error) {
      throw new ApiError({
        status: response.status,
        kind: ERROR_KINDS.SERVER,
        message: 'Некорректный ответ сервера',
      });
    }
  }

  return parsed;
}

export const http = {
  request,
  get: (path, opts) => request({ ...opts, method: 'GET', path }),
  post: (path, body, opts) => request({ ...opts, method: 'POST', path, body }),
  patch: (path, body, opts) => request({ ...opts, method: 'PATCH', path, body }),
};

export { serverError };
