# Publishing and exposing ports

[유튜브 링크](https://youtu.be/9JnqOmJ96ds)

## Explanation

지금까지의 가이드를 따라왔다면, 컨테이너가 애플리케이션의 각 구성 요소를 위한 고립된 프로세스를 제공한다는 것을 이해하게 되셨을 겁니다. 각 구성 요소(React 프론트엔드, Python API, Postgres 데이터베이스) 는 호스트 머신에서 완전히 격리된 자체 샌드박스 환경에서 실행됩니다. 이러한 격리는 보안 및 종속성 관리에 유용하지만, 직접 접근할 수 없다는 의미도 있습니다. 예를 들어, 브라우저에서 웹 앱에 접근할 수 없습니다. 여기서 포트 공개가 중요합니다.

### Publishing ports

포트를 공개하면 포워딩 규칙을 설정하여 네트워킹 격리를 약간 돌파할 수 있습니다. 예를 들어, 호스트의 포트 `8080`에서 컨테이너의 포트 `80`으로 요청을 전달할 수 있습니다. 포트 공개는 `docker run` 명령과 함께 `-p`(또는 `--publish`) 플래그를 사용하여 컨테이너 생성 중에 이루어집니다. 구문은 다음과 같습니다:

```bash
$ docker run -d -p HOST_PORT:CONTAINER_PORT nginx
```

- `HOST_PORT`: 트래픽을 수신할 호스트 머신의 포트 번호
- `CONTAINER_PORT`: 연결을 수신하는 컨테이너 내부의 포트 번호

예를 들어, 컨테이너의 포트 80을 호스트 포트 8080에 공개하려면 다음 명령을 사용합니다:

```bash
$ docker run -d -p 8080:80 nginx
```

이제 호스트 머신의 포트 8080으로 보내는 모든 트래픽이 컨테이너 내부의 포트 80으로 전달됩니다.

> #### 중요
>
> 포트를 공개하면 기본적으로 모든 네트워크 인터페이스에 공개됩니다. 이는 귀하의 머신에 도달하는 모든 트래픽이 공개된 애플리케이션에 접근할 수 있다는 의미입니다. 데이터베이스나 민감한 정보를 공개할 때는 신중해야 합니다. 공개된 포트에 대해 더 알아보세요.

### Publishing to ephemeral ports

때로는 특정 호스트 포트를 사용하지 않고 포트를 공개하고 싶을 때가 있습니다. 이 경우, Docker가 포트를 자동으로 선택하게 할 수 있습니다. 이를 위해 `HOST_PORT` 설정을 생략하면 됩니다. 예를 들어, 다음 명령은 컨테이너의 포트 80을 호스트의 일시적인 포트에 공개합니다:

```bash
$ docker run -p 80 nginx
```

컨테이너가 실행된 후 `docker ps` 명령을 사용하면 선택된 포트를 확인할 수 있습니다:

```bash
docker ps
```

```plain
CONTAINER ID  IMAGE     COMMAND                  CREATED       STATUS       PORTS                       NAMES
a527355c9c53  nginx     "/docker-entrypoint.…"  4 seconds ago  Up 3 seconds  0.0.0.0:54772->80/tcp      romantic_williamson
```

이 예에서는 애플리케이션이 호스트의 포트 54772에 노출됩니다.

### Publishing all ports

컨테이너 이미지를 생성할 때 `EXPOSE` 명령을 사용하여 패키지된 애플리케이션이 사용할 포트를 나타냅니다. 이러한 포트는 기본적으로 공개되지 않습니다. `-P` 또는 `--publish-all` 플래그를 사용하면 모든 노출된 포트를 일시적인 포트로 자동으로 공개할 수 있습니다. 이는 개발 또는 테스트 환경에서 포트 충돌을 피하려는 경우에 유용합니다. 예를 들어, 다음 명령은 이미지에 의해 구성된 모든 노출된 포트를 공개합니다:

```bash
$ docker run -P nginx
```

### Try it out

이 실습 가이드에서는 CLI와 Docker Compose를 사용하여 웹 애플리케이션을 배포하는 방법을 배우면서 컨테이너 포트를 공개하는 방법을 배웁니다.

#### Use the Docker CLI

이 단계에서는 Docker CLI를 사용하여 컨테이너를 실행하고 포트를 공개합니다.

1. Docker Desktop을 다운로드하고 설치합니다.
2. 터미널에서 다음 명령을 실행하여 새 컨테이너를 시작합니다:

```bash
$ docker run -d -p 8080:80 docker/welcome-to-docker
```

첫 번째 8080은 호스트 포트를 나타냅니다. 이는 로컬 머신에서 컨테이너 내부의 애플리케이션에 접근하는 데 사용됩니다. 두 번째 80은 컨테이너 포트를 나타냅니다. 이는 컨테이너 내부의 애플리케이션이 들어오는 연결을 수신하는 포트입니다. 따라서, 이 명령은 호스트의 포트 8080을 컨테이너 시스템의 포트 80에 바인딩합니다. 3. Docker Desktop 대시보드의 컨테이너 보기에 가서 공개된 포트를 확인합니다. 4. 컨테이너의 포트 열에서 링크를 선택하거나 브라우저에서 `http://localhost:8080`에 접속하여 웹사이트를 엽니다.

#### Use Docker Compose

이 예제에서는 Docker Compose를 사용하여 동일한 애플리케이션을 실행합니다.

1. 새 디렉토리를 만들고, 해당 디렉토리 안에 `compose.yaml` 파일을 생성합니다. 다음 내용을 추가합니다:

```yaml
services:
  app:
    image: docker/welcome-to-docker
    ports:
      - 8080:80
```

`ports` 구성은 포트 정의에 대해 여러 가지 구문 형식을 허용합니다. 이 경우, `HOST_PORT:CONTAINER_PORT` 형식을 사용하고 있습니다. 2. 이전 단계에서 생성한 디렉토리로 이동합니다. 3. 터미널에서 `docker compose up` 명령을 사용하여 애플리케이션을 시작합니다. 4. 브라우저에서 `http://localhost:8080`에 접속합니다.

### Additional resources

이 주제에 대해 더 깊이 알고 싶다면 다음 자료를 확인해 보세요:

- [docker container port CLI reference](https://docs.docker.com/engine/reference/commandline/port/)
- [Published ports](https://docs.docker.com/engine/userguide/networking/default_network/dockerlinks/#container-linking-and-networks)

### Next steps

이제 컨테이너 포트를 공개하고 노출하는 방법을 이해했으니, 다음으로 컨테이너 기본값을 재정의하는 방법을 알아보겠습니다.

- [컨테이너 기본값 재정의](#/get-started/docker-concepts/running-containers/publishing-ports.md)
