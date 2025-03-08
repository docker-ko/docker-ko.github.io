# Persisting container data

[유튜브 링크](https://youtu.be/10_2BjqB_Ls)

## Explanation

컨테이너가 시작되면 이미지에서 제공하는 파일과 구성을 사용합니다. 각 컨테이너는 파일을 만들고, 수정하고, 삭제할 수 있으며 다른 컨테이너에 영향을 미치지 않습니다. 컨테이너가 삭제되면 이러한 파일 변경 사항도 삭제됩니다.

컨테이너의 이러한 일시적인 특성은 훌륭하지만, 데이터를 유지하려고 할 때 문제가 됩니다. 예를 들어 데이터베이스 컨테이너를 다시 시작하는 경우 빈 데이터베이스로 시작하고 싶지 않을 수 있습니다. 그렇다면 파일을 어떻게 유지할까요?

### Container volumes

볼륨은 개별 컨테이너의 수명 주기(lifecycle)를 넘어 데이터를 유지할 수 있는 기능을 제공하는 저장 메커니즘입니다. 컨테이너 내부에서 컨테이너 외부로 바로가기나 심볼릭 링크를 제공하는 것처럼 생각해 보세요.

예를 들어, `log-data`라는 볼륨을 생성한다고 가정해 보겠습니다.

```bash
$ docker volume create log-data
```

다음 명령으로 컨테이너를 시작하면 볼륨이 `/logs`에 있는 컨테이너에 마운트(또는 연결)됩니다:

```bash
$ docker run -d -p 80:80 -v log-data:/logs docker/welcome-to-docker
```

볼륨 `log-data`가 존재하지 않으면, Docker가 자동으로 생성합니다.

컨테이너가 실행되면, `/logs` 폴더에 쓰는 모든 파일이 컨테이너 외부의 이 볼륨에 저장됩니다. 컨테이너를 삭제하고 동일한 볼륨을 사용하여 새 컨테이너를 시작하면 파일이 그대로 있습니다.

> #### Sharing files using volumes
>
> 동일한 볼륨을 여러 컨테이너에 연결하여 컨테이너 간에 파일을 공유할 수 있습니다. 이는 로그 집계, 데이터 파이프라인 또는 기타 이벤트 기반 애플리케이션과 같은 시나리오에서 유용할 수 있습니다.

### Managing volumes

볼륨은 컨테이너의 수명 주기를 넘어 자체 수명 주기를 가지고 있으며 사용하는 데이터 및 애플리케이션 유형에 따라 상당히 커질 수 있습니다. 다음 명령은 볼륨을 관리하는 데 도움이 됩니다:

- `docker volume ls` : 모든 볼륨을 나열합니다.
- `docker volume rm <volume-name-or-id>` : 볼륨을 제거합니다(볼륨이 어떤 컨테이너에도 연결되지 않은 경우에만 작동).
- `docker volume prune` : 사용되지 않는(연결되지 않은) 모든 볼륨을 제거합니다.

## Try it out

이 가이드에서는 Postgres 컨테이너에서 만든 데이터를 유지하기 위해 볼륨을 만들고 사용하는 방법을 연습합니다. 데이터베이스가 실행되면, `/var/lib/postgresql/data` 디렉터리에 파일을 저장합니다. 여기에 볼륨을 연결하면 데이터를 유지하면서 컨테이너를 여러 번 다시 시작할 수 있습니다.

### Use volumes

1. 도커 데스크탑을 [다운로드 및 설치](https://docs.docker.com/get-started/get-docker/)합니다
2. 다음 명령어로 [Postgres image](https://hub.docker.com/_/postgres?_gl=1*1vifytj*_gcl_au*MjczODgxODI4LjE3Mzg0NzA0NDI.*_ga*MjEyODM1MDY2OC4xNzIwMzEyNzQ5*_ga_XJWPQMJYHQ*MTc0MTMwNjY0NS45MS4xLjE3NDEzMDY2NDcuNTguMC4w)를 사용해 컨테이너를 시작합니다
   ```bash
   $ docker run --name=db -e POSTGRES_PASSWORD=secret -d -v postgres_data:/var/lib/postgresql/data postgres
   ```
   이렇게 하면 백그라운드에서 데이터베이스가 시작되고, 암호로 구성되고, 데이터베이스 파일들을 유지하는 PostgreSQL 디렉토리에 볼륨이 연결됩니다.
3. 다음 명령을 사용하여 데이터베이스에 연결합니다:
   ```bash
   $ docker exec -ti db psql -U postgres
   ```
4. PostgreSQL 명령줄에서 다음을 실행하여 데이터베이스 테이블을 생성하고 두 개의 레코드를 삽입합니다:

   ```sql
   CREATE TABLE tasks (
        id SERIAL PRIMARY KEY,
        description VARCHAR(100)
   );
   INSERT INTO tasks (description) VALUES ('Finish work'), ('Have fun');
   ```

5. PostgreSQL 명령줄에서 다음을 실행하여 데이터가 데이터베이스에 있는지 확인하세요:

   ```sql
   SELECT * FROM tasks;
   ```

   다음과 같은 출력이 나와야 합니다:

   ```bash
   id | description
   ----+-------------
   1 | Finish work
   2 | Have fun
   (2 rows)
   ```

6. 다음 명령을 실행하여 PostgreSQL 셸을 종료합니다:

   ```bash
   \q
   ```

7. 데이터베이스 컨테이너를 중지하고 제거합니다. 컨테이너가 삭제되었더라도 데이터는 `postgres_data` 볼륨에 유지된다는 점을 기억하세요.

   ```bash
   $ docker stop db
   $ docker rm db
   ```

8. 다음 명령을 실행하여 새 컨테이너를 시작하고 지속된 데이터가 있는 동일한 볼륨을 연결합니다:

   ```bash
   $ docker run --name=new-db -d -v postgres_data:/var/lib/postgresql/data postgres
   ```

   `POSTGRES_PASSWORD` 환경 변수가 생략된 것을 알아차렸을 것입니다. 그 이유는 해당 변수가 새 데이터베이스를 부트스트래핑할 때만 사용되기 때문입니다.

9. 다음 명령을 실행하여 데이터베이스에 여전히 레코드가 있는지 확인하세요:

   ```bash
   $ docker exec -ti new-db psql -U postgres -c "SELECT * FROM tasks"
   ```

### View volume contents

Docker Desktop Dashboard는 모든 볼륨의 내용을 볼 수 있는 기능과 볼륨을 내보내고, 가져오고, 복제할 수 있는 기능을 제공합니다.

1. Docker Desktop Dashboard를 열고 **Volumes** 뷰로 이동합니다. 이 뷰에서 **postgres_data** 볼륨을 볼 수 있습니다.
2. **postgres_data** 볼륨의 이름을 선택합니다.
3. **Data** 탭은 볼륨의 내용을 표시하고 파일을 탐색할 수 있는 기능을 제공합니다. 파일을 두 번 클릭하면 내용을 보고 변경할 수 있습니다.
4. 파일을 마우스 오른쪽 버튼으로 클릭하여 저장하거나 삭제합니다.

### Remove volumes

볼륨을 제거하기 전에 어떤 컨테이너에도 연결되어서는 안 됩니다. 이전 컨테이너를 제거하지 않은 경우 다음 명령으로 제거하세요(-f는 먼저 컨테이너를 중지한 다음 제거합니다):

```bash
$ docker rm -f new-db
```

볼륨을 제거하는 데에는 다음과 같이 몇 가지 방법이 있습니다:

- Docker Desktop Dashboard에서 볼륨의 **Delete Volume** 옵션을 선택하세요.
- `docker volume rm` 명령어를 사용합니다:
  ```bash
  $ docker volume rm postgres_data
  ```
- 사용하지 않는 볼륨들을 제거하기 위해 `docker volume prune` 명령어를 사용합니다:
  ```bash
  $ docker volume prune
  ```

## Additional resources

다음 자료는 볼륨에 대해 더 자세히 알아보는 데 도움이 됩니다:

- [Manage data in Docker](https://docs.docker.com/engine/storage)
- [Volumes](https://docs.docker.com/engine/storage/volumes)
- [Volume mounts](https://docs.docker.com/engine/containers/run/#volume-mounts)

## Next steps

이제 컨테이너 데이터를 유지하는 법에 대해 알아보았으니, 로컬 파일을 컨테이너와 공유하는 방법을 알아볼 차례입니다.

[Sharing local files with containers](#/get-started/docker-concepts/running-containers/sharing-local-files.md)
