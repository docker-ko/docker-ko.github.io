# What next after the Docker workshop

워크숍을 완료했지만, 컨테이너에 대해 배울 내용은 아직 많이 있습니다.

다음은 앞으로 살펴볼 수 있는 몇 가지 영역들입니다.

## Container orchestration

프로덕션 환경에서 컨테이너를 실행하는 것은 쉽지 않습니다. 단순히 머신에 로그인하여 `docker run`이나 `docker compose up` 명령을 실행하는 것을 원하지는 않을 겁니다. 왜 안될까요? 컨테이너가 중지되면 어떻게 될까요? 여러 머신들에서 어떻게 확장할 수 있을까요? 컨테이너 오케스트레이션은 이러한 문제를 해결합니다. Kubernetes, Swarm, Nomad, ECS와 같은 도구들은 모두 이 문제를 해결하는 데 도움이 되며, 각각 약간 다른 방식으로 접근합니다.

기본적인 아이디어은 예상되는 상태(state)를 수신하는 관리자(managers)가 있다는 것입니다. 이 상태는 "웹 앱을 두 개의 인스턴스로 실행하고 80번 포트를 노출하고 싶다"와 같은 것일 수 있습니다. 관리자는 클러스터의 모든 머신을 살피고 작업자 노드(worker nodes)에게 작업을 위임합니다. 관리자는 변경 사항(예: 컨테이너 종료)을 감시하고 실제 상태가 예상 상태를 반영하도록 작업합니다.

## Cloud Native Computing Foundation projects

CNCF는 Kubernetes, Prometheus, Envoy, Linkerd, NATS 등 다양한 오픈 소스 프로젝트를 위한 공급업체의 중립적 기반(vendor-neutral home)입니다. [졸업 및 인큐베이션 프로젝트를 여기서](https://www.cncf.io/projects/) 확인할 수 있으며, 전체 [CNCF 랜드스케이프는 여기서](https://landscape.cncf.io/) 볼 수 있습니다. 모니터링, 로깅, 보안, 이미지 레지스트리, 메시징 등의 문제를 해결하는 데 도움이 되는 많은 프로젝트가 있습니다.

## Getting started video workshop

Docker는 DockerCon 2022에서 진행된 비디오 워크숍을 시청하는 것을 권장합니다. 전체 비디오를 시청하거나 다음 링크를 사용하여 특정 섹션에서 비디오를 열 수 있습니다:

- [Docker 개요 및 설치](https://youtu.be/gAGEar5HQoU)
- [컨테이너 풀(pull), 실행, 탐색](https://youtu.be/gAGEar5HQoU?t=1400)
- [컨테이너 이미지 빌드](https://youtu.be/gAGEar5HQoU?t=3185)
- [앱 컨테이너화](hhttps://youtu.be/gAGEar5HQoU?t=4683)
- [DB 연결 및 바인드 마운트 설정](https://youtu.be/gAGEar5HQoU?t=6305)
- [클라우드에 컨테이너 배포](https://youtu.be/gAGEar5HQoU?t=8280)

<div class="youtube-video">
   <iframe 
    src="https://www.youtube.com/embed/gAGEar5HQoU" 
    frameborder="0" 
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
   >
  </iframe>
</div>

## Creating a container from scratch

컨테이너가 처음부터 어떻게 만들어지는지 보고 싶다면, Aqua Security의 Liz Rice가 Go 언어로 처음부터 컨테이너를 만드는 훌륭한 강연을 소개합니다. 이 강연은 네트워킹, 파일 시스템용 이미지 사용 및 기타 고급 주제를 다루지는 않지만, 컨테이너가 어떻게 작동하는지에 대한 깊이 있는 통찰을 제공합니다.

<div class="youtube-video">
   <iframe 
    src="https://www.youtube.com/embed/8fi7uSYlOdc" 
    frameborder="0" 
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
   >
  </iframe>
</div>