# 트러블슈팅: home.md 페이지 렌더링 문제

## 문제 상황

### 1. 중첩된 HTML div가 텍스트로 표시됨

home.md 파일에 복잡한 HTML 구조(중첩된 div, Tailwind CSS 클래스)를 작성했지만, 브라우저에서 HTML이 파싱되지 않고 텍스트 그대로 표시되는 문제가 발생했습니다.

```markdown
<!-- home.md -->
<div class="mb-16">
  <div class="relative overflow-hidden rounded-3xl ...">
    <div class="absolute top-0 right-0 ..."></div>
    <div class="relative z-10 text-center">
      ...
    </div>
  </div>
</div>
```

**증상**:
- HTML 태그가 텍스트로 그대로 화면에 출력됨
- Tailwind CSS 스타일이 전혀 적용되지 않음
- 레이아웃이 완전히 깨짐

### 2. 기존 파서 로직의 문제점

기존 `load_md.ts`의 `renderMarkdownWithComponents` 함수는 정규식으로 div 블록을 추출하려고 시도했습니다:

```typescript
// 문제가 있던 코드
const divBlockRegex = /(<div[\s\S]*?>[\s\S]*?<\/div>)/gi;
const tokens = mdText.split(divBlockRegex).filter(Boolean);

for (const token of tokens) {
  if (/^<div[\s\S]*?>[\s\S]*?<\/div>$/.test(token)) {
    // div 블록은 그대로 삽입
    contentElement.innerHTML += token;
  } else {
    // 마크다운 파싱
    const html = await marked.parse(innerToken);
    contentElement.innerHTML += html;
  }
}
```

**문제점**:
- Non-greedy 매칭(`*?`)이 중첩된 div에서 **첫 번째 `</div>`에서 멈춤**
- 중첩된 div 구조를 제대로 추출하지 못함
- 일부는 HTML로, 일부는 텍스트로 처리되어 렌더링 실패

## 해결 방법

### 파서 로직 단순화

marked.js는 **HTML 태그를 자동으로 통과시키는** 기능이 이미 내장되어 있습니다. 복잡한 정규식으로 분리할 필요가 없었습니다.

**수정된 코드** (`src/scripts/load_md.ts`):

```typescript
/**
 * 마크다운과 HTML을 함께 렌더링
 * marked.js는 HTML 태그(div, card-component, button-component 등)를 자동으로 통과시킴
 * 웹 컴포넌트는 브라우저가 인식하여 자동으로 렌더링
 */
export async function renderMarkdownWithComponents(
  mdText: string,
  contentElement: HTMLElement
) {
  // marked.js가 마크다운 구문을 파싱하고 HTML은 그대로 통과
  const html = await marked.parse(mdText);
  contentElement.innerHTML = html;
}
```

### 작동 원리

1. **marked.js의 HTML 처리**: 마크다운 파서가 `<div>`, `<card-component>` 등 모든 HTML 태그를 그대로 유지
2. **마크다운 파싱**: `#`, `##`, `---`, 링크 등 마크다운 구문만 HTML로 변환
3. **웹 컴포넌트 렌더링**: `customElements.define()`으로 등록된 컴포넌트는 브라우저가 자동으로 렌더링

## 결과

### Before (복잡한 로직)
- ❌ 정규식으로 div 블록 추출 시도 → 중첩 처리 실패
- ❌ 웹 컴포넌트 별도 추출 → 불필요한 복잡성
- ❌ 토큰 단위 분리 처리 → 버그 발생

### After (단순화된 로직)
- ✅ marked.js가 모든 HTML을 자동으로 처리
- ✅ 중첩된 div 구조 완벽 렌더링
- ✅ 커스텀 웹 컴포넌트 정상 작동
- ✅ 코드 라인 수 70% 감소
- ✅ 유지보수성 대폭 향상

### 성능 및 안정성

- 파서 로직이 단순해져 **버그 가능성 감소**
- marked.js의 검증된 HTML 처리 로직 활용
- 다른 페이지(get-started, docker-concepts 등) 모두 정상 작동 확인

## 교훈

1. **라이브러리 기능 활용**: 이미 제공되는 기능을 재구현하지 말 것
2. **단순함이 최고**: 복잡한 정규식보다 간단한 해결책이 더 안정적
3. **문제의 근본 원인 파악**: 표면적 증상이 아닌 근본 원인을 찾아야 함
