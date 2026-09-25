import { escapeHtml, escapeHtmlAttribute, sanitizeUrl } from '../utils/html';

/**
 * HomeLinkCardComponent
 * 홈 화면에서 사용되는 링크 카드 Web Component
 * 아이콘 + 제목 + 설명을 포함한 클릭 가능한 카드
 */
export default class HomeLinkCardComponent extends HTMLElement {
  static get observedAttributes() {
    return ['href', 'icon', 'title', 'description'];
  }

  constructor() {
    super();
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  /**
   * 아이콘 이름에 따라 적절한 SVG를 반환
   * Material Icons 스타일 사용
   */
  private getIconSvg(iconName: string): string {
    const icons: Record<string, string> = {
      book: `
        <svg width="48" height="48" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M512-250q50-25 98-37.5T712-3e2q38 0 78.5 6t69.5 16v-429q-34-17-72-25t-76-8q-54 0-104.5 16.5T512-677v427zm-30 79q-8 0-14.5-1.5T456-178q-47-29-1e2-45t-108-16q-37 0-72 9t-70 22q-23 11-44.5-3T40-251v-463q0-15 7-27.5T68-761q42-20 87.5-29.5T248-8e2q63 0 122.5 17T482-731q51-35 109.5-52T712-8e2q47 0 92 9.5t87 29.5q14 7 21.5 19.5T920-714v463q0 28-22.5 42.5t-44.5.5q-34-14-69-22.5t-72-8.5q-54 0-106 16t-98 45q-5 4-11.5 5.5T482-171z"/>
        </svg>
      `,
      rocket: `
        <svg width="48" height="48" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M201-96q-15 6-28-3t-13-25v-193q0-20 9.5-38t26.5-29l65-44q5 83 20 146.5T328-146L201-96zm183-64q-9 0-16.5-6.5T355-184q-28-62-41.5-128T3e2-453q0-115 42-219t114-166q5-4 11-6t13-2 13 2 11 6q72 62 114 166t42 219q0 76-13.5 141.5T605-184q-5 11-12.5 17.5T576-160H384zm96-290q29 0 49.5-20.5T550-520t-20.5-49.5T480-590t-49.5 20.5T410-520t20.5 49.5T480-450zM759-96l-127-50q32-72 47-135.5T699-428l65 44q17 11 26.5 29t9.5 38v193q0 16-13 25t-28 3z"/>
        </svg>
      `,
      github: `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
      `,
      chat: `
        <svg width="48" height="48" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/>
        </svg>
      `,
    };

    return icons[iconName] || icons['rocket']; // 기본값: rocket
  }

  /**
   * 외부 링크 여부 확인
   */
  private isExternalLink(href: string): boolean {
    return href.startsWith('http://') || href.startsWith('https://');
  }

  render() {
    const safeHref = sanitizeUrl(this.getAttribute('href') || '#');
    const href = escapeHtmlAttribute(safeHref);
    const icon = this.getAttribute('icon') || 'rocket';
    const rawTitle = this.getAttribute('title') || '제목';
    const title = escapeHtml(rawTitle);
    const description = escapeHtml(this.getAttribute('description') || '설명');

    const isExternal = this.isExternalLink(safeHref);
    const externalAttrs = isExternal
      ? 'target="_blank" rel="noopener noreferrer"'
      : '';
    const ariaLabel = escapeHtmlAttribute(
      isExternal ? `${rawTitle} (새 창에서 열림)` : rawTitle
    );

    this.innerHTML = `
      <a
        href="${href}"
        ${externalAttrs}
        class="group block rounded-xl border border-[#007bff] bg-white/80 backdrop-blur-sm p-6 transition hover:scale-[1.02] hover:border-[#0056b3] dark:border-[#007bff] dark:bg-gray-900/80 dark:hover:border-[#0056b3]"
        aria-label="${ariaLabel}"
      >
        <div class="flex items-start gap-4">
          <div class="shrink-0 rounded-lg bg-blue-100 p-3 text-blue-500 dark:bg-gray-700 dark:text-blue-400">
            <span class="icon-svg">
              ${this.getIconSvg(icon)}
            </span>
          </div>
          <div class="flex flex-col items-start justify-start">
            <div class="mb-1 text-lg font-bold text-black dark:text-white">
              ${title}
            </div>
            <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              ${description}
            </p>
          </div>
        </div>
      </a>
    `;
  }
}

// 웹 컴포넌트 등록
customElements.define('home-link-card-component', HomeLinkCardComponent);
