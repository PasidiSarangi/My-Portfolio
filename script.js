/* ==========================================================================
   PORTFOLIO INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. MOBILE NAVIGATION MENU
    // ==========================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            mobileToggle.classList.toggle('open');
            // Toggle hamburger icon rotation
            mobileToggle.classList.contains('open')
                ? mobileToggle.style.transform = 'rotate(0)'
                : mobileToggle.style.transform = '';
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileToggle.classList.remove('open');
            });
        });
    }

    // ==========================================
    // 2. SCROLL PROGRESS BAR & ACTIVE LINK TRACKING
    // ==========================================
    const scrollProgress = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Update Scroll Progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrolled + '%';
        }

        // Active Link Highlight
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // 3. TYPING EFFECT
    // ==========================================
    const typingTextElement = document.getElementById('typing-text');
    const words = [
        { text: "I'm an IT Undergraduate at SLIIT.", append: false },
        { text: "I'm interested in UI/UX Design & Software Engineering.", append: false }
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let accumulatedText = '';

    function typeEffect() {
        if (!typingTextElement) return;

        const currentItem = words[wordIndex];
        const currentText = currentItem.text;

        if (isDeleting) {
            // Fade out the typing text smoothly instead of backspacing character-by-character
            typingTextElement.style.transition = 'opacity 0.35s ease';
            typingTextElement.style.opacity = '0';

            setTimeout(() => {
                isDeleting = false;
                accumulatedText = '';
                wordIndex = (wordIndex + 1) % words.length;
                charIndex = 0;
                typingTextElement.textContent = '';
                typingTextElement.style.opacity = '1';

                // Pause briefly in the faded-out state before typing the next sequence
                setTimeout(typeEffect, 300);
            }, 350);
            return;
        } else {
            // Type the current text character by character
            typingTextElement.textContent = accumulatedText + currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 70; // Slightly faster, more natural speed

            if (charIndex === currentText.length) {
                const nextItem = words[(wordIndex + 1) % words.length];

                if (nextItem && nextItem.append) {
                    // Pause before appending the next segment
                    typingSpeed = 800;
                    accumulatedText += currentText;
                    wordIndex = (wordIndex + 1) % words.length;
                    charIndex = 0;
                } else {
                    // Finished typing the entire sequence: pause so user can read it, then trigger fade out
                    typingSpeed = 2500;
                    isDeleting = true;
                }
            }
        }

        setTimeout(typeEffect, typingSpeed);
    }

    setTimeout(typeEffect, 500);

    // ==========================================
    // 4. INTERACTIVE CANVAS PARTICLE NETWORK
    // ==========================================
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;

        // Resize Canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 2.5 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off boundaries
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(16, 185, 129, 0.4)'; // Light Emerald green
                ctx.fill();
            }
        }

        // Initialize particles
        function initParticles() {
            particles = [];
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 13000);
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }

        // Draw connections
        function drawConnections() {
            const maxDistance = 110;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                    if (dist < maxDistance) {
                        const alpha = (1 - dist / maxDistance) * 0.15;
                        ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`; // Indigo lines
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation Loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            drawConnections();
            animationFrameId = requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();

        // Pause animation when canvas is not visible (performance optimization)
        const canvasObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!animationFrameId) animate();
                } else {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            });
        }, { threshold: 0.1 });

        canvasObserver.observe(document.getElementById('home'));
    }

    // ==========================================
    // 5. INTERACTIVE SKILLS PROGRESS ANIMATION
    // ==========================================
    const skillsSection = document.getElementById('skills');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const skillPercents = document.querySelectorAll('.skill-percent');

    if (skillsSection && skillBars.length > 0) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Fill up bars
                    skillBars.forEach((bar, index) => {
                        const target = skillPercents[index].getAttribute('data-target');
                        bar.style.width = target;
                    });

                    // Animate number count
                    skillPercents.forEach(percent => {
                        const target = parseInt(percent.getAttribute('data-target'));
                        let current = 0;
                        const increment = target / 50; // Complete count in 50 frames
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                percent.textContent = target + '%';
                                clearInterval(timer);
                            } else {
                                percent.textContent = Math.floor(current) + '%';
                            }
                        }, 20);
                    });

                    // Stop observing once animated
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        skillsObserver.observe(skillsSection);
    }

    // ==========================================
    // 6. PROJECTS CAROUSEL SLIDER
    // ==========================================
    const slider = document.querySelector('.projects-slider');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    const dotsContainer = document.querySelector('.slider-pagination');

    if (slider) {
        const getCardWidth = () => {
            const cards = slider.querySelectorAll('.project-card');
            if (cards.length === 0) return 0;
            return cards[0].offsetWidth + parseInt(window.getComputedStyle(slider).gap || '0');
        };

        const updateSliderControls = () => {
            const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

            if (prevBtn) {
                if (slider.scrollLeft <= 5) {
                    prevBtn.classList.add('disabled');
                } else {
                    prevBtn.classList.remove('disabled');
                }
            }

            if (nextBtn) {
                if (slider.scrollLeft >= maxScrollLeft - 5) {
                    nextBtn.classList.add('disabled');
                } else {
                    nextBtn.classList.remove('disabled');
                }
            }

            // Update active dot
            const cards = slider.querySelectorAll('.project-card');
            const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];
            if (cards.length > 0 && dots.length > 0) {
                const cardWidth = getCardWidth();
                const activeIndex = Math.min(dots.length - 1, Math.round(slider.scrollLeft / cardWidth));
                dots.forEach((dot, index) => {
                    if (index === activeIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                slider.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                slider.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
            });
        }

        // Initialize dots dynamically based on visible cards viewport capacity
        const buildSliderDots = () => {
            if (!dotsContainer) return;
            const cards = slider.querySelectorAll('.project-card');
            if (cards.length === 0) return;

            const cardWidth = getCardWidth();
            const visibleCards = Math.max(1, Math.round(slider.clientWidth / cardWidth));
            const totalDots = Math.max(1, cards.length - visibleCards + 1);

            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('div');
                dot.classList.add('slider-dot');
                if (i === 0) dot.classList.add('active');

                dot.addEventListener('click', () => {
                    slider.scrollTo({ left: i * getCardWidth(), behavior: 'smooth' });
                });

                dotsContainer.appendChild(dot);
            }
        };

        buildSliderDots();

        slider.addEventListener('scroll', updateSliderControls);
        window.addEventListener('resize', () => {
            buildSliderDots();
            updateSliderControls();
        });

        // Initial control check
        setTimeout(() => {
            buildSliderDots();
            updateSliderControls();
        }, 100);
    }

    // ==========================================
    // 7. SCROLL REVEAL ON VISIBILITY
    // ==========================================
    // Add reveal class to sections or cards we want to trigger
    const revealElements = document.querySelectorAll('.glass-card, .section-header, .timeline-item');
    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Trigger once
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));



    // ==========================================
    // 9. CASE STUDY MODAL INTERACTION
    // ==========================================
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modals = document.querySelectorAll('.modal-overlay');
    const modalCloses = document.querySelectorAll('.modal-close');

    if (modalTriggers.length > 0) {
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const targetId = trigger.getAttribute('data-modal-target');
                const targetModal = document.getElementById(targetId);
                if (targetModal) {
                    targetModal.classList.add('open');
                    document.body.style.overflow = 'hidden'; // Disable page scrolling
                }
            });
        });

        modalCloses.forEach(close => {
            close.addEventListener('click', () => {
                const modal = close.closest('.modal-overlay');
                if (modal) {
                    modal.classList.remove('open');
                    document.body.style.overflow = ''; // Re-enable page scrolling
                }
            });
        });

        // Close on overlay click
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('open');
                    document.body.style.overflow = '';
                }
            });
        });

        // Close on Escape key press
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modals.forEach(modal => {
                    if (modal.classList.contains('open')) {
                        modal.classList.remove('open');
                        document.body.style.overflow = '';
                    }
                });
            }
        });
    }
});
