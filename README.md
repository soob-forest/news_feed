## 설명

### 학교소식 뉴스피드

- 매니저 권한의 사용자는 학교페이지를 생성, 해당 학교의 뉴스를 생성 가능하다.
- 학생 권한의 사용자는 학교를 팔로잉하고, 뉴스피드를 받아 볼 수 있다.

## 기술스택
- nodejs
- nestjs
- typeorm
- graphql
- mysql

## 설치환경
- nodejs
- mysql

## 설치

```bash
$ npm install
```

## 실행

### .env 파일 생성

- root 디렉토리에 .env 이름의 파일 생성

```
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
JWT_EXPIRATION_TIME=
```

### 실행
```bash
$ npm run start

# watch mode
$ npm run start:dev

```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## API Specification

http://localhost:3000/graphql

### 간단한 api 사용 방법

1. 계정을 생성
2. 로그인 mutation을 이용해 token을 응답 받는다.
3. token을 http header의 Authorization 에 넣어서 다른 api test를 진행한다.

### query

- me
  - 현재 로그인한 유저의 정보를 반환
  - 해당 쿼리를 이용해 팔로우하는 학교의 목록, 뉴스피드, 관리하고 있는 학교 목록, 생성한 뉴스 목록을 응답 받을 수 있다.
- school
  - 학교 정보
- news
  - 뉴스 정보

### mutation

- createAccount
  - 계정생성
  - 이메일, 비밀번호, 역할을 파라미터로 받는다.
- login
  - token을 반환
- followSchool
  - 학교 follow
- unFollowSchool
  - 학교 unfollow
- createSchool
  - 학교 생성
- updateSchool
  - 학교 정보 수정
- deleteSchool
  - 학교 삭제
- createNews
  - 뉴스 생성
- updateNews
  - 뉴스 내용 수정
- deleteNews
  - 뉴스 삭제
