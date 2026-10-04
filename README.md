# 준오헤어 건대역2호점 SEO 추가팩

기존 사이트를 갈아엎는 파일이 아니라 **추가 업로드용**입니다.

## 1. GitHub 루트에 그대로 추가
- `assets/seo.css`
- `assets/seo.js`
- `styles/` 폴더 전체
- `designers/` 폴더 전체
- `hair-tips/` 폴더 전체
- `sitemap.xml`
- `robots.txt`

`index.html`은 이 압축파일에 포함하지 않았습니다. 기존 홈페이지 기능과 Firebase/예약 기능을 건드리지 않기 위해서입니다.

## 2. 기존 index.html의 `<head>`에 추가
`INDEX-HEAD-ADD.html` 내용을 참고하세요.

추천 홈 title:
`건대입구역 미용실 | 준오헤어 건대역2호점`

추천 홈 description:
`건대입구역 준오헤어 건대역2호점. 얼굴형과 모질을 고려한 레이어드컷, 펌, 컬러, 남자머리, 곱슬 매직, 두피·모발 케어 상담.`

## 3. 기존 홈 메뉴에 내부링크 3개 추가
```html
<a href="/styles/">스타일 가이드</a>
<a href="/designers/">디자이너</a>
<a href="/hair-tips/">헤어TIP</a>
```

특히 기존 메인 스타일 카드가 있다면 상세보기 링크를 `/styles/....html`로 연결하세요.
예:
- 레이어드컷 → `/styles/layered-cut.html`
- 허쉬컷 → `/styles/hush-cut.html`
- 레이어드펌 → `/styles/layered-perm.html`
- 볼륨매직 → `/styles/volume-magic.html`
- 아이롱펌 → `/styles/mens-iron-perm.html`
- 다운펌 → `/styles/mens-down-perm.html`

## 4. 전화번호 정리 — 중요
현재 검색엔진에 같은 페이지에서 `02-468-0605`, `02-497-6050`, `02-498-6050`가 함께 보입니다.
이 팩에서는 대표번호를 **02-497-6050**으로 통일했습니다.

기존 `index.html`, 푸터, 구조화데이터, 전화 문의 버튼도 실제 대표번호 하나로 통일하세요.
번호가 다르면 지역검색에서 업체 정보 일관성이 떨어집니다.

## 5. 오래된 이벤트
현재 검색 결과에 2026년 7월 SUMMER PROMOTION이 계속 노출되고 있습니다.
메인에서는 종료 이벤트를 숨기고 `/events/archive` 같은 별도 아카이브로 보내는 것을 권장합니다.

## 6. 네이버/구글에 제출
배포 후:
- Google Search Console → Sitemap → `https://junokd02.com/sitemap.xml`
- 네이버 서치어드바이저 → 사이트맵 제출 → 같은 URL
- 새 핵심 페이지는 URL 검사/수집 요청

## 7. 이 팩에서 만든 URL
총 27개 sitemap URL.
- 스타일 상세 12개
- 디자이너 상세 7개
- 헤어TIP 허브 80문답
- 검색용 핵심 헤어TIP 독립 페이지 4개

## 8. 다음 확장 추천
독립 헤어TIP은 처음부터 80개 전부 만들지 말고 Search Console/네이버 유입을 보고
노출이 생기는 질문부터 개별 URL로 확장하는 편이 좋습니다.

우선 확장 후보:
- `/hair-tips/hair-breakage.html`
- `/hair-tips/frizzy-hair.html`
- `/hair-tips/hot-water-shampoo.html`
- `/hair-tips/layered-cut-styling.html`
- `/hair-tips/volume-magic-aftercare.html`
- `/hair-tips/purple-shampoo.html`
