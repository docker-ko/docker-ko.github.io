class BoxComponent extends HTMLElement {
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
        const imgSrc = this.getAttribute('imgsrc') || '';
        const href = this.getAttribute('href') || '/';
        const title = this.getAttribute('title') || '';
        const description = this.getAttribute('description') || '';

        this.innerHTML = `
<div class="overflow-x-hidden shadow rounded bg-white mb-4 transition-all duration-200 hover:shadow hover:ring hover:ring-gray-200 hover:ring-1">
  <a href="${href}" class="no-underline decoration-none" style="text-decoration: none;">
    <div class="flex flex-col gap-2 p-4">
      <div class="flex gap-4 items-center">
        <img class="w-[32px]" src="${imgSrc}" alt="">
        <div class="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">${title}</div>
      </div>
      <div class="text-gray-600 dark:text-white font-normal" style="text-decoration: none;">${description}</div>
    </div>
  </a>
</div>
`;
    }
}

customElements.define('box-component', BoxComponent);