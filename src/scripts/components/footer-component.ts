class FooterComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <footer class="w-screen text-center py-4 bg-docker-primary text-white relative bottom-0">
        © 2025 Docker 한국어 문서 프로젝트 |
        <a href="https://github.com/docker-ko/docker-ko.github.io" class="hover:underline text-[#b0c4de]">GitHub</a>
      </footer>
    `;
  }
}

customElements.define('footer-component', FooterComponent);
