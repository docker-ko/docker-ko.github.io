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
    const href = this.getAttribute('href') || '#';
    const title = this.getAttribute('title') || '';

    this.innerHTML = `
            <button type="button" class="not-prose my-4">
                <a href="${href}" class="cursor-pointer py-2 px-4 rounded bg-docker-primary hover:bg-docker-hover text-white!">
                    ${title}
                </a>
            </button>
        `;
  }
}

// 웹 컴포넌트 등록
customElements.define('button-component', ButtonComponent);
