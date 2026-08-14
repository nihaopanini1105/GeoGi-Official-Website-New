(function () {
  const grid = document.querySelector('[data-research-grid]');
  if (!grid) return;

  const esc = (value) => String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const schemaNode = document.getElementById('research-collection-schema');

  fetch('../data/research-index.json', { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('research registry unavailable');
      return response.json();
    })
    .then(function (registry) {
      const items = Array.isArray(registry.items)
        ? registry.items.filter(function (item) { return item && item.status === 'published'; })
        : [];

      if (!items.length) return;

      items.sort(function (a, b) {
        return String(b.published_at || '').localeCompare(String(a.published_at || '')) ||
          String(a.title || '').localeCompare(String(b.title || ''), 'zh-CN');
      });

      grid.innerHTML = items.map(function (item) {
        const updated = item.updated_at || item.published_at || '';
        const meta = updated ? '更新 ' + updated : 'GeoGi Research';
        return [
          '<article class="card research-card">',
          '<span class="tag">' + esc(item.category) + '</span>',
          '<h3>' + esc(item.title) + '</h3>',
          '<p>' + esc(item.description) + '</p>',
          '<div class="research-meta"><span class="meta">GeoGi Research</span><span class="meta">' + esc(meta) + '</span></div>',
          '<a class="research-link" href="' + esc(item.slug) + '/index.html">阅读研究 →</a>',
          '</article>'
        ].join('');
      }).join('');

      if (schemaNode) {
        const schema = {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'GeoGi 研究中心',
          url: 'https://www.geogi.cn/insights/',
          description: 'GeoGi 的 GEO、AI 可见度、AI 平台与行业研究中心。',
          publisher: {
            '@type': 'Organization',
            name: 'GeoGi 几何智引',
            url: 'https://www.geogi.cn/'
          },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: items.map(function (item, index) {
              return {
                '@type': 'ListItem',
                position: index + 1,
                url: 'https://www.geogi.cn' + item.canonical_path,
                name: item.title
              };
            })
          }
        };
        schemaNode.textContent = JSON.stringify(schema);
      }
    })
    .catch(function () {
      // Keep the server-rendered fallback cards and schema when runtime data is unavailable.
    });
})();
