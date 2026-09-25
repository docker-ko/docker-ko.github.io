import { escapeHtml, escapeHtmlAttribute, sanitizeUrl } from '../utils/html';

export default class ButtonComponent extends HTMLElement {
  static get observedAttributes() {
    return ['href', 'title'];
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

  render() {
    const href = escapeHtmlAttribute(
      sanitizeUrl(this.getAttribute('href') || '#')
    );
    const title = escapeHtml(this.getAttribute('title') || '');

    this.innerHTML = `
      <a
        href="${href}"
        class="not-prose my-4 inline-block cursor-pointer rounded bg-[#086dd7] px-4 py-2 text-white! hover:bg-[#2560ff]"
      >
        ${title}
      </a>
    `;
  }
}

// 웹 컴포넌트 등록
customElements.define('button-component', ButtonComponent);
