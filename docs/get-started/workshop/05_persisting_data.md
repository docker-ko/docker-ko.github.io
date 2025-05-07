# Persist the DB

혹시 눈치채셨나요? 컨테이너를 실행할 때마다 할 일 목록(todo list)이 매번 비어있습니다. 왜 그럴까요? 이 파트에서는 컨테이너가 어떻게 작동하는지 자세히 살펴보겠습니다.

## The container's filesystem

컨테이너가 실행될 때, 이미지의 다양한 레이어(layer)를 파일 시스템으로 사용합니다. 각 컨테이너는 파일을 생성/업데이트/삭제하기 위한 자체 "스크래치 공간(scratch space)"도 얻습니다. 이러한 변경 사항은 동일한 이미지를 사용하더라도 다른 컨테이너에서 볼 수 없습니다.

### See this in practice

이 동작을 확인하기 위해 두 개의 컨테이너를 시작해 보겠습니다. 한 컨테이너에서는 파일을 생성하고, 다른 컨테이너에서는 동일한 파일이 존재하는지 확인합니다.

1. Alpine 컨테이너를 시작하고 새 파일을 생성합니다.

   ```bash
   $ docker run --rm alpine touch greeting.txt
   ```

   > **Tip**
   >
   > 이미지 이름(이 경우, `alpine`) 뒤에 지정한 모든 명령은 컨테이너 내부에서 실행됩니다. 이 경우, `touch greeting.txt` 명령은 컨테이너의 파일 시스템에 `greeting.txt`라는 파일을 생성합니다.

2. 새 Alpine 컨테이너를 실행하고 `stat` 명령을 사용하여 파일이 존재하는지 확인합니다.

   ```bash
   $ docker run --rm alpine stat greeting.txt
   ```

   다음과 같이 새 컨테이너에 파일이 존재하지 않음을 나타내는 출력이 표시됩니다.

   ```bash
   stat: can't stat 'greeting.txt': No such file or directory
   ```

첫 번째 컨테이너에 의해 생성된 `greeting.txt` 파일은 두 번째 컨테이너에 존재하지 않았습니다. 이는 각 컨테이너의 쓰기 가능한 "최상위 레이어"가 격리되어 있기 때문입니다. 두 컨테이너가 베이스 이미지를 구성하는 동일한 기본 레이어를 공유했지만, 쓰기 가능한 레이어는 각 컨테이너마다 고유합니다.

## Container volumes

앞선 실험에서, 각 컨테이너는 시작할 때마다 이미지 정의에서 시작한다는 것을 확인했습니다. 컨테이너는 파일을 생성, 업데이트, 삭제할 수 있지만, 컨테이너를 제거하면 해당 변경 사항이 손실되고 Docker는 모든 변경 사항을 해당 컨테이너로 격리합니다. 볼륨(volume)을 사용하면, 이 모든 것을 변경할 수 있습니다.

[볼륨](https://docs.docker.com/engine/storage/volumes/)은 컨테이너의 특정 파일 시스템 경로를 호스트 머신에 연결할 수 있는 기능을 제공합니다. 컨테이너에서 디렉터리를 마운트하면, 해당 디렉터리의 변경 사항을 호스트 머신에서도 볼 수 있습니다. 컨테이너를 재시작해도 동일한 디렉터리를 마운트하면 동일한 파일을 볼 수 있습니다.

볼륨에는 두 가지 주요 유형이 있습니다. 결국에는 둘 다 사용하게 되지만, 먼저 볼륨 마운트부터 시작하겠습니다.

## Persist the todo data

기본적으로 todo 앱은 컨테이너의 파일 시스템에 있는 `/etc/todos/todo.db`에 위치한 SQLite 데이터베이스에 데이터를 저장합니다. SQLite에 익숙하지 않아도 걱정하지 마세요! 단순히 모든 데이터를 단일 파일에 저장하는 관계형 데이터베이스입니다. 대규모 애플리케이션에는 적합하지 않지만 작은 데모에는 효과적입니다. 나중에 다른 데이터베이스 엔진으로 전환하는 방법을 배우게 됩니다.

데이터베이스가 단일 파일이므로, 해당 파일을 호스트에 유지하고 다음 컨테이너에서 사용할 수 있도록 만들면, 이전에 중단된 부분부터 이어서 시작할 수 있습니다. 볼륨을 생성하고 데이터를 저장한 디렉터리에 연결(흔히 "마운트"라고 함)하면 데이터를 유지할 수 있습니다. 컨테이너가 `todo.db` 파일에 쓰면, 볼륨 내의 호스트에 데이터를 유지합니다.

앞서 언급했듯이, 볼륨 마운트를 사용할 것입니다. 볼륨 마운트는 불투명한 데이터 버킷으로 생각하세요. Docker가 디스크의 저장 위치를 포함하여 볼륨을 완전히 관리합니다. 볼륨의 이름만 기억하면 됩니다.

### Create a volume and start the container

CLI 또는 Docker Desktop의 그래픽 인터페이스를 사용하여 볼륨을 생성하고 컨테이너를 시작할 수 있습니다.

**CLI**

1. `docker volume create` 명령어를 입력해 볼륨을 생성합니다.

   ```bash
   $ docker volume create todo-db
   ```

2. 아직 지속되는 볼륨 없이 todo 앱 컨테이너가 실행 중인 경우, `docker rm -f <id>` 명령어로 컨테이너를 중지하고 제거합니다.

3. `--mount` 옵션을 지정하여 볼륨 마운트로 todo 앱 컨테이너를 시작합니다. 볼륨에 이름을 지정하고, 컨테이너에서 `/etc/todos`에 마운트하여 해당 경로에서 생성된 모든 파일을 캡처합니다.

   ```bash
   $ docker run -dp 127.0.0.1:3000:3000 --mount type=volume,src=todo-db,target=/etc/todos getting-started
   ```

   > **Note**
   >
   > Git Bash를 사용하는 경우 이 명령에 다른 구문을 사용해야 합니다.
   >
   > ```bash
   > $ docker run -dp 127.0.0.1:3000:3000 --mount type=volume,src=todo-db,target=//etc/todos getting-started
   > ```
   >
   > Git Bash의 구문 차이에 대한 자세한 내용은 [Git Bash로 작업하기](https://docs.docker.com/desktop/troubleshoot-and-support/troubleshoot/topics/#docker-commands-failing-in-git-bash)를 참조하세요.

### Verify that the data persists

1. 컨테이너가 시작되면 앱을 열고 할 일 목록에 몇 가지 항목을 추가합니다.
   ![할 일 목록에 추가된 항목](https://docs.docker.com/get-started/workshop/images/items-added.webp)

2. todo 앱의 컨테이너를 중지하고 제거합니다. Docker Desktop 또는 `docker ps`를 사용하여 ID를 얻은 다음 `docker rm -f <id>`를 사용하여 제거합니다.

3. 이전 단계를 이용해 새 컨테이너를 시작합니다.

4. 앱을 엽니다. 목록에 항목이 여전히 있어야 합니다.

5. 목록 확인이 끝나면 컨테이너를 제거하세요.

이제 데이터를 유지하는 방법을 배웠습니다.

## Dive into the volume

많은 사람들이 "볼륨을 사용할 때 Docker가 내 데이터를 어디에 저장하고 있는 건가요?"라는 질문을 자주 합니다. 알아보고 싶다면 `docker volume inspect` 명령어를 사용할 수 있습니다.

```bash
$ docker volume inspect todo-db
```

다음과 같은 출력이 표시됩니다 :

```json
[
  {
    "CreatedAt": "2019-09-26T02:18:36Z",
    "Driver": "local",
    "Labels": {},
    "Mountpoint": "/var/lib/docker/volumes/todo-db/_data",
    "Name": "todo-db",
    "Options": {},
    "Scope": "local"
  }
]
```

`Mountpoint`는 디스크에 있는 데이터의 실제 위치입니다. 대부분의 시스템에서는, 호스트로부터 이 디렉터리에 접근하려면 루트 액세스 권한이 필요합니다.

## Summary

이 섹션에서는 컨테이너 데이터를 유지하는 방법을 배웠습니다.

관련 정보:

- [docker CLI reference](https://docs.docker.com/reference/cli/docker/)
- [Volumes](https://docs.docker.com/engine/storage/volumes/)

## Next steps

다음 섹션에서는 바인드 마운트(bind mounts)를 사용하여 앱을 보다 효율적으로 개발하는 방법을 배우게 됩니다.

[Use bind mounts](/#/get-started/workshop/06_bind_mounts)
