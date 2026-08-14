(function () {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('.site-header .nav');

  if (toggle && nav) {
    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.classList.remove('geogi-nav-open');
    };

    toggle.addEventListener('click', function () {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open', !expanded);
      document.body.classList.toggle('geogi-nav-open', !expanded);
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 920) closeMenu();
    });
  }

  const styleId = 'geogi-shared-runtime-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = [
      '.brand-lockup{height:50px;width:auto;max-width:190px;object-fit:contain}',
      '.footer-socials{display:flex;align-items:center;gap:12px;margin-left:auto;position:relative}',
      '.footer-social{position:relative}',
      '.footer-social-trigger{width:42px;height:42px;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(20,124,255,.16);border-radius:999px;background:rgba(255,255,255,.92);color:#071a3d;cursor:pointer;transition:.18s ease;box-shadow:0 8px 18px rgba(7,26,61,.06)}',
      '.footer-social-trigger:hover,.footer-social-trigger:focus-visible{transform:translateY(-1px);border-color:rgba(20,124,255,.34);box-shadow:0 14px 26px rgba(20,124,255,.14);outline:none}',
      '.footer-social-icon{display:inline-flex;width:20px;height:20px}',
      '.footer-social-icon svg{width:20px;height:20px;display:block}',
      '.footer-social-popover{position:absolute;right:0;bottom:calc(100% + 14px);width:220px;padding:14px;border:1px solid #d7e5f7;border-radius:18px;background:#fff;box-shadow:0 20px 42px rgba(7,26,61,.14);opacity:0;visibility:hidden;transform:translateY(8px);transition:.18s ease;pointer-events:none;z-index:25}',
      '.footer-social:hover .footer-social-popover,.footer-social:focus-within .footer-social-popover,.footer-social.is-open .footer-social-popover{opacity:1;visibility:visible;transform:translateY(0);pointer-events:auto}',
      '.footer-social-popover img{width:100%;aspect-ratio:1;object-fit:contain;border-radius:14px;background:#f5f9ff;border:1px solid #edf4ff}',
      '.footer-social-popover strong{display:block;margin-top:10px;color:#071a3d;font-size:15px;font-weight:800}',
      '.footer-social-popover span{display:block;margin-top:4px;color:#657797;font-size:12px;line-height:1.6}',
      '.footer-social-label{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;border:0!important;white-space:nowrap!important}',
      '@media(max-width:920px){.footer-socials{width:100%;justify-content:flex-start;margin-left:0}.footer-social-popover{right:auto;left:0}}',
      '@media(max-width:620px){.brand-lockup{height:44px;max-width:165px}.footer-social-trigger{width:40px;height:40px}.footer-social-popover{width:min(220px,calc(100vw - 40px))}}'
    ].join('');
    document.head.appendChild(style);
  }

  const escapeHtml = function (value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const iconMarkup = function (icon) {
    if (icon === 'wechat') {
      return '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M9.8 5.5c-4 0-7.2 2.6-7.2 5.8 0 1.9 1.1 3.5 2.9 4.6l-.7 2.6 2.9-1.5c.7.1 1.3.2 2 .2 4 0 7.2-2.6 7.2-5.9 0-3.1-3.2-5.8-7.1-5.8Z" fill="currentColor" opacity=".92"/><path d="M16.7 9.4c-2.6 0-4.7 1.7-4.7 3.9 0 1.2.7 2.3 1.8 3l-.4 1.7 1.8-.9c.5.1 1 .2 1.5.2 2.6 0 4.7-1.7 4.7-3.9s-2.1-4-4.7-4Z" fill="#147cff"/><circle cx="7.7" cy="10.8" r="1" fill="#fff"/><circle cx="11.6" cy="10.8" r="1" fill="#fff"/><circle cx="15.4" cy="13.2" r=".9" fill="#fff"/><circle cx="18.1" cy="13.2" r=".9" fill="#fff"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="2.5" y="3" width="19" height="18" rx="5.5" fill="#ff2749"/><path d="M8 8.6c.9-.5 2-.8 3.5-.8 1.6 0 2.8.3 3.7.9.7.4 1.2 1 1.4 1.7h-2.5c-.2-.3-.5-.5-.9-.7-.4-.1-.9-.2-1.6-.2-.7 0-1.2.1-1.6.3-.4.2-.6.4-.6.7 0 .2.1.4.4.5.2.1.7.2 1.3.3l1.9.2c1.3.2 2.3.5 2.9.9.7.5 1 1.2 1 2 0 1.1-.5 1.9-1.5 2.5-1 .6-2.4.9-4.2.9-1.7 0-3-.3-4-.9-1-.6-1.5-1.4-1.7-2.5h2.6c.1.4.4.7.9.9.4.2 1.1.3 1.9.3.8 0 1.4-.1 1.8-.3.4-.2.6-.4.6-.8 0-.2-.1-.4-.4-.6-.2-.1-.7-.2-1.3-.3l-1.9-.2c-1.3-.1-2.2-.4-2.9-.9-.7-.4-1-1.1-1-2 0-1 .4-1.8 1.3-2.4Z" fill="#fff"/></svg>';
  };

  const closeFooterSocials = function () {
    document.querySelectorAll('[data-footer-social].is-open').forEach(function (item) {
      item.classList.remove('is-open');
      const button = item.querySelector('.footer-social-trigger');
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  };

  const initFooterSocials = function (data) {
    const footerWrap = document.querySelector('.site-footer .wrap');
    if (!footerWrap || footerWrap.querySelector('[data-footer-socials]')) return;

    const channels = Array.isArray(data && data.channels) ? data.channels : [];
    const socials = channels.filter(function (item) {
      return item && item.footer_display === true && item.qr_image;
    });
    if (!socials.length) return;

    const container = document.createElement('div');
    container.className = 'footer-socials';
    container.setAttribute('data-footer-socials', '');
    container.setAttribute('aria-label', 'GeoGi 官方社交账号');
    container.innerHTML = socials.map(function (channel) {
      const title = channel.display_name || channel.name || 'GeoGi';
      const subtitle = channel.scan_text || channel.value || '';
      const label = channel.name || '官方账号';
      const qrImage = channel.qr_image || '';
      const icon = channel.icon || channel.id || '';
      return [
        '<div class="footer-social" data-footer-social>',
        '<button class="footer-social-trigger" type="button" aria-expanded="false" aria-haspopup="dialog" aria-label="' + escapeHtml('查看 ' + label + ' 二维码') + '">',
        '<span class="footer-social-icon">' + iconMarkup(icon) + '</span>',
        '<span class="footer-social-label">' + escapeHtml(label) + '</span>',
        '</button>',
        '<div class="footer-social-popover" role="dialog" aria-label="' + escapeHtml(label + ' 二维码') + '">',
        '<img src="' + escapeHtml(qrImage) + '" alt="' + escapeHtml(label + ' 二维码') + '">',
        '<strong>' + escapeHtml(title) + '</strong>',
        subtitle ? '<span>' + escapeHtml(subtitle) + '</span>' : '',
        '</div>',
        '</div>'
      ].join('');
    }).join('');
    footerWrap.appendChild(container);

    container.querySelectorAll('.footer-social-trigger').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        const item = button.closest('[data-footer-social]');
        const willOpen = !item.classList.contains('is-open');
        closeFooterSocials();
        if (willOpen) {
          item.classList.add('is-open');
          button.setAttribute('aria-expanded', 'true');
        }
      });
    });

    document.addEventListener('click', function (event) {
      if (!container.contains(event.target)) closeFooterSocials();
    });
  };

  const configUrl = (function () {
    const canonical = document.querySelector('link[rel="canonical"]');
    try {
      return new URL('/data/contact.json', canonical ? canonical.href : window.location.origin).href;
    } catch (error) {
      return '/data/contact.json';
    }
  })();

  fetch(configUrl, { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('contact config unavailable');
      return response.json();
    })
    .then(initFooterSocials)
    .catch(function () {});
})();
