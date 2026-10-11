준오헤어 검색페이지 저장 오류 수정

1. 이 ZIP 압축을 풉니다.
2. GitHub Desktop -> Repository -> Show in Explorer 클릭.
3. ZIP 안 api 폴더의 seo-pages.js를 기존 저장소의 api 폴더에 복사합니다.
   (기존 api 폴더나 다른 파일은 삭제하지 않습니다.)
4. GitHub Desktop에서 Summary에 Fix SEO page save API 를 적습니다.
5. Commit to main -> Push origin.
6. 운영 Vercel 프로젝트에서 해당 커밋이 Ready가 된 뒤 관리자 로그인 -> 검색페이지 저장 테스트.

이 파일은 기존 api/_firebaseAdmin.js를 사용하며 Vercel 환경 변수(FIREBASE_SERVICE_ACCOUNT_JSON 또는 동등 설정, ADMIN_EMAILS)가 기존처럼 설정되어 있어야 합니다.
중요: Admin 메뉴 내용을 검색봇에 읽히게 하는 동적 렌더링/정적화 기능은 별개 문제입니다.
