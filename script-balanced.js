// Balanced Animation Script - Elegant & Professional

// Global variables
let currentTheme = 'cosmic';
let isDarkMode = true;
let animationIntensity = 0.8;
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
    }, 2000);
}

// Simplified particle system
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
    const particleCount = Math.floor(15 * animationIntensity);
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1 * animationIntensity,
            vy: (Math.random() - 0.5) * 1 * animationIntensity,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.3 + 0.1,
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
    
    // Mouse tracking (simplified)
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
            item.style.display = 'block';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (name && email && message) {
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
    
    // Gentle parallax effect
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const speed = 0.2 + (index * 0.1);
        shape.style.transform = `translateY(${scrollTop * speed}px)`;
    });
    
    // Reveal animations
    revealOnScroll();
}

// Simple animation initialization
function initializeAnimations() {
    // Typewriter effect (simplified)
    const typewriterElements = document.querySelectorAll('.typewriter');
    typewriterElements.forEach(element => {
        const text = element.dataset.text;
        const delay = parseInt(element.dataset.delay) || 0;
        element.textContent = '';
        
        setTimeout(() => {
            typeWriter(element, text, 0);
        }, delay);
    });
}

function typeWriter(element, text, index) {
    if (index < text.length) {
        element.textContent += text.charAt(index);
        setTimeout(() => typeWriter(element, text, index + 1), 80);
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
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate skill bars
                if (entry.target.classList.contains('skill-progress')) {
                    const width = entry.target.dataset.width;
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 300);
                }
                
                // Animate counters
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.portfolio-card, .skill-category, .testimonial-card, .skill-progress, .stat-number').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

function revealOnScroll() {
    const reveals = document.querySelectorAll('[style*="opacity: 0"]');
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 1500;
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

// Simple hover effects
function initializeHoverEffects() {
    const cards = document.querySelectorAll('.portfolio-card, .skill-category, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Initialize hover effects
initializeHoverEffects();