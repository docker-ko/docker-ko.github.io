# 트러블슈팅: Docker Compose Named Volume으로 인한 의존성 동기화 문제

## 문제 상황

### 컨테이너에서 npm 패키지를 찾을 수 없음

Sentry 모니터링 도구를 추가한 후 Docker 컨테이너에서 개발 서버를 실행하려 하니 다음과 같은 에러가 발생했습니다:

```
failed to load config from /app/vite.config.ts

error when starting dev server:

Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@sentry/vite-plugin'
imported from /app/node_modules/.vite-temp/vite.config.ts.timestamp-1769575784050-9b415a926660a.mjs

    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:267:9)
    at packageResolve (node:internal/modules/esm/resolve:768:81)
    ...
```

**증상**:
- `package.json`에 `@sentry/vite-plugin` 패키지가 명확히 존재
- 호스트에서는 `npm install`로 정상 설치됨
- 컨테이너 내부에서만 패키지를 찾을 수 없음
- 다른 기존 패키지들은 정상 작동

## 원인 분석

### Named Volume의 동작 방식

기존 `docker-compose.yml` 설정:

```yaml
version: "1.0.0"
services:
  web:
    volumes:
      - ./:/app
      - node_modules:/app/node_modules
    environment:
      - NODE_ENV=development
      - VITE_SENTRY_DSN=${VITE_SENTRY_DSN}

volumes:
  node_modules:
    name: docker-ko-node_modules
```

**문제의 근본 원인**:

1. **Named Volume의 영속성**
   - `node_modules` named volume은 컨테이너 재시작 후에도 유지됨
   - 볼륨이 한 번 생성되면 내용이 업데이트되지 않음

2. **package.json 변경 시 동기화 실패**
   - 호스트에서 `npm install`로 새 패키지 추가
   - 볼륨은 이전 상태를 유지 (새 패키지가 볼륨에 반영 안 됨)
   - 컨테이너는 오래된 볼륨의 `node_modules`를 사용

3. **수동 관리 필요**
   - 의존성이 변경될 때마다 `docker-compose down -v`로 볼륨 삭제 필요
   - 개발자가 이를 잊으면 의존성 불일치 발생

### Named Volume vs Anonymous Volume

| 특성 | Named Volume | Anonymous Volume |
|------|-------------|------------------|
| 식별자 | 사용자 지정 이름 | Docker가 자동 생성 |
| 생명주기 | 컨테이너 삭제 후에도 유지 | `docker-compose down` 시 자동 삭제 |
| 의존성 동기화 | 수동 삭제 필요 | 자동 동기화 |
| 사용 사례 | DB 데이터 등 영속성 필요 | node_modules 등 빌드 산출물 |

## 해결 방법

### 1. Named Volume을 Anonymous Volume으로 변경

**수정 전**:
```yaml
volumes:
  - ./:/app
  - node_modules:/app/node_modules

volumes:
  node_modules:
    name: docker-ko-node_modules
```

**수정 후**:
```yaml
volumes:
  - ./:/app
  # 익명 볼륨으로 node_modules 보호
  # 호스트의 node_modules가 컨테이너 것을 덮어쓰지 않도록 방지
  - /app/node_modules
```

### 2. 기존 Named Volume 제거 및 재시작

```bash
# 1. 컨테이너와 볼륨 완전 제거
docker-compose down -v

# 2. 이미지 재빌드 및 컨테이너 시작
docker-compose up --build -d

# 3. 로그 확인
docker-compose logs --tail=20
```

### 3. 추가 개선: deprecated 경고 제거

```yaml
# version 필드 제거 (Docker Compose v2에서 불필요)
- version: "1.0.0"
services:
  web:
    ...
```

## 결과

### Before

**문제점**:
- ❌ package.json 변경 시 수동으로 볼륨 삭제 필요
- ❌ 브랜치 전환 시 의존성 충돌 가능
- ❌ 팀원들이 볼륨 삭제를 잊어 에러 발생
- ❌ `version` 필드로 인한 경고 메시지

**워크플로우**:
```bash
# package.json 변경 후
npm install                      # 호스트에서 설치
docker-compose down -v           # 볼륨 삭제 (잊기 쉬움!)
docker-compose up --build        # 재시작
```

### After

**개선 사항**:
- ✅ package.json 변경 시 자동 동기화
- ✅ `docker-compose down` 시 볼륨 자동 정리
- ✅ 브랜치별로 깨끗한 의존성 환경
- ✅ 경고 메시지 없음

**워크플로우**:
```bash
# package.json 변경 후
docker-compose up --build        # 이것만으로 충분!
```

### 실제 빌드 로그

```
✅ Sentry Vite 플러그인 정상 작동
✅ Vite 개발 서버 시작 완료 (555ms)
✅ 접속 가능: http://localhost:5173/
```

## 교훈

### 1. Docker Volume의 올바른 사용법

**Named Volume을 사용해야 하는 경우**:
- 데이터베이스 데이터 (PostgreSQL, MySQL 등)
- 영속적 스토리지가 필요한 경우
- 여러 컨테이너 간 데이터 공유

**Anonymous Volume을 사용해야 하는 경우**:
- `node_modules`, `vendor` 등 빌드 산출물
- 캐시 디렉토리
- 일시적 파일 저장소

### 2. 개발 환경의 재현 가능성

개발 환경에서는 **재현 가능성**이 더 중요합니다:
- 브랜치를 전환할 때마다 깨끗한 환경
- package.json 변경이 즉시 반영
- 팀원 간 일관된 개발 환경

### 3. Docker Compose 버전 관리

Docker Compose v2부터는:
- `version` 필드가 더 이상 필요하지 않음
- 명시하면 deprecated 경고 발생
- 제거하는 것이 권장사항

### 4. Volume Mount 우선순위

Docker는 더 구체적인 마운트 경로가 우선순위를 가집니다:

```yaml
volumes:
  - ./:/app              # 전체 디렉토리 마운트
  - /app/node_modules    # node_modules만 보호 (우선순위 높음)
```

이를 통해 호스트의 빈 `node_modules`가 컨테이너의 것을 덮어쓰는 것을 방지합니다.

## 참고 자료

- [Docker Compose - Volumes](https://docs.docker.com/compose/compose-file/07-volumes/)
- [Docker Compose version field (deprecated)](https://docs.docker.com/compose/compose-file/04-version-and-name/)
- [Anonymous vs Named Volumes](https://docs.docker.com/storage/volumes/)

## 관련 커밋

```
057f5be [fix] Docker Compose 및 gitignore 설정 업데이트
- Docker Compose: named volume에서 anonymous volume으로 변경
- node_modules 자동 정리 및 패키지 변경 시 자동 반영 지원
```