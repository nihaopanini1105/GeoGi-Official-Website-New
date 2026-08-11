const fs = require('fs');
const targets = ['index.html','insights/index.html'];
let failed = false;
for (const file of targets) {
  if (!fs.existsSync(file)) {
    console.error(`missing ${file}`);
    failed = true;
    continue;
  }
  const html = fs.readFileSync(file,'utf8');
  if (!html.includes('GeoGi')) {
    console.error(`brand missing ${file}`);
    failed = true;
  }
}
process.exit(failed ? 1 : 0);
