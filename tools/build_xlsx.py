import json
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

SRC = 'D:/Project/gwangyangpang/raw_crawl.json'
OUT = 'D:/Project/gwangyangpang/광양행운팡팡_번역목록.xlsx'
d = json.load(open(SRC, encoding='utf-8'))
LANGS = ['영어 (en)', '중국어 (zh)', '일본어 (ja)']
PAGE_NAME = {'/': '메인', '/vote.html': '만족도 조사', '/coupon.html': '이용 가이드(포인트)',
             '/phone_login.html?login_type=mylist': '휴대폰 로그인',
             '/festival_intro.html': '목록(공통)', '/food_intro.html': '목록(공통)'}

head_font = Font(bold=True, color='FFFFFF')
head_fill = PatternFill('solid', fgColor='4472C4')
wrap = Alignment(wrap_text=True, vertical='top')


def sheet(wb, title, headers, rows, widths):
    ws = wb.create_sheet(title)
    ws.append(headers)
    for c in ws[1]:
        c.font, c.fill = head_font, head_fill
    for r in rows:
        ws.append(r)
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.alignment = wrap
    ws.freeze_panes = 'A2'
    return ws


wb = Workbook()
wb.remove(wb.active)

# 1) 화면 고정 문구 (메뉴, 버튼, 안내문, 설문)
seen, ui_rows = {}, []
for page, v in d['ui'].items():
    for s in v['lines'] + v['btn']:
        if s in seen:
            continue
        seen[s] = True
        ui_rows.append([f'UI-{len(ui_rows) + 1:03d}', PAGE_NAME.get(page, page), s, '', '', ''])
sheet(wb, '1_화면문구', ['ID', '페이지', '한국어 (원문)'] + LANGS, ui_rows, [9, 18, 50, 40, 40, 40])

# 2) DB 콘텐츠 (행사/음식점/숙박/관광지/특산물 상세)
FIELDS = [('name', '이름'), ('description', '소개'), ('info', '부가정보(기간·주소·링크)')]
c_rows = []
for r in d['rows']:
    for key, label in FIELDS:
        if r.get(key):
            c_rows.append([r['category'], r['com_idx'], label, r[key], '', '', '', r['url']])
sheet(wb, '2_콘텐츠', ['분류', 'com_idx', '항목', '한국어 (원문)'] + LANGS + ['원본 URL'],
      c_rows, [10, 9, 14, 60, 45, 45, 45, 30])

# 3) 이미지 (글자가 박혀 있으면 언어별로 다시 만들어야 함)
img_pages = {}
for page, v in d['ui'].items():
    for s in v['imgs']:
        name = s.split('/')[-1]
        img_pages.setdefault(name, set()).add(PAGE_NAME.get(page, page))
i_rows = [[n, ', '.join(sorted(p)), 'http://www.gwangyangpang.kr/images/' + n, '확인 필요', '']
          for n, p in sorted(img_pages.items())]
for r in d['rows']:
    if r['images']:
        i_rows.append([f"{r['category']} #{r['com_idx']} {r['name']}", '상세 페이지 사진',
                       r['image_list'].replace(' ', '\n'), '확인 필요 (포스터면 글자 있음)', ''])
sheet(wb, '3_이미지', ['이미지', '사용 위치', 'URL', '이미지 안 한글 여부', '비고'],
      i_rows, [40, 28, 60, 26, 30])

# 0) 요약
cats = {}
for r in d['rows']:
    cats[r['category']] = cats.get(r['category'], 0) + 1
chars = sum(len(row[3]) for row in c_rows) + sum(len(row[2]) for row in ui_rows)
summary = [['대상 사이트', 'http://www.gwangyangpang.kr/'],
           ['대상 언어', '한국어(원문) / 영어 / 중국어 / 일본어'],
           ['화면 문구 수', len(ui_rows)],
           ['콘텐츠 항목 수 (상세 페이지)', len(d['rows'])]] + \
          [[f'  - {k}', v] for k, v in cats.items()] + \
          [['번역할 한글 원문 글자 수(대략)', chars],
           ['이미지 (공통 배너 / 상세 사진)', f"{len(img_pages)} / {sum(r['images'] for r in d['rows'])}"],
           ['수집 방식', '공개 페이지만 읽음 (로그인 후 화면·관리자 페이지 제외)']]
ws = sheet(wb, '0_요약', ['항목', '값'], summary, [32, 60])
wb.move_sheet(ws, offset=-3)
wb.save(OUT)
print(OUT, len(ui_rows), len(c_rows), len(i_rows), chars)
