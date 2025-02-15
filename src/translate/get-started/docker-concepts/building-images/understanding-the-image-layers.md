# Understanding the Image Layers

[유튜브 링크](https://www.youtube.com/watch?v=wJwqtAkmtQA)

## Explanation

[What is an image?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/)에서 학습했듯이, 컨테이너 이미지는 레이어로 구성되어 있습니다. 각 레이어는, 일단 생성되고 나면, 불변성을 갖습니다. 근데, 그게 뭘 의마하는걸까요? 그리고 그러한 레이어들이 컨테이너가 사용 가능한 파일 시스템을 생성하는 데에 사용되는걸까요?

## Image Layers

이미지 속 각 레이어는 파일 시스템 변경 사항(추가, 삭제, 수정)을 포함합니다. 이론상의 이미지 예시를 살펴보겠습니다 :

1. 첫 번째 레이어는 기본 명령어와 apt와 같은 패키지 매니저를 추가합니다.
2. 두 번째 레이어는 종속성 관리를 위해 Python runtime과 pip를 설치합니다.
3. 세 번째 레이어는 애플리케이션의 특정 requirements.txt 파일에 복사됩니다.
4. 네 번째 계층은 해당 애플리케이션의 특정 종속성을 설치합니다.
5. 다섯 번째 레이어는 애플리케이션의 실제 소스 코드에 복사됩니다.

해당 예시는 다음 사진처럼 보일 겁니다 :
![image-layers-example-1](https://docs.docker.com/get-started/docker-concepts/building-images/images/container_image_layers.webp)

이는 이미지들끼리 레이어들을 재사용할 수 있기에 유용합니다. 예를 들어, 파이썬 애플리케이션을 만들고 싶다고 생각해보세요. 레이어링 덕분에, 동일한 Python base를 활용할 수 있습니다. 이를 통해 빌드 속도가 빨라지고 이미지를 배포하는 데 필요한 저장 공간과 대역폭이 줄어듭니다. 이미지 레이어링은 다음과 유사하게 보일 겁니다 :
![image-layers-example-2](https://docs.docker.com/get-started/docker-concepts/building-images/images/container_image_layer_reuse.webp)

레이어를 사용하면, 여러분들의 애플리케이션의 니즈에 필요한 데이터만 추가할 수 있도록 하면서 base 레이어들을 재사용해 다른 사용자의 이미지를 확장할 수 있습니다.

## Stacking the Layers

레이어링은 콘텐츠 주소화(content-addressable) 스토리지와 유니온 파일 시스템을 통해 가능합니다. 이는 기술적인 내용이 될 수 있지만, 작동 방식은 다음과 같습니다 :

1. 각 레이어가 다운로드된 후, 호스트 파일 시스템의 자체 디렉터리로 추출됩니다.
2. 이미지에서 컨테이너를 실행하면, 새로 통합된 뷰를 생성하면서 각 레이어들이 쌓여 만들어진 유니온 파일 시스템이 생깁니다.
3. 컨테이너가 시작되면, 컨테이너의 루트 디렉토리는 `chroot`를 사용해 이 통합 디렉터리의 위치로 설정됩니다.

유니온 파일 시스템이 생성되면, 이미지 레이어 외에도, 실행 중인 컨테이너를 위한 디렉터리가 생성됩니다. 이는 원본 이미지 레이어들을 그대로 유지하면서 컨테이너가 파일 시스템 변화를 만들 수 있도록 합니다. 이는 여러분들이 동일 기반(underlying) 이미지로부터 여러 컨테이너를 실행할 수 있게 해줍니다.

## Try it Out

이 가이드에서는 `docker container commit` 명령을 사용하여 수동으로 새로운 이미지 레이어들을 생성합니다. 여러분이 [use a Dockerfile](https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/)하는 것과 같은 방식으로 이미지들을 생성할 일은 거의 없다는 것을 참고하세요. 그치만, 이는 더 쉽게 동작 방식을 이해할 수 있습니다.

### Create a Base Image

1. Docker Desktop을 [다운로드하고 설치합니다](https://www.docker.com/products/docker-desktop/?_gl=1*13drot7*_gcl_au*MjczODgxODI4LjE3Mzg0NzA0NDI.*_ga*MjEyODM1MDY2OC4xNzIwMzEyNzQ5*_ga_XJWPQMJYHQ*MTczODU4NDc5Ny41NS4xLjE3Mzg1ODQ4OTMuNTcuMC4w).
2. 터미널에서 다음 명령을 실행하여 새 컨테이너를 시작합니다:

   ```bash
   # 'base-container'라는 이름으로 컨테이너 이름 지정
   docker run --name=base-container -ti ubuntu
   ```

   이미지가 다운로드되고 컨테이너가 시작되면 새 셸 프롬프트가 표시됩니다. 이는 컨테이너 내부에서 실행 중인 겁니다. 다음과 유사하게 표시됩니다(컨테이너 ID는 달라질 수 있습니다):

   ```bash
   root@d8c5ca119fcd:/#
   ```

3. 컨테이너 내부에서 Node.js를 설치합니다:

   ```bash
   apt update && apt install -y nodejs
   ```

   이 명령이 실행되면 컨테이너 내부에 노드를 다운로드하고 설치합니다. 유니온 파일 시스템의 맥락에서 이러한 파일 시스템 변경은 이 컨테이너에 고유한 디렉토리 내에서 발생합니다.

4. Node.js가 설치되었는지 확인합니다:

   ```bash
   node -e 'console.log("Hello world!")'
   ```

   그럼 "Hello world!"가 콘솔에 표시될 겁니다.

5. 이제 노드가 설치되었으므로 변경 사항을 새 이미지 레이어로 저장할 준비가 되었으며, 이를 통해 새 컨테이너를 시작하거나 새 이미지를 만들 수 있습니다. 그렇게 하려면 `docker container commit` 명령어를 사용합니다. 새 터미널에서 다음 명령을 실행합니다 :
   ```bash
   # 2번에서 'base-container'라는 이름으로 컨테이너를 저장해 실행 -> 새로운 이미지 이름을 node-base로 저장
   docker container commit -m "Add node" base-container node-base
   ```
6. `docker image history` 명령어를 사용해 이미지의 레이어들을 볼 수 있습니다 :

   ```bash
   # 새로 지정한 이름인 'node-base' 이미지 확인
   docker image history node-base
   ```

   다음과 비슷한 출력을 볼 겁니다 :

   ```bash
    IMAGE          CREATED          CREATED BY                                      SIZE      COMMENT
   d5c1fca2cdc4   10 seconds ago   /bin/bash                                       126MB     Add node
   2b7cc08dcdbb   5 weeks ago      /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B
   <missing>      5 weeks ago      /bin/sh -c #(nop) ADD file:07cdbabf782942af0â¦   69.2MB
   <missing>      5 weeks ago      /bin/sh -c #(nop)  LABEL org.opencontainers.â¦   0B
   <missing>      5 weeks ago      /bin/sh -c #(nop)  LABEL org.opencontainers.â¦   0B
   <missing>      5 weeks ago      /bin/sh -c #(nop)  ARG LAUNCHPAD_BUILD_ARCH     0B
   <missing>      5 weeks ago      /bin/sh -c #(nop)  ARG RELEASE                  0B
   ```

   가장 윗 줄에 "Add node" 메세지가 추가되었음을 볼 수 있습니다. 해당 레이어는 여러분이 설치했던 Node.js를 포함합니다.

7. 노드가 설치되었음을 확인하기 위해, 새 이미지를 사용해 새 컨테이너를 실행할 수 있습니다 :
   ```bash
   docker run node-base node -e "console.log('Hello again')"
   ```
   여러분은 노드가 설치되고 실행되는 것을 보면서 터미널에서 "Hello again" 출력을 얻을 수 있습니다.
8. 여러분이 base 이미지를 만들었으므로, 해당 컨테이너를 삭제할 수 있습니다 :
   ```bash
   docker rm -f base-container
   ```
   > ### 기본 이미지 정의(Base image definition)
   >
   > 기본 이미지는 다른 이미지를 구축하기 위한 기반입니다. 모든 이미지를 기본 이미지로 사용할 수 있습니다. 그러나 일부 이미지는 의도적으로 구성 요소로 만들어져 애플리케이션의 기초 또는 시작점을 제공합니다.
   >
   > 이 예제에서는 이 노드 기반 이미지를 배포하지 않을 가능성이 높습니다. 왜냐하면 아직 아무것도 하지 않기 때문입니다. 하지만 이 이미지는 다른 빌드에 사용할 수 있는 기반입니다.

### Build an App Image

이제 기본 이미지가 있으므로 해당 이미지를 확장하여 추가 이미지를 만들 수 있습니다.

1. 새로 생성된 `node-base` 이미지를 사용하여 새 컨테이너를 시작합니다:
   ```bash
   docker run --name=app-container -ti node-base
   ```
2. 컨테이너 내부에서, 다음 명령어를 실행하여 Node 프로그램을 생성합니다:

   ```bash
   echo 'console.log("Hello from an app")' > app.js
   ```

   노드 프로그램을 실행하기 위해, 다음 명령어를 실행해 화면에서 메세지가 출력되는 것을 확인할 수 있습니다 :

   ```bash
   node app.js
   ```

3. 변경 사항을 새로운 이미지로 저장합니다:

   ```bash
   docker container commit -c "CMD node app.js" -m "Add app" app-container sample-app
   ```

   이 명령어는 `sample-app`이라는 이름의 새 이미지를 생성할 뿐만 아니라 컨테이너를 시작할 때 기본 명령어를 설정하기 위해 이미지에 추가 구성을 추가합니다. 이 경우 `node app.js`를 자동으로 실행하도록 설정하는 것입니다.

4. 컨테이너 외부의 터미널에서 다음 명령을 실행하여 업데이트된 레이어를 확인합니다 :
   ```bash
   docker image history sample-app
   ```
   그러면 다음과 같은 출력이 표시됩니다. 상단 레이어 댓글에는 "Add app"가 있고 다음 레이어에는 "Add node"가 있습니다 :
   ```bash
   IMAGE          CREATED              CREATED BY                                      SIZE      COMMENT
   c1502e2ec875   About a minute ago   /bin/bash                                       33B       Add app
   5310da79c50a   4 minutes ago        /bin/bash                                       126MB     Add node
   2b7cc08dcdbb   5 weeks ago          /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B
   <missing>      5 weeks ago          /bin/sh -c #(nop) ADD file:07cdbabf782942af0â¦   69.2MB
   <missing>      5 weeks ago          /bin/sh -c #(nop)  LABEL org.opencontainers.â¦   0B
   <missing>      5 weeks ago          /bin/sh -c #(nop)  LABEL org.opencontainers.â¦   0B
   <missing>      5 weeks ago          /bin/sh -c #(nop)  ARG LAUNCHPAD_BUILD_ARCH     0B
   <missing>      5 weeks ago          /bin/sh -c #(nop)  ARG RELEASE                  0B
   ```
5. 마지막으로 새 이미지를 사용하여 새 컨테이너를 시작합니다. 기본 명령을 지정했으므로 다음 명령을 사용할 수 있습니다 :

   ```bash
   docker run sample-app
   ```

   터미널에서 노드 프로그램에서 인사말이 표시되는 것을 확인할 수 있습니다.

6. 이제 컨테이너 작업을 마쳤으니 다음 명령을 사용하여 컨테이너를 제거할 수 있습니다 :
   ```bash
   docker rm -f app-container
   ```

### Build an app image

## Additional Resources

- [docker image history](https://docs.docker.com/reference/cli/docker/image/history/)
- [docker container commit](https://docs.docker.com/reference/cli/docker/container/commit/)

## Next Steps

초반에 줬던 힌트처럼, 대부분의 이미지 빌드는 `docker container commit`을 사용하지 않습니다. 대신, Dockerfile을 사용하여 자동화됩니다.

[Writing a Dockerfile](https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/)
