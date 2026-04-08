// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
});

// Follower with lag
(function followLoop() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.transform = `translate(${fx - 20}px, ${fy - 20}px)`;
    requestAnimationFrame(followLoop);
})();

// Cursor states
document.querySelectorAll('[data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-' + el.dataset.cursor));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-' + el.dataset.cursor));
});

// ===== THEME TOGGLE =====
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

const getTheme = () => localStorage.getItem('theme') || 'dark';
const setTheme = t => {
    html.dataset.theme = t;
    localStorage.setItem('theme', t);
    themeIcon.textContent = t === 'dark' ? '◐' : '◑';
    themeToggle.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
};
setTheme(getTheme());

themeToggle.addEventListener('click', () => {
    setTheme(html.dataset.theme === 'dark' ? 'light' : 'dark');
});

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
let scrollTick = false;
addEventListener('scroll', () => {
    if (!scrollTick) {
        requestAnimationFrame(() => {
            nav.classList.toggle('scrolled', scrollY > 80);
            scrollTick = false;
        });
        scrollTick = true;
    }
});

// ===== MOBILE MENU =====
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
    const open = menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    mobileMenu.setAttribute('aria-hidden', !open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) menuBtn.click();
});

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.about-statement, .about-sub, .about-cols, .project, .test-item, .contact-heading, .contact-email, .contact-socials, .section-tag, .work-title, .work-cta, .exp-item, .film-card, .films-title, .films-desc, .films-cta, .journal-title, .journal-item, .travel-inner');
revealEls.forEach(el => el.classList.add('reveal'));

const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObs.observe(el));

// ===== CLOCK =====
const clockEl = document.getElementById('clock');
const updateClock = () => {
    if (!clockEl) return;
    clockEl.textContent = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kathmandu',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    }).format(new Date()) + ' NPT';
};
updateClock();
setInterval(updateClock, 1000);

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#') { e.preventDefault(); scrollTo({ top: 0, behavior: 'smooth' }); return; }
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        }
    });
});

// ===== BACK TO TOP =====
document.getElementById('toTop')?.addEventListener('click', e => {
    e.preventDefault();
    scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== PARALLAX ON HERO (subtle) =====
const heroContent = document.querySelector('.hero-content');
const heroMeta = document.querySelector('.hero-meta');
addEventListener('scroll', () => {
    if (scrollY < window.innerHeight) {
        const p = scrollY * 0.3;
        heroContent.style.transform = `translateY(${p}px)`;
        heroMeta.style.opacity = 1 - (scrollY / (window.innerHeight * 0.5));
    }
});
