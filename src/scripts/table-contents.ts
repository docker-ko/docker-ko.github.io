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
  if (!content.querySelector('h1')) return;

  const tocTitle = document.createElement('p');
  const tocList = document.createElement('ul');
  const headings = content.querySelectorAll('h2, h3');

  tocTitle.classList.add('text-black', 'font-light', 'text-2xl', 'pb-5');
  tocTitle.textContent = 'Table of contents';

  const headingMap: Record<string, HTMLLIElement> = {};

  headings.forEach((heading, index) => {
    const listItem = document.createElement('li');
    listItem.classList.add(
      'max-w-64',
      'font-extralight',
      'hover:bg-gray-300',
      'hover:font-light',
      'cursor-pointer',
      'truncate'
    );
    const link = document.createElement('a');
    link.classList.add('flex', 'justify-start', 'items-stretch', 'p-1');
    link.textContent = heading.textContent || '';

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
