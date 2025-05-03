# Use bind mounts

[Part 4](/#/get-started/workshop/05_persisting_data)에서는 볼륨 마운트를 사용하여 데이터베이스의 데이터를 유지했습니다. 볼륨 마운트는 애플리케이션 데이터를 영구적으로 저장할 곳이 필요할 때 좋은 선택입니다.

바인드 마운트는 호스트 파일시스템의 디렉토리를 컨테이너와 공유할 수 있게 해주는 또 다른 유형의 마운트입니다. 애플리케이션을 개발할 때, 바인드 마운트를 사용하여 소스 코드를 컨테이너에 마운트할 수 있습니다. 이렇게 하면 컨테이너는 파일을 저장하는 즉시, 코드에 대한 변경 사항을 볼 수 있습니다. 이는 파일 시스템 변경을 감시하고 이에 응답하는 프로세스를 컨테이너에서 실행할 수 있다는 뜻입니다.

이 챕터에서는, 바인드 마운트와 [nodemon](https://npmjs.com/package/nodemon)이라는 도구를 사용하여 파일 변경을 감시하고, 애플리케이션을 자동으로 재시작하는 방법을 살펴보겠습니다. 대부분의 다른 언어와 프레임워크에도 이와 동등한 도구들이 있습니다.

## Quick volume type comparisons

다음은 `--mount`를 사용한 명명된(named) 볼륨과 바인드 마운트의 예시입니다:

- 명명된(Named) 볼륨: `type=volume,src=my-volume,target=/usr/local/data`
- 바인드 마운트: `type=bind,src=/path/to/data,target=/usr/local/data`

다음 표는 볼륨 마운트와 바인드 마운트 사이의 주요 차이점을 보여줍니다.

| 비교 항목                        | **명명된(Named) 볼륨** | **바인드 마운트** |
| -------------------------------- | ---------------------- | ----------------- |
| 호스트 위치                      | Docker가 선택          | 사용자가 결정     |
| 새 볼륨에 컨테이너 콘텐츠 채우기 | 예                     | 아니오            |
| 볼륨 드라이버 지원               | 예                     | 아니오            |

## Trying out bind mounts

애플리케이션 개발에 바인드 마운트를 어떻게 사용할 수 있는지 살펴보기 전에, 간단한 실험을 통해 바인드 마운트가 어떻게 작동하는지 실용적으로 이해해 보겠습니다.

1. `getting-started-app` 디렉토리가 Docker Desktop의 파일 공유 설정에 정의된 디렉토리에 있는지 확인합니다. 이 설정은 컨테이너와 공유할 수 있는 파일시스템의 부분을 정의합니다. 설정에 액세스하는 방법에 대한 자세한 내용은 [파일 공유](https://docs.docker.com/desktop/settings-and-maintenance/settings/#file-sharing)를 참조하세요.

   > **Note**
   >
   > **파일 공유** 탭은 Hyper-V 모드에서만 사용할 수 있습니다. 파일은 WSL 2 모드와 Windows 컨테이너 모드에서 자동으로 공유되기 때문입니다.

2. 터미널을 열고 `getting-started-app` 디렉토리로 변경합니다.

3. 바인드 마운트가 있는 `ubuntu` 컨테이너에서 `bash`를 시작하려면 다음 명령을 실행하세요:

   ```bash
   # Mac/Linux
   $ docker run -it --mount type=bind,src="$(pwd)",target=/src ubuntu bash

   # Windows (Command Prompt)
   $ docker run -it --mount "type=bind,src=%cd%,target=/src" ubuntu bash

   # Windows (PowerShell)
   $ docker run -it --mount "type=bind,src=$(pwd),target=/src" ubuntu bash

   # Windows (Git Bash)
   $ docker run -it --mount type=bind,src="/$(pwd)",target=/src ubuntu bash
   ```

   `--mount type=bind` 옵션은 Docker에게 바인드 마운트를 생성하도록 지시합니다. 여기서 `src`는 호스트 머신의 현재 작업 디렉토리(`getting-started-app`)이고, `target`은 해당 디렉토리가 컨테이너 내부에 표시되어야 하는 위치(`/src`)입니다.

4. 명령을 실행하면, Docker는 컨테이너 파일 시스템의 루트 디렉토리에서 대화형 `bash` 세션을 시작합니다.
   ```bash
   root@ac1237fad8db:/# pwd
   /
   root@ac1237fad8db:/# ls
   bin   dev  home  media  opt   root  sbin  srv  tmp  var
   boot  etc  lib   mnt    proc  run   src   sys  usr
   ```
5. `src` 디렉토리로 변경합니다:

   ```bash
   cd /src
   ls
   ```

   이것은 컨테이너를 시작할 때 마운트한 디렉토리입니다. 이 디렉토리의 내용을 나열하면 호스트 시스템의 `getting-started-app` 디렉토리와 동일한 파일이 표시됩니다.

   ```bash
   root@ac1237fad8db:/# cd src
   root@ac1237fad8db:/src# ls
   Dockerfile  node_modules  package.json  spec  src  yarn.lock
   ```

6. `myfile.txt`라는 새 파일을 생성합니다:

   ```bash
   root@ac1237fad8db:/src# touch myfile.txt
   root@ac1237fad8db:/src# ls
   Dockerfile  myfile.txt  node_modules  package.json  spec  src  yarn.lock
   ```

7. 호스트에서 `getting-started-app` 디렉토리를 열고 `myfile.txt` 파일이 디렉토리에 있는지 확인합니다.

   ```bash
   ├── getting-started-app/
   │ ├── Dockerfile
   │ ├── myfile.txt
   │ ├── node_modules/
   │ ├── package.json
   │ ├── spec/
   │ ├── src/
   │ └── yarn.lock
   ```

8. 호스트에서 `myfile.txt` 파일을 삭제합니다.

9. 컨테이너에서 다시 한번 `app` 디렉토리의 내용을 나열합니다. 파일이 이제 사라진 것을 관찰하세요:

   ```bash
   root@ac1237fad8db:/src# ls
   Dockerfile  node_modules  package.json  spec  src  yarn.lock
   ```

10. `Ctrl+D`로 대화형 컨테이너 세션을 중지합니다.

바인드 마운트에 대한 간략한 소개는 여기까지입니다. 이 절차는 파일이 호스트와 컨테이너 간에 어떻게 공유되는지, 그리고 변경 사항이 양쪽에서 즉시 반영되는 방법을 보여주었습니다. 이제 소프트웨어 개발을 위해 바인드 마운트를 사용할 수 있습니다.

## Development containers

바인드 마운트는 로컬 개발 환경에서 일반적으로 사용됩니다. 장점은 개발 머신에 모든 빌드 도구와 환경을 설치할 필요가 없다는 것입니다. 단일 `docker run` 명령으로 Docker는 의존성과 도구를 가져옵니다.

### Run your app in a development container

이후 단계는 다음과 같은 작업을 수행하는 바인드 마운트가 있는 개발 컨테이너를 실행하는 방법을 설명합니다:

- 소스 코드를 컨테이너에 마운트
- 모든 의존성 설치
- 파일 시스템 변경을 감시하기 위한 `nodemon` 시작

CLI 또는 Docker Desktop을 사용하여 바인드 마운트로 컨테이너를 실행할 수 있습니다.

1. 현재 실행 중인 `getting-started` 컨테이너가 없는지 확인합니다.

2. `getting-started-app` 디렉토리에서 다음 명령을 실행합니다:

   ```bash
   # Mac/Linux
   $ docker run -dp 127.0.0.1:3000:3000 \
     -w /app --mount type=bind,src="$(pwd)",target=/app \
     node:18-alpine \
     sh -c "yarn install && yarn run dev"

   # Windows (Command Prompt)
   $ docker run -dp 127.0.0.1:3000:3000 ^
     -w /app --mount "type=bind,src=%cd%,target=/app" ^
     node:18-alpine ^
     sh -c "yarn install && yarn run dev"

   # Windows (PowerShell)
   $ docker run -dp 127.0.0.1:3000:3000 `
     -w /app -mount "type=bind,src=$pwd,target=/app" `
     node:18-alpine `
     sh -c "yarn install && yarn run dev"

   # Windows (Git Bash)
   $ docker run -dp 127.0.0.1:3000:3000 \
     -w //app --mount type=bind,src="/$(pwd)",target=/app \
     node:18-alpine \
     sh -c "yarn install && yarn run dev"
   ```

   다음은 명령의 세부 내용입니다:

   - `-dp 127.0.0.1:3000:3000` - 이전과 같습니다. 백그라운드(분리) 모드에서 실행하고 포트 매핑 생성합니다.
   - `-w /app` - "작업 디렉토리" 또는 명령이 실행될 현재 디렉토리를 설정합니다.
   - `--mount type=bind,src="$(pwd)",target=/app` - 호스트의 현재 디렉토리를 컨테이너의 `/app` 디렉토리에 바인드 마운트합니다.
   - `node:18-alpine` - 사용할 이미지. 이것은 Dockerfile에서 앱의 기본 이미지입니다
   - `sh -c "yarn install && yarn run dev"` - 명령어입니다. `sh`를 이용해 셸을 사용하여 명령을 시작하고 `yarn install`을 실행해 패키지들을 설치하고 `yarn run dev`를 실행해 개발 서버를 시작합니다. `package.json` 파일을 보면, `dev` 스크립트는 `nodemon`을 시작합니다.

3. `docker logs <container-id>`를 사용하여 로그를 볼 수 있습니다. 다음과 같은 내용이 표시되면 준비가 된 것입니다 :

   ```bash
   nodemon -L src/index.js
   [nodemon] 2.0.20
   [nodemon] to restart at any time, enter `rs`
   [nodemon] watching path(s): *.*
   [nodemon] watching extensions: js,mjs,json
   [nodemon] starting `node src/index.js`
   Using sqlite database at /etc/todos/todo.db
   Listening on port 3000
   ```

   로그 보기를 종료하려면, `Ctrl+C`를 누르세요.

### Develop your app with the development container

호스트 머신에서 앱을 업데이트하고 컨테이너에 반영된 변경 사항을 확인하세요.

1. `src/static/js/app.js` 파일에서, 109번째 줄에, "Add Item" 버튼의 텍스트를 "Add"로 간단하게 변경합니다 :

   ```javascript
   - {submitting ? 'Adding...' : 'Add Item'}
   + {submitting ? 'Adding...' : 'Add'}
   ```

   저장합니다.

2. 웹 브라우저에서 페이지를 새로 고치면 바인드 마운트로 인해 변경 사항이 거의 즉시 반영되는 것을 볼 수 있습니다. Nodemon이 변경 사항을 감지하고 서버를 다시 시작합니다. Node 서버가 다시 시작되는 데 몇 초 정도 걸릴 수 있습니다. 오류가 발생하면, 몇 초 후에 새로 고침해 보세요.
   ![06-bind-mounts-develop-2](https://docs.docker.com/get-started/workshop/images/updated-add-button.webp)

3. 원하는 다른 변경 사항이 있으면 자유롭게 적용하세요. 파일을 변경하고 저장할 때마다 바인드 마운트로 인해 변경 사항이 컨테이너에 반영됩니다. Nodemon이 변경 사항을 감지하면, 컨테이너 내부의 앱을 자동으로 다시 시작합니다. 수정 작업이 완료되면 컨테이너를 중지하고 다음을 사용하여 새 이미지를 빌드합니다

   ```bash
   $ docker build -t getting-started .
   ```

## Summary

이 시점에서, 여러분은 데이터베이스를 유지할 수 있고 이미지를 다시 빌드하지 않고도 앱의 변경 사항을 개발하면서 확인할 수 있습니다.
볼륨 마운트와 바인드 마운트 외에도, Docker는 보다 복잡하고 특수한 사용 사례를 처리하기 위해 다른 마운트 유형과 스토리지 드라이버도 지원합니다.

관련 정보 :

- [docker CLI reference](https://docs.docker.com/reference/cli/docker/)
- [Manage data in Docker](https://docs.docker.com/storage/)

## What next

앱을 프로덕션을 위해 준비하려면 SQLite에서 작동하는 데이터베이스를 확장성이 좀 더 뛰어난 데이터베이스로 마이그레이션해야 합니다. 간편함을 위해, 관계형 데이터베이스를 계속 사용하고 애플리케이션을 MySQL로 전환하면 됩니다. 하지만, MySQL을 어떻게 실행해야 할까요? 컨테이너 간 통신을 어떻게 허용해야 할까요? 다음 섹션에서 자세히 알아보겠습니다.

[Multi container apps](/#/get-started/workshop/07_multi_container)
