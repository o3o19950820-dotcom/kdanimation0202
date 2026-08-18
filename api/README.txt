준오헤어 사이트 이미지 저장 방식 수정

적용 파일
1) api/admin.js  -> 기존 파일 교체
2) api/image.js  -> 새 파일 추가

동작
- 관리자에서 사진을 선택하면 기존처럼 브라우저에서 자동 압축됩니다.
- 저장할 때 Base64 사진 데이터는 site/_media/images 하위의 별도 Firestore 문서로 이동합니다.
- styles/events/designers/settings 데이터에는 /api/image?id=... 형태의 짧은 주소만 남습니다.
- 기존에 styles 등에 들어 있던 Base64 사진도 해당 항목을 다음번 저장할 때 자동으로 분리됩니다.
- 사이트 방문자는 로그인하지 않아도 /api/image 주소를 통해 사진을 정상적으로 볼 수 있습니다.

주의
- Firebase Storage는 사용하지 않습니다.
- 기존 Firebase Admin 환경변수 설정은 그대로 사용합니다.
- GitHub에 반영한 뒤 Vercel 배포가 완료된 후 테스트하세요.
