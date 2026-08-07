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
        if (!idCardSystem.classList.contains('is-active')) {
            requestAnimationFrame(physicsLoop);
            return;
        }
        
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

let cursorTick = false;
document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (!cursorTick) {
        requestAnimationFrame(() => {
            cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
            cursorTick = false;
        });
        cursorTick = true;
    }
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
let scrollTick = false;

window.addEventListener('scroll', () => {
    if (!scrollTick) {
        requestAnimationFrame(() => {
            const currentY = window.scrollY;
            
            // Scroll progress circle
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (currentY / totalHeight) * 283;
            if (progressCircle) progressCircle.style.strokeDashoffset = 283 - progress;
            
            // Visibility of scroll top button
            if (scrollTopBtn) {
                scrollTopBtn.classList.toggle('visible', currentY > 500);
            }

            nav.classList.toggle('scrolled', currentY > 50);

            // Highlight nav items on scroll (Throttled section check)
            const sections = document.querySelectorAll('section[id], main[id]');
            let currentSec = "";
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (currentY >= sectionTop - 150) {
                    currentSec = section.getAttribute("id");
                }
            });

            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${currentSec}`);
            });

            // Hero subtle parallax & opacity
            if (currentY < window.innerHeight) {
                const heroBrand = document.querySelector('.hero-brand');
                const heroContent = document.querySelector('.hero-content');
                const heroMeta = document.querySelector('.hero-meta');
                const p = currentY * 0.3;
                if (heroBrand) heroBrand.style.transform = `translateY(${currentY * 0.1}px)`;
                if (heroContent) heroContent.style.transform = `translateY(${p}px)`;
                if (heroMeta) heroMeta.style.opacity = 1 - (currentY / (window.innerHeight * 0.5));
            }

            scrollTick = false;
        });
        scrollTick = true;
    }
}, { passive: true });

// Scroll top action
scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Keyboard accessibility for scroll top
scrollTopBtn?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
            // Update data-text for glitch effect to match plain text
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = phrases[idx];
            textSpan.setAttribute('data-text', tempDiv.textContent);
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

// Parallax handled in throttled scroll listener above

// ===== MODAL ACCESSIBILITY & FOCUS TRAP =====
let lastFocusedElement = null;

function setupFocusTrap(modal) {
    if (!modal) return;
    
    const focusableSelector = 'button, [href], input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])';
    
    // Remember triggering element
    lastFocusedElement = document.activeElement;
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus close button
    const closeBtn = modal.querySelector('.lightbox-close') || modal.querySelector(focusableSelector);
    if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 80);
    }
    
    const keydownHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            return;
        }
        
        // Lightbox specific arrow navigation
        if (modal.id === 'lightbox') {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                scrollToSlide(currentSlideIndex - 1);
                return;
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                scrollToSlide(currentSlideIndex + 1);
                return;
            }
        }
        
        // Tab trap
        if (e.key === 'Tab') {
            const focusables = Array.from(modal.querySelectorAll(focusableSelector))
                .filter(el => el.offsetWidth > 0 && el.offsetHeight > 0);
            
            if (focusables.length === 0) return;
            
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        }
    };
    
    window.addEventListener('keydown', keydownHandler);
    
    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        window.removeEventListener('keydown', keydownHandler);
        
        if (modal.id === 'cvModal' && cvIframe) {
            cvIframe.src = '';
        }
        
        if (lastFocusedElement) {
            setTimeout(() => lastFocusedElement.focus(), 50);
        }
    }
    
    modal._closeModal = closeModal;
}

// ===== CV MODAL & FALLBACK =====
const cvModal = document.getElementById('cvModal');
const viewCvBtn = document.getElementById('viewCvBtn');
const openCvPreview = document.getElementById('openCvPreview');
const cvClose = document.getElementById('cvClose');
const cvIframe = document.getElementById('cvIframe');

function openCv() {
    if (cvIframe) cvIframe.src = 'assets/Shishir_Acharya_CV.pdf';
    setupFocusTrap(cvModal);
}

viewCvBtn?.addEventListener('click', openCv);
openCvPreview?.addEventListener('click', openCv);

cvClose?.addEventListener('click', () => {
    if (cvModal._closeModal) cvModal._closeModal();
});

// Close modal on background click
cvModal?.addEventListener('click', (e) => {
    if (e.target === cvModal) {
        if (cvModal._closeModal) cvModal._closeModal();
    }
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
    
    setupFocusTrap(lightbox);
    
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
    if (lightbox._closeModal) lightbox._closeModal();
});

// Close lightbox on background click
lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        if (lightbox._closeModal) lightbox._closeModal();
    }
});

document.querySelectorAll('[data-carousel]').forEach(el => {
    el.addEventListener('click', e => {
        e.preventDefault();
        openLightbox(el.dataset.carousel);
    });
    // Keyboard accessibility: Enter/Space to open lightbox
    el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(el.dataset.carousel);
        }
    });
});

// ===== FLEET & WEATHER TOOLTIP EDGE-AWARE POSITIONING =====
function positionTooltip(element, isFleet = false) {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const itemCenter = rect.left + rect.width / 2;
    const screenWidth = window.innerWidth;
    const padding = 16;
    const defaultWidth = isFleet ? 220 : 260;
    const tooltipWidth = Math.min(defaultWidth, screenWidth - padding * 2);
    const halfTooltip = tooltipWidth / 2;

    let leftOffset;
    let transform;

    if (itemCenter - halfTooltip < padding) {
        leftOffset = Math.max(0, padding - rect.left);
        transform = 'translateX(0)';
    } else if (itemCenter + halfTooltip > screenWidth - padding) {
        leftOffset = (screenWidth - padding - tooltipWidth) - rect.left;
        transform = 'translateX(0)';
    } else {
        leftOffset = '50%';
        transform = 'translateX(-50%)';
    }

    const isTopOverflow = rect.top < 130;
    const bottomVal = isTopOverflow ? 'auto' : (isFleet ? 'calc(100% + 10px)' : 'calc(100% + 14px)');
    const topVal = isTopOverflow ? 'calc(100% + 10px)' : 'auto';

    if (isFleet) {
        element.style.setProperty('--tt-left', typeof leftOffset === 'number' ? `${leftOffset}px` : leftOffset);
        element.style.setProperty('--tt-transform', transform);
        element.style.setProperty('--tt-width', `${tooltipWidth}px`);
        element.style.setProperty('--tt-bottom', bottomVal);
        element.style.setProperty('--tt-top', topVal);
    } else {
        element.style.setProperty('--wtt-left', typeof leftOffset === 'number' ? `${leftOffset}px` : leftOffset);
        element.style.setProperty('--wtt-transform', transform);
        element.style.setProperty('--wtt-width', `${tooltipWidth}px`);
        element.style.setProperty('--wtt-bottom', bottomVal);
        element.style.setProperty('--wtt-top', topVal);
    }
}

const fleetItems = document.querySelectorAll('.fleet-item');
fleetItems.forEach(item => {
    item.addEventListener('mouseenter', () => positionTooltip(item, true));
    item.addEventListener('focus', () => positionTooltip(item, true));

    item.addEventListener('click', (e) => {
        e.stopPropagation();
        positionTooltip(item, true);
        const isActive = item.classList.contains('active');
        fleetItems.forEach(fi => fi.classList.remove('active'));
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

const weatherBadge = document.querySelector('.weather-badge');
if (weatherBadge) {
    weatherBadge.addEventListener('mouseenter', () => positionTooltip(weatherBadge, false));
    weatherBadge.addEventListener('click', (e) => {
        e.stopPropagation();
        positionTooltip(weatherBadge, false);
        weatherBadge.classList.toggle('active');
    });
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.fleet-item')) {
        fleetItems.forEach(fi => fi.classList.remove('active'));
    }
    if (!e.target.closest('.weather-badge')) {
        weatherBadge?.classList.remove('active');
    }
});

window.addEventListener('resize', () => {
    const activeFleet = document.querySelector('.fleet-item.active');
    if (activeFleet) positionTooltip(activeFleet, true);
    if (weatherBadge?.classList.contains('active')) positionTooltip(weatherBadge, false);
});

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

    // Keyboard support for Enter/Space
    momoBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            momoBtn.click();
        }
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



// ===== ENHANCED EXPERIENCE =====
(function() {
    'use strict';

    // --- DOM Refs ---
    const $ = id => document.getElementById(id);

    // --- Scroll Text Reveal — Word-by-Word Stagger via IntersectionObserver ---
    const initScrollReveal = () => {
        const targets = document.querySelectorAll('.scroll-reveal-text');
        if (!targets.length) return;

        // Respect user motion preference — just show text, skip animation
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            targets.forEach(el => el.classList.add('in-view'));
            return;
        }

        // Split text nodes into .word spans, preserving child elements (em, strong)
        const wrapWords = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const parts = node.textContent.split(/(\s+)/);
                const frag = document.createDocumentFragment();
                parts.forEach(part => {
                    if (/^\s+$/.test(part)) {
                        frag.appendChild(document.createTextNode(part));
                    } else if (part.length > 0) {
                        const span = document.createElement('span');
                        span.className = 'word';
                        span.textContent = part;
                        frag.appendChild(span);
                    }
                });
                return frag;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                Array.from(node.childNodes).forEach(child => {
                    const replacement = wrapWords(child);
                    if (replacement) node.replaceChild(replacement, child);
                });
            }
            return null;
        };

        targets.forEach(target => {
            // Split text into word spans
            Array.from(target.childNodes).forEach(child => {
                const replacement = wrapWords(child);
                if (replacement) target.replaceChild(replacement, child);
            });

            // Assign --word-index to each span for CSS transition stagger
            target.querySelectorAll('.word').forEach((word, i) => {
                word.style.setProperty('--word-index', i);
            });
        });

        // Use IntersectionObserver to trigger .in-view when paragraph enters viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Exclude About paragraphs from the standard in-view intersection trigger on desktop
                    const isAbout = entry.target.closest('#about');
                    const isPinned = window.innerWidth > 900 && window.innerHeight > 650;
                    if (!isAbout || !isPinned) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target); // only trigger once
                    }
                }
            });
        }, {
            threshold: 0.15, // trigger when 15% of the element is visible
            rootMargin: '0px 0px -40px 0px' // slight bottom offset so it doesn't fire instantly
        });

        targets.forEach(target => observer.observe(target));
    };
    initScrollReveal();

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


    
    // --- Hero Multilingual Name Cycle ---
    const initNameCycle = () => {
        const words = document.querySelectorAll('#multilingualName .name-word');
        if (words.length <= 1) return;
        
        let currentIndex = 0;
        const cycleInterval = 4000; // time in ms for each word
        
        const startCycle = () => {
            setInterval(() => {
                const currentWord = words[currentIndex];
                currentWord.classList.remove('active');
                currentWord.classList.add('exit');
                
                setTimeout(() => {
                    currentWord.classList.remove('exit');
                }, 1200);
                
                currentIndex = (currentIndex + 1) % words.length;
                const nextWord = words[currentIndex];
                nextWord.classList.add('active');
            }, cycleInterval);
        };

        if (document.body.classList.contains('loaded')) {
            setTimeout(startCycle, 2000);
        } else {
            const observer = new MutationObserver(() => {
                if (document.body.classList.contains('loaded')) {
                    observer.disconnect();
                    setTimeout(startCycle, 2000);
                }
            });
            observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        }
    };
    initNameCycle();

    // --- Scroll-based Karaoke Reveal ---
    const aboutSpacer = document.querySelector('.about-pin-spacer');
    const aboutSection = document.getElementById('about');
    let aboutWords = null;

    const updateKaraokeReveal = () => {
        if (!aboutSpacer || !aboutSection) return;
        if (!aboutWords) {
            aboutWords = document.querySelectorAll('#about .scroll-reveal-text .word');
        }
        if (!aboutWords || aboutWords.length === 0) return;

        const rect = aboutSpacer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const isPinnedActive = window.innerWidth > 900 && viewportHeight > 650;

        let progress = 0;
        if (isPinnedActive) {
            const scrollableDistance = rect.height - viewportHeight;
            if (rect.top <= 0) {
                progress = -rect.top / scrollableDistance;
            }
            progress = Math.max(0, Math.min(1, progress));
        } else {
            const innerRect = aboutSection.getBoundingClientRect();
            const startY = viewportHeight * 0.75;
            const endY = viewportHeight * 0.25;
            const currentY = innerRect.top;
            
            progress = (startY - currentY) / (startY - endY);
            progress = Math.max(0, Math.min(1, progress));
        }

        const highlightCount = Math.floor(progress * aboutWords.length);
        aboutWords.forEach((word, idx) => {
            if (idx < highlightCount) {
                word.classList.add('highlighted');
            } else {
                word.classList.remove('highlighted');
            }
        });
    };

    let karaokeTick = false;
    window.addEventListener('scroll', () => {
        if (!karaokeTick) {
            requestAnimationFrame(() => {
                updateKaraokeReveal();
                karaokeTick = false;
            });
            karaokeTick = true;
        }
    }, { passive: true });

    // Initial run after page layout settles
    setTimeout(updateKaraokeReveal, 150);

    // --- Enhanced Music Experience ---
    const audio        = $('siteAudio');
    const player       = $('floatingPlayer');
    const playPauseBtn = $('playerPlayPause');
    const closeBtn     = $('playerClose');
    const muteBtn      = $('playerMute');
    const progressBar  = $('playerProgressBar');
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
    const spotifyFlyout = $('spotifyFlyout');

    if (!audio) return; // No audio element, bail out

    const musicState = {
        isPlaying: false,
        isMuted:   false,
        currentVolume: 100
    };

    // Initialize Volume Fill
    if (volFill) volFill.style.height = '100%';

    function setPlayState(playing) {
        musicState.isPlaying = playing;
        const playI  = playPauseBtn?.querySelector('.play-icon');
        const pauseI = playPauseBtn?.querySelector('.pause-icon');

        if (playing) {
            audio.play().catch(() => {});
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

    function playTrack(el) {
        // Normalize — always read from dataset
        const src    = el.dataset.audioSrc;
        const title  = el.dataset.title;
        const artist = el.dataset.artist;
        const img    = el.dataset.img;
        if (!src) return;

        // Toggle play/pause if same track
        if (audio.src.endsWith(src) || audio.src === src) {
            setPlayState(!musicState.isPlaying);
            return;
        }

        audio.src = src;
        audio.load();

        // Update album art with fallback
        if (trackImg) {
            trackImg.src = img || '';
            trackImg.onerror = () => {
                trackImg.style.opacity = '0';
            };
            trackImg.onload = () => {
                trackImg.style.opacity = '1';
            };
        }
        if (trackTitle)  trackTitle.textContent  = title  || 'Unknown Track';
        if (trackArtist) trackArtist.textContent = artist || 'Unknown Artist';
        if (heroTrack)   heroTrack.textContent   = title  || '';

        if (progressBar) progressBar.style.width = '0%';

        setPlayState(true);
        showPlayer();

        // Mark active track
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
        if (heroTrack) heroTrack.textContent = 'My Top 4 Tracks';
        document.querySelectorAll('.flyout-track').forEach(t => t.classList.remove('active'));
    }

    function updateVolume(val) {
        const v = parseInt(val, 10);
        audio.volume = Math.max(0, Math.min(1, v / 100));
        if (volFill) volFill.style.height = v + '%';
        const muted = v === 0;
        musicState.isMuted = muted;
        muteBtn?.classList.toggle('muted', muted);
    }

    // Volume slider
    volSlider?.addEventListener('input', (e) => {
        musicState.currentVolume = parseInt(e.target.value, 10);
        updateVolume(musicState.currentVolume);
    });

    // Flyout track click + keyboard
    document.querySelectorAll('.flyout-track').forEach(track => {
        track.setAttribute('tabindex', '0');
        track.setAttribute('role', 'button');
        track.addEventListener('click', (e) => {
            e.stopPropagation();
            playTrack(track);
        });
        track.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playTrack(track);
            }
        });
    });

    // Mobile: toggle flyout via badge click
    const spotifyBadge = heroMeta?.querySelector('.spotify-badge');
    spotifyBadge?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.innerWidth <= 900 && spotifyFlyout) {
            spotifyFlyout.classList.toggle('force-open');
        }
    });

    // Close flyout on outside click (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 900 && spotifyFlyout) {
            if (!heroMeta?.contains(e.target)) {
                spotifyFlyout.classList.remove('force-open');
            }
        }
    });

    playPauseBtn?.addEventListener('click', () => {
        if (audio.src && !audio.src.endsWith(window.location.pathname)) {
            setPlayState(!musicState.isPlaying);
        }
    });

    closeBtn?.addEventListener('click', closePlayer);

    muteBtn?.addEventListener('click', () => {
        musicState.isMuted = !musicState.isMuted;
        audio.muted = musicState.isMuted;
        if (musicState.isMuted) {
            if (volFill) volFill.style.height = '0%';
            if (volSlider) volSlider.value = 0;
            muteBtn.classList.add('muted');
        } else {
            updateVolume(musicState.currentVolume);
            if (volSlider) volSlider.value = musicState.currentVolume;
            muteBtn.classList.remove('muted');
        }
    });

    // Progress bar update
    audio.addEventListener('timeupdate', () => {
        if (!audio.duration || isDragging) return;
        const pct = (audio.currentTime / audio.duration) * 100;
        if (progressBar) progressBar.style.width = pct + '%';
    });

    audio.addEventListener('ended', () => closePlayer());

    audio.addEventListener('error', () => {
        // Audio failed to load — show friendly state
        if (trackTitle) trackTitle.textContent = 'Preview unavailable';
        setPlayState(false);
    });

    // Seek with drag
    let isDragging = false;

    function seekTo(e) {
        if (!progressWrap) return;
        const rect = progressWrap.getBoundingClientRect();
        const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        if (progressBar) progressBar.style.width = (pct * 100) + '%';
        if (audio.duration) audio.currentTime = pct * audio.duration;
    }

    progressWrap?.addEventListener('mousedown', (e) => {
        isDragging = true;
        seekTo(e);
    });
    document.addEventListener('mousemove', (e) => { if (isDragging) seekTo(e); });
    document.addEventListener('mouseup',  (e) => {
        if (isDragging) {
            isDragging = false;
            seekTo(e);
        }
    });

    // Touch seek support
    progressWrap?.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        if (touch) seekTo(touch);
    }, { passive: true });

    // Album art tooltip
    pillImgWrap?.addEventListener('click', () => {
        if (!pillTooltip) return;
        pillTooltip.classList.add('show');
        setTimeout(() => pillTooltip.classList.remove('show'), 2200);
    });

})();





