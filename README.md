# 준오헤어 건대역2호점 홈페이지

## 업로드 방법
1. 새 GitHub 저장소 생성
2. 이 폴더 안의 파일 전체 업로드
3. Vercel에서 New Project → Import Git Repository
4. Framework Preset: Other
5. Deploy

## Firebase
- Firestore Database를 켜야 글/사진 저장이 됩니다.
- Storage는 사용하지 않습니다. 사진은 자동 압축되어 Firestore에 저장됩니다.
- 저장 규칙이 막혀 있으면 관리자 저장이 실패합니다.

## 관리자
- 관리자 버튼 클릭 후 로그인
- 기본값: 코드의 admin.js에서 변경 가능
