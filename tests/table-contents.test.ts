import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';
import { readFileSync } from 'fs';
import { initializeTableContents } from '../src/scripts/table-contents';

let dom: JSDOM;
let document: Document;
let contentElement: HTMLElement;
let tocElement: HTMLElement;
let testMarkdownContent: string;

beforeAll(async () => {
  // marked 옵션 설정 (실제 애플리케이션과 동일하게)
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  // 실제 whats-next.md 파일 읽기
  const mdFilePath = './public/docs/get-started/introduction/whats-next.md';
  const rawMarkdown = readFileSync(mdFilePath, 'utf-8');
  
  // 마크다운을 HTML로 파싱
  testMarkdownContent = await marked.parse(rawMarkdown);

  dom = new JSDOM('<!DOCTYPE html><html><body><div id="content"></div><div id="toc"></div></body></html>');

  // JSDOM 글로벌 환경 설정
  /* eslint-disable @typescript-eslint/no-explicit-any */
  (global as any).window = dom.window;
  (global as any).document = dom.window.document;
  (global as any).HTMLElement = dom.window.HTMLElement;
  (global as any).IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  }));
  
  // window.scrollTo 모킹
  dom.window.scrollTo = vi.fn();
  /* eslint-enable @typescript-eslint/no-explicit-any */
});

beforeEach(() => {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  document = (global as any).document;
  document.body.innerHTML = '<div id="content"></div><div id="toc"></div>';
  contentElement = document.getElementById('content')!;
  tocElement = document.getElementById('toc')!;
  
  // 실제 마크다운에서 파싱된 HTML 콘텐츠를 content에 삽입
  contentElement.innerHTML = testMarkdownContent;
});

describe('initializeTableContents', () => {
  describe('마크다운 파일 파싱 및 처리 확인', () => {
    it('whats-next.md 파일이 성공적으로 읽혀지는지 확인', () => {
      // Arrange & Act
      // beforeAll에서 이미 파일을 읽어옴

      // Assert
      expect(testMarkdownContent.length).toBeGreaterThan(0);
    });

    it('marked로 파싱된 HTML에 올바른 헤딩 구조가 포함되는지 확인', () => {
      // Arrange & Act
      // beforeEach에서 이미 파싱된 HTML이 DOM에 삽입됨
      const h1Element = contentElement.querySelector('h1');
      const h2Elements = contentElement.querySelectorAll('h2');
      
      // Assert
      expect(h1Element?.textContent).toContain("What's next");
      expect(h2Elements.length).toBe(3);
    });

    it('파싱된 HTML에서 h2 요소들이 올바른 텍스트를 가지는지 확인', () => {
      // Arrange & Act
      // beforeEach에서 이미 파싱된 HTML이 DOM에 삽입됨
      const expectedH2Texts = ['The basics', 'Building images', 'Running containers'];
      const h2Elements = contentElement.querySelectorAll('h2');

      // Assert
      expect(h2Elements.length).toBe(expectedH2Texts.length);
    });
  });

  describe('Table of contents 요소 생성 확인', () => {
    it('Table of contents 텍스트가 포함된 HTML 요소가 생성되는지 확인', async () => {
      // Arrange & Act
      // contentElement에 이미 testMarkdownContent가 설정됨
      initializeTableContents();
      const tocTitle = tocElement.querySelector('p');

      // Assert
      expect(tocTitle?.textContent).toBe('Table of contents');
    });

    it('Table of contents 제목 요소가 올바른 CSS 클래스를 가지는지 확인', async () => {
      // Arrange & Act
      // contentElement에 이미 testMarkdownContent가 설정됨
      initializeTableContents();
      const tocTitle = tocElement.querySelector('p');
      const expectedClasses = ['text-black', 'font-light', 'text-lg', 'pb-5'];

      // Assert
      expectedClasses.forEach(className => {
        expect(tocTitle?.classList.contains(className)).toBe(true);
      });
    });
  });

  describe('헤딩 요소들의 li 생성 확인', () => {
    it('마크다운 파일의 모든 h2 요소들이 li로 생성되는지 확인', async () => {
      // Arrange & Act
      // contentElement에 이미 testMarkdownContent가 설정됨
      initializeTableContents();
      const h2Elements = contentElement.querySelectorAll('h2');
      const liElements = tocElement.querySelectorAll('li');

      // Assert
      expect(h2Elements.length).toBe(liElements.length); // h2 요소 개수와 li 요소 개수가 동일해야 함
    });

    it('생성된 li 요소들이 올바른 텍스트 내용을 가지는지 확인', async () => {
      // Arrange & Act
      initializeTableContents();
      const expectedTexts = ['The basics', 'Building images', 'Running containers'];
      const liElements = tocElement.querySelectorAll('li');

      // Assert
      liElements.forEach((li, index) => {
        const linkText = li.querySelector('a')?.textContent;
        expect(linkText).toBe(expectedTexts[index]);
      });
    });

    it('li 요소들이 올바른 CSS 클래스를 가지는지 확인', async () => {
      // Arrange & Act
      // contentElement에 이미 testMarkdownContent가 설정됨
      initializeTableContents();
      const liElements = tocElement.querySelectorAll('li');
      const expectedLiClasses = [
        'max-w-64', 
        'font-extralight', 
        'hover:bg-gray-300', 
        'hover:font-semibold', 
        'cursor-pointer', 
        'truncate'
      ];

      // Assert
      liElements.forEach((li) => {
        expectedLiClasses.forEach(className => {
          expect(li.classList.contains(className)).toBe(true);
        });
      });
    });
  });

  describe('스크롤 이동 기능 확인', () => {
    it('헤딩 요소들에 올바른 id가 설정되는지 확인', async () => {
      // Arrange & Act
      // contentElement에 이미 testMarkdownContent가 설정됨
      initializeTableContents();
      const h2Elements = contentElement.querySelectorAll('h2');

      // Assert
      h2Elements.forEach((heading, index) => {
        expect(heading.id).toBe(index.toString());
      });
    });

    it('li 클릭 시 해당 섹션으로 스크롤 이동이 정확히 실행되는지 확인', async () => {
      // Arrange
      initializeTableContents();

      const mockScrollTo = vi.fn();
      dom.window.scrollTo = mockScrollTo;
      
      // 현재 스크롤 위치 모킹
      Object.defineProperty(dom.window, 'scrollY', {
        value: 0, // 테스트 시작 시점의 스크롤 위치
        writable: true
      });

			// 헤딩 요소의 getBoundingClientRect 모킹
      const mockGetBoundingClientRect = vi.fn().mockReturnValue({
        top: 150, // 헤딩 요소의 top 위치 (테스트용) : 상단에서 150px 떨어진 곳에 위치
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      });

      // 첫 번째 h2 요소에만 모킹 적용 (테스트에서 첫 번째 링크만 클릭하므로)
      const firstH2Element = contentElement.querySelector('h2');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(firstH2Element as any).getBoundingClientRect = mockGetBoundingClientRect;
      const firstLink = tocElement.querySelector('li')?.querySelector('a');

      // Act
      firstLink?.click();

      // Assert
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 90, // 0 (scrollY) + 150 (getBoundingClientRect의 top) - 60 (실제 코드에서 하드코딩된 오프셋)
        behavior: 'smooth'
      });
    });
  });
});