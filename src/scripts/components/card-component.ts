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
    const imgSrc = this.getAttribute('imgsrc'); // 없으면 null
    const href = this.getAttribute('href') || '#';
    const title = this.getAttribute('title') || '';
    const description = this.getAttribute('description') || '';

    this.innerHTML = `
  <div class="card">
    <a href="${href}" class="card-link">
      ${imgSrc
        ? `<div class="card-icon">
             <img class="card-img" src="${imgSrc}" alt="${title}" />
           </div>`
        : ''
      }
      <div class="card-content">
        <p class="card-description">
          <strong class="card-title">${title}</strong><br>
          ${description}
        </p>
      </div>
    </a>
  </div>
`;


  }
}

customElements.define('card-component', CardComponent);
