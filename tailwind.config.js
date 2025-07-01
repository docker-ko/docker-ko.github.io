module.exports = {
  darkMode: 'media', // 또는 'class'
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './public/**/*.md',
    './src/scripts/components/*.{js,ts,jsx,tsx}'
  ],
  safelist: [
    'bg-docker-primary',
    'bg-docker-hover',
    'text-docker-link',
    'border-border-light',
    'border-border-primary',
    'bg-surface-card',
    'bg-surface-code',
    'border-surface-code-border'
  ],
  theme: {
    extend: {
      colors: {
        // Docker 브랜드 색상
        'docker-primary': '#086dd7',    // 메인 브랜드 블루
        'docker-hover': '#2560ff',      // 호버 시 블루
        'docker-link': '#007bff',       // 링크 색상
        
        // 배경 색상
        'bg-light': '#ffffff',      // 라이트 모드 배경
        'bg-dark': '#1a1a1a',      // 다크 모드 배경
        'bg-sidebar': '#f9f9fa',   // 사이드바 배경
        
        // 텍스트 색상
        'txt-primary': '#222222',    // 메인 텍스트
        'txt-secondary': '#444444',  // 서브 텍스트
        'txt-muted': '#555555',     // 음소거된 텍스트
        'txt-inverse': '#ffffff',   // 역방향 텍스트 (다크 배경에서)
        'txt-black': '#000000',     // 순수 검정
        
        // 테두리 색상
        'border-light': '#e1e2e6',     // 기본 테두리
        'border-primary': '#007bff',   // 강조 테두리 (blockquote 등)
        
        // 회색 계열 (다크모드 지원)
        'gray-dark-100': '#2d2d2d', // 다크모드 회색
        
        // 상태별 색상
        'surface-card': '#ffffff',       // 카드 배경
        'surface-code': '#f8f9fa',      // 코드 블록 배경
        'surface-code-border': '#e1e2e6', // 코드 블록 테두리
      }
    }
  }
};
