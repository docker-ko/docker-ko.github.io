const createObserver = (headingMap: Record<string, HTMLLIElement>) => {
  return new IntersectionObserver((entries) => {
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
  });
};

export const initializeTableContents = () => {
  const content = document.getElementById('content') as HTMLElement;
  const toc = document.getElementById('toc') as HTMLElement;

  toc.innerHTML = '';

  const headings = content.querySelectorAll('h2, h3');
  if (headings.length === 0) return;

  const tocTitle = document.createElement('p');
  const tocList = document.createElement('ul');

  tocTitle.classList.add('text-black', 'font-light', 'text-lg', 'pb-5');
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
    link.setAttribute('role', 'link to move to that heading section');

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

    heading.id = `${index}`;
    headingMap[heading.id] = listItem;
  });

  toc.appendChild(tocTitle);
  toc.appendChild(tocList);

  const observer = createObserver(headingMap);
  headings.forEach((heading) => observer.observe(heading));
};
