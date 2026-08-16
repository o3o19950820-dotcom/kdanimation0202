# JUNOKD02 2차 핫픽스

## 해결 내용
- 고객은 Firebase 회원가입 불필요
- 고객은 본인이 정한 ID/PW로 문의 등록 및 조회
- API가 환경변수 미설정으로 죽을 때 무응답 대신 명확한 메시지 반환
- 브라우저에서 12초 타임아웃 및 오류 표시
- 관리자 API도 서버 설정 미완료 상태를 명확하게 표시

## AI 검색용 추가 페이지
- layered-cut.html
- perm-guide.html
- hair-color-guide.html
- hair-clinic-guide.html
- sitemap.xml 갱신

## GitHub 업로드
압축을 풀고 저장소 루트에 그대로 업로드하세요.
같은 이름 파일은 교체됩니다.

교체:
- api/_firebaseAdmin.js
- api/inquiries.js
- api/admin.js
- inquiry.js
- sitemap.xml

추가:
- layered-cut.html
- perm-guide.html
- hair-color-guide.html
- hair-clinic-guide.html

## 매우 중요: 문의글이 실제로 저장되려면 Vercel 환경변수 3개가 반드시 필요
Vercel > 프로젝트 > Settings > Environment Variables

FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY

관리자 로그인/답변까지 쓰려면 추가:
ADMIN_EMAILS

환경변수를 추가한 뒤 반드시 Production을 Redeploy 하세요.

배포 뒤 아래 주소를 브라우저에서 열어보세요:
https://junokd02.com/api/inquiries

정상 설정이면 JSON 안에:
"configured": true
가 보여야 합니다.

false라면 코드 오류가 아니라 Vercel 환경변수가 아직 없는 상태입니다.
