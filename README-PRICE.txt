준오헤어 건대역2호점 가격표 추가 파일

[업로드 위치]
1) price.html           -> GitHub 저장소 최상단(root)
2) price-addon.js       -> GitHub 저장소 최상단(root)
3) designer-links.js    -> GitHub 저장소의 기존 designer-links.js를 이 파일로 교체
4) api/prices.js        -> GitHub 저장소의 api 폴더 안에 업로드

[건드리지 않는 파일]
- index.html
- style.css
- app.js
- admin-ui.js
- api/admin.js
- firebase.js
- 디자이너 상세페이지
- FAQ / 헤어TIP / 이미지

[작동 방식]
- 기존 사이트가 이미 불러오는 designer-links.js가 price-addon.js를 추가로 불러옵니다.
- price-addon.js가 홈 상단 메뉴와 이용안내 카드 영역에 '가격표' 링크를 추가합니다.
- 기존 관리자 로그인 후 관리자 탭에 '가격표'가 자동으로 생깁니다.
- 가격표 관리에서 카테고리 / 시술명 / 가격 / 비고를 입력하고 '가격표 전체 저장'을 누르면 저장됩니다.
- 저장된 내용은 /price.html 에 바로 반영됩니다.
- 비밀번호는 코드에 저장하지 않고 기존 Firebase 관리자 로그인 세션을 그대로 사용합니다.

[주의]
실제 매장 가격을 관리자에서 직접 입력한 뒤 공개하세요. 기본 가격은 임의로 넣지 않았습니다.
