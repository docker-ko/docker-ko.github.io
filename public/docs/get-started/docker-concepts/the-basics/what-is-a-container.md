# What is a container?

<div class="youtube-video">
   <iframe 
    src="https://www.youtube.com/embed/W1kWqFkiu7k" 
    frameborder="0" 
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
   >
  </iframe>
</div>

## Explanation

여러분이 Web App을 하나 만든다고 했을 때,
React, Python API, PostgreSQL DB를 주요 기술 스택으로 사용한다고 가정해보겠습니다.

이 경우, 우리는 Node, Python, PostgreSQL을 설치해야 할 것입니다. 하지만 다른 개발자들 모두 노트북이나 로컬 머신에 설치된 버전이 동일하다고 확신할 수 있을까요? 그리고 CI/CD 시스템 상이나 프로덕션 환경에서까지도 동일하다고 확신할 수 있을까요?

앱에서 필요한 파이썬(또는 노드 또는 데이터베이스) 버전이 이미 사용 중인 기기의 영향을 받지 않도록 하려면 어떻게 해야 할까요? 잠재적인 충돌을 어떻게 관리할까요?

해답은 **컨테이너**입니다.
컨테이너란 무엇인가요? 간단히 말해 컨테이너는 앱의 각 구성 요소에 대한 독립적인 프로세스입니다. 프론트엔드 리액트 앱, 파이썬 API 엔진, 데이터베이스 등 각 구성 요소는 머신의 다른 모든 것과 완전히 격리된 고유한 환경에서 실행됩니다.

컨테이너는 다음과 같은 멋진 점들이 존재합니다 :

- **Self-contained**
  - 각 컨테이너는 기능을 수행하는 데 있어서 사전 준비 사항과 같은 의존성을 갖지 않습니다.
- **Isolated**
  - 컨테이너들은 따로 실행되므로, 호스트와 다른 컨테이너들에게 최소한의 영향만을 줍니다.
- **Independent**
  - 각 컨테이너는 독립적으로 관리됩니다.
- **Portable**
  - 컨테이너는 어디서나 실행 가능합니다.

### Containers VS VM(Virtual-Machine)

- VM이란, 자신 소유의 커널, 하드웨어 드라이브들, 프로그램, 앱들이 존재하는 완전한 운영체제입니다.
  즉, 하나의 VM을 가동하는 것은 많은 오버헤드를 발생시킵니다.
- 컨테이너는 실행하는 데 필요한 파일들을 가진 독립된 프로세스입니다.
  여러 컨테이너를 실행하면, 같은 커널을 공유해서 사용함으로써 더 적은 인프라에서 더 많은 앱들을 실행시킬 수 있습니다.
  > #### VM과 컨테이너를 함께 사용하기
  >
  > 컨테이너와 VM이 함께 사용되는 경우가 종종 있습니다. 예를 들어 클라우드 환경에서는 프로비저닝된 머신은 일반적으로 VM입니다. 그러나 **컨테이너 런타임이 있는 VM은** 하나의 머신을 프로비저닝하여 하나의 애플리케이션을 실행하는 대신, **여러 컨테이너화된 애플리케이션을 실행할 수 있어 리소스 활용도가 높아지고 비용이 절감됩니다.**

## Try it out

이번 실습에서는 Docker Desktop GUI를 사용하여 Docker 컨테이너를 실행하는 방법을 살펴보겠습니다.

다음 지침들을 사용해 컨테이너를 사용합니다.

1. 도커 데스크톱을 열고 상단 탐색 표시줄에서 검색 필드를 선택합니다.
2. `welcome-to-docker`를 검색 필드에 입력하고 **Pull** 버튼을 클릭합니다.
   ![welcome-to-docker](https://docs.docker.com/get-started/docker-concepts/the-basics/images/search-the-docker-image.webp)
3. 이미지가 잘 받아와지면, **Run** 버튼을 클릭합니다.
4. **Optional settings**를 엽니다.
5. **Container name**에, `welcome-to-docker`를 적습니다.
6. **Host port**에서, `8080`를 적습니다.
   ![host port](https://docs.docker.com/get-started/docker-concepts/the-basics/images/run-a-new-container.webp)
7. 컨테이너 시작을 위해 **Run** 버튼을 클릭합니다.

### View your container

도커 데스크톱 대시보드의 **Container** 부분으로 이동하여 모든 컨테이너를 볼 수 있습니다.
![view your container](https://docs.docker.com/get-started/docker-concepts/the-basics/images/view-your-containers.webp)
이 컨테이너는 간단한 웹사이트를 표시하는 웹 서버를 실행합니다. 더 복잡한 프로젝트를 작업할 때는 서로 다른 컨테이너에서 서로 다른 부분을 실행할 수 있습니다. 예를 들어 프론트엔드, 백엔드, 데이터베이스에 대해 서로 다른 컨테이너를 실행할 수 있습니다.

### Access the frontend

컨테이너를 실행할 때, 컨테이너의 포트 중 하나가 컴퓨터에 노출되었습니다. 이를 컨테이너의 격리된 환경을 통해 연결할 수 있는 구성을 만드는 것으로 생각하세요.

이 컨테이너의 프론트엔드는 포트 8080에서 액세스할 수 있습니다. 웹사이트를 열려면 컨테이너의 포트 열에서 링크를 선택하거나 브라우저에서 [http://localhost:8080](http://localhost:8080)을 방문하세요.
![access the frontend](https://docs.docker.com/get-started/docker-concepts/the-basics/images/access-the-frontend.webp)

### Explore your container

도커 데스크톱을 사용하면 컨테이너의 다양한 측면을 탐색하고 상호 작용할 수 있습니다. 직접 사용해 보세요.

1. 도커 데스크톱 대시보드 내 **Containers** 부분으로 이동합니다.
2. 컨테이너를 선택합니다.
3. **Files** 탭을 클릭해 컨테이너의 격리된 파일 시스템을 탐색합니다.
   ![explore your container](https://docs.docker.com/get-started/docker-concepts/the-basics/images/explore-your-container.webp)

### Stop your container

`docker/welcome-to-docker` 컨테이너는 우리가 중지시키지 않는 한 계속 실행됩니다.

1. 도커 데스크톱 대시보드 내 **Containers** 부분으로 이동합니다.
2. 중지시키고 싶은 컨테이너를 선택합니다.
3. **Actions** 열에 있는 **Stop**을 선택합니다.
   ![stop your container](https://docs.docker.com/get-started/docker-concepts/the-basics/images/stop-your-container.webp)

## Additional resources

다음 링크들은 컨테이너에 대한 추가 가이드를 제공합니다.

- [Running a container](https://docs.docker.com/engine/containers/run/)
- [Overview of container](https://www.docker.com/resources/what-container/?_gl=1*9ps3qr*_gcl_au*MTc5Njg5NTc1My4xNzM4MDg3ODEw*_ga*MjcxOTM2ODU5LjE3MTIxMzY5MzE.*_ga_XJWPQMJYHQ*MTczODMzODA2Mi4zLjEuMTczODMzODA4OC4zNC4wLjA.)
- [Why Docker?](https://www.docker.com/why-docker/?_gl=1*9ps3qr*_gcl_au*MTc5Njg5NTc1My4xNzM4MDg3ODEw*_ga*MjcxOTM2ODU5LjE3MTIxMzY5MzE.*_ga_XJWPQMJYHQ*MTczODMzODA2Mi4zLjEuMTczODMzODA4OC4zNC4wLjA.)

## Next steps

이제 도커 컨테이너의 기본을 배웠으니 도커 이미지에 대해 배울 차례입니다.

[What is an image?](#/get-started/docker-concepts/the-basics/what-is-an-image)
