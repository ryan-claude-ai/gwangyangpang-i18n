# 광양행운팡팡 다국어 사이트 (한국어 / English / 简体中文 / 日本語)

원본 사이트(http://www.gwangyangpang.kr)의 공개 콘텐츠를 "행운 티켓" 디자인으로 다시 만든 정적 사이트입니다.
서버 프로그램 없이 HTML/CSS/JS 파일만으로 동작합니다.

## 실행

```bash
python -m http.server 8765 --directory gwangyangpang/site
```

브라우저에서 http://localhost:8765 를 엽니다. 아무 정적 웹호스팅에 `site` 폴더를 그대로 올려도 됩니다.

## 파일

| 파일 | 내용 |
|---|---|
| `index.html` | 공통 틀 (상단 바, 분류 메뉴, 하단 탭, 도장 효과) |
| `style.css` | 디자인 전체 |
| `app.js` | 화면 이동(해시 주소)과 각 화면 그리기, 원본에 없던 새 문구 4개 언어 |
| `data.js` | 원본에서 수집한 115개 장소·행사 + 화면 문구, 4개 언어 번역 (`광양행운팡팡_번역목록.xlsx`와 같은 내용). `python tools/build_data.py`로 다시 만듦 |
| `img/` | 상세 사진 235장 |

## 주소

| 주소 | 화면 |
|---|---|
| `#/` | 언어 선택 (처음 방문 시 자동) |
| `#/home` | 메인 |
| `#/list/festival` · `food` · `hotel` · `tour` · `sp` | 분류 목록 |
| `#/item/food/111` | 상세 (원본 `food_s1.html?com_idx=111`과 같은 번호) |
| `#/guide` | 이용 가이드 (포인트) |
| `#/survey` | 만족도 조사 |
| `#/mypoint` | 나의 포인트 |

QR 코드에 `?lang=en`처럼 언어를 붙이면 언어 선택을 건너뛰고 바로 그 언어로 들어갑니다 (`ko`, `en`, `zh`, `ja`).

## 아직 서버와 연결되지 않은 부분

원본의 PHP 소스와 DB가 없어서 아래 기능은 화면과 입력 확인까지만 동작하고, 제출하면 "서버 연동 전" 안내가 나옵니다.

- **만족도 조사**: 원본 `vote.html`은 `V_1`~`V_10`, `V_phone`과 숨은 값 `booth_idx`, `vote_mode`, `V_m_index`, `index_list`를 POST합니다. 같은 필드 이름을 그대로 써 두었습니다.
- **나의 포인트 (휴대폰 로그인)**: 원본 `phone_login.html`은 `B_name`, `B_phone`, `login_type=mylist`, `send_mode`를 POST합니다.
- **QR 포인트 적립·선물 교환**: 원본 서버에서 처리되며, 이 사이트에는 없습니다.

소스나 서버 접속 권한을 받으면 `app.js`의 `TODO 서버 연동` 부분에 연결하면 됩니다.

## 알아둘 점

- 사진은 원본 서버의 `file.php?U_index=N`을 가로 900px로 줄여 `img/N.jpg`로 함께 두었습니다. 다시 받으려면 `python tools/fetch_imgs.py`를 실행하세요. 원본 사진은 4,000px 이상이라 느리고, HTTPS 사이트에서는 원본(HTTP) 사진이 차단됩니다.
- 메인 배너 등 이미지 안에 들어간 한글은 번역되지 않으므로, 새 디자인에서는 쓰지 않았습니다.
- 콘텐츠를 추가·수정하면 `data.js`를 다시 만들어야 합니다. 원본 관리자 페이지와 연동되지 않습니다.
- 번역은 AI 초벌이므로 공개 전 원어민 검수가 필요합니다 (엑셀의 노란색 행).
