const rawApiBaseUrl = import.meta.env.VITE_API_URL || '';

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, '');

export function buildApiUrl(path = '') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function parseJsonOrThrow(response, fallbackMessage) {
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();
  const isJson = contentType.includes('application/json');

  let payload = null;
  if (isJson && text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const serverMessage =
      payload && typeof payload === 'object'
        ? payload.error || payload.message
        : null;
    throw new Error(serverMessage || `${fallbackMessage} (${response.status})`);
  }

  if (!text) {
    return null;
  }

  if (!isJson) {
    throw new Error(
      `Expected JSON but received ${contentType || 'unknown content type'} from ${response.url}`
    );
  }

  if (payload !== null) {
    return payload;
  }

  throw new Error(`Invalid JSON response from ${response.url}`);
}
