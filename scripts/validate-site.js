const fs = require('fs');
const path = require('path');

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
  'assets/css/site-v9.css',
  'assets/css/v9-final.css',
  'assets/js/navigation.js',
  'assets/js/contact.js',
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

let registry;
let contact;
try { registry = JSON.parse(read('data/research-index.json')); }
catch (error) { fail(`invalid data/research-index.json: ${error.message}`); }
try { contact = JSON.parse(read('data/contact.json')); }
catch (error) { fail(`invalid data/contact.json: ${error.message}`); }

if (registry) {
  if (JSON.stringify(registry.categories) !== JSON.stringify(fixedCategories)) {
    fail('research categories do not match the fixed five-category taxonomy');
  }
  const published = Array.isArray(registry.items)
    ? registry.items.filter((item) => item && item.status === 'published')
    : [];
  if (!published.length) fail('research registry has no published items');

  const insightsIndex = exists('insights/index.html') ? read('insights/index.html') : '';
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

if (contact) {
  const channels = Array.isArray(contact.channels) ? contact.channels : [];
  const email = channels.find((item) => item && item.id === 'email' && item.enabled === true);
  const wecom = channels.find((item) => item && item.id === 'wecom' && item.enabled === true);
  if (!email || email.value !== 'hello@geogi.ai' || email.href !== 'mailto:hello@geogi.ai') {
    fail('official email does not match the approved MiniProgram baseline');
  }
  if (!wecom || wecom.value !== 'GeoGi-Advisor') {
    fail('official WeCom account does not match the approved MiniProgram baseline');
  }
}


let brandManifest;
try { brandManifest = JSON.parse(read('assets/brand/manifest.json')); }
catch (error) { fail(`invalid assets/brand/manifest.json: ${error.message}`); }
if (brandManifest && (brandManifest.version !== '1.0.0' || brandManifest.status !== 'canonical')) fail('GeoGi Logo System manifest is not the frozen v1.0 canonical version');
for (const retired of ['assets/brand/geogi-logo-dark.png','assets/brand/geogi-logo-dark.svg','assets/brand/geogi-logo-mark-512.png','assets/brand/favicon-32.png','assets/brand/apple-touch-icon.png']) { if (exists(retired)) fail(`retired brand asset still present: ${retired}`); }

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
  if (html.includes('contact@geogi.cn')) fail(`deprecated contact email found in ${htmlFile}`);
  for (const legacy of ['geogi-logo-dark.png','geogi-logo-dark.svg','geogi-logo-mark-512.png','favicon-32.png','apple-touch-icon.png']) { if (html.includes(legacy)) fail(`legacy brand reference found in ${htmlFile}: ${legacy}`); }
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

console.log('Website QA passed: routes, metadata, assets, contact baseline, legacy redirects, sitemap and robots are consistent.');
