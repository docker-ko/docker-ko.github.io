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
            <button type="button">
                <a href="${href}">${title}</a>
            </button>
        `;
    }
}

customElements.define('button-component', ButtonComponent);