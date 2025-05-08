# Build, tag, and publish an image

[유튜브 링크](https://youtu.be/chiiGLlYRlY)

## Explanation

이 가이드에서는 다음을 배웁니다:

- 이미지 빌드 - `Dockerfile`을 기반으로 이미지를 빌드하는 프로세스
- 이미지 태그 지정 - 이미지에 이름을 지정하는 프로세스로, 이미지를 어디에 배포할 수 있는지도 결정합니다.
- 이미지 게시 - 컨테이너 레지스트리를 사용하여 새로 만든 이미지를 배포하거나 공유하는 프로세스

### Building images

대부분의 경우 이미지는 Dockerfile을 사용하여 빌드됩니다. 가장 기본적인 `docker build` 명령어는 다음과 같습니다:

```sh
docker build .
```

명령어의 마지막 `.`은 [빌드 컨텍스트](https://docs.docker.com/build/concepts/context/#what-is-a-build-context)에게 경로 또는 URL을 제공합니다. 이 위치에서 빌더는 `Dockerfile`과 참조된 다른 파일을 찾습니다. 빌드를 실행하면 빌더는 필요한 경우 베이스 이미지를 가져오고 Dockerfile에 지정된 명령을 실행합니다. 이전 명령어로는 이미지에 이름이 지정되지 않지만, 출력 결과로 이미지 ID가 제공됩니다. 예를 들어, 이전 명령어는 다음과 같은 출력을 생성할 수 있습니다:

```sh
$ docker build .
[+] Building 3.5s (11/11) FINISHED
 => [internal] load build definition from Dockerfile                                                                                                                               0.0s
 => => transferring dockerfile: 308B                                                                                                                                               0.0s
 => [internal] load metadata for docker.io/library/python:3.12                                                                                                                     0.0s
 => [internal] load .dockerignore                                                                                                                                                  0.0s
 => => transferring context: 2B                                                                                                                                                    0.0s
 => [1/6] FROM docker.io/library/python:3.12                                                                                                                                       0.0s
 => [internal] load build context                                                                                                                                                  0.0s
 => => transferring context: 123B                                                                                                                                                  0.0s
 => [2/6] WORKDIR /usr/local/app                                                                                                                                                   0.0s
 => [3/6] RUN useradd app                                                                                                                                                          0.1s
 => [4/6] COPY ./requirements.txt ./requirements.txt                                                                                                                               0.0s
 => [5/6] RUN pip install --no-cache-dir --upgrade -r requirements.txt                                                                                                             3.2s
 => [6/6] COPY ./app ./app                                                                                                                                                         0.0s
 => exporting to image                                                                                                                                                             0.1s
 => => exporting layers                                                                                                                                                            0.1s
 => => writing image sha256:9924dfd9350407b3df01d1a0e1033b1e543523ce7d5d5e2c83a724480ebe8f00                                                                                        0.0s
```

이전 출력을 사용하여 다음과 같이 해당 이미지를 사용하는 컨테이너를 시작할 수 있습니다:

```sh
docker run sha256:9924dfd9350407b3df01d1a0e1033b1e543523ce7d5d5e2c83a724480ebe8f00
```

위의 ID와 같은 이름은 기억하기 어렵기 때문에 태그가 유용해집니다.

### Tagging images

이미지에 태그를 지정하는 것은 이미지에 기억하기 쉬운 이름을 부여하는 방법입니다. 그러나 이미지 이름에는 구조가 있습니다. 전체 이미지 이름은 다음과 같은 구조를 가집니다:

```
[HOST[:PORT_NUMBER]/]PATH[:TAG]
```

- `HOST`: 이미지가 위치한 선택적 레지스트리 호스트 이름입니다. 호스트가 지정되지 않으면 Docker의 공개 레지스트리인 `docker.io`가 기본으로 사용됩니다.
- `PORT_NUMBER`: 호스트 이름이 제공된 경우의 레지스트리 포트 번호입니다.
- `PATH`: 슬래시로 구분된 구성 요소로 구성된 이미지의 경로입니다. Docker Hub의 경우, 형식은 `[NAMESPACE/]REPOSITORY`이며, 네임스페이스는 사용자 또는 조직의 이름입니다. 네임스페이스가 지정되지 않으면 `library`가 사용되며, 이는 Docker 공식 이미지의 네임스페이스입니다.
- `TAG`: 커스텀, 사람이 읽을 수 있는 식별자로, 일반적으로 이미지의 다른 버전이나 변형을 식별하는 데 사용됩니다. 태그가 지정되지 않으면 기본적으로 latest가 사용됩니다.

이미지 이름의 예시:

- `nginx`: 이는 `docker.io/library/nginx:latest`와 동등합니다. 이 명령은 `docker.io` 레지스트리의 `library` 네임스페이스에서 `nginx` 이미지 레포지토리와 `latest` 태그를 가져옵니다.
- `docker/welcome-to-docker`: 이는 `docker.io/docker/welcome-to-docker:latest`와 동등합니다. 이 명령은 `docker.io` 레지스트리의 `docker` 네임스페이스에서 `welcome-to-docker` 이미지 레포지토리와 `latest` 태그를 가져옵니다.
- `ghcr.io/dockersamples/example-voting-app-vote:pr-311`: 이는 GitHub Container Registry의 `dockersamples` 네임스페이스에서 `example-voting-app-vote` 이미지 레포지토리와 `pr-311` 태그를 가져옵니다.

이미지 빌드 중에 태그를 지정하려면 `-t` 또는 `--tag` 플래그를 추가합니다:

```sh
docker build -t my-username/my-image .
```

이미 빌드된 이미지에 또 다른 태그를 추가하려면 [`docker image tag`](https://docs.docker.com/engine/reference/commandline/image_tag/) 명령어를 사용합니다:

```sh
docker image tag my-username/my-image another-username/another-image:v1
```

### Publishing images

이미지가 빌드되고 태그가 지정되면 레지스트리에 푸시할 준비가 됩니다. 이를 위해 `docker push` 명령어를 사용합니다:

```sh
docker push my-username/my-image
```

몇 초 내에 이미지의 모든 레이어가 레지스트리에 푸시됩니다.

> **인증 요구**
>
> 이미지를 레포지토리에 푸시하기 전에 인증이 필요합니다. 이를 위해 [`docker login`](https://docs.docker.com/engine/reference/commandline/login/) 명령어를 사용합니다.

## Try it out

이 실습 가이드에서는 제공된 Dockerfile을 사용하여 간단한 이미지를 빌드하고 Docker Hub에 푸시합니다.

### Set up

1. 샘플 애플리케이션 가져오기
   Git이 있으면 샘플 애플리케이션의 레포지토리를 클론할 수 있습니다. 그렇지 않으면 샘플 애플리케이션을 다운로드할 수 있습니다. 다음 옵션 중 하나를 선택하세요.

   #### 옵션1) Git으로 클론하기

   터미널에서 다음 명령어를 사용하여 샘플 애플리케이션 레포지토리를 클론합니다:

   ```sh
   $ git clone https://github.com/docker/getting-started-todo-app
   ```

   #### 옵션2) 다운로드

   소스를 다운로드하고 압축을 풉니다.

   [Download the source](https://github.com/docker/getting-started-todo-app/raw/cd61f824da7a614a8298db503eed6630eeee33a3/app.zip)

2. Docker Desktop을 [다운로드 및 설치](https://www.docker.com/products/docker-desktop/?_gl=1*14ynqgh*_gcl_au*MjczODgxODI4LjE3Mzg0NzA0NDI.*_ga*MjEyODM1MDY2OC4xNzIwMzEyNzQ5*_ga_XJWPQMJYHQ*MTczOTY5MTIyMS42NS4xLjE3Mzk2OTMzNTUuNTkuMC4w)합니다.
3. 아직 Docker 계정이 없으면, [지금 만드세요](https://hub.docker.com/?_gl=1*cqijf8*_gcl_au*MjczODgxODI4LjE3Mzg0NzA0NDI.*_ga*MjEyODM1MDY2OC4xNzIwMzEyNzQ5*_ga_XJWPQMJYHQ*MTczOTY5MTIyMS42NS4xLjE3Mzk2OTMzNTUuNTkuMC4w). 그 후 Docker Desktop에 해당 계정으로 로그인하세요.

### Build an image

이제 Docker Hub에 레포지토리가 있으므로, 이미지를 빌드하고 레포지토리에 푸시할 차례입니다.

1. 샘플 앱 레포지토리의 루트에서 터미널을 사용하여 다음 명령어를 실행합니다. `YOUR_DOCKER_USERNAME`을 Docker Hub 사용자 이름으로 대체하세요:

   ```sh
   $ docker build -t YOUR_DOCKER_USERNAME/concepts-build-image-demo .
   ```

   예를 들어, 사용자 이름이 `mobywhale`인 경우 명령어는 다음과 같습니다:

   ```sh
   $ docker build -t mobywhale/concepts-build-image-demo .
   ```

2. 빌드가 완료되면 다음 명령어를 사용하여 이미지를 확인할 수 있습니다:

   ```sh
   $ docker image ls
   ```

   명령어는 다음과 유사한 출력을 생성합니다:

   ```plaintext
   REPOSITORY TAG IMAGE ID CREATED SIZE
   mobywhale/concepts-build-image-demo latest 746c7e06537f 24 seconds ago 354MB
   ```

3. [`docker image history`](https://docs.docker.com/reference/cli/docker/image/history/) 명령어를 사용하여 이미지의 히스토리(또는 이미지가 생성된 방법)를 확인할 수 있습니다:

   ```sh
   $ docker image history mobywhale/concepts-build-image-demo
   ```

   다음과 유사한 출력이 표시됩니다:

   ```plaintext
   IMAGE CREATED CREATED BY SIZE COMMENT
   f279389d5f01 8 seconds ago CMD ["node", "./src/index.js"] 0B buildkit.dockerfile.v0
   <missing> 8 seconds ago EXPOSE map[3000/tcp:{}] 0B buildkit.dockerfile.v0
   <missing> 8 seconds ago WORKDIR /app 8.19kB buildkit.dockerfile.v0
   <missing> 4 days ago /bin/sh -c #(nop) CMD ["node"] 0B
   <missing> 4 days ago /bin/sh -c #(nop) ENTRYPOINT ["docker-entrypoint.sh"] 0B
   <missing> 4 days ago /bin/sh -c #(nop) ENV YARN_VERSION=1.22.19 0B
   <missing> 4 days ago /bin/sh -c ARCH= && dpkgArch="$(dp
   ```

   이 출력은 이미지의 레이어를 보여주며, 추가한 레이어와 베이스 이미지에서 상속받은 레이어를 강조 표시합니다.

### Push the image

이제 이미지를 빌드했으니 레지스트리에 이미지를 푸시할 차례입니다.

1. `docker push` 명령을 사용하여 이미지를 푸시합니다:

   ```sh
   $ docker push <YOUR_DOCKER_USERNAME>/concepts-build-image-demo
   ```

   리소스에 대한 요청된 액세스가 거부되었다는 메시지를 받으면 로그인했는지, 그리고 이미지 태그에 Docker 사용자 이름이 올바른지 확인하세요.

   잠시 후 이미지가 Docker Hub에 푸시됩니다.

## Additional resources

이미지 빌드, 태그 지정, 게시에 대해 자세히 알아보려면 다음 리소스를 방문하세요:

- [What is a build context?](https://docs.docker.com/build/concepts/context/#what-is-a-build-context)
- [docker build reference](https://docs.docker.com/engine/reference/commandline/image_build/)
- [docker image tag reference](https://docs.docker.com/engine/reference/commandline/image_tag/)
- [docker push reference](https://docs.docker.com/engine/reference/commandline/image_push/)
- [What is a registry?](#/get-started/docker-concepts/the-basics/what-is-a-registry.md)

## Next steps

이제 이미지를 빌드하고 게시하는 방법을 알았으니 Docker 빌드 캐시를 사용하여 빌드 프로세스 속도를 높이는 방법을 알아보겠습니다.

[Using the build cache](#/get-started/docker-concepts/building-images/using-the-build-cache)
