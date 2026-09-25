import { escapeHtml, escapeHtmlAttribute, sanitizeUrl } from '../utils/html';

/**
 * ContributorComponent
 * 기여자 프로필을 카드 형식으로 표시하는 Web Component
 * Pinterest 스타일의 모던한 디자인을 적용
 */
export default class ContributorComponent extends HTMLElement {
  static get observedAttributes() {
    return ['username', 'avatar', 'role'];
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
    const username = this.getAttribute('username');
    const avatar = this.getAttribute('avatar');
    const role = escapeHtml(this.getAttribute('role') || '기여자');

    // 빈 카드 모드 (username이 없으면 기여하기 카드)
    const isEmptyCard = !username;

    if (isEmptyCard) {
      this.innerHTML = `
        <a
          href="https://github.com/docker-ko/docker-ko.github.io?tab=readme-ov-file#%EC%B0%B8%EC%97%AC-%EB%B0%A9%EB%B2%95"
          target="_blank"
          rel="noopener noreferrer"
          class="group block w-full"
          aria-label="기여 가이드 보기"
        >
          <div class="
            relative
            overflow-hidden
            rounded-2xl
            border-2
            border-dashed
            border-gray-300
            bg-white
            p-4
            transition-all
            duration-300
            ease-out
            hover:border-blue-400
            hover:shadow-xl
            hover:-translate-y-1
            dark:border-gray-600
            dark:bg-gray-800
            dark:hover:border-blue-500
          ">
            <!-- 컨텐츠 -->
            <div class="relative flex flex-col items-center gap-3">
              <!-- + 아이콘 -->
              <div class="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-white
                ring-4
                ring-gray-200
                transition-all
                duration-300
                group-hover:ring-blue-300
                group-hover:scale-105
                dark:bg-gray-800
                dark:ring-gray-600
                dark:group-hover:ring-blue-600
              ">
                <svg
                  class="h-10 w-10 text-gray-400 transition-colors duration-300 group-hover:text-blue-500 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>

              <!-- 텍스트 -->
              <div class="flex flex-col items-center gap-1 text-center">
                <div class="
                  text-base
                  font-semibold
                  text-gray-700
                  transition-colors
                  duration-300
                  group-hover:text-blue-600
                  dark:text-gray-300
                  dark:group-hover:text-blue-400
                ">
                  기여하기
                </div>

                <span class="
                  inline-flex
                  items-center
                  rounded-full
                  bg-white
                  px-2.5
                  py-0.5
                  text-xs
                  font-medium
                  text-gray-600
                  transition-all
                  duration-300
                  group-hover:bg-blue-100
                  group-hover:text-blue-700
                  dark:bg-gray-700
                  dark:text-gray-300
                  dark:group-hover:bg-blue-900/50
                  dark:group-hover:text-blue-300
                ">
                  함께 만들어요
                </span>
              </div>
            </div>
          </div>
        </a>
      `;
    } else {
      const escapedUsername = escapeHtml(username);
      const usernameAttribute = escapeHtmlAttribute(username);
      const githubUrl = escapeHtmlAttribute(
        sanitizeUrl(`https://github.com/${username}`)
      );
      const avatarUrl = escapeHtmlAttribute(
        sanitizeUrl(
          avatar || 'https://avatars.githubusercontent.com/u/0?v=4',
          'https://avatars.githubusercontent.com/u/0?v=4'
        )
      );

      this.innerHTML = `
        <a
          href="${githubUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="group block w-full"
          aria-label="${usernameAttribute}의 GitHub 프로필 보기"
        >
          <div class="
            relative
            overflow-hidden
            rounded-2xl
            bg-white/80
            backdrop-blur-sm
            p-4
            shadow-sm
            transition-all
            duration-300
            ease-out
            hover:shadow-xl
            hover:-translate-y-1
            dark:bg-gray-800/80
          ">
            <!-- 배경 그라디언트 효과 -->
            <div class="
              absolute
              inset-0
              bg-gradient-to-br
              from-blue-50
              to-purple-50
              opacity-0
              transition-opacity
              duration-300
              group-hover:opacity-100
              dark:from-blue-900/20
              dark:to-purple-900/20
            "></div>

            <!-- 컨텐츠 -->
            <div class="relative flex flex-col items-center gap-3">
              <!-- 아바타 이미지 -->
              <div class="
                relative
                overflow-hidden
                rounded-full
                ring-4
                ring-gray-100
                transition-all
                duration-300
                group-hover:ring-blue-200
                group-hover:scale-105
                dark:ring-gray-700
                dark:group-hover:ring-blue-700
              ">
                <img
                  src="${avatarUrl}"
                  alt="${usernameAttribute}의 프로필 사진"
                  class="h-20 w-20 object-cover"
                  loading="lazy"
                />

                <!-- 호버 시 오버레이 효과 -->
                <div class="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-blue-600/20
                  to-transparent
                  opacity-0
                  transition-opacity
                  duration-300
                  group-hover:opacity-100
                "></div>
              </div>

              <!-- 사용자 정보 -->
              <div class="flex flex-col items-center gap-1 text-center">
                <div class="
                  text-base
                  font-semibold
                  text-gray-900
                  transition-colors
                  duration-300
                  group-hover:text-blue-600
                  dark:text-gray-100
                  dark:group-hover:text-blue-400
                ">
                  ${escapedUsername}
                </div>

                <span class="
                  inline-flex
                  items-center
                  rounded-full
                  bg-gray-100
                  px-2.5
                  py-0.5
                  text-xs
                  font-medium
                  text-gray-600
                  transition-all
                  duration-300
                  group-hover:bg-blue-100
                  group-hover:text-blue-700
                  dark:bg-gray-700
                  dark:text-gray-300
                  dark:group-hover:bg-blue-900/50
                  dark:group-hover:text-blue-300
                ">
                  ${role}
                </span>
              </div>
            </div>
          </div>
        </a>
      `;
    }
  }
}

// 웹 컴포넌트 등록
customElements.define('contributor-component', ContributorComponent);
