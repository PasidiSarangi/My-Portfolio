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
        { text: 'I am a University Student.', append: false },
        { text: 'I\'m passionate about UI/UX Designing, ', append: false },
        { text: 'Software Engineering, ', append: true },
        { text: 'and Business Analysis.', append: true }
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
    // 6. PROJECTS FILTER TAB SELECTION
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                // Show/hide based on category selection
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Smooth entry fade
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    // Delay display:none to let fade finish
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        });
    });

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
    // 8. CONTACT FORM VALIDATION & MOCK SUBMIT
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit-btn');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation check
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
                showFeedback('Please fill out all fields.', 'error');
                return;
            }

            // Simulate form loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
            showFeedback('', '');

            setTimeout(() => {
                // Mock success state
                showFeedback('Thank you for reaching out! Your message was sent successfully.', 'success');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
            }, 1500);
        });

        function showFeedback(msg, status) {
            formFeedback.textContent = msg;
            formFeedback.className = 'form-feedback'; // reset
            if (status) {
                formFeedback.classList.add(status);
            }
        }
    }
});
