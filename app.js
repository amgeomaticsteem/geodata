/* ---------- UI (runs first, so the site works even if Firebase is slow) ---------- */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ADMIN = 'refathany2005@gmail.com';
const COLS = { data: 'projects', courses: 'courses', programs: 'programs', sites: 'sites' };

const I = {
  home: ['الرئيسية', 'Home'], data: ['البيانات', 'Data'], courses: ['الدورات', 'Courses'], programs: ['البرامج', 'Programs'], sites: ['أهم المواقع', 'Top sites'], about: ['حول', 'About'],
  dataD: ['شيب فايل وجيوداتابيز لمنطقة دراستك.', 'Shapefiles and geodatabases for your study area.'],
  coursesD: ['دورات GIS وجيوماتكس مختارة.', 'Hand-picked GIS and geomatics courses.'],
  programsD: ['برامج ونسخ وأدوات للعمل المساحي.', 'Software and tools for spatial work.'],
  sitesD: ['مواقع تحميل الداتا اللي بنثق فيها.', 'The data sources we trust.'],
  h1: ['بتدور على شيب فايل لمنطقة دراستك؟ ابدأ من هنا، ومجاني 100%', 'Need a shapefile for your study area? Start here, 100% free'],
  lead: ['بيانات مكانية ودورات وبرامج ومصادر تحميل في مكان واحد.', 'Spatial data, courses, programs and download sources in one place.'],
  heroPh: ['مثال: حدود محافظات مصر', 'Example: Egypt governorate boundaries'], sPh: ['ابحث في الصفحة', 'Search this page'], search: ['بحث', 'Search'],
  login: ['تسجيل الدخول', 'Log in'], logout: ['خروج', 'Log out'], register: ['حساب جديد', 'Sign up'], go: ['متابعة', 'Continue'],
  add: ['إضافة', 'Add'], publish: ['إرسال للمراجعة', 'Submit for review'],
  name: ['الاسم', 'Name'], email: ['الإيميل', 'Email'], pass: ['الباسورد', 'Password'], title: ['العنوان', 'Title'], details: ['التفاصيل', 'Details'], link: ['الرابط (https://…)', 'Link (https://…)'],
  aboutP: ['السلام عليكم، أنا الطالب رِفْعَت هانئ محمد من قسم جيوماتكس القاهرة.', "Hello, I'm Refaat Hany Mohamed, a student in the Geomatics department in Cairo."],
  by: ['الناشر', 'By'], open: ['فتح الرابط', 'Open link'],
  empty: ['مفيش نتائج. جرّب كلمة تانية أو أضف أول عنصر.', 'No results. Try another word, or add the first item.'],
  needLogin: ['سجّل الدخول الأول عشان تنشر.', 'Log in to publish.'], done: ['تم النشر', 'Published'], welcome: ['أهلاً ', 'Welcome '],
  bad: ['الإيميل أو الباسورد غلط.', 'Wrong email or password.'], needName: ['اكتب اسمك الأول.', 'Enter your name first.'],
  del: ['متأكد إنك عايز تمسح؟', 'Delete this item?'], fail: ['حصلت مشكلة: ', 'Something went wrong: '],
  admin: ['مركز التحكم', 'Control center'], adminD: ['راجع الطلبات. مفيش حاجة بتتنشر غير بموافقتك.', 'Review submissions. Nothing goes live without your approval.'],
  notifs: ['الإشعارات', 'Notifications'], noNotifs: ['لسه ما نشرتش حاجة.', "You haven't submitted anything yet."], noPending: ['مفيش طلبات في الانتظار.', 'No pending submissions.'],
  pending: ['قيد المراجعة', 'Pending'], approved: ['تم القبول', 'Approved'], rejected: ['مرفوض', 'Rejected'],
  approve: ['قبول', 'Approve'], reject: ['رفض', 'Reject'], reason: ['سبب الرفض (اختياري):', 'Reason for rejecting (optional):'],
  sent: ['اتبعت للمراجعة. هتوصلك إشعار بالنتيجة.', "Sent for review. You'll be notified of the result."]
};
let lang = 'ar', theme = 'dark', user = null, addTo = 'data';
try { lang = localStorage.lang || lang; theme = localStorage.theme || theme; } catch {}
let renderExtra = () => {}; const store = {}, t = k => I[k][lang === 'ar' ? 0 : 1];
const save = (k, v) => { try { localStorage[k] = v; } catch {} };
const admin = () => !!user && (user.email || '').toLowerCase() === ADMIN;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let tt; const toast = m => { const e = $('#toast'); e.textContent = m; e.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => e.classList.remove('show'), 3200); };
const authM = $('#authM'), authF = $('#authF'), addM = $('#addM'), addF = $('#addF');

// collection pages are built from one template
$$('.coll').forEach(s => {
  s.innerHTML = `<div class="phead"><h2 data-i="${s.id}"></h2><p data-i="${s.id}D"></p><div class="tools"><input class="q" type="search" data-ph="sPh"><button class="btn" data-add="${s.id}" data-i="add"></button></div></div><div class="grid"></div>`;
  $('.q', s).oninput = () => draw(s.id);
});

const card = (d, id) => `<article class="card">${admin() ? `<button class="del" data-del="${id}|${d.id}" aria-label="Delete">✕</button>` : ''}${d.format ? `<span class="tag">${esc(d.format)}</span>` : ''}<h3>${esc(d.title)}</h3>${d.date ? `<small>${esc(d.date)}</small>` : ''}<p>${esc(d.details)}</p><div class="foot"><small>${t('by')}: ${esc(d.publisherName || '—')}</small>${/^https?:\/\//i.test(d.link) ? `<a class="btn sm" href="${esc(d.link)}" target="_blank" rel="noopener">${t('open')}</a>` : ''}</div></article>`;

function draw(id) {
  const g = $('.grid', $('#' + id)); if (!store[id]) return g.innerHTML = '';
  const q = $('.q', $('#' + id)).value.trim().toLowerCase();
  const list = store[id].filter(d => [d.title, d.details, d.format, d.publisherName].join(' ').toLowerCase().includes(q));
  g.innerHTML = list.length ? list.map(d => card(d, id)).join('') : `<p class="empty">${t('empty')}</p>`;
}
const drawAll = () => Object.keys(COLS).forEach(draw);

const SVG = p => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const SUN = SVG('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'), MOON = SVG('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>');
function applyTheme() { document.body.dataset.theme = theme; $('#theme').innerHTML = theme === 'dark' ? SUN : MOON; }
function applyLang() {
  const H = document.documentElement; H.lang = lang; H.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.body.className = 'lang-' + lang + ' ready';
  $$('[data-i]').forEach(e => e.innerHTML = t(e.dataset.i));
  $$('[data-ph]').forEach(e => e.placeholder = t(e.dataset.ph));
  $('#lang').textContent = lang === 'ar' ? 'EN' : 'ع'; drawAll(); renderExtra();
}
$('#theme').onclick = () => { theme = theme === 'dark' ? 'light' : 'dark'; save('theme', theme); applyTheme(); };
$('#lang').onclick = () => { lang = lang === 'ar' ? 'en' : 'ar'; save('lang', lang); applyLang(); };
$('#burger').onclick = () => $('#links').classList.toggle('show');

function route() {
  const id = location.hash.slice(1), el = id && document.getElementById(id);
  let p = el && el.classList.contains('page') ? id : 'home'; if (p === 'admin' && !admin()) p = 'home';
  $$('.page').forEach(s => s.classList.toggle('on', s.id === p));
  $$('#links a').forEach(a => a.classList.toggle('on', a.hash === '#' + p));
  $('#links').classList.remove('show'); scrollTo(0, 0);
}
addEventListener('hashchange', route);

$('#heroSearch').onsubmit = e => { e.preventDefault(); $('#data .q').value = e.target.q.value; location.hash = '#data'; draw('data'); };
$('#login').onclick = () => authM.showModal();
$$('.tabs button').forEach(b => b.onclick = () => { authF.dataset.mode = b.dataset.mode; $$('.tabs button').forEach(x => x.classList.toggle('on', x === b)); });
[authM, addM, $('#notifM')].forEach(d => d.addEventListener('click', e => { const r = d.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close(); }));
document.addEventListener('click', e => {
  const a = e.target.closest('[data-add]'); if (!a) return;
  if (!user) { toast(t('needLogin')); return authM.showModal(); }
  addTo = a.dataset.add; addF.dataset.kind = addTo; $('#addT').textContent = t('add') + ': ' + t(addTo); addM.showModal();
});
const paintUser = () => { $('#login').hidden = !!user; $('#user').hidden = !user; $('#bell').hidden = !user || admin(); $('#adminLink').hidden = !admin(); if (user) $('#uname').textContent = user.displayName || user.email.split('@')[0]; };

applyTheme(); applyLang(); route();

/* ---------- Firebase ---------- */
const G = 'https://www.gstatic.com/firebasejs/10.12.0/';
const [{ initializeApp }, { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile }, { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp, query, where, updateDoc }] =
  await Promise.all([import(G + 'firebase-app.js'), import(G + 'firebase-auth.js'), import(G + 'firebase-firestore.js')]);

const fb = initializeApp({
  apiKey: "AIzaSyCmGYoMqvaTDafiHb7q9Vk7vE4n1w2tWBI", authDomain: "am-a-geo.firebaseapp.com", projectId: "am-a-geo",
  storageBucket: "am-a-geo.firebasestorage.app", messagingSenderId: "724200458201", appId: "1:724200458201:web:14f851dbaf89d49170bbc8"
});
const auth = getAuth(fb), db = getFirestore(fb);

let subs = [], unsubs = [];
const seenK = s => `seen_${s.id}_${s.status}`, getL = k => { try { return localStorage[k]; } catch {} };
const safeUrl = u => /^https?:\/\//i.test(u) ? esc(u) : '#';
renderExtra = () => {
  $('#notifL').innerHTML = subs.length ? subs.map(s => `<div class="nitem"><div><b>${esc(s.title)}</b><small>${t(s.col)}${s.note ? ' | ' + esc(s.note) : ''}</small></div><span class="st ${s.status}">${t(s.status)}</span></div>`).join('') : `<p class="empty">${t('noNotifs')}</p>`;
  $('#dot').hidden = !subs.some(s => s.status !== 'pending' && !getL(seenK(s)));
  $('#pc').textContent = admin() && subs.length ? subs.length : '';
  $('#adminList').innerHTML = subs.length ? subs.map(s => `<article class="card"><span class="tag">${t(s.col)}${s.format ? ' / ' + esc(s.format) : ''}</span><h3>${esc(s.title)}</h3><p>${esc(s.details)}</p><small>${t('by')}: ${esc(s.publisherName)} (${esc(s.publisherEmail)})</small><a class="lnk" href="${safeUrl(s.link)}" target="_blank" rel="noopener">${esc(s.link)}</a><div class="foot"><button class="btn sm" data-ok="${s.id}">${t('approve')}</button><button class="btn sm ghost" data-no="${s.id}">${t('reject')}</button></div></article>`).join('') : `<p class="empty">${t('noPending')}</p>`;
};

onAuthStateChanged(auth, u => {
  user = u; paintUser(); drawAll(); if (u && authM.open) authM.close();
  unsubs.forEach(f => f()); unsubs = []; subs = []; renderExtra();
  if (u) {
    // the admin sees every pending submission; a normal user sees only their own
    const q = admin() ? query(collection(db, 'submissions'), where('status', '==', 'pending')) : query(collection(db, 'submissions'), where('uid', '==', u.uid));
    unsubs.push(onSnapshot(q, s => { subs = s.docs.map(x => ({ id: x.id, ...x.data() })).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)); renderExtra(); }, err => console.error(err)));
  }
  if (location.hash === '#admin') route();
});

$('#bell').onclick = () => { $('#notifM').showModal(); subs.forEach(s => s.status !== 'pending' && save(seenK(s), 1)); renderExtra(); };

Object.entries(COLS).forEach(([id, col]) => onSnapshot(collection(db, col), s => {
  store[id] = s.docs.map(x => ({ id: x.id, ...x.data() })).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  draw(id);
}, err => console.error(col, err)));

authF.onsubmit = async e => {
  e.preventDefault();
  const f = new FormData(authF), reg = authF.dataset.mode === 'reg', name = (f.get('name') || '').trim();
  if (reg && !name) return toast(t('needName'));
  try {
    if (reg) {
      const c = await createUserWithEmailAndPassword(auth, f.get('email'), f.get('pass'));
      await updateProfile(c.user, { displayName: name }); user = auth.currentUser; paintUser(); toast(t('welcome') + name);
    } else await signInWithEmailAndPassword(auth, f.get('email'), f.get('pass'));
    authM.close(); authF.reset();
  } catch (err) { toast(reg ? t('fail') + err.message : t('bad')); }
};
$('#logout').onclick = () => signOut(auth);

addF.onsubmit = async e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(addF));
  const rec = { title: f.title.trim(), details: f.details.trim(), link: f.link.trim(), publisherName: user.displayName || user.email.split('@')[0], publisherEmail: user.email, createdAt: serverTimestamp() };
  if (addTo === 'data') { rec.format = f.format; rec.date = f.date; }
  try {
    if (admin()) await addDoc(collection(db, COLS[addTo]), rec);
    else await addDoc(collection(db, 'submissions'), { ...rec, col: addTo, uid: user.uid, status: 'pending' });
    addM.close(); addF.reset(); toast(t(admin() ? 'done' : 'sent'));
  }
  catch (err) { toast(t('fail') + err.message); }
};

document.addEventListener('click', async e => {
  const b = e.target.closest('[data-del]'); if (!b || !admin() || !confirm(t('del'))) return;
  const [col, id] = b.dataset.del.split('|');
  try { await deleteDoc(doc(db, COLS[col], id)); } catch (err) { toast(t('fail') + err.message); }
});

document.addEventListener('click', async e => {
  const ok = e.target.closest('[data-ok]'), no = e.target.closest('[data-no]'); if (!(ok || no) || !admin()) return;
  const s = subs.find(x => x.id === (ok || no).dataset[ok ? 'ok' : 'no']); if (!s) return;
  try {
    if (ok) {
      const pub = { title: s.title, details: s.details, link: s.link, publisherName: s.publisherName, publisherEmail: s.publisherEmail, createdAt: serverTimestamp() };
      if (s.col === 'data') { pub.format = s.format; pub.date = s.date; }
      await addDoc(collection(db, COLS[s.col]), pub); await updateDoc(doc(db, 'submissions', s.id), { status: 'approved' });
    } else {
      const note = prompt(t('reason')); if (note === null) return;
      await updateDoc(doc(db, 'submissions', s.id), { status: 'rejected', note: note.trim() });
    }
  } catch (err) { toast(t('fail') + err.message); }
});
