JUNOKD02 AI/SEO STATIC BOOST
=============================

목적
- 관리자/Firebase에서 불러오는 FAQ가 크롤러에서 비어 보이는 문제를 보강
- AI/검색봇이 읽을 수 있는 정적 FAQ 페이지 추가
- 매장/시술 정보를 한 페이지에서 이해할 수 있는 정적 가이드 추가
- sitemap.xml에 신규 페이지 포함
- 기존 OAI-SearchBot 허용 정책 유지
- 기존 관리자, Firebase, 문의, 디자이너 상세 수정 기능은 건드리지 않음

업로드할 파일
1) faq.html         : 정적 FAQ 페이지
2) ai-guide.html    : 매장/시술 요약 페이지
3) sitemap.xml      : 기존 sitemap에 신규 2개 페이지 추가
4) robots.txt       : 기존 정책 유지
5) llms.txt         : AI가 참고할 수 있는 보조 요약 파일(표준 보장 기능은 아님)

업로드 방법
- ZIP을 풀기
- 위 파일들을 GitHub 저장소 최상단(root)에 업로드
- sitemap.xml / robots.txt는 기존 파일을 덮어쓰기
- Commit changes
- Vercel 자동 배포 후 아래 주소가 열리는지 확인
  https://junokd02.com/faq.html
  https://junokd02.com/ai-guide.html
  https://junokd02.com/sitemap.xml
  https://junokd02.com/robots.txt
  https://junokd02.com/llms.txt

중요
- index.html, admin.js, app.js, firebase.js, designer-*.html은 수정하지 않았습니다.
- 따라서 현재 잘 작동하는 관리자 수정 기능에는 영향을 주지 않습니다.
- FAQ를 관리자에서 수정해도 faq.html은 자동으로 바뀌지 않습니다.
  정적 FAQ는 검색/AI 크롤링 보강용 공개 안내 페이지입니다.
