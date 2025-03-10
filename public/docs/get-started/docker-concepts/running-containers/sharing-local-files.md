# Sharing local files with containers

[유튜브 링크](https://youtu.be/2dAzsVg3Dek)

## Explanation

각 컨테이너는 호스트 머신에 미리 설치된 종속성에 의존하지 않고도 작동하는 데 필요한 모든 것을 갖추고 있습니다. 컨테이너는 격리되어 실행되므로 호스트와 다른 컨테이너에 미치는 영향이 최소화됩니다. 이러한 격리에는 주요 이점이 있습니다: 컨테이너는 호스트 시스템 및 다른 컨테이너와의 충돌을 최소화합니다. 그러나, 이러한 격리는 컨테이너가 기본적으로 호스트 머신의 데이터에 직접 액세스할 수 없음을 의미하기도 합니다.

호스트 시스템의 파일에 저장된 구성 설정에 액세스해야 하는 웹 애플리케이션 컨테이너가 있는 시나리오를 생각해보세요. 이 파일에는 데이터베이스 자격 증명이나 API 키와 같은 중요한 데이터가 포함될 수 있습니다. 이러한 중요한 정보를 컨테이너 이미지에 직접 저장하면, 특히 이미지 공유 중에 보안 위험이 발생합니다. 이러한 과제를 해결하기 위해 Docker는 컨테이너 격리와 호스트 머신의 데이터 간의 격차를 메우는 스토리지 옵션을 제공합니다.

Docker는 호스트 머신과 컨테이너 간에 데이터를 유지하고 파일을 공유하기 위한 두 가지 기본 스토리지 옵션을 제공합니다: 볼륨과 바인드 마운트

### Volume versus bind mounts

컨테이너 내부에서 생성되거나 수정된 ​​데이터를 컨테이너 실행이 중지된 후에도 지속되도록 하려면 볼륨을 사용합니다. 볼륨과 사용 사례에 대해 자세히 알아보려면 [컨테이너 데이터 지속](#/get-started/docker-concepts/running-containers/persisting-container-data.md)을 참조하세요.

구성 파일이나 개발 코드와 같이 컨테이너와 직접 공유하려는 호스트 시스템의 특정 파일이나 디렉토리가 있는 경우 바인드 마운트를 사용합니다. 이는 호스트와 컨테이너 간에 공유를 위한 직접 포털을 여는 것과 같습니다. 바인드 마운트는 호스트와 컨테이너 간의 실시간 파일 액세스 및 공유가 중요한 개발 환경에 이상적입니다.

### Sharing files between a host and container

`docker run` 명령과 함께 사용되는 `-v`(또는 `--volume`) 및 `--mount` 플래그는 로컬 머신(호스트)과 Docker 컨테이너 간에 파일이나 디렉토리를 공유할 수 있도록 합니다. 그러나 동작과 사용법에는 몇 가지 주요 차이점이 있습니다.

`-v` 플래그는 기본 볼륨 또는 바인드 마운트 작업에 더 간단하고 편리합니다. `-v` 또는 `--volume`을 사용할 때 호스트 위치가 없으면 디렉토리가 자동으로 생성됩니다.

프로젝트를 진행하는 개발자라고 가정해 보겠습니다. 개발 머신에 코드가 있는 소스 디렉토리가 있습니다. 코드를 컴파일하거나 빌드하면 생성된 아티팩트(컴파일된 코드, 실행 파일, 이미지 등)가 소스 디렉토리 내의 별도 하위 디렉토리에 저장됩니다. 다음 예에서 이 하위 디렉토리는 `/HOST/PATH`입니다. 이제 애플리케이션을 실행하는 Docker 컨테이너 내에서 이러한 빌드 아티팩트에 액세스할 수 있게 하려고 합니다. 또한 코드를 다시 빌드할 때마다 컨테이너가 최신 빌드 아티팩트에 자동으로 액세스하도록 하려고 합니다.

다음은 `docker run`을 사용하여 바인드 마운트로 컨테이너를 시작하고 이를 컨테이너 파일 위치에 매핑하는 방법입니다.

```bash
$ docker run -v /HOST/PATH:/CONTAINER/PATH -it nginx
```

`--mount` 플래그는 보다 고급 기능과 세부적인 제어를 제공하여 복잡한 마운트 시나리오나 프로덕션 배포에 적합합니다. `--mount`를 사용하여 Docker 호스트에 아직 없는 파일이나 디렉토리를 바인드 마운트하는 경우 docker run 명령은 자동으로 생성하지 않고 오류를 생성합니다.

```bash
$ docker run --mount type=bind,source=/HOST/PATH,target=/CONTAINER/PATH,readonly nginx
```

> #### Note
>
> Docker는 `-v` 대신 `--mount` 구문을 사용할 것을 권장합니다. 이는 마운팅 프로세스에 대한 더 나은 제어를 제공하고 누락된 디렉토리로 인한 잠재적 문제를 방지합니다.

### File permissions for Docker access to host files

바인드 마운트를 사용할 때는 Docker가 호스트 디렉토리에 액세스하는 데 필요한 권한이 있는지 확인하는 것이 중요합니다. 읽기/쓰기 권한을 부여하려면 컨테이너 생성 중에 `:ro` 플래그(읽기 전용) 또는 `:rw`(읽기-쓰기)를 `-v` 또는 `--mount` 플래그와 함께 사용할 수 있습니다. 예를 들어, 다음 명령은 읽기-쓰기 액세스 권한을 부여합니다.

```bash
$ docker run -v HOST-DIRECTORY:/CONTAINER-DIRECTORY:rw nginx
```

읽기 전용 바인드 마운트는 컨테이너가 호스트에 마운트된 파일에 읽기 전용으로 액세스할 수 있게 하지만, 파일을 변경하거나 삭제할 수는 없습니다. 읽기-쓰기 바인드 마운트를 사용하면 컨테이너가 마운트된 파일을 수정하거나 삭제할 수 있으며, 이러한 변경이나 삭제는 호스트 시스템에도 반영됩니다. 읽기 전용 바인드 마운트는 호스트의 파일이 컨테이너에 의해 실수로 수정되거나 삭제되지 않도록 보장합니다.

> #### Synchronized File Share
>
> 코드베이스가 커짐에 따라 바인드 마운트와 같은 기존 파일 공유 방법은 비효율적이거나 느릴 수 있습니다. 특히 파일에 자주 액세스해야 하는 개발 환경에서는 더욱 그렇습니다. [동기화된 파일 공유](https://docs.docker.com/desktop/features/synchronized-file-sharing/)는 동기화된 파일 시스템 캐시를 활용하여 바인드 마운트 성능을 개선합니다. 이 최적화는 호스트와 가상 머신(VM) 간의 파일 액세스가 빠르고 효율적임을 보장합니다.

## Try it out

이 실습 가이드에서는 호스트와 컨테이너 간에 파일을 공유하기 위해 바인드 마운트를 생성하고 사용하는 방법을 연습합니다.

### Run a container

1. 도커 데스크탑을 [다운로드 및 설치](https://docs.docker.com/get-started/get-docker/)합니다.
2. 다음 명령으로 [httpd](https://hub.docker.com/_/httpd?_gl=1*1ehybth*_gcl_au*MjczODgxODI4LjE3Mzg0NzA0NDI.*_ga*MjEyODM1MDY2OC4xNzIwMzEyNzQ5*_ga_XJWPQMJYHQ*MTc0MTQwODE0NC45NC4wLjE3NDE0MDgxNDQuNjAuMC4w) 이미지를 사용하여 컨테이너를 시작합니다.

   ```bash
   $ docker run -d -p 8080:80 --name my_site httpd:2.4
   ```

   이렇게 하면 백그라운드에서 `httpd` 서비스가 시작되고 호스트의 포트 `8080`에 웹 페이지가 게시됩니다.

3. 브라우저를 열고 [http://localhost:8080](http://localhost:8080/)에 접속하거나 curl 명령어를 사용하여 제대로 작동하는지 확인하세요.
   ```bash
   $ curl localhost:8080
   ```

### Use a bind mount

바인드 마운트를 사용하면 호스트 컴퓨터의 구성 파일을 컨테이너 내의 특정 위치에 매핑할 수 있습니다. 이 예시에서는 바인드 마운트를 사용하여 웹 페이지의 모양과 느낌을 변경하는 방법을 살펴보겠습니다.

1.  Docker Desktop Dashboard를 사용하여 기존 컨테이너를 삭제합니다:
    ![use-a-bind-mount](https://docs.docker.com/get-started/docker-concepts/running-containers/images/delete-httpd-container.webp)
2.  호스트 시스템에 `public_html`이라는 새 디렉토리를 만듭니다.
    ```bash
    $ mkdir public_html
    ```
3.  새로 만든 디렉토리 `public_html`로 이동하여 다음 내용이 있는 `index.html`이라는 파일을 만듭니다. 이것은 친근한 고래가 여러분을 환영하는 간단한 웹페이지를 만드는 기본 HTML 문서입니다.

    ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>My Website with a Whale & Docker!</title>
      </head>
      <body>
        <h1>Whalecome!!</h1>
        <p>Look! There's a friendly whale greeting you!</p>
        <pre id="docker-art">
            ##         .
            ## ## ##        ==
            ## ## ## ## ##    ===
            /"""""""""""""""""\___/ ===
            {                       /  ===-
            \______ O           __/
            \    \         __/
            \____\_______/
    
            Hello from Docker!
            </pre
        >
      </body>
    </html>
    ```

4.  컨테이너를 실행할 시간입니다. `--mount`와 `-v` 예제는 동일한 결과를 생성합니다. 첫 번째를 실행한 후 `my_site` 컨테이너를 제거하지 않는 한 두 가지를 모두 실행할 수 없습니다.

    - #### `-v`
      ```bash
      $ docker run -d --name my_site -p 8080:80 -v .:/usr/local/apache2/htdocs/ httpd:2.4
      ```
    - #### `--mount`
      ```bash
      $ docker run -d --name my_site -p 8080:80 --mount type=bind,source=./,target=/usr/local/apache2/htdocs/ httpd:2.4
      ```

    > #### Tip
    >
    > Windows PowerShell에서 `-v` 또는 `--mount` 플래그를 사용할 때는 `./` 대신 디렉토리의 절대 경로를 제공해야 합니다. 이는 PowerShell이 ​​bash(Mac 및 Linux 환경에서 일반적으로 사용됨)와 다르게 상대 경로를 처리하기 때문입니다.

    이제 모든 것이 정상적으로 실행되고 있으므로, [http://localhost:8080](http://localhost:8080/)을 통해 사이트에 접속하여 친근한 고래가 환영해주는 새로운 웹페이지를 확인할 수 있습니다.

### Access the file on the Docker Desktop Dashboard

1. 컨테이너 내부의 마운트된 파일을 보려면 컨테이너의 **Files** 탭을 선택한 다음 `/usr/local/apache2/htdocs/` 디렉토리 내부의 파일을 선택합니다. 그런 다음 **파일 편집기 열기**를 선택합니다.
   ![access-the-file-on-the-docker-desktop-dashboard-1](https://docs.docker.com/get-started/docker-concepts/running-containers/images/mounted-files.webp)
2. 호스트에서 파일을 삭제하고 컨테이너에서도 파일이 삭제되었는지 확인합니다. Docker Desktop Dashboard의 **Files**에서 파일이 더 이상 존재하지 않음을 알 수 있습니다.
   ![access-the-file-on-the-docker-desktop-dashboard-2](https://docs.docker.com/get-started/docker-concepts/running-containers/images/deleted-files.webp)
3. 호스트 시스템에서 HTML 파일을 다시 만들고 Docker Desktop Dashboard의 **Containers** 아래 **Files** 탭에 해당 파일이 다시 나타나는지 확인합니다. 이제 사이트에도 액세스할 수 있을 것입니다.

### Stop your container

컨테이너는 멈출 때까지 계속 실행됩니다.

1. Docker Desktop Dashboard에서 **Containers** 뷰로 이동합니다.
2. 중지하고 싶은 컨테이너를 찾습니다.
3. Actions열에 있는 Delete 버튼을 선택합니다.

![stop-the-container](https://docs.docker.com/get-started/docker-concepts/running-containers/images/delete-the-container.webp)

## Additional resources

다음 내용들은 바인드 마운트에 대해 자세히 알아보는 데 도움이 됩니다:

- [Manage data in Docker](https://docs.docker.com/storage/)
- [Volumes](https://docs.docker.com/storage/volumes/)
- [Bind mounts](https://docs.docker.com/storage/bind-mounts/)
- [Running containers](https://docs.docker.com/reference/run/)
- [Troubleshoot storage errors](https://docs.docker.com/storage/troubleshooting_volume_errors/)
- [Persisting container data](https://docs.docker.com/get-started/docker-concepts/running-containers/persisting-container-data/)

## Next steps

이제 컨테이너와 로컬 파일을 공유하는 방법을 알았으니, 다중 컨테이너 애플리케이션에 대해 알아볼 차례입니다.

[Multi-container applications](#/get-started/docker-concepts/running-containers/multi-container-applications)
