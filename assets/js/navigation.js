(function () {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('.site-header .nav');

  if (toggle && nav) {
    const closeMenu = function () {
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

  const footerWrap = document.querySelector('.site-footer .wrap');
  if (!footerWrap) return;

  if (!footerWrap.querySelector('[data-icp-filing]')) {
    const filing = document.createElement('a');
    filing.href = 'https://beian.miit.gov.cn/';
    filing.target = '_blank';
    filing.rel = 'noopener noreferrer nofollow';
    filing.className = 'footer-icp';
    filing.setAttribute('data-icp-filing', '');
    filing.textContent = '京ICP备2026048011号-2';
    footerWrap.appendChild(filing);
  }

  const styleId = 'geogi-footer-social-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = [
      '.footer-icp{color:#71829e;white-space:nowrap}',
      '.footer-icp:hover{color:#147cff}',
      '.footer-socials{display:flex;align-items:center;gap:10px;margin-left:auto}',
      '.footer-social{position:relative}',
      '.footer-social-trigger{width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(20,124,255,.16);border-radius:999px;background:#fff;color:#071a3d;cursor:pointer;box-shadow:0 8px 18px rgba(7,26,61,.06)}',
      '.footer-social-trigger:hover,.footer-social-trigger:focus-visible{border-color:rgba(20,124,255,.36);color:#147cff;outline:none}',
      '.footer-social-trigger svg{width:20px;height:20px;display:block}',
      '.footer-social-popover{position:absolute;right:0;bottom:calc(100% + 12px);width:210px;padding:13px;border:1px solid #d7e5f7;border-radius:18px;background:#fff;box-shadow:0 20px 42px rgba(7,26,61,.16);opacity:0;visibility:hidden;transform:translateY(6px);transition:.16s ease;pointer-events:none;z-index:80}',
      '.footer-social:hover .footer-social-popover,.footer-social:focus-within .footer-social-popover,.footer-social.is-open .footer-social-popover{opacity:1;visibility:visible;transform:none;pointer-events:auto}',
      '.footer-social-popover img{width:100%;aspect-ratio:1;object-fit:contain;border-radius:12px;background:#fff}',
      '.footer-social-popover strong{display:block;margin-top:9px;color:#071a3d;font-size:14px}',
      '.footer-social-popover span{display:block;margin-top:4px;color:#657797;font-size:12px;line-height:1.55}',
      '.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}',
      '@media(max-width:920px){.footer-socials{width:100%;margin-left:0}.footer-social-popover{right:auto;left:0}}'
    ].join('');
    document.head.appendChild(style);
  }

  const iconMarkup = function (icon) {
    if (icon === 'wechat') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9.5 4C5.4 4 2 6.7 2 10c0 1.9 1.1 3.6 3 4.7l-.7 2.6 2.9-1.5c.7.2 1.5.3 2.3.3h.5c-.2-.6-.3-1.1-.3-1.8 0-3.2 3.1-5.8 7-5.8h.5C16.4 5.9 13.2 4 9.5 4Zm-2.4 5.1a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm4.9 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/><path fill="#147cff" d="M16.6 9.4c-3 0-5.4 2-5.4 4.5s2.4 4.5 5.4 4.5c.6 0 1.2-.1 1.7-.2l2.1 1.1-.5-1.9c1.3-.8 2.1-2.1 2.1-3.5 0-2.5-2.4-4.5-5.4-4.5Zm-1.8 4a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Zm3.6 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Z"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="3" width="20" height="18" rx="6" fill="#ff2749"/><path d="M7 8h10v2H7zm0 3h4v2H7zm6 0h4v2h-4zm-6 3h10v2H7z" fill="#fff"/></svg>';
  };

  const escapeHtml = function (value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const closeSocials = function () {
    document.querySelectorAll('[data-footer-social].is-open').forEach(function (item) {
      item.classList.remove('is-open');
      const button = item.querySelector('button');
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  };

  fetch('/data/contact.json', { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('contact config unavailable');
      return response.json();
    })
    .then(function (data) {
      if (footerWrap.querySelector('[data-footer-socials]')) return;
      const socials = Array.isArray(data.channels) ? data.channels.filter(function (item) {
        return item && item.enabled === true && item.footer_display === true && item.qr_image;
      }) : [];
      if (!socials.length) return;

      const container = document.createElement('div');
      container.className = 'footer-socials';
      container.setAttribute('data-footer-socials', '');
      container.setAttribute('aria-label', 'GeoGi 官方社交账号');
      container.innerHTML = socials.map(function (channel) {
        const name = channel.name || '官方账号';
        const displayName = channel.display_name || 'GeoGi';
        const scanText = channel.scan_text || '扫码查看';
        return '<div class="footer-social" data-footer-social>' +
          '<button class="footer-social-trigger" type="button" aria-expanded="false" aria-label="查看' + escapeHtml(name) + '二维码">' + iconMarkup(channel.icon) + '<span class="sr-only">' + escapeHtml(name) + '</span></button>' +
          '<div class="footer-social-popover" role="dialog" aria-label="' + escapeHtml(name) + '二维码">' +
          '<img src="' + escapeHtml(channel.qr_image) + '" alt="' + escapeHtml(name) + '二维码">' +
          '<strong>' + escapeHtml(displayName) + '</strong><span>' + escapeHtml(scanText) + '</span></div></div>';
      }).join('');
      footerWrap.appendChild(container);

      container.querySelectorAll('.footer-social-trigger').forEach(function (button) {
        button.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
          const item = button.closest('[data-footer-social]');
          const willOpen = !item.classList.contains('is-open');
          closeSocials();
          if (willOpen) {
            item.classList.add('is-open');
            button.setAttribute('aria-expanded', 'true');
          }
        });
      });

      document.addEventListener('click', function (event) {
        if (!container.contains(event.target)) closeSocials();
      });
    })
    .catch(function () {});
})();
