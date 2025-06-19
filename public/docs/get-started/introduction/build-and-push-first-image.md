# Build and push your first image

<div class="youtube-video">
   <iframe 
    src="https://www.youtube.com/embed/7ge1s5nAa34" 
    frameborder="0" 
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
   >
  </iframe>
</div>

## Explanation

todo-list 앱을 업데이트 했으니, 컨테이너 이미지를 만들고 Docker Hub에 공유할 준비가 되었습니다. 이를 위해 다음의 사항들을 수행해야 합니다: 

1. Docker 계정 로그인
1. Docker Hub에 이미지 레포지토리 생성
1. 컨테이너 이미지 생성
1. Docker Hub에 이미지 푸시

실습 가이드를 시작하기 전에, 알아야 하는 몇 가지 핵심 개념이 있습니다. 

### Container images

컨테이너 이미지를 처음 접한다면, 이를 애플리케이션을 실행하기 위한 이를 파일, 설정, 의존성 등의 모든 것들을 포함한 표준화된 패키지라고 생각하면 됩니다. 이 패키지들은 배포되어 다른 사람들과 공유할 수 있습니다. 

### Docker Hub

Docker 이미지를 공유하기 위해서는 이를 저장할 공간이 필요합니다. 여기서 레지스트리가 그 역할을 합니다. 수많은 종류의 레지스트리가 있지만, Docker Hub는 기본적이고 가장 많이 쓰이는 이미지 레지스트리 입니다. Docker Hub는 이미지를 저장할 공간을 제공할 뿐만 아니라, 다른 사람이 만든 이미지를 찾아 실행하거나 자신의 이미지를 위한 기반으로 사용할 수도 있도록 합니다. 

[Develop with containers] 페이지에서, 다음의 Docker Hub에서 제공하는 [Docker 공식 이미지]를 사용했습니다:

- [node](https://hub.docker.com/_/node?_gl=1*1nd7e4s*_ga*MTM1OTg5MDQzNC4xNzQwNjI0NjU2*_ga_XJWPQMJYHQ*MTc0MDYzNTk4OS40LjEuMTc0MDYzNjAyMS4yOC4wLjA.) - Node 환경을 제공하고 개발 작업의 기반으로 사용됩니다. 이 이미지는 최종 애플리케이션 이미지의 기반으로도 사용됩니다. 
- [mysql](https://hub.docker.com/_/mysql?_gl=1*1dbz6hi*_ga*MTM1OTg5MDQzNC4xNzQwNjI0NjU2*_ga_XJWPQMJYHQ*MTc0MDYzNTk4OS40LjEuMTc0MDYzNjAyMS4yOC4wLjA.) - to-do list 항목들을 저장할 MySQL 데이터베이스를 제공합니다.
- [phpmyadmin](https://hub.docker.com/_/phpmyadmin?_gl=1*1dbz6hi*_ga*MTM1OTg5MDQzNC4xNzQwNjI0NjU2*_ga_XJWPQMJYHQ*MTc0MDYzNTk4OS40LjEuMTc0MDYzNjAyMS4yOC4wLjA.) - MySQL 데이터베이스의 웹 기반 인터페이스인 phpMyAdmin을 제공합니다. 
- [tradfik](https://hub.docker.com/_/traefik?_gl=1*1dbz6hi*_ga*MTM1OTg5MDQzNC4xNzQwNjI0NjU2*_ga_XJWPQMJYHQ*MTc0MDYzNTk4OS40LjEuMTc0MDYzNjAyMS4yOC4wLjA.) - 요청을 라우팅 규칙에 따라 적절한 컨테이너로 라우팅하는 로드 밸런서이자 모던 HTTP 리버스 프록시인 Traefik을 제공합니다. 

실행하고 빌드 할 더 많은 이미지를 보고싶다면 [Docker Official Images](https://hub.docker.com/search?image_filter=official&q=&_gl=1*19st5cp*_ga*MTM1OTg5MDQzNC4xNzQwNjI0NjU2*_ga_XJWPQMJYHQ*MTc0MDYzNTk4OS40LjEuMTc0MDYzNjAyMS4yOC4wLjA.), [Docker Verified Publishers](https://hub.docker.com/search?q=&image_filter=store&_gl=1*19st5cp*_ga*MTM1OTg5MDQzNC4xNzQwNjI0NjU2*_ga_XJWPQMJYHQ*MTc0MDYzNTk4OS40LjEuMTc0MDYzNjAyMS4yOC4wLjA.), [Docker Sponsored Open Source Software](https://hub.docker.com/search?q=&image_filter=open_source&_gl=1*19st5cp*_ga*MTM1OTg5MDQzNC4xNzQwNjI0NjU2*_ga_XJWPQMJYHQ*MTc0MDYzNTk4OS40LjEuMTc0MDYzNjAyMS4yOC4wLjA.)의 전체 카탈로그를 확인하세요. 

## Try it out

이번 실습 가이드에서는 Docker Hub에 로그인하고 Docker Hub 레포지토리에 이미지를 푸시하는 방법을 배울 것입니다. 

## Sign in with your Docker account

이미지를 Docker Hub에 푸시하기 위해, Docker 계정으로 로그인 해야합니다. 

1. Docker Dashboard를 엽니다.
1. 우측 상단의 Sign in을 클릭합니다. 
1. 계정이 없다면 create an account를 누르고 로그인 과정을 완료합니다. 

## Create an image repository 

이제 계정이 있으니 이미지 레포지토리를 만들 수 있습니다. Git 레포지토리가 소스 코드를 저장하는 것 처럼, 이미지 레포지토리는 컨테이너 이미지를 저장합니다. 

1. [Docker Hub](https://hub.docker.com/?_gl=1*8u6gem*_ga*MTM1OTg5MDQzNC4xNzQwNjI0NjU2*_ga_XJWPQMJYHQ*MTc0MDYzNTk4OS40LjEuMTc0MDYzNjAyMS4yOC4wLjA.)로 이동합니다. 
1. **Create repository**를 선택합니다. 
1. **Create repository** 페이지에서 아래의 정보를 입력합니다: 
    - **Repository name** - `getting-started-todo-app`
    - **Short description** - 원하는 대로 자유롭게 소개를 작성합니다.  
    - **Visibility** - **Public**을 선택해 모든 사람이 당신의 커스텀 to-do 앱을 사용할 수 있도록 허용합니다. 
1. **Create**를 선택해 레포지토리를 생성합니다. 

## Build and push the image

레포지토리를 생성했으니 이미지를 빌드하고 푸시할 준비가 되었습니다. 중요한 점은 당신이 빌드하는 이미지가 Node 이미지를 상속받아 Node, yarn 등을 설치하거나 설정할 필요가 없다는 것입니다. 오로지 애플리케이션의 특징에 집중할 수 있습니다. 

> **What is an image/Dockerfile?**
>
> 깊게 들어가기 전에, 컨테이너 이미지를 프로세스 실행을 위한 모든것이 담긴 하나의 패키지라고 생각하세요. 이번의 경우, 백엔드 코드를 위한 Node 환경과 컴파일 된 React 코드를 포함할 것입니다. 
>
> 이 이미지가 담긴 컨테이너를 실행하는 모든 컴퓨터가 사전 설치 요구사항 없이 애플리케이션을 실행할 수 있습니다. 
>
> `Dockerfile`은 이미지를 어떻게 빌드해야 하는지에 대한 명령어 집합을 제공하는 텍스트 기반 스크립트입니다. 이번에는 빠른 시작을 위해 레포지토리에 도커 파일이 이미 있습니다. 

1. 시작하기 앞서, 로컬 컴퓨터로 클론하거나 [ZIP 파일로 프로젝트를 다운받습니다](https://github.com/docker/getting-started-todo-app/archive/refs/heads/main.zip). 
   ```bash
   git clone https://github.com/docker/getting-started-todo-app
   ```
   프로젝트가 클론되면, 생성된 새 디렉토리로 이동합니다: 
   ```bash
   cd getting-started-todo-app
   ```
1. `DOCKER_USERNAME`을 사용자명으로 교체하고, 다음 명령어로 프로젝트를 빌드합니다. 
   ```bash
   docker build -t <DOCKER_USERNAME>/getting-started-todo-app .
   ```
   예를 들어, Docker의 사용자명이 `mobydock`이라면 아래 명령어를 실행시킵니다: 
   ```bash
   docker build -t mobydock/getting-started-todo-app .
   ```
1. 이미지가 로컬에 있는지 확인하기 위해 `docker image ls` 명령어를 사용합니다: 
   ```bash
   docker image ls
   ```
   아래와 비슷한 출력을 확인할 수 있습니다: 
   ```
   REPOSITORY                          TAG       IMAGE ID       CREATED          SIZE
   mobydock/getting-started-todo-app   latest    1543656c9290   2 minutes ago    1.12GB
   ...
   ```
1. 이미지를 푸시하기 위해 `docker push` 명령어를 사용합니다. `DOCKER_USERNAME`을 당신의 사용자명으로 교체하는 것을 잊지 마세요. 
   ```bash
   docker push DOCKER_USERNAME/getting-started-todo-app
   ```
   업로드 속도에 따라 시간이 걸릴 수 있습니다. 

## Recap

넘어가기 전에 잠시 되돌아봅시다. 몇번의 단계만을 거쳐 애플리케이션을 담은 컨테이너 이미지를 빌드하고 Docker Hub에 푸시할 수 있었습니다. 

앞으로 아래 내용을 기억하세요: 

- Docker Hub는 신뢰할만한 콘텐츠를 쉽게 찾을 수 있는 레지스트리입니다. Docker는 신뢰할 수 있는 콘텐츠 모음을 제공하며, Docker Official Images, Docker Verified Publishers, 그리고 Docker Sponsored Open Source Software로 구성됩니다. 이러한 콘텐츠는 직접 사용할 수도 있고, 당신의 이미지를 만들기 위한 기반으로 활용할 수도 있습니다.
- Docker Hub는 당신의 애플리케이션을 배포할 수 있는 마켓플레이스를 제공합니다. 누구든지 계정을 만들고 이미지를 배포할 수 있습니다. 생성한 이미지를 공개적으로 배포하는 반면, 비공개 레포지토리는 인증된 사용자만 이미지에 접근할 수 있음을 보장합니다. 

> **Usage of other registries**
>
> Docker Hub가 기본 레지스트리지만, 레지스트리는 [Open Container Initiative](https://opencontainers.org/)를 통해 표준화되었습니다. 이 덕분에 회사와 조직이 그들만의 비공개 레지스트리를 실행할 수 있습니다. 신뢰할 수 있는 콘텐츠가 Docker Hub에서 비공개 레지스트리로 복사되는 것은 꽤 자주 있습니다. 

## Next steps

이제 이미지를 빌드했으니, 왜 개발자로서 도커에 대해 더 학습해야 하고 도커가 여러분의 일상 업무에 어떻게 도움이 될지 논의해 보겠습니다.

<button-component href="/#/get-started/introduction/whats-next" title="What's Next" />