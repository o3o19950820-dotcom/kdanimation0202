# JUNO KD02 보안 문의게시판 + AI 검색 패치

이 폴더의 파일을 기존 `o3o19950820-dotcom/kdanimation0202` 저장소 **루트에 덮어쓰기/추가**하면 됩니다.

기존 `assets/` 폴더와 사진은 건드리지 않습니다.

## 이 패치에서 바뀌는 것

- 고객 비공개 문의
  - 고객이 아이디 + 비밀번호로 문의 등록
  - 같은 아이디 + 비밀번호를 입력해야 자기 문의 목록과 답변 확인
  - 비밀번호는 원문 저장 금지, bcrypt 해시만 Firestore에 저장
  - 문의 내용은 브라우저에서 Firestore 직접 접근 불가
- 관리자
  - 기존 `admin.js`에 박혀 있던 관리자 ID/PW 제거
  - Firebase Authentication 이메일/비밀번호 로그인 사용
  - `ADMIN_EMAILS`에 등록된 관리자만 서버 API 사용 가능
  - 모든 고객 문의 확인/답변/삭제 가능
  - 기존 이벤트/디자이너/스타일/헤어TIP/블로그/FAQ 저장도 서버 API 경유
- AI/검색
  - `OAI-SearchBot` 크롤링 허용
  - `GPTBot` 학습 크롤링은 차단 (검색과 학습 분리)
  - 실제 URL `/hair-tips.html`, `/foreign.html` 추가
  - sitemap을 실제 URL 기준으로 수정
  - HairSalon / FAQPage 구조화 데이터 추가
  - 고객 API는 robots + `X-Robots-Tag: noindex` 처리

---

# 1. GitHub에 파일 올리기

이 압축파일 안의 파일을 기존 저장소 루트에 복사합니다.

교체:
- `index.html`
- `style.css`
- `app.js`
- `admin.js`
- `firebase.js`
- `robots.txt`
- `sitemap.xml`

추가:
- `inquiry.js`
- `foreign.html`
- `hair-tips.html`
- `package.json`
- `vercel.json`
- `firestore.rules`
- `firebase.json`
- `api/_firebaseAdmin.js`
- `api/inquiries.js`
- `api/admin.js`

`assets/` 폴더는 그대로 둡니다.

---

# 2. Firebase Authentication 켜기

Firebase Console → 프로젝트 `junokd02`

**Authentication → Sign-in method → Email/Password 활성화**

그 다음 Authentication → Users에서 관리자 계정을 하나 직접 만듭니다.

예:
- 이메일: 본인 관리자용 이메일
- 비밀번호: 충분히 긴 관리자 비밀번호

이 이메일 주소는 다음 Vercel `ADMIN_EMAILS` 값에도 똑같이 넣습니다.

중요: 예전 `junokd02 / 기존 비밀번호` 방식은 이 패치부터 사용하지 않습니다.

---

# 3. Firebase 서비스 계정 만들기

Firebase Console →

**Project settings → Service accounts → Generate new private key**

다운로드되는 JSON에서 아래 3개 값을 사용합니다.

- `project_id`
- `client_email`
- `private_key`

JSON 파일 자체는 **절대로 GitHub에 올리지 마세요.**

---

# 4. Vercel 환경변수 등록

Vercel → 해당 프로젝트 → Settings → Environment Variables

다음 4개를 추가합니다.

```text
FIREBASE_PROJECT_ID=junokd02
FIREBASE_CLIENT_EMAIL=서비스계정 JSON의 client_email
FIREBASE_PRIVATE_KEY=서비스계정 JSON의 private_key 전체
ADMIN_EMAILS=Firebase Authentication에서 만든 관리자 이메일
```

관리자가 여러 명이면:

```text
ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

`FIREBASE_PRIVATE_KEY`는 아래처럼 BEGIN/END까지 전체를 넣습니다.

```text
-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----
```

Vercel 화면에서 여러 줄 입력이 가능하면 그대로 넣으면 됩니다.
코드는 `\n` 형태로 들어와도 처리하도록 되어 있습니다.

환경변수를 넣은 뒤 **Redeploy** 하세요.

---

# 5. Firestore Rules 교체

Firebase Console →

**Firestore Database → Rules**

`firestore.rules` 내용을 전부 붙여넣고 Publish 합니다.

핵심 규칙:

- `site/*`: 누구나 읽기만 가능
- `inquiries/*`: 브라우저에서 읽기/쓰기 모두 불가
- 쓰기와 문의 조회는 Vercel 서버의 Firebase Admin SDK만 담당

이 규칙을 먼저 바꾸고 서버 환경변수를 넣지 않으면 관리자 저장이 안 되므로,
가능하면 Vercel 환경변수 설정 → 배포 → Rules 교체 순서로 진행하세요.

---

# 6. 배포 후 테스트

## 일반 홈페이지
- 메인 페이지 정상 노출
- 이벤트/디자이너/스타일/FAQ 기존 내용 정상 표시
- `/hair-tips.html` 접속
- `/foreign.html` 접속

## 고객 문의
1. `고객문의`
2. 아이디 `testuser`
3. 임시 비밀번호 설정
4. 문의 등록
5. `내 문의 확인`
6. 같은 ID/PW로 문의가 보이는지 확인
7. 다른 비밀번호로는 안 보이는지 확인

## 관리자
1. 관리자 버튼
2. Firebase Authentication에서 만든 이메일/PW 로그인
3. `고객문의` 탭
4. testuser 문의 확인
5. 답변 저장
6. 로그아웃 후 고객 ID/PW로 답변 확인

---

# 7. AI 검색 쪽 확인

배포 후 직접 확인:

```text
https://junokd02.com/robots.txt
https://junokd02.com/sitemap.xml
https://junokd02.com/hair-tips.html
https://junokd02.com/foreign.html
```

Google Search Console / Bing Webmaster Tools에 새 sitemap을 다시 제출하는 것을 권장합니다.

`OAI-SearchBot`은 허용하고 `GPTBot`은 차단해 두었습니다.
즉 **ChatGPT 검색 노출은 허용하면서, OpenAI 학습 크롤링은 별도로 막는 설정**입니다.

학습도 허용하고 싶다면 `robots.txt`에서 아래 부분을 삭제하면 됩니다.

```text
User-agent: GPTBot
Disallow: /
```

---

# 보안상 꼭 기억할 것

- Firebase 서비스 계정 JSON은 GitHub 업로드 금지
- 관리자 비밀번호를 JS 파일에 다시 넣지 말 것
- 고객 문의 비밀번호 원문을 Firestore에 넣지 말 것
- Firestore `inquiries`를 public read로 열지 말 것
- 문의 폼에는 주민번호, 카드번호 같은 민감정보를 받지 말 것

추가 스팸이 생기면 다음 단계로 Cloudflare Turnstile을 문의 폼에 붙이는 것을 권장합니다.
