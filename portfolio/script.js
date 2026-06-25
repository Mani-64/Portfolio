// ==========================================================================
// MANI TEJA GURRAM PORTFOLIO LOGIC & VORTEX BACKGROUND
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initVortexBackground();
    initCustomCursor();
    initMobileNav();
    initScrollHeader();
    initTypingEffect();
    initSkillsTabs();
    initScrollReveal();
    initContactForm();
});

// ==========================================================================
// 1. ANTIGRAVITY-STYLE VORTEX BACKGROUND (CANVAS)
// ==========================================================================
function initVortexBackground() {
    const canvas = document.getElementById('vortex-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let dashes = [];
    let specks = [];
    
    // Config parameters
    const maxDashes = 110;
    const maxSpecks = 150;
    
    // Dynamic resizing
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initSpecks();
    });

    // Particle Classes
    class FloatingDash {
        constructor() {
            this.reset(true);
        }

        reset(init = false) {
            // Sweep from left/bottom, moving towards top-right
            if (init) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
            } else {
                // Spawn on left half or bottom
                if (Math.random() > 0.5) {
                    this.x = -50;
                    this.y = Math.random() * height * 1.2;
                } else {
                    this.x = Math.random() * width * 0.8;
                    this.y = height + 50;
                }
            }

            // Drift speed and curve properties
            this.speed = Math.random() * 0.8 + 0.4;
            this.length = Math.random() * 15 + 10;
            this.width = Math.random() * 1.8 + 1.2;
            
            // Phase for wave/wind motion
            this.phase = Math.random() * Math.PI * 2;
            this.phaseSpeed = Math.random() * 0.01 + 0.005;
            
            // Color selection based on vertical height
            this.alpha = Math.random() * 0.4 + 0.3;
            this.angle = -Math.PI / 4; // default angle (up and right)
        }

        update() {
            // Base flow: move up and right
            this.x += this.speed * 1.2;
            this.y -= this.speed * 1.0;
            
            // Add subtle wave oscillation
            this.phase += this.phaseSpeed;
            this.x += Math.sin(this.phase) * 0.3;
            
            // Calculate angle based on motion vector
            this.angle = Math.atan2(-1.0, 1.2) + Math.sin(this.phase) * 0.05;

            // Recycle if moves offscreen
            if (this.x > width + 50 || this.y < -50) {
                this.reset(false);
            }
        }

        draw() {
            // Color shifts along gradient relative to vertical screen position
            let color = 'rgba(99, 102, 241, ' + this.alpha + ')'; // Default Indigo
            const relativeHeight = this.y / height;
            
            if (relativeHeight < 0.3) {
                // Top: Red / Pink
                color = 'rgba(236, 72, 153, ' + this.alpha + ')';
            } else if (relativeHeight < 0.65) {
                // Middle: Purple
                color = 'rgba(139, 92, 246, ' + this.alpha + ')';
            } else {
                // Bottom: Blue / Cyan
                color = 'rgba(59, 130, 246, ' + this.alpha + ')';
            }

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            
            ctx.beginPath();
            ctx.moveTo(-this.length / 2, 0);
            ctx.lineTo(this.length / 2, 0);
            ctx.strokeStyle = color;
            ctx.lineWidth = this.width;
            ctx.lineCap = 'round';
            ctx.stroke();
            
            ctx.restore();
        }
    }

    // Static dark speck background (mimics paper/dust texture in Antigravity)
    class Speck {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.2 + 0.4;
            this.alpha = Math.random() * 0.12 + 0.04;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, ' + this.alpha + ')';
            ctx.fill();
        }
    }

    function initSpecks() {
        specks = [];
        for (let i = 0; i < maxSpecks; i++) {
            specks.push(new Speck());
        }
    }

    // Initialize components
    for (let i = 0; i < maxDashes; i++) {
        dashes.push(new FloatingDash());
    }
    initSpecks();

    // Loop
    function loop() {
        ctx.clearRect(0, 0, width, height);

        // Draw specks first
        specks.forEach(s => s.draw());

        // Update and draw dashes
        dashes.forEach(d => {
            d.update();
            d.draw();
        });

        requestAnimationFrame(loop);
    }
    loop();
}

// ==========================================================================
// 2. CUSTOM CURSOR
// ==========================================================================
function initCustomCursor() {
    // Standard custom cursor logic
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const glow = document.createElement('div');
    glow.className = 'custom-cursor-glow';
    
    // Append to body if screen is non-touch
    if (window.matchMedia('(pointer: fine)').matches) {
        document.body.appendChild(cursor);
        document.body.appendChild(glow);

        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });
        
        function animateGlow() {
            const lerpFactor = 0.15;
            glowX += (mouseX - glowX) * lerpFactor;
            glowY += (mouseY - glowY) * lerpFactor;
            
            glow.style.left = glowX + 'px';
            glow.style.top = glowY + 'px';
            
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
        
        // Setup hover states
        const updateHoverState = () => {
            const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-tab, input, textarea');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.classList.add('hovered');
                    glow.classList.add('hovered');
                });
                el.addEventListener('mouseleave', () => {
                    cursor.classList.remove('hovered');
                    glow.classList.remove('hovered');
                });
            });
        };
        updateHoverState();
        
        // Re-run hover updates occasionally (e.g., when tabs change grids)
        window.addEventListener('click', () => setTimeout(updateHoverState, 100));
    }

    // Add CSS values for cursor support
    const style = document.createElement('style');
    style.innerHTML = `
        @media (pointer: fine) {
            .custom-cursor {
                width: 8px;
                height: 8px;
                background-color: var(--a1);
                border-radius: 50%;
                position: fixed;
                transform: translate(-50%, -50%);
                pointer-events: none;
                z-index: 9999;
                transition: width 0.2s, height 0.2s, background-color 0.2s;
            }
            .custom-cursor-glow {
                width: 40px;
                height: 40px;
                border: 1px solid var(--a2);
                border-radius: 50%;
                position: fixed;
                transform: translate(-50%, -50%);
                pointer-events: none;
                z-index: 9998;
                transition: transform 0.1s ease-out, width 0.2s, height 0.2s, border-color 0.2s;
            }
            .custom-cursor.hovered {
                width: 16px;
                height: 16px;
                background-color: var(--a3);
            }
            .custom-cursor-glow.hovered {
                width: 60px;
                height: 60px;
                border-color: var(--a3);
                background-color: rgba(236, 72, 153, 0.05);
            }
        }
    `;
    document.head.appendChild(style);
}

// ==========================================================================
// 3. MOBILE MENU TOGGLE
// ==========================================================================
function initMobileNav() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-item');
    
    if (!mobileToggle || !navMenu) return;

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
}

// ==========================================================================
// 4. NAVBAR HEADER SCROLL TRIGGER & ACTIVE TRACKING
// ==========================================================================
function initScrollHeader() {
    const header = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (!header) return;

    window.addEventListener('scroll', () => {
        // Sticky Header shrink
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active section link highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        if (currentSectionId) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${currentSectionId}`) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// ==========================================================================
// 5. HERO TYPING EFFECT
// ==========================================================================
function initTypingEffect() {
    const typedTextSpan = document.getElementById('typed-text');
    if (!typedTextSpan) return;
    
    const textArray = ["RAG Systems.", "Conversational AI.", "FastAPI Backends.", "Agentic Workflows."];
    const typingSpeed = 100;
    const erasingSpeed = 60;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;
    
    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }
    
    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingSpeed + 500);
        }
    }
    
    setTimeout(type, 1000);
}

// ==========================================================================
// 6. SKILLS TAB CATEGORIES
// ==========================================================================
function initSkillsTabs() {
    const tabs = document.querySelectorAll('.skill-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const targetCategory = tab.getAttribute('data-category');
            const grids = document.querySelectorAll('.skills-grid');
            
            grids.forEach(grid => {
                grid.classList.remove('active');
                if (grid.getAttribute('id') === `skills-${targetCategory}`) {
                    grid.classList.add('active');
                    animateSkillBars(grid);
                }
            });
        });
    });
}

function animateSkillBars(gridContainer) {
    const skillBars = gridContainer.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 50);
    });
}

// ==========================================================================
// 7. SCROLL REVEAL (INTERSECTION OBSERVER)
// ==========================================================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal, .timeline-item');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                if (entry.target.classList.contains('about-skills')) {
                    const activeGrid = entry.target.querySelector('.skills-grid.active');
                    if (activeGrid) animateSkillBars(activeGrid);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        if (el.classList.contains('timeline-item')) {
            el.style.transform = 'translateX(-30px)';
        }
        
        revealObserver.observe(el);
    });

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .revealed {
            opacity: 1 !important;
            transform: translate(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);
}

// ==========================================================================
// 8. CONTACT FORM SUBMISSION & SUCCESS TOASTS
// ==========================================================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('btn-submit');
    const toastContainer = document.getElementById('toast-container');
    
    if (!form || !submitBtn || !toastContainer) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.innerHTML = `<span>Sending...</span>`;
        
        // Collect form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim(),
        };
        
        // Dynamically detect server location. If running via file:// or non-3000 local port, target the Node backend on port 3000.
        const targetUrl = window.location.protocol === 'file:' || !window.location.host.includes('3000')
            ? 'http://localhost:3000/api/contact'
            : '/api/contact';
        
        try {
            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();
            
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.innerHTML = originalBtnContent;
            
            if (data.success) {
                showToast(data.message || "Message sent successfully!");
                form.reset();
                form.querySelectorAll('input, textarea').forEach(input => input.blur());
            } else {
                showToast(data.message || "Something went wrong. Please try again.", true);
            }
        } catch (error) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.innerHTML = originalBtnContent;
            showToast("Network error. Please check your connection and try again.", true);
        }
    });
    
    function showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.className = 'toast' + (isError ? ' toast-error' : '');
        toast.innerHTML = `
            <span class="toast-icon">${isError ? '✕' : '✓'}</span>
            <span class="toast-message">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 4000);
    }
}
