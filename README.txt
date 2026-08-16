JUNO KD02 - Firebase single JSON env hotfix

1) GitHub repo root에 이 압축 안의 api/_firebaseAdmin.js 를 덮어쓰기 업로드합니다.
2) Firebase에서 새 서비스 계정 비공개 키 JSON 파일을 생성합니다.
3) 노출된 기존 키는 폐기합니다.
4) Vercel > kdanimation0202-urnp > Settings > Environment Variables:
   Key: FIREBASE_SERVICE_ACCOUNT_JSON
   Value: 새 JSON 파일의 전체 내용 ({ 로 시작해서 } 로 끝나는 전체)
   Sensitive: ON
   Environments: Production and Preview
5) 저장 후 Redeploy.
6) junokd02.com에서 문의 등록 테스트.

새 FIREBASE_SERVICE_ACCOUNT_JSON 값이 있으면 기존의
FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY 보다 우선 사용합니다.
