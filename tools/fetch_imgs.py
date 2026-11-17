import json, re, sys, io, time, urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageOps

RAW = 'raw_crawl.json'
OUT = 'site/img'
MAXW = 900

# gwangyangpang 폴더에서 실행: python tools/fetch_imgs.py
raw = json.load(open(RAW, encoding='utf-8'))
urls = sorted({u for r in raw['rows'] for u in r['image_list'].split()})


def get(u):
    uid = re.search(r'U_index=(\d+)', u).group(1)
    path = f'{OUT}/{uid}.jpg'
    for attempt in range(3):
        try:
            req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0', 'Referer': 'http://www.gwangyangpang.kr/'})
            raw = urllib.request.urlopen(req, timeout=60).read()
            im = ImageOps.exif_transpose(Image.open(io.BytesIO(raw))).convert('RGB')
            if im.width > MAXW:
                im = im.resize((MAXW, round(im.height * MAXW / im.width)), Image.LANCZOS)
            im.save(path, 'JPEG', quality=78, optimize=True, progressive=True)
            return uid, len(raw), None
        except Exception as e:
            err = str(e)
            time.sleep(1)
    return uid, 0, err


with ThreadPoolExecutor(4) as ex:
    res = list(ex.map(get, urls))
bad = [r for r in res if r[2]]
print('ok', len(res) - len(bad), 'failed', len(bad), bad[:5])
print('original MB', round(sum(r[1] for r in res) / 1e6, 1))
