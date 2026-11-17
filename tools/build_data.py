"""raw_crawl.json(원본 수집) + tr/in_*.json, tr/out_*.json(번역) -> site/data.js

번역을 고친 뒤에는 tr/out_*.json 을 수정하고 이 스크립트를 다시 실행한다.
실행: python tools/build_data.py  (gwangyangpang 폴더에서)
"""
import json

raw = json.load(open('raw_crawl.json', encoding='utf-8'))
tr = {x['id']: x for k in range(1, 6) for x in json.load(open(f'tr/out_{k}.json', encoding='utf-8'))}
src = {x['id']: x for k in range(1, 6) for x in json.load(open(f'tr/in_{k}.json', encoding='utf-8'))}
CAT = {'행사안내': 'festival', '음식점': 'food', '숙박': 'hotel', '관광지': 'tour', '특산물': 'sp'}


def langs(i):
    t = tr[i]
    return {'ko': src[i]['ko'], 'en': t['en'], 'zh': t['zh'], 'ja': t['ja']}


def local_img(url):
    # 사진은 site/img 에 줄인 사본을 둠 (tools/fetch_imgs.py). HTTPS 호스팅에서는 원본 HTTP 사진이 차단됨
    return 'img/' + url.split('U_index=')[1] + '.jpg'


# 콘텐츠 ID(C-001~)는 수집 순서대로 각 항목의 이름, 소개, 부가정보(값이 있을 때만)에 매겨져 있음
items, n = [], 0
for r in raw['rows']:
    it = {'cat': CAT[r['category']], 'idx': r['com_idx'], 'phone': r['phone'],
          'images': [local_img(u) for u in r['image_list'].split()]}
    for key, out in (('name', 'name'), ('description', 'desc'), ('info', 'info')):
        if r.get(key):
            n += 1
            cid = f'C-{n:03d}'
            assert src[cid]['ko'] == r[key], cid
            it[out] = langs(cid)
    items.append(it)

ui = {i: langs(i) for i in tr if i.startswith('UI')}
with open('site/data.js', 'w', encoding='utf-8') as f:
    f.write('// 원본 사이트에서 수집한 콘텐츠 + 초벌 번역 (번역목록 엑셀과 같은 내용)\nwindow.SITE_DATA = '
            + json.dumps({'items': items, 'ui': ui}, ensure_ascii=False) + ';\n')
print('items', len(items), 'content strings', n, 'ui strings', len(ui))
