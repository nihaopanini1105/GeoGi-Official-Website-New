const fs = require('fs');
const path = require('path');
const root = process.cwd();

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.name === '.git') return [];
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const htmlFiles = walk(root).filter((f) => f.endsWith('.html'));
for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  const relRoot = path.relative(path.dirname(file), root).replace(/\\/g, '/');
  const prefix = relRoot ? relRoot + '/' : '';
  html = html.replace(/<link rel="icon"[^>]*href="[^"]*favicon-32\.png"[^>]*>/gi, `<link rel="icon" type="image/svg+xml" href="${prefix}assets/brand/geogi-app-icon.svg">`);
  html = html.replace(/<link rel="apple-touch-icon"[^>]*href="[^"]*apple-touch-icon\.png"[^>]*>/gi, `<link rel="apple-touch-icon" href="${prefix}assets/brand/geogi-app-icon.svg">`);
  html = html.replace(/geogi-logo-dark\.(?:png|svg)/g, 'geogi-logo-horizontal-navy.svg');
  html = html.replace(/geogi-logo-mark-512\.png/g, 'geogi-app-icon.svg');
  if (html.includes('<footer class="site-footer"><div class="wrap">') && !html.includes('footer-brand-lockup')) {
    html = html.replace('<footer class="site-footer"><div class="wrap">', `<footer class="site-footer"><div class="wrap"><a class="footer-brand" href="${prefix}index.html" aria-label="GeoGi 首页"><img class="footer-brand-lockup" src="${prefix}assets/brand/geogi-logo-horizontal-navy.svg" alt="GeoGi"></a>`);
  }
  fs.writeFileSync(file, html);
}

const cssPath = path.join(root, 'assets/css/v9-final.css');
let css = fs.readFileSync(cssPath, 'utf8');
if (!css.includes('.footer-brand-lockup')) css += '\n.footer-brand{display:inline-flex;align-items:center}.footer-brand-lockup{width:120px;height:auto;object-fit:contain}@media(max-width:620px){.footer-brand-lockup{width:112px}}\n';
fs.writeFileSync(cssPath, css);

const validatorPath = path.join(root, 'scripts/validate-site.js');
let validator = fs.readFileSync(validatorPath, 'utf8');
validator = validator.replace("  'assets/brand/geogi-logo-dark.png',\n  'assets/brand/favicon-32.png',\n  'assets/brand/apple-touch-icon.png',", "  'assets/brand/geogi-logo-horizontal-navy.svg',\n  'assets/brand/geogi-logo-horizontal-white.svg',\n  'assets/brand/geogi-logo-vertical-navy.svg',\n  'assets/brand/geogi-logo-vertical-white.svg',\n  'assets/brand/geogi-wordmark-navy.svg',\n  'assets/brand/geogi-wordmark-white.svg',\n  'assets/brand/geogi-mark.svg',\n  'assets/brand/geogi-app-icon.svg',\n  'assets/brand/manifest.json',");
validator = validator.replace("if (!html.includes('assets/brand/geogi-logo-dark.png')) fail(`official logo missing in ${articlePath}`);", "if (!html.includes('assets/brand/geogi-logo-horizontal-navy.svg')) fail(`canonical official logo missing in ${articlePath}`);");
const brandChecks = `\nlet brandManifest;\ntry { brandManifest = JSON.parse(read('assets/brand/manifest.json')); }\ncatch (error) { fail(\`invalid assets/brand/manifest.json: \${error.message}\`); }\nif (brandManifest && (brandManifest.version !== '1.0.0' || brandManifest.status !== 'canonical')) fail('GeoGi Logo System manifest is not the frozen v1.0 canonical version');\nfor (const retired of ['assets/brand/geogi-logo-dark.png','assets/brand/geogi-logo-dark.svg','assets/brand/geogi-logo-mark-512.png','assets/brand/favicon-32.png','assets/brand/apple-touch-icon.png']) { if (exists(retired)) fail(\`retired brand asset still present: \${retired}\`); }\n`;
if (!validator.includes('let brandManifest;')) validator = validator.replace('const canonicalPages =', brandChecks + '\nconst canonicalPages =');
const legacyChecks = `\n  for (const legacy of ['geogi-logo-dark.png','geogi-logo-dark.svg','geogi-logo-mark-512.png','favicon-32.png','apple-touch-icon.png']) { if (html.includes(legacy)) fail(\`legacy brand reference found in \${htmlFile}: \${legacy}\`); }\n  if (!html.includes('assets/brand/geogi-logo-horizontal-navy.svg')) fail(\`canonical header/footer logo missing in \${htmlFile}\`);\n  if (!html.includes('assets/brand/geogi-app-icon.svg')) fail(\`canonical app icon missing in \${htmlFile}\`);\n`;
if (!validator.includes('legacy brand reference found')) validator = validator.replace("  if (html.includes('contact@geogi.cn')) fail(`deprecated contact email found in ${htmlFile}`);", "  if (html.includes('contact@geogi.cn')) fail(`deprecated contact email found in ${htmlFile}`);" + legacyChecks);
fs.writeFileSync(validatorPath, validator);

for (const old of ['apple-touch-icon.png','favicon-32.png','geogi-logo-dark.png','geogi-logo-dark.svg','geogi-logo-mark-512.png']) {
  const target = path.join(root, 'assets/brand', old);
  if (fs.existsSync(target)) fs.rmSync(target);
}

console.log('GeoGi Logo System v1.0 migration applied.');
