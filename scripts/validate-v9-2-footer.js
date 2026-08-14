const fs = require('fs');

const errors = [];
const fail = (message) => errors.push(message);
const read = (file) => fs.readFileSync(file, 'utf8');

let contact;
try {
  contact = JSON.parse(read('data/contact.json'));
} catch (error) {
  fail(`invalid data/contact.json: ${error.message}`);
}

const navigation = read('assets/js/navigation.js');
const expectedIcp = '京ICP备2026048011号-2';
if (!navigation.includes(expectedIcp)) fail('ICP filing number missing from shared footer runtime');
if (!navigation.includes('https://beian.miit.gov.cn/')) fail('MIIT filing link missing from shared footer runtime');
if (!navigation.includes("fetch('/data/contact.json'")) fail('footer social runtime must load contact config from canonical root path');
if (!navigation.includes('data-footer-socials')) fail('footer social duplicate-injection guard missing');

if (contact) {
  const channels = Array.isArray(contact.channels) ? contact.channels : [];
  for (const id of ['wechat_official', 'xiaohongshu']) {
    const channel = channels.find((item) => item && item.id === id);
    if (!channel) {
      fail(`missing public QR channel: ${id}`);
      continue;
    }
    if (channel.enabled !== true || channel.display !== true || channel.footer_display !== true) {
      fail(`public QR channel not enabled for footer: ${id}`);
    }
    if (!/^data:image\/(webp|png|jpeg);base64,/i.test(channel.qr_image || '')) {
      fail(`public QR channel missing embedded verified QR image: ${id}`);
    }
    if (!channel.display_name || !channel.scan_text || !channel.icon) {
      fail(`public QR channel missing display metadata: ${id}`);
    }
  }
}

if (errors.length) {
  console.error('\nWebsite v9.2 footer QA failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}

console.log('Website v9.2 footer QA passed: ICP filing and public QR footer controls are configured.');
