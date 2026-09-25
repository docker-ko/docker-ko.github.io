import { getElement } from './utils/dom';

const createObserver = (headingMap: Record<string, HTMLLIElement>) => {
  return new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

      if (visibleEntry) {
        const id = (visibleEntry.target as HTMLElement).id;

        Object.entries(headingMap).forEach(([headingId, li]) => {
          if (headingId === id) {
            li.classList.add('border-l-2', 'border-blue-500');
          } else {
            li.classList.remove('border-l-2', 'border-blue-500');
          }
        });
      }
    },
    {
      rootMargin: '-60px 0px -60% 0px',
      threshold: 0.8,
    }
  );
};

/**
 * Table of Contents를 생성하고 표시합니다.
 *
 * 주의: 이 함수는 documentation 페이지에서만 호출되어야 합니다.
 * 호출 여부는 main.ts에서 결정합니다.
 */
export const initializeTableContents = (): void => {
  const content = getElement<HTMLElement>('content');
  const toc = getElement<HTMLElement>('toc');

  // 방어적 프로그래밍: 필수 요소 존재 확인
  if (!content || !toc) {
    console.warn('TOC 초기화 실패: content 또는 toc 요소를 찾을 수 없습니다.');
    return;
  }

  toc.innerHTML = '';

  const headings = content.querySelectorAll('h2, h3');

  // Early return: headings가 없으면 TOC를 생성하지 않음
  if (headings.length === 0) {
    return;
  }

  const tocTitle = document.createElement('p');
  const tocList = document.createElement('ul');

  tocTitle.classList.add('text-black', 'font-normal', 'text-lg', 'pb-5');
  tocTitle.textContent = 'Table of contents';

  const headingMap: Record<string, HTMLLIElement> = {};

  headings.forEach((heading, index) => {
    const listItem = document.createElement('li');
    listItem.classList.add(
      'max-w-64',
      'font-extralight',
      'hover:bg-gray-300',
      'hover:font-semibold',
      'cursor-pointer'
    );
    const link = document.createElement('button');
    link.classList.add(
      'flex',
      'justify-start',
      'items-stretch',
      'p-1',
      'cursor-pointer',
      'w-full',
      'truncate'
    );
    link.setAttribute('aria-label', heading.textContent || 'Heading Link');
    link.setAttribute('role', 'link');

    const headingText = heading.textContent || '';
    link.textContent =
      headingText.length > 30
        ? headingText.substring(0, 30) + '...'
        : headingText;

    // 클릭 시 해당 heading으로 스크롤 이동
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const headingRect = heading.getBoundingClientRect();
      const offsetTop = window.scrollY + headingRect.top - 60; // 60px 위로 조정

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    });

    listItem.appendChild(link);
    tocList.appendChild(listItem);

    if (heading.tagName === 'H3') {
      listItem.classList.add('pl-3');
    }

    const headingId = heading.id || `toc-heading-${index}`;
    heading.id = headingId;
    headingMap[headingId] = listItem;
  });

  toc.appendChild(tocTitle);
  toc.appendChild(tocList);

  const observer = createObserver(headingMap);
  headings.forEach((heading) => observer.observe(heading));
};
