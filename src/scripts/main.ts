import './components/index';
import '../styles/content_style.css';
import '../styles/not_found.css';
import '../styles/style.css';
import './load_md';
import './components/card-component';
import { initializeMarkdownLoader } from './load_md';
import { initializeNavFn } from './nav';
import { initializeTableContents } from './table-contents';
import { initializeBreadcrumb } from './breadcrumb';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initializeMarkdownLoader();
    initializeNavFn();
    initializeTableContents();
    initializeBreadcrumb();
  } catch (error) {
    console.error('❌ main.ts: DOMContentLoaded : Markdown 로드 실패!', error);
    // 실제 다른 작업이 필요
  }
});

window.addEventListener('hashchange', async () => {
  try {
    await initializeMarkdownLoader();
    initializeTableContents();
    initializeBreadcrumb();
    window.scrollTo(0, 0); // 페이지 이동 시 최상단으로 스크롤 이동
  } catch (error) {
    console.error('❌ main.ts: hashchange : Markdown 로드 실패!', error);
    // 실제 다른 작업이 필요
  }
});
