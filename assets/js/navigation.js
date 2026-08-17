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
    stylesheet.href = '/assets/css/footer-redesign.css?v=20260817-footer2';
    stylesheet.setAttribute('data-footer-v2-styles', '');
    document.head.appendChild(stylesheet);
  }

  const footer = document.querySelector('.site-footer');
  if (!footer) return;

  document.body.classList.add('contact-footer-ready');

  footer.className = 'site-footer footer-contact-v2';
  footer.innerHTML = `
    <div class="wrap">
      <div class="footer-v2-shell">
        <div class="footer-v2-main">
          <div class="footer-v2-brand">
            <div class="footer-v2-brandline">
              <img class="footer-v2-logo" src="/assets/brand/geogi-app-icon.svg" alt="GeoGi" width="48" height="48">
              <span class="footer-v2-name">GeoGi</span>
            </div>
            <p class="footer-v2-tagline">让品牌在 AI 时代被看见、被理解、被选择。</p>
            <p class="footer-v2-desc">GeoGi 致力于通过品牌 AI 可见度诊断与洞察，帮助企业在 AI 搜索与生成场景中赢得先机。</p>
            <div class="footer-v2-chips"><span>AI 时代</span><span>数据驱动</span><span>专业可靠</span></div>
          </div>

          <div class="footer-v2-grid" aria-label="GeoGi 联系方式">
            <section class="footer-v2-card" aria-labelledby="footer-wecom-title">
              <div class="footer-v2-card-head"><h3 id="footer-wecom-title">企业微信</h3><span class="footer-v2-channel-icon wecom" aria-hidden="true">企微</span></div>
              <div class="footer-v2-card-body"><p>扫码添加我们<br><span>商务咨询 / 项目沟通</span></p><div class="footer-v2-qr" role="img" aria-label="企业微信二维码待接入">企业微信<br>二维码待接入</div></div>
            </section>

            <section class="footer-v2-card email" aria-labelledby="footer-email-title">
              <div class="footer-v2-card-head"><h3 id="footer-email-title">联系邮箱</h3><span class="footer-v2-channel-icon mail" aria-hidden="true">✉</span></div>
              <div class="footer-v2-card-body"><p>邮箱</p><a class="footer-v2-email" href="mailto:contact@geogi.cn">contact@geogi.cn</a><a class="footer-v2-email-button" href="mailto:contact@geogi.cn">发送邮件</a></div>
            </section>

            <section class="footer-v2-card" aria-labelledby="footer-red-title">
              <div class="footer-v2-card-head"><h3 id="footer-red-title">小红书</h3><span class="footer-v2-channel-icon red" aria-hidden="true">小红书</span></div>
              <div class="footer-v2-card-body"><p>扫码关注我们<br><span>发现更多品牌洞察</span></p><div class="footer-v2-qr" role="img" aria-label="小红书二维码待接入">小红书<br>二维码待接入</div></div>
            </section>

            <section class="footer-v2-card" aria-labelledby="footer-wechat-title">
              <div class="footer-v2-card-head"><h3 id="footer-wechat-title">公众号</h3><span class="footer-v2-channel-icon wechat" aria-hidden="true">微信</span></div>
              <div class="footer-v2-card-body"><p>扫码关注我们<br><span>获取最新研究与动态</span></p><div class="footer-v2-qr" role="img" aria-label="公众号二维码待接入">公众号<br>二维码待接入</div></div>
            </section>
          </div>
        </div>

        <div class="footer-v2-bottom">
          <div class="footer-v2-bottom-left"><span>© 2026 GeoGi 几何智引</span><a href="/insights/">GeoGi 研究中心</a></div>
          <a data-icp-filing href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer nofollow">京ICP备2026048011号-2</a>
        </div>
      </div>
    </div>`;
})();
