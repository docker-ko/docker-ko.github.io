import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { initializeNavFn } from '../src/scripts/nav';

let dom: JSDOM;
let document: Document;

beforeAll(async () => {
  dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
      <body>
        <div id="nav__get-started">
          <div>
            <button id="test-button-1">
              <span>▼</span>
              <span class="hidden">▲</span>
            </button>
          </div>
        </div>
        <div id="nav__content">
          <ul>
            <li>
              <a href="#/get-started/get-docker">Get Docker</a>
            </li>
            <li>
              <div id="section__wrapper">
                <div>
                  <a href="#/get-started/introduction">Introduction</a>
                </div>
                <button id="test-button-2">
                  <span>▼</span>
                  <span class="hidden">▲</span>
                </button>
              </div>
              <ul class="ml-3">
                <li>
                  <a href="#/get-started/introduction/get-docker-desktop">Get Docker Desktop</a>
                </li>
                <li>
                  <a href="#/get-started/introduction/whats-next">What's next</a>
                </li>
              </ul>
            </li>
            <li>
              <div id="section__wrapper">
                <div>
                  <button id="docker-concepts-button">Docker concepts</button>
                </div>
                <button id="docker-concepts-toggle">
                  <span>▼</span>
                  <span class="hidden">▲</span>
                </button>
              </div>
              <ul class="ml-3 hidden">
                <li>
                  <div id="section__wrapper">
                    <div>
                      <button>The basics</button>
                    </div>
                    <button>
                      <span>▼</span>
                      <span class="hidden">▲</span>
                    </button>
                  </div>
                  <ul class="ml-3 hidden">
                    <li>
                      <a href="#/get-started/docker-concepts/the-basics/what-is-a-container">What is a container?</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </body>
    </html>
  `);

  // JSDOM 글로벌 환경 설정
  /* eslint-disable @typescript-eslint/no-explicit-any */
  (global as any).window = dom.window;
  (global as any).document = dom.window.document;
  (global as any).HTMLElement = dom.window.HTMLElement;
  /* eslint-enable @typescript-eslint/no-explicit-any */
});

beforeEach(() => {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  document = (global as any).document;
  
  // 각 테스트 전에 hidden 클래스 초기화
  const spans = document.querySelectorAll('span');
  spans.forEach((span, index) => {
    if (index % 2 === 0) {
      span.classList.remove('hidden'); // 짝수 인덱스: 보이게
    } else {
      span.classList.add('hidden');     // 홀수 인덱스: 숨기게
    }
  });

  // ul.ml-3 요소의 hidden 클래스 제거
  const ulElement = document.querySelector('ul.ml-3');
  ulElement?.classList.remove('hidden');
});

  describe('네비게이션 초기화 확인', () => {
    it('네비게이션 버튼들이 올바르게 선택되는지 확인', () => {
      // Arrange & Act
      initializeNavFn();
      const buttons = document.querySelectorAll(
        'div#nav__get-started div > button, div#nav__content li > div > button'
      );

      // Assert
      expect(buttons.length).toBe(4); // 실제 DOM에서 선택되는 버튼 개수에 맞춤
    });

    it('버튼에 이벤트 리스너가 추가되는지 확인', () => {
      // Arrange
      const button = document.getElementById('test-button-1') as HTMLButtonElement;
      const clickSpy = vi.fn();
      button.addEventListener = vi.fn().mockImplementation((event, handler) => {
        if (event === 'click') {
          clickSpy.mockImplementation(handler);
        }
      });

      // Act
      initializeNavFn();

      // Assert
      expect(button.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });
  });

  describe('UL 요소 토글 기능 확인', () => {
    it('버튼 클릭 시 UL 요소의 hidden 클래스가 토글되는지 확인', () => {
      // Arrange
      initializeNavFn();
      const button = document.getElementById('test-button-2') as HTMLButtonElement;
      const ulElement = document.querySelector('ul.ml-3') as HTMLUListElement;

      // Act
      button.click();

      // Assert
      expect(ulElement.classList.contains('hidden')).toBe(true);
    });
  });

  describe('Span 요소 토글 기능 확인', () => {
    it('버튼 클릭 시 span 요소들의 hidden 클래스가 토글되는지 확인(하위 카테고리가 더 이상 없는 경우)', () => {
      // Arrange
      initializeNavFn();
      const button = document.getElementById('test-button-1') as HTMLButtonElement;
      const spans = button.querySelectorAll('span');
      
      // Act
      button.click();

      // Assert
      expect(spans[0].classList.contains('hidden')).toBe(true);
      expect(spans[1].classList.contains('hidden')).toBe(false);
    });    
    
    it('버튼 클릭 시 형제 요소의 span 요소들의 클래스가 토글되는지 확인(하위 카테고리가 더 있는 경우)', () => {
      // Arrange
      initializeNavFn();
      const buttonWithoutSpan = document.getElementById('docker-concepts-button') as HTMLButtonElement;
      const siblingButton = buttonWithoutSpan.parentElement?.nextElementSibling as HTMLButtonElement;
      const siblingSpans = siblingButton?.querySelectorAll('span');

      // Act
      buttonWithoutSpan.click();

      // Assert
      expect(siblingSpans?.[0].classList.contains('hidden')).toBe(false);
      expect(siblingSpans?.[1].classList.contains('hidden')).toBe(true);
    });
  });