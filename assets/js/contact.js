(function () {
  const panel = document.querySelector('[data-contact-panel]');
  if (!panel) return;

  const escapeHtml = (value) => String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const renderEmpty = () => {
    panel.innerHTML = '<div class="v9-contact-empty"><strong>官方联系方式正在更新</strong><span>正式入口确认后将在这里开放。</span></div>';
  };

  const copyText = function (value, button) {
    const done = function () {
      const original = button.textContent;
      button.textContent = '已复制';
      setTimeout(function () { button.textContent = original; }, 1600);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value).then(done).catch(function () {});
      return;
    }

    const input = document.createElement('textarea');
    input.value = value;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand('copy');
      done();
    } catch (error) {}
    document.body.removeChild(input);
  };

  fetch('data/contact.json', { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('contact config unavailable');
      return response.json();
    })
    .then(function (data) {
      const channels = Array.isArray(data.channels)
        ? data.channels.filter(function (item) { return item && item.display === true; })
        : [];

      if (!channels.length) {
        renderEmpty();
        return;
      }

      panel.innerHTML = '<div class="v9-contact-grid">' + channels.map(function (channel) {
        const enabled = channel.enabled === true;
        const value = channel.value || channel.status || '';
        let action = '';

        if (enabled && channel.href && /^mailto:/i.test(channel.href)) {
          action = '<a class="contact-action" href="' + escapeHtml(channel.href) + '">发送邮件</a>';
        } else if (enabled && channel.action === 'copy' && channel.value) {
          action = '<button class="contact-action contact-copy" type="button" data-copy-value="' + escapeHtml(channel.value) + '">复制账号</button>';
        }

        return [
          '<div class="v9-contact-method' + (enabled ? '' : ' is-pending') + '">',
          '<strong>' + escapeHtml(channel.name) + '</strong>',
          '<span>' + escapeHtml(channel.purpose) + '</span>',
          value ? '<span class="contact-status">' + escapeHtml(value) + '</span>' : '',
          action,
          '</div>'
        ].join('');
      }).join('') + '</div>';

      panel.querySelectorAll('[data-copy-value]').forEach(function (button) {
        button.addEventListener('click', function () {
          copyText(button.getAttribute('data-copy-value'), button);
        });
      });
    })
    .catch(renderEmpty);
})();
