(function () {
    'use strict';

    var root = document.documentElement;

    /* ---------- Theme toggle ---------- */
    var themeToggle = document.getElementById('themeToggle');
    var media = window.matchMedia('(prefers-color-scheme: dark)');

    function syncThemeLabel() {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        themeToggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    }
    syncThemeLabel();

    themeToggle.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('jw-theme', next); } catch (e) { /* private mode */ }
        syncThemeLabel();
    });

    // Follow the OS only while the visitor has not made an explicit choice.
    media.addEventListener('change', function (e) {
        var stored = null;
        try { stored = localStorage.getItem('jw-theme'); } catch (err) { /* ignore */ }
        if (stored) return;
        root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        syncThemeLabel();
    });

    /* ---------- Mobile drawer ---------- */
    var nav = document.getElementById('nav');
    var toggle = document.getElementById('navToggle');
    var drawer = document.getElementById('navDrawer');

    function setDrawer(open) {
        drawer.classList.toggle('is-open', open);
        nav.classList.toggle('is-menu-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    }

    toggle.addEventListener('click', function () {
        setDrawer(toggle.getAttribute('aria-expanded') !== 'true');
    });

    drawer.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () { setDrawer(false); });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            setDrawer(false);
            toggle.focus();
        }
    });

    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (e) {
        if (e.matches) setDrawer(false);
    });

    /* ---------- Scrolled nav state + reading progress ---------- */
    var progress = document.getElementById('navProgress');
    var ticking = false;

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            var y = window.scrollY;
            nav.classList.toggle('is-scrolled', y > 8);

            var scrollable = document.documentElement.scrollHeight - window.innerHeight;
            var pct = scrollable > 0 ? Math.min(y / scrollable, 1) * 100 : 0;
            progress.style.width = pct + '%';

            ticking = false;
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();

    /* ---------- Copy email ---------- */
    var copyBtn = document.getElementById('copyEmail');
    if (copyBtn && navigator.clipboard) {
        copyBtn.addEventListener('click', function () {
            navigator.clipboard.writeText(copyBtn.dataset.copy).then(function () {
                copyBtn.classList.add('is-copied');
                copyBtn.setAttribute('aria-label', 'Email address copied');
                window.setTimeout(function () {
                    copyBtn.classList.remove('is-copied');
                    copyBtn.setAttribute('aria-label', 'Copy email address');
                }, 1800);
            });
        });
    } else if (copyBtn) {
        copyBtn.remove();
    }


    /* ---------- Certificate lightbox ---------- */
    var lightbox = document.getElementById('lightbox');
    var lbImg = document.getElementById('lightboxImg');
    var lbCaption = document.getElementById('lightboxCaption');
    var lbOpen = document.getElementById('lightboxOpen');
    var lbClose = document.getElementById('lightboxClose');
    var lbReturnTo = null;

    // `source` carries the image data; `returnTo` is what regains focus on
    // close, which differs when the footer link opens the card's preview.
    function openLightbox(source, returnTo) {
        lbReturnTo = returnTo || source;
        var full = source.dataset.full;
        lbImg.src = full;
        lbImg.alt = source.querySelector('img').alt;
        lbCaption.textContent = source.dataset.caption || '';
        lbOpen.href = full;

        lightbox.hidden = false;
        document.body.classList.add('is-locked');
        // next frame, so the opacity transition actually runs
        requestAnimationFrame(function () { lightbox.classList.add('is-open'); });
        lbClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        document.body.classList.remove('is-locked');
        window.setTimeout(function () {
            lightbox.hidden = true;
            lbImg.src = '';
        }, 250);
        if (lbReturnTo) { lbReturnTo.focus(); lbReturnTo = null; }
    }

    document.querySelectorAll('.cert__preview').forEach(function (btn) {
        btn.addEventListener('click', function () { openLightbox(btn); });
    });

    // "View certificate" in a card footer opens that same card's scan.
    document.querySelectorAll('.cert__open').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var preview = btn.closest('.cert').querySelector('.cert__preview');
            if (preview) openLightbox(preview, btn);
        });
    });

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
        // backdrop only — clicks on the image or bar should not dismiss
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });

    /* ---------- Reveal on scroll ---------- */
    var revealables = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        var revealer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                el.classList.add('is-visible');
                revealer.unobserve(el);

                // Drop the stagger delay once played, so it does not also
                // delay this element's hover transitions from then on.
                window.setTimeout(function () { el.style.transitionDelay = ''; }, 900);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealables.forEach(function (el, i) {
            el.style.transitionDelay = (i % 3) * 70 + 'ms';
            revealer.observe(el);
        });
    } else {
        revealables.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* ---------- Highlight the section in view ---------- */
    var sections = document.querySelectorAll('main section[id]');
    var linksById = new Map();

    document.querySelectorAll('.nav__link').forEach(function (link) {
        var id = link.getAttribute('href').slice(1);
        if (!linksById.has(id)) linksById.set(id, []);
        linksById.get(id).push(link);
    });

    if ('IntersectionObserver' in window && sections.length) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var active = linksById.get(entry.target.id);
                if (!active) return;
                linksById.forEach(function (group) {
                    group.forEach(function (link) { link.classList.remove('is-active'); });
                });
                active.forEach(function (link) { link.classList.add('is-active'); });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        sections.forEach(function (section) { spy.observe(section); });
    }
})();
