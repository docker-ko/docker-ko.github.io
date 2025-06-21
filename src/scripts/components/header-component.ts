class HeaderComponent extends HTMLElement {
  constructor() {
    super();
  }

  setupNavigationListeners() {
    // URL 해시 변경 감지
    window.addEventListener('hashchange', () => {
      const currentPath = window.location.hash.replace('#', '');
      const navItems = this.querySelectorAll('.nav-item');

      navItems.forEach((item) => {
        const itemPath = item.getAttribute('data-path');
        if (itemPath && currentPath.startsWith(itemPath)) {
          item.classList.remove('border-b-transparent');
          item.classList.add('border-b-white');
        } else {
          item.classList.remove('border-b-white');
          item.classList.add('border-b-transparent');
        }
      });
    });
  }

  connectedCallback() {
    this.innerHTML = `
      <header class="w-full sticky top-0 z-20 h-16 px-6 text-white bg-[#086dd7]">
            <div class="max-w-[1920px] mx-auto flex lg:gap-8 gap-2 h-full items-center justify-between">
                <div class="flex h-full items-center lg:gap-8 gap-2">
                    <div>
                        <a href="/" title="Docker korean translation home page">
                          <p class="w-full text-5xl font-bold text-white">
                            Docker <span class="text-red-500">K</span><span class="text-blue-800">O</span>
                          </p>
                        </a>
                    </div>
                    <nav class="mt-1 hidden md:block">
                        <ul class="flex text-sm md:text-base lg:gap-4">
                            <li class="nav-item border-b-4 border-transparent hover:border-white/20 cursor-pointer" data-path="/get-started">
                                <a class="block px-2 py-1 whitespace-nowrap" href="#/get-started">Get started</a>
                            </li>
                            <li class="nav-item border-b-4 border-transparent hover:border-white/20 cursor-pointer" data-path="/guides">
                                <a class="block px-2 py-1 whitespace-nowrap" href="#/guides">Guides</a>
                            </li>
                            <li class="nav-item border-b-4 border-transparent hover:border-white/20 cursor-pointer" data-path="/manuals">
                                <a class="block px-2 py-1 whitespace-nowrap" href="#/manuals">Manuals</a>
                            </li>
                            <li class="nav-item border-b-4 border-transparent hover:border-white/20 cursor-pointer" data-path="/reference">
                                <a class="block px-2 py-1 whitespace-nowrap" href="#/reference">Reference</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    `;

    this.setupNavigationListeners();
  }
}

customElements.define('header-component', HeaderComponent);
