export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function hasUnsafeProtocol(value: string): boolean {
  const normalizedValue = value.trim().replace(/\s+/g, '').toLowerCase();
  const protocolCandidate = normalizedValue
    .replace(/^[#/]+/, '')
    .replace(/^(\.\/|\.\.\/)+/, '');

  return (
    protocolCandidate.startsWith('javascript:') ||
    protocolCandidate.startsWith('data:') ||
    protocolCandidate.startsWith('vbscript:')
  );
}

export function sanitizeUrl(value: string, fallback: string = '#'): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return fallback;
  }

  if (hasUnsafeProtocol(trimmedValue)) {
    return fallback;
  }

  if (
    trimmedValue.startsWith('#') ||
    trimmedValue.startsWith('/') ||
    trimmedValue.startsWith('./') ||
    trimmedValue.startsWith('../')
  ) {
    return trimmedValue;
  }

  try {
    const baseUrl = window.location.href.startsWith('http')
      ? window.location.href
      : 'https://docker-ko.github.io/';
    const parsedUrl = new URL(trimmedValue, baseUrl);
    if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
      return trimmedValue;
    }
  } catch {
    // Invalid URLs fall back to a safe value
  }

  return fallback;
}
