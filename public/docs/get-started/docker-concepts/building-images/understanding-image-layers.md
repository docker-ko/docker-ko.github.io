# Understanding the image layers

<div class="youtube-video">
   <iframe 
    src="https://www.youtube.com/embed/wJwqtAkmtQA" 
    frameborder="0" 
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
   >
  </iframe>
</div>

## Explanation

[What is an image?](#/get-started/docker-concepts/the-basics/what-is-an-image/)에서 학습했듯이, 컨테이너 이미지는 레이어로 구성됩니다. 그리고 이러한 각 레이어는 일단 생성되면 불변성을 갖습니다. 하지만 실제로는 무슨 뜻일까요? 그리고 이러한 레이어는 컨테이너가 사용할 수 있는 파일 시스템을 만드는 데 어떻게 사용될까요?

### Image layers

이미지의 각 계층에는 추가, 삭제 또는 수정과 같은 파일 시스템 변경 사항이 포함됩니다. 이론적 이미지를 살펴보겠습니다 :

1. 첫 번째 레이어는 기본 명령어와 패키지 관리자(예: apt)를 추가합니다.
2. 두 번째 레이어는 Python 런타임과 pip를 설치하여 의존성 관리를 제공합니다.
3. 세 번째 레이어는 애플리케이션의 특정 requirements.txt 파일을 복사합니다.
4. 네 번째 레이어는 애플리케이션의 특정 의존성을 설치합니다.
5. 다섯 번째 레이어는 실제 애플리케이션 소스 코드를 복사합니다.

이 예시는 다음과 같습니다 :
![image-layer-1](https://docs.docker.com/get-started/docker-concepts/building-images/images/container_image_layers.webp)

이는 레이어를 이미지 간에 재사용할 수 있기 때문에 유용합니다. 예를 들어, 다른 Python 애플리케이션을 만들고 싶다고 가정해 보겠습니다. 레이어링 덕분에 동일한 Python 기반을 활용할 수 있습니다. 이렇게 하면 빌드가 더 빨라지고 이미지를 배포하는 데 필요한 저장 공간과 대역폭이 줄어듭니다. 이미지 레이어링은 다음과 유사할 수 있습니다 :
![image-layer-1](https://docs.docker.com/get-started/docker-concepts/building-images/images/container_image_layer_reuse.webp)

레이어를 사용하면 다른 레이어의 기본 레이어를 재사용하여 이미지를 확장하고, 애플리케이션에 필요한 데이터만 추가할 수 있습니다.

## Stacking the layers

레이어링은 콘텐츠 주소 지정 저장소(content-addressable storage)와 유니온 파일 시스템을 통해 가능합니다. 기술적인 내용이 되겠지만, 작동 방식은 다음과 같습니다.

1. 각 레이어가 다운로드되면 호스트 파일 시스템의 자체 디렉토리로 추출됩니다.
2. 이미지에서 컨테이너를 실행하면 레이어가 서로 위에 쌓여서 새롭고 통합된 뷰가 생성되는 유니온 파일 시스템이 생성됩니다.
3. 컨테이너가 시작되면 `chroot`를 사용하여 루트 디렉토리가 이 통합 디렉토리의 위치로 설정됩니다.

유니온 파일 시스템이 생성되면 이미지 레이어 외에도 실행 중인 컨테이너를 위한 디렉토리가 특별히 생성됩니다. 이를 통해 컨테이너는 파일 시스템을 변경하는 동시에 원래 이미지 레이어는 그대로 유지할 수 있습니다. 이를 통해 동일한 기본 이미지에서 여러 컨테이너를 실행할 수 있습니다.

## Try it out

이 실습 가이드에서는 [`docker container commit`](https://docs.docker.com/reference/cli/docker/container/commit/) 명령어를 사용하여 수동으로 새로운 이미지 레이어를 생성합니다. 일반적으로는 [Dockerfile을 사용](#/get-started/docker-concepts/building-images/writing-a-dockerfile/)하지만, 이 방법은 작동 방식을 이해하는 데 도움이 됩니다.

### Create a base image

첫 번째 단계에서는 다음 단계에 사용할 자신만의 베이스 이미지를 생성합니다.

1. Docker Desktop을 [다운로드하여 설치합니다](https://www.docker.com/products/docker-desktop/?_gl=1*3e3fhz*_gcl_au*MjczODgxODI4LjE3Mzg0NzA0NDI.*_ga*MjEyODM1MDY2OC4xNzIwMzEyNzQ5*_ga_XJWPQMJYHQ*MTczOTYwMzg0Ny42My4xLjE3Mzk2MDQ2NTAuNy4wLjA.).
2. 터미널에서 다음 명령어를 실행하여 새로운 컨테이너를 시작합니다:

   ```sh
   $ docker run --name=base-container -ti ubuntu
   ```

   이미지가 다운로드되고 컨테이너가 시작되면 새로운 쉘 프롬프트가 표시됩니다. 이는 컨테이너 내부에서 실행 중입니다. 다음과 비슷하게 보일 겁니다(컨테이너 ID는 다양합니다) :

   ```sh
   root@d8c5ca119fcd:/#
   ```

3. 컨테이너 내부에서 다음 명령어를 실행하여 Node.js를 설치합니다:

   ```sh
   $ apt update && apt install -y nodejs
   ```

   이 명령을 실행하면 컨테이너 내부에 Node를 다운로드하고 설치합니다. 유니온 파일 시스템의 맥락에서 이러한 파일 시스템 변경은 이 컨테이너에 고유한 디렉토리 내에서 발생합니다.

4. Node가 설치되었는지 확인하려면 다음 명령어를 실행합니다:

   ```sh
   $ node -e 'console.log("Hello world!")'
   ```

   콘솔에 "Hello world!"가 표시됩니다.

5. 이제 Node가 설치되었으므로, 변경 사항을 새로운 이미지 레이어로 저장할 준비가 되었습니다. 이를 위해 [`docker container commit`](https://docs.docker.com/reference/cli/docker/container/commit/) 명령어를 사용합니다. 새로운 터미널에서 다음 명령어를 실행합니다:

   ```sh
   $ docker container commit -m "Add node" base-container node-base
   ```

6. `docker image history` 명령어를 사용하여 이미지의 레이어를 확인합니다:

   ```sh
   $ docker image history node-base
   ```

   다음과 유사한 출력이 표시됩니다:

   ```plaintext
   IMAGE        CREATED          CREATED BY          SIZE       COMMENT
   d5c1fca2cdc4 10 seconds ago   /bin/bash           126MB      Add node
   2b7cc08dcdbb 5 weeks ago      /bin/sh -c #(nop)   CMD ["...  0B
   <missing>    5 weeks ago      /bin/sh -c #(nop)   ADD file:... 69.2MB
   ...
   ```

   맨 위 줄에 있는 "Add node" 주석을 주목하세요. 이 레이어에는 방금 만든 Node.js 설치가 들어 있습니다.

7. 새로운 이미지가 Node를 설치했음을 증명하려면 다음 명령어를 사용하여 새로운 컨테이너를 시작합니다:

   ```sh
   $ docker run node-base node -e "console.log('Hello again')"
   ```

   터미널에 "Hello again" 출력이 표시되면 Node가 설치되고 작동 중임을 나타냅니다.

8. 이제 베이스 이미지 생성을 완료했으므로, 해당 컨테이너를 제거할 수 있습니다:
   ```sh
   $ docker rm -f base-container
   ```

> #### Base image definition
>
> 베이스 이미지는 다른 이미지를 빌드하기 위한 기반입니다. 모든 이미지를 베이스 이미지로 사용할 수 있습니다. 그러나 일부 이미지는 의도적으로 빌딩 블록으로 만들어져 애플리케이션의 기초 또는 시작점을 제공합니다.
>
> 이 예에서는 실제로 아직 아무것도 하지 않으므로 이 노드 기반 이미지를 배포하지 않을 것입니다. 그러나 다른 빌드에 사용할 수 있는 베이스입니다.

### Build an app image

이제 베이스 이미지를 확장하여 추가 이미지를 빌드할 수 있습니다.

1. 새로 생성된 node-base 이미지를 사용하여 새로운 컨테이너를 시작합니다:
   ```sh
   $ docker run --name=app-container -ti node-base
   ```
2. 컨테이너 내부에서 다음 명령어를 실행하여 Node 프로그램을 생성합니다:
   ```sh
   $ echo 'console.log("Hello from an app")' > app.js
   ```
   이 Node 프로그램을 실행하려면 다음 명령어를 사용하여 메시지를 화면에 출력합니다:
   ```sh
   $ node app.js
   ```
3. 다른 터미널에서 다음 명령어를 실행하여 컨테이너의 변경 사항을 새로운 이미지로 저장합니다:

   ```sh
   $ docker container commit -c "CMD node app.js" -m "Add app" app-container sample-app
   ```

   이 명령은 `sample-app`이라는 이름의 새 이미지를 생성할 뿐만 아니라 컨테이너를 시작할 때 기본 명령을 설정하기 위해 이미지에 추가 구성을 추가합니다. 이 경우, 자동으로 `node app.js`를 실행하도록 설정합니다.

4. 컨테이너 외부의 터미널에서 다음 명령어를 실행하여 업데이트된 레이어를 확인합니다:

   ```sh
   $ docker image history sample-app
   ```

   그러면 다음과 같은 출력이 표시됩니다. 맨 위 레이어 주석에는 "Add app"가 있고 다음 레이어에는 "Add app"가 있음에 주의해서 봐주세요 :

   ```plaintext
   IMAGE        CREATED          CREATED BY          SIZE       COMMENT
   c1502e2ec875 About a minute ago  /bin/bash      33B       Add app
   5310da79c50a 4 minutes ago   /bin/bash      126MB     Add node
   ...
   ```

5. 마지막으로, 완전히 새로운 이미지를 사용하여 새 컨테이너를 시작합니다. 기본 명령을 지정했으므로 다음 명령을 사용할 수 있습니다 :

   ```sh
   $ docker run sample-app
   ```

   Node 프로그램에서 나오는 인사말이 터미널에 표시되는 것을 볼 수 있습니다.

6. 컨테이너 작업을 완료했으므로 다음 명령어를 사용하여 제거할 수 있습니다:
   ```sh
   $ docker rm -f app-container
   ```

## Additional resources

더 많은 내용을 알아보려면 다음 리소스를 확인하세요:

- [docker image history](https://docs.docker.com/engine/reference/commandline/image_history/)
- [docker container commit](https://docs.docker.com/engine/reference/commandline/container_commit/)

## Next steps

대부분의 이미지 빌드는 `docker container commit`을 사용하지 않고, Dockerfile을 사용합니다. Dockerfile은 이러한 단계를 자동화합니다.

[Writing a Dockerfile](#/get-started/docker-concepts/building-images/writing-a-dockerfile)
