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
 
// --- DOM Refs ---
const idCardSystem = document.getElementById('idCardSystem');
const idCard = document.getElementById('idCard');
const idCardWrapper = document.querySelector('.id-card-wrapper');
const lanyard = document.querySelector('.lanyard-string');
const glassToggle = document.getElementById('glassToggle');
const stickToggle = document.getElementById('stickToggle');

if (idCard && idCardWrapper) {
    // Physics state
    let angle = 0;
    let angularVel = 0;
    const GRAVITY = 0.15;
    const DAMPING = 0.97;
    const MAX_ANGLE = 8;
    const IDLE_AMP = 0.3;
    const IDLE_SPEED = 0.0008;

    let targetTiltX = 0, targetTiltY = 0;
    let currentTiltX = 0, currentTiltY = 0;
    let isHovering = false;

    // Glass Toggle
    glassToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        idCard.classList.toggle('is-glass');
    });

    function getIdleSway() {
        return Math.sin(Date.now() * IDLE_SPEED) * IDLE_AMP;
    }

    // Physics loop
    function physicsLoop() {
        const restoring = -GRAVITY * Math.sin(angle * Math.PI / 180);
        angularVel += restoring;
        angularVel *= DAMPING;
        angle += angularVel;
        angle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, angle));

        const idleSway = Math.abs(angularVel) < 0.01 ? getIdleSway() : 0;
        const finalAngle = angle + idleSway;

        idCardWrapper.style.transform = `rotate(${finalAngle}deg)`;

        if (lanyard) {
            lanyard.style.transform = `skewX(${finalAngle * 0.3}deg)`;
        }

        currentTiltX += (targetTiltX - currentTiltX) * 0.08;
        currentTiltY += (targetTiltY - currentTiltY) * 0.08;
        idCard.style.transform = `rotateX(${currentTiltX}deg) rotateY(${currentTiltY}deg)`;

        requestAnimationFrame(physicsLoop);
    }
    physicsLoop();

    // Apply force based on pointer position
    function applyForce(clientX, clientY) {
        const rect = idCardSystem.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height;
        const dx = clientX - cardCenterX;
        const dy = clientY - cardCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 400) {
            const influence = 1 - (dist / 400);
            angularVel += (dx * 0.0003) * influence;

            if (isHovering) {
                const cardRect = idCard.getBoundingClientRect();
                const cx = cardRect.left + cardRect.width / 2;
                const cy = cardRect.top + cardRect.height / 2;
                targetTiltX = Math.max(-12, Math.min(12, (cy - clientY) / 15));
                targetTiltY = Math.max(-12, Math.min(12, (clientX - cx) / 15));
            }
        }
    }

    // Mouse
    document.addEventListener('mousemove', (e) => applyForce(e.clientX, e.clientY));

    // Touch
    document.addEventListener('touchmove', (e) => {
        const t = e.touches[0];
        if (t) applyForce(t.clientX, t.clientY);
    }, { passive: true });

    // Hover
    idCard.addEventListener('mouseenter', () => { isHovering = true; });
    idCard.addEventListener('mouseleave', () => {
        isHovering = false;
        targetTiltX = 0;
        targetTiltY = 0;
    });

    // --- Stick Interaction ---
    stickToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isStuck = idCardSystem.classList.toggle('is-stuck');
        const span = stickToggle.querySelector('span');
        if (span) span.textContent = isStuck ? 'HANG' : 'STOW';
        
        // Reset physics to prevent "weird" sway while stuck
        if (isStuck) {
            angle = 0;
            angularVel = 0;
        }
    });

    // Flip on click
    idCard.addEventListener('click', (e) => {
        // Don't flip if stuck
        if (idCardSystem.classList.contains('is-stuck')) return;
        
        idCard.classList.toggle('is-flipped');
        angularVel += (Math.random() - 0.5) * 3;
    });

    // Scroll trigger
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                idCardSystem.classList.add('is-active');
            } else {
                idCardSystem.classList.remove('is-active');
            }
        });
    }, { threshold: 0.3 });

    const aboutSection = document.getElementById('about');
    if (aboutSection) observer.observe(aboutSection);
}

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

const getTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    // Auto-adapt to time if no preference saved
    const hour = new Date().getHours();
    return (hour < 7 || hour >= 19) ? 'dark' : 'light'; // Dark from 7 PM to 7 AM
};

const setTheme = (t, save = true) => {
    html.dataset.theme = t;
    if (save) localStorage.setItem('theme', t);
    themeIcon.textContent = t === 'dark' ? '◐' : '◑';
    themeToggle.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
};

setTheme(getTheme(), !!localStorage.getItem('theme'));

// Shooting Stars logic
const starsContainer = document.getElementById('starsContainer');
function createShootingStar() {
    if (html.dataset.theme !== 'dark') return;
    
    const star = document.createElement('div');
    star.className = 'star';
    const trail = document.createElement('div');
    trail.className = 'star-trail';
    star.appendChild(trail);
    
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * (window.innerHeight * 0.5);
    
    star.style.left = x + 'px';
    star.style.top = y + 'px';
    star.style.animation = `shooting-star ${1.5 + Math.random()}s linear forwards`;
    
    starsContainer.appendChild(star);
    setTimeout(() => star.remove(), 3000);
}

// Rarely trigger shooting stars
setInterval(() => {
    if (Math.random() > 0.7) createShootingStar();
}, 8000);

themeToggle.addEventListener('click', () => {
    const newTheme = html.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
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
            nav.classList.toggle('scrolled', currentY > 50);
            
            // Highlight nav items on scroll
            const sections = document.querySelectorAll('section[id], main[id]');
            let currentSec = "";
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (currentY >= sectionTop - 100) {
                    currentSec = section.getAttribute("id");
                }
            });

            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSec}`) {
                    link.classList.add('active');
                }
            });

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
            // If contact heading, start text rotation
            if (entry.target.classList.contains('contact-heading')) {
                startContactRotation(entry.target);
            }
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

function startContactRotation(heading) {
    const textSpan = heading.querySelector('.ch-text');
    if (!textSpan) return;
    
    const phrases = [
        "Have an <em>idea</em>?",
        "Share a <em>vision</em>?",
        "Need a <em>design</em>?",
        "Build a <em>product</em>?",
        "Start a <em>project</em>?"
    ];
    let idx = 0;
    
    setInterval(() => {
        textSpan.classList.add('glitch-active');
        setTimeout(() => {
            idx = (idx + 1) % phrases.length;
            textSpan.innerHTML = phrases[idx];
            // Ensure data-text is updated for the glitch effect to match
            textSpan.setAttribute('data-text', textSpan.textContent);
            setTimeout(() => {
                textSpan.classList.remove('glitch-active');
            }, 300);
        }, 400);
    }, 4500);
}

revealEls.forEach(el => revealObs.observe(el));

// ===== CLOCK & WEATHER =====
const clockEl = document.getElementById('clock');
const weatherInfo = document.getElementById('weatherInfo');

const updateClock = () => {
    if (!clockEl) return;
    clockEl.textContent = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kathmandu',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    }).format(new Date()) + ' NPT';
};

const getWeatherIcon = (code) => {
    if (code === 0) return '☀️'; // Clear
    if ([1, 2, 3].includes(code)) return '🌤️'; // Partly cloudy
    if ([45, 48].includes(code)) return '🌫️'; // Fog
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return '🌧️'; // Rain/Drizzle
    if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️'; // Snow
    if ([95, 96, 99].includes(code)) return '⛈️'; // Thunderstorm
    return '⛅';
};

const updateWeather = async () => {
    if (!weatherInfo) return;
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=27.7172&longitude=85.3240&current=temperature_2m,weather_code');
        const data = await response.json();
        const temp = Math.round(data.current.temperature_2m);
        const icon = getWeatherIcon(data.current.weather_code);
        weatherInfo.textContent = `${icon} ${temp}°C`;
    } catch (err) {
        console.error('Weather fetch failed:', err);
    }
};

updateClock();
setInterval(updateClock, 1000);
updateWeather();
setInterval(updateWeather, 900000); // Update every 15 minutes


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
            cursor: 'pointer',
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
const newYearTrigger = document.getElementById('newYearTrigger');
const newYearToast = document.getElementById('newYearToast');
let newYearTimeout;

if (footerCopy && newYearTrigger) {
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

    // Show Toast and Confetti on first scroll to bottom? 
    // No, user wants to remove HNY animation and interaction.
    // Keeping only the date toggle logic below.
}



// ===== ENHANCED MUSIC EXPERIENCE =====
(function() {
    'use strict';

    // --- DOM Refs ---
    const $ = id => document.getElementById(id);
    const audio        = $('siteAudio');
    const player       = $('floatingPlayer');
    const playPauseBtn = $('playerPlayPause');
    const closeBtn     = $('playerClose');
    const muteBtn      = $('playerMute');
    const progressBar  = $('playerProgressBar');
    const progressThumb= $('playerProgressThumb');
    const progressWrap = $('pillProgressContainer');
    const trackImg     = $('playerTrackImg');
    const trackTitle   = $('playerTrackTitle');
    const trackArtist  = $('playerTrackArtist');
    const pillImgWrap  = $('pillImgWrap');
    const pillTooltip  = $('pillTooltip');
    const heroMeta     = $('spotifyMeta');
    const heroLabel    = $('spotifyMetaLabel');
    const heroTrack    = $('spotifyTrackName');
    const volSlider    = $('volumeSlider');
    const volFill      = document.querySelector('.volume-level-fill');

    const state = {
        isPlaying: false,
        isMuted: false,
        duration: 30,
        currentVolume: 100
    };

    // --- Web Audio API for iOS Volume Support ---
    let audioCtx, gainNode, source;
    function initWebAudio() {
        if (audioCtx) return;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioCtx.createGain();
            source = audioCtx.createMediaElementSource(audio);
            source.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            // Sync initial volume
            gainNode.gain.value = state.currentVolume / 100;
        } catch(e) { console.warn('Web Audio API not supported', e); }
    }

    // Initialize Volume Fill
    if (volFill) volFill.style.height = '100%';

    // --- Core Audio Logic ---
    function setPlayState(playing) {
        state.isPlaying = playing;
        const playI  = playPauseBtn?.querySelector('.play-icon');
        const pauseI = playPauseBtn?.querySelector('.pause-icon');
        
        if (playing) {
            initWebAudio();
            
            const startPlay = () => {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.error('Audio playback failed/blocked:', e);
                        setPlayState(false);
                    });
                }
            };

            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume().then(startPlay);
            } else {
                startPlay();
            }

            if (playI)  playI.style.display = 'none';
            if (pauseI) pauseI.style.display = 'block';
            player?.classList.add('is-playing');
            heroMeta?.classList.add('playing');
            if (heroLabel) heroLabel.textContent = 'Designing with 🎵';
        } else {
            audio.pause();
            if (playI)  playI.style.display = 'block';
            if (pauseI) pauseI.style.display = 'none';
            player?.classList.remove('is-playing');
            heroMeta?.classList.remove('playing');
            if (heroLabel) heroLabel.textContent = 'Listening to right now...';
        }
    }

    function playTrack(data) {
        const src = data.audioSrc || data.dataset?.audioSrc;
        if (!src) return;

        const title = data.title || data.dataset?.title;
        const artist = data.artist || data.dataset?.artist;
        const img = data.img || data.dataset?.img;

        if (audio.src === src) {
            setPlayState(!state.isPlaying);
            return;
        }

        // Reset progress
        if (progressBar) progressBar.style.width = '0%';

        audio.src = src;
        // load() is helpful when switching sources for MediaElementSource
        audio.load();

        if (trackImg)    trackImg.src = img;
        if (trackTitle)  trackTitle.textContent = title;
        if (trackArtist) trackArtist.textContent = artist;
        if (heroTrack)   heroTrack.textContent = title;
        
        setPlayState(true);
        showPlayer();

        // Update active highlight in flyout
        document.querySelectorAll('.flyout-track').forEach(t => {
            t.classList.toggle('active', t.dataset.audioSrc === src);
        });
    }

    function showPlayer() {
        player?.classList.add('active');
        player?.setAttribute('aria-hidden', 'false');
    }

    function closePlayer() {
        player?.classList.remove('active');
        player?.setAttribute('aria-hidden', 'true');
        setPlayState(false);
        audio.src = '';
        if (heroLabel) heroLabel.textContent = 'Listening to right now...';
        if (heroTrack) heroTrack.textContent = 'My Top 3 Tracks';
        document.querySelectorAll('.flyout-track').forEach(t => t.classList.remove('active'));
    }

    // --- Volume Logic ---
    function updateVolume(val) {
        const volVal = val / 100;
        
        if (gainNode) {
            // Solution for iOS / Touch and preventing double attenuation
            gainNode.gain.setTargetAtTime(volVal, audioCtx.currentTime, 0.02);
            audio.volume = 1; 
        } else {
            audio.volume = volVal;
        }

        if (volFill) volFill.style.height = val + '%';
        
        const volOn = muteBtn?.querySelector('.vol-on');
        const volOff = muteBtn?.querySelector('.vol-off');
        
        if (val == 0) {
            state.isMuted = true;
            audio.muted = true;
            muteBtn?.classList.add('muted');
            if (volOn) volOn.style.display = 'none';
            if (volOff) volOff.style.display = 'block';
        } else {
            state.isMuted = false;
            audio.muted = false;
            muteBtn?.classList.remove('muted');
            if (volOn) volOn.style.display = 'block';
            if (volOff) volOff.style.display = 'none';
        }
    }

    volSlider?.addEventListener('input', (e) => {
        state.currentVolume = e.target.value;
        updateVolume(state.currentVolume);
    });

    // --- Flyout Listeners ---
    document.querySelectorAll('.flyout-track').forEach(track => {
        track.addEventListener('click', (e) => {
            e.stopPropagation();
            playTrack(track);
            
            // On mobile, close flyout after selection
            if (window.innerWidth <= 900) {
                const flyout = $('spotifyFlyout');
                if (flyout) {
                    flyout.style.opacity = '0';
                    flyout.style.visibility = 'hidden';
                    flyout.style.pointerEvents = 'none';
                    flyout.style.transform = 'translateY(10px) scale(0.98)';
                }
            }
        });
    });

    // --- Hero Click (Toggle Player / Flyout on Mobile) ---
    heroMeta?.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
            // On mobile, toggle flyout visibility if clicking the badge
            const isBadge = e.target.closest('.spotify-badge');
            if (isBadge) {
                const flyout = $('spotifyFlyout');
                if (!flyout) return;
                
                // Use computed style or a class for more robust checking
                const isVisible = flyout.classList.contains('js-visible');
                
                if (isVisible) {
                    flyout.classList.remove('js-visible');
                    flyout.style.opacity = '0';
                    flyout.style.visibility = 'hidden';
                    flyout.style.pointerEvents = 'none';
                    flyout.style.transform = 'translateY(10px) scale(0.98)';
                } else {
                    flyout.classList.add('js-visible');
                    flyout.style.opacity = '1';
                    flyout.style.visibility = 'visible';
                    flyout.style.pointerEvents = 'all';
                    flyout.style.transform = 'translateY(0) scale(1)';
                }
                return;
            }
        }

        // If clicking meta and music is loaded, show player
        if (audio.src && !audio.src.endsWith(window.location.pathname) && audio.src !== window.location.href) {
            showPlayer();
        }
    });

    // --- Controls ---
    const handlePlayPause = (e) => {
        if (e) e.preventDefault();
        // Check if a source is actually set
        const hasSource = audio.src && !audio.src.endsWith(window.location.pathname) && audio.src !== window.location.href;
        if (hasSource) {
            setPlayState(!state.isPlaying);
        }
    };
    
    // Use 'click' for better mobile audio unlocking
    playPauseBtn?.addEventListener('click', handlePlayPause);
    
    closeBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        closePlayer();
    });
    
    muteBtn?.addEventListener('click', () => {
        state.isMuted = !state.isMuted;
        audio.muted = state.isMuted;
        muteBtn?.classList.toggle('muted', state.isMuted);
        
        const volOn = muteBtn.querySelector('.vol-on');
        const volOff = muteBtn.querySelector('.vol-off');
        
        if (state.isMuted) {
            updateVolume(0);
            if (volSlider) volSlider.value = 0;
            if (volOn) volOn.style.display = 'none';
            if (volOff) volOff.style.display = 'block';
        } else {
            const restoreVol = state.currentVolume > 0 ? state.currentVolume : 100;
            updateVolume(restoreVol);
            if (volSlider) volSlider.value = restoreVol;
            if (volOn) volOn.style.display = 'block';
            if (volOff) volOff.style.display = 'none';
        }
    });

    // --- Progress Update ---
    let progressRaf;
    function updateProgress() {
        if (!audio.duration || isDragging) {
            progressRaf = requestAnimationFrame(updateProgress);
            return;
        }
        const pct = (audio.currentTime / audio.duration) * 100;
        if (progressBar) progressBar.style.width = pct + '%';
        progressRaf = requestAnimationFrame(updateProgress);
    }
    audio.addEventListener('play', () => {
        progressRaf = requestAnimationFrame(updateProgress);
    });
    audio.addEventListener('pause', () => {
        cancelAnimationFrame(progressRaf);
    });
    audio.addEventListener('ended', () => {
        // Option: Loop or play next? For now, just reset
        setPlayState(false);
        audio.currentTime = 0;
    });

    // --- Seek ---
    let isDragging = false;
    const seek = (e) => {
        const rect = progressWrap.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        if (clientX === undefined) return;
        
        const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        if (progressBar) progressBar.style.width = (pct * 100) + '%';
        if (!isDragging && audio.duration) audio.currentTime = pct * audio.duration;
    };
    
    progressWrap?.addEventListener('pointerdown', (e) => { 
        if (!audio.src || !audio.duration) return;
        isDragging = true; 
        progressWrap.setPointerCapture(e.pointerId);
        seek(e); 
    });
    progressWrap?.addEventListener('pointermove', (e) => { if (isDragging) seek(e); });
    progressWrap?.addEventListener('pointerup', (e) => { 
        if (isDragging) { 
            isDragging = false; 
            seek(e); 
            progressWrap.releasePointerCapture(e.pointerId);
        } 
    });

    // Tooltip trigger
    pillImgWrap?.addEventListener('click', () => {
        pillTooltip?.classList.add('show');
        setTimeout(() => pillTooltip?.classList.remove('show'), 2000);
    });

    // --- Navigation Hide on Scroll ---
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            nav.classList.remove('nav-hidden');
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            // Scrolling down
            nav.classList.add('nav-hidden');
        } else if (currentScroll < lastScroll) {
            // Scrolling up
            nav.classList.remove('nav-hidden');
        }
        lastScroll = currentScroll;
    });

    // --- Weather Tooltip Toggle (Mobile) ---
    const weatherBadge = document.querySelector('.weather-badge');
    const weatherTooltip = document.querySelector('.weather-tooltip');
    
    weatherBadge?.addEventListener('click', (e) => {
        e.stopPropagation();
        weatherTooltip?.classList.toggle('active');
    });
    
    document.addEventListener('click', () => {
        weatherTooltip?.classList.remove('active');
    });

})();


