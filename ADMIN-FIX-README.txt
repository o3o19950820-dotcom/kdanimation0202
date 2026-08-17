JUNOKD02 관리자 버튼 충돌 수정본

핵심 수정
1. 브라우저 관리자 스크립트: admin-ui.js
2. 서버 관리자 API: api/admin.js
3. index.html은 admin-ui.js만 로드
4. Firebase 모듈이 늦거나 실패해도 관리자 다이얼로그는 독립 fallback으로 열림

GitHub 업로드
- 이 ZIP의 폴더 구조를 유지해서 저장소 루트에 덮어쓰기
- 기존 root/admin.js는 더 이상 index.html에서 사용하지 않음
- api/admin.js는 반드시 api 폴더 안에 유지

빠른 수정만 할 경우 별도 junokd02-admin-button-hotfix.zip의
index.html + admin-ui.js 두 파일만 저장소 루트에 올려도 됨.
