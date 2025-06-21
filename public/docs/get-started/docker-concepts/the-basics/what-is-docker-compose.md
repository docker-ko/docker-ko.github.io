# What is Docker compose?

<div class="youtube-video">
   <iframe 
    src="https://www.youtube.com/embed/xhcUIK4fGtY" 
    frameborder="0" 
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
   >
  </iframe>
</div>

## Explanation

지금까지 가이드를 따라왔다면 단일 컨테이너 애플리케이션을 실행해왔을 겁니다. 하지만 이제 데이터베이스, 메시지 큐, 캐시 또는 다양한 다른 서비스를 실행하고 싶어질 것입니다. 모든 것을 단일 컨테이너에 설치하시겠습니까? 여러 컨테이너를 실행하시겠습니까? 여러 컨테이너들을 실행한다면, 어떻게 모두 연결하시겠습니까?

컨테이너의 모범 사례 중 하나는 각 컨테이너가 한 가지 일을 잘하도록 하는 것입니다. 이 규칙에는 예외가 있지만, 하나의 컨테이너가 여러 가지 일을 하도록 하는 경향을 피하세요. 여러 개의 `docker run` 명령을 사용하여 여러 컨테이너를 시작할 수 있습니다. 하지만 여러분들은 곧 네트워크를 관리하고, 컨테이너를 네트워크에 연결하는 데 필요한 모든 플래그를 관리해야 한다는 것을 깨닫게 될 것입니다. 그리고 업무가 끝나면 정리(cleanup)하는 것도 조금 더 복잡해집니다.

Docker Compose를 사용하면, 모든 컨테이너와 그 구성들을 단일 YAML 파일에 정의할 수 있습니다. 이 파일을 코드 저장소에 포함하면, 저장소를 복제하는 모든 사람이 단일 명령으로 실행할 수 있습니다.

Compose는 선언적 도구라는 것을 이해하는 것이 중요합니다. 여러분들은 단순히 정의하고 실행하면 됩니다. 모든 것을 처음부터 다시 만들 필요는 없습니다. 변경 사항을 있는 경우, `docker compose up` 명령을 다시 실행하면 Compose가 파일의 변경 사항을 조정하고 지능적으로 적용합니다.

> **Dockerfile vs Compose file**
>
> Dockerfile은 컨테이너 이미지를 빌드하는 지침을 제공하고, Compose 파일은 실행 중인 컨테이너를 정의합니다. 꽤 자주, Compose 파일은 특정 서비스에 사용할 이미지를 빌드하기 위해 Dockerfile을 참조합니다.

## Try it out

이번 실습에서는 Docker Compose를 사용하여 멀티 컨테이너 애플리케이션을 실행하는 방법을 배웁니다. Node.js와 MySQL(Database server)로 빌드된 간단한 to-do list 애플리케이션을 사용합니다.

### Start the application

to-do list 애플리케이션을 시스템에서 실행하려면 다음 지침을 따라주세요.

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/?_gl=1*1pdr405*_gcl_au*MTc5Njg5NTc1My4xNzM4MDg3ODEw*_ga*MjcxOTM2ODU5LjE3MTIxMzY5MzE.*_ga_XJWPQMJYHQ*MTczODQ5OTY5NC43LjEuMTczODUwMDg3Mi41OS4wLjA.)을 다운로드하고 설치합니다.
2. 터미널을 열고 [샘플 애플리케이션](https://github.com/dockersamples/todo-list-app)을 클론합니다.
   ```bash
   git clone https://github.com/dockersamples/todo-list-app
   ```
3. `todo-list-app` 디렉토리로 이동합니다.
   ```bash
   cd todo-list-app
   ```
   이 디렉토리 안에는 `compose.yaml`이라는 파일이 있습니다. 이 YAML 파일이 모든 마법이 일어나는 곳입니다! 애플리케이션을 구성하는 모든 서비스를 그들의 구성에 알맞게 정의합니다. 각 서비스는 이미지, 포트, 볼륨, 네트워크 및 기능에 필요한 기타 설정을 지정합니다. YAML 파일의 구조를 익히기 위해 시간을 할애해보세요!
4. `docker compose up` 명령을 사용하여 애플리케이션을 시작합니다.

   ```bash
   docker compose up -d --build
   ```

   이 명령을 실행하면 다음과 같은 출력이 표시됩니다.

   ```
   [+] Running 4/4
   ✔ app 3 layers [⣿⣿⣿] 0B/0B Pulled 7.1s
   ✔ e6f4e57cc59e Download complete 0.9s
   ✔ df998480d81d Download complete 1.0s
   ✔ 31e174fedd23 Download complete 2.5s
   [+] Running 2/4
   ⠸ Network todo-list-app_default Created 0.3s
   ⠸ Volume "todo-list-app_todo-mysql-data" Created 0.3s
   ✔ Container todo-list-app-app-1 Started 0.3s
   ✔ Container todo-list-app-mysql-1 Started 0.3s
   ```

   여기서 많은 일들이 발생합니다! 몇 가지 중요한 사항은 다음과 같습니다 :

   - 두 개의 컨테이너 이미지가 Docker Hub에서 다운로드되었습니다 - node와 MySQL
   - 애플리케이션을 위한 네트워크가 생성되었습니다.
   - 컨테이너 재시작 시 데이터베이스 파일을 유지하기 위해 볼륨이 생성되었습니다.
   - 모든 필수 구성들로 두 개의 컨테이너가 시작되었습니다.

   버겁게 느껴질 수 있지만, 걱정 마세요! 해낼 수 있습니다!

5. 모든 것이 실행 중이면, 브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 사이트를 확인할 수 있습니다. 목록에 항목을 추가하고, 체크하고, 제거해보세요!
   ![compose-5](https://docs.docker.com/get-started/docker-concepts/the-basics/images/todo-list-app.webp)
6. Docker Desktop GUI를 보면 컨테이너를 확인하고 구성에 대해 더 깊이 탐구할 수 있습니다.
   ![compose-6](https://docs.docker.com/get-started/docker-concepts/the-basics/images/todo-list-containers.webp)

### Tear it down

Docker Compose를 사용하여 이 애플리케이션을 시작했기 때문에 완료되면 모든 것을 쉽게 종료할 수 있습니다.

1. CLI에서 `docker compose down` 명령을 사용하여 모든 것을 제거합니다.

   ```bash
   docker compose down
   ```

   다음과 같은 출력이 표시됩니다.

   ```
   [+] Running 2/2
   ✔ Container todo-list-app-mysql-1 Removed 2.9s
   ✔ Container todo-list-app-app-1 Removed 0.1s
   ✔ Network todo-list-app_default Removed 0.1s
   ```

   > **Volume persistence(볼륨 유지)**
   >
   > 기본적으로 볼륨은 Compose 스택을 종료할 때 자동으로 제거되지 않습니다. 스택을 다시 시작할 때 데이터를 다시 원할 수 있기 때문입니다.
   >
   > 볼륨을 제거하려면 `docker compose down` 명령을 실행할 때 `--volumes` 플래그를 추가해주세요 :

   ```bash
   docker compose down --volumes
   ```

2. 또는 Docker Desktop GUI를 사용하여 애플리케이션 스택을 선택하고 **Delete** 버튼을 선택하여 컨테이너를 제거할 수 있습니다.

   > **Using the GUI for Compose stacks(GUI를 사용한 Compose 스택)**
   >
   > GUI에서 Compose 앱의 컨테이너를 제거하면 컨테이너만 제거됩니다. 네트워크와 볼륨을 제거하려면 수동으로 제거해야 합니다.

이번 연습에서는 Docker Compose를 사용하여 멀티 컨테이너 애플리케이션을 시작하고 중지하는 방법을 배웠습니다.

## Additional resources

이 페이지는 Compose에 대한 간략한 소개였습니다. 다음 자료들에서 Compose와 Compose 파일 작성 방법에 대해 더 깊이 살펴볼 수 있습니다.

- [Overview of Docker Compose](https://docs.docker.com/compose/)
- [Overview of Docker Compose CLI](https://docs.docker.com/compose/reference/)
- [How Compose works](https://docs.docker.com/compose/intro/compose-application-model/)
