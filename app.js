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
  add: ['إضافة', 'Add'], publish: ['نشر', 'Publish'],
  name: ['الاسم', 'Name'], email: ['الإيميل', 'Email'], pass: ['الباسورد', 'Password'], title: ['العنوان', 'Title'], details: ['التفاصيل', 'Details'], link: ['الرابط (https://…)', 'Link (https://…)'],
  aboutP: ['السلام عليكم، أنا الطالب رِفْعَت هانئ محمد من قسم جيوماتكس القاهرة.', "Hello, I'm Refaat Hany Mohamed, a student in the Geomatics department in Cairo."],
  by: ['الناشر', 'By'], open: ['فتح الرابط', 'Open link'],
  empty: ['مفيش نتائج. جرّب كلمة تانية أو أضف أول عنصر.', 'No results. Try another word, or add the first item.'],
  needLogin: ['سجّل الدخول الأول عشان تنشر.', 'Log in to publish.'], done: ['تم النشر', 'Published'], welcome: ['أهلاً ', 'Welcome '],
  bad: ['الإيميل أو الباسورد غلط.', 'Wrong email or password.'], needName: ['اكتب اسمك الأول.', 'Enter your name first.'],
  del: ['متأكد إنك عايز تمسح؟', 'Delete this item?'], fail: ['حصلت مشكلة: ', 'Something went wrong: ']
};
let lang = 'ar', theme = 'dark', user = null, addTo = 'data';
try { lang = localStorage.lang || lang; theme = localStorage.theme || theme; } catch {}
const store = {}, t = k => I[k][lang === 'ar' ? 0 : 1];
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

function applyTheme() { document.body.dataset.theme = theme; $('#theme').textContent = theme === 'dark' ? '☀' : '☾'; }
function applyLang() {
  const H = document.documentElement; H.lang = lang; H.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.body.className = 'lang-' + lang + ' ready';
  $$('[data-i]').forEach(e => e.innerHTML = t(e.dataset.i));
  $$('[data-ph]').forEach(e => e.placeholder = t(e.dataset.ph));
  $('#lang').textContent = lang === 'ar' ? 'EN' : 'ع'; drawAll();
}
$('#theme').onclick = () => { theme = theme === 'dark' ? 'light' : 'dark'; save('theme', theme); applyTheme(); };
$('#lang').onclick = () => { lang = lang === 'ar' ? 'en' : 'ar'; save('lang', lang); applyLang(); };
$('#burger').onclick = () => $('#links').classList.toggle('show');

function route() {
  const id = location.hash.slice(1), el = id && document.getElementById(id);
  const p = el && el.classList.contains('page') ? id : 'home';
  $$('.page').forEach(s => s.classList.toggle('on', s.id === p));
  $$('#links a').forEach(a => a.classList.toggle('on', a.hash === '#' + p));
  $('#links').classList.remove('show'); scrollTo(0, 0);
}
addEventListener('hashchange', route);

$('#heroSearch').onsubmit = e => { e.preventDefault(); $('#data .q').value = e.target.q.value; location.hash = '#data'; draw('data'); };
$('#login').onclick = () => authM.showModal();
$$('.tabs button').forEach(b => b.onclick = () => { authF.dataset.mode = b.dataset.mode; $$('.tabs button').forEach(x => x.classList.toggle('on', x === b)); });
[authM, addM].forEach(d => d.addEventListener('click', e => { const r = d.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close(); }));
document.addEventListener('click', e => {
  const a = e.target.closest('[data-add]'); if (!a) return;
  if (!user) { toast(t('needLogin')); return authM.showModal(); }
  addTo = a.dataset.add; addF.dataset.kind = addTo; $('#addT').textContent = t('add') + ': ' + t(addTo); addM.showModal();
});
const paintUser = () => { $('#login').hidden = !!user; $('#user').hidden = !user; if (user) $('#uname').textContent = user.displayName || user.email.split('@')[0]; };

applyTheme(); applyLang(); route();

/* ---------- Firebase ---------- */
const G = 'https://www.gstatic.com/firebasejs/10.12.0/';
const [{ initializeApp }, { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile }, { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp }] =
  await Promise.all([import(G + 'firebase-app.js'), import(G + 'firebase-auth.js'), import(G + 'firebase-firestore.js')]);

const fb = initializeApp({
  apiKey: "AIzaSyCmGYoMqvaTDafiHb7q9Vk7vE4n1w2tWBI", authDomain: "am-a-geo.firebaseapp.com", projectId: "am-a-geo",
  storageBucket: "am-a-geo.firebasestorage.app", messagingSenderId: "724200458201", appId: "1:724200458201:web:14f851dbaf89d49170bbc8"
});
const auth = getAuth(fb), db = getFirestore(fb);

onAuthStateChanged(auth, u => { user = u; paintUser(); drawAll(); if (u && authM.open) authM.close(); });

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
  try { await addDoc(collection(db, COLS[addTo]), rec); addM.close(); addF.reset(); toast(t('done')); }
  catch (err) { toast(t('fail') + err.message); }
};

document.addEventListener('click', async e => {
  const b = e.target.closest('[data-del]'); if (!b || !admin() || !confirm(t('del'))) return;
  const [col, id] = b.dataset.del.split('|');
  try { await deleteDoc(doc(db, COLS[col], id)); } catch (err) { toast(t('fail') + err.message); }
});

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmGYoMqvaTDafiHb7q9Vk7vE4n1w2tWBI",
  authDomain: "am-a-geo.firebaseapp.com",
  projectId: "am-a-geo",
  storageBucket: "am-a-geo.firebasestorage.app",
  messagingSenderId: "724200458201",
  appId: "1:724200458201:web:14f851dbaf89d49170bbc8",
  measurementId: "G-XSVLE7P0V6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
