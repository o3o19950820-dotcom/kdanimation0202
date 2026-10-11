준오헤어 건대역2호점 - 다중 네이버 검색페이지 관리자팩
======================================================

이번 버전의 핵심
- 기존 검색페이지 관리자 버튼 하나에서 총 9개 검색페이지를 선택/수정합니다.
- 기존 index.html은 다시 수정할 필요 없습니다.
  현재 index.html에 이미 아래 줄이 들어있다면 그대로 두세요:
  <script type="module" src="/seo-admin-addon.js"></script>
- 기존 디자이너 / 스타일 / 이미지 / FAQ / 가격표 기능을 수정하지 않습니다.
- 검색페이지 저장은 새 전용 서버 API /api/seo-pages 를 사용합니다.
- 공개 페이지는 Firestore site/seoPages를 읽기만 하므로 기존 보안규칙 구조와 맞습니다.

포함 검색페이지
- 레이어드컷: /kondae-layered-cut.html
- 허쉬컷: /kondae-hush-cut.html
- 단발컷: /kondae-bob-cut.html
- 남자커트: /kondae-mens-cut.html
- 여자펌: /kondae-womens-perm.html
- 레이어드펌: /kondae-layered-perm.html
- C컬펌: /kondae-c-curl-perm.html
- 남자펌: /kondae-mens-perm.html
- 염색: /kondae-hair-color.html

업로드 방법
[1] GitHub 저장소 최상위(root)에 아래 파일들을 업로드/교체
- seo-admin-addon.js         (기존 파일 교체)
- seo-page-runtime.js       (새 파일)
- sitemap.xml               (기존 파일 교체)
- kondae-layered-cut.html   (기존 파일 교체)
- 나머지 kondae-*.html 검색페이지 전부 업로드

[2] GitHub에서 api 폴더로 들어간 뒤
- api/seo-pages.js 파일만 새로 업로드
  ※ 기존 api/admin.js는 건드리지 마세요.

[3] Commit changes
Vercel 배포가 끝난 뒤 사이트 관리자모드에 로그인합니다.

[4] 관리자모드 → 검색페이지
레이어드컷 / 허쉬컷 / 단발컷 / 남자커트 / 여자펌 / 레이어드펌 / C컬펌 / 남자펌 / 염색
버튼이 나타납니다.

각 페이지마다
- 검색 제목
- 검색 설명
- 연관 키워드
- 페이지 큰 제목
- 첫 설명
- 본문 문단 추가/삭제/수정
- FAQ 추가/삭제/수정
을 따로 관리할 수 있습니다.

[5] 저장 후 각 공개 URL 확인
예:
https://junokd02.com/kondae-layered-cut.html
https://junokd02.com/kondae-hush-cut.html
https://junokd02.com/kondae-layered-perm.html

네이버 서치어드바이저
- sitemap.xml이 검색페이지 URL까지 포함되도록 교체됩니다.
- 배포 후 네이버 서치어드바이저에서 sitemap.xml 재확인
- 중요한 페이지는 URL 검사 → 수집 요청

주의
- 한 검색페이지에 모든 시술 키워드를 억지로 넣지 마세요.
- 레이어드컷 페이지는 레이어드컷 중심, 염색 페이지는 염색 중심으로 유지하는 게 좋습니다.
- 페이지끼리는 '관련 가이드' 링크로 서로 연결되도록 만들어두었습니다.
