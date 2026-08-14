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

  const footerWrap = document.querySelector('.site-footer .wrap');
  if (footerWrap && !footerWrap.querySelector('[data-icp-filing]')) {
    const filing = document.createElement('a');
    filing.href = 'https://beian.miit.gov.cn/';
    filing.target = '_blank';
    filing.rel = 'noopener noreferrer nofollow';
    filing.className = 'footer-icp';
    filing.setAttribute('data-icp-filing', '');
    filing.textContent = '京ICP备2026048011号-2';
    footerWrap.appendChild(filing);
  }
})();
