// JUNO Hair Multi SEO Admin
import { auth, db, doc, onSnapshot } from "/firebase.js";

const REGISTRY = {"kondae-layered-cut": {"label": "레이어드컷", "filename": "kondae-layered-cut.html", "defaults": {"seoTitle": "건대 레이어드컷 | 중단발·긴머리 레이어드컷 | 준오헤어 건대역2호점", "metaDescription": "건대 레이어드컷을 고민한다면 얼굴형, 모량, 모발 길이와 손질 방법을 함께 확인해보세요. 중단발·긴머리 레이어드컷 상담 가이드.", "keywords": ["건대 레이어드컷", "건대 미용실", "중단발 레이어드컷", "긴머리 레이어드컷", "건대 레이어드펌"], "heroTitle": "건대 레이어드컷,\n얼굴형과 길이에 맞게", "heroIntro": "레이어드컷은 층의 시작 위치와 양에 따라 분위기가 크게 달라집니다. 얼굴 주변 라인, 모발 길이와 모량, 평소 손질 방법을 함께 고려해 내게 맞는 레이어드 디자인을 찾는 것이 중요합니다.", "sections": [{"title": "레이어드컷은 어떤 스타일인가요?", "body": "레이어드컷은 모발에 층을 만들어 무거운 느낌을 덜고 자연스러운 움직임을 표현하는 커트입니다. 같은 레이어드컷이라도 얼굴 주변 층이 어디에서 시작하는지, 전체 층을 얼마나 높게 만드는지에 따라 차분한 느낌부터 가볍고 풍성한 느낌까지 달라질 수 있습니다."}, {"title": "중단발과 긴머리는 어떻게 다를까요?", "body": "중단발은 층의 위치가 전체 실루엣에 큰 영향을 줍니다. 긴머리는 길이를 크게 줄이지 않아도 층으로 답답한 느낌을 덜 수 있습니다. 현재 길이와 모량, 손질 습관을 함께 고려하는 것이 좋습니다."}, {"title": "레이어드컷과 펌을 함께 한다면", "body": "C컬이나 레이어드펌을 함께 디자인하면 커트로 만든 층의 움직임을 살리기 좋습니다. 다만 염색·탈색·기존 펌 이력과 손상도에 따라 가능한 시술 범위가 달라질 수 있습니다."}, {"title": "건대에서 레이어드컷 상담 전 준비할 것", "body": "원하는 스타일 사진과 최근 펌·염색·탈색 이력, 평소 드라이나 고데기 사용 여부를 알려주면 상담에 도움이 됩니다. 준오헤어 건대역2호점은 서울 광진구 능동로 109 2층에 위치합니다."}], "faqs": [{"q": "중단발도 레이어드컷이 가능한가요?", "a": "가능합니다. 현재 길이와 모량에 맞춰 층의 시작 위치와 양을 조절하는 것이 중요합니다."}, {"q": "레이어드컷과 C컬펌을 같이 할 수 있나요?", "a": "모발 상태에 따라 가능합니다. 최근 시술 이력과 손상도를 먼저 확인한 뒤 상담하는 것이 좋습니다."}, {"q": "스타일 사진을 가져가도 되나요?", "a": "네. 원하는 사진을 준비하면 상담에 도움이 되며 실제 디자인은 모질과 길이에 맞춰 조정될 수 있습니다."}]}}, "kondae-hush-cut": {"label": "허쉬컷", "filename": "kondae-hush-cut.html", "defaults": {"seoTitle": "건대 허쉬컷 | 중단발·긴머리 허쉬 스타일 | 준오헤어 건대역2호점", "metaDescription": "건대 허쉬컷을 찾는다면 층의 높이, 모량, 얼굴 주변 라인을 확인해보세요. 중단발·긴머리 허쉬컷 스타일과 손질 방법을 안내합니다.", "keywords": ["건대 허쉬컷", "건대 미용실", "중단발 허쉬컷", "긴머리 허쉬컷", "허쉬 레이어드컷"], "heroTitle": "건대 허쉬컷,\n가볍지만 과하지 않게", "heroIntro": "허쉬컷은 층과 질감으로 가벼운 움직임을 만드는 스타일입니다. 모량과 모질에 따라 층을 너무 많이 내면 손질이 어려워질 수 있어 원하는 분위기와 관리 난이도를 함께 보는 것이 좋습니다.", "sections": [{"title": "허쉬컷과 레이어드컷의 차이", "body": "두 스타일 모두 층을 활용하지만 허쉬컷은 질감과 가벼운 실루엣을 더 강조하는 경우가 많습니다. 얼굴 주변 라인과 끝부분의 질감 표현에 따라 분위기가 달라집니다."}, {"title": "중단발 허쉬컷을 고민한다면", "body": "어깨 전후 길이는 끝이 뻗치기 쉬운 구간이므로 층의 위치와 모량 조절이 중요합니다. 평소 드라이 시간과 원하는 볼륨을 상담할 때 함께 알려주세요."}, {"title": "긴머리 허쉬컷의 포인트", "body": "전체 길이는 유지하면서 무게감을 덜고 싶을 때 활용할 수 있습니다. 머리숱이 많거나 답답한 실루엣을 가볍게 바꾸고 싶을 때 상담해볼 수 있습니다."}, {"title": "허쉬컷 손질 방법", "body": "얼굴 주변은 드라이 방향만 잘 잡아도 라인이 살아납니다. 과한 고데기보다 자연스러운 결을 살리는 방식이 잘 어울리는 경우가 많습니다."}], "faqs": [{"q": "머리숱이 많아도 허쉬컷이 가능한가요?", "a": "가능하지만 층과 질감의 양을 현재 모량에 맞춰 조절하는 것이 중요합니다."}, {"q": "허쉬컷은 손질이 어려운가요?", "a": "디자인에 따라 다릅니다. 평소 손질을 많이 하지 않는다면 상담 시 관리가 쉬운 방향을 요청하는 것이 좋습니다."}, {"q": "허쉬컷 후 펌도 가능한가요?", "a": "모발 손상도와 기존 시술 이력에 따라 가능 여부가 달라지므로 먼저 모발 상태를 확인하는 것이 좋습니다."}]}}, "kondae-bob-cut": {"label": "단발컷", "filename": "kondae-bob-cut.html", "defaults": {"seoTitle": "건대 단발컷 | 단발·중단발 스타일 상담 | 준오헤어 건대역2호점", "metaDescription": "건대 단발컷과 중단발 스타일을 고민한다면 얼굴형, 목선, 모질과 손질 습관을 함께 확인해보세요. 단발 디자인 선택 가이드.", "keywords": ["건대 단발컷", "건대 단발", "건대 미용실", "중단발 컷", "단발 레이어드컷"], "heroTitle": "건대 단발컷,\n길이보다 중요한 균형", "heroIntro": "단발은 몇 센티미터의 길이 차이와 앞머리·얼굴 주변 라인에 따라 인상이 크게 달라질 수 있습니다. 얼굴형뿐 아니라 목선, 모질, 뜨는 정도와 평소 손질 습관까지 함께 고려하는 것이 좋습니다.", "sections": [{"title": "단발 길이는 어떻게 정할까요?", "body": "턱선, 턱 아래, 쇄골 위 등 길이에 따라 분위기가 달라집니다. 사진 속 길이를 그대로 정하기보다 내 목선과 얼굴 주변 라인을 함께 보는 것이 좋습니다."}, {"title": "단발 레이어드컷이 잘 맞는 경우", "body": "일자 단발의 무게감이 부담스럽거나 자연스러운 움직임을 원한다면 레이어드를 일부 더할 수 있습니다. 모발이 너무 가늘다면 층의 양을 조절해야 합니다."}, {"title": "곱슬이나 뜨는 머리의 단발", "body": "모류와 곱슬 정도에 따라 같은 단발도 부피감이 다르게 느껴질 수 있습니다. 필요하면 볼륨매직이나 펌을 함께 상담할 수 있습니다."}, {"title": "단발로 자르기 전 체크", "body": "평소 묶는 빈도, 아침 손질 시간, 앞머리 여부, 최근 펌·염색 이력을 알려주면 생활에 맞는 길이를 정하는 데 도움이 됩니다."}], "faqs": [{"q": "얼굴이 둥글어도 단발이 괜찮을까요?", "a": "얼굴형만으로 단발 가능 여부가 결정되지는 않습니다. 길이와 얼굴 주변 라인을 조절해 다양한 방향으로 디자인할 수 있습니다."}, {"q": "단발은 자주 다듬어야 하나요?", "a": "원하는 실루엣에 따라 다르지만 길이가 짧을수록 형태 변화가 빨리 느껴질 수 있습니다."}, {"q": "단발과 펌을 함께 해도 되나요?", "a": "모발 상태에 따라 C컬, 볼륨매직 등 다양한 방향을 상담할 수 있습니다."}]}}, "kondae-mens-cut": {"label": "남자커트", "filename": "kondae-mens-cut.html", "defaults": {"seoTitle": "건대 남자커트 | 두상·모류에 맞는 남자머리 | 준오헤어 건대역2호점", "metaDescription": "건대 남자커트를 찾는다면 두상, 모질, 뜨는 옆머리와 평소 손질 습관을 함께 확인해보세요. 남자 커트와 다운펌 상담 가이드.", "keywords": ["건대 남자커트", "건대 남자머리", "건대 미용실", "건대 다운펌", "건대 남자 미용실"], "heroTitle": "건대 남자커트,\n두상과 모류까지 고려해서", "heroIntro": "남자 커트는 길이보다 두상과 모류 방향, 옆머리가 뜨는 정도가 완성도에 큰 영향을 줍니다. 평소 어떻게 손질하는지까지 함께 보면 유지하기 편한 디자인을 선택하기 좋습니다.", "sections": [{"title": "남자 커트에서 두상이 중요한 이유", "body": "옆과 뒤의 볼륨을 어디에서 줄이고 남길지에 따라 전체 비율이 달라집니다. 정면 사진뿐 아니라 옆모습과 뒷모습의 형태도 함께 고려하는 것이 좋습니다."}, {"title": "옆머리가 많이 뜬다면", "body": "커트만으로 정리할지 다운펌을 함께 할지는 모질과 길이에 따라 달라집니다. 너무 짧게 자르면 오히려 더 뜨는 모질도 있어 상담이 중요합니다."}, {"title": "직모와 곱슬 남자머리", "body": "같은 사진을 보여줘도 모질에 따라 필요한 길이와 시술이 달라질 수 있습니다. 자연스러운 결을 살릴지, 펌으로 움직임을 만들지 선택할 수 있습니다."}, {"title": "남자커트 상담 팁", "body": "평소 왁스나 드라이를 하는지, 아침 손질에 얼마나 시간을 쓰는지 알려주면 관리 난이도에 맞는 스타일을 제안받기 좋습니다."}], "faqs": [{"q": "다운펌은 꼭 해야 하나요?", "a": "꼭 필요한 것은 아닙니다. 옆머리 모류와 원하는 스타일에 따라 커트만으로도 가능한 경우가 있습니다."}, {"q": "원하는 남자머리 사진을 가져가도 되나요?", "a": "네. 사진과 함께 평소 손질 방법을 알려주면 상담에 도움이 됩니다."}, {"q": "곱슬머리도 남자커트 상담이 가능한가요?", "a": "가능합니다. 곱슬 정도와 부피감을 확인해 길이와 형태를 조정할 수 있습니다."}]}}, "kondae-womens-perm": {"label": "여자펌", "filename": "kondae-womens-perm.html", "defaults": {"seoTitle": "건대 여자펌 | 중단발·긴머리 펌 상담 | 준오헤어 건대역2호점", "metaDescription": "건대 여자펌을 고민한다면 현재 커트 형태, 모발 손상도와 원하는 컬을 함께 확인하세요. 중단발·긴머리 여자펌 상담 가이드.", "keywords": ["건대 여자펌", "건대 펌", "건대 미용실", "중단발 펌", "긴머리 펌"], "heroTitle": "건대 여자펌,\n컬보다 먼저 모발 상태부터", "heroIntro": "여자펌은 원하는 컬 모양뿐 아니라 현재 커트 형태와 모발 손상도가 결과에 큰 영향을 줍니다. 최근 염색·탈색·펌 이력을 확인하고 가능한 디자인 범위를 상담하는 것이 중요합니다.", "sections": [{"title": "여자펌을 고를 때 먼저 볼 것", "body": "사진 속 컬이 예뻐 보여도 현재 길이와 층, 모질에 따라 다른 결과가 나올 수 있습니다. 원하는 분위기와 손질 난이도를 함께 이야기하는 것이 좋습니다."}, {"title": "중단발 펌의 특징", "body": "어깨에 닿는 길이는 자연스럽게 뻗칠 수 있어 C컬이나 볼륨을 활용한 디자인을 상담할 수 있습니다. 현재 커트선에 따라 필요한 시술이 달라집니다."}, {"title": "긴머리 펌의 특징", "body": "모발 길이가 길수록 무게 때문에 컬이 다르게 표현될 수 있습니다. 층과 컬의 위치를 함께 설계하면 보다 자연스러운 움직임을 만들 수 있습니다."}, {"title": "손상모라면 꼭 알려주세요", "body": "탈색이나 반복 염색 이력이 있다면 펌이 제한될 수 있습니다. 안전한 시술 범위를 위해 최근 시술 이력을 정확하게 알려주는 것이 좋습니다."}], "faqs": [{"q": "염색한 머리도 펌이 가능한가요?", "a": "염색 종류와 손상도에 따라 다릅니다. 최근 시술 이력을 확인한 뒤 가능 여부를 판단하는 것이 좋습니다."}, {"q": "펌 사진을 가져가도 되나요?", "a": "네. 원하는 컬의 크기와 분위기를 설명하는 데 도움이 됩니다."}, {"q": "펌 후 손질이 어렵지 않을까요?", "a": "원하는 관리 난이도를 상담할 때 미리 말하면 손질 방법을 고려한 디자인을 선택하는 데 도움이 됩니다."}]}}, "kondae-layered-perm": {"label": "레이어드펌", "filename": "kondae-layered-perm.html", "defaults": {"seoTitle": "건대 레이어드펌 | 중단발·긴머리 레이어드펌 | 준오헤어 건대역2호점", "metaDescription": "건대 레이어드펌을 고민한다면 커트의 층, 컬 위치와 모발 손상도를 함께 확인하세요. 중단발·긴머리 레이어드펌 가이드.", "keywords": ["건대 레이어드펌", "건대 여자펌", "건대 미용실", "중단발 레이어드펌", "긴머리 레이어드펌"], "heroTitle": "건대 레이어드펌,\n층과 컬이 자연스럽게 이어지도록", "heroIntro": "레이어드펌은 커트로 만든 층에 컬을 더해 자연스러운 움직임을 표현하는 스타일입니다. 층의 위치와 컬의 크기가 조화를 이루어야 손질했을 때도 라인이 자연스럽게 이어집니다.", "sections": [{"title": "레이어드펌은 커트가 중요합니다", "body": "펌만으로 레이어드 느낌을 만드는 것이 아니라 커트의 층과 컬이 함께 디자인되어야 합니다. 기존 커트 상태에 따라 먼저 길이와 층을 정리할 수 있습니다."}, {"title": "중단발 레이어드펌", "body": "어깨 전후 길이는 얼굴 주변과 끝부분의 컬 방향이 중요합니다. 과하게 부풀지 않도록 모량과 모질을 고려해 디자인하는 것이 좋습니다."}, {"title": "긴머리 레이어드펌", "body": "긴머리는 무게 때문에 컬이 늘어질 수 있어 원하는 볼륨 위치와 컬 크기를 상담하는 것이 좋습니다. 층이 적절하면 움직임을 더 자연스럽게 표현할 수 있습니다."}, {"title": "레이어드펌 전 손상도 체크", "body": "열펌이나 반복 시술 이력이 있다면 손상도 확인이 중요합니다. 현재 모발에서 가능한 컬과 시술 방법을 먼저 상담해보세요."}], "faqs": [{"q": "레이어드컷을 먼저 해야 하나요?", "a": "현재 커트 상태에 따라 다릅니다. 필요한 경우 펌 전에 층과 길이를 정리해 컬이 자연스럽게 이어지도록 할 수 있습니다."}, {"q": "중단발에도 레이어드펌이 어울리나요?", "a": "가능합니다. 층의 위치와 컬 방향을 길이에 맞춰 조절하는 것이 중요합니다."}, {"q": "탈색모도 레이어드펌이 가능한가요?", "a": "손상도가 높은 탈색모는 펌이 어려울 수 있으므로 반드시 모발 상태를 먼저 확인해야 합니다."}]}}, "kondae-c-curl-perm": {"label": "C컬펌", "filename": "kondae-c-curl-perm.html", "defaults": {"seoTitle": "건대 C컬펌 | 단발·중단발·레이어드 C컬 | 준오헤어 건대역2호점", "metaDescription": "건대 C컬펌을 찾는다면 단발·중단발 길이와 층, 모발 손상도를 함께 확인하세요. 자연스러운 C컬과 레이어드 C컬 상담 가이드.", "keywords": ["건대 C컬펌", "건대 C컬", "건대 미용실", "중단발 C컬펌", "레이어드 C컬"], "heroTitle": "건대 C컬펌,\n손질하기 편한 자연스러운 방향", "heroIntro": "C컬은 모발 끝이 자연스럽게 안쪽으로 연결되는 느낌을 만들 때 많이 선택합니다. 단발·중단발·레이어드 스타일에 따라 컬의 위치와 강도를 다르게 조절하는 것이 중요합니다.", "sections": [{"title": "C컬펌은 어떤 길이에 잘 맞나요?", "body": "단발과 중단발에서 자주 선택하지만 긴머리 레이어드 스타일에도 활용할 수 있습니다. 길이보다 현재 커트선과 원하는 볼륨의 위치가 더 중요합니다."}, {"title": "단발 C컬과 레이어드 C컬", "body": "일자 단발은 끝선의 정돈감을 살리는 방향이 잘 어울릴 수 있고, 레이어드 스타일은 층마다 자연스럽게 흐르는 C컬을 활용할 수 있습니다."}, {"title": "뿌리 볼륨도 함께 고민한다면", "body": "모발이 쉽게 처지는 경우에는 끝 컬뿐 아니라 전체 볼륨 밸런스를 함께 보는 것이 좋습니다. 두상과 모질에 따라 필요한 방식이 달라집니다."}, {"title": "C컬펌 전 모발 상태 확인", "body": "반복 염색이나 기존 열펌 이력이 있다면 손상도를 확인해야 합니다. 현재 모발에서 가능한 시술 범위를 먼저 상담해보세요."}], "faqs": [{"q": "중단발에 C컬펌이 가능한가요?", "a": "가능합니다. 어깨에 닿는 위치와 커트선에 맞춰 컬 방향을 조절하는 것이 중요합니다."}, {"q": "C컬펌은 손질이 쉬운 편인가요?", "a": "개인 모질과 디자인에 따라 다르지만 비교적 자연스러운 끝선 정리를 원하는 경우 많이 고려합니다."}, {"q": "레이어드컷과 C컬을 같이 할 수 있나요?", "a": "가능합니다. 층마다 컬이 자연스럽게 연결되도록 커트와 펌을 함께 상담할 수 있습니다."}]}}, "kondae-mens-perm": {"label": "남자펌", "filename": "kondae-mens-perm.html", "defaults": {"seoTitle": "건대 남자펌 | 남자 볼륨·컬 스타일 상담 | 준오헤어 건대역2호점", "metaDescription": "건대 남자펌을 찾는다면 모질, 두상, 모류와 평소 손질 방법을 함께 확인해보세요. 자연스러운 볼륨과 컬을 위한 남자펌 상담 가이드.", "keywords": ["건대 남자펌", "건대 남자머리", "건대 미용실", "건대 볼륨펌", "건대 남자 헤어"], "heroTitle": "건대 남자펌,\n평소 손질까지 생각해서", "heroIntro": "남자펌은 컬을 강하게 만드는 것만이 목적이 아닙니다. 직모의 움직임을 만들거나 필요한 부분에 볼륨을 더하고, 평소 손질을 편하게 만드는 방향으로도 활용할 수 있습니다.", "sections": [{"title": "남자펌은 모질에 따라 달라집니다", "body": "직모, 곱슬, 가는 모발 등 모질에 따라 같은 디자인도 컬의 강도와 유지감이 달라질 수 있습니다. 현재 머리 길이와 함께 확인하는 것이 좋습니다."}, {"title": "자연스러운 남자펌을 원한다면", "body": "컬이 너무 강한 스타일이 부담스럽다면 볼륨과 방향만 보완하는 디자인을 상담할 수 있습니다. 평소 드라이를 하는지도 중요한 기준입니다."}, {"title": "다운펌과 함께 하는 경우", "body": "윗머리에는 움직임을 주고 옆머리는 정돈하고 싶다면 다운펌을 함께 고려할 수 있습니다. 모류와 두상에 따라 필요 여부가 달라집니다."}, {"title": "남자펌 전 원하는 사진 준비", "body": "정면 사진뿐 아니라 옆모습이 보이는 참고 이미지를 준비하면 길이와 컬 위치를 상담하는 데 도움이 됩니다."}], "faqs": [{"q": "짧은 머리도 펌이 가능한가요?", "a": "현재 길이와 원하는 컬에 따라 가능합니다. 충분한 길이가 필요한 디자인도 있어 상담이 필요합니다."}, {"q": "남자펌과 다운펌을 같이 할 수 있나요?", "a": "모발 상태와 디자인에 따라 함께 진행할 수 있습니다."}, {"q": "자연스럽게만 볼륨을 넣을 수도 있나요?", "a": "가능합니다. 강한 컬보다 볼륨과 방향을 보완하는 디자인을 상담해보세요."}]}}, "kondae-hair-color": {"label": "염색", "filename": "kondae-hair-color.html", "defaults": {"seoTitle": "건대 염색 | 브라운·톤다운 헤어컬러 | 준오헤어 건대역2호점", "metaDescription": "건대 염색을 고민한다면 현재 모발 밝기와 기존 염색·탈색 이력을 확인하세요. 브라운, 톤다운 등 헤어컬러 상담 가이드.", "keywords": ["건대 염색", "건대 헤어컬러", "건대 미용실", "건대 브라운 염색", "건대 톤다운"], "heroTitle": "건대 염색,\n현재 모발에서 가능한 컬러부터", "heroIntro": "같은 브라운 계열도 현재 모발 밝기와 기존 색소에 따라 결과가 달라집니다. 원하는 사진과 최근 검정염색·톤다운·탈색 이력을 함께 확인하면 보다 현실적인 컬러 방향을 상담하기 좋습니다.", "sections": [{"title": "염색 전 기존 이력이 중요한 이유", "body": "검정염색, 톤다운, 탈색 이력은 새 컬러가 표현되는 방식에 큰 영향을 줄 수 있습니다. 최근뿐 아니라 과거에 어두운 염색을 반복했다면 함께 알려주세요."}, {"title": "브라운 컬러를 고를 때", "body": "브라운도 밝기와 색감에 따라 분위기가 달라집니다. 피부톤만 보기보다 원하는 이미지와 퇴색 후 색감까지 함께 고려하는 것이 좋습니다."}, {"title": "톤다운을 고민한다면", "body": "너무 어둡게 염색하면 이후 밝은 컬러로 바꾸기 어려울 수 있습니다. 앞으로 원하는 컬러 계획이 있다면 상담 때 미리 이야기해 주세요."}, {"title": "손상모 염색과 케어", "body": "반복 염색이나 탈색으로 손상이 있다면 원하는 밝기보다 모발 컨디션을 우선해야 할 수 있습니다. 가능한 시술 범위와 케어 방법을 함께 상담하는 것이 좋습니다."}], "faqs": [{"q": "검정염색 이력이 있어도 밝게 염색할 수 있나요?", "a": "기존 색소의 잔여 정도에 따라 한 번에 원하는 밝기가 나오기 어려울 수 있습니다. 이력을 정확히 알려주세요."}, {"q": "탈색 없이 가능한 컬러가 궁금해요.", "a": "현재 모발 밝기와 기존 염색 이력에 따라 가능 범위가 달라집니다. 원하는 사진을 기준으로 상담하는 것이 좋습니다."}, {"q": "염색 후 색 빠짐을 줄이려면 어떻게 해야 하나요?", "a": "컬러 전용 제품 사용과 너무 뜨거운 물을 피하는 관리가 도움이 될 수 있습니다."}]}}};

let overlay=null;
let allPages={};
let currentId=Object.keys(REGISTRY)[0];
let state=null;

const style=document.createElement("style");
style.textContent=`
#seoAdminOverlay{position:fixed;inset:0;background:rgba(31,23,19,.72);z-index:99999;display:none;padding:18px;overflow:auto;font-family:system-ui,-apple-system,"Pretendard","Noto Sans KR",sans-serif}
#seoAdminOverlay.open{display:block}
#seoAdminPanel{max-width:1050px;margin:15px auto;background:#fffaf4;border-radius:26px;padding:24px;color:#33271f;box-shadow:0 30px 80px rgba(0,0,0,.28)}
#seoAdminPanel *{box-sizing:border-box}
#seoAdminPanel h2{margin:0 0 4px;font-size:26px}
#seoAdminPanel h3{margin:0}
#seoAdminPanel .hint{color:#7d6a5a;font-size:13px;margin:0}
#seoAdminPanel .top{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
#seoAdminPanel .pageGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:18px 0}
#seoAdminPanel .pageBtn{text-align:left;border:1px solid #e2d4c7;background:#fff;border-radius:16px;padding:12px;cursor:pointer}
#seoAdminPanel .pageBtn.on{background:#6f5440;color:white;border-color:#6f5440}
#seoAdminPanel .pageBtn small{display:block;opacity:.7;margin-top:3px}
#seoAdminPanel .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
#seoAdminPanel label{display:grid;gap:6px;font-size:13px;font-weight:750;color:#665446}
#seoAdminPanel input,#seoAdminPanel textarea{width:100%;border:1px solid #ddcdbd;border-radius:14px;padding:11px 12px;background:white;font:inherit}
#seoAdminPanel textarea{min-height:105px;resize:vertical}
#seoAdminPanel .wide{grid-column:1/-1}
#seoAdminPanel .box{border:1px solid #e5d8cc;background:white;border-radius:18px;padding:14px;margin-top:13px}
#seoAdminPanel .boxHead{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:9px}
#seoAdminPanel button{border:0;border-radius:999px;padding:10px 15px;font-weight:800;cursor:pointer}
#seoAdminPanel .primary{background:#6f5440;color:white}
#seoAdminPanel .light{background:#eee3d7;color:#5a4637}
#seoAdminPanel .danger{background:#f3dada;color:#9b3030}
#seoAdminPanel .actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}
#seoAdminPanel .status{margin-top:12px;background:#f0e6db;border-radius:12px;padding:10px 12px;font-size:13px}
.seoAdminTab{white-space:nowrap}
@media(max-width:760px){#seoAdminOverlay{padding:7px}#seoAdminPanel{padding:17px;margin:7px auto}#seoAdminPanel .pageGrid{grid-template-columns:1fr 1fr}#seoAdminPanel .grid{grid-template-columns:1fr}#seoAdminPanel .wide{grid-column:auto}}
`;
document.head.appendChild(style);

function clone(v){return JSON.parse(JSON.stringify(v));}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function ensureOverlay(){
  if(overlay)return;
  overlay=document.createElement("div");
  overlay.id="seoAdminOverlay";
  overlay.innerHTML='<div id="seoAdminPanel"></div>';
  overlay.addEventListener("click",e=>{if(e.target===overlay)overlay.classList.remove("open");});
  document.body.appendChild(overlay);
}
function oneSnapshot(){
  return new Promise((resolve,reject)=>{
    let unsub=()=>{};
    unsub=onSnapshot(doc(db,"site","seoPages"),snap=>{unsub();resolve(snap.exists()?(snap.data()?.items||{}):{});},err=>{unsub();reject(err);});
  });
}
async function adminSave(items){
  const user=auth.currentUser;
  if(!user) throw new Error("먼저 기존 관리자 로그인을 해주세요.");
  const token=await user.getIdToken();
  const res=await fetch("/api/seo-pages",{method:"POST",headers:{"content-type":"application/json","authorization":`Bearer ${token}`},body:JSON.stringify({items})});
  const data=await res.json().catch(()=>({ok:false,message:"서버 응답 오류"}));
  if(!res.ok || !data.ok) throw new Error(data.message||"저장 실패");
  return data;
}
function collect(){
  if(!state)return;
  state.seoTitle=document.getElementById("seoTitle").value.trim();
  state.metaDescription=document.getElementById("seoDesc").value.trim();
  state.heroTitle=document.getElementById("seoHero").value.trim();
  state.heroIntro=document.getElementById("seoIntro").value.trim();
  state.keywords=document.getElementById("seoKeywords").value.split(",").map(v=>v.trim()).filter(Boolean);
  state.sections=[...document.querySelectorAll("[data-section-card]")].map(c=>({title:c.querySelector("[data-section-title]").value.trim(),body:c.querySelector("[data-section-body]").value.trim()})).filter(x=>x.title||x.body);
  state.faqs=[...document.querySelectorAll("[data-faq-card]")].map(c=>({q:c.querySelector("[data-faq-q]").value.trim(),a:c.querySelector("[data-faq-a]").value.trim()})).filter(x=>x.q||x.a);
}
function setCurrent(id){
  if(state)collect();
  currentId=id;
  state=clone(allPages[id]||REGISTRY[id].defaults);
  render();
}
function render(){
  ensureOverlay();
  const panel=document.getElementById("seoAdminPanel");
  const meta=REGISTRY[currentId];
  panel.innerHTML=`
    <div class="top"><div><h2>네이버 검색페이지 관리</h2><p class="hint">페이지별로 주제를 분리해서 관리합니다. 저장한 내용은 해당 공개 URL에 반영됩니다.</p></div><button class="light" id="seoClose">닫기</button></div>
    <div class="pageGrid">${Object.entries(REGISTRY).map(([id,p])=>`<button class="pageBtn ${id===currentId?"on":""}" data-page="${id}"><b>${esc(p.label)}</b><small>/${esc(p.filename)}</small></button>`).join("")}</div>
    <div class="box">
      <div class="boxHead"><div><h3>${esc(meta.label)} 검색페이지</h3><p class="hint">/${esc(meta.filename)}</p></div><button class="light" id="previewSeo">페이지 보기</button></div>
      <div class="grid">
        <label class="wide">검색 제목(title)<input id="seoTitle" value="${esc(state.seoTitle)}"></label>
        <label class="wide">검색 설명(description)<textarea id="seoDesc">${esc(state.metaDescription)}</textarea></label>
        <label class="wide">연관 키워드 — 쉼표로 구분<input id="seoKeywords" value="${esc((state.keywords||[]).join(", "))}"></label>
        <label>페이지 큰 제목<textarea id="seoHero">${esc(state.heroTitle)}</textarea></label>
        <label>페이지 첫 설명<textarea id="seoIntro">${esc(state.heroIntro)}</textarea></label>
      </div>
    </div>
    <div class="box"><div class="boxHead"><h3>본문 문단</h3><button class="light" id="addSection">+ 문단 추가</button></div><div id="sectionEditor"></div></div>
    <div class="box"><div class="boxHead"><h3>FAQ</h3><button class="light" id="addFaq">+ FAQ 추가</button></div><div id="faqEditor"></div></div>
    <div class="actions"><button class="primary" id="saveSeo">현재 페이지 저장</button><button class="light" id="resetSeo">이 페이지 기본내용 불러오기</button></div>
    <div class="status" id="seoStatus">수정 후 '현재 페이지 저장'을 눌러주세요.</div>
  `;
  document.getElementById("seoClose").onclick=()=>overlay.classList.remove("open");
  document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>setCurrent(b.dataset.page));
  document.getElementById("previewSeo").onclick=()=>window.open("/"+meta.filename,"_blank");
  renderSections();renderFaqs();
  document.getElementById("addSection").onclick=()=>{collect();state.sections.push({title:"새 문단 제목",body:"새 내용을 입력해 주세요."});render();};
  document.getElementById("addFaq").onclick=()=>{collect();state.faqs.push({q:"새 질문",a:"답변을 입력해 주세요."});render();};
  document.getElementById("resetSeo").onclick=()=>{state=clone(meta.defaults);render();document.getElementById("seoStatus").textContent="기본 내용을 불러왔습니다. 저장을 눌러야 실제 반영됩니다.";}
  document.getElementById("saveSeo").onclick=saveCurrent;
}
function renderSections(){
  const root=document.getElementById("sectionEditor");
  root.innerHTML=(state.sections||[]).map((s,i)=>`<div class="box" data-section-card><div class="boxHead"><b>문단 ${i+1}</b><button class="danger" data-rs="${i}">삭제</button></div><label>제목<input data-section-title value="${esc(s.title)}"></label><label style="margin-top:8px">내용<textarea data-section-body>${esc(s.body)}</textarea></label></div>`).join("");
  root.querySelectorAll("[data-rs]").forEach(b=>b.onclick=()=>{collect();state.sections.splice(Number(b.dataset.rs),1);render();});
}
function renderFaqs(){
  const root=document.getElementById("faqEditor");
  root.innerHTML=(state.faqs||[]).map((f,i)=>`<div class="box" data-faq-card><div class="boxHead"><b>FAQ ${i+1}</b><button class="danger" data-rf="${i}">삭제</button></div><label>질문<input data-faq-q value="${esc(f.q)}"></label><label style="margin-top:8px">답변<textarea data-faq-a>${esc(f.a)}</textarea></label></div>`).join("");
  root.querySelectorAll("[data-rf]").forEach(b=>b.onclick=()=>{collect();state.faqs.splice(Number(b.dataset.rf),1);render();});
}
async function saveCurrent(){
  collect();
  const st=document.getElementById("seoStatus");
  if(!state.seoTitle||!state.heroTitle){st.textContent="검색 제목과 페이지 큰 제목은 비워둘 수 없습니다.";return;}
  try{
    st.textContent="저장 중...";
    allPages[currentId]=clone(state);
    await adminSave(allPages);
    st.textContent="저장 완료. 해당 검색페이지에 바로 반영됩니다.";
  }catch(err){console.error(err);st.textContent="저장 실패: "+err.message;}
}
async function openSeoAdmin(){
  ensureOverlay();overlay.classList.add("open");
  const panel=document.getElementById("seoAdminPanel");
  if(!auth.currentUser){
    panel.innerHTML='<div class="top"><div><h2>네이버 검색페이지 관리</h2><p class="hint">먼저 기존 관리자 화면에서 로그인해 주세요.</p></div><button class="light" id="seoClose">닫기</button></div><div class="status">관리자 로그인이 확인되면 검색페이지 편집을 사용할 수 있습니다.</div>';
    document.getElementById("seoClose").onclick=()=>overlay.classList.remove("open");return;
  }
  panel.innerHTML='<h2>네이버 검색페이지 관리</h2><div class="status">저장된 내용 불러오는 중...</div>';
  try{allPages=await oneSnapshot();currentId=Object.keys(REGISTRY)[0];state=clone(allPages[currentId]||REGISTRY[currentId].defaults);render();}
  catch(err){panel.innerHTML='<h2>네이버 검색페이지 관리</h2><div class="status">불러오기 실패. 잠시 후 다시 시도해 주세요.</div>';console.error(err);}
}
window.openSeoSearchPageAdmin=openSeoAdmin;

function inject(){
  if(document.querySelector(".seoAdminTab"))return true;
  const tabs=document.querySelector(".adminTabs");
  if(!tabs)return false;
  const b=document.createElement("button");
  b.type="button";b.textContent="검색페이지";b.className="seoAdminTab";
  b.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();openSeoAdmin();});
  tabs.appendChild(b);
  return true;
}
new MutationObserver(inject).observe(document.documentElement,{childList:true,subtree:true});
inject();
