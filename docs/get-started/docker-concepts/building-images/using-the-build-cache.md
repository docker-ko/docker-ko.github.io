# Using the build cache

<div class="youtube-video">
   <iframe 
    src="https://www.youtube.com/embed/Ri6jMknjprY" 
    frameborder="0" 
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
   >
  </iframe>
</div>

## Explanation

여러분이 만들었던 [getting-started](#/get-started/docker-concepts/building-images/writing-a-dockerfile/) 앱을 위해 생성한 Dockerfile을 고려해보겠습니다.

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "./src/index.js"]
```

`docker build` 명령어를 실행하여 새 이미지를 생성할 때, Docker는 Dockerfile의 각 명령어를 실행하여 명령어마다 순서에 맞게 레이어를 생성합니다. 각 명령어에 대해 Docker는 이전 빌드에서 해당 명령어를 재사용할 수 있는지 확인합니다. 이미 비슷한 명령어를 실행한 적이 있다면, Docker는 이를 다시 실행할 필요가 없습니다. 대신 캐시된 결과를 사용합니다. 이렇게 하면 빌드 프로세스가 더 빠르고 효율적으로 되어 소중한 시간과 리소스를 절약할 수 있습니다.

빌드 캐시를 효과적으로 사용하면 이전 빌드 결과를 재사용하고 불필요한 작업을 건너뛰어 더 빠른 빌드를 달성할 수 있습니다. 캐시 사용을 최대화하고 리소스 집약적이고 시간 소모적인 재빌드를 피하려면 캐시 무효화 방법을 이해하는 것이 중요합니다. 다음은 캐시 무효화를 발생시키는 몇 가지 상황입니다:

- `RUN` 명령어의 명령에 대한 변경 사항은 해당 레이어를 무효화합니다. Docker는 Dockerfile의 `RUN` 명령어에 대한 변경 사항을 감지하고 빌드 캐시를 무효화합니다.
- `COPY` 또는 `ADD` 명령어로 이미지에 복사된 파일의 변경 사항. Docker는 프로젝트 디렉터리 내 파일의 변경 사항을 주시합니다. 내용이나 권한과 같은 속성 변경 사항이 있을 경우 Docker는 이러한 변경 사항을 캐시 무효화의 트리거로 간주합니다.
- 한 레이어가 무효화되면 모든 이후 레이어도 무효화됩니다. 베이스 이미지나 중간 레이어를 포함한 이전 레이어가 변경으로 인해 무효화된 경우, Docker는 이를 기반으로 하는 후속 레이어도 무효화합니다. 이렇게 하면 빌드 프로세스가 동기화되고 일관성이 유지됩니다.

Dockerfile을 작성하거나 편집할 때 불필요한 캐시 누락을 피하고 빌드가 가능한 한 빠르고 효율적으로 실행되도록 주의하세요.

## Try it out

이 실습 가이드에서는 Docker 빌드 캐시를 Node.js 애플리케이션에 효과적으로 사용하는 방법을 배웁니다.

### Build the application

1. Docker Desktop을 [다운로드 및 설치하세요](https://www.docker.com/products/docker-desktop/?_gl=1*17nm94d*_gcl_au*MjczODgxODI4LjE3Mzg0NzA0NDI.*_ga*MjEyODM1MDY2OC4xNzIwMzEyNzQ5*_ga_XJWPQMJYHQ*MTczOTY5MTIyMS42NS4xLjE3Mzk2OTUwODguNjAuMC4w).

2. 터미널을 열고 다음 명령어로 [샘플 애플리케이션을 클론합니다](https://github.com/dockersamples/todo-list-app).

   ```sh
   $ git clone https://github.com/dockersamples/todo-list-app
   ```

3. `todo-list-app` 디렉터리로 이동합니다.

   ```sh
   $ cd todo-list-app
   ```

   이 디렉터리 내에 다음과 같은 내용을 가진 `Dockerfile`이 있습니다.

   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY . .
   RUN yarn install --production
   EXPOSE 3000
   CMD ["node", "./src/index.js"]
   ```

4. 다음 명령어를 실행하여 Docker 이미지를 빌드합니다.

   ```sh
   $ docker build .
   ```

   빌드 과정의 결과는 다음과 같습니다:

   ```plaintext
   [+] Building 20.0s (10/10) FINISHED
   ```

   첫 번째 줄은 전체 빌드 프로세스가 20.0초 걸렸음을 나타냅니다. 첫 번째 빌드는 종속성을 설치하기 때문에 시간이 좀 걸릴 수 있습니다.

5. 변경 사항 없이 다시 빌드합니다.

   이제 소스 코드나 Dockerfile을 변경하지 않고 다음과 같이 `docker build` 명령을 다시 실행합니다:

   ```sh
   $ docker build .
   ```

   초기 빌드 이후의 후속 빌드는 명령어와 컨텍스트가 변경되지 않는 한 캐시 메커니즘 덕분에 더 빨라집니다. Docker는 빌드 과정 중 생성된 중간 레이어를 캐시합니다. Dockerfile이나 소스 코드에 변경 사항 없이 이미지를 다시 빌드할 때 Docker는 캐시된 레이어를 재사용하여 빌드 프로세스를 크게 빠르게 합니다.

   ```plaintext
   [+] Building 1.0s (9/9) FINISHED
   docker:desktop-linux => [internal] load build definition from Dockerfile 0.0s
   => => transferring dockerfile: 187B 0.0s ...
   => [internal] load build context 0.0s
   => => transferring context: 8.16kB 0.0s
   => CACHED [2/4] WORKDIR /app 0.0s
   => CACHED [3/4] COPY . . 0.0s
   => CACHED [4/4] RUN yarn install --production 0.0s
   => exporting to image 0.0s
   => => exporting layers 0.0s
   => => exporting manifest
   ```

   후속 빌드는 캐시된 레이어를 활용하여 단 1.0초 만에 완료되었습니다. 의존성 설치와 같은 시간 소모적인 단계를 반복할 필요가 없습니다.

   | 단계                                     | 설명                 | 첫 번째 실행 시간 | 두 번째 실행 시간 |
   | ---------------------------------------- | -------------------- | ----------------- | ----------------- |
   | 1 Load build definition from Dockerfile  | Dockerfile 로드      | 0.0 초            | 0.0 초            |
   | 2 Load metadata for node:20-alpine       | 메타데이터 로드      | 2.7 초            | 0.9 초            |
   | 3 Load .dockerignore                     | .dockerignore 로드   | 0.0 초            | 0.0 초            |
   | 4 Load build context                     | 빌드 컨텍스트 로드   | 0.1 초            | 0.0 초            |
   | 5 Set the working directory              | 작업 디렉터리 설정   | 0.1 초            | 0.0 초            |
   | 6 Copy the local code into the container | 로컬 코드 복사       | 0.0 초            | 0.0 초            |
   | 7 Run yarn install --production          | 의존성 설치          | 10.0 초           | 0.0 초            |
   | 8 Exporting layers                       | 레이어 내보내기      | 2.2 초            | 0.0 초            |
   | 9 Exporting the final image              | 최종 이미지 내보내기 | 3.0 초            | 0.0 초            |

   `docker image history` 명령어 출력으로 돌아가면 Dockerfile의 각 명령어가 이미지의 새 레이어가 되는 것을 볼 수 있습니다. 이미지를 변경할 때 `yarn` 의존성을 다시 설치해야 했음을 기억할 것입니다. 이를 해결할 방법이 있을까요? 매번 동일한 의존성을 다시 설치하는 것은 합리적이지 않죠?

   이를 해결하기 위해 Dockerfile을 재구성하여 의존성 캐시가 필요할 때만 무효화되도록 합니다. Node 기반 애플리케이션의 경우 의존성은 package.json 파일에 정의됩니다. 해당 파일이 변경되면 의존성을 다시 설치해야 하지만, 파일이 변경되지 않으면 캐시된 의존성을 사용합니다. 따라서, 먼저 해당 파일만 복사한 다음, 의존성을 설치하고, 나머지 파일을 복사합니다. 이렇게 하면 `package.json` 파일이 변경된 경우에만 yarn 의존성을 재설치하면 됩니다.

6. Dockerfile을 업데이트하여 먼저 `package.json` 파일을 복사하고, 의존성을 설치한 다음, 모든 파일을 복사합니다.

   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package.json yarn.lock ./
   RUN yarn install --production
   COPY . .
   EXPOSE 3000
   CMD ["node", "src/index.js"]
   ```

7. Dockerfile과 동일한 폴더에 `.dockerignore` 파일을 생성하고 다음 내용을 추가합니다.

   ```plaintext
   node_modules
   ```

8. 새 이미지를 빌드합니다:

   ```sh
   $ docker build .
   ```

   다음과 유사한 출력을 볼 수 있습니다.

   ```plaintext
   [+] Building 16.1s (10/10) FINISHED
   => [internal] load build definition from Dockerfile 0.0s
   => => transferring dockerfile: 175B 0.0s
   => [internal] load .dockerignore 0.0s
   => => transferring context: 2B 0.0s
   => [internal] load metadata for docker.io/library/node:21-alpine 0.0s
   => [internal] load build context 0.8s
   => => transferring context: 53.37MB 0.8s
   => [1/5] FROM docker.io/library/node:21-alpine 0.0s
   => CACHED [2/5] WORKDIR /app 0.0s
   => [3/5] COPY package.json yarn.lock ./ 0.2s
   => [4/5] RUN yarn install --production 14.0s
   => [5/5] COPY . . 0.5s
   => exporting to image 0.6s
   => => exporting layers 0.6s
   => => writing image sha256:d6f819013566c54c50124ed94d5e66c452325327217f
   ```

   모든 레이어가 다시 빌드된 것을 볼 수 있습니다. Dockerfile을 꽤 많이 변경했기 때문에 완전히 괜찮습니다.

9. 이제 `src/static/index.html` 파일을 변경합니다(예: 제목을 "The Awesome Todo App"으로 변경).
10. Docker 이미지를 빌드합니다. 이번에는 출력이 약간 달라 보일 것입니다.

    ```sh
    $ docker build -t node-app:3.0 .
    ```

    그러면 다음과 유사한 출력이 표시됩니다:

    ```plaintext
    [+] Building 1.2s (10/10) FINISHED
    => [internal] load build definition from Dockerfile                                               0.0s
    => => transferring dockerfile: 37B                                                                0.0s
    => [internal] load .dockerignore                                                                  0.0s
    => => transferring context: 2B                                                                    0.0s
    => [internal] load metadata for docker.io/library/node:21-alpine                                  0.0s
    => [internal] load build context                                                                  0.2s
    => => transferring context: 450.43kB                                                              0.2s
    => [1/5] FROM docker.io/library/node:21-alpine                                                    0.0s
    => CACHED [2/5] WORKDIR /app                                                                      0.0s
    => CACHED [3/5] COPY package.json yarn.lock ./                                                    0.0s
    => CACHED [4/5] RUN yarn install --production                                                     0.0s
    => [5/5] COPY . .                                                                                 0.5s
    => exporting to image                                                                             0.3s
    => => exporting layers                                                                            0.3s
    => => writing image
    sha256:91790c87bcb096a83c2bd4eb512bc8b134c757cda0bdee4038187f98148e2eda       0.0s
    => => naming to docker.io/library/node-app:3.0
    ```

    우선, 빌드가 훨씬 더 빠르다는 것을 알아차리세요. 여러 단계에서 이전에 캐시된 레이어를 사용하고 있음을 알 수 있습니다. 좋은 소식입니다; 빌드 캐시를 사용하고 있기 때문입니다. 이 이미지와 이에 대한 업데이트를 푸시하고 풀링하는 것도 훨씬 빨라질 것입니다.

이러한 최적화 기술을 따르면 Docker 빌드를 더 빠르고 효율적으로 만들어 반복 주기를 단축하고 개발 생산성을 향상시킬 수 있습니다.

## Additional resources

- [Optimizing builds with cache management](https://docs.docker.com/build/cache/)
- [Cache Storage Backend](https://docs.docker.com/build/cache/backends/)
- [Build cache invalidation](https://docs.docker.com/build/cache/invalidation/)

## Next steps

이제 Docker 빌드 캐시를 효과적으로 사용하는 방법을 이해했으므로 다중 단계 빌드에 대해 알아볼 준비가 되었습니다.

[Multi-stage builds](#/get-started/docker-concepts/building-images/multi-stage-builds)
