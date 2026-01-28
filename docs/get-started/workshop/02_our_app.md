# Containerize an application

이 가이드의 나머지 부분에서는 Node.js에서 실행되는 간단한 할 일 목록 관리자를 사용하게 됩니다. Node.js에 익숙하지 않더라도 걱정하지 마세요. 이 가이드는 JavaScript에 대한 사전 경험을 요구하지 않습니다.

## Prerequisites

- [Docker Desktop](https://docs.docker.com/get-started/get-docker/)의 최신 버전을 설치합니다.
- [Git Client](https://git-scm.com/downloads)를 설치합니다.
- 파일을 편집하려면 IDE나 텍스트 편집기가 필요합니다. Docker는 [Visual Studio Code](https://code.visualstudio.com/) 사용을 권장합니다.

## Get the app

애플리케이션을 실행하려면 먼저 애플리케이션 소스 코드를 컴퓨터에 설치해야 합니다.

1. 다음 명령을 사용하여 [getting-started-app 저장소](https://github.com/docker/getting-started-app/tree/main)를 복제합니다 .
2. 복제된 저장소의 내용을 확인하세요. 다음 파일과 하위 디렉터리가 표시되어야 합니다.
   ```text
   ├── getting-started-app/
   │ ├── .dockerignore
   │ ├── package.json
   │ ├── README.md
   │ ├── spec/
   │ ├── src/
   │ └── yarn.lock
   ```

## Build the app's image

이미지를 빌드하려면 Dockerfile을 사용해야 합니다. Dockerfile은 파일 확장자가 없는 텍스트 기반 파일로, 스크립트로 작성된 명령이 포함되어 있습니다. Docker는 이 스크립트를 사용하여 컨테이너 이미지를 빌드합니다.

1. `getting-started-app` 디렉토리에서, `package.json` 파일과 같은 위치에, 다음 내용을 담은 `.Dockerfile` 파일을 만듭니다

   ```dockerfile
   # syntax=docker/dockerfile:1

   FROM node:lts-alpine
   WORKDIR /app
   COPY . .
   RUN yarn install --production
   CMD ["node", "src/index.js"]
   EXPOSE 3000
   ```

이 Dockerfile은 Node.js와 Yarn 패키지 관리자가 사전 설치된 경량 Linux 이미지인 `node:lts-alpine` 기본 이미지로 시작합니다. 모든 소스 코드를 이미지에 복사하고, 필요한 종속성을 설치한 후, 애플리케이션을 시작합니다.

2. 다음 명령어를 사용하여 이미지를 빌드합니다 :
   터미널에서 `getting-started-app` 디렉토리에 있는지 확인하세요. 디렉토리를 `/path/to/getting-started-app` 경로에서 `getting-started-app`로 변경하세요.

   ```bash
   $ cd /path/to/getting-started-app
   ```

   이미지를 빌드합니다.

   ```bash
   $ docker build -t getting-started .
   ```

   `docker build` 명령어는 Dockerfile을 사용하여 새 이미지를 빌드합니다. 도커가 많은 "레이어"들을 다운로드하는 것을 보셨을 겁니다. 이는 빌더에 `node:lts-alpine` 이미지에서 시작하도록 설정했기 때문입니다. 하지만, 컴퓨터에 해당 이미지가 없었기 때문에, Docker가 이미지를 다운로드해야 했습니다.

   Docker가 이미지를 다운로드한 후, Dockerfile에서의 지침들이 애플리케이션에 복사되고 `yarn`을 사용하여 애플리케이션의 종속성을 설치합니다. `CMD` 명령어는 이 이미지에서 컨테이너를 시작할 때 실행할 기본 명령을 지정합니다.

   마지막으로 `-t` 플래그는 이미지에 태그를 지정합니다. 태그를 최종 이미지에 대해 사람이 읽을 수 있는 이름이라고 생각하면 됩니다. 이미지 이름을 `getting-started`로 지정했으므로 컨테이너를 실행할 때 해당 이미지를 참조할 수 있습니다.

   `docker build` 명령 끝의 `.` 는 Docker에게 현재 디렉터리에서 Dockerfile을 찾아야 한다는 것을 알려줍니다.

## Start an app container

이제 이미지가 있으므로 `docker run` 명령을 사용하여 컨테이너에서 애플리케이션을 실행할 수 있습니다.

1. `docker run` 명령을 사용하여 컨테이너를 실행하고 방금 만든 이미지의 이름을 명시합니다.

   ```bash
   $ docker run -d -p 127.0.0.1:3000:3000 getting-started
   ```

   `-d` 플래그(`--detach`의 약자)는 컨테이너를 백그라운드에서 실행합니다. Docker가 컨테이너를 시작하고 터미널 프롬프트로 돌아간다는 것을 의미합니다. 또한, 터미널에 로그를 표시하지 않습니다.

   `-p` 플래그(`--publish`의 약자)는 호스트와 컨테이너 간의 포트 매핑을 생성합니다. `-p` 플래그는 `HOST:CONTAINER` 형식의 문자열 값을 사용하며, 여기서 `HOST`는 호스트의 주소이고 `CONTAINER`는 컨테이너의 포트입니다. 이 명령은 컨테이너의 포트 3000을 호스트의 `127.0.0.1:3000`(`localhost:3000`)에 게시합니다. 포트 매핑이 없으면 호스트에서 애플리케이션에 액세스할 수 없습니다.

2. 몇 초 후 웹 브라우저를 열어 [http://localhost:3000](http://localhost:3000/)으로 접속하세요. 앱이 보일 것입니다.
   ![container-app](https://docs.docker.com/get-started/workshop/images/todo-list-empty.webp)
3. 항목을 한두 개 추가하고 예상대로 작동하는지 확인하세요. 아이템을 완료로 표시하고 삭제할 수 있습니다. 프런트엔드가 백엔드에 아이템을 성공적으로 저장하고 있습니다.

이 시점에, 실행 중인 몇 가지 아이템이 포함된 투두 리스트 관리자가 있습니다.

컨테이너를 잠깐 살펴보면 `getting-started` 이미지를 사용하고 `3000`번 포트에서 실행 중인 컨테이너가 최소 하나 이상 있는 것을 확인할 수 있습니다. 컨테이너를 보려면 CLI 또는 Docker Desktop의 그래픽 인터페이스를 사용할 수 있습니다.

터미널에서 docker ps 명령을 실행하여 컨테이너 목록을 확인하세요.

```bash
$ docker ps
```

다음과 비슷한 출력이 나타날 것입니다.

```bash
CONTAINER ID        IMAGE               COMMAND                    CREATED             STATUS              PORTS                      NAMES
df784548666d        getting-started     "docker-entrypoint.s..."   2 minutes ago       Up 2 minutes        127.0.0.1:3000->3000/tcp   priceless_mcclintock
```

## Summary

이 섹션에서는 이미지를 빌드하기 위한 Dockerfile 생성의 기본 사항을 알아보았습니다. 이미지를 빌드한 후 컨테이너를 시작하고 실행 중인 앱을 확인했습니다.

관련 정보:

- [Dockerfile reference](https://docs.docker.com/reference/dockerfile/)
- [docker CLI reference](https://docs.docker.com/reference/cli/docker/)

## Next steps

다음으로, 앱을 수정하고 실행 중인 애플리케이션을 새 이미지로 업데이트하는 방법을 알아보겠습니다. 이 과정에서, 몇 가지 유용한 명령도 배우게 됩니다.

<button-component href="/#/get-started/workshop/03_updating_app" title="Update the application" />