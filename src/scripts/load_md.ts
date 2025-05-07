import { marked } from 'marked';

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

    const htmlContent = marked.parse(mdText);
    document.getElementById('content')!.innerHTML = await htmlContent;
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
