const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = process.cwd();
const errors = [];
const fail = (message) => errors.push(message);
const exists = (rel) => fs.existsSync(path.join(root, rel));
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const fixedCategories = [
  'GEO 基础研究',
  'AI 平台研究',
  'GeoGi 方法论',
  '行业研究',
  '年度研究报告'
];

const requiredFiles = [
  'index.html',
  'insights/index.html',
  'data/research-index.json',
  'data/contact.json',
  'content/research/_template.md',
  'scripts/publish-research.js',
  'assets/css/site-v9.css',
  'assets/css/v9-final.css',
  'assets/js/navigation.js',
  'assets/js/contact.js',
  'assets/js/research-index.js',
  'assets/brand/README.md',
  'assets/brand/geogi-logo-horizontal-navy.svg',
  'assets/brand/geogi-logo-horizontal-white.svg',
  'assets/brand/geogi-logo-vertical-navy.svg',
  'assets/brand/geogi-logo-vertical-white.svg',
  'assets/brand/geogi-wordmark-navy.svg',
  'assets/brand/geogi-wordmark-white.svg',
  'assets/brand/geogi-mark.svg',
  'assets/brand/geogi-app-icon.svg',
  'assets/brand/manifest.json',
  'sitemap.xml',
  'robots.txt'
];

for (const file of requiredFiles) {
  if (!exists(file)) fail(`missing required file: ${file}`);
}

for (const retired of [
  '.github/workflows/logo-system-migration.yml',
  'scripts/migrate-logo-system.js',
  'assets/brand/RELEASE.md',
  'assets/brand/geogi-logo-dark.png',
  'assets/brand/geogi-logo-dark.svg',
  'assets/brand/geogi-logo-mark-512.png',
  'assets/brand/favicon-32.png',
  'assets/brand/apple-touch-icon.png'
]) {
  if (exists(retired)) fail(`retired or one-time file still present: ${retired}`);
}

function gitBlobSha(rel) {
  const data = fs.readFileSync(path.join(root, rel));
  const framed = Buffer.concat([Buffer.from(`blob ${data.length}\0`), data]);
  return crypto.createHash('sha1').update(framed).digest('hex');
}

const canonicalBrandBlobs = {
  'assets/brand/geogi-app-icon.svg': '803a58e48f1ed301e7b958c995a57fe9a818f6c4',
  'assets/brand/geogi-logo-horizontal-navy.svg': '13635b14822e01d49c0f11c1f413d17d671e00e5',
  'assets/brand/geogi-logo-horizontal-white.svg': '18a5f7588fca10eced6555859b65df20af9574e7',
  'assets/brand/geogi-logo-vertical-navy.svg': '05866f6299755c39dea110c1562e3bb5bc557fa2',
  'assets/brand/geogi-logo-vertical-white.svg': '894a0650da229b81c96117dcb66c3a5f76343b12',
  'assets/brand/geogi-mark.svg': 'f1c8582e13f91b385cebb48efa899319d919fffc',
  'assets/brand/geogi-wordmark-navy.svg': 'aea2a726c230627016b48cb25930df4cb6a7b680',
  'assets/brand/geogi-wordmark-white.svg': '4354666332b8316bfbf41375921d6a7e353d6722'
};
for (const [file, expected] of Object.entries(canonicalBrandBlobs)) {
  if (exists(file)) {
    const actual = gitBlobSha(file);
    if (actual !== expected) fail(`canonical brand asset byte drift: ${file} expected ${expected}, got ${actual}`);
  }
}

let registry;
let contact;
let brandManifest;
try { registry = JSON.parse(read('data/research-index.json')); }
catch (error) { fail(`invalid data/research-index.json: ${error.message}`); }
try { contact = JSON.parse(read('data/contact.json')); }
catch (error) { fail(`invalid data/contact.json: ${error.message}`); }
try { brandManifest = JSON.parse(read('assets/brand/manifest.json')); }
catch (error) { fail(`invalid assets/brand/manifest.json: ${error.message}`); }

if (brandManifest && (brandManifest.version !== '1.0.0' || brandManifest.status !== 'canonical')) {
  fail('GeoGi Logo System manifest is not the frozen v1.0 canonical version');
}

if (contact) {
  const channels = Array.isArray(contact.channels) ? contact.channels : [];
  const email = channels.find((item) => item && item.id === 'email');
  if (!email || email.enabled !== true || email.display !== true ||
      email.value !== 'contact@geogi.cn' || email.href !== 'mailto:contact@geogi.cn') {
    fail('verified public email channel must be contact@geogi.cn and enabled/displayed');
  }
  if (channels.some((item) => item && item.id !== 'email')) {
    fail('public contact config contains an unverified non-email channel');
  }
}

const contactJs = exists('assets/js/contact.js') ? read('assets/js/contact.js') : '';
if (contactJs && !contactJs.includes("fetch('/data/contact.json'")) {
  fail('contact.js must fetch the canonical absolute /data/contact.json path');
}

const navigation = exists('assets/js/navigation.js') ? read('assets/js/navigation.js') : '';
if (navigation) {
  for (const invariant of ['京ICP备2026048011号-2', 'https://beian.miit.gov.cn/', 'data-icp-filing']) {
    if (!navigation.includes(invariant)) fail(`navigation/footer invariant missing: ${invariant}`);
  }
  for (const forbidden of ['data-footer-socials', 'footer_display', "fetch('/data/contact.json'"]) {
    if (navigation.includes(forbidden)) fail(`unverified footer social runtime remains: ${forbidden}`);
  }
}

for (const file of ['data/contact.json', 'assets/js/contact.js', 'assets/js/navigation.js', 'index.html']) {
  if (!exists(file)) continue;
  const text = read(file);
  const forbiddenPatterns = [
    /hello@geogi\.ai/i,
    /GeoGi-Advisor/i,
    /data:image\//i,
    /wechat_official/i,
    /xiaohongshu/i
  ];
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(text)) fail(`unverified public contact/social value found in ${file}: ${pattern}`);
  }
}

const insightsIndex = exists('insights/index.html') ? read('insights/index.html') : '';
if (insightsIndex) {
  for (const invariant of [
    'data-research-grid',
    'id="research-collection-schema"',
    '<!-- RESEARCH_ITEMS_START -->',
    '<!-- RESEARCH_ITEMS_END -->',
    '../assets/js/research-index.js'
  ]) {
    if (!insightsIndex.includes(invariant)) fail(`research index missing publishing invariant: ${invariant}`);
  }
}

if (exists('content/research')) {
  const sourceFiles = fs.readdirSync(path.join(root, 'content/research'))
    .filter((name) => name.endsWith('.md') && name !== '_template.md');
  for (const name of sourceFiles) {
    const text = read(`content/research/${name}`);
    const status = (text.match(/^status:\s*["']?([^\n"']+)/m) || [])[1];
    const review = (text.match(/^review_status:\s*["']?([^\n"']+)/m) || [])[1];
    const category = (text.match(/^category:\s*["']?([^\n"']+)/m) || [])[1];
    if (category && !fixedCategories.includes(category.trim())) fail(`invalid research source category in ${name}: ${category.trim()}`);
    if (status && status.trim() === 'published' && (!review || review.trim() !== 'approved')) {
      fail(`published research source must be approved: ${name}`);
    }
  }
}

if (registry) {
  if (JSON.stringify(registry.categories) !== JSON.stringify(fixedCategories)) {
    fail('research categories do not match the fixed five-category taxonomy');
  }
  const published = Array.isArray(registry.items)
    ? registry.items.filter((item) => item && item.status === 'published')
    : [];
  if (!published.length) fail('research registry has no published items');

  const sitemap = exists('sitemap.xml') ? read('sitemap.xml') : '';
  for (const item of published) {
    if (!item.slug || !item.title || !item.description || !item.category || !item.canonical_path) {
      fail(`published research item missing required metadata: ${item.slug || '(unknown slug)'}`);
      continue;
    }
    if (!fixedCategories.includes(item.category)) fail(`invalid category for ${item.slug}: ${item.category}`);
    if (!/^\/insights\/[a-z0-9-]+\/$/.test(item.canonical_path)) {
      fail(`invalid canonical_path for ${item.slug}: ${item.canonical_path}`);
    }

    const articlePath = item.canonical_path.replace(/^\//, '') + 'index.html';
    if (!exists(articlePath)) {
      fail(`published research route missing: ${articlePath}`);
      continue;
    }

    const html = read(articlePath);
    const canonical = `https://www.geogi.cn${item.canonical_path}`;
    if (!html.includes(`<link rel="canonical" href="${canonical}">`) &&
        !html.includes(`<link href="${canonical}" rel="canonical"`)) {
      fail(`canonical mismatch in ${articlePath}`);
    }
    if (!/<title>[^<]+<\/title>/i.test(html)) fail(`title missing in ${articlePath}`);
    if (!/<meta[^>]+name="description"[^>]+content="[^"]+"/i.test(html) &&
        !/<meta[^>]+content="[^"]+"[^>]+name="description"/i.test(html)) {
      fail(`meta description missing in ${articlePath}`);
    }
    if (!html.includes('assets/brand/geogi-logo-horizontal-navy.svg')) fail(`canonical official logo missing in ${articlePath}`);
    if (!html.includes('assets/css/site-v9.css') || !html.includes('assets/css/v9-final.css')) {
      fail(`v9 styles missing in ${articlePath}`);
    }
    if (!insightsIndex.includes(item.slug)) fail(`research index missing published item: ${item.slug}`);
    if (!sitemap.includes(`<loc>${canonical}</loc>`)) fail(`sitemap missing: ${canonical}`);
  }

  if (sitemap.includes('/research/')) fail('sitemap must not contain legacy /research/ URLs');
}

const canonicalPages = ['index.html', 'insights/index.html'];
if (registry && Array.isArray(registry.items)) {
  for (const item of registry.items.filter((x) => x && x.status === 'published')) {
    canonicalPages.push(item.canonical_path.replace(/^\//, '') + 'index.html');
  }
}

const resolveLocal = (htmlFile, value) => {
  const clean = value.split('#')[0].split('?')[0];
  if (!clean || clean.startsWith('#') || /^(https?:|mailto:|tel:|data:|javascript:)/i.test(clean)) return null;
  let target = path.normalize(path.join(path.dirname(htmlFile), clean));
  if (clean.endsWith('/')) target = path.join(target, 'index.html');
  return target;
};

for (const htmlFile of [...new Set(canonicalPages)]) {
  if (!exists(htmlFile)) continue;
  const html = read(htmlFile);
  if (/javascript:void\s*\(0\)/i.test(html)) fail(`javascript:void(0) found in ${htmlFile}`);
  if (/data:image\//i.test(html)) fail(`embedded base64/data image found in ${htmlFile}`);
  for (const legacy of ['geogi-logo-dark.png','geogi-logo-dark.svg','geogi-logo-mark-512.png','favicon-32.png','apple-touch-icon.png']) {
    if (html.includes(legacy)) fail(`legacy brand reference found in ${htmlFile}: ${legacy}`);
  }
  if (!html.includes('assets/brand/geogi-logo-horizontal-navy.svg')) fail(`canonical header/footer logo missing in ${htmlFile}`);
  if (!html.includes('assets/brand/geogi-app-icon.svg')) fail(`canonical app icon missing in ${htmlFile}`);

  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/gi)].map((match) => match[1]);
  for (const ref of refs) {
    const target = resolveLocal(htmlFile, ref);
    if (target && !exists(target)) fail(`broken local reference in ${htmlFile}: ${ref} -> ${target}`);
  }
}

const legacyRoutes = [
  ['research/index.html', 'https://www.geogi.cn/insights/'],
  ['research/what-is-geo/index.html', 'https://www.geogi.cn/insights/what-is-geo-ai-search-era/'],
  ['research/what-is-geogi/index.html', 'https://www.geogi.cn/insights/what-is-geogi/']
];
for (const [file, canonical] of legacyRoutes) {
  if (!exists(file)) continue;
  const html = read(file);
  if (!html.includes('noindex,follow')) fail(`legacy route must be noindex,follow: ${file}`);
  if (!html.includes(canonical)) fail(`legacy route canonical/redirect target mismatch: ${file}`);
}

if (exists('robots.txt')) {
  const robots = read('robots.txt');
  if (!robots.includes('User-agent: *') || !robots.includes('Allow: /') ||
      !robots.includes('Sitemap: https://www.geogi.cn/sitemap.xml')) {
    fail('robots.txt is missing required crawl/sitemap directives');
  }
}

if (errors.length) {
  console.error('\nWebsite QA failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}

console.log('Website QA passed: research publishing, routes, metadata, canonical brand bytes, verified email contact, ICP filing, legacy redirects, sitemap and robots are consistent.');
