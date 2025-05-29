# Multi-container applications

<div class="youtube-video">
   <iframe 
    src="https://www.youtube.com/embed/1jUwR6F9hvM" 
    frameborder="0" 
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
   >
  </iframe>
</div>

## Explanation

단일 컨테이너 애플리케이션을 시작하는 것은 쉽습니다. 예를 들어, 특정 데이터 처리 작업을 수행하는 Python 스크립트는 모든 종속성이 있는 컨테이너 내에서 실행됩니다. 마찬가지로, 작은 API 엔드포인트가 있는 정적 웹사이트를 제공하는 Node.js 애플리케이션은 모든 필수 라이브러리와 종속성을 사용하여 효과적으로 컨테이너화할 수 있습니다. 그러나, 애플리케이션의 크기가 커짐에 따라, 개별 컨테이너로 관리하는 것이 더 어려워집니다.

데이터 처리 Python 스크립트가 데이터베이스에 연결해야 한다고 상상해 보세요. 갑자기 스크립트뿐만 아니라 동일한 컨테이너 내에서 데이터베이스 서버도 관리하게 됩니다. 스크립트에 사용자 로그인이 필요한 경우 인증 메커니즘이 필요하여 컨테이너 크기가 더욱 커집니다.

컨테이너에 대한 모범 사례 중 하나는 각 컨테이너가 한 가지 작업을 잘 수행해야 한다는 것입니다. 이 규칙에는 예외가 있지만 하나의 컨테이너가 여러 작업을 수행하는 경향은 피하세요.

이제 "이러한 컨테이너를 개별적으로 실행해야 하나요? 개별적으로 실행한다면 어떻게 모두 연결해야 하나요?"라고 물을 수 있습니다.

`docker run`은 컨테이너를 시작하기에 편리한 도구이지만, 커지는 애플리케이션 스택을 관리하기 어려워집니다. 그 이유는 다음과 같습니다:

- 개발, 테스트 및 프로덕션 환경에 대해 서로 다른 구성으로 여러 개의 `docker run` 명령(프런트엔드, 백엔드 및 데이터베이스)을 실행하는 것을 상상해 보세요. 오류가 발생하기 쉽고 시간이 많이 걸립니다.
- 애플리케이션은 종종 서로 의존합니다. 특정 순서로 컨테이너를 수동으로 시작하고 네트워크 연결을 관리하는 것은 스택이 확장됨에 따라 어려워집니다.
- 각 애플리케이션에는 `docker run` 명령이 필요하므로, 개별 서비스를 확장하기 어렵습니다. 전체 애플리케이션을 확장한다는 것은 부스트가 필요 없는 구성 요소에 리소스를 낭비할 가능성이 있음을 의미합니다.
- 각 애플리케이션에 대한 데이터를 유지하려면 각 `docker run` 명령 내에서 별도의 볼륨 마운트 또는 구성이 필요합니다. 이는 분산된 데이터 관리 접근 방식을 만듭니다.
- 각 애플리케이션에 대한 환경 변수를 별도의 `docker run` 명령을 통해 설정하는 것은 지루하고 오류가 발생하기 쉽습니다.

바로 여기서 Docker Compose가 구원에 나섭니다.

Docker Compose는 `compose.yml`이라는 단일 YAML 파일에 전체 다중 컨테이너 애플리케이션을 정의합니다. 이 파일은 모든 컨테이너, 종속성, 환경 변수, 심지어 볼륨과 네트워크에 대한 구성을 지정합니다. Docker Compose를 사용하면:

- 여러 `docker run` 명령을 실행할 필요가 없습니다. 단일 YAML 파일에 전체 다중 컨테이너 애플리케이션을 정의하기만 하면 됩니다. 이렇게 하면 구성을 중앙 집중화하고 관리를 간소화할 수 있습니다.
- 특정 순서로 컨테이너를 실행하고 네트워크 연결을 쉽게 관리할 수 있습니다.
- 다중 컨테이너 설정 내에서 개별 서비스를 간단히 확장하거나 축소할 수 있습니다. 이를 통해 실시간 요구 사항에 따라 효율적으로 할당할 수 있습니다.
- 손쉽게 영구적인 볼륨을 구현할 수 있습니다.
- Docker Compose 파일에서 환경 변수를 한 번 설정하는 것은 쉽습니다.

Docker Compose를 사용하여 여러 컨테이너 설정을 실행하면 모듈성, 확장성, 일관성을 핵심으로 복잡한 애플리케이션을 구축할 수 있습니다.

## Try it out

이 핸즈온 가이드에서는 먼저 `docker run` 명령을 사용하여 Node.js, Nginx 역방향 프록시 및 Redis 데이터베이스를 기반으로 하는 카운터 웹 애플리케이션을 빌드하고 실행하는 방법을 알아봅니다. 또한 Docker Compose를 사용하여 전체 배포 프로세스를 간소화하는 방법도 알아봅니다.

### Set up

1. 샘플 애플리케이션을 받으세요. Git이 있다면 샘플 애플리케이션의 리포지토리를 복제할 수 있습니다. 그렇지 않으면 샘플 애플리케이션을 다운로드할 수 있습니다. 다음 옵션 중 하나를 선택하세요.

---

#### Clone with git

터미널에서 다음 명령을 사용하여 샘플 애플리케이션 저장소를 복제합니다.

```bash
$ git clone https://github.com/dockersamples/nginx-node-redis
```

`nginx-node-redis` 디렉토리로 이동합니다:

```bash
$ cd nginx-node-redis
```

이 디렉토리 내부에는 `nginx`와 `web`이라는 두 개의 하위 디렉토리가 있습니다.

#### Download

소스를 다운로드하고 압축을 풉니다.

[Download the source](https://github.com/dockersamples/nginx-node-redis/archive/refs/heads/main.zip)

nginx-node-redis-main 디렉토리로 이동합니다:

```bash
$ cd nginx-node-redis
```

이 디렉토리 내부에는 `nginx`와 `web`이라는 두 개의 하위 디렉토리가 있습니다.

---

2. 도커 데스크탑을 [다운로드 및 설치](#/get-started/get-docker)합니다.

### Build the images

1. 다음 명령을 실행하여 이미지를 빌드하려면 `nginx` 디렉토리로 이동합니다:
   ```bash
   $ docker build -t nginx .
   ```
2. `web` 디렉토리로 이동한 후 다음 명령을 실행하여 첫 번째 웹 이미지를 빌드합니다:
   ```bash
   $ docker build -t web .
   ```

### Run the containers

1. 멀티 컨테이너 애플리케이션을 실행하기 전에 모든 컨테이너가 통신할 수 있는 네트워크를 만들어야 합니다. `docker network create` 명령을 사용하여 이를 수행할 수 있습니다.

   ```bash
   $ docker network create sample-app
   ```

2. 다음 명령을 실행하여 Redis 컨테이너를 시작합니다. 이 명령은 컨테이너를 이전에 생성한 네트워크에 연결하고 네트워크 별칭(DNS 조회에 유용함)을 생성합니다.

   ```bash
   $ docker run -d  --name redis --network sample-app --network-alias redis redis
   ```

3. 다음 명령을 실행하여 첫 번째 웹 컨테이너를 시작합니다:

   ```bash
   $ docker run -d --name web1 -h web1 --network sample-app --network-alias web1 web
   ```

4. 다음을 실행하여 두 번째 웹 컨테이너를 시작합니다:

   ```bash
   docker run -d --name web2 -h web2 --network sample-app --network-alias web2 web
   ```

5. 다음 명령을 실행하여 Nginx 컨테이너를 시작합니다:

   ```bash
   $ docker run -d --name nginx --network sample-app  -p 80:80 nginx
   ```

   > #### Note
   >
   > Nginx는 일반적으로 웹 애플리케이션의 역방향 프록시로 사용되어 트래픽을 백엔드 서버로 라우팅합니다. 이 경우 Node.js 백엔드 컨테이너(web1 또는 web2)로 라우팅합니다.

6. 다음 명령을 실행하여 컨테이너가 작동 중인지 확인하세요:
   ```bash
   $ docker ps
   ```
   다음과 같은 출력이 표시됩니다:
   ```bash
   CONTAINER ID   IMAGE     COMMAND                  CREATED              STATUS              PORTS                NAMES
   2cf7c484c144   nginx     "/docker-entrypoint.â¦"   9 seconds ago        Up 8 seconds        0.0.0.0:80->80/tcp   nginx
   7a070c9ffeaa   web       "docker-entrypoint.sâ¦"   19 seconds ago       Up 18 seconds                            web2
   6dc6d4e60aaf   web       "docker-entrypoint.sâ¦"   34 seconds ago       Up 33 seconds                            web1
   008e0ecf4f36   redis     "docker-entrypoint.sâ¦"   About a minute ago   Up About a minute   6379/tcp             redis
   ```
7. Docker Desktop Dashboard를 살펴보면 컨테이너를 보고 구성을 더 자세히 알아볼 수 있습니다.
   ![build-image-7](https://docs.docker.com/get-started/docker-concepts/running-containers/images/multi-container-apps.webp)
8. 모든 것이 실행되면 브라우저에서 [http://localhost](http://localhost/)를 열어 사이트를 볼 수 있습니다. 페이지를 여러 번 새로 고쳐 요청을 처리하는 호스트와 총 요청 수를 확인합니다.

   ```plaintext
   web2: Number of visits is: 9
   web1: Number of visits is: 10
   web2: Number of visits is: 11
   web1: Number of visits is: 12
   ```

   > #### Note
   >
   > Nginx가 역방향 프록시 역할을 하면서 들어오는 요청을 두 백엔드 컨테이너 간에 라운드 로빈 방식으로 분배하는 것을 알아차렸을 것입니다. 즉, 각 요청은 순환 방식으로 다른 컨테이너(web1 및 web2)로 전달될 수 있습니다. 출력은 web1 및 web2 컨테이너 모두에 대한 연속적인 증가를 보여주고 Redis에 저장된 실제 카운터 값은 응답이 클라이언트로 다시 전송된 후에만 업데이트됩니다.

9. Docker Desktop Dashboard에서 컨테이너를 선택하고 **Delete** 버튼을 선택하여 컨테이너를 제거할 수 있습니다.
   ![build-image-9](https://docs.docker.com/get-started/docker-concepts/running-containers/images/delete-multi-container-apps.webp)

## Simplify the deployment using Docker Compose

Docker Compose는 다중 컨테이너 배포를 관리하기 위한 체계적이고 간소화된 접근 방식을 제공합니다. 앞서 언급했듯이 Docker Compose를 사용하면 여러 `docker run` 명령을 실행할 필요가 없습니다. 해야 할 일은 `compose.yml`이라는 단일 YAML 파일에 전체 다중 컨테이너 애플리케이션을 정의하는 것입니다. 작동 방식을 살펴보겠습니다.

프로젝트 디렉토리의 루트로 이동합니다. 이 디렉토리 내부에 compose.yml이라는 파일이 있습니다. 이 YAML 파일은 모든 마법이 일어나는 곳입니다. 애플리케이션을 구성하는 모든 서비스와 해당 구성을 정의합니다. 각 서비스는 이미지, 포트, 볼륨, 네트워크 및 기능에 필요한 기타 설정을 지정합니다.

1. docker compose up 명령을 사용하여 애플리케이션을 시작합니다:

   ```bash
   $ docker compose up -d --build
   ```

   이 명령을 실행하면 다음과 유사한 출력이 표시됩니다:

   ```bash
   Running 5/5
   ✔ Network nginx-nodejs-redis_default    Created           0.0s
   ✔ Container nginx-nodejs-redis-web1-1   Started           0.1s
   ✔ Container nginx-nodejs-redis-redis-1  Started           0.1s
   ✔ Container nginx-nodejs-redis-web2-1   Started           0.1s
   ✔ Container nginx-nodejs-redis-nginx-1  Started
   ```

2. Docker Desktop Dashboard를 살펴보면 컨테이너를 보고 구성을 더 자세히 알아볼 수 있습니다.
   ![using-docker-compose-2](https://docs.docker.com/get-started/docker-concepts/running-containers/images/list-containers.webp)
3. 또는, Docker Desktop Dashboard에서 애플리케이션 스택을 선택하고 삭제 버튼을 선택하여 컨테이너를 제거할 수 있습니다.
   ![using-docker-compose-3](https://docs.docker.com/get-started/docker-concepts/running-containers/images/delete-containers.webp)

이 가이드에서는 Docker Compose를 사용하여 여러 컨테이너 애플리케이션을 시작 및 중지하는 것이 `docker run`을 사용하는 것보다 얼마나 쉬운지, 오류가 발생하기 쉽고 관리하기 어려운지 알아보았습니다.

## Additional resources

- [`docker container run` CLI reference](https://docs.docker.com/reference/cli/docker/container/run/)
- [What is Docker Compose](#/get-started/docker-concepts/the-basics/what-is-docker-compose)
