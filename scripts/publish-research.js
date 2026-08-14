const fs = require('fs');
const path = require('path');

const root = process.cwd();
const input = process.argv[2];
if (!input) {
  console.error('Usage: node scripts/publish-research.js content/research/<article>.md');
  process.exit(2);
}

const fixedCategories = [
  'GEO 基础研究',
  'AI 平台研究',
  'GeoGi 方法论',
  '行业研究',
  '年度研究报告'
];

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inline = (s) => esc(s)
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>');

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error('missing YAML frontmatter');
  const meta = {};
  for (const raw of match[1].split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf(':');
    if (idx < 1) throw new Error(`invalid frontmatter line: ${raw}`);
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value === 'true' || value === 'false') value = value === 'true';
    else if (value.startsWith('[')) value = JSON.parse(value);
    else value = value.replace(/^['"]|['"]$/g, '');
    meta[key] = value;
  }
  return { meta, body: match[2].trim() };
}

function validate(meta, body) {
  const errors = [];
  const required = ['slug','title','description','deck','category','author','published_at','updated_at','status','review_status'];
  for (const key of required) if (!meta[key]) errors.push(`missing ${key}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.slug || '')) errors.push('slug must be lowercase kebab-case');
  if (!fixedCategories.includes(meta.category)) errors.push('category must use the fixed five-category taxonomy');
  if (meta.status !== 'published') errors.push('status must be published');
  if (meta.review_status !== 'approved') errors.push('review_status must be approved before publishing');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.published_at || '')) errors.push('published_at must be YYYY-MM-DD');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.updated_at || '')) errors.push('updated_at must be YYYY-MM-DD');
  if (!Array.isArray(meta.tags)) errors.push('tags must be a JSON-style array in frontmatter');
  if (String(meta.description || '').length < 30) errors.push('description is too short');
  if (String(meta.title || '').length < 8) errors.push('title is too short');
  if (!body || body.length < 200) errors.push('article body is too short');
  if (errors.length) throw new Error(errors.join('; '));
}

function renderMarkdown(body) {
  const lines = body.split(/\r?\n/);
  const out = [];
  let paragraph = [];
  let list = [];
  const flushParagraph = () => {
    if (!paragraph.length) return;
    out.push(`<p>${inline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (!list.length) return;
    out.push('<ul>' + list.map((x) => `<li>${inline(x)}</li>`).join('') + '</ul>');
    list = [];
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushParagraph(); flushList(); continue; }
    if (line.startsWith('### ')) { flushParagraph(); flushList(); out.push(`<h3>${inline(line.slice(4))}</h3>`); continue; }
    if (line.startsWith('## ')) { flushParagraph(); flushList(); out.push(`<h2>${inline(line.slice(3))}</h2>`); continue; }
    if (line.startsWith('- ')) { flushParagraph(); list.push(line.slice(2)); continue; }
    if (line.startsWith('> ')) { flushParagraph(); flushList(); out.push(`<div class="article-callout"><span>${inline(line.slice(2))}</span></div>`); continue; }
    paragraph.push(line);
  }
  flushParagraph(); flushList();
  return out.join('\n');
}

function articleHtml(meta, bodyHtml) {
  const canonical = `https://www.geogi.cn/insights/${meta.slug}/`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.description,
    datePublished: meta.published_at,
    dateModified: meta.updated_at,
    author: {'@type':'Organization','name':meta.author},
    publisher: {'@type':'Organization','name':'GeoGi 几何智引','logo':{'@type':'ImageObject','url':'https://www.geogi.cn/assets/brand/geogi-mark.svg'}},
    mainEntityOfPage: canonical
  };
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(meta.title)}｜GeoGi Research</title>
<meta name="description" content="${esc(meta.description)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="canonical" href="${canonical}">
<link rel="icon" type="image/svg+xml" href="../../assets/brand/geogi-app-icon.svg">
<link rel="apple-touch-icon" href="../../assets/brand/geogi-app-icon.svg">
<link rel="stylesheet" href="../../assets/css/site-v9.css">
<link rel="stylesheet" href="../../assets/css/v9-final.css">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:url" content="${canonical}">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body class="article-page">
<header class="site-header"><div class="wrap"><a class="brand" href="../../index.html" aria-label="GeoGi 首页"><img class="brand-lockup" src="../../assets/brand/geogi-logo-horizontal-navy.svg" alt="GeoGi"></a><button class="mobile-nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="打开主导航">菜单</button><nav id="main-nav" class="nav" aria-label="主导航"><a href="../../index.html#about">GeoGi 是什么</a><a href="../../index.html#services">产品服务</a><a href="../index.html">研究中心</a><a class="nav-cta" href="../../index.html#contact">联系 GeoGi</a></nav></div></header>
<main>
<section class="article-header"><div class="wrap article-shell"><div class="breadcrumbs"><a href="../../index.html">首页</a><span>/</span><a href="../index.html">研究中心</a><span>/</span><span>${esc(meta.category)}</span></div><span class="article-kicker">${esc(meta.category)}</span><h1>${esc(meta.title)}</h1><p class="article-deck">${esc(meta.deck)}</p><div class="article-meta"><span>${esc(meta.author)}</span><span>发布：${esc(meta.published_at)}</span><span>更新：${esc(meta.updated_at)}</span></div></div></section>
<section class="article-body"><div class="wrap"><article class="article-content">${bodyHtml}</article></div></section>
</main>
<footer class="site-footer"><div class="wrap"><a class="footer-brand" href="../../index.html" aria-label="GeoGi 首页"><img class="footer-brand-lockup" src="../../assets/brand/geogi-logo-horizontal-navy.svg" alt="GeoGi"></a><span>© 2026 GeoGi 几何智引</span><span><a href="../index.html">GeoGi 研究中心</a></span></div></footer>
<script src="../../assets/js/navigation.js" defer></script>
</body>
</html>\n`;
}

function updateRegistry(meta) {
  const file = path.join(root, 'data/research-index.json');
  const registry = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (JSON.stringify(registry.categories) !== JSON.stringify(fixedCategories)) throw new Error('research category taxonomy drift');
  const item = {
    slug: meta.slug,
    title: meta.title,
    description: meta.description,
    category: meta.category,
    tags: meta.tags,
    status: 'published',
    published_at: meta.published_at,
    updated_at: meta.updated_at,
    canonical_path: `/insights/${meta.slug}/`,
    featured: meta.featured === true
  };
  const items = Array.isArray(registry.items) ? registry.items.filter((x) => x.slug !== meta.slug) : [];
  items.push(item);
  items.sort((a,b) => String(b.published_at).localeCompare(String(a.published_at)) || a.title.localeCompare(b.title, 'zh-CN'));
  registry.items = items;
  registry.updated = meta.updated_at;
  fs.writeFileSync(file, JSON.stringify(registry, null, 2) + '\n');
  return registry;
}

function publishedItems(registry) {
  return (Array.isArray(registry.items) ? registry.items : [])
    .filter((item) => item && item.status === 'published')
    .sort((a,b) => String(b.published_at || '').localeCompare(String(a.published_at || '')) || String(a.title || '').localeCompare(String(b.title || ''), 'zh-CN'));
}

function renderResearchCards(registry) {
  return publishedItems(registry).map((item) => {
    const updated = item.updated_at || item.published_at || '';
    return `      <article class="card research-card"><span class="tag">${esc(item.category)}</span><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><div class="research-meta"><span class="meta">GeoGi Research</span><span class="meta">更新 ${esc(updated)}</span></div><a class="research-link" href="${esc(item.slug)}/index.html">阅读研究 →</a></article>`;
  }).join('\n');
}

function renderCollectionSchema(registry) {
  const items = publishedItems(registry);
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'GeoGi 研究中心',
    url: 'https://www.geogi.cn/insights/',
    description: 'GeoGi 的 GEO、AI 可见度、AI 平台与行业研究中心。',
    publisher: {'@type':'Organization','name':'GeoGi 几何智引','url':'https://www.geogi.cn/'},
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://www.geogi.cn${item.canonical_path}`,
        name: item.title
      }))
    }
  };
}

function updateResearchIndexPage(registry) {
  const file = path.join(root, 'insights/index.html');
  let html = fs.readFileSync(file, 'utf8');
  const start = '<!-- RESEARCH_ITEMS_START -->';
  const end = '<!-- RESEARCH_ITEMS_END -->';
  if (!html.includes(start) || !html.includes(end)) throw new Error('research index publish markers missing');
  html = html.replace(new RegExp(`${start}[\\s\\S]*?${end}`), `${start}\n${renderResearchCards(registry)}\n      ${end}`);
  const schema = JSON.stringify(renderCollectionSchema(registry));
  const schemaPattern = /<script id="research-collection-schema" type="application\/ld\+json">[\s\S]*?<\/script>/;
  if (!schemaPattern.test(html)) throw new Error('research collection schema node missing');
  html = html.replace(schemaPattern, `<script id="research-collection-schema" type="application/ld+json">${schema}</script>`);
  fs.writeFileSync(file, html);
}

function updateSitemap(registry) {
  const lastmod = registry.updated;
  const urls = [
    {loc:'https://www.geogi.cn/', lastmod},
    {loc:'https://www.geogi.cn/insights/', lastmod},
    ...publishedItems(registry).map((x) => ({loc:`https://www.geogi.cn${x.canonical_path}`, lastmod:x.updated_at || x.published_at}))
  ];
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map((u) => `  <url>\n    <loc>${esc(u.loc)}</loc>\n    <lastmod>${esc(u.lastmod)}</lastmod>\n  </url>`).join('\n') + '\n</urlset>\n';
  fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
}

const sourcePath = path.resolve(root, input);
if (!sourcePath.startsWith(path.join(root, 'content', 'research') + path.sep)) throw new Error('input must be under content/research/');
const source = fs.readFileSync(sourcePath, 'utf8');
const {meta, body} = parseFrontmatter(source);
validate(meta, body);
const bodyHtml = renderMarkdown(body);
const outDir = path.join(root, 'insights', meta.slug);
fs.mkdirSync(outDir, {recursive:true});
fs.writeFileSync(path.join(outDir, 'index.html'), articleHtml(meta, bodyHtml));
const registry = updateRegistry(meta);
updateResearchIndexPage(registry);
updateSitemap(registry);
console.log(`Published ${meta.slug}: article HTML, research registry, research index/schema and sitemap updated.`);
