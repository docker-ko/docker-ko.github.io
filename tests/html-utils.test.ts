import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  escapeHtml,
  escapeHtmlAttribute,
  sanitizeUrl,
} from '../src/scripts/utils/html';
import {
  setupTestEnvironment,
  type TestEnvironment,
} from './helpers/test-environment';

let testEnv: TestEnvironment;

beforeAll(() => {
  testEnv = setupTestEnvironment();
});

afterAll(() => {
  testEnv.cleanup();
});

describe('html utils', () => {
  it('escapeHtml이 HTML 태그를 이스케이프함', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt;'
    );
  });

  it('escapeHtmlAttribute가 따옴표와 특수 문자를 이스케이프함', () => {
    expect(escapeHtmlAttribute('"test" & <tag>')).toBe(
      '&quot;test&quot; &amp; &lt;tag&gt;'
    );
  });

  it('sanitizeUrl이 안전한 내부 경로를 유지함', () => {
    expect(sanitizeUrl('/#/get-started')).toBe('/#/get-started');
    expect(sanitizeUrl('#/guides')).toBe('#/guides');
  });

  it('sanitizeUrl이 javascript 스킴을 차단함', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('#');
  });

  it('sanitizeUrl이 http/https URL은 허용함', () => {
    expect(sanitizeUrl('https://example.com/docs')).toBe(
      'https://example.com/docs'
    );
    expect(sanitizeUrl('http://example.com/docs')).toBe(
      'http://example.com/docs'
    );
  });
});
