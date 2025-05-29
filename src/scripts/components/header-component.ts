class HeaderComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <header class="w-full sticky top-0 z-20 h-12 px-6 text-white bg-[#086dd7]">
            <div class="max-w-[1920px] mx-auto flex lg:gap-8 gap-2 h-full items-center justify-between">
                <div class="flex h-full items-center lg:gap-8 gap-2">
                    <div>
                        <a href="/" title="Docker korean translation home page">
                            <img
                                src="./imgs/logo/docker-logo-white.svg"
                                alt="Docker Korea home page"
                                width="120"
                                height="24"
                            />
                        </a>
                    </div>
                    <nav class="mt-1">
                        <ul class="flex text-sm md:text-base lg:gap-4">
                            <li class="border-b-4 border-transparent hover:border-white/20 cursor-pointer">
                                <a class="block px-2 py-1 whitespace-nowrap" href="#/get-started">Get started</a>
                            </li>
                            <li class="border-b-4 border-transparent hover:border-white/20 cursor-pointer">
                                <a class="block px-2 py-1 whitespace-nowrap" href="#/guides">Guides</a>
                            </li>
                            <li class="border-b-4 border-transparent hover:border-white/20 cursor-pointer">
                                <a class="block px-2 py-1 whitespace-nowrap" href="#/manuals">Manuals</a>
                            </li>
                            <li class="border-b-4 border-transparent hover:border-white/20 cursor-pointer">
                                <a class="block px-2 py-1 whitespace-nowrap" href="#/reference">Reference</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    `;
  }
}

customElements.define('header-component', HeaderComponent);
