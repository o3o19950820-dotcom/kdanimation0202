#!/usr/bin/env python3
"""Run in existing junokd02.com repository root. Idempotent, backs up changed files."""
from pathlib import Path
import shutil, sys
ROOT=Path.cwd(); SOURCE=Path(__file__).resolve().parent
if not (ROOT/'index.html').exists(): sys.exit('오류: index.html이 있는 기존 홈페이지 저장소 루트에서 실행해 주세요.')
for folder in ('assets','data'):(ROOT/folder).mkdir(exist_ok=True)
for filename in ('juno-upgrade.css','juno-upgrade.js'):
 shutil.copy2(SOURCE/'assets'/filename,ROOT/'assets'/filename)
config=ROOT/'data/site-config.json'
if not config.exists(): shutil.copy2(SOURCE/'data/site-config.json',config)
backup=ROOT/'.juno-upgrade-backup'; backup.mkdir(exist_ok=True)
count=0
for f in ROOT.rglob('*.html'):
 if '.git' in f.parts or '.juno-upgrade-backup' in f.parts or 'node_modules' in f.parts:continue
 s=f.read_text(encoding='utf-8-sig')
 if 'juno-upgrade.js' in s: continue
 if '</head>' not in s.lower() or '</body>' not in s.lower(): continue
 dest=backup/f.relative_to(ROOT);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,dest)
 css='<link rel="stylesheet" href="/assets/juno-upgrade.css">\n'
 js='<script defer src="/assets/juno-upgrade.js"></script>\n'
 import re
 s=re.sub(r'</head>',css+'</head>',s,count=1,flags=re.I)
 s=re.sub(r'</body>',js+'</body>',s,count=1,flags=re.I)
 f.write_text(s,encoding='utf-8');count+=1
print(f'완료: HTML {count}개 수정. 원본 백업: {backup}')
print('data/site-config.json에서 실제 네이버 예약 URL 및 시술 사진을 입력하세요.')
