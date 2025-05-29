# Dockerfile 작성하기

<div class="youtube-video">
   <iframe 
    src="https://www.youtube.com/embed/Jx8zoIhiP4c" 
    frameborder="0" 
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
   >
  </iframe>
</div>

## Explanation

Dockerfile은 컨테이너 이미지를 만드는 데 사용되는 텍스트 기반 문서입니다. 실행할 명령, 복사할 파일, 시작 명령 등에 대한 지침을 이미지 빌더에게 제공합니다.

예를 들어, 다음 Dockerfile은 실행할 준비가 된 Python 애플리케이션을 생성합니다 :

```dockerfile
FROM python:3.12
WORKDIR /usr/local/app

# 애플리케이션 의존성 설치
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 복사
COPY src ./src
EXPOSE 5000

# 컨테이너가 루트 사용자가 아닌 app 사용자로 실행되도록 설정
RUN useradd app
USER app
CMD [ "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080" ]
```

### Common instructions

`Dockerfile`에서 자주 사용되는 명령어는 다음과 같습니다:

- `FROM <image>` - 빌드할 기본 이미지를 지정합니다.
- `WORKDIR <path>` - 작업 디렉터리 또는 이미지 내 파일이 복사되고 명령어가 실행될 경로를 지정합니다.
- `COPY <host-path> <image-path>` - 호스트에서 파일을 복사하여 컨테이너 이미지에 넣도록 지시합니다.
- `RUN <command>` - 지정된 명령어를 실행하도록 지시합니다.
- `ENV <name> <value>` - 실행 중인 컨테이너에서 사용할 환경 변수를 설정합니다.
- `EXPOSE <port-number>` - 이미지가 노출하려는 포트를 설정합니다.
- `USER <user-or-uid>` - 모든 후속 명령어에 대한 기본 사용자를 설정합니다.
- `CMD ["<command>", "<arg1>"]` - 이 이미지를 사용하는 컨테이너가 실행할 기본 명령어를 설정합니다.

명령어에 대한 자세한 내용은 [Dockerfile 참조](https://docs.docker.com/engine/reference/builder/)를 확인하세요.

## Try it out

이전 예제에서 본 것처럼, Dockerfile은 일반적으로 다음 단계를 따릅니다:

1. 베이스 이미지를 결정합니다.
2. 애플리케이션 의존성을 설치합니다.
3. 관련 소스 코드 및/또는 바이너리를 복사합니다.
4. 최종 이미지를 구성합니다.

이 간단한 실습 가이드에서는 간단한 Node.js 애플리케이션을 빌드하는 Dockerfile을 작성해보겠습니다. JavaScript 기반 애플리케이션에 익숙하지 않아도 이 가이드를 따라하는 데 문제가 없습니다.

### Set up

이 [ZIP 파일](https://github.com/docker/getting-started-todo-app/raw/build-image-from-scratch/app.zip)을 다운로드하고, 파일 내용을 여러분의 장치 내 디렉터리에 추출합니다.

### Creating the Dockerfile

이제 프로젝트를 얻었으니 `Dockerfile`을 작성할 준비가 되었습니다.

1. Docker Desktop을 [다운로드하여 설치](https://www.docker.com/products/docker-desktop/?_gl=1*n03ong*_gcl_au*MjczODgxODI4LjE3Mzg0NzA0NDI.*_ga*MjEyODM1MDY2OC4xNzIwMzEyNzQ5*_ga_XJWPQMJYHQ*MTczOTYwMzg0Ny42My4xLjE3Mzk2MDcyNzYuNTcuMC4w)합니다.
2. `package.json` 파일과 동일한 폴더 위치에 `Dockerfile`을 생성합니다.

   > #### Dockerfile file extensions
   >
   > Dockerfile에는 파일 확장자가 없다는 점에 유의하는 것이 중요합니다. 일부 편집자는 파일에 자동으로 확장자를 추가합니다(또는 확장자가 없다고 불평합니다).

3. `Dockerfile`에 다음 줄을 추가하여 베이스 이미지를 정의합니다:

   ```dockerfile
   FROM node:20-alpine
   ```

4. `WORKDIR` 명령어를 사용하여 작업 디렉터리를 정의합니다. 이는 이후 명령어가 실행될 위치를 지정하며, 파일이 컨테이너 이미지 내에 복사됩니다.

   ```dockerfile
   WORKDIR /app
   ```

5. `COPY` 명령어를 사용하여 로컬 프로젝트의 모든 파일을 컨테이너 이미지로 복사합니다:

   ```dockerfile
   COPY . .
   ```

6. `RUN` 명령어를 사용하여 `yarn` CLI와 패키지 관리자를 사용하여 애플리케이션의 의존성을 설치합니다:

   ```dockerfile
   RUN yarn install --production
   ```

7. 마지막으로, `CMD` 명령어를 사용하여 기본 실행 명령어를 지정합니다:

   ```dockerfile
   CMD [ "node", "./src/index.js" ]
   ```

   이제 전체 Dockerfile은 다음과 같아야 합니다:

   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY . .
   RUN yarn install --production
   CMD [ "node", "./src/index.js" ]
   ```

> **This Dockerfile isn't production-ready yet**
>
> 이 Dockerfile이 아직 모든 모범 사례를 따르지 않는다는 점에 유의하는 것이 중요합니다(의도적으로). 앱은 빌드하지만 빌드가 가능한 한 빠르지 않고 이미지도 가능한 한 안전하지 않습니다.
>
> 계속 읽어서 이미지가 빌드 캐시를 최대화하고 루트가 아닌 사용자로 실행하고 여러 단계로 빌드하는 방법에 대해 자세히 알아보세요.

> **Containerize new projects quickly with `docker init`**
>
> `docker init` 명령어는 프로젝트를 분석하고 Dockerfile, `compose.yaml`, `.dockerignore`를 빠르게 생성하여 작업을 시작하는 데 도움을 줍니다. 여기서는 Dockerfile에 대해 구체적으로 배우기 때문에 지금은 사용하지 않을 것입니다. 하지만, [여기에서 자세히 알아보세요](https://docs.docker.com/engine/reference/commandline/init/).

## Additional resources

Dockerfile 작성에 대해 더 알아보려면 다음 리소스를 참조하세요:

- [Dockerfile 참조](https://docs.docker.com/engine/reference/builder/)
- [Dockerfile 모범 사례](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [베이스 이미지](https://docs.docker.com/develop/develop-images/baseimages/)
- [Docker Init 시작하기](https://docs.docker.com/reference/cli/docker/init/)

## Next steps

이제 Dockerfile을 생성하고 기본 사항을 배웠으니, 이미지를 빌드하고 태그를 지정하며 푸시하는 방법을 배우십시오.

[Build, tag, and publish an image](#/get-started/docker-concepts/building-images/build-tag-and-publish-an-image)
