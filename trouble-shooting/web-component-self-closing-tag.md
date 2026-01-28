# 트러블슈팅: 웹 컴포넌트 Self-Closing 태그 문제

## 문제 상황

### contributor-component가 첫 번째만 렌더링됨

home.md에서 4개의 contributor-component를 추가했지만, 브라우저에서 **첫 번째 컴포넌트만 렌더링**되고 나머지는 표시되지 않는 문제가 발생했습니다.

**작성한 코드**:
```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
  <contributor-component username="krsy0411" avatar="..." />
  <contributor-component username="elecbug" avatar="..." />
  <contributor-component username="g1nya2" avatar="..." />
  <contributor-component username="YoonKeumJae" avatar="..." />
</div>
```

**증상**:
- 개발자 도구로 확인 시 DOM에 첫 번째 컴포넌트만 존재
- 나머지 3개의 컴포넌트는 HTML에서 완전히 사라짐
- 콘솔에 에러 메시지 없음

## 원인 분석

### marked.js의 HTML 파싱 동작

marked.js는 HTML 태그를 처리할 때 **표준 HTML 규칙**을 따릅니다:
- Self-closing 태그 (`<tag />`)는 일부 태그에서만 허용 (예: `<img />`, `<br />`, `<input />`)
- 커스텀 요소(Custom Elements)는 명시적으로 닫는 태그가 필요

### 비교: 정상 작동하는 다른 페이지

다른 마크다운 파일들을 확인한 결과, 모든 웹 컴포넌트가 **명시적 닫는 태그**를 사용하고 있었습니다:

```html
<!-- get-started/introduction/whats-next.md -->
<div class="not-prose md:grid-cols-2 lg:grid-cols-3 grid grid-cols-1 gap-4 mb-6 auto-rows-fr">
<card-component
  title="What is a container?"
  description="첫 번째 컨테이너를 실행하는 방법을 배워보세요."
  href="/#/get-started/docker-concepts/the-basics/what-is-a-container"
></card-component>
<card-component
  title="What is an image?"
  description="이미지 레이어의 기초를 배워보세요."
  href="/#/get-started/docker-concepts/the-basics/what-is-an-image"
></card-component>
</div>
```

**핵심 패턴**:
1. `></card-component>` 형식으로 명시적으로 닫음
2. Self-closing 태그 (`/>`) 사용 안 함
3. div 여는 태그 다음 줄바꿈 후 바로 컴포넌트 시작
4. 들여쓰기 없음

## 해결 방법

### Self-Closing 태그를 명시적 닫는 태그로 변경

**수정 전**:
```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
  <contributor-component username="krsy0411" avatar="..." />
  <contributor-component username="elecbug" avatar="..." />
  <contributor-component username="g1nya2" avatar="..." />
  <contributor-component username="YoonKeumJae" avatar="..." />
</div>
```

**수정 후** (`public/docs/home.md`):
```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
<contributor-component username="krsy0411" avatar="https://avatars.githubusercontent.com/u/90031820?v=4"></contributor-component>
<contributor-component username="elecbug" avatar="https://github.com/elecbug.png"></contributor-component>
<contributor-component username="g1nya2" avatar="https://avatars.githubusercontent.com/u/105257807?v=4"></contributor-component>
<contributor-component username="YoonKeumJae" avatar="https://avatars.githubusercontent.com/u/79782610?v=4"></contributor-component>
</div>
```

### 변경 사항 요약

| 항목 | Before | After |
|------|--------|-------|
| 태그 형식 | `<component />` | `<component></component>` |
| 들여쓰기 | 2칸 들여쓰기 | 들여쓰기 없음 |
| 줄바꿈 | div 다음 들여쓰기 | div 다음 바로 컴포넌트 |

## 결과

### Before
- ❌ 첫 번째 컴포넌트만 렌더링됨
- ❌ DOM에 나머지 컴포넌트가 존재하지 않음
- ❌ marked.js가 self-closing 태그를 제대로 파싱하지 못함

### After
- ✅ 4개의 contributor-component 모두 정상 렌더링
- ✅ DOM에 모든 컴포넌트가 올바르게 존재
- ✅ 그리드 레이아웃이 의도대로 작동
- ✅ 호버 효과 및 링크 정상 작동

### 브라우저 렌더링 결과

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  krsy0411   │   elecbug   │   g1nya2    │ YoonKeumJae │
│   [Avatar]  │   [Avatar]  │   [Avatar]  │   [Avatar]  │
│   기여자     │   기여자     │   기여자     │   기여자     │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

## 교훈

### 1. 라이브러리별 HTML 파싱 규칙 이해

- **marked.js**: 표준 HTML 규칙 준수, 커스텀 요소는 명시적 닫는 태그 필요
- **React/JSX**: Self-closing 태그 허용 (`<Component />`)
- **순수 HTML**: `<div />` 같은 형식은 비표준

### 2. 기존 코드 패턴 참조의 중요성

프로젝트 내에서 이미 잘 작동하는 코드가 있다면:
1. **먼저 그 패턴을 확인**하고
2. **동일한 방식으로 작성**하는 것이 가장 안전

### 3. 웹 표준 준수

커스텀 요소(Custom Elements)는 [웹 표준](https://html.spec.whatwg.org/multipage/custom-elements.html)에 따라:
- 반드시 대시(`-`)를 포함한 이름이어야 함
- 명시적 닫는 태그 사용 권장
- Self-closing 형식은 비표준 동작

## 참고 자료

- [Custom Elements - HTML Standard](https://html.spec.whatwg.org/multipage/custom-elements.html)
- [marked.js Documentation](https://marked.js.org/)
- [Web Components Best Practices](https://web.dev/custom-elements-best-practices/)
