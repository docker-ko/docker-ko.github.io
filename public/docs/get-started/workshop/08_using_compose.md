# Use Docker Compose

[Docker Compose](https://docs.docker.com/compose/)는 다중 컨테이너 애플리케이션을 정의하고 공유하는 데 도움이 되는 도구입니다. Compose를 사용하면, YAML 파일을 생성하여 서비스를 정의하고 단일 명령으로 모든 것을 시작하거나 종료할 수 있습니다.

Compose를 사용하는 큰 장점은 애플리케이션 스택을 파일로 정의하고, 프로젝트 저장소의 루트에 보관(버전 제어 가능)하여 다른 사람이 쉽게 프로젝트에 기여할 수 있게 한다는 것입니다. 누군가는 저장소를 복제하고 Compose를 사용하여 앱을 시작하기만 하면 됩니다. 실제로, GitHub/GitLab에서 많은 프로젝트가 정확히 이렇게 하고 있는 것을 볼 수 있습니다.

## Create the Compose file

`getting-started-app` 디렉터리에서, `compose.yaml`이라는 파일을 생성합니다.

```text
├── getting-started-app/
│ ├── Dockerfile
│ ├── compose.yaml
│ ├── node_modules/
│ ├── package.json
│ ├── spec/
│ ├── src/
│ └── yarn.lock
```

## Define the app service

[6장](07_multi_container.md)에서는, 다음 명령을 사용하여 애플리케이션 서비스를 시작했습니다 :

```bash
$ docker run -dp 127.0.0.1:3000:3000 \
  -w /app -v "$(pwd):/app" \
  --network todo-app \
  -e MYSQL_HOST=mysql \
  -e MYSQL_USER=root \
  -e MYSQL_PASSWORD=secret \
  -e MYSQL_DB=todos \
  node:18-alpine \
  sh -c "yarn install && yarn run dev"
```

이제 이 서비스를 `compose.yaml` 파일에 정의하겠습니다.

1.  텍스트 또는 코드 편집기에서 `compose.yaml`을 열고, 애플리케이션의 일부로 실행하려는 첫 번째 서비스(또는 컨테이너)의 이름과 이미지를 정의하는 것부터 시작합니다. 이름은 자동으로 네트워크 별칭이 될 것이며, 이는 MySQL 서비스를 정의할 때 유용합니다.

    ```yaml
    services:
      app:
      image: node:18-alpine
    ```

2.  일반적으로, `command`는 `image` 정의 근처에서 볼 수 있지만, 순서에 대한 요구 사항은 없습니다. `compose.yaml` 파일에 `command`를 추가합니다.

    ```yaml
    services:
      app:
      image: node:18-alpine
      command: sh -c "yarn install && yarn run dev"
    ```

3.  이제 명령의 `-p 127.0.0.1:3000:3000` 부분을 마이그레이션하여 서비스의 `ports`를 정의합니다.

    ```yaml
    services:
      app:
      image: node:18-alpine
      command: sh -c "yarn install && yarn run dev"
      ports:
        - 127.0.0.1:3000:3000
    ```

4.  다음으로, 작업 디렉터리 설정(`-w /app`)과 볼륨 매핑(`-v "$(pwd):/app"`)을 `working_dir`와 `volumes` 정의를 사용하여 마이그레이션합니다.

    Docker Compose 볼륨 정의의 한 가지 장점은 현재 디렉터리에서 상대 경로를 사용할 수 있다는 것입니다.

    ```yaml
    services:
      app:
      image: node:18-alpine
      command: sh -c "yarn install && yarn run dev"
      ports:
        - 127.0.0.1:3000:3000
      working_dir: /app
      volumes:
        - ./:/app
    ```

5.  마지막으로, `environment` 키를 사용하여 환경 변수 정의를 마이그레이션해야 합니다.

    ```yaml
    services:
      app:
      image: node:18-alpine
      command: sh -c "yarn install && yarn run dev"
      ports:
        - 127.0.0.1:3000:3000
      working_dir: /app
      volumes:
        - ./:/app
      environment:
        MYSQL_HOST: mysql
        MYSQL_USER: root
        MYSQL_PASSWORD: secret
        MYSQL_DB: todos
    ```

### Define the MySQL service

이제, MySQL 서비스를 정의할 차례입니다. 해당 컨테이너를 위해 사용했던 이전 명령은 다음과 같습니다 :

```bash
$ docker run -d \
  --network todo-app --network-alias mysql \
  -v todo-mysql-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=todos \
  mysql:8.0
```

1. 먼저 새 서비스를 정의하고 자동으로 네트워크 별칭을 얻을 수 있도록 `mysql`이라고 이름을 지정합니다. 또한 사용할 이미지도 지정합니다.

   ```yaml
   services:
     app:
       # 앱 서비스 정의
     mysql:
       image: mysql:8.0
   ```

2. 다음으로, 볼륨 매핑을 정의합니다. `docker run`을 사용할 때, Docker는 명명된 볼륨을 자동으로 생성했습니다. 그러나, Compose에서 실행할 때는 이런 일이 발생하지 않습니다. 최상위 `volumes:` 섹션에서 볼륨을 정의한 다음 서비스 구성에서 마운트포인트를 지정해야 합니다. 간단히 볼륨 이름만 제공하면, 기본 옵션이 사용됩니다.

   ```yaml
   services:
     app:
       # 앱 서비스 정의
     mysql:
       image: mysql:8.0
       volumes:
         - todo-mysql-data:/var/lib/mysql

   volumes:
     todo-mysql-data:
   ```

3. 마지막으로, 환경 변수들을 명시해야 합니다.

   ```yaml
   services:
     app:
       # 앱 서비스 정의
     mysql:
       image: mysql:8.0
       volumes:
         - todo-mysql-data:/var/lib/mysql
       environment:
       MYSQL_ROOT_PASSWORD: secret
       MYSQL_DATABASE: todos

     volumes:
       todo-mysql-data:
   ```

이 시점에서, 전체 `compose.yaml`은 다음과 같아야 합니다 :

    ```yaml
    services:
        app:
            image: node:18-alpine
            command: sh -c "yarn install && yarn run dev"
            ports:
                - 127.0.0.1:3000:3000
            working_dir: /app
            volumes:
                - ./:/app
            environment:
                MYSQL_HOST: mysql
                MYSQL_USER: root
                MYSQL_PASSWORD: secret
                MYSQL_DB: todos
        mysql:
            image: mysql:8.0
            volumes:
                - todo-mysql-data:/var/lib/mysql
            environment:
                MYSQL_ROOT_PASSWORD: secret
                MYSQL_DATABASE: todos

    volumes:
        todo-mysql-data:
    ```

## Run the application stack

이제 `compose.yaml` 파일이 있으므로, 애플리케이션을 시작할 수 있습니다.

1. 먼저 컨테이너의 다른 복사본이 실행 중이 아닌지 확인하세요. `docker ps`를 사용하여 컨테이너를 나열하고 `docker rm -f <ids>`를 사용하여 제거합니다.

2. `docker compose up` 명령을 사용하여 애플리케이션 스택을 시작합니다. 모든 것을 백그라운드에서 실행하려면 `-d` 플래그를 추가하세요.

   ```bash
   $ docker compose up -d
   ```

   이전 명령을 실행하면, 다음과 같은 출력이 표시됩니다 :

   ```bash
   Creating network "app_default" with the default driver
   Creating volume "app_todo-mysql-data" with default driver
   Creating app_app_1   ... done
   Creating app_mysql_1 ... done
   ```

   Docker Compose가 볼륨과 네트워크를 생성했음을 알 수 있습니다. 기본적으로, Docker Compose는 애플리케이션 스택에 대한 네트워크를 자동으로 생성합니다(Compose 파일에서 네트워크를 정의하지 않은 이유).

3. `docker compose logs -f` 명령을 사용하여 로그를 확인합니다. 각 서비스의 로그가 단일 스트림으로 인터리브됩니다. 이는 타이밍 관련 문제를 감시할 때 매우 유용합니다. `-f` 플래그는 로그를 따라가므로 생성될 때 실시간 출력을 제공합니다.

   이미 명령을 실행한 경우 다음과 같은 출력이 표시됩니다 :

   ```bash
   mysql-1  | 2023-01-01 12:34:56+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.0.32-1.el8 started.
   app-1    | yarn install v1.22.19
   app-1    | [1/4] Resolving packages...
   app-1    | [2/4] Fetching packages...
   ```

   줄 시작 부분에 서비스 이름이 표시되어(종종 색상이 지정됨) 메시지를 구분하는 데 도움이 됩니다. 특정 서비스의 로그를 보려면, 로그 명령 끝에 서비스 이름을 추가할 수 있습니다(예: `docker compose logs -f app`).

4. 이 시점에서, 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 앱을 열고 실행 중인 것을 볼 수 있어야 합니다.

## See the app stack in Docker Desktop Dashboard

Docker Desktop Dashboard를 보면, **getting-started-app** 이라는 그룹이 있습니다. 이는 Docker Compose의 프로젝트 이름이며 컨테이너를 함께 그룹화하는 데 사용됩니다. 기본적으로, 프로젝트 이름은 단순히 `compose.yaml`이 있는 디렉터리의 이름입니다.

스택을 확장하면, Compose 파일에 정의한 두 개의 컨테이너가 표시됩니다. 이름도 좀 더 설명이 되어 있으며, `<서비스-이름>-<복제본-번호>` 패턴을 따릅니다. 따라서, 어떤 컨테이너가 앱이고 어떤 컨테이너가 mysql 데이터베이스인지 빠르게 확인할 수 있습니다.

## Tear it all down

모두 종료할 준비가 되면, 간단히 `docker compose down`을 실행하거나 전체 앱에 대해 Docker Desktop Dashboard에서 휴지통을 클릭하세요. 컨테이너가 중지되고 네트워크가 제거됩니다.

> **Warning**
>
> 기본적으로, compose 파일의 명명된(named) 볼륨은 `docker compose down`을 실행할 때 제거되지 않습니다. 볼륨을 제거하려면, `--volumes` 플래그를 추가해야 합니다.
>
> Docker Desktop Dashboard는 앱 스택을 삭제할 때 볼륨을 제거하지 않습니다.

## Summary

이 섹션에서는, Docker Compose에 대해 학습하고 이것이 다중 서비스 애플리케이션을 정의하고 공유하는 방법을 간소화하는 데 어떻게 도움이 되는지 배웠습니다.

관련 정보:

- [Compose overview](https://docs.docker.com/compose/)
- [Compose file reference](https://docs.docker.com/reference/compose-file/)
- [Compose CLI reference](https://docs.docker.com/reference/cli/docker/compose/)

## Next steps

다음으로, Dockerfile을 개선하는 데 사용할 수 있는 몇 가지 모범 사례에 대해 알아보겠습니다.

<button-component href="/#/get-started/workshop/09_image_best" title="Image-building best practices" />