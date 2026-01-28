# 트러블슈팅: TableOfContents에 컴포넌트 내부 텍스트 표시 문제

## 문제 상황

### 목차에 기여자 이름이 표시됨

home.md 페이지의 우측 TableOfContents(목차)에 **기여자 컴포넌트 내부의 username**이 제목처럼 표시되는 문제가 발생했습니다.

**예상 목차**:
```
Table of contents
- Docker 한국어 문서에 오신 것을 환영합니다
- 궁금한 점이 있으신가요?
- 기여자들
- 시작하기
```

**실제 목차**:
```
Table of contents
- Docker 한국어 문서에 오신 것을 환영합니다
- 궁금한 점이 있으신가요?
- 기여자들
- krsy0411        ← 불필요한 항목
- elecbug         ← 불필요한 항목
- g1nya2          ← 불필요한 항목
- YoonKeumJae     ← 불필요한 항목
- 시작하기
```

**증상**:
- 목차에 컴포넌트 내부의 텍스트가 제목으로 인식됨
- 기여자 이름을 클릭하면 해당 카드로 스크롤 이동
- 목차가 지저분해지고 사용성 저하

## 원인 분석

### 1. contributor-component 내부 구조 확인

**문제가 있던 코드** (`src/scripts/components/contributor-component.ts`):

```typescript
render() {
  const username = this.getAttribute('username') || 'Anonymous';
  // ...

  this.innerHTML = `
    <a href="${githubUrl}" ...>
      <div class="...">
        <div class="...">
          <!-- 이 부분이 문제! -->
          <h3 class="text-lg font-semibold ...">
            ${username}
          </h3>
          <!-- ... -->
        </div>
      </div>
    </a>
  `;
}
```

**핵심 문제**: 사용자 이름을 `<h3>` 태그로 렌더링

### 2. table-contents.ts의 동작 방식

**table-contents.ts 코드** (`src/scripts/table-contents.ts`):

```typescript
export const initializeTableContents = () => {
  const content = document.getElementById('content') as HTMLElement;
  const toc = document.getElementById('toc') as HTMLElement;

  toc.innerHTML = '';

  // 모든 h2, h3 태그를 목차로 수집
  const headings = content.querySelectorAll('h2, h3');

  if (headings.length === 0) return;

  // ...

  headings.forEach((heading, index) => {
    const listItem = document.createElement('li');
    // ...
    const headingText = heading.textContent || '';
    link.textContent = headingText.length > 30
      ? headingText.substring(0, 30) + '...'
      : headingText;
    // ...
  });
}
```

**핵심 로직**: `content.querySelectorAll('h2, h3')`로 **모든 h2, h3 태그를 수집**

### 3. 문제의 연결고리

1. `contributor-component`가 내부에서 `<h3>` 태그로 username 렌더링
2. `table-contents.ts`가 DOM의 모든 `h2, h3` 태그를 찾아 목차 생성
3. 컴포넌트 내부의 `<h3>` 태그도 제목으로 인식됨
4. 결과적으로 목차에 username이 표시됨

## 해결 방법

### 의미론적으로 올바른 태그 사용

컴포넌트 내부의 사용자 이름은 **섹션 제목이 아닌 라벨**이므로, 제목 태그(`<h1>`~`<h6>`) 대신 `<div>`를 사용해야 합니다.

**수정 전**:
```typescript
<h3 class="text-lg font-semibold ...">
  ${username}
</h3>
```

**수정 후** (`src/scripts/components/contributor-component.ts`):
```typescript
<div class="text-base font-semibold ...">
  ${username}
</div>
```

### 추가 개선사항

사이즈도 함께 조정하여 시각적 계층 구조를 개선:
- **폰트 크기**: `text-lg` (18px) → `text-base` (16px)
- **의미**: 제목이 아닌 라벨로 적절한 크기

## 결과

### Before
- ❌ 목차에 기여자 이름 4개가 제목으로 표시
- ❌ 의미론적으로 부적절한 HTML 구조 (`<h3>`를 라벨로 사용)
- ❌ 목차가 길어지고 가독성 저하
- ❌ 스크린 리더가 잘못된 구조 인식

### After
- ✅ 목차에 섹션 제목만 표시 (h2, h3 태그만)
- ✅ 의미론적으로 올바른 HTML 구조 (`<div>`로 라벨 표현)
- ✅ 목차가 깔끔하고 탐색하기 쉬움
- ✅ 접근성 개선 (스크린 리더가 올바른 구조 인식)

### 수정 후 목차

```
Table of contents
- Docker 한국어 문서에 오신 것을 환영합니다
- 궁금한 점이 있으신가요?
- 기여자들
- 시작하기
```

## 교훈

### 1. HTML 시맨틱(의미론) 준수의 중요성

| 태그 | 용도 | 올바른 사용 예시 |
|------|------|------------------|
| `<h1>`~`<h6>` | 문서 섹션 제목 | 페이지 제목, 섹션 제목 |
| `<div>`, `<span>` | 범용 컨테이너 | 레이블, 텍스트 블록 |
| `<label>` | 폼 레이블 | input과 연결된 텍스트 |
| `<p>` | 단락 | 문단 텍스트 |

**올바른 선택 기준**:
- 콘텐츠가 **문서 구조의 제목**인가? → `<h1>`~`<h6>`
- 단순한 **텍스트 라벨**인가? → `<div>`, `<span>`

### 2. 컴포넌트 설계 시 고려사항

웹 컴포넌트를 설계할 때:
1. **내부 HTML 구조**가 외부 시스템(목차, 검색 등)에 미치는 영향 고려
2. **시맨틱 HTML** 사용으로 예기치 않은 부작용 방지
3. **스타일링 목적**으로 제목 태그 사용 금지

### 3. querySelector의 광범위한 영향

`querySelectorAll('h2, h3')`처럼 태그 선택자를 사용하면:
- Shadow DOM이 아닌 한 **모든 하위 요소**를 선택
- 컴포넌트 내부 요소도 선택될 수 있음
- 의도하지 않은 요소가 포함될 수 있음

**대안 고려**:
1. 특정 클래스/속성으로 목차용 제목 구분
2. 컴포넌트는 Shadow DOM 사용
3. 제목에 `data-toc="true"` 같은 속성 추가

### 4. 접근성(Accessibility) 개선

시맨틱 HTML을 올바르게 사용하면:
- 스크린 리더가 문서 구조를 정확히 인식
- 키보드 탐색이 자연스러워짐
- SEO에도 긍정적 영향

## 참고 자료

- [MDN: HTML 시맨틱 요소](https://developer.mozilla.org/ko/docs/Glossary/Semantics#html%EC%97%90%EC%84%9C%EC%9D%98_%EC%8B%9C%EB%A7%A8%ED%8B%B1)
- [W3C: Heading Elements](https://www.w3.org/TR/html52/sections.html#the-h1-h2-h3-h4-h5-and-h6-elements)
- [MDN: querySelector](https://developer.mozilla.org/ko/docs/Web/API/Document/querySelectorAll)
- [Web Accessibility: Semantic HTML](https://www.w3.org/WAI/tips/developing/#use-mark-up-to-convey-meaning-and-structure)
