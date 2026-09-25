import { escapeHtml, escapeHtmlAttribute, sanitizeUrl } from '../utils/html';

class CardComponent extends HTMLElement {
  static get observedAttributes() {
    return ['imgsrc', 'href', 'title', 'description'];
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
    const imgSrc = this.getAttribute('imgsrc');
    const safeImgSrc = imgSrc
      ? escapeHtmlAttribute(sanitizeUrl(imgSrc, ''))
      : null;
    const href = escapeHtmlAttribute(
      sanitizeUrl(this.getAttribute('href') || '#')
    );
    const rawTitle = this.getAttribute('title') || '';
    const title = escapeHtml(rawTitle);
    const titleAttribute = escapeHtmlAttribute(rawTitle);
    const description = escapeHtml(this.getAttribute('description') || '');

    this.innerHTML = `
      <div class="card">
        <a href="${href}" class="card-link">
          ${
            safeImgSrc
              ? `<div class="card-icon">
               <img class="card-img" src="${safeImgSrc}" alt="${titleAttribute}" />
              </div>`
              : ''
          }
          <div class="card-content">
            <p class="card-description">
              <strong class="card-title">${title}</strong><br />
              ${description}
            </p>
          </div>
        </a>
      </div>
    `;
  }
}

customElements.define('card-component', CardComponent);
