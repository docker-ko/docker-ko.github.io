# Overriding container defaults=

[유튜브 링크](https://youtu.be/PFszWK3BB8I)

## Explanation

Docker 컨테이너가 시작되면 애플리케이션이나 명령을 실행합니다. 컨테이너는 이미지 구성에서 이 실행 파일(스크립트 또는 파일)을 가져옵니다. 컨테이너에는 일반적으로 잘 작동하는 기본 설정이 제공되지만 필요한 경우 변경할 수 있습니다. 이러한 조정은 컨테이너의 프로그램이 원하는 대로 정확하게 실행되는 데 도움이 됩니다.

예를 들어, 표준 포트에서 수신 대기하는 기존 데이터베이스 컨테이너가 있고 동일한 데이터베이스 컨테이너의 새 인스턴스를 실행하려는 경우, 새 컨테이너가 수신 대기하는 포트 설정을 변경하여 기존 컨테이너와 충돌하지 않도록 할 수 있습니다. 때로는 프로그램에 많은 작업 부하를 처리하기 위해 더 많은 리소스가 필요한 경우 컨테이너에서 사용할 수 있는 메모리를 늘리거나 프로그램이 제대로 작동하는 데 필요한 특정 구성 세부 정보를 제공하도록 환경 변수를 설정할 수 있습니다.

`docker run` 명령은 이러한 기본값을 재정의하고 컨테이너의 동작을 원하는 대로 조정하는 강력한 방법을 제공합니다. 이 명령은 컨테이너 동작을 즉석에서 사용자 지정할 수 있는 여러 플래그를 제공합니다.

이를 달성할 수 있는 몇 가지 방법은 다음과 같습니다.

### Overriding the network ports

때로는 개발 및 테스트 목적으로 별도의 데이터베이스 인스턴스를 사용하고 싶을 수 있습니다. 이러한 데이터베이스 인스턴스를 동일한 포트에서 실행하면 충돌이 발생할 수 있습니다. `docker run`에서 `-p` 옵션을 사용하여 컨테이너 포트를 호스트 포트에 매핑하면 충돌 없이 컨테이너의 여러 인스턴스를 실행할 수 있습니다.

```bash
$ docker run -d -p HOST_PORT:CONTAINER_PORT postgres
```

### Setting environment variables

이 옵션은 컨테이너 내부에 환경 변수 `foo`를 값 `bar`로 설정합니다.

```bash
$ docker run -e foo=bar postgres env
```

다음과 같은 출력이 표시됩니다:

```bash
HOSTNAME=2042f2e6ebe4
foo=bar
```

> #### Tip
>
> `.env` 파일은 수많은 `-e` 플래그로 명령줄을 어지럽히지 않고 Docker 컨테이너에 대한 환경 변수를 설정하는 편리한 방법으로 작용합니다. `.env` 파일을 사용하려면 `docker run` 명령과 함께 `--env-file` 옵션을 전달할 수 있습니다.
>
> ```bash
> $ docker run --env-file .env postgres env
> ```

### Restricting the container to consume the resources

`docker run` 명령과 함께 `--memory` 및 `--cpus` 플래그를 사용하여 컨테이너가 사용할 수 있는 CPU 및 메모리 양을 제한할 수 있습니다. 예를 들어, Python API 컨테이너에 대한 메모리 제한을 설정하여 호스트에서 과도한 리소스를 소비하지 않도록 할 수 있습니다. 명령은 다음과 같습니다.

```bash
$ docker run -e POSTGRES_PASSWORD=secret --memory="512m" --cpus="0.5" postgres
```

이 명령은 컨테이너 메모리 사용량을 512MB로 제한하고 절반 코어에 대한 CPU 할당량을 0.5로 정의합니다.

> #### Monitor the real-time resource usage
>
> `docker stats` 명령을 사용하여 실행 중인 컨테이너의 실시간 리소스 사용량을 모니터링할 수 있습니다. 이를 통해 할당된 리소스가 충분한지 또는 조정이 필요한지 이해하는 데 도움이 됩니다.

이러한 `docker run` 플래그를 효과적으로 사용하면 컨테이너화된 애플리케이션의 동작을 특정 요구 사항에 맞게 조정할 수 있습니다.

## Try it out

이 실습 가이드에서는 `docker run` 명령을 사용하여 컨테이너 기본값을 재정의하는 방법을 알아봅니다

1. 도커 데스크탑을 [다운로드 및 설치](https://docs.docker.com/get-started/get-docker/)합니다

### Run multiple instance of the Postgres database

1. 다음 명령어와 함께 [Postgres image](https://hub.docker.com/_/postgres?_gl=1*o45rlj*_gcl_au*MjczODgxODI4LjE3Mzg0NzA0NDI.*_ga*MjEyODM1MDY2OC4xNzIwMzEyNzQ5*_ga_XJWPQMJYHQ*MTc0MTMwMDg1MS45MC4xLjE3NDEzMDMyOTcuNTcuMC4w)를 사용해 컨테이너를 시작합니다:

   ```bash
   $ docker run -d -e POSTGRES_PASSWORD=secret -p 5432:5432 postgres
   ```

   이렇게 하면 Postgres 데이터베이스가 백그라운드에서 시작되어 표준 컨테이너 포트 `5432`에서 수신하고 호스트 머신의 포트 `5432`에 매핑됩니다.

2. 다른 포트로 매핑되는 2번째 Postgres 컨테이너를 시작합니다

   ```bash
   $ docker run -d -e POSTGRES_PASSWORD=secret -p 5433:5432 postgres
   ```

   이렇게 하면 백그라운드에서 또 다른 Postgres 컨테이너가 시작되어 컨테이너의 표준 postgres 포트 `5432`에서 수신하지만 호스트 머신의 포트 `5433`에 매핑됩니다. 이 새로운 컨테이너가 기존 실행 컨테이너와 충돌하지 않도록 하기 위해 호스트 포트를 재정의합니다.

   3. Docker Desktop Dashboard의 **Containers** view로 이동하여 두 컨테이너가 모두 실행 중인지 확인합니다.
      ![Run multiple instance of the Postgres database-3](https://docs.docker.com/get-started/docker-concepts/running-containers/images/running-postgres-containers.webp)

### Run Postgres container in a controlled network

기본적으로 컨테이너는 실행할 때 브릿지 네트워크라는 특수 네트워크에 자동으로 연결됩니다. 이 브릿지 네트워크는 가상 브릿지처럼 작동하여 동일한 호스트의 컨테이너가 외부 세계 및 다른 호스트와 격리된 상태로 유지하면서 서로 통신할 수 있도록 합니다. 대부분의 컨테이너 상호 작용에 편리한 시작점입니다. 그러나, 특정 시나리오의 경우, 네트워크 구성을 더 많이 제어하고 싶을 수 있습니다.

여기서 사용자 지정 네트워크가 등장합니다. `docker run` 명령으로 `--network` 플래그를 전달하여 사용자 지정 네트워크를 만듭니다. `--network` 플래그가 없는 모든 컨테이너는 기본 브리지 네트워크에 연결됩니다.

다음 단계에 따라 Postgres 컨테이너를 사용자 지정 네트워크에 연결하는 방법을 알아보세요

1. 다음 명령을 사용하여 새 사용자 지정 네트워크를 만듭니다:

   ```bash
   $ docker network create mynetwork
   ```

2. 다음 명령을 실행하여 네트워크를 확인하세요:

   ```bash
   $ docker network ls
   ```

   이 명령은 새로 생성된 "mynetwork"를 포함한 모든 네트워크를 나열합니다.

3. 다음 명령을 사용하여 Postgres를 사용자 지정 네트워크에 연결합니다:

   ```bash
   $ docker run -d -e POSTGRES_PASSWORD=secret -p 5434:5432 --network mynetwork postgres
   ```

   이렇게 하면 백그라운드에서 Postgres 컨테이너가 시작되고, 호스트 포트 `5434`에 매핑되고, `mynetwork` 네트워크에 연결됩니다. `--network` 매개변수를 전달하여 컨테이너 기본값을 재정의하여 다른 컨테이너와 더 나은 격리 및 통신을 위해 컨테이너를 사용자 지정 Docker 네트워크에 연결했습니다. `docker network inspect` 명령을 사용하여 컨테이너가 이 새로운 브리지 네트워크에 연결되어 있는지 확인할 수 있습니다.

   > #### Key difference between default bridge and custom networks
   >
   > a. DNS 해결: 기본적으로 기본 브릿지 네트워크에 연결된 컨테이너는 서로 통신할 수 있지만 IP 주소로만 가능합니다. (레거시로 간주되는 `--link` 옵션을 사용하지 않는 한). 다양한 [기술적 단점](https://docs.docker.com/engine/network/drivers/bridge/#differences-between-user-defined-bridges-and-the-default-bridge)으로 인해 프로덕션 사용에는 권장되지 않습니다. 사용자 지정 네트워크에서 컨테이너는 이름이나 별칭으로 서로를 확인할 수 있습니다.
   > b. 격리: `--network`가 지정되지 않은 모든 컨테이너는 기본 브리지 네트워크에 연결되므로 관련 없는 컨테이너가 통신할 수 있으므로, 위험할 수 있습니다. 사용자 지정 네트워크를 사용하면 해당 네트워크에 연결된 컨테이너만 통신할 수 있는 범위가 지정된 네트워크가 제공되므로 더 나은 격리가 제공됩니다.

### Manage the resources

기본적으로 컨테이너는 리소스 사용에 제한이 없습니다. 그러나 공유 시스템에서는 리소스를 효과적으로 관리하는 것이 중요합니다. 실행 중인 컨테이너가 호스트 머신의 메모리를 너무 많이 소모하지 않도록 하는 것이 중요합니다.

여기서 docker run 명령이 다시 빛을 발합니다. `--memory` 및 `--cpus`와 같은 플래그를 제공하여 컨테이너가 사용할 수 있는 CPU 및 메모리 양을 제한합니다.

```bash
$ docker run -d -e POSTGRES_PASSWORD=secret --memory="512m" --cpus=".5" postgres
```

`--cpus` 플래그는 컨테이너의 CPU 할당량을 지정합니다. 여기서는 CPU 코어의 절반(0.5)으로 설정되고 `--memory` 플래그는 컨테이너의 메모리 제한을 지정합니다. 이 경우 512MB로 설정됩니다.

### Override the default CMD and ENTRYPOINT in Docker Compose

특히 Docker Compose를 사용할 때, Docker 이미지에 정의된 기본 명령(`CMD`)이나 진입점(`ENTRYPOINT`)을 재정의해야 할 때가 있습니다.

1. 다음 내용으로 `compose.yml` 파일을 만듭니다:

   ```yaml
   services:
   postgres:
     image: postgres
     entrypoint: ['docker-entrypoint.sh', 'postgres']
     command: ['-h', 'localhost', '-p', '5432']
     environment:
     POSTGRES_PASSWORD: secret
   ```

   Compose 파일은 공식 Postgres 이미지를 사용하는 `postgres`라는 서비스를 정의하고, 진입점 스크립트를 설정하고, 비밀번호 인증으로 컨테이너를 시작합니다.

2. 다음 명령을 실행하여 서비스를 시작합니다:

   ```bash
   $ docker compose up -d
   ```

   이 명령은 Docker Compose 파일에 정의된 Postgres 서비스를 시작합니다.

3. Docker Desktop Dashboard로 인증을 확인하세요:

   Docker Desktop Dashboard를 열고 **Postgres** 컨테이너를 선택한 다음 **Exec**를 선택하여 컨테이너 셸에 들어갑니다. 다음 명령을 입력하여 Postgres 데이터베이스에 연결할 수 있습니다.

   ```shell
    # psql -U postgres
   ```

   ![postgres-exec](https://docs.docker.com/get-started/docker-concepts/running-containers/images/exec-into-postgres-container.webp)

   > #### Note
   >
   > PostgreSQL 이미지는 로컬에서 신뢰 인증을 설정하므로 로컬호스트(동일한 컨테이너 내부)에서 연결할 때 비밀번호가 필요하지 않다는 것을 알 수 있습니다. 그러나 다른 호스트/컨테이너에서 연결하는 경우 비밀번호가 필요합니다.

### Override the default CMD and ENTRYPOINT with `docker run`

다음 명령을 사용하여 `docker run` 명령을 직접 사용하여 기본값을 재정의할 수도 있습니다:

```bash
$ docker run -e POSTGRES_PASSWORD=secret postgres docker-entrypoint.sh -h localhost -p 5432
```

이 명령은 Postgres 컨테이너를 실행하고, 비밀번호 인증을 위한 환경 변수를 설정하고, 기본 시작 명령을 재정의하고, 호스트 이름 및 포트 매핑을 구성합니다.

## Additional resources

- [Ways to set environment variables with Compose](https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/)
- [What is a container](#/get-started/docker-concepts/the-basics/what-is-a-container.md)

## Next steps

이제 컨테이너 기본값을 재정의하는 방법을 알아보았으니, 컨테이너 데이터를 유지하는 방법을 알아보겠습니다.

[Persisting container data](#/get-started/docker-concepts/running-containers/persisting-container-data)
