# What is an image?

<div class="youtube-video">
   <iframe 
    src="https://www.youtube-nocookie.com/embed/NyvT9REqLe4?rel=0&modestbranding=1&playsinline=1" 
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
    loading="lazy"
    title="What is an image?"
    referrerpolicy="strict-origin-when-cross-origin"
   >
  </iframe>
</div>

## Explanation

[container](#/get-started/docker-concepts/the-basics/what-is-a-container/)를 보는 것은 고립된 프로세스인데, 컨테이너의 파일과 구성은 어디서 얻나요? 이러한 환경을 어떻게 공유하나요?

바로 여기서 컨테이너 이미지가 등장합니다. 컨테이너 이미지는 컨테이너를 실행하기 위한 모든 파일, 바이너리, 라이브러리 및 구성을 포함하는 표준화된 패키지입니다.

[PostgreSQL](https://hub.docker.com/_/postgres?_gl=1*15uj9x8*_gcl_au*MTc5Njg5NTc1My4xNzM4MDg3ODEw*_ga*MjcxOTM2ODU5LjE3MTIxMzY5MzE.*_ga_XJWPQMJYHQ*MTczODM5MzkyMC41LjEuMTczODM5NDgzMy42MC4wLjA.) 이미지의 경우 해당 이미지는 데이터베이스 바이너리, 구성 파일 및 기타 종속성을 패키지로 제공합니다. Python 웹 앱의 경우 Python 런타임, 앱 코드 및 모든 종속성을 포함합니다.

이미지에는 두 가지 중요한 원칙이 있습니다:

1. 이미지는 불변입니다. 일단 이미지가 생성되면 수정할 수 없습니다. 새 이미지를 만들거나 그 위에 변경 사항을 추가할 수만 있습니다.
2. 컨테이너 이미지는 레이어로 구성됩니다. 각 레이어는 파일을 추가, 제거 또는 수정하는 일련의 파일 시스템 변경 사항을 나타냅니다.

이 두 가지 원칙을 통해 기존 이미지를 확장하거나 추가할 수 있습니다. 예를 들어, 파이썬 앱을 구축하는 경우 [Python image](https://hub.docker.com/_/python?_gl=1*190musl*_gcl_au*MTc5Njg5NTc1My4xNzM4MDg3ODEw*_ga*MjcxOTM2ODU5LjE3MTIxMzY5MzE.*_ga_XJWPQMJYHQ*MTczODM5MzkyMC41LjEuMTczODM5NDgzMy42MC4wLjA.)에서 시작하여 추가 레이어를 추가하여 앱의 종속성을 설치하고 코드를 추가할 수 있습니다. 이렇게 하면 파이썬 자체보다는 앱에 집중할 수 있습니다.

### Finding images

[Docker Hub](https://hub.docker.com/?_gl=1*1oefti6*_gcl_au*MTc5Njg5NTc1My4xNzM4MDg3ODEw*_ga*MjcxOTM2ODU5LjE3MTIxMzY5MzE.*_ga_XJWPQMJYHQ*MTczODM5MzkyMC41LjEuMTczODM5NDgzMy42MC4wLjA.)는 이미지를 저장하고 배포하는 기본 글로벌 마켓플레이스입니다. 개발자가 만든 100,000개 이상의 이미지를 로컬에서 실행할 수 있습니다. 도커 허브 이미지를 검색하여 도커 데스크톱에서 직접 실행할 수 있습니다.

도커 허브는 도커가 지원하고 승인한 다양한 이미지인 Docker Trusted Content를 제공합니다. 이러한 이미지는 완전히 관리되는 서비스나 자신의 이미지를 위한 훌륭한 시작을 제공합니다. 여기에는 다음이 포함됩니다:

- [Docker Official Images](https://hub.docker.com/search?q=&type=image&image_filter=official&_gl=1*l95tod*_gcl_au*MTc5Njg5NTc1My4xNzM4MDg3ODEw*_ga*MjcxOTM2ODU5LjE3MTIxMzY5MzE.*_ga_XJWPQMJYHQ*MTczODM5MzkyMC41LjEuMTczODM5NDgzMy42MC4wLjA.) - 도커 저장소 세트는 대부분의 사용자에게 출발점 역할을 하며, 도커 허브에서 가장 안전한 저장소 중 하나입니다
- [Docker Verified Publishers](https://hub.docker.com/search?q=&image_filter=store&_gl=1*l95tod*_gcl_au*MTc5Njg5NTc1My4xNzM4MDg3ODEw*_ga*MjcxOTM2ODU5LjE3MTIxMzY5MzE.*_ga_XJWPQMJYHQ*MTczODM5MzkyMC41LjEuMTczODM5NDgzMy42MC4wLjA.) - 도커가 검증한 상업용 출판사의 고품질 이미지
- [Docker-Sponsored Open Source](https://hub.docker.com/search?q=&image_filter=open_source&_gl=1*l95tod*_gcl_au*MTc5Njg5NTc1My4xNzM4MDg3ODEw*_ga*MjcxOTM2ODU5LjE3MTIxMzY5MzE.*_ga_XJWPQMJYHQ*MTczODM5MzkyMC41LjEuMTczODM5NDgzMy42MC4wLjA.) - 도커의 오픈 소스 프로그램을 통해 도커가 후원하는 오픈 소스 프로젝트에서 게시 및 유지 관리하는 이미지

예를 들어, [Redis](https://hub.docker.com/_/redis?_gl=1*g67llz*_gcl_au*MTc5Njg5NTc1My4xNzM4MDg3ODEw*_ga*MjcxOTM2ODU5LjE3MTIxMzY5MzE.*_ga_XJWPQMJYHQ*MTczODM5MzkyMC41LjEuMTczODM5NTQ1MC42MC4wLjA.)와 [Memcached](https://hub.docker.com/_/memcached?_gl=1*1w6zwm8*_gcl_au*MTc5Njg5NTc1My4xNzM4MDg3ODEw*_ga*MjcxOTM2ODU5LjE3MTIxMzY5MzE.*_ga_XJWPQMJYHQ*MTczODM5MzkyMC41LjEuMTczODM5NTUxOC42MC4wLjA.)는 인기 있는 기성(ready-to-go) 도커 공식 이미지입니다. 이러한 이미지를 다운로드하여 몇 초 만에 서비스를 실행할 수 있습니다. [Node.js](https://hub.docker.com/_/node?_gl=1*1w6zwm8*_gcl_au*MTc5Njg5NTc1My4xNzM4MDg3ODEw*_ga*MjcxOTM2ODU5LjE3MTIxMzY5MzE.*_ga_XJWPQMJYHQ*MTczODM5MzkyMC41LjEuMTczODM5NTUxOC42MC4wLjA.) 도커 이미지와 같은 기본 이미지도 있으며, 이를 시작점으로 사용하여 자신만의 파일과 구성을 추가할 수 있습니다.

## Try it out

이번 실습에서는 Docker Desktop GUI를 사용하여 컨테이너 이미지를 검색하고 가져오는 방법을 배우게 됩니다.

### Search for and download an image

1. 도커 데스크톱 대시보드를 열고 왼쪽 탐색 메뉴에서 **Images** 부분을 선택합니다.
   ![Search-image-1](https://docs.docker.com/get-started/docker-concepts/the-basics/images/click-image.webp)
2. **Search images to run** 버튼을 클릭합니다. 표시되지 않으면 화면 상단에 있는 *global search bar*를 선택합니다.
   ![Search-image-2](https://docs.docker.com/get-started/docker-concepts/the-basics/images/search-image.webp)
3. **Search** 부분에서 "welcome-to-docker"를 입력합니다. 검색이 완료되면, `docker/welcome-to-docker` 이미지를 선택합니다.
   ![Search-image-3](https://docs.docker.com/get-started/docker-concepts/the-basics/images/select-image.webp)
4. 이미지를 다운받기 위해 **Pull**을 선택합니다.

### Learn about the image

이미지를 다운로드한 후에는 GUI나 CLI를 통해 이미지에 대한 몇 가지 세부 사항을 배울 수 있습니다.

1. 도커 데스크탑 대시보드에서, **Images** 부분을 선택합니다.
2. `docker/welcome-to-docker` 이미지를 선택해 이미지에 대한 세부 정보를 엽니다.
   ![learn-about-image-2](https://docs.docker.com/get-started/docker-concepts/the-basics/images/pulled-image.webp)
3. 이미지 세부 정보 페이지에는 이미지의 레이어, 이미지에 설치된 패키지 및 라이브러리, 발견된 취약점에 대한 정보가 표시됩니다.
   ![learn-about-image-3](https://docs.docker.com/get-started/docker-concepts/the-basics/images/image-layers.webp)

이번 연습에서는 도커 이미지를 검색하고 꺼냈습니다. 도커 이미지를 꺼내는 것 외에도 도커 이미지의 레이어에 대해서도 배웠습니다.

## Additional resources

다음 자료는 이미지 탐색, 찾기 및 구축에 대해 더 많이 배우는 데 도움이 될 겁니다:

- [Docker trusted content](https://docs.docker.com/docker-hub/image-library/trusted-content/)
- [Explore the Image view in Docker Desktop](https://docs.docker.com/desktop/use-desktop/images/)
- [Docker Build overview](https://docs.docker.com/build/concepts/overview/)
- [Docker Hub](https://hub.docker.com/?_gl=1*9x03ut*_gcl_au*MTc5Njg5NTc1My4xNzM4MDg3ODEw*_ga*MjcxOTM2ODU5LjE3MTIxMzY5MzE.*_ga_XJWPQMJYHQ*MTczODM5MzkyMC41LjEuMTczODM5NjQwNS42MC4wLjA.)

## Next steps

이제 이미지의 기본을 배웠으니 레지스트리를 통해 이미지를 배포하는 방법을 배울 차례입니다.

<button-component href="/#/get-started/docker-concepts/the-basics/what-is-a-registry" title="What is a registry?" />