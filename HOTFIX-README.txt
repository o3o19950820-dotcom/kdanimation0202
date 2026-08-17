관리자 버튼 즉시 수정용

GitHub 저장소 최상단(root)에 아래 2개 파일을 업로드/덮어쓰기:
- index.html
- admin-ui.js

중요: 기존 admin.js는 건드릴 필요 없음.
index.html이 이제 admin-ui.js를 읽기 때문에 api/admin.js와 이름 충돌이 다시 발생하지 않음.
