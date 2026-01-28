# Multi container apps

지금까지는, 단일 컨테이너 앱을 사용해 왔습니다. 하지만, 이제 애플리케이션 스택에 MySQL을 추가하게 됩니다. "MySQL은 어디에서 실행될까요? 동일한 컨테이너에 설치해야 할까요 아니면 별도로 실행해야 할까요?"라는 질문이 자주 발생합니다. 일반적으로, 각 컨테이너는 한 가지 작업을 잘 수행해야 합니다. 컨테이너를 개별적으로 실행해야 하는 몇 가지 이유는 다음과 같습니다 :

- API와 프런트엔드를 데이터베이스와는 다른 방식으로 확장해야 할 가능성이 높습니다.
- 개별 컨테이너를 사용하면 격리된 상태에서 버전을 관리하고 업데이트할 수 있습니다.
- 로컬에서는 데이터베이스용 컨테이너를 사용하지만, 프로덕션 환경에서는 데이터베이스용 관리형 서비스를 사용하고 싶을 수도 있습니다. 이때는 앱과 함께 데이터베이스 엔진을 제공하는 것을 원하지 않을 것입니다.
- 다수의 프로세스를 실행하는 것은 컨테이너 시작/종료에 복잡성을 추가하는 프로세스 관리자를 필요로 합니다(컨테이너는 하나의 프로세스만 시작).

이유는 더 있습니다. 그러므로, 아래 다이어그램처럼, 앱을 여러 컨테이너에서 실행하는 것이 가장 좋습니다.
![07-multi-container-diagram](https://docs.docker.com/get-started/workshop/images/multi-container.webp)

## Container networking

기본적으로, 컨테이너는 격리된 환경에서 실행되며 동일한 머신에 있는 다른 프로세스나 컨테이너에 대해 아무것도 알지 못한다는 것을 기억하세요. 그렇다면, 한 컨테이너가 다른 컨테이너와 통신하게 하려면 어떻게 해야 할까요? 답은 네트워킹에 있습니다. 두 컨테이너를 동일한 네트워크에 배치하면, 서로 통신할 수 있습니다.

## Start MySQL

컨테이너를 네트워크에 배치하는 방법에는 두 가지가 있습니다:

- 컨테이너를 시작할 때 네트워크를 할당합니다.
- 이미 실행 중인 컨테이너를 네트워크에 연결합니다.

다음 단계에서는, 먼저 네트워크를 생성한 다음 시작 시 MySQL 컨테이너를 연결할 것입니다.

1. 네트워크를 생성합니다.

   ```bash
   $ docker network create todo-app
   ```

2. MySQL 컨테이너를 시작하고 네트워크에 연결합니다. 또한 MySQL이 초기화할 몇 가지 환경 변수를 정의할 예정입니다. MySQL 환경 변수에 대해 자세히 알아보려면, [MySQL Docker Hub listing](https://hub.docker.com/_/mysql/?_gl=1*16mabtk*_ga*MjcxOTM2ODU5LjE3MTIxMzY5MzE.*_ga_XJWPQMJYHQ*MTc0NjI3MjczMy43Ni4xLjE3NDYyNzc1MTQuNi4wLjA.)의 "환경 변수(Environment Variables)" 섹션을 참조하세요.

   ```bash
   # Mac / Linux / Git Bash
   $ docker run -d \
     --network todo-app --network-alias mysql \
     -v todo-mysql-data:/var/lib/mysql \
     -e MYSQL_ROOT_PASSWORD=secret \
     -e MYSQL_DATABASE=todos \
     mysql:8.0

   # PowerShell
   $ docker run -d `
    --network todo-app --network-alias mysql `
    -v todo-mysql-data:/var/lib/mysql `
    -e MYSQL_ROOT_PASSWORD=secret `
    -e MYSQL_DATABASE=todos `
    mysql:8.0

   # Command Prompt
   $ docker run -d ^
    --network todo-app --network-alias mysql ^
    -v todo-mysql-data:/var/lib/mysql ^
    -e MYSQL_ROOT_PASSWORD=secret ^
    -e MYSQL_DATABASE=todos ^
    mysql:8.0
   ```

   이전 명령어에서 `--network-alias` 플래그를 확인할 수 있습니다. 이후 섹션에서 이 플래그에 대해 자세히 학습할 겁니다.

   > **Tip**
   >
   > 위 명령에서 `todo-mysql-data`라는 이름의 볼륨이 MySQL이 데이터를 저장하는 위치인 `/var/lib/mysql`에 마운트되어 있는 것을 확인할 수 있습니다. 하지만, `docker volume create` 명령을 실행하지 않았습니다. Docker는 명명된 볼륨을 사용하려는 의도를 인식하고 자동으로 생성합니다.

3. MySQL이 시작되고 실행 중인지 확인하기 위해, 데이터베이스에 연결하여 확인해보겠습니다.

   ```bash
   $ docker exec -it <mysql-container-id> mysql -p
   ```

   비밀번호 프롬프트가 나타나면 `secret`을 입력합니다. MySQL 셸에서 데이터베이스를 나열하고 `todos` 데이터베이스를 확인합니다.

   ```bash
   mysql> SHOW DATABASES;
   +--------------------+
   | Database           |
   +--------------------+
   | information_schema |
   | mysql              |
   | performance_schema |
   | sys                |
   | todos              |
   +--------------------+
   5 rows in set (0.00 sec)
   ```

4. MySQL 셸을 종료하여 머신의 셸로 돌아갑니다.

   ```bash
   mysql> exit
   ```

   이제 `todos` 데이터베이스가 생성되었고 사용할 준비가 되었습니다.

## Connect to MySQL

이제 MySQL이 실행 중인 것을 알았으니, 이를 사용할 수 있습니다. 하지만, 어떻게 사용할까요? 동일한 네트워크에서 다른 컨테이너를 실행하는 경우, 컨테이너를 어떻게 찾을 수 있을까요? 각 컨테이너에는 자체 IP 주소가 있다는 점을 기억하세요.

위 질문에 답하고 컨테이너 네트워킹을 더 잘 이해하기 위해, 네트워킹 문제를 해결하거나 디버깅하는 데 유용한 많은 도구가 포함된 `nicolaka/netshoot` 컨테이너를 사용해보겠습니다.

1. `nicolaka/netshoot` 컨테이너를 시작합니다. 위에서 생성한 동일한 네트워크에 연결하는 것을 잊지 마세요.

   ```bash
   $ docker run -it --network todo-app nicolaka/netshoot
   ```

2. 컨테이너 내부에서, 유용한 DNS 도구인 `dig` 명령을 사용합니다. `mysql` 호스트 이름을 조회합니다.

   ```bash
   $ dig mysql
   ```

   다음과 같은 출력이 나와야 합니다.

   ```bash
   ; <<>> DiG 9.18.8 <<>> mysql
   ;; global options: +cmd
   ;; Got answer:
   ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 32162
   ;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0
   ;; QUESTION SECTION:
   ;mysql.				IN	A
   ;; ANSWER SECTION:
   mysql.			600	IN	A	172.23.0.2
   ;; Query time: 0 msec
   ;; SERVER: 127.0.0.11#53(127.0.0.11)
   ;; WHEN: Tue Oct 01 23:47:24 UTC 2019
   ;; MSG SIZE  rcvd: 44
   ```

   "답변 섹션(ANSWER SECTION)"에서, `172.23.0.2`로 확인되는 `mysql`의 `A` 레코드를 확인할 수 있습니다(IP 주소는 다른 값을 가질 가능성이 높습니다). `mysql`은 일반적으로 유효한 호스트 이름이 아니지만, Docker는 해당 네트워크 별칭을 가진 컨테이너의 IP 주소로 확인할 수 있었습니다. 앞서 `--network-alias` 옵션을 사용했던 것을 기억하세요.

   이는 앱을 mysql이라는 호스트에 연결하기만 하면 데이터베이스와 통신할 수 있음을 뜻합니다.

## Run your app with MySQL

todo 앱은 MySQL 연결 설정을 지정하기 위한 몇 가지 환경 변수 설정을 지원합니다. 이는 다음과 같습니다:

- `MYSQL_HOST` - 실행 중인 MySQL 서버의 호스트 이름
- `MYSQL_USER` - 연결에 사용할 사용자 이름
- `MYSQL_PASSWORD` - 연결에 사용할 비밀번호
- `MYSQL_DB` - 연결 후 사용할 데이터베이스

> **Note**
>
> 개발 중에 환경 변수를 사용하여 연결 설정을 지정하는 것은 일반적으로 허용되지만, 프로덕션에서 애플리케이션을 실행할 때는 매우 권장되지 않습니다. Docker의 전 보안 리드였던 Diogo Monica는 이유를 설명하는 [훌륭한 블로그 포스트](https://diogomonica.com/2017/03/27/why-you-shouldnt-use-env-variables-for-secret-data/)를 작성했습니다.
>
> 더 안전한 방법은 컨테이너 오케스트레이션 프레임워크가 제공하는 시크릿 지원을 사용하는 것입니다. 대부분의 경우, 이러한 시크릿은 실행 중인 컨테이너에 파일로 마운트됩니다. 많은 앱(MySQL 이미지와 todo 앱 포함)또한 변수를 포함하는 파일을 가리키는 `_FILE` 접미사가 있는 환경 변수를 지원합니다.
>
> 예를 들어, `MYSQL_PASSWORD_FILE` 변수를 설정하면 앱에서 참조된 파일의 내용을 연결 비밀번호로 사용합니다. Docker는 이러한 환경 변수를 지원하기 위해 아무것도 하지 않습니다. 앱이 변수를 찾고 파일 내용을 가져올 수 있도록 알고 있어야 합니다.

이제 개발 준비가 된 컨테이너를 시작할 수 있습니다.

1. 컨테이너를 앱 네트워크에 연결하는 것 뿐만 아니라, 이전 환경 변수들을 각각 지정합니다. 이 명령을 실행할 때 `getting-started-app` 디렉토리에 있는지 확인하세요.

   ```bash
   # Mac / Linux
   $ docker run -dp 127.0.0.1:3000:3000 \
      -w /app -v "$(pwd):/app" \
      --network todo-app \
      -e MYSQL_HOST=mysql \
      -e MYSQL_USER=root \
      -e MYSQL_PASSWORD=secret \
      -e MYSQL_DB=todos \
      node:18-alpine \
      sh -c "yarn install && yarn run dev"

   # PowerShell
   $ docker run -dp 127.0.0.1:3000:3000 `
      -w /app -v "$(pwd):/app" `
      --network todo-app `
      -e MYSQL_HOST=mysql `
      -e MYSQL_USER=root `
      -e MYSQL_PASSWORD=secret `
      -e MYSQL_DB=todos `
      node:18-alpine `
      sh -c "yarn install && yarn run dev"

   # Command Prompt
   $ docker run -dp 127.0.0.1:3000:3000 ^
      -w /app -v "%cd%:/app" ^
      --network todo-app ^
      -e MYSQL_HOST=mysql ^
      -e MYSQL_USER=root ^
      -e MYSQL_PASSWORD=secret ^
      -e MYSQL_DB=todos ^
      node:18-alpine ^
      sh -c "yarn install && yarn run dev"

   # Git Bash
   $ docker run -dp 127.0.0.1:3000:3000 \
      -w //app -v "/$(pwd):/app" \
      --network todo-app \
      -e MYSQL_HOST=mysql \
      -e MYSQL_USER=root \
      -e MYSQL_PASSWORD=secret \
      -e MYSQL_DB=todos \
      node:18-alpine \
      sh -c "yarn install && yarn run dev"
   ```

2. 컨테이너의 로그를 보면 (`docker logs -f <container-id>`), MySQL 데이터베이스를 사용한다는 것을 나타내는 다음과 유사한 메시지가 표시됩니다.

   ```bash
   nodemon src/index.js
   [nodemon] 2.0.20
   [nodemon] to restart at any time, enter `rs`
   [nodemon] watching dir(s): *.*
   [nodemon] starting `node src/index.js`
   Connected to mysql db at host mysql
   Listening on port 3000
   ```

3. 브라우저에서 앱을 열고 할 일 목록에 몇 가지 항목을 추가합니다.

4. MySQL 데이터베이스에 연결하여 항목이 데이터베이스에 기록되고 있는지 확인합니다. 비밀번호는 `secret`임을 기억하세요.

   ```bash
   $ docker exec -it <mysql-container-id> mysql -p todos
   ```

   그리고 MySQL 셸에서, 다음을 실행합니다

   ```bash
   mysql> select * from todo_items;
   +--------------------------------------+--------------------+-----------+
   | id                                   | name               | completed |
   +--------------------------------------+--------------------+-----------+
   | c906ff08-60e6-44e6-8f49-ed56a0853e85 | Do amazing things! |         0 |
   | 2912a79e-8486-4bc3-a4c5-460793a575ab | Be awesome!        |         0 |
   +--------------------------------------+--------------------+-----------+
   ```

   테이블에는 여러분들의 아이템들이 있기 때문에 테이블이 다르게 보일 수 있습니다. 하지만 아이템이 거기에 보관되어 있는 것을 볼 수 있을 것입니다.

## Summary

이제 별도의 컨테이너에서 실행되는 외부 데이터베이스에 데이터를 저장하는 애플리케이션이 생겼습니다. 컨테이너 네트워킹 및 DNS를 사용한 서비스 검색에 대해 간략하게 알아보았습니다.

관련 정보:

- [docker CLI reference](https://docs.docker.com/reference/cli/docker/)
- [Networking overview](https://docs.docker.com/network/)

## Next steps

이 애플리케이션을 시작하는 데 필요한 모든 것에 압도당하는 느낌을 받기 시작했을 가능성이 높습니다. 네트워크를 생성하고, 컨테이너를 시작하고, 모든 환경 변수를 지정하고, 포트를 공개하는 등 여러 가지 작업을 해야 합니다. 기억해야 할 것이 너무 많아서 다른 사람에게 전달하기가 훨씬 더 어려워집니다.

다음 섹션에서는 Docker Compose에 대해 알아보겠습니다. Docker Compose를 사용하면 애플리케이션 스택을 훨씬 쉽게 공유하고, 다른 사람들이 간단한 명령 하나로 스택을 실행하도록 할 수 있습니다.

<button-component href="/#/get-started/workshop/08_using_compose" title="Use Docker Compose" />