
/* GEOData UI: bilingual content, glass detail viewer and typo-tolerant search. */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ADMIN = 'refathany2005@gmail.com';
const COLS = { data: 'projects', courses: 'courses', programs: 'programs', sites: 'sites' };
const LABEL = {
  home:['الرئيسية','Home'], data:['البيانات','Data'], courses:['الدورات','Courses'], programs:['البرامج','Programs'], sites:['أهم المواقع','Top sites'], about:['حول','About'],
  dataD:['شيب فايل وجيوداتابيز وبيانات مكانية لمنطقة دراستك.','Shapefiles, geodatabases and spatial data for your study area.'],
  coursesD:['دورات GIS وجيوماتكس ومصادر للتعلم.','GIS and geomatics courses and learning resources.'],
  programsD:['برامج وأدوات للعمل الجغرافي والاستشعار عن بعد.','Software and tools for GIS and remote sensing.'],
  sitesD:['مواقع ومصادر موثوقة للبيانات الجغرافية.','Trusted websites and sources for geospatial data.'],
  h1:['بتدور على بيانات جغرافية؟ ابدأ من هنا، ومجاني 100%','Looking for geospatial data? Start here, 100% free'],
  lead:['بيانات مكانية ودورات وبرامج ومصادر تحميل في مكان واحد.','Spatial data, courses, software and download sources in one place.'],
  heroPh:['ابحث عن بيانات أو دورة أو برنامج…','Search for data, courses or software…'], sPh:['ابحث داخل القسم…','Search this section…'], search:['بحث','Search'],
  searchTitle:['نتائج البحث','Search results'], searchHint:['نتائج من كل أقسام GEOData','Results from every GEOData section'],
  login:['تسجيل الدخول','Log in'], logout:['خروج','Log out'], register:['حساب جديد','Create account'], go:['متابعة','Continue'],
  add:['إضافة','Add'], publish:['إرسال للمراجعة','Submit for review'], name:['الاسم','Name'], email:['البريد الإلكتروني','Email'], pass:['كلمة المرور','Password'],
  title:['العنوان','Title'], details:['الوصف والتفاصيل','Description and details'], link:['الرابط (https://…)','Resource URL (https://…)'],
  aboutP:['أهلًا بيك في GEOData، مكتبة مفتوحة للبيانات والأدوات والموارد الجغرافية.','Welcome to GEOData, an open library for geospatial data, tools and learning resources.'],
  by:['بواسطة','By'], open:['فتح','Open'], visit:['زيارة المصدر','Visit source'], close:['إغلاق','Close'],
  machine:['ترجمة آلية للمساعدة. قد لا تكون دقيقة 100%؛ راجع المصدر الأصلي.','Machine translation for convenience. It may not be perfect; check the original source.'],
  original:['النص الأصلي','Original text'], empty:['مفيش نتائج مطابقة. جرّب كتابة مختلفة أو راجع الاقتراحات.','No matching results. Try a different spelling or check the suggestions.'],
  loadError:['تعذر تحميل البيانات من قاعدة البيانات. جرّب تحديث الصفحة بعد قليل.','Could not load resources from the database. Please refresh in a moment.'],
  needLogin:['سجّل الدخول الأول عشان تنشر.','Please log in before submitting.'], done:['تم النشر','Published'], welcome:['أهلًا ','Welcome '],
  bad:['البريد الإلكتروني أو كلمة المرور غير صحيحين.','Incorrect email or password.'], needName:['اكتب اسمك الأول.','Please enter your name.'],
  del:['متأكد إنك عايز تمسح؟','Are you sure you want to delete this item?'], fail:['حصلت مشكلة: ','Something went wrong: '],
  admin:['مركز التحكم','Control center'], adminD:['راجع طلبات النشر. مفيش حاجة بتتنشر غير بموافقتك.','Review submissions. Nothing is published without your approval.'],
  notifs:['الإشعارات','Notifications'], noNotifs:['لسه ما قدمتش أي حاجة.','You have not submitted anything yet.'], noPending:['مفيش طلبات في الانتظار.','There are no pending submissions.'],
  pending:['قيد المراجعة','Pending'], approved:['تم القبول','Approved'], rejected:['مرفوض','Rejected'],
  approve:['قبول','Approve'], reject:['رفض','Reject'], reason:['سبب الرفض (اختياري):','Reason for rejection (optional):'],
  sent:['طلبك اتبعت للمراجعة.','Your submission has been sent for review.'],
  noSuggestion:['مفيش اقتراحات مطابقة لسه. جرّب حرف أو كلمتين تانيين.','No close suggestions yet. Try another letter or two.'],
  footer:['© 2026 GEOData — جميع الحقوق محفوظة','© 2026 GEOData — All rights reserved'],
  shapefile:['شيب فايل (Shapefile)','Shapefile'], geodatabase:['قاعدة بيانات جغرافية (Geodatabase)','Geodatabase'], geotiff:['صورة جغرافية (GeoTIFF)','GeoTIFF'], geojson:['GeoJSON / KML','GeoJSON / KML'],
  resultsCount:['نتيجة','results'], format:['نوع المورد','Resource type'], publisher:['الناشر','Publisher'], date:['التاريخ','Date'], source:['المصدر','Source'], license:['الترخيص','License']
};
let lang = 'ar', theme = 'dark', user = null, addTo = 'data', globalQuery = '';
try { lang = localStorage.lang || lang; theme = localStorage.theme || theme; } catch {}
let renderExtra = () => {};
const store = {};
const t = key => (LABEL[key] || [key,key])[lang === 'ar' ? 0 : 1];
const save = (key, value) => { try { localStorage[key] = value; } catch {} };
const admin = () => !!user && (user.email || '').toLowerCase() === ADMIN;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let toastTimer;
const toast = message => { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 3200); };
const authM = $('#authM'), authF = $('#authF'), addM = $('#addM'), addF = $('#addF'), detailM = $('#detailsM');

/* ---------- Language helpers and free machine-translation cache ---------- */
const TRANSLATE_ENDPOINT = 'https://api.mymemory.translated.net/get';
const CACHE_KEY = 'geodata_translation_cache_v2';
let translationCache = {};
let translationQueue = Promise.resolve();
try { translationCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); } catch {}
const isArabic = value => /[\u0600-\u06ff]/.test(String(value || ''));
const sourceLanguage = value => isArabic(value) ? 'ar' : 'en';
const byteLength = value => new TextEncoder().encode(value).length;
function splitForTranslation(value, maxBytes = 420) {
  const words = String(value).match(/\S+\s*/g) || [String(value)];
  const chunks = []; let part = '';
  for (const word of words) {
    if (part && byteLength(part + word) > maxBytes) { chunks.push(part.trim()); part = ''; }
    if (byteLength(word) > maxBytes) {
      let piece = '';
      for (const ch of word) {
        if (piece && byteLength(piece + ch) > maxBytes) { chunks.push(piece); piece = ''; }
        piece += ch;
      }
      part += piece;
    } else part += word;
  }
  if (part.trim()) chunks.push(part.trim());
  return chunks;
}
const cacheId = (target, text) => target + ':' + text;
async function translateText(value, target) {
  const original = String(value ?? '').trim();
  if (!original || target === sourceLanguage(original)) return original;
  const key = cacheId(target, original);
  if (translationCache[key]) return translationCache[key];
  const chunks = splitForTranslation(original);
  const translated = [];
  try {
    for (const chunk of chunks) {
      const params = new URLSearchParams({q:chunk, langpair:sourceLanguage(chunk) + '|' + target, de:ADMIN});
      const request = async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);
        try {
          const response = await fetch(TRANSLATE_ENDPOINT + '?' + params.toString(), {method:'GET', mode:'cors', signal:controller.signal});
          if (!response.ok) throw new Error('Translation service returned ' + response.status);
          return await response.json();
        } finally { clearTimeout(timeout); }
      };
      const pending = translationQueue.then(request,request);
      translationQueue = pending.then(()=>undefined,()=>undefined);
      const body = await pending;
      if (Number(body.responseStatus) !== 200 || !body.responseData?.translatedText) throw new Error(body.responseDetails || 'No translation returned');
      const clean = body.responseData.translatedText.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
      translated.push(clean);
      await new Promise(resolve => setTimeout(resolve, 120));
    }
    const result = translated.join(' ').trim();
    if (!result) return original;
    translationCache[key] = result;
    try {
      const keys = Object.keys(translationCache);
      if (keys.length > 350) keys.slice(0,100).forEach(oldKey=>delete translationCache[oldKey]);
      localStorage.setItem(CACHE_KEY, JSON.stringify(translationCache));
    } catch {}
    return result;
  } catch (error) {
    console.warn('GEOData translation fallback:', error.message);
    return original;
  }
}
function bilingualFields(record) {
  return Promise.all(['title','details','format'].map(async field => {
    const value = String(record[field] || '').trim();
    if (!value) return {};
    const from = sourceLanguage(value), to = from === 'ar' ? 'en' : 'ar';
    const base = {[field + '_' + from]:value};
    const translated = await translateText(value, to);
    if (translated && translated !== value) base[field + '_' + to] = translated;
    return base;
  })).then(parts => Object.assign({}, ...parts));
}
async function localizedField(record, field, target = lang) {
  if (!record) return '';
  const savedValue = record[field + '_' + target];
  if (savedValue) return savedValue;
  const raw = record[field] || '';
  return translateText(raw, target);
}
async function localizeElements(container, record) {
  const target = lang;
  const elements = $$('[data-local-field]', container);
  await Promise.all(elements.map(async element => {
    const value = await localizedField(record, element.dataset.localField, target);
    if (element.isConnected && target === lang) element.textContent = value;
  }));
}
function observeCards(container) {
  const cards = $$('.resource-card', container);
  if (!('IntersectionObserver' in window)) {
    cards.forEach(card => localizeCard(card));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        localizeCard(entry.target);
      }
    });
  }, {rootMargin:'180px 0px'});
  cards.forEach(card => observer.observe(card));
}
async function localizeCard(cardEl) {
  const col = cardEl.dataset.col, id = cardEl.dataset.id;
  const record = (store[col] || []).find(item => item.id === id);
  if (record) await localizeElements(cardEl, record);
}

/* ---------- Arabic-aware, typo-tolerant matching ---------- */
function normalizeSearch(value) {
  return String(value || '').toLowerCase().normalize('NFKD')
    .replace(/[\u064b-\u065f\u0670\u0640]/g,'')
    .replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/[ىئ]/g,'ي').replace(/ؤ/g,'و').replace(/ء/g,'')
    .replace(/[ًٌٍَُِّْٰـ]/g,'').replace(/[\u0300-\u036f]/g,'')
    .replace(/[ـ_.,،؛;:!?؟()[\]{}"'’“”/\\|+-]/g,' ')
    .replace(/\s+/g,' ').trim();
}
function editDistance(a, b, max = 1) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let previous = Array.from({length:b.length + 1}, (_,i)=>i);
  for (let i=1;i<=a.length;i++) {
    const current = [i]; let rowMin = i;
    for (let j=1;j<=b.length;j++) {
      const value = Math.min(current[j-1]+1, previous[j]+1, previous[j-1]+(a[i-1] === b[j-1] ? 0 : 1));
      current[j] = value; rowMin = Math.min(rowMin,value);
    }
    if (rowMin > max) return max + 1;
    previous = current;
  }
  return previous[b.length];
}
function recordText(record) {
  return normalizeSearch([
    record.title, record.details, record.format, record.publisherName, record.sourceName, record.license,
    record.title_ar, record.title_en, record.details_ar, record.details_en, record.format_ar, record.format_en
  ].filter(Boolean).join(' '));
}
function matchScore(record, query) {
  const q = normalizeSearch(query);
  if (!q) return 0;
  const text = recordText(record);
  if (text.includes(q)) return 100 + Math.max(0, 20 - text.indexOf(q));
  const words = text.split(' ');
  const terms = q.split(' ').filter(Boolean);
  let total = 0;
  for (const term of terms) {
    if (words.some(word => word.startsWith(term))) total += 65;
    else if (words.some(word => word.includes(term))) total += 48;
    else if (term.length >= 4 && words.some(word => editDistance(term, word.slice(0, Math.min(word.length, term.length + 1)), 1) <= 1)) total += 25;
    else return 0;
  }
  return total / Math.max(1,terms.length);
}
function allRecords() {
  return Object.entries(COLS).flatMap(([id]) => (store[id] || []).map(record => ({...record, _col:id})));
}
function suggestionMarkup(items) {
  if (!items.length) return '<div class="suggest-empty">' + t('noSuggestion') + '</div>';
  return items.map(item =>
    '<button type="button" class="suggestion" data-suggest-col="' + esc(item._col) + '" data-suggest-id="' + esc(item.id) + '">' +
      '<span class="suggestion-main" data-local-field="title">' + esc(item.title) + '</span>' +
      '<span class="suggestion-category">' + t(item._col) + '</span>' +
    '</button>'
  ).join('');
}
function updateSuggestions(box, query, scope = null) {
  if (!box) return;
  if (!normalizeSearch(query)) { box.hidden = true; box.innerHTML = ''; return; }
  const source = scope ? (store[scope] || []).map(item => ({...item, _col:scope})) : allRecords();
  const matches = source.map(item => ({...item, _score:matchScore(item,query)}))
    .filter(item => item._score > 0).sort((a,b)=>b._score-a._score).slice(0,6);
  box.innerHTML = suggestionMarkup(matches);
  box.hidden = false;
  matches.forEach(item => {
    const suggestion = $('.suggestion[data-suggest-id="' + CSS.escape(item.id) + '"]', box);
    if (suggestion) localizeElements(suggestion,item);
  });
}

/* ---------- Page templates and card rendering ---------- */
$$('.coll').forEach(section => {
  section.innerHTML =
    '<div class="phead"><h2 data-i="' + section.id + '"></h2><p data-i="' + section.id + 'D"></p>' +
    '<div class="tools"><div class="search-wrap"><input class="q" type="search" data-ph="sPh" autocomplete="off" aria-label="' + t('sPh') + '">' +
    '<div class="search-suggestions" hidden></div></div><button class="btn" data-add="' + section.id + '" data-i="add"></button></div></div><div class="grid"></div>';
  const input = $('.q', section);
  input.addEventListener('input', () => {
    draw(section.id);
    updateSuggestions($('.search-suggestions',section),input.value,section.id);
  });
  input.addEventListener('focus', () => updateSuggestions($('.search-suggestions',section),input.value,section.id));
});
function card(record, col, showCategory = false) {
  const categoryTag = showCategory ? '<span class="tag category-tag">' + t(col) + '</span>' : '';
  const formatTag = record.format ? '<span class="tag" data-local-field="format">' + esc(record.format) + '</span>' : '';
  const del = admin() ? '<button class="del" data-del="' + esc(col) + '|' + esc(record.id) + '" aria-label="Delete">✕</button>' : '';
  const detailButton = record.link && /^https?:\/\//i.test(record.link) ?
    '<button type="button" class="btn sm" data-detail-col="' + esc(col) + '" data-detail-id="' + esc(record.id) + '">' + t('open') + '</button>' : '';
  return '<article class="card resource-card" data-col="' + esc(col) + '" data-id="' + esc(record.id) + '">' +
    del + categoryTag + formatTag + '<h3 data-local-field="title">' + esc(record.title) + '</h3>' +
    (record.date ? '<small>' + esc(record.date) + '</small>' : '') +
    '<p data-local-field="details">' + esc(record.details || '') + '</p>' +
    '<div class="foot"><small>' + t('by') + ': ' + esc(record.publisherName || '—') + '</small>' + detailButton + '</div></article>';
}
function draw(col) {
  const container = $('.grid', $('#' + col));
  if (!container) return;
  const query = $('.q', $('#' + col))?.value.trim() || '';
  const list = (store[col] || []).map(record => ({record,score:query ? matchScore(record,query) : 0}))
    .filter(item => !query || item.score > 0)
    .sort((a,b)=>b.score-a.score).map(item=>item.record);
  container.innerHTML = list.length ? list.map(record => card(record,col)).join('') : '<p class="empty">' + t('empty') + '</p>';
  observeCards(container);
}
function drawSearch() {
  const container = $('#globalResults');
  if (!container) return;
  const results = allRecords().map(item=>({...item,_score:matchScore(item,globalQuery)}))
    .filter(item=>item._score>0).sort((a,b)=>b._score-a._score);
  $('#searchSummary').textContent = results.length + ' ' + t('resultsCount');
  container.innerHTML = results.length ? results.map(item=>card(item,item._col,true)).join('') : '<p class="empty">' + t('empty') + '</p>';
  observeCards(container);
}
const drawAll = () => { Object.keys(COLS).forEach(draw); if (location.hash === '#search') drawSearch(); };

const SVG = path => '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + path + '</svg>';
const SUN = SVG('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>');
const MOON = SVG('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>');
function applyTheme() { document.body.dataset.theme = theme; $('#theme').innerHTML = theme === 'dark' ? SUN : MOON; }
let currentDetail = null;
function applyLang() {
  const root = document.documentElement;
  root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.body.className = 'lang-' + lang + ' ready';
  $$('[data-i]').forEach(el => el.textContent = t(el.dataset.i));
  $('[data-ph]').forEach(el => { el.placeholder = t(el.dataset.ph); });
  const metaDescription = $('meta[name="description"]');
  if(metaDescription) metaDescription.content = lang === 'ar' ? 'GEOData: مكتبة مجانية للبيانات الجغرافية والدورات والبرامج ومصادر الاستشعار عن بعد.' : 'GEOData: free geospatial data, GIS courses, software and remote-sensing resources.';
  document.title = 'GEOData | AM Geomatics';
  $('#lang').textContent = lang === 'ar' ? 'EN' : 'ع';
  $$('input[aria-label]').forEach(el=>{ if(el.classList.contains('q')) el.setAttribute('aria-label',t('sPh')); });
  drawAll(); renderExtra();
  if (detailM?.open && currentDetail) openDetail(currentDetail.col,currentDetail.id);
}
$('#theme').onclick = () => { theme = theme === 'dark' ? 'light' : 'dark'; save('theme',theme); applyTheme(); };
$('#lang').onclick = () => { lang = lang === 'ar' ? 'en' : 'ar'; save('lang',lang); applyLang(); };
$('#burger').onclick = () => $('#links').classList.toggle('show');

function route() {
  const id = location.hash.slice(1), el = id && document.getElementById(id);
  let page = el && el.classList.contains('page') ? id : 'home';
  if (page === 'admin' && !admin()) page = 'home';
  $$('.page').forEach(section => section.classList.toggle('on',section.id === page));
  $$('#links a').forEach(anchor => anchor.classList.toggle('on',anchor.hash === '#' + page));
  $('#links').classList.remove('show'); scrollTo(0,0);
  if (page === 'search') drawSearch();
}
addEventListener('hashchange',route);

$('#heroSearch').addEventListener('submit',event=>{
  event.preventDefault();
  globalQuery = event.currentTarget.q.value.trim();
  $('#heroSuggestions').hidden = true;
  location.hash = '#search'; drawSearch();
});
const heroInput = $('#heroSearch input[name="q"]');
heroInput.addEventListener('input',()=>updateSuggestions($('#heroSuggestions'),heroInput.value));
heroInput.addEventListener('focus',()=>updateSuggestions($('#heroSuggestions'),heroInput.value));
document.addEventListener('click',event=>{
  if (!event.target.closest('.search-wrap') && !event.target.closest('#heroSearch') && !event.target.closest('#heroSuggestions')) {
    $$('.search-suggestions').forEach(box=>box.hidden=true);
    $('#heroSuggestions').hidden=true;
  }
});
$$('.tabs button').forEach(button=>button.onclick=()=>{
  authF.dataset.mode=button.dataset.mode;
  $$('.tabs button').forEach(item=>item.classList.toggle('on',item===button));
});
[authM,addM,$('#notifM'),detailM].filter(Boolean).forEach(dialog=>dialog.addEventListener('click',event=>{
  const rect=dialog.getBoundingClientRect();
  if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom) dialog.close();
}));
document.addEventListener('click',event=>{
  const addButton=event.target.closest('[data-add]');
  if(!addButton)return;
  if(!user){toast(t('needLogin'));authM.showModal();return;}
  addTo=addButton.dataset.add; addF.dataset.kind=addTo;
  $('#addT').textContent=t('add')+': '+t(addTo); addM.showModal();
});
const paintUser=()=>{
  $('#login').hidden=!!user; $('#user').hidden=!user; $('#bell').hidden=!user||admin(); $('#adminLink').hidden=!admin();
  if(user)$('#uname').textContent=user.displayName||user.email.split('@')[0];
};

let detailToken=0;
async function openDetail(col,id) {
  currentDetail = {col,id};
  const record=(store[col]||[]).find(item=>item.id===id);
  if(!record)return;
  detailToken++;
  const token=detailToken;
  $('#detailCategory').textContent=t(col);
  $('#detailFormat').textContent=record.format||'';
  $('#detailPublisher').textContent=record.publisherName||'—';
  $('#detailDate').textContent=record.date||'';
  $('#detailTitle').textContent=record.title||'';
  $('#detailDescription').textContent=record.details||'';
  $('#detailSource').textContent=record.sourceName||record.publisherName||'—';
  $('#detailLicense').textContent=record.license||'';
  const safeLink=record.link&&(record.link.startsWith('https://')||record.link.startsWith('http://'))?record.link:'#';
  $('#detailVisit').href=safeLink;
  $('#detailVisit').hidden=!(record.link&&/^https?:\/\//i.test(record.link));
  $('#detailMachine').textContent=t('machine');
  if(!detailM.open)detailM.showModal();
  const target=lang;
  const fields=['title','details','format','license'];
  const values=await Promise.all(fields.map(field=>localizedField(record,field,target)));
  if(token!==detailToken||!detailM.open||target!==lang)return;
  $('#detailTitle').textContent=values[0];
  $('#detailDescription').textContent=values[1];
  if(values[2])$('#detailFormat').textContent=values[2];
  if(values[3])$('#detailLicense').textContent=values[3];
}
document.addEventListener('click',event=>{
  const button=event.target.closest('[data-detail-col]');
  if(button)openDetail(button.dataset.detailCol,button.dataset.detailId);
  const suggestion=event.target.closest('[data-suggest-col]');
  if(suggestion){ $('.search-suggestions').forEach(box=>box.hidden=true); openDetail(suggestion.dataset.suggestCol,suggestion.dataset.suggestId); }
});

/* Translate a submission before it is saved; original text is always retained. */
async function prepareBilingual(record) {
  const bilingual=await bilingualFields(record);
  return {...record,...bilingual,translationProvider:'MyMemory'};
}
applyTheme(); applyLang(); route();

/* ---------- Firebase ---------- */
const FirebaseURL='https://www.gstatic.com/firebasejs/10.12.0/';
const [{initializeApp},{getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,signOut,updateProfile},{getFirestore,collection,addDoc,onSnapshot,deleteDoc,doc,serverTimestamp,query,where,updateDoc}] =
  await Promise.all([import(FirebaseURL+'firebase-app.js'),import(FirebaseURL+'firebase-auth.js'),import(FirebaseURL+'firebase-firestore.js')]);
const firebaseApp=initializeApp({
  apiKey:'AIzaSyCmGYoMqvaTDafiHb7q9Vk7vE4n1w2tWBI',authDomain:'am-a-geo.firebaseapp.com',projectId:'am-a-geo',
  storageBucket:'am-a-geo.firebasestorage.app',messagingSenderId:'724200458201',appId:'1:724200458201:web:14f851dbaf89d49170bbc8'
});
const auth=getAuth(firebaseApp),db=getFirestore(firebaseApp);
let submissions=[],unsubscribers=[];
const seenKey=item=>'seen_'+item.id+'_'+item.status;
const readLocal=key=>{try{return localStorage[key];}catch{}};
renderExtra=()=>{
  $('#notifL').innerHTML=submissions.length?submissions.map(item=>
    '<div class="nitem"><div><b>'+(lang==='ar'?esc(item.title_ar||item.title):esc(item.title_en||item.title))+'</b><small>'+t(item.col)+(item.note?' | '+esc(item.note):'')+'</small></div><span class="st '+item.status+'">'+t(item.status)+'</span></div>'
  ).join(''):'<p class="empty">'+t('noNotifs')+'</p>';
  $('#dot').hidden=!submissions.some(item=>item.status!=='pending'&&!readLocal(seenKey(item)));
  $('#pc').textContent=admin()&&submissions.length?submissions.length:'';
  $('#adminList').innerHTML=submissions.length?submissions.map(item=>
    '<article class="card review-card" data-subid="'+esc(item.id)+'"><span class="tag">'+t(item.col)+'</span>' +
    '<h3 data-local-field="title">'+esc(item.title)+'</h3><p data-local-field="details">'+esc(item.details||'')+'</p>' +
    '<small>'+t('by')+': '+esc(item.publisherName)+' ('+esc(item.publisherEmail)+')</small>' +
    '<a class="lnk" href="'+esc(item.link)+'" target="_blank" rel="noopener">'+esc(item.link)+'</a>' +
    '<div class="foot"><button class="btn sm" data-ok="'+esc(item.id)+'">'+t('approve')+'</button><button class="btn sm ghost" data-no="'+esc(item.id)+'">'+t('reject')+'</button></div></article>'
  ).join(''):'<p class="empty">'+t('noPending')+'</p>';
  $$('.review-card').forEach(cardEl=>{const item=submissions.find(x=>x.id===cardEl.dataset.subid);if(item)localizeElements(cardEl,item);});
};
onAuthStateChanged(auth,currentUser=>{
  user=currentUser;paintUser();drawAll();if(user&&authM.open)authM.close();
  unsubscribers.forEach(unsubscribe=>unsubscribe());unsubscribers=[];submissions=[];renderExtra();
  if(user){
    const request=admin()?query(collection(db,'submissions'),where('status','==','pending')):query(collection(db,'submissions'),where('uid','==',user.uid));
    unsubscribers.push(onSnapshot(request,snapshot=>{
      submissions=snapshot.docs.map(item=>({id:item.id,...item.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
      renderExtra();
    },error=>console.error('Submission listener:',error)));
  }
  if(location.hash==='#admin')route();
});
$('#bell').onclick=()=>{$('#notifM').showModal();submissions.forEach(item=>item.status!=='pending'&&save(seenKey(item),1));renderExtra();};
Object.entries(COLS).forEach(([section,collectionName])=>onSnapshot(collection(db,collectionName),snapshot=>{
  store[section]=snapshot.docs.map(item=>({id:item.id,...item.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
  draw(section);if(location.hash==='#search')drawSearch();
},error=>{
  console.error('Public collection listener:',collectionName,error);
  const grid = $('.grid', $('#' + section));
  if (grid && !(store[section] || []).length) {
    grid.innerHTML = '<p class="empty" role="status">' + t('loadError') + '</p>';
  }
}));
authF.onsubmit=async event=>{
  event.preventDefault();
  const form=new FormData(authF),register=authF.dataset.mode==='reg',name=(form.get('name')||'').trim();
  if(register&&!name)return toast(t('needName'));
  try{
    if(register){const credential=await createUserWithEmailAndPassword(auth,form.get('email'),form.get('pass'));await updateProfile(credential.user,{displayName:name});user=auth.currentUser;paintUser();toast(t('welcome')+name);}
    else await signInWithEmailAndPassword(auth,form.get('email'),form.get('pass'));
    authM.close();authF.reset();
  }catch(error){toast(register?t('fail')+error.message:t('bad'));}
};
$('#logout').onclick=()=>signOut(auth);
addF.onsubmit=async event=>{
  event.preventDefault();
  const values=Object.fromEntries(new FormData(addF));
  const record={
    title:values.title.trim(),details:values.details.trim(),link:values.link.trim(),
    publisherName:user.displayName||user.email.split('@')[0],publisherEmail:user.email,createdAt:serverTimestamp()
  };
  if(addTo==='data'){record.format=values.format;record.date=values.date;}
  const submitButton=$('button[type="submit"]',addF)||$('button.btn',addF);
  submitButton.disabled=true;submitButton.textContent=lang==='ar'?'جارٍ الترجمة والإرسال…':'Translating and submitting…';
  try{
    const localized=await prepareBilingual(record);
    if(admin())await addDoc(collection(db,COLS[addTo]),localized);
    else await addDoc(collection(db,'submissions'),{...localized,col:addTo,uid:user.uid,status:'pending'});
    addM.close();addF.reset();toast(t(admin()?'done':'sent'));
  }catch(error){toast(t('fail')+error.message);}
  finally{submitButton.disabled=false;submitButton.textContent=t('publish');}
};
document.addEventListener('click',async event=>{
  const button=event.target.closest('[data-del]');
  if(!button||!admin()||!confirm(t('del')))return;
  const [section,id]=button.dataset.del.split('|');
  try{await deleteDoc(doc(db,COLS[section],id));}catch(error){toast(t('fail')+error.message);}
});
document.addEventListener('click',async event=>{
  const approve=event.target.closest('[data-ok]'),reject=event.target.closest('[data-no]');
  if(!(approve||reject)||!admin())return;
  const item=submissions.find(record=>record.id===(approve||reject).dataset[approve?'ok':'no']);
  if(!item)return;
  try{
    if(approve){
      const published={
        title:item.title,details:item.details,link:item.link,publisherName:item.publisherName,publisherEmail:item.publisherEmail,
        title_ar:item.title_ar||'',title_en:item.title_en||'',details_ar:item.details_ar||'',details_en:item.details_en||'',
        format_ar:item.format_ar||'',format_en:item.format_en||'',translationProvider:item.translationProvider||'MyMemory',
        createdAt:serverTimestamp()
      };
      if(item.col==='data'){published.format=item.format;published.date=item.date;}
      await addDoc(collection(db,COLS[item.col]),published);
      await updateDoc(doc(db,'submissions',item.id),{status:'approved'});
    }else{
      const note=prompt(t('reason'));if(note===null)return;
      await updateDoc(doc(db,'submissions',item.id),{status:'rejected',note:note.trim()});
    }
  }catch(error){toast(t('fail')+error.message);}
});
