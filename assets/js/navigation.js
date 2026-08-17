var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?75906f3c40f467d1115f077572aaeb8e";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();

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

  if (!document.querySelector('link[data-footer-v2-styles]')) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = '/assets/css/footer-redesign.css?v=20260817-footer3';
    stylesheet.setAttribute('data-footer-v2-styles', '');
    document.head.appendChild(stylesheet);
  }

  const miniSection = document.querySelector('#miniprogram');
  const oldContactSection = document.querySelector('#contact');
  if (miniSection) {
    document.body.classList.add('homepage-contact-merged');
    const miniCard = miniSection.querySelector('.miniprogram-card') || miniSection.querySelector('.wrap');
    if (miniCard && !miniCard.querySelector('[data-enterprise-contact-card]')) {
      const enterprise = document.createElement('aside');
      enterprise.className = 'miniprogram-enterprise-card';
      enterprise.setAttribute('data-enterprise-contact-card', '');
      enterprise.innerHTML = `
        <div class="miniprogram-enterprise-copy">
          <span class="miniprogram-enterprise-kicker">企业合作 / 深度诊断</span>
          <h3>需要更深入的 GEO 诊断？联系 GeoGi</h3>
          <p>如果你需要品牌全景诊断、竞品分析或持续 GEO 优化，可以直接添加企业微信，或发送邮件联系我们。</p>
          <div class="miniprogram-enterprise-actions">
            <a class="btn btn-primary" href="mailto:contact@geogi.cn">邮件联系 GeoGi</a>
            <span>contact@geogi.cn</span>
          </div>
        </div>
        <div class="miniprogram-enterprise-qr">
          <img src="/assets/contact/geogi-wecom-code.svg" alt="GeoGi 企业微信二维码" width="124" height="124">
          <strong>企业微信</strong>
          <span>扫码添加，沟通项目需求</span>
        </div>`;
      miniCard.appendChild(enterprise);
    }
    if (oldContactSection) oldContactSection.setAttribute('hidden', '');
  }

  const footer = document.querySelector('.site-footer');
  if (!footer) return;

  footer.className = 'site-footer footer-contact-v2';
  footer.innerHTML = `
    <div class="wrap footer-v2-shell">
      <div class="footer-v2-main">
        <div class="footer-v2-brand">
          <div class="footer-v2-brandline">
            <img class="footer-v2-logo" src="/assets/brand/geogi-app-icon.svg" alt="GeoGi" width="44" height="44">
            <span class="footer-v2-name">GeoGi</span>
          </div>
          <p class="footer-v2-tagline">让品牌在 AI 时代被看见、被理解、被选择。</p>
          <p class="footer-v2-desc">品牌 AI 可见度诊断、竞品洞察与持续 GEO 优化。</p>
        </div>

        <div class="footer-v2-grid" aria-label="GeoGi 联系方式">
          <section class="footer-v2-card" aria-labelledby="footer-wecom-title">
            <div class="footer-v2-card-copy"><h3 id="footer-wecom-title">企业微信</h3><p>商务咨询 / 项目沟通</p></div>
            <img class="footer-v2-qr-image" src="/assets/contact/geogi-wecom-code.svg" alt="GeoGi 企业微信二维码" width="82" height="82">
          </section>

          <section class="footer-v2-card email" aria-labelledby="footer-email-title">
            <div class="footer-v2-card-copy"><h3 id="footer-email-title">联系邮箱</h3><p>品牌合作与项目咨询</p></div>
            <div class="footer-v2-email-area"><a class="footer-v2-email" href="mailto:contact@geogi.cn">contact@geogi.cn</a><a class="footer-v2-email-button" href="mailto:contact@geogi.cn">发送邮件</a></div>
          </section>

          <section class="footer-v2-card" aria-labelledby="footer-red-title">
            <div class="footer-v2-card-copy"><h3 id="footer-red-title">小红书</h3><p>发现更多品牌洞察</p></div>
            <img class="footer-v2-qr-image" src="/assets/contact/geogi-rednote-code.svg" alt="GeoGi 小红书二维码" width="82" height="82">
          </section>

          <section class="footer-v2-card" aria-labelledby="footer-account-title">
            <div class="footer-v2-card-copy"><h3 id="footer-account-title">公众号</h3><p>获取最新研究与动态</p></div>
            <img class="footer-v2-qr-image" src="/assets/contact/geogi-official-account-code.svg" alt="GeoGi 公众号二维码" width="82" height="82">
          </section>
        </div>
      </div>

      <div class="footer-v2-bottom">
        <div class="footer-v2-bottom-left"><span>© 2026 GeoGi 几何智引</span><a href="/insights/">GeoGi 研究中心</a></div>
        <a data-icp-filing href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer nofollow">京ICP备2026048011号-2</a>
      </div>
    </div>`;
})();
