interface NavItem {
  name: string;
  docs_path?: string;
  href_path: string;
  children?: Record<string, NavItem>;
}

interface GetStartedData {
  [key: string]: NavItem;
}

interface GuidesData {
  [key: string]: string[];
}

export default class NavComponent extends HTMLElement {
  private currentRoute: string = '';

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners(); // 이벤트 리스너 설정
  }

  private getCurrentRoute(): string {
    const hash = window.location.hash.slice(2); // #/ 제거
    return hash.split('/')[0] || 'get-started';
  }

  private async loadNavData(): Promise<GetStartedData | GuidesData> {
    this.currentRoute = this.getCurrentRoute();

    try {
      const response = await fetch(`/src/data/nav/${this.currentRoute}.json`);
      if (!response.ok) {
        throw new Error(
          `Failed to load navigation data for ${this.currentRoute}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading navigation data:', error);
      // 기본값으로 get-started 데이터 반환
      const fallbackResponse = await fetch('/src/data/nav/get-started.json');
      return await fallbackResponse.json();
    }
  }

  private isGetStartedData(
    data: GetStartedData | GuidesData
  ): data is GetStartedData {
    return (
      this.currentRoute === 'get-started' ||
      (Object.values(data)[0] &&
        typeof Object.values(data)[0] === 'object' &&
        !Array.isArray(Object.values(data)[0]))
    );
  }

  private generateGetStartedNav(data: GetStartedData): string {
    return Object.entries(data)
      .map(([, item]) => {
        if (item.children) {
          return this.generateSectionWithChildren(item);
        } else {
          return `
          <li class="rounded px-2 hover:text-blue-500 hover:dark:text-blue-500">
            <a class="block w-full truncate py-2" href="${item.href_path}">
              ${item.name}
            </a>
          </li>
        `;
        }
      })
      .join('');
  }

  private generateSectionWithChildren(item: NavItem): string {
    const childrenHtml = item.children
      ? Object.entries(item.children)
          .map(([, childItem]) => {
            if (childItem.children) {
              // 3단계 중첩 (예: docker-concepts/the-basics/what-is-a-container)
              return this.generateNestedSection(childItem);
            } else {
              return `
            <li class="rounded px-2 hover:text-blue-500 hover:dark:text-blue-500">
              <a class="block w-full truncate py-2" 
                 href="${childItem.href_path}" 
                 title="${childItem.name}">
                ${childItem.name}
              </a>
            </li>
          `;
            }
          })
          .join('')
      : '';

    return `
      <li class="w-70">
        <div class="flex w-full items-center justify-between rounded px-2" id="section__wrapper">
          <div class="w-full truncate py-2">
            ${
              item.href_path
                ? `<a class="block select-none hover:text-blue-500 hover:dark:text-blue-500" 
                 href="${item.href_path}">
                ${item.name}
              </a>`
                : `<span class="block select-none text-gray-700 dark:text-gray-300">
                ${item.name}
              </span>`
            }
          </div>
          <button class="inline-flex h-7 w-7 items-center justify-center rounded hover:cursor-pointer hover:bg-gray-400 hover:dark:bg-gray-400" aria-label="Toggle section" aria-expanded="false">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" height="12">
                <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/>
              </svg>
            </span>
            <span class="hidden">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" height="12">
                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 129.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
              </svg>
            </span>
          </button>
        </div>
        <ul class="ml-3 hidden">
          ${childrenHtml}
        </ul>
      </li>
    `;
  }

  private generateNestedSection(item: NavItem): string {
    const childrenHtml = item.children
      ? Object.entries(item.children)
          .map(
            ([, childItem]) => `
        <li class="rounded px-2 hover:text-blue-500 hover:dark:text-blue-500">
          <a class="block w-full truncate py-2" 
             href="${childItem.href_path}" 
             title="${childItem.name}">
            ${childItem.name}
          </a>
        </li>
      `
          )
          .join('')
      : '';

    return `
      <li>
        <div class="flex w-full items-center justify-between rounded px-2" id="section__wrapper">
          <div class="w-full truncate py-2">
            ${
              item.href_path
                ? `<a class="block select-none hover:text-blue-500 hover:dark:text-blue-500" 
                 href="${item.href_path}">
                ${item.name}
              </a>`
                : `<span class="block select-none text-gray-700 dark:text-gray-300">
                ${item.name}
              </span>`
            }
          </div>
          <button class="inline-flex h-7 w-7 items-center justify-center rounded hover:cursor-pointer hover:bg-gray-400 hover:dark:bg-gray-400"
                  aria-label="Toggle section" 
                  aria-expanded="false">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" height="12">
                <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/>
              </svg>
            </span>
            <span class="hidden">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" height="12">
                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 129.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
              </svg>
            </span>
          </button>
        </div>
        <ul class="ml-3 hidden">
          ${childrenHtml}
        </ul>
      </li>
    `;
  }

  private generateGuidesNav(data: GuidesData): string {
    return Object.entries(data)
      .map(
        ([category, items]) => `
      <li class="mb-2">
        <h3 class="mb-2 text-lg font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          ${category}
        </h3>
        <ul class="ml-0">
          ${items
            .map(
              (item) => `
            <li class="rounded px-2 hover:text-blue-500 hover:dark:text-blue-500">
              <div class="flex items-center py-2">
                <input type="checkbox" class="mr-2 rounded cursor-pointer" id="${category.toLowerCase()}-${item.toLowerCase().replace(/\s+/g, '-').replace(/[#+]/g, '')}">
                <label class="block w-full truncate cursor-pointer" for="${category.toLowerCase()}-${item.toLowerCase().replace(/\s+/g, '-').replace(/[#+]/g, '')}">
                  ${item}
                </label>
              </div>
            </li>
          `
            )
            .join('')}
        </ul>
      </li>
    `
      )
      .join('');
  }

  private setupEventListeners(): void {
    // 토글 버튼 이벤트 리스너 설정
    this.addEventListener('click', (event) => {
      const button = (event.target as Element).closest('button');
      if (button && button.getAttribute('aria-label') === 'Toggle section') {
        this.toggleSection(button as HTMLButtonElement);
      }
    });

    // 라우트 변경 감지
    window.addEventListener('hashchange', () => {
      const newRoute = this.getCurrentRoute();
      if (newRoute !== this.currentRoute) {
        this.render();
      }
    });
  }

  private toggleSection(button: HTMLButtonElement): void {
    const contentWrapperDiv = button.closest(
      '#section__wrapper'
    ) as HTMLDivElement;
    const ulElement = contentWrapperDiv?.parentElement?.querySelector(
      'ul.ml-3'
    ) as HTMLUListElement;

    if (ulElement) {
      ulElement.classList.toggle('hidden');
    }

    // 아이콘 토글
    const spans = button.querySelectorAll('span');
    spans.forEach((span) => {
      span.classList.toggle('hidden');
    });

    // aria-expanded 상태 변경
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', (!isExpanded).toString());
  }

  async render(): Promise<void> {
    try {
      const navData = await this.loadNavData();
      let navContent = '';

      if (this.isGetStartedData(navData)) {
        navContent = this.generateGetStartedNav(navData);
      } else {
        navContent = this.generateGuidesNav(navData);
      }

      this.innerHTML = `
        <div class="dark:bg-gray-dark-100 z-50 w-full p-4 md:block h-full">
          <div id="nav__content" class="flex flex-col font-light text-black md:text-base">
            <ul>
              ${navContent}
            </ul>
          </div>
        </div>
      `;
    } catch {
      this.innerHTML = `
        <div class="dark:bg-gray-dark-100 z-50 w-full p-4 md:block">
          <div class="text-black">네비게이션을 로드할 수 없습니다. 새로고침을 해보세요.</div>
        </div>
      `;
    }
  }
}

// 웹 컴포넌트 등록
customElements.define('nav-component', NavComponent);
