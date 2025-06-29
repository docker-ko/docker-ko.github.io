# Get Docker Desktop

<div class="youtube-video">
   <iframe 
    src="https://www.youtube-nocookie.com/embed/C2bPVhiNU-0?rel=0&modestbranding=1&playsinline=1" 
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
    loading="lazy"
    title="Get Docker Desktop"
    referrerpolicy="strict-origin-when-cross-origin"
   >
  </iframe>
</div>

## Explanation

Docker Desktop은 이미지를 빌드하고 컨테이너를 실행하는 등 다양한 작업을 수행할 수 있는 올인원 패키지입니다. 이 가이드는 Docker Desktop을 설치하고 직접 체험할 수 있도록 설치 과정을 안내합니다.

> **Docker Desktop 이용 약관**
>
> 대규모 기업(직원 250명 이상 또는 연간 매출 1천만 달러 이상)에서 Docker Desktop을 상업적으로 사용하려면 [유료 구독](https://www.docker.com/pricing/?_gl=1*1nyypal*_ga*MTYxMTUxMzkzOS4xNjgzNTM0MTcw*_ga_XJWPQMJYHQ*MTcxNjk4MzU4Mi4xMjE2LjEuMTcxNjk4MzkzNS4xNy4wLjA.)이 필요합니다.

> **Docker Desktop for Mac**
> 
> [Download (Apple Silicon)](https://desktop.docker.com/mac/main/arm64/Docker.dmg?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-mac-arm64&_gl=1*tr8mvi*_gcl_au*MTI0MTM2MzUxMS4xNzQ2NTgwOTIy*_ga*MjEyODM1MDY2OC4xNzIwMzEyNzQ5*_ga_XJWPQMJYHQ*czE3NDY5NDMxODckbzExMiRnMSR0MTc0Njk0MzE5NSRqNTIkbDAkaDA.) | [Download (Intel)](https://desktop.docker.com/mac/main/amd64/Docker.dmg?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-mac-amd64&_gl=1*mxjbc5*_gcl_au*MTI0MTM2MzUxMS4xNzQ2NTgwOTIy*_ga*MjEyODM1MDY2OC4xNzIwMzEyNzQ5*_ga_XJWPQMJYHQ*czE3NDY5NDMxODckbzExMiRnMSR0MTc0Njk0MzQ1NyRqNTgkbDAkaDA.) | [Install instructions](https://docs.docker.com/desktop/setup/install/mac-install)

> **Docker Desktop for Windows**
>
> [Download](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-windows&_gl=1*mxjbc5*_gcl_au*MTI0MTM2MzUxMS4xNzQ2NTgwOTIy*_ga*MjEyODM1MDY2OC4xNzIwMzEyNzQ5*_ga_XJWPQMJYHQ*czE3NDY5NDMxODckbzExMiRnMSR0MTc0Njk0MzQ1NyRqNTgkbDAkaDA.) | [Install instructions](https://docs.docker.com/desktop/setup/install/windows-install)

> **Docker Desktop for Linux**
>
> [Install instructions](https://docs.docker.com/desktop/setup/install/linux/)

설치가 완료되면, 설정 과정을 완료하고 Docker 컨테이너를 실행할 준비가 완료됩니다.

## Try it out

이 실습 가이드에서는, Docker Desktop을 사용하여 Docker 컨테이너를 실행하는 방법을 배울 수 있습니다.

CLI를 사용하여 컨테이너를 실행하는 방법을 따라하세요.

## Run your first container

CLI 터미널을 열고 `docker run` 명령어를 실행하여 컨테이너를 시작하세요:

```bash
$ docker run -d -p 8080:80 docker/welcome-to-docker
```

## Access the frontend

이 컨테이너에서, 프론트엔드는 `8080` 포트에서 접근할 수 있습니다. 웹사이트를 열려면 브라우저에서 [http://localhost:8080](http://localhost:8080/)을 방문하세요.

![access-the-fe](https://docs.docker.com/get-started/docker-concepts/the-basics/images/access-the-frontend.webp)

## Manage containers using Docker Desktop

1. Docker Desktop을 열고 왼쪽 사이드바에서 **Containers** 필드를 선택하세요.
2. 컨테이너의 로그, 파일 등을 확인할 수 있고 심지어는 **Exec** 탭을 선택하여 셸에 접근할 수 있습니다.

![manage-containers-1](https://docs.docker.com/get-started/introduction/images/exec-into-docker-container.webp)

3. 컨테이너에 대한 자세한 정보를 얻기 위해 "Inspect" 필드를 선택해보세요. 컨테이너를 일시 중지, 재개, 시작 또는 중지하거나 **로그**, **바인드 마운트**, **Exec**, **파일**, **통계** 탭을 탐색할 수 있습니다.

![manage-containers-2](https://docs.docker.com/get-started/introduction/images/inspecting-container.webp)

Docker Desktop은 다양한 환경에서 애플리케이션의 설정, 구성 및 호환성을 간소화하여 개발자의 컨테이너 관리를 간소화하고, 환경 불일치와 배포 과제로 인한 문제점을 해결합니다.

## What's next

Docker Desktop을 설치하고 첫 번째 컨테이너를 실행했으니, 이제 컨테이너를 사용하여 개발을 시작할 차례입니다.

<button-component href="/#/get-started/introduction/develop-with-containers" title="Develop with containers" />