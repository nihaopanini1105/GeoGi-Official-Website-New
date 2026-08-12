(function () {
  const panel = document.querySelector('[data-contact-panel]');
  if (!panel) return;

  const renderEmpty = () => {
    panel.innerHTML = '<div class="v9-contact-empty"><strong>官方联系方式正在更新</strong><span>正式入口确认后将在这里开放。</span></div>';
  };

  fetch('data/contact.json', { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('contact config unavailable');
      return response.json();
    })
    .then(function (data) {
      const channels = Array.isArray(data.channels)
        ? data.channels.filter(function (item) {
            return item && item.display === true;
          })
        : [];

      if (!channels.length) {
        renderEmpty();
        return;
      }

      panel.innerHTML = '<div class="v9-contact-grid">' + channels.map(function (channel) {
        const value = channel.value || channel.status || '';
        return [
          '<div class="v9-contact-method">',
          '<strong>' + channel.name + '</strong>',
          '<span>' + channel.purpose + '</span>',
          value ? '<span class="contact-status">' + value + '</span>' : '',
          '</div>'
        ].join('');
      }).join('') + '</div>';
    })
    .catch(renderEmpty);
})();
