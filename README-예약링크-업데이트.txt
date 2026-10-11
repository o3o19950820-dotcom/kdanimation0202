준오헤어 건대역2호점 예약 링크 업데이트 (2026-10-11)

* 네이버 지도 디자이너 선택 화면 URL: https://map.naver.com/p/entry/place/33431131?placePath=%2Fstylist
* 변경: 메인 예약 버튼, 모바일 예약바, styles/ 및 designers/ 상세페이지 예약 버튼,
  기본 설정(app.js), site-config.json, HairSalon 예약/지도 구조화 데이터.
* 보존: 세부 시술/디자이너 Firebase 관리자 동작, 실제 시술 사진, 매장 영업시간/전화번호,
  seongsu-visit.html의 오시는 길(지도 검색) 버튼.
* 관리자 설정에 옛 지도 검색 예약 링크가 남아 있을 수 있어,
  booking-link-fix.js는 화면에 보이는 '예약' 링크 중 기존 지도 검색 링크만 자동 수정합니다.
* Vercel 운영 프로젝트에 GitHub main 브랜치를 연동한 상태에서 Push origin 후 운영 사이트를 점검하세요.
* 본 zip은 이전 자동연동 완성본을 기반으로 만들었습니다. 그 후 별도로 수정한 파일이 있다면
  전체 덮어쓰기 시 사라질 수 있으니 GitHub Desktop의 변경사항을 먼저 비교해주세요.
* 실제 예약 완료 흐름은 네이버 로그인/기기 상태에 따라 달라질 수 있습니다.
