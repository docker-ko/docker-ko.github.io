# Update the application

[Part 1](/#/get-started/workshop/02_our_app)에서는 todo 애플리케이션을 컨테이너화했습니다. 이번 파트에서는 ​​애플리케이션과 이미지를 업데이트합니다. 컨테이너를 중지하고 제거하는 방법도 배웁니다.

## Update the source code

다음 단계에서는 할 일 목록 항목이 없을 때 표시되는 "빈 텍스트(empty text)"를 "할 일 항목이 아직 없습니다! 위에 추가하세요!(You have no todo items yet! Add one above!)"로 변경합니다.

1. `src/static/js/app.js` 파일에서, 56번째 줄을 업데이트하여 새로운 텍스트를 사용합니다.

   ```text
   - <p className="text-center">No items yet! Add one above!</p>

   + <p className="text-center">You have no todo items yet! Add one above!</p>
   ```

2. `docker build` 명령을 사용하여, 업데이트된 버전의 이미지를 빌드합니다.
   ```bash
   $ docker build -t getting-started .
   ```
3. 업데이트된 코드를 사용하여 새로운 컨테이너를 시작합니다.
   ```bash
   $ docker run -dp 127.0.0.1:3000:3000 getting-started
   ```

아마도 다음과 같은 오류가 표시되었을 것입니다 :

```text
docker: Error response from daemon: driver failed programming external connectivity on endpoint laughing_burnell
(bb242b2ca4d67eba76e79474fb36bb5125708ebdabd7f45c8eaf16caaabde9dd): Bind for 127.0.0.1:3000 failed: port is already allocated.
```

이 오류는 이전 컨테이너가 실행 중인 상태에서 새 컨테이너를 시작할 수 없어서 발생했습니다. 이전 컨테이너가 이미 호스트의 포트 3000을 사용하고 있고, 머신에서 하나의 프로세스(컨테이너 포함)만 특정 포트를 수신 대기할 수 있기 때문입니다. 이 문제를 해결하려면, 이전 컨테이너를 제거해야 합니다.

## Remove the old container

컨테이너를 제거하려면 먼저 중지해야 합니다. 중지된 후에 제거할 수 있습니다. CLI 또는 Docker Desktop의 그래픽 인터페이스를 사용하여 이전 컨테이너를 제거할 수 있습니다. 가장 편리한 옵션을 선택하세요.

#### Remove a container using the CLI

1. `docker ps` 명령을 사용하여 컨테이너 ID를 확인하세요.
   ```bash
   $ docker ps
   ```
2. `docker stop` 명령을 사용하여 컨테이너를 중지하세요. `<the-container-id>`를 `docker ps`에서 확인한 ID로 바꾸세요.
   ```bash
   $ docker stop <the-container-id>
   ```
3. 컨테이너가 중지되면 `docker rm` 명령을 사용하여 제거할 수 있습니다.
   ```bash
   $ docker rm <the-container-id>
   ```

> **Note**
>
> `docker rm` 명령에 `force` 플래그를 추가하면 단일 명령으로 컨테이너를 중지하고 제거할 수 있습니다. 예: `docker rm -f <컨테이너 ID>`

### Start the updated app container

1. 이제 `docker run` 명령을 사용하여 업데이트된 앱을 시작합니다.
   ```bash
   $ docker run -dp 127.0.0.1:3000:3000 getting-started
   ```
2. [http://localhost:3000](http://localhost:3000)에서 브라우저를 새로 고치면 업데이트된 텍스트가 표시됩니다.

## Summary

이 섹션에서는, 컨테이너를 중지하고 제거하는 방법 뿐만 아니라, 컨테이너를 업데이트하고 다시 빌드하는 방법을 학습했습니다.

관련 정보:

- [docker CLI reference](https://docs.docker.com/reference/cli/docker/)

## Next steps

다음으로, 다른 사람과 이미지를 공유하는 방법을 학습하게 될 겁니다.

<button-component href="/#/get-started/workshop/04_sharing_app" title="Share the application" />