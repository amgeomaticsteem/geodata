
/* GEOData UI: bilingual content, glass detail viewer and typo-tolerant search. */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ADMIN = 'refathany2005@gmail.com';
const COLS = { data: 'projects', courses: 'courses', programs: 'programs', sites: 'sites' };
const LABEL = {
  home:['الرئيسية','Home'], data:['البيانات','Data'], courses:['الدورات','Courses'], programs:['البرامج','Programs'], sites:['أهم المواقع','Top sites'], about:['حول','About'],
  dataD:['ملفات Shapefile وبيانات مكانية جاهزة لمنطقتك، مع تصنيفات واضحة وتفاصيل المصدر.','Find shapefiles and geospatial data for your area, organized with clear metadata and source details.'],
  coursesD:['دورات GIS وجيوماتكس ومصادر للتعلم.','GIS and geomatics courses and learning resources.'],
  programsD:['برامج وأدوات للعمل الجغرافي والاستشعار عن بعد.','Software and tools for GIS and remote sensing.'],
  sitesD:['مواقع ومصادر موثوقة للبيانات الجغرافية.','Trusted websites and sources for geospatial data.'],
  h1:['بتدور على شيب فايل لمنطقتك؟ هنا الحل ومجاني!','Looking for a shapefile for your area? Find it here — free!'],
  heroEyebrow:['مكتبة مفتوحة للبيانات الجغرافية','OPEN GEOSPATIAL LIBRARY'],
  explore:['استكشف','Explore'],aboutAction:['حول GEOData','About GEOData'],
  statData:['بيانات مكانية','Geospatial data'],statLearning:['تعلم GIS','GIS learning'],statTools:['برامج وأدوات','Software & tools'],
  featureLine:['بيانات جغرافية مفتوحة تساعدك تبدأ مشروعك من غير تكلفة.','Open geospatial resources to help you start without a paywall.'],browseData:['تصفح البيانات','Browse data'],
  categoriesHeading:['التصنيفات','Categories'],openDetails:['التفاصيل','Details'],report:['إبلاغ','Report'],
  reviewsHeading:['تقييمات وتعليقات المجتمع','Community ratings & comments'],yourRating:['تقييمك','Your rating'],writeComment:['اكتب تعليقك (اختياري)','Write a comment (optional)'],submitReview:['إرسال التقييم','Submit review'],
  noReviews:['لسه مفيش تقييمات. كن أول واحد يشارك رأيه.','No reviews yet. Be the first to share feedback.'],
  reviewSaved:['تم حفظ تقييمك وتعليقك.','Your rating and comment were saved.'],reviewLogin:['سجّل الدخول عشان تقيّم أو تعلق.','Log in to rate or comment.'],ratingLabel:['تقييم','Rating'],
  reportTitle:['الإبلاغ عن محتوى','Report content'],reportReasonLabel:['سبب البلاغ','Reason for report'],reportReasonPh:['اكتب سبب الإبلاغ والتفاصيل...','Explain the issue with this content...'],sendReport:['إرسال البلاغ','Send report'],reportPrivacy:['سيظهر البلاغ في مركز التحكم لمراجعته.','Your report will appear in the control center for review.'],reportSaved:['تم تسجيل البلاغ.','Your report has been recorded.'],reportLogin:['سجّل الدخول أولًا لإرسال بلاغ.','Log in to submit a report.'],
  submissionsHeading:['طلبات النشر','Publication submissions'],reportsHeading:['بلاغات المحتوى','Content reports'],reportDone:['تمت المراجعة','Mark reviewed'],
  sourceCredit:['المصدر الأصلي وحقوق النشر','Original source & attribution'],playlistHeading:['قائمة تشغيل الدورة','Course playlist'],noCourseVideo:['المصدر لا يحتوي على رابط YouTube قابل للتضمين. استخدم رابط الناشر الأصلي.','This resource has no embeddable YouTube link. Use the publisher’s original source.'],
  openOriginal:['فتح المصدر الأصلي','Open original source'],backToList:['العودة للقائمة','Back to list'],dataHelp:['اختار التصنيف من القائمة الجانبية، أو ابحث باسم المنطقة أو نوع البيانات.','Choose a category from the sidebar, or search by area or data type.'],
  reportReasonRequired:['اكتب سبب البلاغ قبل الإرسال.','Please explain why you are reporting this content.'],homeEyebrow:['GEOData / بيانات مكانية مفتوحة','GEOData / OPEN GEOSPATIAL DATA'],
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
  searchLoading:['جارٍ البحث في كل سجلات القسم…','Searching every record in this section…'],
  searchError:['تعذر إكمال البحث. حدّث الصفحة وحاول مرة تانية.','The search could not be completed. Refresh and try again.'],
  goodMorning:['صباح الخير','Good morning'], goodAfternoon:['مساء الخير','Good afternoon'], goodEvening:['مساء الخير','Good evening'],
  footer:['© 2026 GEOData — جميع الحقوق محفوظة','© 2026 GEOData — All rights reserved'],
  shapefile:['شيب فايل (Shapefile)','Shapefile'], geodatabase:['قاعدة بيانات جغرافية (Geodatabase)','Geodatabase'], geotiff:['صورة جغرافية (GeoTIFF)','GeoTIFF'], geojson:['GeoJSON / KML','GeoJSON / KML'],
  resultsCount:['نتيجة','results'], format:['نوع المورد','Resource type'], theme:['التصنيف','Theme'], coverage:['النطاق الجغرافي','Geographic coverage'], publisher:['الناشر','Publisher'], date:['التاريخ','Date'], source:['المصدر','Source'], license:['الترخيص','License'],
  categoryLabel:['التصنيف','Category'], courseLanguage:['لغة الدورة','Course language'],
  allCategories:['كل التصنيفات','All categories'], allLanguages:['كل اللغات','All languages'],
  languageAr:['العربية','Arabic'], languageEn:['الإنجليزية','English'], languageBoth:['العربية والإنجليزية','Arabic and English'],
  previousPage:['السابق','Previous'], nextPage:['التالي','Next'], pageOf:['صفحة','Page'], of:['من','of'], loading:['جارٍ تحميل الصفحة…','Loading page…'],
  authInvalid:['الإيميل أو كلمة المرور غير صحيحين. راجع البيانات وحاول تاني.','Email or password is incorrect. Check your details and try again.'],
  authUserNotFound:['الحساب ده مش موجود. اعمل حساب جديد الأول.','No account found. Create an account first.'],
  authEmailInUse:['الإيميل ده مسجل بالفعل. جرّب تسجيل الدخول.','This email is already registered. Try logging in.'],
  authWeakPassword:['كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل.','Password is too weak. Use at least 6 characters.'],
  authUnauthorized:['الدومين الحالي مش مضاف في Firebase Authorized domains.','This website domain is not authorized in Firebase Authentication.'],
  authProviderOff:['تسجيل الدخول بالبريد وكلمة المرور غير مفعّل في Firebase.','Email/password sign-in is disabled in Firebase.'],
  authRateLimit:['محاولات كتير. استنى شوية وجرب تاني.','Too many attempts. Please wait and try again.'],
  authNetwork:['في مشكلة اتصال. افحص الإنترنت وجرب تاني.','Network error. Check your connection and try again.'],
  authGeneric:['تعذر تسجيل الدخول.','Could not sign in.'],
  cat_admin_boundaries:['حدود وتقسيمات إدارية','Administrative boundaries'],
  cat_demographics:['السكان والديموغرافيا','Population and demographics'],
  cat_transport:['النقل والطرق','Transport and roads'],
  cat_land_cover:['الغطاء الأرضي والبيئة','Land cover and environment'],
  cat_elevation:['الارتفاعات والتضاريس','Elevation and terrain'],
  cat_hydrography:['المياه والهيدرولوجيا','Water and hydrology'],
  cat_agriculture:['الزراعة والتربة','Agriculture and soils'],
  cat_buildings:['المباني والخدمات','Buildings and facilities'],
  cat_imagery:['الصور الفضائية والجوية','Satellite and aerial imagery'],
  cat_climate:['المناخ والطقس','Climate and weather'],
  cat_geology:['الجيولوجيا','Geology'],
  cat_utilities:['المرافق والبنية الأساسية','Utilities and infrastructure'],
  cat_other:['أخرى','Other'],
  course_gis_fundamentals:['أساسيات GIS','GIS fundamentals'],
  course_remote_sensing:['الاستشعار عن بعد','Remote sensing'],
  course_spatial_analysis:['التحليل المكاني','Spatial analysis'],
  course_programming:['البرمجة وPython','Programming and Python'],
  course_cartography:['الكارتوجرافيا ورسم الخرائط','Cartography and mapping'],
  course_surveying:['المساحة والرفع المساحي','Surveying'],
  course_geomatics:['الجيوماتكس','Geomatics'],
  course_databases:['قواعد البيانات المكانية','Spatial databases'],
  course_other:['أخرى','Other']
};
let lang = 'ar', theme = 'light', user = null, addTo = 'data', globalQuery = '', globalSearchPage = 1;
try { lang = localStorage.lang || lang; localStorage.removeItem('theme'); } catch {}
let renderExtra = () => {};
const store = {};
// Full-text indexes are fetched only when a search is made, then reused for the session.
const searchIndexBySection = Object.create(null);
const searchIndexPromises = Object.create(null);
let globalSearchLoading = false;
const PAGE_SIZE = 12;
const DATA_CATEGORIES = ['admin_boundaries','demographics','transport','land_cover','elevation','hydrography','agriculture','buildings','imagery','climate','geology','utilities','other'];
const COURSE_CATEGORIES = ['gis_fundamentals','remote_sensing','spatial_analysis','programming','cartography','surveying','geomatics','databases','other'];
const COURSE_LANGUAGES = ['ar','en','both'];
const categoryLabel = (col,value) => value ? t((col==='courses'?'course_':'cat_')+value) : '';
const pageState = Object.fromEntries(Object.keys(COLS).map(col=>[col,{page:1,total:0,totalPages:1,pages:{},lastDocs:{},loaded:new Map(),category:'',courseLanguage:'',loading:false,countPromise:null}]));
const t = key => (LABEL[key] || [key,key])[lang === 'ar' ? 0 : 1];
const save = (key, value) => { try { localStorage[key] = value; } catch {} };
const admin = () => !!user && (user.email || '').toLowerCase() === ADMIN;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let toastTimer;
const toast = message => { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 3200); };
const authM = $('#authM'), authF = $('#authF'), addM = $('#addM'), addF = $('#addF'), detailM = $('#detailsM');

/* ---------- Language helpers and free machine-translation cache ---------- */
const TRANSLATE_ENDPOINT = 'https://api.mymemory.translated.net/get';
const CACHE_KEY = 'geodata_translation_cache_v3_gis';
const GIS_GLOSSARY = [
  {pattern:'\\bfeature layers?\\b',ar:'طبقة معالم',en:'Feature layer'},
  {pattern:'\\bfeature services?\\b',ar:'خدمة معالم',en:'Feature service'},
  {pattern:'\\bArcGIS Pro\\b',ar:'ArcGIS Pro',en:'ArcGIS Pro'},
  {pattern:'\\bArcGIS Online\\b',ar:'ArcGIS Online',en:'ArcGIS Online'},
  {pattern:'\\bQGIS\\b',ar:'QGIS',en:'QGIS'},
  {pattern:'\\bArcGIS\\b',ar:'ArcGIS',en:'ArcGIS'},
  {pattern:'\\bGIS\\b',ar:'نظم المعلومات الجغرافية (GIS)',en:'GIS'},
  {pattern:'\\bfeatures\\b',ar:'معالم',en:'Features'},
  {pattern:'\\bfeature\\b',ar:'معلم',en:'Feature'},
  {pattern:'\\blayers\\b',ar:'طبقات',en:'Layers'},
  {pattern:'\\blayer\\b',ar:'طبقة',en:'Layer'},
  {pattern:'\\braster data\\b',ar:'بيانات نقطية',en:'Raster data'},
  {pattern:'\\braster\\b',ar:'بيانات نقطية',en:'Raster'},
  {pattern:'\\bvector data\\b',ar:'بيانات متجهة',en:'Vector data'},
  {pattern:'\\bvector\\b',ar:'بيانات متجهة',en:'Vector'},
  {pattern:'\\bshapefiles?\\b',ar:'ملف Shapefile',en:'Shapefile'},
  {pattern:'\\bgeodatabases?\\b',ar:'قاعدة بيانات جغرافية',en:'Geodatabase'},
  {pattern:'\\bremote sensing\\b',ar:'الاستشعار عن بعد',en:'Remote sensing'},
  {pattern:'\\battribute tables?\\b',ar:'جدول السمات',en:'Attribute table'},
  {pattern:'\\bdigital elevation model\\b',ar:'نموذج الارتفاع الرقمي (DEM)',en:'Digital elevation model'},
  {pattern:'\\bDEM\\b',ar:'DEM',en:'DEM'},
  {pattern:'\\bNDVI\\b',ar:'NDVI',en:'NDVI'},
  {pattern:'\\bMNDWI\\b',ar:'MNDWI',en:'MNDWI'},
  {pattern:'نظم المعلومات الجغرافية',ar:'نظم المعلومات الجغرافية (GIS)',en:'Geographic Information Systems (GIS)'},
  {pattern:'طبقة معالم',ar:'طبقة معالم',en:'Feature layer'},
  {pattern:'خدمة معالم',ar:'خدمة معالم',en:'Feature service'},
  {pattern:'معالم',ar:'معالم',en:'Features'},
  {pattern:'طبقات',ar:'طبقات',en:'Layers'},
  {pattern:'طبقة',ar:'طبقة',en:'Layer'},
  {pattern:'بيانات نقطية',ar:'بيانات نقطية',en:'Raster data'},
  {pattern:'بيانات متجهة',ar:'بيانات متجهة',en:'Vector data'},
  {pattern:'شيب فايل',ar:'ملف Shapefile',en:'Shapefile'},
  {pattern:'قاعدة بيانات جغرافية',ar:'قاعدة بيانات جغرافية',en:'Geodatabase'},
  {pattern:'الاستشعار عن بعد',ar:'الاستشعار عن بعد',en:'Remote sensing'},
  {pattern:'جدول السمات',ar:'جدول السمات',en:'Attribute table'},
  {pattern:'نموذج الارتفاع الرقمي',ar:'نموذج الارتفاع الرقمي (DEM)',en:'Digital elevation model'}
];
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
function protectGisTerms(value,target) {
  const source=sourceLanguage(value),restore=new Map();
  let protectedText=value;
  [...GIS_GLOSSARY].sort((a,b)=>b.pattern.length-a.pattern.length).forEach((term,index)=>{
    const sourcePattern=source==='en'?term.pattern:term.ar;
    const replacement=target==='ar'?term.ar:term.en;
    if(!sourcePattern||!replacement)return;
    protectedText=protectedText.replace(new RegExp(sourcePattern,'gi'),()=>{
      const marker='ZXGEO'+String(index).padStart(3,'0')+'XZ';
      restore.set(marker,replacement);return marker;
    });
  });
  return {text:protectedText,restore};
}
function correctKnownGisTranslation(source,translated,target) {
  let value=String(translated||'');
  if(target==='ar'){
    if(source.toLowerCase().includes('qgis'))value=value.replace(/نظم المعلومات القطرية|نظم المعلومات القطريه/g,'QGIS');
    if(source.toLowerCase().includes('feature')){
      value=value
        .replace(/خدمة\\s+(?:ال)?(?:الميزة|ميزة|المميزات|الميزات|مميزات|ميزات)/g,'خدمة معالم')
        .replace(/طبقة\\s+(?:ال)?(?:الميزة|ميزة|المميزات|الميزات|مميزات|ميزات)/g,'طبقة معالم')
        .replace(/(?:المميزات|الميزات|مميزات|ميزات)/g,'معالم')
        .replace(/(?:الميزة|ميزة)/g,'معلم');
    }
    value=value.replace(/نظم المعلومات الجغرافية القطرية/g,'نظم المعلومات الجغرافية (GIS)');
  }else{
    value=value.replace(/نظم المعلومات الجغرافية/g,'Geographic Information Systems')
      .replace(/طبقة معالم/g,'Feature layer').replace(/معالم/g,'Features')
      .replace(/بيانات نقطية/g,'Raster data').replace(/بيانات متجهة/g,'Vector data')
      .replace(/الاستشعار عن بعد/g,'Remote sensing');
  }
  return value;
}
async function translateText(value, target) {
  const original = String(value ?? '').trim();
  if (!original || target === sourceLanguage(original)) return original;
  const key = cacheId(target, original);
  if (translationCache[key]) return correctKnownGisTranslation(original,translationCache[key],target);
  const glossary=protectGisTerms(original,target);
  const chunks = splitForTranslation(glossary.text);
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
    let result = translated.join(' ').trim();
    if (!result) return original;
    for(const [marker,replacement] of glossary.restore){
      if(!result.includes(marker))throw new Error('Translation changed a protected GIS term placeholder.');
      result=result.replaceAll(marker,replacement);
    }
    result=correctKnownGisTranslation(original,result,target);
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
  const raw = record[field] || '';
  if(savedValue)return correctKnownGisTranslation(raw,savedValue,target);
  return translateText(raw,target);
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
  }, {rootMargin:matchMedia('(max-width:760px), (pointer:coarse)').matches?'72px 0px':'180px 0px'});
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
    record.title, record.details, record.format, record.publisherName, record.sourceName, record.license, record.theme, record.coverage,
    record.title_ar, record.title_en, record.details_ar, record.details_en, record.format_ar, record.format_en,
    record.theme_ar, record.theme_en, record.coverage_ar, record.coverage_en,
    record.category, record.courseLanguage
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
function ensureSectionSearchIndex(section) {
  if (searchIndexBySection[section]) return Promise.resolve(searchIndexBySection[section]);
  if (searchIndexPromises[section]) return searchIndexPromises[section];
  if (!COLS[section]) return Promise.reject(new Error('Unknown GEOData section: ' + section));
  searchIndexPromises[section] = getDocs(collection(db,COLS[section])).then(snapshot => {
    const records = snapshot.docs.map(item => ({id:item.id,...item.data()}));
    searchIndexBySection[section] = records;
    return records;
  }).catch(error => {
    delete searchIndexPromises[section];
    throw error;
  });
  return searchIndexPromises[section];
}
async function ensureGlobalSearchIndex() {
  await Promise.all(Object.keys(COLS).map(ensureSectionSearchIndex));
}
function invalidateSearchIndex() {
  Object.keys(searchIndexBySection).forEach(key => delete searchIndexBySection[key]);
  Object.keys(searchIndexPromises).forEach(key => delete searchIndexPromises[key]);
  globalSearchLoading = false;
}
function allRecords() {
  return Object.entries(COLS).flatMap(([id]) =>
    (searchIndexBySection[id] || [...pageState[id].loaded.values()]).map(record => ({...record,_col:id}))
  );
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
  const source = scope ? (searchIndexBySection[scope] || store[scope] || []).map(item => ({...item, _col:scope})) : allRecords();
  const matches = source.map(item => ({...item, _score:matchScore(item,query)}))
    .filter(item => item._score > 0).sort((a,b)=>b._score-a._score).slice(0,6);
  box.innerHTML = suggestionMarkup(matches);
  box.hidden = false;
  matches.forEach(item => {
    const suggestion = $('.suggestion[data-suggest-id="' + CSS.escape(item.id) + '"]', box);
    if (suggestion) localizeElements(suggestion,item);
  });
}

function categoryNavMarkup(col) {
  const values=col==='data'?DATA_CATEGORIES:col==='courses'?COURSE_CATEGORIES:[];
  const state=pageState[col];
  return '<button type="button" data-filter-category="" class="'+(!state.category?'active':'')+'">'+esc(t('allCategories'))+'</button>'+
    values.map(value=>'<button type="button" data-filter-category="'+esc(value)+'" class="'+(state.category===value?'active':'')+'">'+esc(categoryLabel(col,value))+'</button>').join('');
}
function updateCategoryControls() {
  const languageLabel=value=>t(value==='ar'?'languageAr':value==='en'?'languageEn':'languageBoth');
  if($('#dataCategory'))$('#dataCategory').innerHTML=DATA_CATEGORIES.map(v=>'<option value="'+esc(v)+'">'+esc(t('cat_'+v))+'</option>').join('');
  if($('#courseCategory'))$('#courseCategory').innerHTML=COURSE_CATEGORIES.map(v=>'<option value="'+esc(v)+'">'+esc(t('course_'+v))+'</option>').join('');
  if($('#courseLanguage'))$('#courseLanguage').innerHTML=COURSE_LANGUAGES.map(v=>'<option value="'+esc(v)+'">'+esc(languageLabel(v))+'</option>').join('');
  $$('[data-category-nav]').forEach(nav=>{const col=nav.dataset.categoryNav;nav.innerHTML=categoryNavMarkup(col);});
  $$('[data-language-nav]').forEach(nav=>{
    nav.innerHTML='<button type="button" data-filter-language="" class="'+(!pageState.courses.courseLanguage?'active':'')+'">'+esc(t('allLanguages'))+'</button>'+
      COURSE_LANGUAGES.map(v=>'<button type="button" data-filter-language="'+v+'" class="'+(pageState.courses.courseLanguage===v?'active':'')+'">'+esc(languageLabel(v))+'</button>').join('');
  });
}
function pageButtons(section) {
  const state=pageState[section],total=state.totalPages||1,current=state.page,start=Math.max(1,Math.min(current-2,total-4)),end=Math.min(total,start+4);
  let numbers='';for(let n=start;n<=end;n++)numbers+='<button type="button" class="page-number'+(n===current?' active':'')+'" data-page-col="'+section+'" data-page="'+n+'"'+(state.loading?' disabled':'')+'>'+n+'</button>';
  return '<button type="button" class="page-arrow" data-page-col="'+section+'" data-page="'+(current-1)+'"'+(current<=1||state.loading?' disabled':'')+'>'+t('previousPage')+'</button><div class="page-numbers">'+numbers+'</div><button type="button" class="page-arrow" data-page-col="'+section+'" data-page="'+(current+1)+'"'+(current>=total||state.loading?' disabled':'')+'>'+t('nextPage')+'</button><span class="page-status">'+t('pageOf')+' '+current+' '+t('of')+' '+total+'</span>';
}
function renderPagination(section) {
  const nav=$('[data-pagination="'+section+'"]');if(!nav)return;const state=pageState[section];
  if($('.q',$('#'+section))?.value.trim()){nav.hidden=true;return;}
  nav.hidden=state.totalPages<=1&&!state.loading;nav.innerHTML=state.loading?'<span class="page-status">'+t('loading')+'</span>':pageButtons(section);
}
function renderGlobalPagination(totalPages) {
  $('#globalPagination')?.remove();if(totalPages<=1)return;
  const nav=document.createElement('nav');nav.id='globalPagination';nav.className='pagination';
  const start=Math.max(1,Math.min(globalSearchPage-2,totalPages-4)),end=Math.min(totalPages,start+4);let nums='';
  for(let n=start;n<=end;n++)nums+='<button type="button" class="page-number'+(n===globalSearchPage?' active':'')+'" data-global-page="'+n+'">'+n+'</button>';
  nav.innerHTML='<button type="button" class="page-arrow" data-global-page="'+(globalSearchPage-1)+'"'+(globalSearchPage<=1?' disabled':'')+'>'+t('previousPage')+'</button><div class="page-numbers">'+nums+'</div><button type="button" class="page-arrow" data-global-page="'+(globalSearchPage+1)+'"'+(globalSearchPage>=totalPages?' disabled':'')+'>'+t('nextPage')+'</button>';
  $('#globalResults').after(nav);
}
function filteredQuery(section,state) {const filters=[];if(state.category)filters.push(where('category','==',state.category));if(section==='courses'&&state.courseLanguage)filters.push(where('courseLanguage','==',state.courseLanguage));return filters;}
async function loadPage(section,target=1) {
  const state=pageState[section];if(!state||state.loading)return;target=Math.max(1,target);
  if(state.pages[target]){state.page=target;store[section]=state.pages[target];draw(section);if(location.hash==='#search')drawSearch();return;}
  state.loading=true;renderPagination(section);
  try{
    if(!state.countPromise){
      const base=collection(db,COLS[section]);
      state.countPromise=getCountFromServer(query(base,...filteredQuery(section,state))).then(s=>{state.total=s.data().count||0;state.totalPages=Math.max(1,Math.ceil(state.total/PAGE_SIZE));}).catch(error=>console.warn('GEOData count unavailable:',section,error));
    }
    await state.countPromise;target=Math.min(target,state.totalPages||1);
    for(let page=1;page<=target;page++){
      if(state.pages[page])continue;
      const base=collection(db,COLS[section]),cursor=page>1?state.lastDocs[page-1]:null;
      const pageQuery=query(base,...filteredQuery(section,state),...(cursor?[startAfter(cursor)]:[]),limit(PAGE_SIZE));
      const snapshot=await getDocs(pageQuery),records=snapshot.docs.map(item=>({id:item.id,...item.data()}));
      state.pages[page]=records;if(snapshot.docs.length)state.lastDocs[page]=snapshot.docs[snapshot.docs.length-1];
      records.forEach(record=>state.loaded.set(record.id,record));
      if(snapshot.docs.length<PAGE_SIZE){state.total=Math.min(state.total,(page-1)*PAGE_SIZE+snapshot.docs.length);state.totalPages=Math.max(1,Math.ceil(state.total/PAGE_SIZE));break;}
    }
    state.page=target;store[section]=state.pages[target]||[];draw(section);if(location.hash==='#search')drawSearch();
  }catch(error){console.error('GEOData page load failed:',section,error);const grid=$('.grid',$('#'+section));if(grid)grid.innerHTML='<p class="empty" role="status">'+t('loadError')+'</p>';toast(t('loadError'));}
  finally{state.loading=false;renderPagination(section);}
}
function resetAndLoad(section,changes={}) {
  const state=pageState[section];if(!state)return;
  Object.assign(state,changes,{page:1,total:0,totalPages:1,pages:{},lastDocs:{},loaded:new Map(),countPromise:null});
  store[section]=[];updateCategoryControls();loadPage(section,1);
}
document.addEventListener('click',event=>{
  const pageButton=event.target.closest('[data-page-col]');if(pageButton&&!pageButton.disabled){loadPage(pageButton.dataset.pageCol,Number(pageButton.dataset.page));return;}
  const globalPage=event.target.closest('[data-global-page]');if(globalPage&&!globalPage.disabled){globalSearchPage=Math.max(1,Number(globalPage.dataset.globalPage));drawSearch();}
});

/* ---------- Esri-inspired catalog templates and resource rows ---------- */
$$('.coll').forEach(section => {
  const col=section.id, hasCategories=col==='data'||col==='courses';
  section.innerHTML =
    '<div class="phead"><span class="eyebrow" data-i="homeEyebrow"></span><h2 data-i="'+col+'"></h2><p data-i="'+col+'D"></p></div>'+
    '<div class="catalog-layout">'+
      (hasCategories?'<aside class="catalog-sidebar"><h3 data-i="categoriesHeading"></h3><nav class="category-nav" data-category-nav="'+col+'"></nav>'+
        (col==='courses'?'<h3 data-i="courseLanguage" class="language-side-title"></h3><nav class="category-nav language-nav" data-language-nav="courses"></nav>':'')+
      '</aside>':'')+
      '<div class="catalog-content"><div class="tools"><div class="search-wrap"><input class="q" type="search" data-ph="sPh" autocomplete="off" aria-label="'+t('sPh')+'"><div class="search-suggestions" hidden></div></div>'+
      '<button class="btn" data-add="'+col+'" data-i="add"></button></div>'+
      (col==='sites'?'<div class="sites-tiles"></div>':'<div class="resource-list"></div>')+
      '<nav class="pagination" data-pagination="'+col+'" aria-label="Pagination"></nav></div>'+
    '</div>';
  const input=$('.q',section);let sectionSearchRequest=0;
  input.addEventListener('input',()=>{
    const queryText=input.value.trim(),request=++sectionSearchRequest;
    updateSuggestions($('.search-suggestions',section),input.value,col);
    if(!queryText){draw(col);return;}
    if(searchIndexBySection[col]){draw(col);return;}
    const list=col==='sites'?$('.sites-tiles',section):$('.resource-list',section);
    list.innerHTML='<p class="empty" role="status">'+t('searchLoading')+'</p>';renderPagination(col);
    ensureSectionSearchIndex(col).then(()=>{
      if(request!==sectionSearchRequest)return;
      updateSuggestions($('.search-suggestions',section),input.value,col);draw(col);
    }).catch(error=>{
      console.error('GEOData section search failed:',col,error);
      if(request===sectionSearchRequest)list.innerHTML='<p class="empty" role="status">'+t('searchError')+'</p>';
    });
  });
  input.addEventListener('focus',()=>updateSuggestions($('.search-suggestions',section),input.value,col));
});
function resourceDate(record) {
  if(record.date)return String(record.date);
  const stamp=record.createdAt?.toDate?record.createdAt.toDate():record.createdAt?.seconds?new Date(record.createdAt.seconds*1000):null;
  return stamp?new Intl.DateTimeFormat(lang==='ar'?'ar-EG':'en-GB',{year:'numeric',month:'short',day:'numeric'}).format(stamp):'';
}
function card(record,col,showCategory=false) {
  const title=esc(record.title||''),details=esc(record.details||''),safeLink=/^https:\/\//i.test(record.link||'')?record.link:'';
  const category=record.category?categoryLabel(col,record.category):t(col),date=resourceDate(record);
  const report='<button type="button" class="report-link row-report" data-report-col="'+esc(col)+'" data-report-id="'+esc(record.id)+'" data-report-title="'+title+'">'+t('report')+'</button>';
  if(col==='sites'){
    let icon=record.imageUrl||record.image||record.logoUrl||'';
    if(!/^https:\/\//i.test(icon)){try{const host=new URL(safeLink).hostname;icon='https://www.google.com/s2/favicons?domain='+encodeURIComponent(host)+'&sz=128';}catch{icon='assets/icon-sites.png';}}
    return '<article class="site-tile resource-card" data-col="'+esc(col)+'" data-id="'+esc(record.id)+'">'+
      '<div class="site-tile-top"><img src="'+esc(icon)+'" alt="" loading="lazy" onerror="this.src=\'assets/icon-sites.png\'"><div><h3><a href="'+esc(safeLink||'#')+'" target="_blank" rel="noopener noreferrer">'+title+'</a></h3><small>'+esc(date)+'</small></div></div>'+
      '<p data-local-field="details">'+details+'</p><div class="foot"><a class="lnk" href="'+esc(safeLink||'#')+'" target="_blank" rel="noopener noreferrer">'+esc(record.sourceName||record.publisherName||safeLink)+'</a><button type="button" class="btn sm ghost" data-detail-col="'+esc(col)+'" data-detail-id="'+esc(record.id)+'">'+t('openDetails')+'</button></div>'+report+'</article>';
  }
  const del=admin()?'<button class="del" data-del="'+esc(col)+'|'+esc(record.id)+'" aria-label="Delete">✕</button>':'';
  return '<article class="resource-row resource-card" data-col="'+esc(col)+'" data-id="'+esc(record.id)+'">'+del+
    '<div class="resource-row-main"><h3><button type="button" data-detail-col="'+esc(col)+'" data-detail-id="'+esc(record.id)+'" data-local-field="title">'+title+'</button></h3>'+
    '<p data-local-field="details">'+details+'</p></div>'+
    '<div class="resource-row-meta"><span class="meta-category">'+esc(category)+'</span>'+
    (record.format?'<span>'+esc(record.format)+'</span>':'')+(date?'<span>'+esc(date)+'</span>':'')+
    '<span>'+esc(record.publisherName||'GEOData')+'</span></div>'+
    '<div class="resource-row-actions"><button type="button" class="btn sm ghost" data-detail-col="'+esc(col)+'" data-detail-id="'+esc(record.id)+'">'+t('openDetails')+'</button>'+report+'</div></article>';
}
function draw(col) {
  const section=$('#'+col),container=col==='sites'?$('.sites-tiles',section):$('.resource-list',section);
  if(!container)return;
  const queryText=$('.q',section)?.value.trim()||'',state=pageState[col];
  if(queryText&&!searchIndexBySection[col]){container.innerHTML='<p class="empty" role="status">'+t('searchLoading')+'</p>';renderPagination(col);return;}
  const source=queryText?(searchIndexBySection[col]||[]):(store[col]||[]);
  const list=source.filter(record=>(!state.category||record.category===state.category)&&(!state.courseLanguage||record.courseLanguage===state.courseLanguage))
    .map(record=>({record,score:queryText?matchScore(record,queryText):0})).filter(item=>!queryText||item.score>0)
    .sort((a,b)=>b.score-a.score).map(item=>item.record);
  container.innerHTML=list.length?list.map(record=>card(record,col)).join(''):'<p class="empty">'+t('empty')+'</p>';
  observeCards(container);renderPagination(col);updateCategoryControls();
}
function drawSearch() {
  const container = $('#globalResults');
  if (!container) return;
  if(normalizeSearch(globalQuery)&&!Object.keys(COLS).every(section=>searchIndexBySection[section])){
    $('#searchSummary').textContent=t('searchLoading');
    container.innerHTML='<p class="empty" role="status">'+t('searchLoading')+'</p>';
    if(!globalSearchLoading){
      globalSearchLoading=true;
      ensureGlobalSearchIndex().then(()=>{
        globalSearchLoading=false;
        if(location.hash==='#search')drawSearch();
      }).catch(error=>{
        globalSearchLoading=false;
        console.error('GEOData global search failed:',error);
        $('#searchSummary').textContent=t('searchError');
        container.innerHTML='<p class="empty" role="status">'+t('searchError')+'</p>';
      });
    }
    return;
  }
  const results = allRecords().map(item=>({...item,_score:matchScore(item,globalQuery)}))
    .filter(item=>item._score>0).sort((a,b)=>b._score-a._score);
  $('#searchSummary').textContent = results.length + ' ' + t('resultsCount');
  const pageSize=24,totalPages=Math.max(1,Math.ceil(results.length/pageSize));
  globalSearchPage=Math.min(globalSearchPage,totalPages);
  const visible=results.slice((globalSearchPage-1)*pageSize,globalSearchPage*pageSize);
  container.innerHTML=visible.length?visible.map(item=>card(item,item._col,true)).join(''):'<p class="empty">'+t('empty')+'</p>';
  observeCards(container);renderGlobalPagination(totalPages);
}
const drawAll = () => { Object.keys(COLS).forEach(draw); if (location.hash === '#search') drawSearch(); };

function applyTheme() { theme='light';document.body.dataset.theme='light';updateGeoAssistantTheme(); }
let currentDetail = null;
function applyLang() {
  const root=document.documentElement;
  root.lang=lang;root.dir=lang==='ar'?'rtl':'ltr';
  $('#mainNav')?.setAttribute('dir',root.dir);
  document.body.className='lang-'+lang+' ready';
  document.body.dataset.theme='light';
  $$('[data-i]').forEach(el=>el.textContent=t(el.dataset.i));
  $$('[data-ph]').forEach(el=>{el.placeholder=t(el.dataset.ph);});
  const metaDescription=$('meta[name="description"]');
  if(metaDescription)metaDescription.content=lang==='ar'
    ?'GEOData: مكتبة مجانية للـShapefile والبيانات الجغرافية والدورات والبرامج.'
    :'GEOData: a free library for shapefiles, geospatial data, GIS courses and software.';
  document.title='GEOData | Open Geospatial Library';
  $('#lang').textContent=lang==='ar'?'EN':'ع';
  $$('input[aria-label]').forEach(el=>{if(el.classList.contains('q'))el.setAttribute('aria-label',t('sPh'));});
  const title=$('#heroTitle');
  if(title){
    const raw=t('h1');
    title.textContent=raw;
    const phrase=lang==='ar'?'شيب فايل لمنطقتك؟':'shapefile for your area?';
    if(raw.includes(phrase))title.innerHTML=esc(raw).replace(esc(phrase),'<span class="hero-blue">'+esc(phrase)+'</span>');
  }
  updateCategoryControls();drawAll();renderExtra();updateGeoAssistantLanguage();
  if(currentDetail&&location.hash.startsWith('#resource/'))renderResourceDetail();
}
$('#lang').onclick = () => { lang = lang === 'ar' ? 'en' : 'ar'; save('lang',lang); applyLang(); };
$('#burger').onclick = () => $('#links').classList.toggle('show');

function route() {
  const raw=location.hash.slice(1),parts=raw.split('/');
  const resourceRoute=parts[0]==='resource'&&parts.length>=3;
  let page=resourceRoute?'resource':(document.getElementById(raw)?.classList.contains('page')?raw:'home');
  if(page==='admin'&&!admin())page='home';
  if(resourceRoute)currentDetail={col:parts[1],id:decodeURIComponent(parts.slice(2).join('/'))};
  $('.page').forEach(section=>section.classList.toggle('on',section.id===page));
  $('#links a').forEach(anchor=>anchor.classList.toggle('on',anchor.hash==='#'+page));
  $('#links').classList.remove('show');
  if(page!=='resource')scrollTo(0,0);
  if(page==='search')drawSearch();
  if(page==='resource'&&currentDetail)renderResourceDetail();
}
addEventListener('hashchange',route);

$('#heroSearch').addEventListener('submit',event=>{
  event.preventDefault();
  globalQuery = event.currentTarget.q.value.trim();globalSearchPage=1;
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
  $('#authError').hidden=true;$('#authError').textContent='';
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
$('#login').onclick=()=>{
  authF.dataset.mode='login';$('#authError').hidden=true;
  $$('.tabs button').forEach(button=>button.classList.toggle('on',button.dataset.mode==='login'));
  authM.showModal();
};
function authErrorText(error,isRegister) {
  const code=error?.code||'';
  if(code==='auth/unauthorized-domain')return t('authUnauthorized');
  if(code==='auth/operation-not-allowed')return t('authProviderOff');
  if(code==='auth/user-not-found')return t('authUserNotFound');
  if(code==='auth/email-already-in-use')return t('authEmailInUse');
  if(code==='auth/weak-password')return t('authWeakPassword');
  if(code==='auth/too-many-requests')return t('authRateLimit');
  if(code==='auth/network-request-failed')return t('authNetwork');
  if(['auth/invalid-credential','auth/invalid-login-credentials','auth/wrong-password','auth/invalid-email'].includes(code))return t('authInvalid');
  return (isRegister?t('fail'):t('authGeneric'))+' '+(error?.message||code||'');
}
const paintUser=()=>{
  $('#login').hidden=!!user;$('#user').hidden=!user;$('#bell').hidden=!user||admin();$('#adminLink').hidden=!admin();
  if(user)$('#uname').textContent=user.displayName||user.email?.split('@')[0]||'User';
};

let activeReviewUnsub=null;
function getResource(col,id) {
  return (store[col]||[]).find(item=>item.id===id)||
    (searchIndexBySection[col]||[]).find(item=>item.id===id)||
    pageState[col]?.loaded.get(id)||null;
}
function youtubeInfo(value) {
  try{
    const url=new URL(value),host=url.hostname.replace(/^www\./,'');
    if(host==='youtu.be')return {video:url.pathname.slice(1),list:url.searchParams.get('list')||''};
    if(host.endsWith('youtube.com')){
      return {video:url.searchParams.get('v')||(url.pathname.match(/\/embed\/([^/]+)/)||[])[1]||'',list:url.searchParams.get('list')||''};
    }
  }catch{}
  return null;
}
function detailSidebarMarkup(col,selected) {
  if(!['data','courses'].includes(col))return '';
  const values=col==='data'?DATA_CATEGORIES:COURSE_CATEGORIES;
  return '<h3>'+t('categoriesHeading')+'</h3><nav class="category-nav">'+
    '<button type="button" data-detail-filter="'+col+'" data-filter-category="" class="'+(!selected?'active':'')+'">'+t('allCategories')+'</button>'+
    values.map(value=>'<button type="button" data-detail-filter="'+col+'" data-filter-category="'+esc(value)+'" class="'+(selected===value?'active':'')+'">'+esc(categoryLabel(col,value))+'</button>').join('')+
    '</nav>';
}
function openDetail(col,id) {
  const record=getResource(col,id);
  if(!record)return;
  currentDetail={col,id};
  location.hash='#resource/'+col+'/'+encodeURIComponent(id);
  route();
}
async function renderResourceDetail() {
  if(!currentDetail)return;
  const {col,id}=currentDetail,record=getResource(col,id),content=$('#resourceDetailContent');
  if(!content)return;
  if(!record){
    content.innerHTML='<p class="empty">'+t('loadError')+'</p>';
    return;
  }
  const sidebar=$('#detailCategorySidebar'),playlist=$('#coursePlaylistSidebar'),shell=$('.resource-page-shell');
  const hasCategories=col==='data'||col==='courses';
  sidebar.hidden=!hasCategories;
  sidebar.innerHTML=hasCategories?detailSidebarMarkup(col,record.category):'';
  const yt=col==='courses'?youtubeInfo(record.link||''):null;
  const safeLink=/^https:\/\//i.test(record.link||'')?record.link:'';
  const title=record['title_'+lang]||record.title||'';
  const category=record.category?categoryLabel(col,record.category):t(col);
  const date=resourceDate(record);
  const owner=record.publisherName||record.sourceName||'GEOData';
  let videoHtml='',playlistHtml='';
  if(yt&&(yt.video||yt.list)){
    const videoId=yt.video?encodeURIComponent(yt.video):'';
    const listId=yt.list?encodeURIComponent(yt.list):'';
    const embed=yt.video
      ?'https://www.youtube-nocookie.com/embed/'+videoId+(listId?'?list='+listId:'')
      :'https://www.youtube-nocookie.com/embed/videoseries?list='+listId;
    videoHtml='<div class="course-player-wrap"><iframe class="course-video-frame" src="'+embed+'" title="'+esc(title)+'" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>';
    if(listId)playlistHtml='<h3>'+t('playlistHeading')+'</h3><iframe src="https://www.youtube-nocookie.com/embed/videoseries?list='+listId+'" title="'+esc(title)+' — playlist" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe><p class="playlist-caption">'+esc(title)+'</p>';
  }else if(col==='courses'){
    videoHtml='<p class="empty">'+t('noCourseVideo')+'</p>';
  }
  playlist.hidden=!playlistHtml;
  playlist.innerHTML=playlistHtml;
  shell.classList.toggle('no-side-playlist',!playlistHtml);
  shell.classList.toggle('no-side-category',!hasCategories);
  const metadata=[
    [t('publisher'),owner],[t('date'),date],[t('categoryLabel'),category],
    [t('format'),record.format||''],[t('courseLanguage'),record.courseLanguage?t('language'+(record.courseLanguage==='ar'?'Ar':record.courseLanguage==='en'?'En':'Both')):''],
    [t('source'),record.sourceName||''],[t('theme'),record.theme||''],[t('coverage'),record.coverage||''],[t('license'),record.license||'']
  ].filter(pair=>pair[1]);
  const reportButton='<button class="report-link" type="button" data-report-col="'+esc(col)+'" data-report-id="'+esc(id)+'" data-report-title="'+esc(title)+'">'+t('report')+'</button>';
  content.innerHTML=
    '<div class="resource-breadcrumb"><a href="#'+(col==='data'?'data':col)+'">'+t(col)+'</a><span>›</span><span>'+esc(category)+'</span><span>›</span><span>'+t('details')+'</span></div>'+
    '<div class="resource-detail-heading"><span class="tag">'+esc(category)+'</span><h1 data-local-field="title">'+esc(title)+'</h1>'+
    '<div class="resource-row-meta"><span>'+esc(owner)+'</span>'+(date?'<span>'+esc(date)+'</span>':'')+(record.format?'<span>'+esc(record.format)+'</span>':'')+'</div></div>'+
    videoHtml+
    '<p class="resource-detail-description" data-local-field="details">'+esc(record.details||'')+'</p>'+
    '<div class="resource-detail-meta">'+metadata.map(pair=>'<div><small>'+esc(pair[0])+'</small><b>'+esc(pair[1])+'</b></div>').join('')+'</div>'+
    '<div class="resource-detail-actions">'+(safeLink?'<a class="btn" href="'+esc(safeLink)+'" target="_blank" rel="noopener noreferrer">'+t('openOriginal')+'</a>':'')+
      reportButton+'<a class="btn ghost" href="#'+col+'">'+t('backToList')+'</a></div>'+
    (col==='courses'&&safeLink?'<div class="course-attribution">'+t('sourceCredit')+': <a href="'+esc(safeLink)+'" target="_blank" rel="noopener noreferrer">'+esc(record.sourceName||owner)+' — YouTube</a></div>':'')+
    '<section class="review-section"><h2>'+t('reviewsHeading')+'</h2>'+
      '<div class="review-summary"><strong id="reviewAverage">—</strong><span class="review-stars" id="reviewAverageStars">☆☆☆☆☆</span><span id="reviewCount">0</span></div>'+
      '<form id="reviewForm" class="review-form"><label>'+t('yourRating')+'</label><div class="rating-picker" id="ratingPicker" role="radiogroup" aria-label="'+t('yourRating')+'">'+[1,2,3,4,5].map(n=>'<button type="button" data-rating-value="'+n+'" aria-label="'+n+' '+t('ratingLabel')+'">★</button>').join('')+'</div>'+
      '<label for="reviewComment">'+t('writeComment')+'</label><textarea id="reviewComment" name="comment" maxlength="1200" placeholder="'+t('writeComment')+'"></textarea>'+
      '<div class="review-controls"><small id="reviewLoginHint">'+(user?'':t('reviewLogin'))+'</small><button class="btn" type="submit">'+t('submitReview')+'</button></div></form>'+
      '<div id="reviewList" class="review-list"><p class="empty">'+t('loading')+'</p></div></section>';
  await localizeElements(content,record);
  loadResourceReviews(col,id,record);
}
let selectedRating=0;
function loadResourceReviews(col,id,record) {
  if(activeReviewUnsub){activeReviewUnsub();activeReviewUnsub=null;}
  selectedRating=0;
  const key=col+'_'+id;
  const list=$('#reviewList');if(!list)return;
  activeReviewUnsub=onSnapshot(query(collection(db,'reviews'),where('resourceKey','==',key)),snapshot=>{
    const rows=snapshot.docs.map(item=>({id:item.id,...item.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
    const avg=rows.length?rows.reduce((sum,row)=>sum+(Number(row.rating)||0),0)/rows.length:0;
    $('#reviewAverage').textContent=rows.length?avg.toFixed(1):'—';
    $('#reviewAverageStars').textContent=Array.from({length:5},(_,i)=>i<Math.round(avg)?'★':'☆').join('');
    $('#reviewCount').textContent=rows.length+' '+t('ratingLabel');
    const own=rows.find(row=>user&&row.uid===user.uid);
    selectedRating=own?.rating||0;
    if($('#reviewComment'))$('#reviewComment').value=own?.comment||'';
    updateRatingPicker();
    list.innerHTML=rows.length?rows.map(row=>
      '<article class="review-item"><div class="review-item-head"><b>'+esc(row.userName||'GEOData user')+'</b><span class="review-stars">'+Array.from({length:5},(_,i)=>i<Number(row.rating||0)?'★':'☆').join('')+'</span></div>'+
      (row.comment?'<p>'+esc(row.comment)+'</p>':'')+'</article>'
    ).join(''):'<p class="empty">'+t('noReviews')+'</p>';
  },error=>{console.warn('GEOData reviews unavailable:',error);list.innerHTML='<p class="empty">'+t('loadError')+'</p>';});
}
function updateRatingPicker() {
  $$('#ratingPicker button').forEach(button=>button.classList.toggle('selected',Number(button.dataset.ratingValue)<=selectedRating));
}
document.addEventListener('click',event=>{
  const detailButton=event.target.closest('[data-detail-col]');
  if(detailButton){openDetail(detailButton.dataset.detailCol,detailButton.dataset.detailId);return;}
  const suggestion=event.target.closest('[data-suggest-col]');
  if(suggestion){$$('.search-suggestions').forEach(box=>box.hidden=true);openDetail(suggestion.dataset.suggestCol,suggestion.dataset.suggestId);return;}
  const categoryButton=event.target.closest('[data-filter-category]');
  if(categoryButton){
    const nav=categoryButton.closest('[data-category-nav]'),detailFilter=categoryButton.closest('[data-detail-filter]');
    const col=nav?.dataset.categoryNav||detailFilter?.dataset.detailFilter;
    if(col){resetAndLoad(col,{category:categoryButton.dataset.filterCategory||''});if(detailFilter)location.hash='#'+col;}
    return;
  }
  const languageButton=event.target.closest('[data-filter-language]');
  if(languageButton){resetAndLoad('courses',{courseLanguage:languageButton.dataset.filterLanguage||''});return;}
  const ratingButton=event.target.closest('[data-rating-value]');
  if(ratingButton){selectedRating=Number(ratingButton.dataset.ratingValue);updateRatingPicker();return;}
  const reportButton=event.target.closest('[data-report-col]');
  if(reportButton){
    const col=reportButton.dataset.reportCol,id=reportButton.dataset.reportId,record=getResource(col,id);
    currentReport={col,id,title:reportButton.dataset.reportTitle||record?.title||''};
    $('#reportResourceTitle').textContent=currentReport.title;
    $('#reportReason').value='';$('#reportM').showModal();return;
  }
});
let currentReport=null;
document.addEventListener('submit',async event=>{
  if(event.target.id==='reviewForm'){
    event.preventDefault();
    if(!user){toast(t('reviewLogin'));authM.showModal();return;}
    if(!selectedRating){toast(lang==='ar'?'اختار عدد النجوم الأول.':'Choose a star rating first.');return;}
    const record=currentDetail&&getResource(currentDetail.col,currentDetail.id);
    if(!record)return;
    const key=currentDetail.col+'_'+currentDetail.id;
    const reviewId=encodeURIComponent(key+'_'+user.uid);
    const comment=$('#reviewComment').value.trim();
    const review={
      resourceKey:key,uid:user.uid,userName:user.displayName||user.email?.split('@')[0]||'GEOData user',
      ownerUid:record.publisherUid||'',rating:selectedRating,comment,
      updatedAt:serverTimestamp(),createdAt:serverTimestamp()
    };
    const submit=$('button[type="submit"]',event.target);submit.disabled=true;
    try{
      await setDoc(doc(db,'reviews',reviewId),review,{merge:true});
      if(record.publisherUid&&record.publisherUid!==user.uid){
        const notificationId='review_'+reviewId;
        await setDoc(doc(db,'notifications',notificationId),{
          toUid:record.publisherUid,fromUid:user.uid,fromName:review.userName,
          reviewId,resourceKey:key,resourceTitle:record.title||'',rating:selectedRating,
          createdAt:serverTimestamp(),read:false
        });
      }
      toast(t('reviewSaved'));
    }catch(error){console.error('Review save failed:',error);toast(t('fail')+error.message);}
    finally{submit.disabled=false;}
  }
  if(event.target.id==='reportForm'){
    event.preventDefault();
    if(!user){toast(t('reportLogin'));authM.showModal();return;}
    const reason=$('#reportReason').value.trim();
    if(!reason){toast(t('reportReasonRequired'));return;}
    if(!currentReport)return;
    const submit=$('button[type="submit"]',event.target);submit.disabled=true;
    try{
      await addDoc(collection(db,'reports'),{
        resourceKey:currentReport.col+'_'+currentReport.id,resourceCol:currentReport.col,
        resourceId:currentReport.id,resourceTitle:currentReport.title,reason,
        reporterUid:user.uid,reporterEmail:user.email||'',status:'new',createdAt:serverTimestamp()
      });
      $('#reportM').close();event.target.reset();toast(t('reportSaved'));
    }catch(error){console.error('Report save failed:',error);toast(t('fail')+error.message);}
    finally{submit.disabled=false;}
  }
});

/* Translate a submission before it is saved; original text is always retained. *//* Translate a submission before it is saved; original text is always retained. */
async function prepareBilingual(record) {
  const bilingual=await bilingualFields(record);
  return {...record,...bilingual,translationProvider:'MyMemory'};
}
applyTheme(); applyLang(); route();

/* ---------- Firebase ---------- */
const FirebaseURL='https://www.gstatic.com/firebasejs/10.12.0/';
const [{initializeApp},{getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,signOut,updateProfile},{getFirestore,collection,addDoc,onSnapshot,deleteDoc,doc,setDoc,serverTimestamp,query,where,updateDoc,getDocs,getCountFromServer,limit,startAfter}] =
  await Promise.all([import(FirebaseURL+'firebase-app.js'),import(FirebaseURL+'firebase-auth.js'),import(FirebaseURL+'firebase-firestore.js')]);
const firebaseApp=initializeApp({
  apiKey:'AIzaSyCmGYoMqvaTDafiHb7q9Vk7vE4n1w2tWBI',authDomain:'am-a-geo.firebaseapp.com',projectId:'am-a-geo',
  storageBucket:'am-a-geo.firebasestorage.app',messagingSenderId:'724200458201',appId:'1:724200458201:web:14f851dbaf89d49170bbc8'
});
const auth=getAuth(firebaseApp),db=getFirestore(firebaseApp);

const GEO_ASSISTANT_ENDPOINT = 'https://ai.refathany2005.workers.dev/chat';
const geoAssistantHistory=[];
let geoAssistantBusy=false;
const geoAssistantRefs={widget:$('#geoAiWidget'),panel:$('#geoAiPanel'),launcher:$('#geoAiLauncher'),messages:$('#geoAiMessages'),form:$('#geoAiForm'),input:$('#geoAiInput'),send:$('#geoAiSend')};
function updateGeoAssistantTheme(){
  const icon=theme==='dark'?'assets/bot dark.png':'assets/bot light.png';
  if($('#geoAiIcon'))$('#geoAiIcon').src=icon;
  if($('#geoAiHeaderIcon'))$('#geoAiHeaderIcon').src=icon;
}
function updateGeoAssistantLanguage(){
  const copy=lang==='ar'?{
    title:'مساعد GEOData',subtitle:'متخصص في GIS والجيوماتكس',placeholder:'اسأل عن GIS أو البيانات الجغرافية...',
    foot:'إجابات متخصصة في نظم المعلومات الجغرافية فقط',open:'افتح مساعد GEOData',close:'إغلاق',
    welcome:'أهلًا بيك في GEOData 👋 أقدر أساعدك إزاي؟'
  }:{
    title:'GEOData Assistant',subtitle:'GIS & Geomatics specialist',placeholder:'Ask about GIS or geospatial data...',
    foot:'Specialized in GIS and geomatics only',open:'Open GEOData assistant',close:'Close',
    welcome:'Welcome to GEOData 👋 How can I help you?'
  };
  if($('#geoAiTitle'))$('#geoAiTitle').textContent=copy.title;
  if($('#geoAiSubtitle'))$('#geoAiSubtitle').textContent=copy.subtitle;
  const input=$('#geoAiInput'),launcher=$('#geoAiLauncher'),panel=$('#geoAiPanel'),messages=$('#geoAiMessages');
  if(input)input.placeholder=copy.placeholder;
  if($('#geoAiFootnote'))$('#geoAiFootnote').textContent=copy.foot;
  if(launcher)launcher.setAttribute('aria-label',copy.open);
  if($('#geoAiClose'))$('#geoAiClose').setAttribute('aria-label',copy.close);
  if(panel)panel.dir=lang==='ar'?'rtl':'ltr';
  const welcome=messages?.querySelector('[data-welcome]');
  if(welcome)welcome.textContent=copy.welcome;
}
function geoAssistantSafeLink(url){
  try{
    const parsed=new URL(url);
    return parsed.protocol==='https:'?parsed.href:null;
  }catch{return null;}
}
function geoAssistantAppendInline(parent,text,allowedLinks=new Set()){
  const pattern=/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*\n]+)\*|(\x60[^\x60]+\x60)|(https:\/\/[^\s<]+)/g;
  let cursor=0,match;
  while((match=pattern.exec(text))){
    if(match.index>cursor)parent.append(document.createTextNode(text.slice(cursor,match.index)));
    if(match[1]!==undefined){
      const href=geoAssistantSafeLink(match[2]);
      if(href&&allowedLinks.has(href)){
        const link=document.createElement('a');link.href=href;link.target='_blank';link.rel='noopener noreferrer';
        geoAssistantAppendInline(link,match[1],allowedLinks);parent.append(link);
      }else parent.append(document.createTextNode(match[1]));
    }else if(match[3]!==undefined){
      const strong=document.createElement('strong');strong.textContent=match[3];parent.append(strong);
    }else if(match[4]!==undefined){
      const strong=document.createElement('strong');strong.textContent=match[4];parent.append(strong);
    }else if(match[5]!==undefined){
      const em=document.createElement('em');em.textContent=match[5];parent.append(em);
    }else if(match[6]!==undefined){
      const code=document.createElement('code');code.textContent=match[6].slice(1,-1);parent.append(code);
    }else if(match[7]!==undefined){
      let raw=match[7],url=raw;
      while(/[.,،؛!?]$/.test(url))url=url.slice(0,-1);
      const href=geoAssistantSafeLink(url);
      if(href&&allowedLinks.has(href)){
        const link=document.createElement('a');link.href=href;link.target='_blank';link.rel='noopener noreferrer';
        link.textContent=lang==='ar'?'فتح رابط المصدر':'Open source link';parent.append(link);
      }else parent.append(document.createTextNode(lang==='ar'?'[رابط غير متحقق]':'[unverified link]'));
      if(raw.length>url.length)parent.append(document.createTextNode(raw.slice(url.length)));
    }
    cursor=pattern.lastIndex;
  }
  if(cursor<text.length)parent.append(document.createTextNode(text.slice(cursor)));
}
function geoAssistantRenderMarkdown(node,markdown,allowedLinks=new Set()){
  node.replaceChildren();
  const lines=String(markdown||'').replace(/\r/g,'').split('\n');
  let list=null,listType='';
  lines.forEach(line=>{
    if(!line.trim()){list=null;listType='';return;}
    const heading=line.match(/^#{1,3}\s+(.+)$/);
    const bullet=line.match(/^\s*[-*]\s+(.+)$/);
    const numbered=line.match(/^\s*\d+[.)]\s+(.+)$/);
    const quote=line.match(/^>\s?(.*)$/);
    if(heading){
      list=null;listType='';
      const h=document.createElement('strong');h.className='geo-ai-md-heading';
      geoAssistantAppendInline(h,heading[1],allowedLinks);node.append(h);
    }else if(bullet||numbered){
      const type=bullet?'ul':'ol';
      if(!list||listType!==type){list=document.createElement(type);listType=type;node.append(list);}
      const item=document.createElement('li');
      geoAssistantAppendInline(item,(bullet||numbered)[1],allowedLinks);list.append(item);
    }else if(quote){
      list=null;listType='';
      const block=document.createElement('blockquote');geoAssistantAppendInline(block,quote[1],allowedLinks);node.append(block);
    }else{
      list=null;listType='';
      const paragraph=document.createElement('p');geoAssistantAppendInline(paragraph,line,allowedLinks);node.append(paragraph);
    }
  });
}
function geoAssistantAppend(role,message,allowedUrls=[]){
  const node=document.createElement('div');
  node.className='geo-ai-message '+role;
  if(role.split(/\s+/).includes('assistant')&&!role.split(/\s+/).includes('pending')){
    geoAssistantRenderMarkdown(node,message,new Set(allowedUrls.map(geoAssistantSafeLink).filter(Boolean)));
  }else node.textContent=message;
  geoAssistantRefs.messages.append(node);
  geoAssistantRefs.messages.scrollTop=geoAssistantRefs.messages.scrollHeight;
  return node;
}
function geoAssistantAppendResources(records){
  const seen=new Set();
  const usable=(records||[]).filter(item=>{
    try{
      const url=new URL(item.link);
      if(url.protocol!=='https:'||seen.has(url.href))return false;
      seen.add(url.href);return true;
    }catch{return false;}
  });
  if(!usable.length)return;
  const box=document.createElement('div');box.className='geo-ai-resources';
  const heading=document.createElement('div');heading.className='geo-ai-resources-title';
  heading.textContent=lang==='ar'?'مصادر وبدائل مقترحة':'Suggested sources and alternatives';
  box.append(heading);
  usable.slice(0,8).forEach(item=>{
    const group=document.createElement('div');group.className='geo-ai-source';
    const link=document.createElement('a');link.className='geo-ai-resource';link.href=item.link;
    link.target='_blank';link.rel='noopener noreferrer';
    const title=document.createElement('strong');title.textContent=item.title||item.link;
    const meta=document.createElement('span');meta.textContent=[item.sectionLabel,item.source,item.format].filter(Boolean).join(' · ');
    link.append(title,meta);group.append(link);
    if(item.details){
      const details=document.createElement('p');details.className='geo-ai-resource-details';
      details.textContent=String(item.details).slice(0,360);group.append(details);
    }
    const extra=(Array.isArray(item.extraLinks)?item.extraLinks:[]).filter(entry=>{
      try{return new URL(entry.url).protocol==='https:';}catch{return false;}
    }).slice(0,3);
    if(extra.length){
      const links=document.createElement('div');links.className='geo-ai-resource-extra';
      extra.forEach(entry=>{
        const a=document.createElement('a');a.href=entry.url;a.target='_blank';a.rel='noopener noreferrer';
        a.textContent=entry.label||(lang==='ar'?'رابط إضافي':'Additional link');links.append(a);
      });
      group.append(links);
    }
    box.append(group);
  });
  geoAssistantRefs.messages.append(box);
  geoAssistantRefs.messages.scrollTop=geoAssistantRefs.messages.scrollHeight;
}
async function geoAssistantFindResources(){
  const queries=geoAssistantHistory.filter(item=>item.role==='user').slice(-3).map(item=>item.content).filter(Boolean);
  try{
    await ensureGlobalSearchIndex();
    const found=[];
    Object.keys(COLS).forEach(section=>{
      (searchIndexBySection[section]||[]).forEach(record=>{
        const score=Math.max(0,...queries.map(query=>matchScore(record,query)));
        if(score>0)found.push({section,score,record});
      });
    });
    found.sort((a,b)=>b.score-a.score);
    return found.slice(0,5).map(({section,record})=>{
      const title=record['title_'+lang]||record.title||record['title_'+(lang==='ar'?'en':'ar')]||'';
      const details=record['details_'+lang]||record.details||record['details_'+(lang==='ar'?'en':'ar')]||'';
      return {
        section,sectionLabel:t(section),title:String(title).slice(0,220),details:String(details).slice(0,850),
        link:String(record.link||'').slice(0,500),source:String(record.sourceName||record.publisherName||'').slice(0,160),
        format:String(record.format||'').slice(0,80),license:String(record.license||'').slice(0,180),
        coverage:String(record.coverage||'').slice(0,180)
      };
    });
  }catch(error){
    console.warn('GEOData assistant resource lookup failed:',error);
    return [];
  }
}
function openGeoAssistant(){
  geoAssistantRefs.panel.hidden=false;
  geoAssistantRefs.launcher.setAttribute('aria-expanded','true');
  geoAssistantRefs.input?.focus();
}
function closeGeoAssistant(){
  geoAssistantRefs.panel.hidden=true;
  geoAssistantRefs.launcher.setAttribute('aria-expanded','false');
}
geoAssistantRefs.launcher?.addEventListener('click',()=>{
  if(geoAssistantRefs.panel.hidden)openGeoAssistant();else closeGeoAssistant();
});
$('#geoAiClose')?.addEventListener('click',closeGeoAssistant);
geoAssistantRefs.form?.addEventListener('submit',async event=>{
  event.preventDefault();
  const question=geoAssistantRefs.input.value.trim();
  if(!question||geoAssistantBusy)return;
  geoAssistantRefs.input.value='';
  geoAssistantAppend('user',question);
  geoAssistantHistory.push({role:'user',content:question});
  if(!GEO_ASSISTANT_ENDPOINT){
    geoAssistantAppend('assistant',lang==='ar'
      ?'واجهة المساعد جاهزة، لكن لسه محتاجين ننشر Cloudflare Worker ونوصل رابط الخدمة بالموقع. الخطوة دي هنعملها بعد إعداد حساب Cloudflare.'
      :'The assistant interface is ready. We still need to deploy the Cloudflare Worker and connect its URL to this website.');
    return;
  }
  geoAssistantBusy=true;geoAssistantRefs.send.disabled=true;
  const pending=geoAssistantAppend('assistant pending',lang==='ar'?'بفهم سياق كلامك وبدور في GEOData ومصادر البيانات المناسبة…':'Following the conversation and searching GEOData and relevant data catalogs…');
  try{
    const resources=await geoAssistantFindResources();
    const response=await fetch(GEO_ASSISTANT_ENDPOINT,{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({messages:geoAssistantHistory.slice(-10),resources,language:lang})
    });
    const payload=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(payload.error||('HTTP '+response.status));
    pending.remove();
    const answer=String(payload.answer||'').trim()||(lang==='ar'?'معنديش إجابة واضحة للسؤال ده.':'I could not produce a clear answer.');
    const externalSources=Array.isArray(payload.sources)?payload.sources:[];
    const allowedSourceUrls=[...resources,...externalSources].flatMap(item=>[
      item.link,...(Array.isArray(item.extraLinks)?item.extraLinks.map(link=>link.url):[])
    ]).filter(Boolean);
    geoAssistantAppend('assistant',answer,allowedSourceUrls);
    geoAssistantAppendResources([...resources,...externalSources]);
    const sourceContext=externalSources.slice(0,6).map(item=>[
      item.title,item.link,...(Array.isArray(item.extraLinks)?item.extraLinks.map(link=>link.url):[])
    ].filter(Boolean).join(' | ')).join('\n');
    geoAssistantHistory.push({role:'assistant',content:[answer,sourceContext].filter(Boolean).join('\n\n')});
    if(geoAssistantHistory.length>12)geoAssistantHistory.splice(0,geoAssistantHistory.length-12);
  }catch(error){
    pending.remove();
    geoAssistantAppend('assistant',lang==='ar'
      ?'حصلت مشكلة في الاتصال بالمساعد: '+error.message
      :'The assistant could not be reached: '+error.message);
  }finally{
    geoAssistantBusy=false;geoAssistantRefs.send.disabled=false;geoAssistantRefs.input?.focus();
  }
});

let submissions=[],notifications=[],reports=[],unsubscribers=[];
const seenKey=item=>'seen_'+item.id+'_'+item.status;
const readLocal=key=>{try{return localStorage[key];}catch{}};
renderExtra=()=>{
  const notificationRows=notifications.map(item=>({
    id:'notification_'+item.id,status:'notification',
    title:lang==='ar'?'تعليق جديد على: '+(item.resourceTitle||'محتوى'):'New review on: '+(item.resourceTitle||'content'),
    note:(item.fromName||'GEOData user')+' · '+(item.rating||0)+'/5'
  }));
  const submissionRows=submissions.map(item=>({
    id:item.id,status:item.status,title:lang==='ar'?(item.title_ar||item.title):(item.title_en||item.title),
    note:item.note||'',col:item.col
  }));
  const inbox=[...notificationRows,...submissionRows];
  $('#notifL').innerHTML=inbox.length?inbox.map(item=>
    '<div class="nitem"><div><b>'+esc(item.title)+'</b><small>'+esc(item.note||t(item.col||'data'))+'</small></div><span class="st '+esc(item.status)+'">'+(item.status==='notification'?t('reviewsHeading'):t(item.status))+'</span></div>'
  ).join(''):'<p class="empty">'+t('noNotifs')+'</p>';
  const hasUnread=submissions.some(item=>item.status!=='pending'&&!readLocal(seenKey(item)))||
    notifications.some(item=>!readLocal('seen_notification_'+item.id));
  $('#dot').hidden=!hasUnread;
  $('#pc').textContent=admin()?(submissions.length+reports.length||''):'';
  $('#adminList').innerHTML=submissions.length?submissions.map(item=>
    '<article class="card review-card" data-subid="'+esc(item.id)+'"><span class="tag">'+t(item.col)+'</span>'+
    '<h3 data-local-field="title">'+esc(item.title)+'</h3><p data-local-field="details">'+esc(item.details||'')+'</p>'+
    '<small>'+t('by')+': '+esc(item.publisherName)+' ('+esc(item.publisherEmail)+')</small>'+
    '<a class="lnk" href="'+esc(item.link)+'" target="_blank" rel="noopener">'+esc(item.link)+'</a>'+
    '<div class="foot"><button class="btn sm" data-ok="'+esc(item.id)+'">'+t('approve')+'</button><button class="btn sm ghost" data-no="'+esc(item.id)+'">'+t('reject')+'</button></div></article>'
  ).join(''):'<p class="empty">'+t('noPending')+'</p>';
  $('#reportsList').innerHTML=reports.length?reports.map(item=>
    '<article class="card review-card"><span class="tag">'+esc(item.resourceCol||'')+'</span>'+
    '<h3>'+esc(item.resourceTitle||'Reported content')+'</h3><p>'+esc(item.reason||'')+'</p>'+
    '<small>'+esc(item.reporterEmail||item.reporterUid||'')+' · '+esc(resourceDate(item))+'</small>'+
    '<div class="foot">'+(item.resourceId&&item.resourceCol?'<button class="btn sm ghost" data-detail-col="'+esc(item.resourceCol)+'" data-detail-id="'+esc(item.resourceId)+'">'+t('openDetails')+'</button>':'')+
    '<button class="btn sm" data-report-done="'+esc(item.id)+'">'+t('reportDone')+'</button></div></article>'
  ).join(''):'<p class="empty">'+(lang==='ar'?'مفيش بلاغات جديدة.':'No new reports.')+'</p>';
  $$('.review-card[data-subid]').forEach(cardEl=>{const item=submissions.find(x=>x.id===cardEl.dataset.subid);if(item)localizeElements(cardEl,item);});
};
onAuthStateChanged(auth,currentUser=>{
  user=currentUser;paintUser();drawAll();if(user&&authM.open)authM.close();
  unsubscribers.forEach(unsubscribe=>unsubscribe());unsubscribers=[];submissions=[];notifications=[];reports=[];renderExtra();
  if(user){
    const request=admin()?query(collection(db,'submissions'),where('status','==','pending')):query(collection(db,'submissions'),where('uid','==',user.uid));
    unsubscribers.push(onSnapshot(request,snapshot=>{
      submissions=snapshot.docs.map(item=>({id:item.id,...item.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
      renderExtra();
    },error=>console.error('Submission listener:',error)));
    if(!admin()){
      const inboxQuery=query(collection(db,'notifications'),where('toUid','==',user.uid));
      unsubscribers.push(onSnapshot(inboxQuery,snapshot=>{
        notifications=snapshot.docs.map(item=>({id:item.id,...item.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
        renderExtra();
      },error=>console.error('Notification listener:',error)));
    }else{
      const reportQuery=query(collection(db,'reports'),where('status','==','new'));
      unsubscribers.push(onSnapshot(reportQuery,snapshot=>{
        reports=snapshot.docs.map(item=>({id:item.id,...item.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
        renderExtra();
      },error=>console.error('Report listener:',error)));
    }
  }
  if(location.hash==='#admin')route();
});
$('#bell').onclick=()=>{
  $('#notifM').showModal();
  submissions.forEach(item=>item.status!=='pending'&&save(seenKey(item),1));
  notifications.forEach(item=>save('seen_notification_'+item.id,1));
  renderExtra();
};
updateCategoryControls();
Object.keys(COLS).forEach(section=>loadPage(section,1));
authF.onsubmit=async event=>{
  event.preventDefault();
  const form=new FormData(authF),register=authF.dataset.mode==='reg',name=(form.get('name')||'').trim();
  const errorBox=$('#authError'),submit=$('button[type="submit"]',authF);
  errorBox.hidden=true;errorBox.textContent='';
  if(register&&!name){errorBox.textContent=t('needName');errorBox.hidden=false;return;}
  submit.disabled=true;submit.textContent=lang==='ar'?'جارٍ التحقق…':'Please wait…';
  try{
    if(register){
      const credential=await createUserWithEmailAndPassword(auth,form.get('email').trim(),form.get('pass'));
      await updateProfile(credential.user,{displayName:name});user=auth.currentUser;paintUser();toast(t('welcome')+name);
    }else await signInWithEmailAndPassword(auth,form.get('email').trim(),form.get('pass'));
    authM.close();authF.reset();errorBox.hidden=true;
  }catch(error){
    errorBox.textContent=authErrorText(error,register);errorBox.hidden=false;
    console.error('GEOData authentication failed:',error.code||error.message);
  }finally{submit.disabled=false;submit.textContent=t('go');}
};
$('#logout').onclick=()=>signOut(auth);
addF.onsubmit=async event=>{
  event.preventDefault();
  const values=Object.fromEntries(new FormData(addF));
  const record={
    title:values.title.trim(),details:values.details.trim(),link:values.link.trim(),
    publisherName:user.displayName||user.email.split('@')[0],publisherEmail:user.email,publisherUid:user.uid,createdAt:serverTimestamp()
  };
  if(addTo==='data'){record.format=values.format;record.date=values.date;record.category=values.dataCategory||'other';record.categorySource='user';}
  if(addTo==='courses'){record.category=values.courseCategory||'other';record.categorySource='user';record.courseLanguage=values.courseLanguage||'en';}
  const submitButton=$('button[type="submit"]',addF)||$('button.btn',addF);
  submitButton.disabled=true;submitButton.textContent=lang==='ar'?'جارٍ الترجمة والإرسال…':'Translating and submitting…';
  try{
    const localized=await prepareBilingual(record);
    if(admin())await addDoc(collection(db,COLS[addTo]),localized);
    else await addDoc(collection(db,'submissions'),{...localized,col:addTo,uid:user.uid,status:'pending'});
    invalidateSearchIndex();addM.close();addF.reset();toast(t(admin()?'done':'sent'));
  }catch(error){toast(t('fail')+error.message);}
  finally{submitButton.disabled=false;submitButton.textContent=t('publish');}
};
document.addEventListener('click',async event=>{
  const button=event.target.closest('[data-del]');
  if(!button||!admin()||!confirm(t('del')))return;
  const [section,id]=button.dataset.del.split('|');
  try{await deleteDoc(doc(db,COLS[section],id));invalidateSearchIndex();}catch(error){toast(t('fail')+error.message);}
});
document.addEventListener('click',async event=>{
  const done=event.target.closest('[data-report-done]');
  if(!done||!admin())return;
  done.disabled=true;
  try{await updateDoc(doc(db,'reports',done.dataset.reportDone),{status:'reviewed',reviewedAt:serverTimestamp()});}
  catch(error){toast(t('fail')+error.message);done.disabled=false;}
});
document.addEventListener('click',async event=>{
  const approve=event.target.closest('[data-ok]'),reject=event.target.closest('[data-no]');
  if(!(approve||reject)||!admin())return;
  const item=submissions.find(record=>record.id===(approve||reject).dataset[approve?'ok':'no']);
  if(!item)return;
  try{
    if(approve){
      const published={
        title:item.title,details:item.details,link:item.link,publisherName:item.publisherName,publisherEmail:item.publisherEmail,publisherUid:item.publisherUid||item.uid||'',
        title_ar:item.title_ar||'',title_en:item.title_en||'',details_ar:item.details_ar||'',details_en:item.details_en||'',
        format_ar:item.format_ar||'',format_en:item.format_en||'',translationProvider:item.translationProvider||'MyMemory',
        category:item.category||'other',categorySource:item.categorySource||'user',courseLanguage:item.courseLanguage||'',
        createdAt:serverTimestamp()
      };
      if(item.col==='data'){published.format=item.format;published.date=item.date;}
      await addDoc(collection(db,COLS[item.col]),published);
      invalidateSearchIndex();
      await updateDoc(doc(db,'submissions',item.id),{status:'approved'});
    }else{
      const note=prompt(t('reason'));if(note===null)return;
      await updateDoc(doc(db,'submissions',item.id),{status:'rejected',note:note.trim()});
    }
  }catch(error){toast(t('fail')+error.message);}
});
