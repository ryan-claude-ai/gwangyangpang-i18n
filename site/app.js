/* 광양행운팡팡 다국어 사이트 - 해시 라우터 기반 정적 사이트
   #/            언어 선택 (저장된 언어가 없을 때 첫 화면)
   #/home        메인
   #/list/food   분류 목록 (festival, food, hotel, tour, sp)
   #/item/food/111  상세
   #/guide       이용 가이드 (포인트)
   #/survey      만족도 조사
   #/mypoint     나의 포인트 (휴대폰 로그인)
   ?lang=en      QR 코드에 언어를 지정해 바로 들어올 때 */
(function () {
  'use strict';

  var DATA = window.SITE_DATA;
  var LANGS = ['ko', 'en', 'zh', 'ja'];
  var HTML_LANG = { ko: 'ko', en: 'en', zh: 'zh-Hans', ja: 'ja' };
  var CATS = ['festival', 'food', 'hotel', 'tour', 'sp'];
  var CAT_UI = { festival: 'UI-001', food: 'UI-002', hotel: 'UI-003', tour: 'UI-004', sp: 'UI-005' };
  var COLOR = { ko: 'var(--blossom)', en: 'var(--river)', zh: 'var(--camellia)', ja: 'var(--maesil)' };
  var ORIGIN = 'http://www.gwangyangpang.kr';

  // 원본 사이트에 없던 문구 (새 디자인에서 추가)
  var S = {
    name:      { ko: '한국어', en: 'English', zh: '简体中文', ja: '日本語' },
    hello:     { ko: '안녕하세요', en: 'Hello', zh: '你好', ja: 'こんにちは' },
    welcome:   { ko: '광양에 오신 것을 환영합니다', en: 'Welcome to Gwangyang', zh: '欢迎来到光阳', ja: '光陽へようこそ' },
    stamp:     { ko: '환영합니다!', en: 'Welcome!', zh: '欢迎光临!', ja: 'ようこそ!' },
    tSub:      { ko: '매화 향기 가득한 광양으로', en: 'Step into Gwangyang', zh: '走进梅香光阳', ja: '梅香る光陽へようこそ' },
    tGo:       { ko: '입장', en: 'ENTER', zh: '进入', ja: '入場' },
    brand:     { ko: '광양행운팡팡', en: 'Lucky PangPang', zh: '光阳幸运砰砰', ja: '光陽ラッキーパンパン' },
    heroT:     { ko: '매화 피는 광양,\n행운을 모아 보세요', en: 'Plum blossoms bloom,\nluck adds up', zh: '梅花盛开的光阳，\n一起收集幸运吧', ja: '梅の咲く光陽で、\n幸運を集めよう' },
    heroD:     { ko: '축제·맛집·숙소·관광지를 둘러보고 QR을 찍으면 행운 포인트가 쌓여요.', en: 'Explore festivals, food, stays and sights. Scan QR codes along the way to collect lucky points.', zh: '游览节庆、美食、住宿和景点，扫描二维码即可累积幸运积分。', ja: 'お祭り・グルメ・宿・観光地をめぐり、QRコードを読み取るとラッキーポイントがたまります。' },
    seeAll:    { ko: '전체보기', en: 'See all', zh: '查看全部', ja: 'すべて見る' },
    count:     { ko: '총 {n}곳', en: '{n} places', zh: '共{n}处', ja: '全{n}件' },
    back:      { ko: '뒤로', en: 'Back', zh: '返回', ja: '戻る' },
    call:      { ko: '전화하기', en: 'Call', zh: '拨打电话', ja: '電話する' },
    map:       { ko: '지도 보기', en: 'Open map', zh: '查看地图', ja: '地図を見る' },
    website:   { ko: '관련 사이트', en: 'Website', zh: '相关网站', ja: '関連サイト' },
    photos:    { ko: '사진', en: 'photos', zh: '张照片', ja: '枚' },
    korean:    { ko: '', en: 'View the original Korean page', zh: '查看韩语原文页面', ja: '韓国語の元ページを見る' },
    home:      { ko: '홈', en: 'Home', zh: '首页', ja: 'ホーム' },
    guide:     { ko: '이용 가이드', en: 'How to Use', zh: '使用指南', ja: 'ご利用ガイド' },
    guideD:    { ko: 'QR 스캔으로 포인트를 모으고 선물로 바꾸는 방법', en: 'Collect points with QR codes and swap them for gifts', zh: '扫描二维码累积积分并兑换礼品的方法', ja: 'QRでポイントを集めてプレゼントと交換する方法' },
    survey:    { ko: '만족도 조사', en: 'Survey', zh: '满意度调查', ja: '満足度調査' },
    surveyD:   { ko: '참여하면 추첨으로 커피 쿠폰을 드려요', en: 'Join for a chance to win a coffee coupon', zh: '参与即有机会抽中咖啡券', ja: '参加すると抽選でコーヒークーポン' },
    mypoint:   { ko: '나의 포인트', en: 'My Points', zh: '我的积分', ja: 'マイポイント' },
    mypointD:  { ko: '이름과 연락처로 적립·사용 내역을 확인해요', en: 'Check your history with your name and phone number', zh: '用姓名和电话查询积分记录', ja: '名前と電話番号で履歴を確認' },
    lucky:     { ko: '행운 포인트', en: 'Lucky points', zh: '幸运积分', ja: 'ラッキーポイント' },
    needAll:   { ko: '아직 답하지 않은 문항이 있어요. 빨간 테두리 문항을 골라 주세요.', en: 'Some questions are unanswered. Please answer the ones outlined in red.', zh: '还有未回答的问题，请选择红框标出的题目。', ja: '未回答の質問があります。赤枠の質問にお答えください。' },
    needPhone: { ko: '휴대전화 번호를 숫자로 입력해 주세요.', en: 'Please enter your mobile number using digits.', zh: '请用数字输入手机号码。', ja: '携帯電話番号を数字で入力してください。' },
    needName:  { ko: '이름과 연락처를 모두 입력해 주세요.', en: 'Please enter both your name and phone number.', zh: '请填写姓名和联系电话。', ja: 'お名前と電話番号を入力してください。' },
    offline:   { ko: '아직 행운팡팡 서버와 연결되지 않은 시범 화면이라 내용이 저장되지 않았어요. 서버 연동 후 사용할 수 있습니다.', en: 'This preview is not yet connected to the Lucky PangPang server, so nothing was saved. It will work once the server is connected.', zh: '此页面为试运行版本，尚未连接幸运砰砰服务器，内容未被保存。连接服务器后即可使用。', ja: 'このページはまだラッキーパンパンのサーバーに接続されていない試作版のため、内容は保存されていません。サーバー接続後にご利用いただけます。' },
    company:   { ko: '상호', en: 'Company', zh: '公司', ja: '会社名' },
    owner:     { ko: '대표', en: 'CEO', zh: '代表', ja: '代表' },
    bizno:     { ko: '사업자등록번호', en: 'Business Reg. No.', zh: '营业执照号', ja: '事業者登録番号' },
    addr:      { ko: '주소', en: 'Address', zh: '地址', ja: '住所' },
    notFound:  { ko: '찾는 페이지가 없어요.', en: 'Page not found.', zh: '找不到该页面。', ja: 'ページが見つかりません。' },
    pick:      { ko: '나의 언어 티켓을 고르세요', en: 'Pick your language ticket', zh: '请选择语言车票', ja: '言語チケットを選んでください' },
    later:     { ko: '언어는 위쪽 버튼으로 언제든 바꿀 수 있어요', en: 'You can change the language anytime from the top', zh: '可随时通过上方按钮切换语言', ja: '言語は上のボタンからいつでも変更できます' }
  };
  // 번역 검수에서 나온 수정 (UI-007 중국어 회사명)
  DATA.ui['UI-007'].zh = 'Mujigae Company 有限公司';

  var ICON = {
    festival: '<path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/><path d="M12 4V2"/>',
    food: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10"/><path d="M17 21V3c-2 1-3 4-3 7h3"/>',
    hotel: '<path d="M3 20V7M3 14h18v6M21 14v-3a3 3 0 0 0-3-3h-7v6"/><circle cx="7" cy="11" r="2"/>',
    tour: '<path d="M3 20l6-12 4 7 3-4 5 9z"/><circle cx="17" cy="6" r="2"/>',
    sp: '<path d="M12 21c-4-2-7-5-7-9a7 7 0 0 1 14 0c0 4-3 7-7 9z"/><path d="M12 5V2M12 8v9"/>',
    home: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/>',
    guide: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    survey: '<path d="M9 11l2 2 4-4"/><rect x="4" y="3" width="16" height="18" rx="2"/>',
    mypoint: '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.5 10.5h4a1.5 1.5 0 0 1 0 3h-3"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    pin: '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    link: '<path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1"/><path d="M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8" r="1.5"/>',
    back: '<path d="M15 5l-7 7 7 7"/>'
  };
  function icon(n) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICON[n] + '</svg>'; }

  var lang = 'ko';
  var view = document.getElementById('view');
  var helloTimer = null;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function t(obj) { return obj ? (obj[lang] || obj.ko) : ''; }
  function s(key) { return t(S[key]); }
  function ui(id) { return t(DATA.ui[id]); }
  function catName(c) { return ui(CAT_UI[c]); }
  function itemsOf(c) { return DATA.items.filter(function (i) { return i.cat === c; }); }
  function findItem(c, idx) { return DATA.items.filter(function (i) { return i.cat === c && String(i.idx) === String(idx); })[0]; }
  function firstLine(text) { return (text || '').split('\n').filter(function (l) { return l.trim(); })[0] || ''; }

  function saveLang(l) { try { localStorage.setItem('gy_lang', l); } catch (e) {} }
  function loadLang() { try { return localStorage.getItem('gy_lang'); } catch (e) { return null; } }

  function setLang(l) {
    lang = LANGS.indexOf(l) >= 0 ? l : 'ko';
    document.documentElement.lang = HTML_LANG[lang];
    document.getElementById('langName').textContent = s('name');
    document.getElementById('brandName').textContent = s('brand');
    document.title = s('brand') + ' | Gwangyang Lucky PangPang';
  }

  /* ---------- 공통 틀 ---------- */
  function chrome(show, current) {
    ['topbar', 'catnav', 'footer', 'tabbar'].forEach(function (id) { document.getElementById(id).hidden = !show; });
    document.getElementById('app').classList.toggle('no-tabbar', !show);
    if (!show) return;

    document.getElementById('catnav').innerHTML = CATS.map(function (c) {
      return '<a href="#/list/' + c + '" style="--c:var(--c-' + c + ')"' + (current === c ? ' class="on" aria-current="page"' : '') + '>' + esc(catName(c)) + '</a>';
    }).join('');

    var tabs = [['home', '#/home'], ['guide', '#/guide'], ['survey', '#/survey'], ['mypoint', '#/mypoint']];
    document.getElementById('tabbar').innerHTML = tabs.map(function (tb) {
      return '<a href="' + tb[1] + '"' + (current === tb[0] ? ' class="on" aria-current="page"' : '') + '>' + icon(tb[0]) + esc(s(tb[0])) + '</a>';
    }).join('');

    document.getElementById('footer').innerHTML =
      '<p><b>' + esc(ui('UI-006')) + '</b><br>pangpang@mjgc.co.kr</p>' +
      '<p>' + esc(s('company')) + ' ' + esc(ui('UI-007')) + ' · ' + esc(s('owner')) + ' ' + esc(ui('UI-008')) + '<br>' +
      esc(s('bizno')) + ' 504-81-68646<br>' + esc(s('addr')) + ' ' + esc(ui('UI-009')) + '</p>' +
      '<p>' + esc(ui('UI-010')) + '</p><p>' + esc(ui('UI-011')) + '</p>';
  }

  function card(it, withTag) {
    var img = it.images[0] || '';
    return '<a class="card" href="#/item/' + it.cat + '/' + it.idx + '" style="--c:var(--c-' + it.cat + ')">' +
      '<div class="ph">' + (img ? '<img src="' + esc(img) + '" alt="" loading="lazy">' : '') +
      (withTag ? '<em class="tag">' + esc(catName(it.cat)) + '</em>' : '') + '</div>' +
      '<b>' + esc(t(it.name)) + '</b><span>' + esc(firstLine(t(it.desc))) + '</span></a>';
  }

  /* ---------- 언어 선택 ---------- */
  function branchSvg() {
    var spots = [[150, 86, 15], [196, 46, 13], [246, 92, 11], [102, 62, 12], [140, 176, 13], [70, 140, 12], [176, 64, 9], [124, 112, 9], [30, 170, 10], [222, 30, 10], [158, 132, 8]];
    var flowers = spots.map(function (p, k) {
      var fill = k % 3 === 1 ? '#ffffff' : (k % 3 === 2 ? '#f7b3c9' : '#ef7fa5');
      var petals = '';
      for (var i = 0; i < 5; i++) {
        var a = i * 72 * Math.PI / 180, r = p[2] * .55;
        petals += '<circle cx="' + (Math.cos(a) * r).toFixed(1) + '" cy="' + (Math.sin(a) * r).toFixed(1) + '" r="' + (p[2] * .52).toFixed(1) + '" fill="' + fill + '" stroke="#e46b94" stroke-width=".8"/>';
      }
      return '<g transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + (k * 23) + ')">' + petals + '<circle r="' + (p[2] * .25).toFixed(1) + '" fill="#f4c542"/></g>';
    }).join('');
    return '<svg class="branch" viewBox="0 0 270 220" fill="none" aria-hidden="true">' +
      '<path d="M270 18 C210 30 176 54 150 86 C128 112 104 128 70 140 M150 86 C160 116 158 148 140 176 M196 46 C204 70 222 84 246 92 M110 122 C98 100 96 82 102 62" stroke="#5a3a2c" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M70 140 C52 146 40 156 30 170 M140 176 C134 190 132 200 134 212" stroke="#5a3a2c" stroke-width="3" stroke-linecap="round"/>' +
      flowers + '</svg>';
  }

  function renderSelect() {
    chrome(false);
    var cur = loadLang();
    var tickets = LANGS.map(function (l, i) {
      var en = { ko: 'KOREAN', en: 'ENGLISH', zh: 'CHINESE', ja: 'JAPANESE' }[l];
      return '<button class="ticket' + (cur === l ? ' current' : '') + '" type="button" lang="' + HTML_LANG[l] + '" data-lang="' + l + '" style="--c:' + COLOR[l] + '">' +
        '<span class="t-main"><span class="t-no">NO.0' + (i + 1) + ' · ' + en + '</span><span class="t-name">' + S.name[l] + '</span><span class="t-sub">' + S.tSub[l] + '</span></span>' +
        '<span class="t-stub"><span class="t-go">' + S.tGo[l] + '</span><span class="t-arrow">→</span></span></button>';
    }).join('');

    view.innerHTML =
      '<section class="select">' +
      '<span class="badge"><i></i>GWANGYANG LUCKY PANGPANG</span>' +
      '<div class="hero" aria-hidden="true">' + branchSvg() +
      '<h1 class="hello" id="hello" lang="ko"><span class="word">' + S.hello.ko + '</span><small>' + S.welcome.ko + '</small></h1>' +
      '<div class="dots" id="dots"><span class="on"></span><span></span><span></span><span></span></div>' +
      '<div class="big">GWANGYANG</div>' +
      '<svg class="waves" viewBox="0 0 480 38" preserveAspectRatio="none"><path d="M0 20 Q30 8 60 20 T120 20 T180 20 T240 20 T300 20 T360 20 T420 20 T480 20 V38 H0Z" fill="#cfe3ef"/><path d="M0 28 Q30 18 60 28 T120 28 T180 28 T240 28 T300 28 T360 28 T420 28 T480 28 V38 H0Z" fill="#9cc7e0"/></svg>' +
      '</div>' +
      '<div class="ask"><b>' + S.pick.ko + '</b><span><span lang="en">Pick your ticket</span><br><span lang="zh-Hans">选择语言</span> · <span lang="ja">言語を選択</span></span></div>' +
      '<div class="tickets">' + tickets + '</div>' +
      '<p class="foot-note">' + S.later.ko + ' · Change anytime</p>' +
      '</section>';

    view.querySelectorAll('.ticket').forEach(function (b) {
      b.addEventListener('click', function () { choose(b.dataset.lang); });
    });

    if (!reduce) {
      var sec = view.querySelector('.select');
      for (var i = 0; i < 9; i++) {
        var p = document.createElement('span');
        p.className = 'petal';
        p.style.left = (10 + Math.random() * 95) + '%';
        p.style.animationDuration = (7 + Math.random() * 6) + 's';
        p.style.animationDelay = (-Math.random() * 12) + 's';
        p.style.background = i % 3 ? '#ef7fa5' : '#ffffff';
        sec.appendChild(p);
      }
      var hi = 0;
      helloTimer = setInterval(function () {
        var el = document.getElementById('hello');
        if (!el) return;
        hi = (hi + 1) % LANGS.length;
        var l = LANGS[hi];
        el.lang = HTML_LANG[l];
        el.innerHTML = '<span class="word">' + S.hello[l] + '</span><small>' + S.welcome[l] + '</small>';
        document.querySelectorAll('#dots span').forEach(function (d, i) { d.classList.toggle('on', i === hi); });
      }, 2200);
    }
  }

  function choose(l) {
    saveLang(l);
    setLang(l);
    var layer = document.getElementById('stampLayer'), stamp = document.getElementById('stamp');
    stamp.style.setProperty('--c', COLOR[l]);
    document.getElementById('stampText').textContent = S.stamp[l];
    stamp.style.animation = 'none'; void stamp.offsetWidth; stamp.style.animation = '';
    layer.classList.add('on');
    setTimeout(function () {
      layer.classList.remove('on');
      var back = sessionStorageGet('gy_return');
      location.hash = back || '#/home';
    }, reduce ? 300 : 1000);
  }
  function sessionStorageGet(k) { try { var v = sessionStorage.getItem(k); sessionStorage.removeItem(k); return v; } catch (e) { return null; } }

  /* ---------- 메인 ---------- */
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }

  function renderHome() {
    chrome(true, 'home');
    var tiles = CATS.map(function (c) {
      return '<a href="#/list/' + c + '" style="--c:var(--c-' + c + ')"><i>' + icon(c) + '</i>' + esc(catName(c)) + '</a>';
    }).join('');
    var sections = CATS.map(function (c) {
      var picks = shuffle(itemsOf(c)).slice(0, 4);
      return '<div class="sec-head" style="--c:var(--c-' + c + ')"><h2>' + esc(catName(c)) + '</h2><a href="#/list/' + c + '">' + esc(s('seeAll')) + ' →</a></div>' +
        '<div class="hscroll">' + picks.map(function (it) { return card(it); }).join('') + '</div>';
    }).join('');

    view.innerHTML =
      '<div class="home-hero"><span class="eyebrow">GWANGYANG · 2026</span><h1>' + esc(s('heroT')).replace(/\n/g, '<br>') + '</h1><p>' + esc(s('heroD')) + '</p>' +
      '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="#f7b3c9" stroke="#e46b94">' +
      '<circle cx="50" cy="30" r="16"/><circle cx="69" cy="44" r="16"/><circle cx="62" cy="66" r="16"/><circle cx="38" cy="66" r="16"/><circle cx="31" cy="44" r="16"/></g><circle cx="50" cy="50" r="8" fill="#f4c542"/></svg></div>' +
      '<div class="section">' +
      '<div class="cat-tiles">' + tiles + '</div>' +
      '<a class="pass" href="#/guide"><div><b>' + esc(s('guide')) + '</b><p>' + esc(s('guideD')) + '</p></div><div class="mini">PANG!</div></a>' +
      '<div class="duo">' +
      '<a href="#/survey" style="--c:var(--maesil)"><b>' + esc(s('survey')) + '</b><span>' + esc(s('surveyD')) + '</span></a>' +
      '<a href="#/mypoint" style="--c:var(--river)"><b>' + esc(s('mypoint')) + '</b><span>' + esc(s('mypointD')) + '</span></a>' +
      '</div>' + sections + '</div>';
  }

  /* ---------- 목록 ---------- */
  function renderList(c) {
    if (CATS.indexOf(c) < 0) return renderNotFound();
    chrome(true, c);
    var list = itemsOf(c);
    view.innerHTML =
      '<div class="list-head" style="--c:var(--c-' + c + ')"><span class="eyebrow">' + c.toUpperCase() + '</span>' +
      '<h1 class="page-title">' + esc(catName(c)) + '</h1><p class="count">' + esc(s('count').replace('{n}', list.length)) + '</p></div>' +
      '<div class="section"><div class="cards">' + list.map(function (it) { return card(it); }).join('') + '</div></div>';
  }

  /* ---------- 상세 ---------- */
  function infoParts(it, l) { return ((it.info && it.info[l]) || '').split(' | ').map(function (x) { return x.trim(); }).filter(Boolean); }
  function looksAddress(x) { return /(광양|전남|전라남도|Gwangyang|Jeollanam|Jeonnam|光阳|光陽|全罗|全羅)/.test(x) && /\d/.test(x); }
  function looksDate(x) { return /(20\d\d|\d{1,2}\s*[.월月]\s*\d|\d{1,2}:\d\d|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/.test(x); }

  function renderItem(c, idx) {
    var it = findItem(c, idx);
    if (!it) return renderNotFound();
    chrome(true, c);
    var parts = infoParts(it, lang), koParts = infoParts(it, 'ko');
    var facts = '';
    parts.forEach(function (p, i) {
      if (/^https?:\/\//.test(p)) {
        facts += '<li>' + icon('link') + '<a href="' + esc(p) + '" target="_blank" rel="noopener">' + esc(s('website')) + '</a></li>';
      } else if (looksAddress(p)) {
        var q = koParts.length === parts.length && looksAddress(koParts[i]) ? koParts[i] : (t(it.name) + ' 광양');
        facts += '<li>' + icon('pin') + '<div>' + esc(p) + '<br><a href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q) + '" target="_blank" rel="noopener">' + esc(s('map')) + ' →</a></div></li>';
      } else if (looksDate(p)) {
        facts += '<li>' + icon('cal') + '<div>' + esc(p) + '</div></li>';
      } else {
        facts += '<li>' + icon('tag') + '<div>' + esc(p) + '</div></li>';
      }
    });
    if (it.phone) facts = '<li>' + icon('phone') + '<div><span>' + esc(it.phone) + '</span></div></li>' + facts;

    var imgs = it.images.map(function (src) { return '<img src="' + esc(src) + '" alt="" loading="lazy">'; }).join('');
    var backHref = '#/list/' + c;
    var orig = ORIGIN + '/' + c + '_s1.html?com_idx=' + it.idx;

    view.innerHTML =
      '<div class="detail-top">' +
      '<a class="back" href="' + backHref + '" aria-label="' + esc(s('back')) + '">' + icon('back') + '</a>' +
      '<div class="gallery">' + imgs + '</div>' +
      (it.images.length > 1 ? '<span class="gal-count" id="galCount">1 / ' + it.images.length + '</span>' : '') +
      '</div>' +
      '<div class="ticket-card" style="--c:var(--c-' + c + ')"><span class="eyebrow">' + esc(catName(c)) + ' · NO.' + it.idx + '</span><h1>' + esc(t(it.name)) + '</h1></div>' +
      (facts ? '<ul class="facts" style="--c:var(--c-' + c + ')">' + facts + '</ul>' : '') +
      '<div class="desc">' + esc(t(it.desc)) + '</div>' +
      '<div class="actions">' +
      (it.phone ? '<a class="btn" href="tel:' + esc(it.phone.replace(/[^\d+]/g, '')) + '">' + esc(s('call')) + '</a>' : '') +
      '<a class="btn ghost" href="' + backHref + '"' + (it.phone ? '' : ' style="grid-column:1/-1"') + '>' + esc(catName(c)) + '</a>' +
      '</div>' +
      (lang !== 'ko' ? '<a class="orig" href="' + esc(orig) + '" target="_blank" rel="noopener">' + esc(s('korean')) + ' ↗</a>' : '');

    var gal = view.querySelector('.gallery'), cnt = document.getElementById('galCount');
    if (gal && cnt) gal.addEventListener('scroll', function () {
      cnt.textContent = (Math.round(gal.scrollLeft / gal.clientWidth) + 1) + ' / ' + it.images.length;
    }, { passive: true });
  }

  /* ---------- 이용 가이드 ---------- */
  function steps(ids, color) {
    return '<ol class="steps" style="--c:' + color + '">' + ids.map(function (id, i) {
      return '<li><i>' + (i + 1) + '</i><span>' + esc(ui(id).replace(/^\s*\d+\.\s*/, '')) + '</span></li>';
    }).join('') + '</ol>';
  }
  function renderGuide() {
    chrome(true, 'guide');
    view.innerHTML =
      '<div class="section"><span class="eyebrow">HOW TO USE</span><h1 class="page-title">' + esc(s('guide')) + '</h1>' +
      '<p class="lead">' + esc(s('guideD')) + '</p>' +
      '<h2 class="box-title">' + esc(ui('UI-013')) + '</h2>' + steps(['UI-014', 'UI-015', 'UI-016'], 'var(--blossom)') +
      '<h2 class="box-title">' + esc(ui('UI-017')) + '</h2>' + steps(['UI-018', 'UI-019', 'UI-020'], 'var(--river)') +
      '<p class="notice">' + esc(ui('UI-021')) + '</p>' +
      '<div class="duo" style="margin-top:20px">' +
      '<a href="#/survey" style="--c:var(--maesil)"><b>' + esc(s('survey')) + '</b><span>' + esc(s('surveyD')) + '</span></a>' +
      '<a href="#/mypoint" style="--c:var(--river)"><b>' + esc(s('mypoint')) + '</b><span>' + esc(s('mypointD')) + '</span></a>' +
      '</div></div>';
  }

  /* ---------- 만족도 조사 (원본 필드명 V_1 ~ V_10, V_phone 유지) ---------- */
  var SURVEY = [
    ['UI-031', 'UI-032', 'UI-033'],
    ['UI-034', 'UI-035', 'UI-040'],
    ['UI-041', 'UI-042', 'UI-051'],
    ['UI-052', 'UI-053', 'UI-056'],
    ['UI-057', 'UI-058', 'UI-060'],
    ['UI-061', 'UI-062', 'UI-066'],
    ['UI-067', 'UI-068', 'UI-071'],
    ['UI-072', 'UI-073', 'UI-077'],
    ['UI-078', 'UI-079', 'UI-083'],
    ['UI-084', 'UI-085', 'UI-089']
  ];
  function uiRange(a, b) {
    var out = [], n = +a.slice(3), m = +b.slice(3);
    for (var i = n; i <= m; i++) out.push('UI-' + ('00' + i).slice(-3));
    return out;
  }
  function renderSurvey() {
    chrome(true, 'survey');
    var qs = SURVEY.map(function (q, qi) {
      var name = 'V_' + (qi + 1);
      var opts = uiRange(q[1], q[2]).map(function (id, oi) {
        return '<label><input type="radio" name="' + name + '" value="' + (oi + 1) + '" id="' + name + '_' + (oi + 1) + '"><span>' + esc(ui(id)) + '</span></label>';
      }).join('');
      return '<fieldset class="q" data-q="' + name + '"><legend>' + esc(ui(q[0])) + '</legend><div class="opts">' + opts + '</div></fieldset>';
    }).join('');
    view.innerHTML =
      '<div class="section"><span class="eyebrow">SURVEY</span><h1 class="page-title">' + esc(s('survey')) + '</h1>' +
      '<p class="lead">' + esc(ui('UI-016').replace(/^\s*\d+\.\s*/, '')) + '</p>' +
      '<form class="form" id="surveyForm" novalidate>' + qs +
      '<div class="q field"><label for="V_phone">' + esc(ui('UI-090')) + '</label><input id="V_phone" name="V_phone" type="tel" inputmode="numeric" autocomplete="tel" placeholder="010-0000-0000"></div>' +
      '<div id="surveyMsg" aria-live="polite"></div>' +
      '<button class="btn" type="submit">' + esc(ui('UI-091')) + '</button></form></div>';

    var form = document.getElementById('surveyForm'), msg = document.getElementById('surveyMsg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var missing = [];
      form.querySelectorAll('fieldset[data-q]').forEach(function (fs) {
        var ok = !!fs.querySelector('input:checked');
        fs.classList.toggle('err', !ok);
        if (!ok) missing.push(fs);
      });
      if (missing.length) { msg.innerHTML = '<p class="msg bad">' + esc(s('needAll')) + '</p>'; missing[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      var phone = form.V_phone.value.replace(/\D/g, '');
      if (phone.length < 10) { msg.innerHTML = '<p class="msg bad">' + esc(s('needPhone')) + '</p>'; form.V_phone.focus(); return; }
      // TODO 서버 연동: 원본 vote.html 은 V_1~V_10, V_phone 과 hidden 필드(booth_idx, vote_mode, V_m_index, index_list)를 POST 함
      msg.innerHTML = '<p class="msg warn">' + esc(s('offline')) + '</p>';
    });
    form.addEventListener('change', function (e) {
      var fs = e.target.closest('fieldset'); if (fs) fs.classList.remove('err');
    });
  }

  /* ---------- 나의 포인트 (원본 필드명 B_name, B_phone 유지) ---------- */
  function renderMyPoint() {
    chrome(true, 'mypoint');
    view.innerHTML =
      '<div class="section"><span class="eyebrow">MY POINTS</span><h1 class="page-title">' + esc(ui('UI-027')) + '</h1>' +
      '<p class="lead">' + esc(s('mypointD')) + '</p>' +
      '<form class="form" id="loginForm" novalidate>' +
      '<div class="field"><label for="B_name">' + esc(ui('UI-028')) + '</label><input id="B_name" name="B_name" autocomplete="name"></div>' +
      '<div class="field"><label for="B_phone">' + esc(ui('UI-029')) + '</label><input id="B_phone" name="B_phone" type="tel" inputmode="numeric" autocomplete="tel" placeholder="010-0000-0000"></div>' +
      '<div class="consent"><b>' + esc(ui('UI-023')) + '</b>' + esc(ui('UI-024')) + '<br>' + esc(ui('UI-025')) + '<br>' + esc(ui('UI-026')) + '</div>' +
      '<div id="loginMsg" aria-live="polite"></div>' +
      '<button class="btn" type="submit">' + esc(ui('UI-022')) + '</button></form></div>';

    var form = document.getElementById('loginForm'), msg = document.getElementById('loginMsg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.B_name.value.trim() || form.B_phone.value.replace(/\D/g, '').length < 10) {
        msg.innerHTML = '<p class="msg bad">' + esc(s('needName')) + '</p>'; return;
      }
      // TODO 서버 연동: 원본 phone_login.html 은 B_name, B_phone, login_type=mylist, send_mode 를 POST 함
      msg.innerHTML = '<p class="msg warn">' + esc(s('offline')) + '</p>';
    });
  }

  function renderNotFound() {
    chrome(true, '');
    view.innerHTML = '<div class="section"><p class="empty">' + esc(s('notFound')) + '</p><a class="btn" href="#/home">' + esc(s('home')) + '</a></div>';
  }

  /* ---------- 라우터 ---------- */
  function route() {
    clearInterval(helloTimer);
    var parts = location.hash.replace(/^#\/?/, '').split('/');
    var page = parts[0];
    if (!page) { renderSelect(); window.scrollTo(0, 0); return; }
    if (!loadLang()) {
      try { sessionStorage.setItem('gy_return', location.hash); } catch (e) {}
      renderSelect(); return;
    }
    if (page === 'home') renderHome();
    else if (page === 'list') renderList(parts[1]);
    else if (page === 'item') renderItem(parts[1], parts[2]);
    else if (page === 'guide') renderGuide();
    else if (page === 'survey') renderSurvey();
    else if (page === 'mypoint') renderMyPoint();
    else renderNotFound();
    window.scrollTo(0, 0);
  }

  document.getElementById('langChip').addEventListener('click', function () {
    try { sessionStorage.setItem('gy_return', location.hash); } catch (e) {}
    location.hash = '#/';
  });
  window.addEventListener('hashchange', route);

  // 시작: ?lang=en 이 있으면 그 언어로 바로 입장 (언어별 QR 코드용)
  var qLang = (location.search.match(/[?&]lang=(ko|en|zh|ja)\b/) || [])[1];
  if (qLang) saveLang(qLang);
  setLang(loadLang() || 'ko');
  if (!location.hash && loadLang()) location.hash = '#/home';
  route();
})();
