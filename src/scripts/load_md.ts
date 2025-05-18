import { marked } from 'marked';

/**
 * mdText를 웹 컴포넌트 태그(<box-component>, <button-component>, </box-component>, </button-component>) 기준으로 분할하여
 * 마크다운은 파싱해서, 웹 컴포넌트는 그대로 contentElement에 삽입하는 함수
 */
async function renderMarkdownWithComponents(mdText: string, contentElement: HTMLElement) {
  const tokens = mdText.split(/(<\/?box-component[^>]*>|<\/?button-component[^>]*>)/gi).filter(Boolean);

  for (const token of tokens) {
    // 웹 컴포넌트 태그인지 확인
    if (/^<\/?(box-component|button-component)[^>]*>$/.test(token)) {
      // 웹 컴포넌트 태그는 문자열 그대로 삽입
      contentElement.innerHTML += token;
    } else if (token.trim()) {
      // 마크다운 텍스트는 파싱해서 바로 innerHTML로 삽입
      const html = await marked.parse(token);
      contentElement.innerHTML += html;
    }
  }
}

async function loadMarkdown(page: string) {
  try {
    const response = await fetch(`/docs/${page}.md?cache=${Date.now()}`);
    if (!response.ok) throw new Error(`❌ 페이지를 찾을 수 없습니다: ${page}`);
    const mdText = await response.text();

    if (
      mdText.trim().startsWith('<!DOCTYPE html>') ||
      mdText.includes('<html>')
    ) {
      throw new Error(
        `❌ 요청된 경로가 Markdown이 아닌 HTML을 반환합니다: ${page}`
      );
    }

    const contentElement = document.getElementById('content')!;
    contentElement.innerHTML = '';
    await renderMarkdownWithComponents(mdText, contentElement);
  } catch (error) {
    document.getElementById('content')!.innerHTML = `
            <div id="not-found" class="w-full">
                <p>페이지를 찾을 수 없습니다.</p>
                <a href="#/home" class="back-home">홈으로 돌아가기</a>
            </div>
        `;
  }
}

export async function initializeMarkdownLoader() {
  let page = location.hash ? location.hash.substring(2) : 'home';

  await loadMarkdown(page);
}
