# What is a registry?

[유튜브 링크](https://www.youtube.com/watch?v=2WDl10Wv5rs)

## Explanation

이제 컨테이너 이미지가 무엇이고 어떻게 작동하는지 알게 되었으니, 이 이미지들을 어디에 저장하고 있는지 궁금해하실 수도 있습니다.

컨테이너 이미지를 컴퓨터 시스템에 저장할 수는 있지만, 친구들과 공유하거나 다른 컴퓨터에서 사용하려면 어떻게 해야 하나요? 이떄 이미지 레지스트리가 필요합니다.

이미지 레지스트리는 컨테이너 이미지를 저장하고 공유하기 위한 중앙 집중식 위치입니다. 공용 또는 개인용으로 사용할 수 있습니다. [Docker Hub](https://hub.docker.com/?_gl=1*w1cn9q*_gcl_au*MjczODgxODI4LjE3Mzg0NzA0NDI.*_ga*MjEyODM1MDY2OC4xNzIwMzEyNzQ5*_ga_XJWPQMJYHQ*MTczODQ5MzM2Mi41Mi4xLjE3Mzg0OTMzOTEuMzEuMC4w)는 누구나 사용할 수 있는 공용 레지스트리이며 기본 레지스트리입니다.

Docker Hub는 인기 있는 옵션이지만, 요즘엔 [Amazon Elastic Container Registry(ECR)](https://aws.amazon.com/ecr/), [Azure Container Registry(ACR)](https://azure.microsoft.com/en-in/products/container-registry), [Google Container Registry(GCR)](https://cloud.google.com/artifact-registry) 등 다양한 컨테이너 레지스트리를 사용할 수 있습니다. 심지어 로컬 시스템이나 조직 내에서 개인 레지스트리를 실행할 수도 있습니다. 예를 들어, Harbor, JFrog 아티팩트리, GitLab 컨테이너 레지스트리 등이 있습니다.

### Registry vs repository

레지스트리를 다루는 동안 레지스트리와 리포지토리라는 용어가 서로 호환되는 것처럼 들릴 수 있습니다. 서로 관련이 있지만 완전히 같은 것은 아닙니다.

레지스트리는 컨테이너 이미지를 저장하고 관리하는 중앙 집중식 위치인 반면, 리포지토리는 레지스트리 내의 관련 컨테이너 이미지 모음입니다. 프로젝트를 기반으로 이미지를 구성하는 폴더라고 생각하면 됩니다. 각 리포지토리에는 하나 이상의 컨테이너 이미지가 포함되어 있습니다.

다음 다이어그램은 레지스트리, 리포지토리 및 이미지 간의 관계를 보여줍니다.
![repo-registry-relation](/imgs/get-started/the-basics/repo-registry-rel.png)

> **Note**
>
> 무료 버전의 도커 허브를 사용하여 하나의 개인 저장소와 무제한 공개 저장소를 만들 수 있습니다. 자세한 내용은 [Docker Hub subscription page](https://www.docker.com/pricing/?_gl=1*1nknmps*_gcl_au*MTc5Njg5NTc1My4xNzM4MDg3ODEw*_ga*MjcxOTM2ODU5LjE3MTIxMzY5MzE.*_ga_XJWPQMJYHQ*MTczODQ5MjUxNC42LjEuMTczODQ5Mzc0OS41My4wLjA.)를 방문하세요.

## Try it out

이번 실습에서는 Docker 이미지를 구축하고 Docker Hub repository로 푸시하는 방법을 배우게 됩니다.

### Sign up for a free Docker account

1. 아직 계정을 생성하지 않았다면, [Docker Hub](https://hub.docker.com/?_gl=1*qxagi6*_gcl_au*MTc5Njg5NTc1My4xNzM4MDg3ODEw*_ga*MjcxOTM2ODU5LjE3MTIxMzY5MzE.*_ga_XJWPQMJYHQ*MTczODQ5MjUxNC42LjEuMTczODQ5NDIyNy42MC4wLjA.) 페이지로 이동하여 새 Docker 계정에 가입하세요.
   ![Dockerhub](https://docs.docker.com/get-started/docker-concepts/the-basics/images/dockerhub-signup.webp)
   Google 또는 GitHub 계정을 사용하여 인증할 수 있습니다.

### Create your first repository

1. [Docker Hub](https://hub.docker.com/?_gl=1*qxagi6*_gcl_au*MTc5Njg5NTc1My4xNzM4MDg3ODEw*_ga*MjcxOTM2ODU5LjE3MTIxMzY5MzE.*_ga_XJWPQMJYHQ*MTczODQ5MjUxNC42LjEuMTczODQ5NDIyNy42MC4wLjA.)에 로그인합니다.
2. 우측 상단에 위치한 **Create repository** 버튼을 선택합니다.
3. 네임스페이스(아마도 사용자 이름일 가능성이 높음)를 선택하고 저장소 이름으로 `docker-quickstart`를 입력합니다.
   ![dockerhub-namespace](https://docs.docker.com/get-started/docker-concepts/the-basics/images/create-hub-repository.webp)
4. **Public**으로 설정합니다.
5. 저장소 생성을 위해 **Create** 버튼을 선택합니다.

이게 전부입니다. 첫 번째 저장소를 성공적으로 만들었습니다. 🎉

이 저장소는 지금 비어 있습니다. 이제 이미지를 push하여 이 문제를 해결할 수 있습니다.

### Sign in with Docker Desktop

1. 아직 설치하지 않으셨다면, Docker Desktop을 [Download and install](https://www.docker.com/products/docker-desktop/?_gl=1*l8q6w3*_gcl_au*MTc5Njg5NTc1My4xNzM4MDg3ODEw*_ga*MjcxOTM2ODU5LjE3MTIxMzY5MzE.*_ga_XJWPQMJYHQ*MTczODQ5MjUxNC42LjEuMTczODQ5NDIyNy42MC4wLjA.)하세요.
2. Docker Desktop GUI에서, 우측 상단에 위치한 **Sign in** 버튼을 클릭하세요.

### Clone sample Node.js code

이미지를 만들려면, 우선 프로젝트가 필요합니다. 빠르게 시작하기 위해, [github.com/dockersamples/helloworld-demo-node](https://github.com/dockersamples/helloworld-demo-node)에 있는 Node.js 프로젝트 샘플을 사용해야 합니다. 이 리포지토리에는 Docker 이미지를 구축하는 데 필요한 사전 빌드된 Dockerfile이 포함되어 있습니다.

Dockerfile의 세부 사항에 대해서는 나중에 자세히 설명할 테니 걱정하지 마세요.

1. 다음 명령어를 이용해 Github repository를 복사합니다 :

   ```bash
   git clone https://github.com/dockersamples/helloworld-demo-node
   ```

2. 새로 생성된 디렉토리로 이동합니다.

   ```bash
   cd helloworld-demo-node
   ```

3. 다음 명령을 실행하여 Docker 이미지를 빌드하고, `YOUR_DOCKER_USERNAME`을 사용자 이름으로 교체합니다.

   ```bash
   docker build -t <YOUR_DOCKER_USERNAME>/docker-quickstart .
   ```

   > **Note**
   >
   > 도커 빌드 명령의 끝에 점(.)을 포함해야 합니다. 이렇게 하면 도커가 Dockerfile을 찾을 수 있는 위치를 알 수 있습니다.

4. 다음 명령을 실행하여 새로 생성된 도커 이미지를 나열합니다 :

   ```bash
   docker images
   ```

   다음과 같은 출력을 볼 수 있습니다 :

   ```bash
   REPOSITORY                                 TAG       IMAGE ID       CREATED         SIZE
   <YOUR_DOCKER_USERNAME>/docker-quickstart   latest    476de364f70e   2 minutes ago   170MB
   ```

5. 다음 명령을 실행하여 이미지를 테스트할 컨테이너를 시작합니다(`YOUR_DOCKER_USERNAME`을 자신의 사용자 이름으로 교체) :
   ```bash
   docker run -d -p 8080:8080 <YOUR_DOCKER_USERNAME>/docker-quickstart
   ```
   브라우저에서 [http://localhost:8080](http://localhost:8080)을 방문하여 컨테이너가 작동하는지 확인할 수 있습니다.
6. `docker tag` 명령을 사용하여 도커 이미지에 태그를 지정합니다. 도커 태그를 사용하면 이미지에 레이블을 지정하고 버전을 지정할 수 있습니다.
   ```bash
   docker tag <YOUR_DOCKER_USERNAME>/docker-quickstart <YOUR_DOCKER_USERNAME>/docker-quickstart:1.0
   ```
7. 마지막으로, 새로 구축된 이미지를 `docker push` 명령을 사용하여 Docker Hub repository로 푸시할 시간입니다 :
8. [Docker Hub](https://hub.docker.com/?_gl=1*qxagi6*_gcl_au*MTc5Njg5NTc1My4xNzM4MDg3ODEw*_ga*MjcxOTM2ODU5LjE3MTIxMzY5MzE.*_ga_XJWPQMJYHQ*MTczODQ5MjUxNC42LjEuMTczODQ5NDIyNy42MC4wLjA.)를 열고 해당 저장소로 이동합니다. **Tags** 부분으로 이동해 새로 push한 이미지를 확인합니다.
   ![dockerhub-tags](https://docs.docker.com/get-started/docker-concepts/the-basics/images/dockerhub-tags.webp)

이 과정에서 여러분은 Docker 계정에 가입하고, 첫 번째 Docker Hub repository를 생성한 후, 컨테이너 이미지를 빌드하고, 태그를 붙이고, Docker Hub repository로 푸시했습니다.

## Additional resources

- [Docker Hub Quickstart](https://docs.docker.com/docker-hub/quickstart/)
- [Manage Docker Hub Repositories](https://docs.docker.com/docker-hub/repos/)

## Next steps

이제 컨테이너와 이미지의 기본을 이해했으니 Docker Compose에 대해 배울 준비가 되었습니다.

[What is Docker compose?](#/get-started/docker-concepts/the-basics/what-is-docker-compose)
