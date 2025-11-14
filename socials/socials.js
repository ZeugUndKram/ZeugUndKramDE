console.log('Socials page loaded');

// Liquid button effects
function initLiquidButtons() {
    const buttons = document.querySelectorAll('.social-btn, #language-btn');

    buttons.forEach(button => {
        // Mouse move effect for dynamic gradient
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            button.style.setProperty('--mouse-x', `${x}px`);
            button.style.setProperty('--mouse-y', `${y}px`);
        });

        // Liquid ripple effect on click
        button.addEventListener('click', (e) => {
            createLiquidRipple(e, button);
        });

        // Add floating particles
        createFloatingParticles(button);
    });
}

function createLiquidRipple(e, button) {
    const ripple = document.createElement('div');
    ripple.classList.add('liquid-ripple');

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function createFloatingParticles(button) {
    const particleCount = 3;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('floating-particle');

        // Random size and position
        const size = Math.random() * 4 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const moveX = (Math.random() * 20 - 10) + 'px';
        const moveY = (Math.random() * 20 - 10) + 'px';

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.setProperty('--particle-x', moveX);
        particle.style.setProperty('--particle-y', moveY);

        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 5}s`;

        button.appendChild(particle);
    }
}

// Language toggle functionality
const translations = {
    en: {
        logo: "Zeug und Kram",
        navMain: "main",
        navCreations: "creations",
        navGifMaker: "gif maker",
        navSocials: "socials",
        socialsTitle: "Find Me Online",
        youtube: "YouTube",
        twitter: "Twitter",
        twitch: "Twitch",
        tiktok: "TikTok",
        tindie: "Tindie"
    },
    de: {
        logo: "Zeug und Kram",
        navMain: "Startseite",
        navCreations: "Kreationen",
        navGifMaker: "Gif Maker",
        navSocials: "Soziales",
        socialsTitle: "Finde Mich Online",
        youtube: "YouTube",
        twitter: "Twitter",
        twitch: "Twitch",
        tiktok: "TikTok",
        tindie: "Tindie"
    }
};

// SVG flags - UK and Germany
const flags = {
    en: `
        <svg width="20" height="15" viewBox="0 0 20 15" xmlns="http://www.w3.org/2000/svg">
            <!-- Blue background -->
            <rect width="20" height="15" fill="#012169"/>
            
            <!-- White cross -->
            <rect width="20" height="3" fill="#fff" y="6"/>
            <rect width="3" height="15" fill="#fff" x="8.5"/>
            
            <!-- Red cross -->
            <rect width="20" height="1.5" fill="#C8102E" y="6.75"/>
            <rect width="1.5" height="15" fill="#C8102E" x="9.25"/>
            
            <!-- Simple diagonal red lines -->
            <rect width="12" height="1.2" fill="#C8102E" transform="rotate(40 10 7.5)"/>
            <rect width="12" height="1.2" fill="#C8102E" transform="rotate(-40 10 7.5)"/>
        </svg>
    `,
    de: `
        <svg width="20" height="15" viewBox="0 0 20 15" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="5" fill="#000000"/>
            <rect y="5" width="20" height="5" fill="#dd0000"/>
            <rect y="10" width="20" height="5" fill="#ffce00"/>
        </svg>
    `
};

let currentLanguage = 'en';

// Language toggle functionality
const languageBtn = document.getElementById('language-btn');
const flagSvg = document.getElementById('flag-svg');
const languageText = languageBtn.querySelector('.language-text');

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'de' : 'en';
    updateLanguage();
}

function updateLanguage() {
    const t = translations[currentLanguage];

    // Update logo
    document.querySelector('.logo').textContent = t.logo;

    // Update navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks[0].textContent = t.navMain;
    navLinks[1].textContent = t.navCreations;
    navLinks[2].textContent = t.navGifMaker;
    navLinks[3].textContent = t.navSocials;

    // Update page content
    document.querySelector('.socials-title').textContent = t.socialsTitle;

    // Update social button texts
    const socialBtns = document.querySelectorAll('.social-btn span');
    socialBtns[0].textContent = t.youtube;
    socialBtns[1].textContent = t.twitter;
    socialBtns[2].textContent = t.twitch;
    socialBtns[3].textContent = t.tiktok;
    socialBtns[4].textContent = t.tindie;

    // Update flag and text
    flagSvg.innerHTML = flags[currentLanguage];
    languageText.textContent = currentLanguage === 'en' ? 'EN' : 'DE';
}

// Initialize with English
flagSvg.innerHTML = flags.en;

// Event listener for language toggle
languageBtn.addEventListener('click', toggleLanguage);

// Initialize liquid buttons and animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLiquidButtons();

    // Staggered entrance animation for social buttons
    const buttons = document.querySelectorAll('.social-btn');
    buttons.forEach((button, index) => {
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';

        setTimeout(() => {
            button.style.transition = 'all 0.5s ease';
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 100 * index);
    });
});