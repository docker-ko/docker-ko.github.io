import './components/index';
import '../styles/content_style.css';
import '../styles/style.css';
import './load_md';
import './components/card-component';
import { initializeMarkdownLoader } from './load_md';
import { initializeTableContents } from './table-contents';
import { initializeBreadcrumb } from './breadcrumb';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

// Application Insights 초기화
const appInsights = new ApplicationInsights({
  config: {
    connectionString:
      'InstrumentationKey=7bea0293-01dc-409c-9471-3a65567b11ed;IngestionEndpoint=https://koreacentral-0.in.applicationinsights.azure.com/;LiveEndpoint=https://koreacentral.livediagnostics.monitor.azure.com/;ApplicationId=ddbe985c-4d7a-41e4-80a8-a3961068933b',
    enableAutoRouteTracking: true, // SPA 라우팅 자동 추적
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: false, // 서버 응답 헤더 수집 불필요
    enableAjaxErrorStatusText: true,
    enableAjaxPerfTracking: true,
    enableUnhandledPromiseRejectionTracking: true,
    disableAjaxTracking: false,
    disableFetchTracking: false,
    loggingLevelConsole: 0, // 콘솔 로깅 비활성화
    loggingLevelTelemetry: 1,
    maxBatchSizeInBytes: 10000,
    maxBatchInterval: 15000,
    disableDataLossAnalysis: true,
    disableCorrelationHeaders: false,
    distributedTracingMode: 0, // 단일 서비스이므로 분산 추적 비활성화
    enablePerfMgr: false,
  },
});
appInsights.loadAppInsights();
appInsights.trackPageView(); // Manually call trackPageView to establish the current user/session/pageview

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initializeMarkdownLoader();
    initializeTableContents();
    await initializeBreadcrumb();
  } catch (error) {
    console.error('❌ main.ts: DOMContentLoaded : Markdown 로드 실패!', error);
    // 실제 다른 작업이 필요
  }
});

window.addEventListener('hashchange', async () => {
  try {
    await initializeMarkdownLoader();
    initializeTableContents();
    await initializeBreadcrumb();
    window.scrollTo(0, 0); // 페이지 이동 시 최상단으로 스크롤 이동
  } catch (error) {
    console.error('❌ main.ts: hashchange : Markdown 로드 실패!', error);
    // 실제 다른 작업이 필요
  }
});
