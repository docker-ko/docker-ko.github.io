import translations from '../data/breadcrumb.json';

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface TranslationData {
  breadcrumb: Record<string, string>;
}

/**
 * 경로 세그먼트를 번역합니다.
 * @param segment 번역할 세그먼트
 * @returns 번역된 텍스트 또는 원본 텍스트
 */
function translatePathSegment(segment: string): string {
  const translationData = translations as TranslationData;
  return translationData.breadcrumb[segment] || segment;
}

/**
 * 현재 hash를 기반으로 breadcrumb 아이템들을 생성합니다.
 */
function generateBreadcrumbItems(): BreadcrumbItem[] {
  const hash = window.location.hash.slice(1); // # 제거

  if (!hash || hash === '/') {
    return [{ name: '홈', path: '#/' }];
  }

  const pathSegments = hash.split('/').filter((segment) => segment !== '');
  const breadcrumbItems: BreadcrumbItem[] = [{ name: '홈', path: '#/' }];

  let currentPath = '';

  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;

    // 세그먼트 이름을 한국어로 변환
    const displayName = translatePathSegment(segment);

    breadcrumbItems.push({
      name: displayName,
      path: `#${currentPath}`,
    });
  });

  return breadcrumbItems;
}

/**
 * Breadcrumb HTML 요소를 생성합니다.
 */
function createBreadcrumbElement(items: BreadcrumbItem[]): HTMLElement {
  const breadcrumbNav = document.createElement('nav');
  breadcrumbNav.id = 'breadcrumbs';
  breadcrumbNav.className =
    'pb-3 flex min-w-0 items-center gap-2 text-gray-400 dark:text-gray-300';

  // HTML 문자열로 breadcrumb 구조 생성
  const breadcrumbHTML = items
    .map((item, index) => {
      const isLast = index === items.length - 1;

      if (isLast) {
        // 현재 페이지는 span으로 표시
        return `<span class="truncate">${item.name}</span>`;
      } else {
        // 이전 페이지들은 링크로 표시 + 구분자
        return `<a href="${item.path}" class="link truncate">${item.name}</a> / `;
      }
    })
    .join('');

  breadcrumbNav.innerHTML = breadcrumbHTML;
  return breadcrumbNav;
}

/**
 * 기존 breadcrumb을 제거합니다.
 */
function removePreviousBreadcrumb(): void {
  const existingBreadcrumb = document.getElementById('breadcrumbs');
  if (existingBreadcrumb) {
    existingBreadcrumb.remove();
  }
}

/**
 * Breadcrumb을 생성하고 div#content의 첫 번째 자식으로 추가합니다.
 */
export function initializeBreadcrumb(): void {
  const contentDiv = document.getElementById('content')!;

  // 기존 breadcrumb 제거
  removePreviousBreadcrumb();

  // 새 breadcrumb 생성
  const breadcrumbItems = generateBreadcrumbItems();
  const breadcrumbElement = createBreadcrumbElement(breadcrumbItems);

  // div#content의 첫 번째 자식으로 추가
  contentDiv.insertBefore(breadcrumbElement, contentDiv.firstChild);
}
