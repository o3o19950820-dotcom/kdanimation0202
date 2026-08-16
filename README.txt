디자이너 상세페이지 사진 동기화 수정

문제 원인:
- 관리자에서 올린 디자이너 사진은 Firestore의 site/designers 문서에 저장됩니다.
- 기존 상세페이지는 정적 HTML이라 그 사진을 불러오는 코드가 없었습니다.

수정 후:
- 관리자에서 등록/수정한 디자이너 사진이 각 상세페이지에도 자동 표시됩니다.
- 직급, 키워드, 소개글도 관리자 데이터와 자동 동기화됩니다.

업로드 방법:
1) 이 ZIP을 압축 풉니다.
2) 안의 9개 파일을 GitHub 저장소 맨 바깥(root)에 전부 업로드합니다.
   - designer-profile-data.js
   - designer-*.html 8개
3) 같은 이름의 기존 designer-*.html은 덮어쓰기 됩니다.
4) Commit changes.
5) Vercel 배포가 Ready 된 뒤 상세 프로필을 새로고침합니다.

기존 관리자 / 문의 / Firebase API 코드는 건드리지 않습니다.
