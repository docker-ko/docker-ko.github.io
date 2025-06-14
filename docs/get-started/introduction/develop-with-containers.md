# Develop with containers

<div class="youtube-video">
   <iframe 
    src="https://www.youtube.com/embed/D0SDBrS3t9I" 
    frameborder="0" 
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
   >
  </iframe>
</div>

## Explanation

Docker Desktop을 설치했으니, 이제 애플리케이션 개발을 시작할 준비가 되었습니다. 구체적으로, 다음 작업을 수행합니다:

1. 개발 프로젝트를 클론하고 시작하기
2. 백엔드와 프론트엔드 수정하기
3. 변경 사항을 즉시 확인하기

## Try it out

이 실습 가이드에서는, 컨테이너를 사용하여 개발하는 방법을 배울 수 있습니다.

## Start the project

1. 프로젝트를 시작하려면, 로컬 머신에 프로젝트를 클론하거나 [ZIP 파일로 다운로드](https://github.com/docker/getting-started-todo-app/archive/refs/heads/main.zip)하세요.

    ```bash
    $ git clone https://github.com/docker/getting-started-todo-app
    ```

    프로젝트를 클론한 후, 클론을 통해 생성된 새 디렉토리로 이동합니다:

    ```bash
    $ cd getting-started-todo-app
    ```

2. 프로젝트가 생기면, Docker Compose를 사용하여 개발 환경을 시작하세요.

    CLI를 사용하여 프로젝트를 시작하려면 다음 명령어를 실행하세요:

    ```bash
    $ docker compose watch
    ```

    컨테이너 이미지가 다운로드되고 컨테이너가 시작되는 등의 출력이 표시됩니다. 이 시점에서 모든 내용을 이해하지 못해도 걱정하지 마세요. 하지만, 몇 분 안에, 안정화되고 완료될 것입니다.

3. 브라우저를 열고 [http://localhost](http://localhost/)로 이동하여 애플리케이션이 실행 중인지 확인하세요. 앱이 실행되는 데 몇 분이 걸릴 수 있습니다. 애플리케이션은 간단한 할 일 관리 앱이므로, 항목 한 두개를 추가해보거나, 완료로 표시하거나, 아이템을 삭제해보기도 하세요.

    ![start-project](https://docs.docker.com/get-started/introduction/images/develop-getting-started-app-first-launch.webp)

### What's in the environment?

이제 환경을 만들어 실행하고 있는데, 실제로 그 안에는 무엇을 포함하고 있을까요? 고수준에서, 여러 컨테이너(또는 프로세스)가 애플리케이션의 특정 요구를 충족합니다:

- React 프론트엔드: [Vite](https://vitejs.dev/)를 사용해 React 개발 서버를 실행하는 Node 컨테이너입니다.
- Node 백엔드: 할 일 항목을 검색, 생성 및 삭제하는 API를 제공합니다.
- MySQL 데이터베이스: 항목 목록을 저장하는 데이터베이스입니다.
- phpMyAdmin: 데이터베이스와 상호작용할 수 있는 웹 기반 인터페이스로 [http://db.localhost](http://db.localhost/)에서 접근 가능합니다.
- Traefik 프록시: [Traefik](https://traefik.io/traefik/)은 요청을 올바른 서비스로 라우팅하는 애플리케이션 프록시입니다. `localhost/api/*` 요청은 백엔드로, `localhost/*` 요청은 프론트엔드로, `db.localhost` 요청은 phpMyAdmin으로 보냅니다. 포트 80을 이용해 모든 애플리케이션에 액세스할 수 있는 능력을 제공합니다(각 서비스에 대해 다른 포트를 사용하는 대신).

이 환경에서는, 개발자가 서비스를 설치하거나 구성하거나, 데이터베이스 스키마를 채우거나, 데이터베이스 자격 증명을 설정하는 등의 작업을 할 필요가 없습니다. Docker Desktop만 있으면 됩니다. 나머지는 그냥 알아서 작동합니다.

## Make changes to the app

이 환경을 구축하고 실행하면, 애플리케이션에 몇 가지 변경 사항을 적용하고 Docker가 어떻게 빠른 피드백 루프를 제공하는지 확인할 준비가 된 겁니다.

### Change the greeting

페이지 상단의 인사말는 `/api/greeting` API 호출로 채워집니다. 현재는 항상 "Hello world!"를 반환합니다. 이를 세 가지 무작위 메시지(여러분이 선택할 수 있는) 중 하나를 반환하도록 수정합니다.

1. `backend/src/routes/getGreeting.js` 파일을 텍스트 편집기로 엽니다. 이 파일은 API 엔드포인트의 핸들러를 제공합니다.
2. 상단의 변수를 인사말 배열로 수정합니다. 다음 수정 사항을 사용하거나 원하는 대로 사용자 정의하세요. 또한 이 목록에서 무작위 인사를 보내도록 엔드포인트를 업데이트하세요.

    ```javascript
    const GREETINGS = [
        "Whalecome!",
        "All hands on deck!",
        "Charting the course ahead!",
    ];

    module.exports = async (req, res) => {
        res.send({
            greeting: GREETINGS[ Math.floor( Math.random() * GREETINGS.length )],
        });
    };
    ```

3. 아직 저장하지 않으셨다면, 파일을 저장하세요. 브라우저를 새로 고치면, 새로운 인사말이 표시됩니다. 계속 새로 고치면, 모든 메시지가 나타나는 것을 확인할 수 있습니다.

    ![새로운 인사말이 포함된 할 일 관리 앱의 스크린샷](https://docs.docker.com/get-started/introduction/images/develop-app-with-greetings.webp)

### Change the placeholder text

앱을 보면, 플레이스홀더 텍스트가 단순히 "New Item"으로 표시될 겁니다. 이를 더 설명적이고 재미있게 만듭니다. 또한 앱의 스타일도 몇 가지 변경하게 될 겁니다.

1. `client/src/components/AddNewItemForm.jsx` 파일을 엽니다. 이 파일은 할 일 목록에 새 항목을 추가하는 컴포넌트를 제공합니다.
2. `Form.Control` 요소의 `placeholder` 속성을 디스플레이되길 원하는 텍스트로 수정하세요.

    ```jsx
    <Form.Control
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        type="text"
        placeholder="What do you need to do?"
        aria-label="New item"
    />
    ```

3. 파일을 저장하고 브라우저로 돌아가세요. 변경 사항이 브라우저에 핫 리로드된 것을 확인할 수 있습니다. 마음에 들지 않으면, 원하는 대로 수정해 보세요.

    ![업데이트된 플레이스홀더가 포함된 할 일 관리 앱의 스크린샷](https://docs.docker.com/get-started/introduction/images/develop-app-with-updated-placeholder.webp)

### Change the background color

애플리케이션을 최종적으로 완성하기 전에, 색상을 개선해야 합니다.

1. `client/src/index.scss` 파일을 엽니다.
2. `background-color` 속성을 원하는 색상으로 조정합니다. 제공된 스니펫은 Docker의 해양 테마에 맞는 부드러운 파란색입니다.

    IDE를 사용하는 경우, 내장된 색상 선택기를 사용하여 색상을 선택할 수 있습니다. 그렇지 않은 경우, 온라인 [색상 선택기](https://www.w3schools.com/colors/colors_picker.asp)를 사용해도 됩니다.

    ```scss
    body {
        background-color: #99bbff;
        margin-top: 50px;
        font-family: 'Lato';
    }
    ```

    저장할 때마다 브라우저에서 변경 사항을 즉시 확인할 수 있습니다. 자신에게 딱 맞는 설정이 될 때까지 계속 조정하세요.

    ![새로운 배경색이 적용된 할 일 관리 앱의 스크린샷](https://docs.docker.com/get-started/introduction/images/develop-app-with-updated-client.webp)

그리고 이것으로, 끝났습니다. 여러분의 웹사이트를 업데이트하신 것을 축하드립니다.

## Recap

다음 단계로 넘어가기 전에, 잠시 시간을 내어 여기서 무슨 일이 일어났는지 생각해 보세요. 몇 분 안에 다음과 같은 일들을 할 수 있었습니다:

- 설치 노력 없이 완전한 개발 프로젝트를 시작했습니다. 컨테이너화된 환경은 개발 환경을 제공하여, 여러분에게 필요한 모든 것을 갖추는 것을 보장합니다. Node, MySQL 또는 기타 종속성을 직접 설치할 필요가 없었습니다. Docker Desktop과 코드 편집기만 있으면 충분했습니다.
- 변경 사항을 즉시 확인했습니다. 이것이 가능한 이유는 1) 각 컨테이너에서 실행되는 프로세스가 파일 변경 사항을 감시하고 이에 응답하고 2) 파일이 컨테이너화된 환경과 공유되기 때문입니다.

Docker Desktop은 이를 가능하게 하고 더 많은 기능을 제공합니다. 컨테이너를 사용하여 생각하기 시작하면, 거의 모든 환경을 만들고 팀과 쉽게 공유할 수 있습니다.

## Next steps

애플리케이션을 업데이트했으니, 이제 컨테이너 이미지로 패키징하고 레지스트리, 특히 Docker Hub에 푸시하는 방법을 배울 준비가 되었습니다.

<button-component href="/#/get-started/introduction/build-and-push-first-image" title="Build and push your first image" />