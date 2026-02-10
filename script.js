// Global variables
let currentTheme = 'cosmic';
let isDarkMode = true;
let animationIntensity = 1;
let particles = [];
let mouseX = 0;
let mouseY = 0;

// DOM elements
const loadingScreen = document.getElementById('loadingScreen');
const themeToggle = document.getElementById('themeToggle');
const colorButtons = document.querySelectorAll('.color-btn');
const animationSlider = document.getElementById('animationIntensity');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
const mouseTrail = document.getElementById('mouseTrail');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeLoading();
    initializeParticles();
    initializeEventListeners();
    initializeAnimations();
    initializeScrollEffects();
});

// Loading screen
function initializeLoading() {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 3000);
}

// Particle system
function initializeParticles() {
    resizeCanvas();
    createParticles();
    animateParticles();
    
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticles() {
    particles = [];
    const particleCount = Math.floor(50 * animationIntensity);
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2 * animationIntensity,
            vy: (Math.random() - 0.5) * 2 * animationIntensity,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.2,
            color: getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim()
        });
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Mouse interaction
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            particle.x -= dx * 0.01;
            particle.y -= dy * 0.01;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
    });
    
    requestAnimationFrame(animateParticles);
}

// Event listeners
function initializeEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleDarkMode);
    
    // Color theme buttons
    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => changeColorTheme(btn.dataset.theme));
    });
    
    // Animation intensity slider
    animationSlider.addEventListener('input', (e) => {
        animationIntensity = parseFloat(e.target.value);
        document.documentElement.style.setProperty('--animation-speed', animationIntensity);
        createParticles();
    });
    
    // Navigation
    hamburger.addEventListener('click', toggleMobileMenu);
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                closeMobileMenu();
            }
        });
    });
    
    // Mouse tracking
    document.addEventListener('mousemove', handleMouseMove);
    
    // Portfolio filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => filterPortfolio(btn.dataset.filter));
    });
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Scroll events
    window.addEventListener('scroll', handleScroll);
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    themeToggle.textContent = isDarkMode ? '🌙' : '☀️';
    
    if (isDarkMode) {
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
        // Apply light mode overrides
        document.documentElement.style.setProperty('--text-primary', '#1e293b');
        document.documentElement.style.setProperty('--text-secondary', '#64748b');
        document.documentElement.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.8)');
        document.documentElement.style.setProperty('--secondary-bg', 'rgba(248, 250, 252, 0.9)');
    }
}

function changeColorTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update particles color
    setTimeout(() => {
        particles.forEach(particle => {
            particle.color = getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim();
        });
    }, 100);
}

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Mouse trail effect
    mouseTrail.style.left = mouseX - 10 + 'px';
    mouseTrail.style.top = mouseY - 10 + 'px';
    mouseTrail.style.opacity = '0.6';
    
    setTimeout(() => {
        mouseTrail.style.opacity = '0';
    }, 100);
}
function filterPortfolio(filter) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Update active filter button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    // Filter portfolio items
    portfolioItems.forEach(item => {
        const category = item.dataset.category;
        
        if (filter === 'all' || category === filter) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Simple form validation animation
    if (name && email && message) {
        // Success animation
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent! ✓';
            submitBtn.style.background = '#10b981';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                e.target.reset();
            }, 2000);
        }, 1000);
    }
}

function handleScroll() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // Update scroll progress
    document.querySelector('.scroll-progress').style.width = scrollPercent + '%';
    
    // Parallax effect for floating shapes
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.2);
        shape.style.transform = `translateY(${scrollTop * speed}px) rotate(${scrollTop * 0.1}deg)`;
    });
    
    // Reveal animations
    revealOnScroll();
}

// Animation initialization
function initializeAnimations() {
    // Typewriter effect
    const typewriterElements = document.querySelectorAll('.typewriter');
    typewriterElements.forEach(element => {
        const text = element.dataset.text;
        const delay = parseInt(element.dataset.delay) || 0;
        element.textContent = '';
        
        setTimeout(() => {
            typeWriter(element, text, 0);
        }, delay);
    });
    
    // Staggered fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.2}s`;
    });
}

function typeWriter(element, text, index) {
    if (index < text.length) {
        element.textContent += text.charAt(index);
        setTimeout(() => typeWriter(element, text, index + 1), 100);
    }
}

function initializeScrollEffects() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animate skill bars
                if (entry.target.classList.contains('skill-progress')) {
                    const width = entry.target.dataset.width;
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 500);
                }
                
                // Animate counters
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.fade-in-up, .skill-progress, .stat-number').forEach(el => {
        observer.observe(el);
    });
}

function revealOnScroll() {
    const reveals = document.querySelectorAll('.fade-in-up:not(.animate)');
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);
        
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Additional theme definitions for remaining themes
const additionalThemes = {
    ocean: {
        '--primary-bg': 'linear-gradient(135deg, #0077be 0%, #00a8cc 50%, #40e0d0 100%)',
        '--accent-color': '#00bcd4',
        '--accent-secondary': '#26c6da',
        '--glow-color': '#00bcd4',
        '--particle-color': '#26c6da'
    },
    matrix: {
        '--primary-bg': 'linear-gradient(135deg, #000000 0%, #001100 50%, #003300 100%)',
        '--accent-color': '#00ff41',
        '--accent-secondary': '#39ff14',
        '--glow-color': '#00ff41',
        '--particle-color': '#39ff14'
    },
    earth: {
        '--primary-bg': 'linear-gradient(135deg, #8b4513 0%, #a0522d 50%, #daa520 100%)',
        '--accent-color': '#cd853f',
        '--accent-secondary': '#daa520',
        '--glow-color': '#cd853f',
        '--particle-color': '#daa520'
    },
    electric: {
        '--primary-bg': 'linear-gradient(135deg, #000000 0%, #1a1a00 50%, #333300 100%)',
        '--accent-color': '#ffff00',
        '--accent-secondary': '#ffed4e',
        '--glow-color': '#ffff00',
        '--particle-color': '#ffed4e'
    },
    pastel: {
        '--primary-bg': 'linear-gradient(135deg, #ffeef8 0%, #e6f3ff 50%, #f0e6ff 100%)',
        '--secondary-bg': 'rgba(255, 238, 248, 0.9)',
        '--accent-color': '#ff69b4',
        '--accent-secondary': '#87ceeb',
        '--text-primary': '#4a4a4a',
        '--text-secondary': '#6a6a6a',
        '--card-bg': 'rgba(255, 255, 255, 0.7)',
        '--border-color': 'rgba(0, 0, 0, 0.1)',
        '--glow-color': '#ff69b4',
        '--particle-color': '#87ceeb'
    }
};

// Apply additional themes
function applyTheme(themeName) {
    const theme = additionalThemes[themeName];
    if (theme) {
        Object.entries(theme).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
    }
}

// Enhanced color theme changing
function changeColorTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply additional theme properties if they exist
    if (additionalThemes[theme]) {
        applyTheme(theme);
    }
    
    // Update particles color
    setTimeout(() => {
        particles.forEach(particle => {
            particle.color = getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim();
        });
    }, 100);
}

// Easter egg - Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        triggerEasterEgg();
        konamiCode = [];
    }
});

function triggerEasterEgg() {
    // Create confetti effect
    for (let i = 0; i < 100; i++) {
        createConfetti();
    }
    
    // Show message
    const message = document.createElement('div');
    message.textContent = '🎉 Easter Egg Activated! 🎉';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--accent-color);
        color: white;
        padding: 2rem;
        border-radius: 15px;
        font-size: 1.5rem;
        font-weight: bold;
        z-index: 10000;
        animation: bounce 1s ease-in-out;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${['#ff0080', '#00ff80', '#0080ff', '#ff8000', '#8000ff'][Math.floor(Math.random() * 5)]};
        top: -10px;
        left: ${Math.random() * 100}%;
        z-index: 9999;
        animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
    `;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 5000);
}

// Add confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
// Enhanced Animation Functions

// Magnetic effect for buttons
function initializeMagneticEffect() {
    const magneticElements = document.querySelectorAll('.btn, .portfolio-card, .skill-category');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.1;
            const moveY = y * 0.1;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0px, 0px) scale(1)';
        });
    });
}

// Parallax scrolling effect
function initializeParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.shape, .profile-pic, .about-pic');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Text scramble effect
function scrambleText(element, finalText) {
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let iteration = 0;
    
    const interval = setInterval(() => {
        element.textContent = finalText
            .split('')
            .map((char, index) => {
                if (index < iteration) {
                    return finalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        
        if (iteration >= finalText.length) {
            clearInterval(interval);
        }
        
        iteration += 1 / 3;
    }, 30);
}

// Initialize scramble effect for section titles
function initializeScrambleEffect() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                scrambleText(entry.target, text);
                observer.unobserve(entry.target);
            }
        });
    });
    
    document.querySelectorAll('.section-title').forEach(title => {
        observer.observe(title);
    });
}

// Ripple effect for buttons
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
}

// Initialize ripple effects
function initializeRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

// Floating elements animation
function initializeFloatingElements() {
    const floatingElements = document.querySelectorAll('.portfolio-card, .testimonial-card, .stat-item');
    
    floatingElements.forEach((element, index) => {
        const delay = index * 200;
        const duration = 3000 + (index * 500);
        
        setTimeout(() => {
            element.style.animation = `float ${duration}ms ease-in-out infinite`;
            element.style.animationDelay = `${delay}ms`;
        }, delay);
    });
}

// Cursor trail enhancement
function enhancedMouseTrail(e) {
    // Create multiple trail elements
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.cssText = `
                position: fixed;
                width: ${20 - i * 5}px;
                height: ${20 - i * 5}px;
                background: radial-gradient(circle, var(--glow-color) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${e.clientX - (10 - i * 2.5)}px;
                top: ${e.clientY - (10 - i * 2.5)}px;
                opacity: ${0.8 - i * 0.2};
                animation: trailFade 0.5s ease-out forwards;
            `;
            
            document.body.appendChild(trail);
            
            setTimeout(() => {
                trail.remove();
            }, 500);
        }, i * 50);
    }
}

// Initialize enhanced mouse trail
function initializeEnhancedMouseTrail() {
    document.addEventListener('mousemove', enhancedMouseTrail);
}

// Smooth reveal animations
function initializeSmoothReveal() {
    const revealElements = document.querySelectorAll('.portfolio-card, .skill-category, .testimonial-card, .about-pic');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) rotateX(0)';
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px) rotateX(10deg)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        revealObserver.observe(element);
    });
}

// Initialize all enhanced animations
function initializeEnhancedAnimations() {
    initializeMagneticEffect();
    initializeParallax();
    initializeScrambleEffect();
    initializeRippleEffect();
    initializeFloatingElements();
    initializeEnhancedMouseTrail();
    initializeSmoothReveal();
}

// Update the main initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeLoading();
    initializeParticles();
    initializeEventListeners();
    initializeAnimations();
    initializeScrollEffects();
    initializeEnhancedAnimations(); // Add this line
});

// Add CSS for ripple effect
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes trailFade {
        to {
            opacity: 0;
            transform: scale(2);
        }
    }
`;
document.head.appendChild(rippleStyle);

// Enhanced particle interactions
function enhanceParticleSystem() {
    // Add particle explosion on click
    document.addEventListener('click', (e) => {
        for (let i = 0; i < 10; i++) {
            particles.push({
                x: e.clientX,
                y: e.clientY,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                size: Math.random() * 5 + 2,
                opacity: 1,
                life: 60,
                color: getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim()
            });
        }
    });
}

// Initialize enhanced particle system
enhanceParticleSystem();

// Dynamic background color shifting
function initializeDynamicBackground() {
    let hue = 0;
    
    setInterval(() => {
        hue = (hue + 1) % 360;
        document.documentElement.style.setProperty('--dynamic-hue', hue + 'deg');
    }, 100);
}

// Uncomment to enable dynamic background
// initializeDynamicBackground();
// Ultra Advanced Animation System

// Magnetic Mouse Tracking
function initializeMagneticTracking() {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    
    if (portfolioGrid) {
        portfolioGrid.addEventListener('mousemove', (e) => {
            const rect = portfolioGrid.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            portfolioGrid.style.setProperty('--mouse-x', x + '%');
            portfolioGrid.style.setProperty('--mouse-y', y + '%');
        });
    }
}

// 3D Tilt Effect
function initialize3DTilt() {
    const cards = document.querySelectorAll('.portfolio-card, .testimonial-card, .skill-category');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(20px)
                scale3d(1.05, 1.05, 1.05)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale3d(1, 1, 1)';
        });
    });
}

// Particle Burst on Click
function initializeParticleBurst() {
    document.addEventListener('click', (e) => {
        createParticleBurst(e.clientX, e.clientY);
    });
}

function createParticleBurst(x, y) {
    const colors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 15;
        const velocity = 100 + Math.random() * 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        animateParticle(particle, vx, vy);
    }
}

function animateParticle(particle, vx, vy) {
    let x = 0, y = 0;
    let opacity = 1;
    const gravity = 500;
    const startTime = Date.now();
    
    function update() {
        const elapsed = (Date.now() - startTime) / 1000;
        
        x += vx * elapsed * 0.1;
        y += vy * elapsed * 0.1 + gravity * elapsed * elapsed * 0.5;
        opacity -= elapsed * 2;
        
        particle.style.transform = `translate(${x}px, ${y}px)`;
        particle.style.opacity = Math.max(0, opacity);
        
        if (opacity > 0) {
            requestAnimationFrame(update);
        } else {
            particle.remove();
        }
    }
    
    update();
}

// Morphing Background Shapes
function initializeMorphingShapes() {
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        let morphState = 0;
        
        setInterval(() => {
            morphState += 0.02;
            
            const radius1 = 50 + Math.sin(morphState) * 20;
            const radius2 = 50 + Math.cos(morphState * 1.5) * 15;
            const radius3 = 50 + Math.sin(morphState * 2) * 10;
            const radius4 = 50 + Math.cos(morphState * 0.5) * 25;
            
            shape.style.borderRadius = `${radius1}% ${radius2}% ${radius3}% ${radius4}%`;
            
            const hue = (morphState * 50 + index * 60) % 360;
            shape.style.filter = `hue-rotate(${hue}deg) blur(1px)`;
        }, 50);
    });
}

// Text Scramble Animation
function initializeTextScramble() {
    const scrambleElements = document.querySelectorAll('.section-title');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                scrambleText(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    scrambleElements.forEach(element => {
        observer.observe(element);
    });
}

function scrambleText(element) {
    const originalText = element.textContent;
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let iteration = 0;
    
    const interval = setInterval(() => {
        element.textContent = originalText
            .split('')
            .map((char, index) => {
                if (index < iteration) {
                    return originalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        
        if (iteration >= originalText.length) {
            clearInterval(interval);
            element.textContent = originalText;
        }
        
        iteration += 1 / 3;
    }, 30);
}

// Holographic Scan Effect
function initializeHolographicScan() {
    const cards = document.querySelectorAll('.portfolio-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            createScanLine(card);
        });
    });
}

function createScanLine(element) {
    const scanLine = document.createElement('div');
    scanLine.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--accent-color), transparent);
        z-index: 10;
        animation: scanMove 1s ease-in-out;
    `;
    
    element.appendChild(scanLine);
    
    setTimeout(() => {
        scanLine.remove();
    }, 1000);
}

// Quantum Loading Effect
function initializeQuantumLoading() {
    const loader = document.querySelector('.loader');
    if (!loader) return;
    
    for (let i = 0; i < 8; i++) {
        const quantum = document.createElement('div');
        quantum.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: var(--accent-color);
            border-radius: 50%;
            animation: quantumOrbit ${2 + i * 0.2}s linear infinite;
            animation-delay: ${i * 0.1}s;
        `;
        
        loader.appendChild(quantum);
    }
}

// Energy Wave Effect
function initializeEnergyWaves() {
    const hero = document.querySelector('.hero');
    
    setInterval(() => {
        createEnergyWave(hero);
    }, 3000);
}

function createEnergyWave(container) {
    const wave = document.createElement('div');
    wave.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border: 2px solid var(--accent-color);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: energyWave 2s ease-out forwards;
        pointer-events: none;
        opacity: 0.7;
    `;
    
    container.appendChild(wave);
    
    setTimeout(() => {
        wave.remove();
    }, 2000);
}

// Matrix Digital Rain
function initializeMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        opacity: 0.1;
    `;
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 50);
}

// Initialize all ultra advanced animations
function initializeUltraAnimations() {
    initializeMagneticTracking();
    initialize3DTilt();
    initializeParticleBurst();
    initializeMorphingShapes();
    initializeTextScramble();
    initializeHolographicScan();
    initializeQuantumLoading();
    initializeEnergyWaves();
    initializeMatrixRain();
}

// Add CSS for new animations
const ultraStyle = document.createElement('style');
ultraStyle.textContent = `
    @keyframes scanMove {
        0% { top: 0; opacity: 0; }
        50% { opacity: 1; }
        100% { top: 100%; opacity: 0; }
    }
    
    @keyframes quantumOrbit {
        0% { 
            transform: rotate(0deg) translateX(40px) rotate(0deg);
            opacity: 1;
        }
        100% { 
            transform: rotate(360deg) translateX(40px) rotate(-360deg);
            opacity: 0.3;
        }
    }
    
    @keyframes energyWave {
        0% {
            width: 0;
            height: 0;
            opacity: 0.7;
        }
        100% {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(ultraStyle);

// Update main initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeLoading();
    initializeParticles();
    initializeEventListeners();
    initializeAnimations();
    initializeScrollEffects();
    initializeEnhancedAnimations();
    initializeUltraAnimations(); // Add this line
});