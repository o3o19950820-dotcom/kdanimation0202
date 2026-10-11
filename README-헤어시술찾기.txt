# 나에게 맞는 헤어 시술 찾기 — 적용 안내

기존 최신 홈페이지 ZIP을 기준으로 제작했습니다. 수정 파일: `index.html`, `sitemap.xml`, 신규 `hair-consultation.html`, `hair-consultation.css`, `hair-consultation.js`.

1. 변경 파일만 압축 해제해서 기존 GitHub Desktop 저장소 루트(현재 index.html 위치)에 같은 폴더 구조로 덮어씁니다.
2. 변경 내용 확인 → Commit to main → Push origin. 새 Vercel 프로젝트를 만들지 마세요.
3. 운영 도메인의 배포 Ready 확인 → `/hair-consultation.html` 접속 → PC/모바일 테스트.
4. Google Search Console에서 새 URL 검사/색인 요청, sitemap 재제출 여부 확인.

시술 추천은 브라우저 안에서 처리되며 개인 답변을 서버에 저장하거나 수집하지 않습니다. 실제 시술 가능 여부는 매장 상담을 통해 판단해야 합니다.

이 기능은 검색 유입을 보장하지 않습니다. HTML 본문에 일반 검색 질문에 대한 설명과 내부 링크, 고유 메타 정보가 포함돼 있으며 페이지 색인과 클릭률은 Search Console에서 확인해야 합니다.
