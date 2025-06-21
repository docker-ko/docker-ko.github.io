import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import NavComponent from '../src/scripts/components/nav-component';

let dom: JSDOM;
let document: Document;
let navComponent: NavComponent;

beforeAll(async () => {
  dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
      <body>
        <nav-component></nav-component>
      </body>
    </html>
  `);

  // JSDOM 글로벌 환경 설정
  /* eslint-disable @typescript-eslint/no-explicit-any */
  (global as any).window = dom.window;
  (global as any).document = dom.window.document;
  (global as any).HTMLElement = dom.window.HTMLElement;
  (global as any).customElements = {
    define: vi.fn(),
    get: vi.fn(),
    whenDefined: vi.fn()
  };
  
  // fetch 모킹
  (global as any).fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      "get-started": {
        name: "Get started",
        href_path: "#/get-started",
        children: {
          "introduction": {
            name: "Introduction",
            href_path: "#/get-started/introduction",
            children: {
              "get-docker-desktop": {
                name: "Get Docker Desktop",
                href_path: "#/get-started/introduction/get-docker-desktop"
              }
            }
          }
        }
      }
    })
  });
});

beforeEach(() => {
  document = global.document;

  // 새로운 nav-component 인스턴스 생성
  navComponent = new NavComponent();
  document.body.innerHTML = '';
  document.body.appendChild(navComponent);
});

describe('NavComponent 초기화 확인', () => {
  it('NavComponent가 올바르게 렌더링되는지 확인', async () => {
    // Act
    await navComponent.render();
    
    // Assert
    expect(navComponent.innerHTML).toContain('nav__content');
    expect(navComponent.innerHTML).toContain('Get started');
  });

  it('toggle 버튼이 올바르게 렌더링되는지 확인', async () => {
    // Act
    await navComponent.render();
    const buttons = navComponent.querySelectorAll('button[aria-label="Toggle section"]');

    // Assert
    expect(buttons.length).toBeGreaterThan(0);
  });
});

describe('NavComponent 토글 기능 확인', () => {
  it('버튼 클릭 시 UL 요소의 hidden 클래스가 토글되는지 확인', async () => {
    // Arrange
    await navComponent.render();
    const button = navComponent.querySelector('button[aria-label="Toggle section"]') as HTMLButtonElement;
    const ulElement = button?.closest('li')?.querySelector('ul.ml-3') as HTMLUListElement;

    // Act
    if (button) {
      button.click();
    }

    // Assert
    expect(ulElement?.classList.contains('hidden')).toBe(false);
  });
});

describe('NavComponent Span 요소 토글 기능 확인', () => {
  it('버튼 클릭 시 span 요소들의 hidden 클래스가 토글되는지 확인', async () => {
    // Arrange
    await navComponent.render();
    const button = navComponent.querySelector('button[aria-label="Toggle section"]') as HTMLButtonElement;
    const spans = button?.querySelectorAll('span');

    // 초기 상태 확인
    const initialFirstHidden = spans?.[0].classList.contains('hidden');
    const initialSecondHidden = spans?.[1].classList.contains('hidden');

    // Act
    if (button) {
      button.click();
    }

    // Assert
    expect(spans?.[0].classList.contains('hidden')).toBe(!initialFirstHidden);
    expect(spans?.[1].classList.contains('hidden')).toBe(!initialSecondHidden);
  });

  it('aria-expanded 속성이 올바르게 토글되는지 확인', async () => {
    // Arrange
    await navComponent.render();
    const button = navComponent.querySelector('button[aria-label="Toggle section"]') as HTMLButtonElement;
    
    // 초기 상태 확인
    const initialExpanded = button?.getAttribute('aria-expanded') === 'true';

    // Act
    if (button) {
      button.click();
    }

    // Assert
    const finalExpanded = button?.getAttribute('aria-expanded') === 'true';
    expect(finalExpanded).toBe(!initialExpanded);
  });
});
