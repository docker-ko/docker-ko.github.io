class BoxComponent extends HTMLElement {
    static get observedAttributes() {
        return ['img-src', 'href', 'title', 'description'];
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
        <article id="box-component">
            <a href="${href}">
                <div>
                    <div>
                        <img src="${imgSrc}" />
                        <p>${title}</p>
                    </div>
                    <div>${description}</div>
                </div>
            </a>
        </article>
        `;
    }
}

customElements.define('box-component', BoxComponent);