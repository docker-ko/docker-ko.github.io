import { marked } from 'marked';

// marked 옵션 추가: HTML 허용
marked.setOptions({
  gfm: true,
  breaks: true
});

// box-component를 블록 태그로 처리하는 커스텀 토크나이저 추가
const blockTagNames = ['box-component'];
const blockTagRegex = new RegExp(
  `^<(${blockTagNames.join('|')})([\\s\\S]*?)>([\\s\\S]*?)<\\/\\1>`,
  'i'
);

const customBlockTokenizer = {
  name: 'custom-block-tag',
  level: "block", // 타입 오류 수정: 'block' → "block"
  start(src: string) {
    return src.match(blockTagRegex)?.index;
  },
  tokenizer(src: string) {
    const match = blockTagRegex.exec(src);
    if (match) {
      return {
        type: 'html',
        raw: match[0],
        text: match[0],
      };
    }
    return;
  },
} as const;

marked.use({ extensions: [customBlockTokenizer] });

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
