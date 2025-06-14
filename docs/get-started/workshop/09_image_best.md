# Image-building best practices

## Image layering

`docker image history` 명령어를 사용하면, 이미지 내의 각 레이어를 생성하는 데 사용된 명령어를 확인할 수 있습니다.

1. `docker image history` 명령어를 사용하여 생성한 `getting-started` 이미지의 레이어를 확인합니다.

   ```bash
   $ docker image history getting-started
   ```

   다음과 같은 출력이 표시되어야 합니다.

   ```bash
   IMAGE               CREATED             CREATED BY                                      SIZE                COMMENT
   a78a40cbf866        18 seconds ago      /bin/sh -c #(nop)  CMD ["node" "src/index.j…    0B
   f1d1808565d6        19 seconds ago      /bin/sh -c yarn install --production            85.4MB
   a2c054d14948        36 seconds ago      /bin/sh -c #(nop) COPY dir:5dc710ad87c789593…   198kB
   9577ae713121        37 seconds ago      /bin/sh -c #(nop) WORKDIR /app                  0B
   b95baba1cfdb        13 days ago         /bin/sh -c #(nop)  CMD ["node"]                 0B
   <missing>           13 days ago         /bin/sh -c #(nop) ADD file:e69d441d729412d24…   5.59MB
   ```

   각 라인은 이미지 내 레이어를 나타냅니다. 맨 아래에 기본 레이어가 있고 맨 위에 최신 레이어가 있음을 보여줍니다. 이를 통해, 각 레이어의 크기를 빠르게 확인하여 큰 이미지를 진단하는 데 도움이 됩니다.

2. 몇몇 라인이 잘려 있는 것을 볼 수 있습니다. `--no-trunc` 플래그를 추가하면, 전체 출력을 볼 수 있습니다.

   ```bash
   $ docker image history --no-trunc getting-started
   ```

## Layer caching

이제 레이어링이 실제로 어떻게 작동하는지 확인했으니, 컨테이너 이미지의 빌드 시간을 줄이는 데 도움이 되는 중요한 교훈을 배워야 합니다. 레이어가 변경되면, 해당 레이어의 모든 하위 레이어도 재생성해야 합니다.

getting started 앱을 위해 생성했던 Dockerfile을 살펴보세요.

```dockerfile
# syntax=docker/dockerfile:1
FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
```

이미지 히스토리 출력으로 돌아가면, Dockerfile의 각 명령어가 이미지에서 새 레이어가 됨을 알 수 있습니다. 이미지를 변경했을 때, yarn 종속성들을 다시 설치해야 했던 것을 기억할 겁니다. 빌드할 때마다 동일한 종속성을 전달하는 것은 별로 의미가 없습니다.

이를 해결하려면, 종속성 캐싱을 지원하도록 Dockerfile을 재구성해야 합니다. Node 기반 애플리케이션의 경우, 해당 종속성은 `package.json` 파일에 정의됩니다. 해당 파일만 먼저 복사하고, 종속성을 설치한 다음, 나머지 모든 것을 복사할 수 있습니다. 그러면 `package.json`에 변경이 있는 경우에만 yarn 종속성을 재생성합니다.

1. Dockerfile을 업데이트하여 먼저 `package.json`을 복사한 다음, 종속성을 설치하고, 그 후에 모든 것을 복사합니다.

   ```dockerfile
   # syntax=docker/dockerfile:1
   FROM node:lts-alpine
   WORKDIR /app
   COPY package.json yarn.lock ./
   RUN yarn install --production
   COPY . .
   CMD ["node", "src/index.js"]
   ```

2. `docker build` 명령어를 사용하여 새 이미지를 빌드합니다.

   ```bash
   $ docker build -t getting-started .
   ```

다음과 같은 출력이 표시되어야 합니다:

    ```bash
    [+] Building 16.1s (10/10) FINISHED
    => [internal] load build definition from Dockerfile
    => => transferring dockerfile: 175B
    => [internal] load .dockerignore
    => => transferring context: 2B
    => [internal] load metadata for docker.io/library/node:lts-alpine
    => [internal] load build context
    => => transferring context: 53.37MB
    => [1/5] FROM docker.io/library/node:lts-alpine
    => CACHED [2/5] WORKDIR /app
    => [3/5] COPY package.json yarn.lock ./
    => [4/5] RUN yarn install --production
    => [5/5] COPY . .
    => exporting to image
    => => exporting layers
    => => writing image     sha256:91790c87bcb096a83c2bd4eb512bc8b134c757cda0bdee4038187f98148e2eda
    => => naming to docker.io/library/getting-started
    ```

3. 이제, `src/static/index.html` 파일을 변경합니다. 예를 들어, `<title>`을 "The Awesome Todo App"으로 변경합니다.

4. 다시 `docker build -t getting-started .` 명령어로 Docker 이미지를 빌드합니다. 이번에는, 출력이 조금 다르게 보일 것입니다.

   ```bash
   [+] Building 1.2s (10/10) FINISHED
   => [internal] load build definition from Dockerfile
   => => transferring dockerfile: 37B
   => [internal] load .dockerignore
   => => transferring context: 2B
   => [internal] load metadata for docker.io/library/node:lts-alpine
   => [internal] load build context
   => => transferring context: 450.43kB
   => [1/5] FROM docker.io/library/node:lts-alpine
   => CACHED [2/5] WORKDIR /app
   => CACHED [3/5] COPY package.json yarn.lock ./
   => CACHED [4/5] RUN yarn install --production
   => [5/5] COPY . .
   => exporting to image
   => => exporting layers
   => => writing image     sha256:d6f819013566c54c50124ed94d5e66c452325327217f4f04399b45f94e37d25
   => => naming to docker.io/library/getting-started
   ```

   우선, 빌드가 훨씬 빠르다는 것을 알 수 있습니다. 또한, 여러 단계에서 이전에 캐시된 레이어를 사용하는 것을 볼 수 있습니다. 이 이미지와 업데이트를 푸시하고 풀링하는 것도 훨씬 빨라질 것입니다.

## Multi-stage builds

멀티 스테이지 빌드는 여러 단계를 사용하여 이미지를 생성하는 데 도움이 되는 매우 강력한 도구입니다. 여기에는 몇 가지 장점이 있습니다:

- 빌드 타임 종속성과 런타임 종속성을 분리합니다.
- 앱을 실행하는 데 필요한 것만 전달함으로써 전체 이미지 크기를 줄입니다.

### Maven/Tomcat example

Java 기반 애플리케이션을 빌드하려면, 소스 코드를 Java 바이트코드로 컴파일하기 위해 JDK가 필요합니다. 하지만, JDK는 프로덕션에서는 필요 없습니다. 또한, Maven이나 Gradle 같은 도구를 사용해 앱을 빌드하고 있을 수도 있습니다. 그것들 또한 최종 이미지에는 필요하지 않습니다. 이러한 상황에서 멀티 스테이지 빌드가 도움이 될 수 있습니다.

```dockerfile
# syntax=docker/dockerfile:1
FROM maven AS build
WORKDIR /app
COPY . .
RUN mvn package

FROM tomcat
COPY --from=build /app/target/file.war /usr/local/tomcat/webapps
```

이 예제에서는, Maven을 사용하여 실제 Java 빌드를 수행하는 첫 번째 단계(`빌드(build)`)를 수행합니다. 두 번째 단계(`FROM tomcat`으로 시작하는)에서는, `빌드(build)` 단계로부터 파일들을 복사합니다. 최종 이미지에서는 마지막 단계에서 생성된 것일 뿐이며, `--target` 플래그를 사용해 재정의할 수 있습니다.

### React example

React 애플리케이션을 빌드할 때, JS 코드(보통 JSX), SASS 스타일시트 등을 정적 HTML, JS, CSS로 컴파일하기 위해 Node 환경이 필요합니다. 서버 사이드 렌더링을 하지 않는다면 프로덕션 빌드에는 Node 환경이 필요하지 않습니다. 정적 nginx 컨테이너에서 정적 리소스를 제공할 수 있습니다.

```dockerfile
# syntax=docker/dockerfile:1
FROM node:lts AS build
WORKDIR /app
COPY package* yarn.lock ./
RUN yarn install
COPY public ./public
COPY src ./src
RUN yarn run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
```

이전 Dockerfile 예제에서는, 빌드를 수행하기 위해 `node:lts` 이미지를 사용하고(레이어 캐싱 최대화) 출력을 nginx 컨테이너로 복사합니다.

## Summary

이 섹션에서는 레이어 캐싱과 멀티 스테이지 빌드를 포함한 몇 가지 이미지 빌드 모범 사례를 배웠습니다.

관련 정보:

- [Dockerfile reference](https://docs.docker.com/reference/dockerfile/)
- [Dockerfile best practices](https://docs.docker.com/build/building/best-practices/)

## Next steps

다음 섹션에서는, 컨테이너에 대해 계속해서 학습할 수 있는 추가 리소스들에 대해 알아봅니다.

<button-component href="/#/get-started/workshop/10_what_next" title="What next" />