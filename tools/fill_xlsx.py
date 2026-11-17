import json
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment

BOOK = 'D:/Project/gwangyangpang/광양행운팡팡_번역목록.xlsx'
TR = 'D:/Project/gwangyangpang/tr'
tr = {x['id']: x for k in range(1, 6) for x in json.load(open(f'{TR}/out_{k}.json', encoding='utf-8'))}

NOTES = {
    'UI-008': '대표자 이름 한자 모름, 로마자로만 표기',
    'UI-018': '원문 오타(스켐→스캔) 의미대로 번역',
    'UI-019': '원문 오타(발습니다→밟습니다) 의미대로 번역',
    'UI-020': '원문 오타(누리면→누르면) 의미대로 번역',
    'UI-021': '"당일 23시 기준"을 적립 당일 23시 소멸로 해석함, 확인 필요',
    'C-005': '켈리=캘리그라피로 해석. 양말목 공예·고향사랑기부제 번역 확인 필요',
    'C-039': '서대회 영어 설명(Raw Sole Salad)은 추정',
    'C-080': '광양락희호텔 공식 영문명 확인 필요',
    'C-109': '더착한 닭갈비: 말장난이라 의역',
    'C-179': '주동후 선생 한자(朱东厚) 추정',
    'C-208': '원문 오타(캠핌장→캠핑장)',
    'C-224': '원문 "메마리 마을" 그대로 번역, 메아리 마을 오타인지 확인 필요',
    'C-230': '주소는 광양인데 원문은 하동 소재로 설명, 확인 필요',
    'C-259': '소학재 한자 추정',
    'C-268': '양은식 한자 추정',
    'C-287': '원문 오타(섬징강→섬진강), 염참/염창 마을 이름 확인 필요',
    'C-293': '봉우리·폭포·호수 이름 한자 추정 (매봉, 따리봉, 오로대, 구시폭포, 수어호)',
    'C-296': '한국관광100선 영문명은 설명형 번역, 구절초 중국어 확인 필요',
    'C-305': '벚굴 번역 확인 필요',
    'C-308': '영어·일본어에 임진왜란 설명 일부 추가',
    'C-314': '원문 "양만의"를 "광양만의" 오타로 보고 번역. 아이앤아키텍츠 영문명 추정',
    'C-316': '박세후 한자(朴世煦) 추정',
    'C-320': '마로화적 중국어·일본어 표기 추정',
    'C-335': '밀시감 품종명 표기 추정',
    'C-337': '원문에 <anago> 꺾쇠괄호 포함, HTML로 넣을 때 깨질 수 있음',
}

note_fill = PatternFill('solid', fgColor='FFF2CC')
wb = openpyxl.load_workbook(BOOK)


def fill(ws, id_of, first_lang_col):
    note_col = ws.max_column + 1 if ws.cell(1, ws.max_column).value != '검토 메모' else ws.max_column
    h = ws.cell(1, note_col, '검토 메모')
    h.font, h.fill = Font(bold=True, color='FFFFFF'), PatternFill('solid', fgColor='4472C4')
    ws.column_dimensions[openpyxl.utils.get_column_letter(note_col)].width = 40
    for r in range(2, ws.max_row + 1):
        x = tr[id_of(r)]
        for j, L in enumerate(('en', 'zh', 'ja')):
            c = ws.cell(r, first_lang_col + j, x[L])
            c.alignment = Alignment(wrap_text=True, vertical='top')
        note = NOTES.get(id_of(r))
        if note:
            c = ws.cell(r, note_col, note)
            c.alignment = Alignment(wrap_text=True, vertical='top')
            for cell in ws[r]:
                cell.fill = note_fill


ui = wb['1_화면문구']
fill(ui, lambda r: ui.cell(r, 1).value, 4)
ct = wb['2_콘텐츠']
fill(ct, lambda r: f'C-{r - 1:03d}', 5)

s = wb['0_요약']
s.append(['번역 상태', '영어·중국어·일본어 초벌 번역 완료 (AI 번역, 원어민 검수 전)'])
s.append(['검토 필요 항목', f'{len(NOTES)}건 (노란색 행, "검토 메모" 열 참고)'])
s.append(['표기 규칙', '지명·업체명은 국어 로마자 표기법. 중국어는 간체. 중·일 주소는 시·군·읍면은 한자, 도로명은 로마자'])
wb.save(BOOK)
print('saved', len(tr), 'notes', len(NOTES))
