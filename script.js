// ===== PRELOADER =====
document.body.style.overflow = 'hidden';
const preloader = document.getElementById('preloader');
const preloaderCounter = document.getElementById('preloaderCounter');
let loadProgress = 0;

function updateLoader() {
    loadProgress += Math.floor(Math.random() * 18) + 4;
    if (loadProgress > 100) loadProgress = 100;
    
    preloaderCounter.textContent = loadProgress.toString().padStart(2, '0');

    if (loadProgress < 100) {
        setTimeout(updateLoader, Math.floor(Math.random() * 80) + 30);
    } else {
        setTimeout(() => {
            preloader.classList.add('done');
            document.body.style.overflow = '';
            setTimeout(() => {
                document.body.classList.add('loaded');
                setTimeout(() => preloader.remove(), 1200);
            }, 600); 
        }, 400);
    }
}
updateLoader();

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

const getTheme = () => localStorage.getItem('theme') || 'light';
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

// ===== NAV SCROLL & SCROLL TOP =====
const nav = document.getElementById('nav');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const progressCircle = document.getElementById('progressCircle');
let lastY = window.scrollY;
let scrollTick = false;

window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    
    // Scroll progress circle
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (currentY / totalHeight) * 283; // 283 is circle circumference
    if (progressCircle) progressCircle.style.strokeDashoffset = 283 - progress;
    
    // Visibility of scroll top button
    if (scrollTopBtn) {
        scrollTopBtn.classList.toggle('visible', currentY > 500);
    }

    if (!scrollTick) {
        requestAnimationFrame(() => {
            // Apply blurred background if not at absolute top
            nav.classList.toggle('scrolled', currentY > 50);

            // Re-evaluating navigation hide/show logic - user wants it fixed or top-left.
            // Let's keep it fixed at top for usability but premium design.
            
            lastY = currentY;
            scrollTick = false;
        });
        scrollTick = true;
    }
});

scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== LOCATION GLITCH =====
const locationText = document.getElementById('locationText');
if (locationText) {
    const locations = [
        { name: "Kathmandu, Nepal", type: "Work" },
        { name: "Pokhara, Nepal", type: "Home" }
    ];
    let locIndex = 0;
    
    setInterval(() => {
        locationText.classList.add('glitch-active');
        setTimeout(() => {
            locIndex = (locIndex + 1) % locations.length;
            const fullText = `${locations[locIndex].name} (${locations[locIndex].type})`;
            locationText.textContent = fullText;
            locationText.setAttribute('data-text', fullText);
            setTimeout(() => {
                locationText.classList.remove('glitch-active');
            }, 300);
        }, 400);
    }, 5000);
}

// ===== DISTANCE GLITCH =====
const distanceVal = document.getElementById('distanceVal');
const distanceLbl = document.getElementById('distanceLbl');
if (distanceVal && distanceLbl) {
    const distData = [
        { val: "15,506", lbl: "Miles", color: "" },
        { val: "24,954", lbl: "Km", color: "var(--accent)" }
    ];
    let distIndex = 0;
    
    setTimeout(() => {
        setInterval(() => {
            distanceVal.classList.add('glitch-active');
            setTimeout(() => {
                distIndex = (distIndex + 1) % distData.length;
                distanceVal.textContent = distData[distIndex].val;
                distanceVal.setAttribute('data-text', distData[distIndex].val);
                distanceVal.style.color = distData[distIndex].color || '';
                distanceLbl.textContent = distData[distIndex].lbl;
                setTimeout(() => {
                    distanceVal.classList.remove('glitch-active');
                }, 300);
            }, 400);
        }, 5500);
    }, 2000);
}

// ===== MOBILE MENU =====
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn?.addEventListener('click', () => {
    const open = menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    mobileMenu.setAttribute('aria-hidden', !open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
});

mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) menuBtn.click();
});

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.about-statement, .about-sub, .about-cols, .project, .test-item, .contact-heading, .contact-email, .contact-socials, .section-tag, .work-title, .work-cta, .exp-item, .film-card, .films-title, .films-desc, .films-cta, .journal-title, .journal-item, .bites-inner, .bite-card, .aviation-header, .av-card, .aviation-codes, .quote-inner, .edu-item, .reel-card, .cv-content');
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
        if (a.hasAttribute('data-carousel')) return;
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

// ===== PARALLAX ON HERO (subtle) =====
const heroContent = document.querySelector('.hero-content');
const heroMeta = document.querySelector('.hero-meta');
addEventListener('scroll', () => {
    if (scrollY < window.innerHeight) {
        const p = scrollY * 0.3;
        if (heroContent) heroContent.style.transform = `translateY(${p}px)`;
        if (heroMeta) heroMeta.style.opacity = 1 - (scrollY / (window.innerHeight * 0.5));
    }
});

// ===== CV MODAL & FALLBACK =====
const cvModal = document.getElementById('cvModal');
const viewCvBtn = document.getElementById('viewCvBtn');
const openCvPreview = document.getElementById('openCvPreview');
const cvClose = document.getElementById('cvClose');
const cvIframe = document.getElementById('cvIframe');

function openCv() {
    cvModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (cvIframe) cvIframe.src = 'assets/Shishir_Acharya_CV.pdf';
}

viewCvBtn?.addEventListener('click', openCv);
openCvPreview?.addEventListener('click', openCv);

cvClose?.addEventListener('click', () => {
    cvModal.classList.remove('active');
    document.body.style.overflow = '';
    if (cvIframe) cvIframe.src = '';
});

// ===== LIGHTBOX CAROUSEL =====
const lightbox = document.getElementById('lightbox');
const lightboxTrack = document.getElementById('lightboxTrack');
const lightboxIndicators = document.getElementById('lightboxIndicators');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

const carouselData = {
    "boarding-pass": [
        "assets/Boarding Pass/1.jpg"
    ],
    "ai-and-autopilot": [
        "assets/AI and Autopilot/1.jpg",
        "assets/AI and Autopilot/2.jpg",
        "assets/AI and Autopilot/3.jpg",
        "assets/AI and Autopilot/4.jpg",
        "assets/AI and Autopilot/5.jpg",
        "assets/AI and Autopilot/6.jpg",
        "assets/AI and Autopilot/7.jpg",
        "assets/AI and Autopilot/8.jpg",
        "assets/AI and Autopilot/9.jpg",
        "assets/AI and Autopilot/10.jpg",
        "assets/AI and Autopilot/11.jpg",
        "assets/AI and Autopilot/12.jpg"
    ],
    "bilingual-signages": [
        "assets/Bilingual Signages/1.jpg",
        "assets/Bilingual Signages/2.jpg",
        "assets/Bilingual Signages/3.jpg",
        "assets/Bilingual Signages/4.jpg",
        "assets/Bilingual Signages/5.jpg",
        "assets/Bilingual Signages/6.jpg",
        "assets/Bilingual Signages/7.jpg",
        "assets/Bilingual Signages/8.jpg",
        "assets/Bilingual Signages/9.jpg"
    ],
    "people-and-culture": [
        "assets/People and Culture/1.jpg",
        "assets/People and Culture/2.jpg"
    ],
    "helmet-law": [
        "assets/Helmet Law/NEW/1.jpg",
        "assets/Helmet Law/NEW/2.jpg",
        "assets/Helmet Law/NEW/3.jpg",
        "assets/Helmet Law/NEW/4.jpg",
        "assets/Helmet Law/NEW/5.jpg",
        "assets/Helmet Law/NEW/6.jpg",
        "assets/Helmet Law/NEW/7.jpg",
        "assets/Helmet Law/NEW/8.jpg",
        "assets/Helmet Law/NEW/9.jpg",
        "assets/Helmet Law/NEW/10.jpg",
        "assets/Helmet Law/NEW/11.jpg"
    ],
    "airport-ux": [
        "assets/Airport UX/1.jpg",
        "assets/Airport UX/2.jpg",
        "assets/Airport UX/3.jpg",
        "assets/Airport UX/4.jpg",
        "assets/Airport UX/5.jpg",
        "assets/Airport UX/6.jpg",
        "assets/Airport UX/7.jpg",
        "assets/Airport UX/8.jpg",
        "assets/Airport UX/9.jpg",
        "assets/Airport UX/10.jpg",
        "assets/Airport UX/11.jpg",
        "assets/Airport UX/12.jpg",
        "assets/Airport UX/13.jpg",
        "assets/Airport UX/14.jpg"
    ],
    "accessible-theater": [
        "assets/Accessible Theater/1.jpg",
        "assets/Accessible Theater/2.jpg",
        "assets/Accessible Theater/3.jpg",
        "assets/Accessible Theater/4.jpg",
        "assets/Accessible Theater/5.jpg",
        "assets/Accessible Theater/6.jpg",
        "assets/Accessible Theater/7.jpg",
        "assets/Accessible Theater/8.jpg",
        "assets/Accessible Theater/9.jpg",
        "assets/Accessible Theater/10.jpg"
    ],
    "genz-duo": [
        "assets/GenZ Duo/1.jpg",
        "assets/GenZ Duo/2.jpg",
        "assets/GenZ Duo/3.jpg",
        "assets/GenZ Duo/4.jpg"
    ]
};

let currentSlideIndex = 0;

function openLightbox(id) {
    if (!carouselData[id] || !lightboxTrack) return;
    const images = carouselData[id];
    lightboxTrack.innerHTML = '';
    images.forEach((src, index) => {
        const slide = document.createElement('div');
        slide.className = 'lightbox-slide';
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Slide ${index + 1}`;
        slide.appendChild(img);
        lightboxTrack.appendChild(slide);
    });

    const counter = document.getElementById('lightboxCounter');
    if (counter) counter.textContent = `1 / ${images.length}`;
    
    currentSlideIndex = 0;
    lightboxTrack.scrollLeft = 0;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Show indicators momentarily
    const indicatorsWrapper = document.querySelector('.lightbox-indicators-wrapper');
    if (indicatorsWrapper) {
        indicatorsWrapper.classList.add('show');
        clearTimeout(window.indicatorTimeout);
        window.indicatorTimeout = setTimeout(() => indicatorsWrapper.classList.remove('show'), 2500);
    }
}

function scrollToSlide(index) {
    const slides = Array.from(lightboxTrack.children);
    if (!slides[index]) return;
    slides[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

lightboxTrack?.addEventListener('scroll', () => {
    const width = lightboxTrack.clientWidth;
    const totalSlides = lightboxTrack.children.length;
    currentSlideIndex = Math.round(lightboxTrack.scrollLeft / width);
    
    const counter = document.getElementById('lightboxCounter');
    if (counter) counter.textContent = `${currentSlideIndex + 1} / ${totalSlides}`;

    // Show indicators on scroll
    const indicatorsWrapper = document.querySelector('.lightbox-indicators-wrapper');
    if (indicatorsWrapper) {
        indicatorsWrapper.classList.add('show');
        clearTimeout(window.indicatorTimeout);
        window.indicatorTimeout = setTimeout(() => indicatorsWrapper.classList.remove('show'), 2000);
    }
});

lightboxPrev?.addEventListener('click', () => scrollToSlide(currentSlideIndex - 1));
lightboxNext?.addEventListener('click', () => scrollToSlide(currentSlideIndex + 1));

lightboxClose?.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
});

document.querySelectorAll('[data-carousel]').forEach(el => {
    el.addEventListener('click', e => {
        e.preventDefault();
        openLightbox(el.dataset.carousel);
    });
});

// ===== WEATHER TOOLTIP MOBILE =====
const weatherBadge = document.querySelector('.weather-badge');
if (weatherBadge) {
    weatherBadge.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
            weatherBadge.classList.toggle('active');
            e.stopPropagation();
        }
    });
    document.addEventListener('click', () => weatherBadge.classList.remove('active'));
}

// ===== GAMIFIED MOMO EASTER EGG =====
const momoBtn = document.getElementById('momoEasterEgg');
const momoToast = document.getElementById('momoToast');
let momoTimeout;
let momoClicks = parseInt(localStorage.getItem('momo_happiness') || '0');
let momoLastClick = 0;

function triggerConfetti(amount = 20) {
    const btnRect = momoBtn.getBoundingClientRect();
    const centerX = btnRect.left + btnRect.width / 2;
    const centerY = btnRect.top;

    for (let i = 0; i < amount; i++) {
        const p = document.createElement('div');
        p.className = 'momo-particle';
        const angle = (Math.random() * Math.PI) + Math.PI;
        const speed = 2 + Math.random() * 4;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        Object.assign(p.style, {
            position: 'fixed',
            left: centerX + 'px',
            top: centerY + 'px',
            width: '6px',
            height: '6px',
            backgroundColor: ['#d4b578', '#fff', '#c45c4a', '#7a5a0d'][Math.floor(Math.random() * 4)],
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: '10000',
            transition: 'all 1s ease-out'
        });
        
        document.body.appendChild(p);
        
        requestAnimationFrame(() => {
            p.style.transform = `translate(${vx * 50}px, ${vy * 50}px) scale(0)`;
            p.style.opacity = '0';
        });
        
        setTimeout(() => p.remove(), 1000);
    }
}

if (momoBtn && momoToast) {
    const states = [
        { title: "You found the momo", sub: "+10 happiness", particles: 15 },
        { title: "You really like momo huh", sub: "+20 happiness", particles: 25 },
        { title: "Okay... now you're just farming happiness", sub: "+30 happiness", particles: 40 },
        { title: "Alright, that's enough momo for now", sub: "Momo storage full", particles: 5 }
    ];

    momoBtn.addEventListener('click', () => {
        const now = Date.now();
        if (now - momoLastClick < 400) return;
        momoLastClick = now;

        momoClicks++;
        localStorage.setItem('momo_happiness', momoClicks % 4); // Keep in loop but reset sometimes

        const stateIndex = Math.min(momoClicks - 1, states.length - 1);
        const state = states[stateIndex];

        clearTimeout(momoTimeout);
        momoToast.querySelector('strong').textContent = state.title;
        momoToast.querySelector('span').textContent = state.sub;
        momoToast.classList.add('show');
        
        triggerConfetti(state.particles);

        momoTimeout = setTimeout(() => {
            momoToast.classList.remove('show');
            if (momoClicks >= 4) momoClicks = 0; // Reset for loop
        }, 2500);
    });
}

// ===== NEPALI NEW YEAR FOOTER =====
const footerCopy = document.getElementById('footerCopy');
const footerWrap = document.querySelector('.footer-copy-wrap');
if (footerCopy && footerWrap) {
    const copyData = [
        { en: "© 2026 Shishir Acharya", ne: "© २०८३ शिशिर आचार्य" }
    ];
    let isNepali = false;
    
    // Glitch loop every 6 seconds
    setInterval(() => {
        footerCopy.classList.add('glitch-active');
        setTimeout(() => {
            isNepali = !isNepali;
            const newText = isNepali ? copyData[0].ne : copyData[0].en;
            footerCopy.textContent = newText;
            footerCopy.setAttribute('data-text', newText);
            setTimeout(() => {
                footerCopy.classList.remove('glitch-active');
            }, 300);
        }, 400);
    }, 6000);

    // Trigger confetti on hover if someone is "curious"
    footerWrap.addEventListener('mouseenter', () => {
        if (typeof triggerConfetti === 'function') {
            // Repurpose the momo confetti logic but slightly different colors for festive feel
            const rect = footerCopy.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top;
            
            for (let i = 0; i < 15; i++) {
                const p = document.createElement('div');
                const angle = (Math.random() * Math.PI) + Math.PI;
                const speed = 1.5 + Math.random() * 3;
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed;
                
                Object.assign(p.style, {
                    position: 'fixed',
                    left: centerX + 'px',
                    top: centerY + 'px',
                    width: '5px',
                    height: '5px',
                    backgroundColor: ['#d4b578', '#ff7b4d', '#ffffff', '#e8d5b0'][Math.floor(Math.random() * 4)],
                    borderRadius: '2px',
                    pointerEvents: 'none',
                    zIndex: '10000',
                    transition: 'all 0.8s ease-out'
                });
                
                document.body.appendChild(p);
                requestAnimationFrame(() => {
                    p.style.transform = `translate(${vx * 40}px, ${vy * 40}px) rotate(${Math.random() * 360}deg) scale(0)`;
                    p.style.opacity = '0';
                });
                setTimeout(() => p.remove(), 800);
            }
        }
    });
}

