# Share the application

이제 이미지를 만들었으니 이미지를 공유할 수 있습니다. Docker 이미지를 공유하려면 Docker 레지스트리를 사용해야 합니다. 기본 레지스트리는 Docker Hub이며, 지금까지 사용한 모든 이미지는 여기에서 가져옵니다.

> **Docker ID**
>
> Docker ID를 사용하면 컨테이너 이미지를 위한 세계 최대의 라이브러리이자 커뮤니티인 Docker Hub에 접근할 수 있습니다. 아직 Docker ID가 없다면 무료로 [Docker ID](https://hub.docker.com/signup)를 만드세요.

## Create a repository

이미지를 푸시하려면 먼저 Docker Hub에 레포지토리를 생성해야 합니다.

1. [Docker Hub](https://hub.docker.com)에 [가입](https://hub.docker.com/signup) 또는 로그인하세요.
2. **Create Repository** 버튼을 선택하세요.
3. 레포지토리 이름으로 `getting-started`를 사용하세요. **Visibility**가 **Public**으로 설정되어 있는지 확인하세요.
4. **Create**를 선택하세요.

다음 이미지에서 Docker Hub의 Docker 명령어 예시를 볼 수 있습니다. 이 명령어는 해당 레포지토리에 푸시합니다.

![Docker command with push example](https://docs.docker.com/get-started/workshop/images/push-command.webp)

## Push the image

1. 명령줄에서 Docker Hub에서 보이는 `docker push` 명령어를 실행하세요. 참고로 명령어에는 "docker"가 아닌 여러분의 Docker ID가 포함되어 있을 것입니다. 예를 들어, `docker push YOUR-USER-NAME/getting-started` 형식입니다.

   ```bash
   $ docker push docker/getting-started
   The push refers to repository [docker.io/docker/getting-started]
   An image does not exist locally with the tag: docker/getting-started
   ```

   왜 실패했을까요? 푸시 명령어가 `docker/getting-started`라는 이름의 이미지를 찾았지만 찾지 못했습니다. `docker image ls`를 실행해도 해당 이미지가 나타나지 않을 것입니다.

   이 문제를 해결하려면 이미 빌드한 기존 이미지에 다른 이름을 부여하기 위해 태그를 지정해야 합니다.

2. 다음 명령어를 사용하여 Docker Hub에 로그인하세요:

   ```
   docker login -u YOUR-USER-NAME
   ```

3. `docker tag` 명령어를 사용하여 `getting-started` 이미지에 새 이름을 부여하세요. `YOUR-USER-NAME`을 여러분의 Docker ID로 바꾸세요.

   ```
   docker tag getting-started YOUR-USER-NAME/getting-started
   ```

4. 이제 `docker push` 명령어를 다시 실행하세요. Docker Hub에서 값을 복사하는 경우 `tagname` 부분은 생략할 수 있습니다. 이미지 이름에 태그를 추가하지 않았기 때문입니다. 태그를 지정하지 않으면 Docker는 `latest`라는 태그를 사용합니다.
   ```
   docker push YOUR-USER-NAME/getting-started
   ```

## Run the image on a new instance

이제 이미지가 빌드되어 레지스트리에 푸시되었으므로, 이 컨테이너 이미지를 전혀 본 적이 없는 새로운 인스턴스에서 앱을 실행해 보세요. 이를 위해 Play with Docker를 사용할 것입니다.

> **Note**
>
> Play with Docker는 amd64 플랫폼을 사용합니다. Apple 실리콘이 탑재된 ARM 기반 Mac을 사용하는 경우, Play with Docker와 호환되도록 이미지를 다시 빌드하고 새 이미지를 레포지토리에 푸시해야 합니다.
>
> amd64 플랫폼용 이미지를 빌드하려면 `--platform` 플래그를 사용하세요.
>
> ```
> docker build --platform linux/amd64 -t YOUR-USER-NAME/getting-started .
> ```
>
> Docker buildx는 또한 다중 플랫폼 이미지 빌드를 지원합니다. 자세한 내용은 [다중 플랫폼 이미지](https://docs.docker.com/build/building/multi-platform/)를 참조하세요.

1. 브라우저에서 [Play with Docker](https://labs.play-with-docker.com/)를 엽니다.
2. **Login**을 선택한 다음 드롭다운 목록에서 **docker**를 선택합니다.
3. Docker Hub 계정으로 로그인한 다음 **Start**를 선택합니다.
4. 왼쪽 사이드바에서 **ADD NEW INSTANCE** 옵션을 선택합니다. 보이지 않으면 브라우저를 조금 넓게 만드세요. 몇 초 후 브라우저에 터미널 창이 열립니다.

   ![Play with Docker add new instance](https://docs.docker.com/get-started/workshop/images/pwd-add-new-instance.webp)

5. 터미널에서 방금 푸시한 앱을 시작하세요.

   ```bash
   $ docker run -dp 0.0.0.0:3000:3000 YOUR-USER-NAME/getting-started
   ```

   이미지가 다운로드되고 결국 시작되는 것이 보일 것입니다.

   > **Tip**
   >
   > 이 명령은 포트 매핑을 다른 IP 주소에 바인딩한다는 것을 알아차렸을 것입니다. 이전 `docker run` 명령은 호스트에서 `127.0.0.1:3000`에 게시합니다. 이번에는, `0.0.0.0`을 사용하고 있습니다.
   >
   > `127.0.0.1`에 바인딩하면 컨테이너의 포트가 루프백 인터페이스에만 노출됩니다. 그러나 `0.0.0.0`에 바인딩하면 호스트의 모든 인터페이스에서 컨테이너의 포트가 노출되어 외부 세계에서 접근할 수 있게 됩니다.
   >
   > 포트 매핑이 작동하는 방식에 대한 자세한 내용은 [네트워킹](https://docs.docker.com/engine/network/#published-ports)을 참조하세요.

6. 나타나면 3000 배지를 선택합니다.
   3000 배지가 나타나지 않으면 **Open Port**를 선택하고 `3000`을 지정할 수 있습니다.

## Summary

이 섹션에서는 레지스트리에 이미지를 푸시하여 공유하는 방법을 배웠습니다. 그런 다음 완전히 새로운 인스턴스로 이동하여 방금 푸시한 이미지를 실행할 수 있었습니다. 이는 CI 파이프라인에서 매우 일반적인 패턴입니다. 파이프라인이 이미지를 생성하고 레지스트리에 푸시한 다음 프로덕션 환경에서 최신 버전의 이미지를 사용할 수 있습니다.

관련 정보 :

- [docker CLI reference](https://docs.docker.com/reference/cli/docker/)
- [Multi-platform images](https://docs.docker.com/build/building/multi-platform/)
- [Docker Hub overview](https://docs.docker.com/docker-hub/)

## Next steps

다음 섹션에서는 컨테이너화된 애플리케이션에서 데이터를 유지하는 방법을 배우게 됩니다.

<button-component href="/#/get-started/workshop/05_persisting_data" title="Persist the DB" />