/*
 * Render del bloque "destacados" (últimos posts de la misma categoría) y
 * highlight de la sección activa en el TOC del sidebar.
 * Lee window.CAP_POSTS (generado por scripts/build-blog-data.js).
 */
(function () {
  var CATS = {
    envios: {
      label: 'Envíos',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(147,197,253,0.7)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 18H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h11v12"/><path d="M14 9h4l3 3v5a1 1 0 0 1-1 1h-2"/><circle cx="7.5" cy="18.5" r="1.5"/><circle cx="17.5" cy="18.5" r="1.5"/></svg>'
    },
    guias: {
      label: 'Guías',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(147,197,253,0.7)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>'
    },
    woocommerce: {
      label: 'WooCommerce',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(147,197,253,0.7)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>'
    },
    comparativas: {
      label: 'Comparativas',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(147,197,253,0.7)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="m3 7 4 9-8 0z" transform="translate(2 0)"/><path d="M16 16 20 7l4 9z"/><path d="M3 7h18"/><path d="M7 7 5 4M17 7l2-3"/></svg>'
    }
  };

  function esc(s) {
    return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function currentSlug() {
    return (location.pathname.split('/').pop() || '').toLowerCase();
  }

  function renderRelated() {
    var mount = document.getElementById('cap-related');
    if (!mount) return;
    var section = mount.closest('.blog-related');
    var posts = window.CAP_POSTS || [];
    var slug = currentSlug();
    var me = posts.filter(function (x) { return x.u.toLowerCase() === slug; })[0];
    var cat = me ? me.c : null;

    var list = posts
      .filter(function (x) { return x.u.toLowerCase() !== slug && (!cat || x.c === cat); })
      .sort(function (a, b) { return b.dt.localeCompare(a.dt); })
      .slice(0, 3);

    // Fallback: si la categoría tiene menos de 3, completar con lo más nuevo del blog.
    if (list.length < 3) {
      var have = {};
      list.forEach(function (p) { have[p.u] = 1; });
      have[slug] = 1;
      posts.slice().sort(function (a, b) { return b.dt.localeCompare(a.dt); }).forEach(function (p) {
        if (list.length < 3 && !have[p.u]) { have[p.u] = 1; list.push(p); }
      });
    }

    if (!list.length) { if (section) section.style.display = 'none'; return; }

    var catInfo = CATS[cat] || { label: 'el blog' };
    var titleEl = document.querySelector('.blog-related__title');
    if (titleEl && cat) titleEl.textContent = 'Más sobre ' + catInfo.label;

    mount.innerHTML = list.map(function (p) {
      var ic = (CATS[p.c] || {}).icon || '';
      return '<article class="blog-card">'
        + '<a href="' + esc(p.u) + '" class="blog-card__thumb blog-card__thumb--' + esc(p.c) + '">' + ic + '</a>'
        + '<div class="blog-card__body">'
        + '<h2><a href="' + esc(p.u) + '">' + esc(p.t) + '</a></h2>'
        + '<p>' + esc(p.d) + '</p>'
        + '<a href="' + esc(p.u) + '" class="blog-card__link">Leer art&iacute;culo &rarr;</a>'
        + '</div></article>';
    }).join('');
  }

  function slugify(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50);
  }

  // Construye el TOC del sidebar a partir de los H2 del contenido (asigna IDs si faltan).
  function buildToc() {
    var nav = document.querySelector('.blog-sidebar .blog-toc');
    var main = document.querySelector('.blog-main');
    if (!nav || !main) return;
    var hs = [].slice.call(main.querySelectorAll('h2')).filter(function (h) {
      return (h.textContent || '').trim();
    });
    if (hs.length < 2) { nav.style.display = 'none'; return; }
    var used = {};
    var lis = hs.map(function (h) {
      var id = h.id || slugify(h.textContent) || 'sec';
      if (used[id]) { var n = 2; while (used[id + '-' + n]) n++; id = id + '-' + n; }
      used[id] = 1;
      h.id = id;
      if (!h.style.scrollMarginTop) h.style.scrollMarginTop = '24px';
      var label = h.getAttribute('data-toc') || h.textContent.trim();
      return '<li><a href="#' + id + '">' + esc(label) + '</a></li>';
    }).join('');
    nav.innerHTML = '<p class="blog-toc__title">En esta guía</p><ol>' + lis + '</ol>';
  }

  function initTocCollapse() {
    var ol = document.querySelector('.blog-sidebar .blog-toc ol');
    if (!ol) return;
    var items = [].slice.call(ol.children);
    var SHOW = 4;
    if (items.length - SHOW < 2) return; // no vale la pena colapsar por 1 solo item
    var hidden = items.slice(SHOW);
    hidden.forEach(function (li) { li.hidden = true; });

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'blog-toc__more';
    btn.setAttribute('aria-expanded', 'false');
    var moreLabel = 'Ver ' + hidden.length + ' más';
    btn.textContent = moreLabel;
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      hidden.forEach(function (li) { li.hidden = expanded; });
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      btn.textContent = expanded ? moreLabel : 'Ver menos';
    });
    ol.parentNode.appendChild(btn);
  }

  function initTocSpy() {
    var links = [].slice.call(document.querySelectorAll('.blog-sidebar .blog-toc a[href^="#"]'));
    if (!links.length) return;
    var items = links.map(function (a) {
      return { a: a, el: document.getElementById(a.getAttribute('href').slice(1)) };
    }).filter(function (x) { return x.el; });
    if (!items.length) return;

    var ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY + 130;
      var cur = items[0];
      for (var i = 0; i < items.length; i++) {
        if (items[i].el.offsetTop <= y) cur = items[i];
      }
      links.forEach(function (a) { a.classList.remove('is-active'); });
      if (cur) cur.a.classList.add('is-active');
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  function init() { renderRelated(); buildToc(); initTocCollapse(); initTocSpy(); }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
