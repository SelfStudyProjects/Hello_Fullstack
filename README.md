# Hello Fullstack 프로젝트

## Why – 프로젝트 목적

이 프로젝트는 **Docker, Docker Compose, MySQL, Nginx(선택), CI/CD(GitHub Actions–Docker Hub 자동화 배포)**까지 실전 DevOps & 백엔드 배포 파이프라인을 직접 체험하고 익히기 위해 설계되었습니다. 아래와 같이 실제 클라우드 환경에서 백엔드(Node.js)와 데이터베이스가 도커 기반으로 운영될 때의 모든 핵심 흐름(로컬 개발→컨테이너화→클라우드 배포→자동화→확장성) 경험을 목표로 합니다.

- **개발자 입장에서 클라우드 및 자동화 배포 파이프라인을 처음부터 끝까지 학습 및 실습**
- 실습환경에서 반복 배포, 코드 유지, CI/CD 자동화를 안정적으로 경험
- 신입/후임 개발자도 쉽게 이어받아 그대로 실습 또는 운영이 가능하도록 문서화

## What – 프로젝트 구성 요약

- **백엔드**: Node.js (간단한 REST API, 메시지 저장/불러오기)
- **데이터베이스**: MySQL (도커 컨테이너)
- **배포 자동화**: Docker, Docker Compose
- **프록시/확장(선택)**: Nginx 설정, 무료 SSL(도메인 연결시)
- **CI/CD**: GitHub Actions → Docker Hub로 이미지 자동 빌드&푸시, EC2 pull 및 서비스 재실행
- **테스트/운영**: EC2 SSH에서 내부 점검 및 외부 접속(네트워크 정책에 따라 제한 가능)

### 주요 디렉토리 및 파일 구조
- `/backend`: Node.js 백엔드 소스 코드, Dockerfile 포함
- `/docker-compose.yml`: 백엔드+DB 통합 컨테이너 오케스트레이션
- `.github/workflows/docker-publish.yml`: Github Actions CI/CD 파이프라인 설정
- `/nginx`(선택): 프록시 및 SSL/도메인 적용 nginx 설정 파일


## How – 실전 사용/운영 방법

1. **로컬 개발 및 컨테이너화**
   - `/backend` 하위에서 Node.js 서버 개발 (REST API)
   - Dockerfile로 백엔드 이미지 빌드
   - docker-compose로 backend, db 동시 기동 및 연동

2. **클라우드 배포 (EC2)**
   - 프로젝트 전체를 EC2에 clone/복사
   - `docker compose up -d`로 서비스 배포 및 재시작

3. **테스트/운영 점검**
   - EC2에서 직접 `curl localhost:3000/health` 등으로 헬스, 메시지 API 점검
   - (네트워크 정책에 따라 외부에서 바로 접근되지 않을 수 있음)

4. **Nginx 프록시/도메인/SSL 적용(선택)**
   - 도메인 및 nginx 설정 추가 → 프록시/SSL 적용으로 실서비스 수준까지 확장

5. **CI/CD 자동화 (GitHub Actions + Docker Hub)**
   - `.github/workflows/docker-publish.yml`에 빌드·푸시 자동화 로직 구현
   - Secrets에 DOCKERHUB_USERNAME, DOCKERHUB_TOKEN 등록(GitHub Settings)
   - main 브랜치에 push 시 Workflow가 실행 → Docker Hub에 최신 이미지 푸시됨
   - 운영 서버에서 최신 이미지를 pull, `docker compose up -d` 재실행 (수동 또는 추가 자동화 가능)


## 실제 파일/구성 예시

```plaintext
Hello_Fullstack/
├── backend/
│   ├── index.js
│   ├── package.json
│   ├── Dockerfile
│   └── ...
├── docker-compose.yml
├── nginx/ (선택)
│   └── hello (nginx conf)
└── .github/
    └── workflows/
        └── docker-publish.yml
```

## 피드백 및 점검 팁
- 프로젝트 복제 후 `.env` 등 민감 정보 필요시 추가 작성
- **모든 명령/구성과 정상 동작 예시**는 이 리드미에 기록된 절차를 참고해 따라하면 누구나 재현 및 유지 가능
- 에러 또는 예상과 다른 행동이 있을 경우, 도커/서버 로그, Actions 로그 등 실시간 진단 중요

***

이 문서는 신입/혹은 후임 개발자가 본 프로젝트의 개발·배포·자동화 운용을 처음 맡게 될 때도, Why/What/How와 함께 파일 구조, 구성 배경, 배포 흐름까지 한눈에 파악하고 실제 서비스를 유지 및 개선할 수 있도록 설계되었습니다.