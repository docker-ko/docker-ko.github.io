import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import { renderMarkdownWithComponents } from '../src/scripts/load_md';

let dom: JSDOM;
let document: Document;
let contentElement: HTMLElement;

beforeAll(() => {
  dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');

  // JSDOM 글로벌 환경 설정
  /* eslint-disable @typescript-eslint/no-explicit-any */
  (global as any).window = dom.window;
  (global as any).document = dom.window.document;
  (global as any).HTMLElement = dom.window.HTMLElement;
  (global as any).customElements = dom.window.customElements;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  class BoxComponent extends dom.window.HTMLElement {
    connectedCallback() {
      const title = this.getAttribute('title') || 'Box Title';
      const description = this.getAttribute('description') || 'Box content';
      const imgsrc = this.getAttribute('imgsrc') || '';
      const href = this.getAttribute('href') || '/';

      this.innerHTML = `
        <div class="overflow-x-hidden shadow rounded bg-white mb-4 transition-all duration-200 hover:shadow hover:ring hover:ring-gray-200">
          <a href="${href}" class="no-underline decoration-none" style="text-decoration: none;">
            <div class="flex flex-col gap-2 p-4">
              <div class="flex gap-4 items-center">
                <img class="w-[32px]" src="${imgsrc}" alt="">
                <div class="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">${title}</div>
              </div>
              <div class="text-gray-600 dark:text-white font-normal" style="text-decoration: none;">${description}</div>
            </div>
          </a>
        </div>
      `;
    }
  }

  class ButtonComponent extends dom.window.HTMLElement {
    connectedCallback() {
      const title = this.getAttribute('title') || 'Button';
      const href = this.getAttribute('href') || '#';

      this.innerHTML = `
        <button type="button" class="not-prose my-4">
          <a href="${href}" class="cursor-pointer py-2 px-4 rounded bg-[#086dd7] hover:bg-[#2560ff] text-white!">
            ${title}
          </a>
        </button>
      `;
    }
  }

  dom.window.customElements.define('box-component', BoxComponent);
  dom.window.customElements.define('button-component', ButtonComponent);
});

beforeEach(() => {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  document = (global as any).document;
  document.body.innerHTML = '<div id="content"></div>';
  contentElement = document.getElementById('content')!;
});

describe('renderMarkdownWithComponents', () => {
  describe('웹 컴포넌트 존재 확인', () => {
    it('단일 box-component가 DOM에 존재하는지 확인', async () => {
      // Arrange
      const mdText = '<box-component title="Docker 개요" description="Docker의 기본 개념" imgsrc="/imgs/docker.svg" href="/overview"></box-component>';

      // Act
      await renderMarkdownWithComponents(mdText, contentElement);
      await new Promise(resolve => setTimeout(resolve, 10));

      // Assert
      const boxComponent = contentElement.querySelector('box-component');
      expect(boxComponent).toBeTruthy();
      expect(boxComponent?.tagName.toLowerCase()).toBe('box-component');
    });

    it('단일 button-component가 DOM에 존재하는지 확인', async () => {
      // Arrange
      const mdText = '<button-component title="시작하기" href="/get-started"></button-component>';

      // Act
      await renderMarkdownWithComponents(mdText, contentElement);
      await new Promise(resolve => setTimeout(resolve, 10));

      // Assert
      const buttonComponent = contentElement.querySelector('button-component');
      expect(buttonComponent).toBeTruthy();
      expect(buttonComponent?.tagName.toLowerCase()).toBe('button-component');
    });

    it('box-component와 button-component가 모두 DOM에 존재하는지 확인', async () => {
      // Arrange
      const mdText = `
        <box-component title="Docker 개요" description="Docker의 기본 개념" imgsrc="/imgs/docker.svg" href="/overview"></box-component>
        <button-component title="시작하기" href="/get-started"></button-component>
      `;

      // Act
      await renderMarkdownWithComponents(mdText, contentElement);
      await new Promise(resolve => setTimeout(resolve, 10));

      // Assert
      const boxComponent = contentElement.querySelector('box-component');
      const buttonComponent = contentElement.querySelector('button-component');
      
      expect(boxComponent).toBeTruthy();
      expect(buttonComponent).toBeTruthy();
      expect(contentElement.querySelectorAll('box-component, button-component').length).toBe(2);
    });
  });

  describe('HTML 내용 검증', () => {
    it('box-component의 HTML 내용이 올바르게 렌더링되는지 확인', async () => {
      // Arrange
      const title = 'Docker 개요';
      const description = 'Docker의 기본 개념';
      const mdText = `<box-component title="${title}" description="${description}" imgsrc="/imgs/docker.svg" href="/overview"></box-component>`;

      // Act
      await renderMarkdownWithComponents(mdText, contentElement);
      await new Promise(resolve => setTimeout(resolve, 10));

      // Assert
      const boxComponent = contentElement.querySelector('box-component');
      const innerHTML = boxComponent?.innerHTML || '';
      
      expect(innerHTML).toContain(title);
      expect(innerHTML).toContain(description);
      expect(innerHTML).toContain('shadow rounded bg-white');
      expect(innerHTML).toContain('href="/overview"');
    });

    it('button-component의 HTML 내용이 올바르게 렌더링되는지 확인', async () => {
      // Arrange
      const title = '시작하기';
      const href = '/get-started';
      const mdText = `<button-component title="${title}" href="${href}"></button-component>`;

      // Act
      await renderMarkdownWithComponents(mdText, contentElement);
      await new Promise(resolve => setTimeout(resolve, 10));

      // Assert
      const buttonComponent = contentElement.querySelector('button-component');
      const innerHTML = buttonComponent?.innerHTML || '';
      
      expect(innerHTML).toContain(title);
      expect(innerHTML).toContain(`href="${href}"`);
      expect(innerHTML).toContain('bg-[#086dd7]');
      expect(innerHTML).toContain('button type="button"');
    });

    it('혼합된 컴포넌트들의 HTML 내용이 모두 올바르게 렌더링되는지 확인', async () => {
      // Arrange
      const boxTitle = 'Docker 개요';
      const boxDescription = 'Docker의 기본 개념';
      const buttonTitle = '시작하기';
      const mdText = `
        <box-component title="${boxTitle}" description="${boxDescription}" imgsrc="/imgs/docker.svg" href="/overview"></box-component>
        <button-component title="${buttonTitle}" href="/get-started"></button-component>
      `;

      // Act
      await renderMarkdownWithComponents(mdText, contentElement);
      await new Promise(resolve => setTimeout(resolve, 10));

      // Assert
      const boxComponent = contentElement.querySelector('box-component');
      const buttonComponent = contentElement.querySelector('button-component');
      
      expect(boxComponent?.innerHTML).toContain(boxTitle);
      expect(boxComponent?.innerHTML).toContain(boxDescription);
      expect(buttonComponent?.innerHTML).toContain(buttonTitle);
      
      const allContent = contentElement.innerHTML;
      expect(allContent).toContain(boxTitle);
      expect(allContent).toContain(boxDescription);
      expect(allContent).toContain(buttonTitle);
    });
  });
});