# Node.js 23 버전의 경량 Alpine Linux 이미지를 사용합니다.
FROM node:23-alpine

# 작업 디렉토리를 /app으로 설정합니다.
WORKDIR /app

# 의존성 설치를 위해 패키지 매니페스트 파일을 복사합니다.
COPY package.json package-lock.json* ./

# npm ci를 사용하여 빠르고 안전하게 의존성을 설치합니다.
RUN npm ci

# 소스 코드는 볼륨 마운트로 연결하므로 COPY . . 는 필요 없음

# Vite 개발 서버 기본 포트 (참고용, 실제 포트 매핑은 docker-compose.yml에서 관리)
EXPOSE 5173

# 컨테이너 시작 시 실행될 명령어
CMD ["npm", "run", "dev", "--", "--host"]