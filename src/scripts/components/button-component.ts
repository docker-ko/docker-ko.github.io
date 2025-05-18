class ButtonComponent extends HTMLElement {
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
                <a href="${href}" class="cursor-pointer py-2 px-4 rounded bg-[#086dd7] text-white!">
                    ${title}
                </a>
            </button>
        `;
    }
}

customElements.define('button-component', ButtonComponent);