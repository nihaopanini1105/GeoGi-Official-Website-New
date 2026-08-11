(function () {
  const panel = document.querySelector('[data-contact-panel]');
  if (!panel) return;

  const renderEmpty = () => {
    panel.innerHTML = [
      '<div class="v9-contact-empty">',
      '<strong>官方联系方式正在更新</strong>',
      '<span>企业微信、微信公众号与小红书的正式入口确认后将在这里开放。</span>',
      '</div>'
    ].join('');
  };

  fetch('data/contact.json', { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('contact config unavailable');
      return response.json();
    })
    .then(function (data) {
      const channels = Array.isArray(data.channels)
        ? data.channels.filter(function (item) {
            return item && item.enabled === true && item.asset && item.name;
          })
        : [];

      if (!channels.length) {
        renderEmpty();
        return;
      }

      panel.innerHTML = '<div class="v9-contact-grid">' + channels.map(function (channel) {
        const purpose = channel.purpose || '';
        return [
          '<div class="v9-contact-method">',
          '<img loading="lazy" decoding="async" src="' + channel.asset + '" alt="GeoGi ' + channel.name + '二维码">',
          '<strong>' + channel.name + '</strong>',
          '<span>' + purpose + '</span>',
          '</div>'
        ].join('');
      }).join('') + '</div>';
    })
    .catch(renderEmpty);
})();
