# Multi-stage builds
<div class="youtube-video">
   <iframe 
    src="https://www.youtube.com/embed/vR185cjwxZ8" 
    frameborder="0" 
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
   >
  </iframe>
</div>

## Explanation

기존 빌드에서는 모든 빌드 명령어가 순차적으로 실행되며 단일 빌드 컨테이너에서 수행됩니다: 의존성 다운로드, 코드 컴파일, 애플리케이션 패키징. 이 모든 레이어가 최종 이미지에 포함됩니다. 이러한 접근 방식은 작동하지만, 불필요한 용량을 차지하고 보안 위험을 증가시킵니다. 여기서 다중 단계 빌드가 등장합니다.

다중 단계 빌드는 Dockerfile에서 여러 단계를 도입하여 각 단계마다 특정 목적을 갖게 합니다. 이는 빌드의 각 부분을 여러 다른 환경에서 동시에 실행할 수 있는 능력을 의미합니다. 빌드 환경을 최종 실행 환경과 분리함으로써 이미지 크기와 공격 면적을 크게 줄일 수 있습니다. 이는 대규모 빌드 의존성을 가진 애플리케이션에 특히 유용합니다.

다중 단계 빌드는 모든 종류의 애플리케이션에 권장됩니다.

- JavaScript, Ruby, Python과 같은 인터프리터 언어의 경우, 하나의 단계에서 코드를 빌드하고 최소화하며, 프로덕션 준비 파일을 더 작은 실행 이미지에 복사할 수 있습니다. 이는 배포를 최적화합니다.
- C, Go, Rust와 같은 컴파일 언어의 경우, 다중 단계 빌드는 하나의 단계에서 컴파일하고 컴파일된 바이너리를 최종 실행 이미지에 복사할 수 있습니다. 최종 이미지에 전체 컴파일러를 포함할 필요가 없습니다.

다음은 의사 코드(pseudo-code)를 사용한 다중 단계 빌드 구조의 간단한 예시입니다. 여러 `FROM` 명령어와 새로운 `AS <stage-name>` 문구가 사용되고 있습니다. 또한, 두 번째 단계의 `COPY` 명령어는 이전 단계에서 `--from`을 복사하고 있습니다.

```dockerfile
# 단계 1: 빌드 환경
FROM builder-image AS build-stage
# 빌드 도구 설치 (예: Maven, Gradle)
# 소스 코드 복사
# 빌드 명령어 (예: 컴파일, 패키징)

# 단계 2: 실행 환경
FROM runtime-image AS final-stage
# 빌드 단계에서 애플리케이션 아티팩트 복사 (예: JAR 파일)
COPY --from=build-stage /path/in/build/stage /path/to/place/in/final/stage
# 실행 환경 설정 (예: CMD, ENTRYPOINT)
```

이 Dockerfile은 두 단계를 사용합니다:

- 빌드 단계는 애플리케이션을 컴파일하는 데 필요한 빌드 도구가 포함된 베이스 이미지를 사용합니다. 여기에는 빌드 도구 설치, 소스 코드 복사 및 빌드 명령어 실행이 포함됩니다.
- 최종 단계는 애플리케이션을 실행하는 데 적합한 더 작은 기본 이미지를 사용합니다. 빌드 단계에서 컴파일된 아티팩트를 복사하고 애플리케이션을 시작하기 위한 실행 환경(`CMD` 또는 `ENTRYPOINT` 사용)을 정의합니다.

## Try it out

이 실습 가이드에서는 다중 단계 빌드의 힘을 활용하여 샘플 Java 애플리케이션을 위한 간결하고 효율적인 Docker 이미지를 생성합니다. Maven을 사용하여 빌드된 간단한 "Hello World" Spring Boot 애플리케이션을 예시로 사용합니다.

1. Docker Desktop을 [다운로드 및 설치하세요](https://www.docker.com/products/docker-desktop/?_gl=1*se10o0*_gcl_au*MjczODgxODI4LjE3Mzg0NzA0NDI.*_ga*MjEyODM1MDY2OC4xNzIwMzEyNzQ5*_ga_XJWPQMJYHQ*MTczOTc4MTMwMC43Mi4xLjE3Mzk3ODEzMjMuMzcuMC4w).
2. 이 [미리 초기화된 프로젝트](https://start.spring.io/#!type=maven-project&language=java&platformVersion=3.4.0-M3&packaging=jar&jvmVersion=21&groupId=com.example&artifactId=spring-boot-docker&name=spring-boot-docker&description=Demo%20project%20for%20Spring%20Boot&packageName=com.example.spring-boot-docker&dependencies=web)를 열어 ZIP 파일을 생성합니다. 다음과 같이 보입니다:
   ![spring-initalizer](https://docs.docker.com/get-started/docker-concepts/building-images/images/multi-stage-builds-spring-initializer.webp)
   [Spring Initializr](https://start.spring.io/)는 Spring 프로젝트를 위한 퀵스타트 생성기입니다. Java, Kotlin, Groovy와 같은 일반적인 개념을 위한 기본 언어 생성을 구현하여 JVM 기반 프로젝트를 생성할 수 있는 확장 가능한 API를 제공합니다.

   이 프로젝트의 ZIP 파일을 생성 및 다운로드하려면 "Generate"를 선택합니다.

   이 데모에서는 Maven 빌드 자동화를 Java, Spring 웹 종속성 및 메타데이터용 Java 21과 페어링했습니다.

3. 프로젝트 디렉토리로 이동합니다. 파일을 압축 해제하면, 다음과 같은 프로젝트 디렉토리 구조를 볼 수 있습니다:

   ```
   spring-boot-docker
   ├── HELP.md
   ├── mvnw
   ├── mvnw.cmd
   ├── pom.xml
   └── src
       ├── main
       │   ├── java
       │   │   └── com
       │   │       └── example
       │   │           └── spring_boot_docker
       │   │               └── SpringBootDockerApplication.java
       │   └── resources
       │       ├── application.properties
       │       ├── static
       │       └── templates
       └── test
           └── java
               └── com
                   └── example
                       └── spring_boot_docker
                           └── SpringBootDockerApplicationTests.java
    15 directories, 7 files
   ```

   `src/main/java` 디렉토리에는 프로젝트의 소스 코드가 포함되어 있고, `src/test/java` 디렉토리에는 테스트 소스가 포함되어 있으며, `pom.xml` 파일은 프로젝트의 Project Object Model (POM)입니다.

   `pom.xml` 파일은 Maven 프로젝트의 설정의 핵심입니다. 이 파일 하나에 커스터마이징된 프로젝트를 빌드하는 데 필요한 대부분의 정보가 포함되어 있습니다. POM은 방대할 수 있지만, 효과적으로 사용하는 데 모든 세부 사항을 이해할 필요는 없습니다.

4. "Hello World!"를 표시하는 RESTful 웹 서비스 생성하세요.

   `src/main/java/com/example/spring_boot_docker/` 디렉토리 아래에서 `SpringBootDockerApplication.java` 파일을 다음 내용으로 수정할 수 있습니다:

   ```java
   package com.example.spring_boot_docker;

   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RestController;

   @RestController
   @SpringBootApplication
   public class SpringBootDockerApplication {
       @RequestMapping("/")
       public String home() {
           return "Hello World";
       }

       public static void main(String[] args) {
           SpringApplication.run(SpringBootDockerApplication.class, args);
       }
   }
   ```

   `SpringBootDockerApplication.java` 파일은 `com.example.spring_boot_docker` 패키지를 선언하고 필요한 Spring 프레임워크를 임포트합니다. 이 Java 파일은 사용자가 홈페이지를 방문할 때 "Hello World"라는 응답을 반환하는 간단한 Spring Boot 웹 애플리케이션을 생성합니다.

### Create the Dockerfile

이제 프로젝트가 준비되었으므로 `Dockerfile`을 생성할 준비가 되었습니다.

1. `Dockerfile`이라는 파일을 프로젝트 디렉토리에 생성합니다 (예: src, pom.xml 등이 있는 디렉토리).

2. `Dockerfile`에서 다음 줄을 추가하여 베이스 이미지를 정의합니다:

   ```dockerfile
   FROM eclipse-temurin:21.0.2_13-jdk-jammy
   ```

3. 다음으로, `WORKDIR` 지시어를 사용하여 작업 디렉토리를 정의합니다. 이는 향후 명령어가 실행될 위치와 컨테이너 이미지 내에 파일이 복사될 디렉토리를 지정합니다.

   ```dockerfile
   WORKDIR /app
   ```

4. Maven 래퍼 스크립트와 프로젝트의 `pom.xml` 파일을 현재 작업 디렉토리 `/app`으로 복사합니다.

   ```dockerfile
   COPY .mvn/ .mvn
   COPY mvnw pom.xml ./
   ```

5. 컨테이너 내에서 명령어를 실행합니다. 이 명령어는 `./mvnw dependency:go-offline` 명령어를 실행하여 Maven 래퍼(`./mvnw`)를 사용하여 프로젝트의 모든 의존성을 다운로드합니다 (최종 JAR 파일을 빌드하지 않음, 빠른 빌드를 위해 유용).

   ```dockerfile
   RUN ./mvnw dependency:go-offline
   ```

6. 호스트 머신에서 프로젝트의 `src` 디렉토리를 컨테이너의 `/app` 디렉토리로 복사합니다.

   ```dockerfile
   COPY src ./src
   ```

7. 기본 명령어를 설정하여 컨테이너 시작 시 실행될 명령어를 정의합니다. 이 명령어는 Maven 래퍼(`./mvnw`)를 `spring-boot:run` 목표와 함께 실행하여 Spring Boot 애플리케이션을 빌드하고 실행합니다.

   ```dockerfile
   CMD ["./mvnw", "spring-boot:run"]
   ```

   이제 다음과 같은 Dockerfile이 완성됩니다:

   ```dockerfile
   FROM eclipse-temurin:21.0.2_13-jdk-jammy
   WORKDIR /app
   COPY .mvn/ .mvn
   COPY mvnw pom.xml ./
   RUN ./mvnw dependency:go-offline
   COPY src ./src
   CMD ["./mvnw", "spring-boot:run"]
   ```

### Build the container image

1. 다음 명령어를 실행하여 Docker 이미지를 빌드합니다:

   ```sh
   $ docker build -t spring-helloworld .
   ```

2. `docker images` 명령어를 사용하여 Docker 이미지의 크기를 확인합니다:

   ```sh
   $ docker images
   ```

   이 명령어는 다음과 같은 출력을 생성합니다:

   ```plaintext
   REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
   spring-helloworld   latest              ff708d5ee194        3 minutes ago       880MB
   ```

   이 출력은 이미지 크기가 880MB임을 나타냅니다. 여기에는 전체 JDK, Maven 툴체인 등이 포함됩니다. 프로덕션에서는 최종 이미지에 필요하지 않습니다.

### Run the Spring Boot application

1. 이제 이미지를 빌드했으므로, 컨테이너를 실행할 시간입니다.

   ```sh
   $ docker run -p 8080:8080 spring-helloworld
   ```

   그러면 컨테이너 로그에 다음과 유사한 출력이 표시됩니다:

   ```plaintext
   [INFO] --- spring-boot:3.3.4:run (default-cli) @ spring-boot-docker ---
   [INFO] Attaching agents: []
   ____  _   __ _ _ _
   /\\  / ___'_ __ _ _(_)_ __ __ _ _ __ ___
   ( ( )\\___ | '_ | '_| | '_ \\/ _` | ' _ ` _ \\
   \\/ ___)| |_)| | | | | || (_| | | | | | | |
   ' |____| .__|_| |_| |_| |_\\__, | | | |_| |_|
   =========|_|==============|___/=/_/_/_/

   :: Spring Boot ::        (v3.3.4)

   2024-09-29T23:54:07.157Z INFO  159 --- [spring-boot-docker] [           main] c.e.s.SpringBootDockerApplication      : Starting SpringBootDockerApplication using Java 21.0.2 with PID 159 (/app/target/classes started by root in /app)
   ….
   ```

2. 웹 브라우저를 통해 [http://localhost:8080](http://localhost:8080/) 에서 “Hello World” 페이지에 액세스하거나 다음 curl 명령어를 사용하여 액세스할 수 있습니다:

   ```sh
   $ curl localhost:8080
   Hello World
   ```

### Use multi-stage builds

1. 다음 Dockerfile을 고려하세요:

   ```dockerfile
   FROM eclipse-temurin:21.0.2_13-jdk-jammy AS builder
   WORKDIR /opt/app
   COPY .mvn/ .mvn
   COPY mvnw pom.xml ./
   RUN ./mvnw dependency:go-offline
   COPY ./src ./src
   RUN ./mvnw clean install

   FROM eclipse-temurin:21.0.2_13-jre-jammy AS final
   WORKDIR /opt/app
   EXPOSE 8080
   COPY --from=builder /opt/app/target/*.jar /opt/app/*.jar
   ENTRYPOINT ["java", "-jar", "/opt/app/*.jar"]
   ```

이 Dockerfile이 두 단계로 분할되었다는 점에 주목하세요.

- 첫 번째 단계는 이전 Dockerfile과 동일하게 Java Development Kit (JDK) 환경을 제공하여 애플리케이션을 빌드합니다. 이 단계의 이름은 builder입니다.

- 두 번째 단계는 새로운 단계로, `final`이라는 이름을 가지고 있습니다. 이는 더 슬림한 `eclipse-temurin:21.0.2_13-jre-jammy` 이미지를 사용하여 애플리케이션을 실행하는 데 필요한 Java Runtime Environment (JRE)만 포함합니다. 이 이미지는 컴파일된 애플리케이션(JAR 파일)을 실행하는 데 필요한 Java Runtime Environment (JRE)를 제공합니다.

> 프로덕션 환경에서는 `jlink`를 사용하여 커스텀 JRE와 유사한 런타임을 생성하는 것이 강력히 권장됩니다. JRE 이미지는 모든 Eclipse Temurin 버전에 대해 제공되지만, jlink를 사용하여 애플리케이션에 필요한 Java 모듈만 포함하는 최소 런타임을 생성할 수 있습니다. 이는 최종 이미지의 크기를 크게 줄이고 보안을 향상시킬 수 있습니다. 자세한 내용은 [이 페이지를 참조하세요](https://hub.docker.com/_/eclipse-temurin?_gl=1*17wus8o*_gcl_au*MjczODgxODI4LjE3Mzg0NzA0NDI.*_ga*MjEyODM1MDY2OC4xNzIwMzEyNzQ5*_ga_XJWPQMJYHQ*MTczOTc4MTMwMC43Mi4xLjE3Mzk3ODEzMjMuMzcuMC4w).

다중 단계 빌드를 사용하면 Docker 빌드는 컴파일, 패키징, 유닛 테스트를 위해 하나의 기본 이미지를 사용하고 애플리케이션 런타임을 위해 별도의 이미지를 사용합니다. 그 결과, 최종 이미지는 개발 또는 디버깅 도구를 포함하지 않으므로 크기가 더 작아집니다. 빌드 환경을 최종 런타임 환경과 분리함으로써 이미지 크기를 크게 줄이고 최종 이미지의 보안을 강화할 수 있습니다.

2. 이제, 이미지를 다시 빌드하고 사용 준비가 된 프로덕션 빌드를 실행하세요.

   ```sh
   $ docker build -t spring-helloworld-builder .
   ```

   이 명령어는 현재 디렉토리에 있는 `Dockerfile` 파일의 최종 단계를 사용하여 `spring-helloworld-builder`라는 Docker 이미지를 빌드합니다.

   > **Note**
   >
   > 다중 단계 Dockerfile에서 최종 단계(final)는 기본적으로 빌드 대상입니다. 즉, `docker build` 명령어에서 `--target` 플래그를 사용하여 대상 단계를 명시적으로 지정하지 않으면 Docker는 기본적으로 마지막 단계를 빌드합니다. JDK 환경으로 빌더 단계를 빌드하려면 다음 명령어를 사용할 수 있습니다:
   >
   > `docker build -t spring-helloworld-builder --target builder .`

3. 이미지 크기 차이를 `docker images` 명령어를 사용하여 확인하세요:

   ```sh
   $ docker images
   ```

   다음과 유사한 출력을 얻을 수 있습니다:

   ```plaintext
   REPOSITORY                  TAG        IMAGE ID      CREATED       SIZE
   spring-helloworld-builder   latest     c5c76cb815c0  24 minutes ago 428MB
   spring-helloworld           latest     ff708d5ee194  About an hour ago 880MB
   ```

   최종 이미지는 428MB에 불과하며, 초기 빌드 크기 880MB와 비교됩니다.

   각 단계를 최적화하고 필요한 것만 포함함으로써 전체 이미지 크기를 크게 줄이면서 동일한 기능을 달성할 수 있었습니다. 이는 성능을 향상시킬 뿐만 아니라 Docker 이미지를 더 경량화하고, 더 안전하게 만들며, 관리하기 쉽게 만듭니다.

## Additional resources

- [Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
- [Dockerfile best practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Base images](https://docs.docker.com/build/building/base-images/)
- [Spring Boot Docker](https://spring.io/guides/topicals/spring-boot-docker)
