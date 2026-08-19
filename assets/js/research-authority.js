(function () {
  const grids = Array.prototype.slice.call(document.querySelectorAll('[data-authority-grid]'));
  if (!grids.length) return;

  const esc = (value) => String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const safeUrl = (value) => {
    const url = String(value || '');
    return /^https:\/\//i.test(url) ? url : '#';
  };

  const renderCard = (item) => {
    const date = item.published_at || item.updated_at || '';
    return [
      '<article class="authority-card" data-authority-type="' + esc(item.type) + '">',
      '<span class="authority-type" data-type="' + esc(item.type) + '">' + esc(item.type) + '</span>',
      '<div class="authority-source">' + esc(item.publisher) + (date ? ' · ' + esc(date) : '') + '</div>',
      '<h3>' + esc(item.title) + '</h3>',
      '<p>' + esc(item.summary) + '</p>',
      '<p class="authority-relevance"><strong>与 GEO 的关系：</strong>' + esc(item.geo_relevance) + '</p>',
      '<div class="authority-actions"><a href="' + esc(safeUrl(item.official_url)) + '" target="_blank" rel="noopener noreferrer">查看官方原文 ↗</a></div>',
      '</article>'
    ].join('');
  };

  fetch('../data/research-authority-library.json', { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('authority library unavailable');
      return response.json();
    })
    .then(function (library) {
      const allItems = Array.isArray(library.items) ? library.items.filter(Boolean) : [];
      if (!allItems.length) return;

      grids.forEach(function (grid) {
        const limit = parseInt(grid.getAttribute('data-authority-limit') || '0', 10);
        const initial = limit > 0 ? allItems.slice(0, limit) : allItems;
        grid.innerHTML = initial.map(renderCard).join('');
      });

      const filters = Array.prototype.slice.call(document.querySelectorAll('[data-authority-filter]'));
      filters.forEach(function (button) {
        button.addEventListener('click', function () {
          const type = button.getAttribute('data-authority-filter') || '全部';
          filters.forEach(function (node) { node.classList.toggle('is-active', node === button); });
          grids.forEach(function (grid) {
            const limit = parseInt(grid.getAttribute('data-authority-limit') || '0', 10);
            let items = type === '全部' ? allItems : allItems.filter(function (item) { return item.type === type; });
            if (limit > 0) items = items.slice(0, limit);
            grid.innerHTML = items.length ? items.map(renderCard).join('') : '<div class="authority-empty">当前分类暂无资料。</div>';
          });
        });
      });

      const schemaNode = document.getElementById('authority-library-schema');
      if (schemaNode) {
        const schema = {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'GeoGi 权威资料库',
          itemListElement: allItems.map(function (item, index) {
            return {
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'CreativeWork',
                name: item.title,
                publisher: { '@type': 'Organization', name: item.publisher },
                url: item.official_url
              }
            };
          })
        };
        schemaNode.textContent = JSON.stringify(schema);
      }
    })
    .catch(function () {
      // Keep server-rendered fallback cards if runtime data is unavailable.
    });
})();
